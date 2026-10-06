# 🚦 Smart Traffic Violation Detector

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-ONLINE-00f0ff?style=for-the-badge&logo=fastapi)](https://smart-traffic-violation-detector-production.up.railway.app)
[![GitHub License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg?style=for-the-badge&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18-cyan.svg?style=for-the-badge&logo=react)](https://react.dev)

> **AI-Powered Computer Vision Traffic Monitoring & Cyberpunk Enforcement Command Center**

🌐 **Live Website Link**: [https://smart-traffic-violation-detector-production.up.railway.app](https://smart-traffic-violation-detector-production.up.railway.app)

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
9. 🚨 **e-Challan Generator & Payment**: Instant detailed violation modal with snapshot evidence, fine calculation, and demo UPI payment.
10. 📡 **2D Radar Scanner & Audio Siren**: Live sweeping radar target tracker and Web Audio API synthesized warning siren.

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

## 🚀 How to Run Locally

### 1️⃣ Start the Python Backend API
```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8080 --reload
```

### 2️⃣ Start the React Web Dashboard
```powershell
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:3000`**
