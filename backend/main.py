import time
import cv2
import asyncio
import io
import csv
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse, Response
from pydantic import BaseModel
from typing import Optional

try:
    from backend.database import (
        init_db,
        get_violations,
        get_violation_by_id,
        get_stats,
        add_violation,
        pay_violation
    )
    from backend.demo_traffic_gen import TrafficSimulator
    from backend.vision_engine import vision_processor
except ImportError:
    from database import (
        init_db,
        get_violations,
        get_violation_by_id,
        get_stats,
        add_violation,
        pay_violation
    )
    from demo_traffic_gen import TrafficSimulator
    from vision_engine import vision_processor

# Initialize DB
init_db()

# Create FastAPI app
app = FastAPI(
    title="Smart Traffic Violation Detector API",
    description="AI Computer Vision Traffic Monitoring & Violation Enforcement System",
    version="2.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize live traffic simulation engine
simulator = TrafficSimulator()

class SignalToggleRequest(BaseModel):
    state: Optional[str] = None # RED, GREEN, YELLOW

class SimulationConfigRequest(BaseModel):
    weather: Optional[str] = "clear" # clear, rain, fog
    speed_multiplier: Optional[float] = 1.0

class SpawnVehicleRequest(BaseModel):
    violation_type: str # Speeding, No Helmet, Triple Riding, Wrong Side, Red Light Jump

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse, Response

dist_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

@app.get("/api/health")
@app.get("/healthz")
def health_check():
    return {"status": "ok", "system": "Smart Traffic AI Detector"}

if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

    @app.get("/")
    def root():
        index_file = os.path.join(dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"system": "Smart Traffic AI Detector", "status": "ONLINE"}
else:
    @app.get("/")
    def root():
        return {
            "system": "Smart Traffic AI Detector",
            "status": "ONLINE",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }

@app.get("/api/stats")
def fetch_stats():
    return get_stats()

@app.get("/api/violations")
def fetch_violations(
    violation_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50),
    offset: int = Query(0)
):
    results = get_violations(violation_type=violation_type, search=search, limit=limit, offset=offset)
    return {
        "count": len(results),
        "data": results
    }

@app.get("/api/violations/{violation_id}")
def fetch_violation_detail(violation_id: str):
    item = get_violation_by_id(violation_id)
    if not item:
        raise HTTPException(status_code=404, detail="Violation record not found")
    return item

@app.post("/api/violations/{violation_id}/pay")
def process_fine_payment(violation_id: str):
    success = pay_violation(violation_id)
    return {
        "status": "success",
        "message": f"e-Challan fine for ticket {violation_id} paid successfully!",
        "violation_id": violation_id
    }

@app.get("/api/violations/export/csv")
def export_violations_csv():
    violations = get_violations(limit=1000)
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["Violation ID", "License Plate", "Vehicle Type", "Violation Type", "Confidence", "Timestamp", "Location", "Fine (INR)", "Status", "Speed (km/h)"])
    for v in violations:
        writer.writerow([v["violation_id"], v["vehicle_number"], v["vehicle_type"], v["violation_type"], v["confidence"], v["timestamp"], v["location"], v["fine_amount"], v["status"], v["speed"]])
        
    return Response(content=output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=traffic_violations.csv"})

@app.post("/api/signal/toggle")
def toggle_traffic_signal(req: SignalToggleRequest):
    simulator.toggle_signal(req.state)
    return {
        "status": "success",
        "signal_state": simulator.signal_state
    }

@app.post("/api/simulation/config")
def update_simulation_config(req: SimulationConfigRequest):
    if req.weather in ["clear", "rain", "fog"]:
        simulator.weather = req.weather
    if req.speed_multiplier and 0.2 <= req.speed_multiplier <= 3.0:
        simulator.speed_multiplier = req.speed_multiplier
    return {
        "status": "success",
        "weather": simulator.weather,
        "speed_multiplier": simulator.speed_multiplier
    }

@app.post("/api/simulation/spawn")
def spawn_custom_vehicle_violation(req: SpawnVehicleRequest):
    v_id = simulator.spawn_custom_vehicle(req.violation_type)
    return {
        "status": "success",
        "vehicle_id": v_id,
        "spawned_violation": req.violation_type
    }

def generate_video_stream():
    """Generates continuous MJPEG video stream with live AI detection overlays."""
    while True:
        new_violations = simulator.update()
        frame = simulator.draw_frame()
        
        for v in new_violations:
            vision_processor.process_violation_event(v, frame)
            
        _, jpeg = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        frame_bytes = jpeg.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
               
        time.sleep(0.033) # ~30 FPS

@app.get("/api/stream")
def video_feed():
    return StreamingResponse(
        generate_video_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
