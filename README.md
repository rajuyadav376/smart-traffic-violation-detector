# 🚦 Smart Traffic Violation Detector

An AI-powered computer vision traffic monitoring and automatic violation detection system with a real-time web dashboard.

---

## 🌟 Key Features

1. 🔴 **Red Light Jumping Detection**: Automatically detects vehicles crossing the stop line when signal state is RED.
2. 🪖 **No Helmet Detection**: Identifies two-wheeler riders operating without protective headgear.
3. 👥 **Triple Riding Detection**: Identifies motorcycles carrying more than two passengers.
4. 🚗 **Wrong-Side Driving Detection**: Calculates movement direction vectors against lane flow orientation.
5. 🅿️ **Illegal Parking Detection**: Monitors restricted zones for stationary vehicles.
6. 📱 **Mobile Phone Usage**: Detects driver posture and mobile device proximity.
7. 🚘 **Speed Violations**: Estimates vehicle speed across calibrated intersection ROI.
8. 🔢 **License Plate Recognition (ALPR / OCR)**: Reads vehicle license plate text (e.g., `GJ01AB1234`, `MH12DE5678`).
9. 🚨 **e-Challan Generator**: Instant detailed violation modal with snapshot evidence, fine calculation, and printable receipt.

---

## 🏗️ Architecture

```
                    CCTV / VIDEO STREAM
                             │
                             ▼
                    OpenCV Processing
                             │
                             ▼
                  YOLOv8 Object Detection
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
          Cars             Bikes            People
            │                │                │
            └────────────────┼────────────────┘
                             ▼
                      Violation Engine
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
      Red Light           Helmet            Wrong Side
      Detection          Detection          Detection
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                    Number Plate Detection
                             │
                             ▼
                     EasyOCR / OCR Engine
                             │
                             ▼
                      SQLite Database
                             │
                             ▼
                   FastAPI Streaming API
                             │
                             ▼
                    React Web Dashboard
```

---

## 🚀 How to Run the System

### Prerequisite
Python 3.9+ and Node.js 18+ installed on your system.

### 1️⃣ Start the Python Backend API
Open terminal / PowerShell in `backend/`:

```bash
cd "C:\Users\raju\Documents\AI-ML Project\backend"

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend endpoints:
- API Base: `http://127.0.0.1:8000`
- Interactive Swagger Docs: `http://127.0.0.1:8000/docs`
- Live MJPEG Video Stream: `http://127.0.0.1:8000/api/stream`

---

### 2️⃣ Start the React Web Dashboard
Open a second terminal / PowerShell in `frontend/`:

```bash
cd "C:\Users\raju\Documents\AI-ML Project\frontend"

# Install Node dependencies
npm install

# Run Vite development server
npm run dev
```

Open your browser at: **`http://localhost:3000`**

---

## 📁 Project Structure

```
AI-ML Project/
├── backend/
│   ├── main.py                 # FastAPI Web Server & MJPEG Stream
│   ├── vision_engine.py        # OpenCV + YOLO + OCR pipeline
│   ├── database.py             # SQLite DB manager with seed data
│   ├── demo_traffic_gen.py     # 1080p Traffic OpenCV simulator engine
│   └── requirements.txt        # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── MetricCards.jsx
│   │   │   ├── LiveCameraFeed.jsx
│   │   │   ├── SignalController.jsx
│   │   │   ├── ViolationList.jsx
│   │   │   ├── ViolationModal.jsx
│   │   │   └── AnalyticsView.jsx
│   │   ├── App.jsx             # Main Dashboard container
│   │   ├── main.jsx
│   │   └── index.css           # Custom styles & Tailwind
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```
