import sqlite3
import os
import time
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "traffic_violations.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS violations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        violation_id TEXT UNIQUE NOT NULL,
        vehicle_number TEXT NOT NULL,
        vehicle_type TEXT NOT NULL,
        violation_type TEXT NOT NULL,
        confidence REAL NOT NULL,
        timestamp TEXT NOT NULL,
        location TEXT NOT NULL,
        fine_amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        snapshot_base64 TEXT,
        speed INTEGER DEFAULT 0
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS camera_feeds (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL,
        active_violations_count INTEGER DEFAULT 0
    )
    """)

    conn.commit()
    conn.close()
    
    # Check if empty, seed default data
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM violations")
    count = cursor.fetchone()[0]
    conn.close()
    
    if count == 0:
        seed_data()

def seed_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    sample_violations = [
        ("VIO-9821", "GJ01AB1234", "Car", "Red Light Jump", 0.94, "2026-10-06 21:08:32", "SG Highway Junction, Ahmedabad", 1000, "Pending", 65),
        ("VIO-9822", "GJ05XY8821", "Motorcycle", "No Helmet", 0.91, "2026-10-06 21:05:10", "MG Road Crossway, Surat", 500, "Pending", 42),
        ("VIO-9823", "GJ01CD4521", "Car", "Wrong Side Driving", 0.88, "2026-10-06 21:01:45", "SG Highway Junction, Ahmedabad", 1500, "Verified", 55),
        ("VIO-9824", "MH12DE5678", "Motorcycle", "Triple Riding", 0.93, "2026-10-06 20:55:18", "Ring Road Flyover, Vadodara", 1000, "Pending", 38),
        ("VIO-9825", "DL3C9999", "Car", "Speeding", 0.96, "2026-10-06 20:48:02", "Express Highway Line 2, Gandhinagar", 2000, "Pending", 98),
        ("VIO-9826", "GJ03KL7711", "Car", "Mobile Phone Use", 0.87, "2026-10-06 20:41:20", "CG Road Circle, Ahmedabad", 1000, "Pending", 30),
        ("VIO-9827", "GJ18TR3322", "Auto", "Illegal Parking", 0.92, "2026-10-06 20:30:15", "Railway Station Road, Ahmedabad", 500, "Paid", 0),
        ("VIO-9828", "GJ01MN4455", "Motorcycle", "No Helmet", 0.89, "2026-10-06 20:15:00", "SG Highway Junction, Ahmedabad", 500, "Pending", 45)
    ]
    
    for v in sample_violations:
        cursor.execute("""
        INSERT INTO violations 
        (violation_id, vehicle_number, vehicle_type, violation_type, confidence, timestamp, location, fine_amount, status, speed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, v)
        
    cameras = [
        ("CAM-01", "SG Highway Intersection", "Ahmedabad", "ONLINE", 14),
        ("CAM-02", "MG Road Junction", "Surat", "ONLINE", 8),
        ("CAM-03", "Ring Road Flyover", "Vadodara", "ONLINE", 5)
    ]
    
    for c in cameras:
        cursor.execute("INSERT INTO camera_feeds (id, name, location, status, active_violations_count) VALUES (?, ?, ?, ?, ?)", c)
        
    conn.commit()
    conn.close()

def add_violation(violation_dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    violation_id = violation_dict.get("violation_id") or f"VIO-{int(time.time()*1000) % 100000}"
    timestamp = violation_dict.get("timestamp") or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute("""
    INSERT INTO violations (
        violation_id, vehicle_number, vehicle_type, violation_type, confidence,
        timestamp, location, fine_amount, status, snapshot_base64, speed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        violation_id,
        violation_dict.get("vehicle_number", "GJ01AB1234"),
        violation_dict.get("vehicle_type", "Car"),
        violation_dict.get("violation_type", "Red Light Jump"),
        violation_dict.get("confidence", 0.90),
        timestamp,
        violation_dict.get("location", "Ahmedabad Junction"),
        violation_dict.get("fine_amount", 1000),
        violation_dict.get("status", "Pending"),
        violation_dict.get("snapshot_base64", ""),
        violation_dict.get("speed", 0)
    ))
    
    conn.commit()
    conn.close()
    return violation_id

def get_violations(violation_type=None, search=None, limit=50, offset=0):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM violations WHERE 1=1"
    params = []
    
    if violation_type and violation_type != "All":
        query += " AND violation_type = ?"
        params.append(violation_type)
        
    if search:
        query += " AND (vehicle_number LIKE ? OR location LIKE ? OR violation_id LIKE ?)"
        s = f"%{search}%"
        params.extend([s, s, s])
        
    query += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    
    cursor.execute(query, params)
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

def get_violation_by_id(violation_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM violations WHERE violation_id = ?", (violation_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def pay_violation(violation_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE violations SET status = 'Paid' WHERE violation_id = ?", (violation_id,))
    conn.commit()
    conn.close()
    return True

def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM violations")
    total_violations = cursor.fetchone()[0]
    
    cursor.execute("SELECT violation_type, COUNT(*) as count FROM violations GROUP BY violation_type")
    type_counts = {row["violation_type"]: row["count"] for row in cursor.fetchall()}
    
    cursor.execute("SELECT SUM(fine_amount) FROM violations WHERE status = 'Paid'")
    fines_collected = cursor.fetchone()[0] or 0
    
    conn.close()
    
    return {
        "total_vehicles": 12483 + total_violations * 12,
        "total_violations": total_violations,
        "red_light": type_counts.get("Red Light Jump", 0),
        "no_helmet": type_counts.get("No Helmet", 0),
        "wrong_side": type_counts.get("Wrong Side Driving", 0),
        "triple_riding": type_counts.get("Triple Riding", 0),
        "speeding": type_counts.get("Speeding", 0),
        "mobile_use": type_counts.get("Mobile Phone Use", 0),
        "illegal_parking": type_counts.get("Illegal Parking", 0),
        "fines_collected": fines_collected
    }

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully with sample violations!")
