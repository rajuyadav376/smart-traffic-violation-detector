import cv2
import numpy as np
import time
import math
import random

class TrafficSimulator:
    def __init__(self, width=1280, height=720):
        self.width = width
        self.height = height
        self.signal_state = "RED" # RED, GREEN, YELLOW
        self.signal_timer = time.time()
        self.auto_signal = True
        
        # Weather & Speed simulation controls
        self.weather = "clear" # "clear", "rain", "fog"
        self.speed_multiplier = 1.0
        
        # Vehicles state
        self.vehicles = []
        self.next_vehicle_id = 101
        
        # Rain particles
        self.raindrops = [{"x": random.randint(0, width), "y": random.randint(0, height), "length": random.randint(15, 30), "speed": random.randint(12, 22)} for _ in range(80)]
        
        # Calibration boundaries
        self.stop_line_y = 480
        self.lane_left = 300
        self.lane_right = 980
        
        # Seed initial vehicles
        self.spawn_initial_vehicles()
        
    def spawn_initial_vehicles(self):
        plates = ["GJ01AB1234", "GJ05XY8821", "GJ01CD4521", "MH12DE5678", "DL3C9999", "GJ03KL7711", "GJ18TR3322", "GJ01MN4455", "GJ06BP9012"]
        types = [
            {"type": "Car", "w": 120, "h": 70, "color": (50, 150, 255)},
            {"type": "Motorcycle", "w": 60, "h": 40, "color": (0, 220, 255)},
            {"type": "Bus", "w": 180, "h": 85, "color": (255, 100, 50)},
            {"type": "Auto", "w": 80, "h": 50, "color": (0, 200, 100)}
        ]
        
        for i in range(5):
            vt = random.choice(types)
            plate = plates[i % len(plates)]
            y_pos = random.randint(100, 420)
            x_pos = random.randint(350, 850)
            
            has_no_helmet = (vt["type"] == "Motorcycle") and (random.random() < 0.4)
            has_triple = (vt["type"] == "Motorcycle") and not has_no_helmet and (random.random() < 0.3)
            is_wrong_way = random.random() < 0.15
            is_phone = (vt["type"] == "Car") and (random.random() < 0.2)
            speed = random.randint(35, 95)
            
            self.vehicles.append({
                "id": self.next_vehicle_id,
                "type": vt["type"],
                "width": vt["w"],
                "height": vt["h"],
                "color": vt["color"],
                "x": float(x_pos),
                "y": float(y_pos),
                "vx": 0 if not is_wrong_way else random.choice([-1.5, 1.5]),
                "vy": random.uniform(2.5, 5.0) * (-1.0 if is_wrong_way else 1.0),
                "plate": plate,
                "speed": speed,
                "no_helmet": has_no_helmet,
                "triple_riding": has_triple,
                "wrong_side": is_wrong_way,
                "phone_use": is_phone,
                "parked": False,
                "crossed_stop_line": False,
                "violation_logged": set()
            })
            self.next_vehicle_id += 1

    def spawn_custom_vehicle(self, violation_type):
        plates = ["GJ01SP9999", "GJ05NO8811", "GJ01TR3344", "MH12WS7766", "DL3CRed001"]
        plate = random.choice(plates)
        
        if violation_type == "Speeding":
            v = {
                "id": self.next_vehicle_id, "type": "Car", "width": 120, "height": 70, "color": (0, 0, 255),
                "x": float(random.randint(400, 700)), "y": -80.0, "vx": 0, "vy": 8.0,
                "plate": plate, "speed": 110, "no_helmet": False, "triple_riding": False,
                "wrong_side": False, "phone_use": False, "parked": False, "crossed_stop_line": False, "violation_logged": set()
            }
        elif violation_type == "No Helmet":
            v = {
                "id": self.next_vehicle_id, "type": "Motorcycle", "width": 60, "height": 40, "color": (0, 220, 255),
                "x": float(random.randint(400, 700)), "y": -80.0, "vx": 0, "vy": 4.5,
                "plate": plate, "speed": 50, "no_helmet": True, "triple_riding": False,
                "wrong_side": False, "phone_use": False, "parked": False, "crossed_stop_line": False, "violation_logged": set()
            }
        elif violation_type == "Triple Riding":
            v = {
                "id": self.next_vehicle_id, "type": "Motorcycle", "width": 60, "height": 40, "color": (255, 100, 0),
                "x": float(random.randint(400, 700)), "y": -80.0, "vx": 0, "vy": 4.0,
                "plate": plate, "speed": 45, "no_helmet": False, "triple_riding": True,
                "wrong_side": False, "phone_use": False, "parked": False, "crossed_stop_line": False, "violation_logged": set()
            }
        elif violation_type == "Wrong Side":
            v = {
                "id": self.next_vehicle_id, "type": "Car", "width": 120, "height": 70, "color": (150, 0, 200),
                "x": float(random.randint(400, 700)), "y": float(self.height + 50), "vx": 1.0, "vy": -5.0,
                "plate": plate, "speed": 65, "no_helmet": False, "triple_riding": False,
                "wrong_side": True, "phone_use": False, "parked": False, "crossed_stop_line": False, "violation_logged": set()
            }
        else: # Red Light Jump
            self.signal_state = "RED"
            v = {
                "id": self.next_vehicle_id, "type": "Car", "width": 120, "height": 70, "color": (50, 50, 255),
                "x": float(random.randint(400, 700)), "y": 250.0, "vx": 0, "vy": 6.0,
                "plate": plate, "speed": 75, "no_helmet": False, "triple_riding": False,
                "wrong_side": False, "phone_use": False, "parked": False, "crossed_stop_line": False, "violation_logged": set()
            }
            
        self.vehicles.append(v)
        self.next_vehicle_id += 1
        return v["id"]

    def toggle_signal(self, state=None):
        if state in ["RED", "GREEN", "YELLOW"]:
            self.signal_state = state
            self.auto_signal = False
        else:
            states = ["RED", "GREEN", "YELLOW"]
            idx = (states.index(self.signal_state) + 1) % len(states)
            self.signal_state = states[idx]
        self.signal_timer = time.time()

    def update(self):
        if self.auto_signal and (time.time() - self.signal_timer > 12):
            if self.signal_state == "RED":
                self.signal_state = "GREEN"
            elif self.signal_state == "GREEN":
                self.signal_state = "YELLOW"
            else:
                self.signal_state = "RED"
            self.signal_timer = time.time()
            
        active_violations = []
        
        for v in self.vehicles:
            should_stop = (self.signal_state == "RED") and (v["y"] + v["height"] >= self.stop_line_y - 60) and (v["y"] < self.stop_line_y) and not v["wrong_side"]
            will_jump = (v["id"] % 3 == 0) or ("Red Light" in str(v.get("plate")))
            
            if should_stop and not will_jump:
                v["vy"] = max(0.0, v["vy"] - 0.2 * self.speed_multiplier)
            else:
                if v["vy"] < 2.0 and not v["wrong_side"]:
                    v["vy"] += 0.2 * self.speed_multiplier
                    
            v["x"] += v["vx"] * self.speed_multiplier
            v["y"] += v["vy"] * self.speed_multiplier
            
            # Check Red Light Jump
            if self.signal_state == "RED" and (v["y"] >= self.stop_line_y) and not v["crossed_stop_line"]:
                v["crossed_stop_line"] = True
                if "Red Light Jump" not in v["violation_logged"]:
                    v["violation_logged"].add("Red Light Jump")
                    active_violations.append({
                        "violation_type": "Red Light Jump",
                        "vehicle_number": v["plate"],
                        "vehicle_type": v["type"],
                        "confidence": 0.94,
                        "location": "SG Highway Intersection, Ahmedabad",
                        "fine_amount": 1000,
                        "speed": int(v["speed"])
                    })
                    
            # Check Wrong-Side Driving
            if v["wrong_side"] and "Wrong Side Driving" not in v["violation_logged"] and v["y"] > 200:
                v["violation_logged"].add("Wrong Side Driving")
                active_violations.append({
                    "violation_type": "Wrong Side Driving",
                    "vehicle_number": v["plate"],
                    "vehicle_type": v["type"],
                    "confidence": 0.89,
                    "location": "SG Highway Intersection, Ahmedabad",
                    "fine_amount": 1500,
                    "speed": int(v["speed"])
                })

            # Check Speeding
            if v["speed"] > 80 and "Speeding" not in v["violation_logged"] and v["y"] > 250:
                v["violation_logged"].add("Speeding")
                active_violations.append({
                    "violation_type": "Speeding",
                    "vehicle_number": v["plate"],
                    "vehicle_type": v["type"],
                    "confidence": 0.96,
                    "location": "SG Highway Intersection, Ahmedabad",
                    "fine_amount": 2000,
                    "speed": int(v["speed"])
                })

            # Check Rider Helmet
            if v["no_helmet"] and "No Helmet" not in v["violation_logged"] and v["y"] > 300:
                v["violation_logged"].add("No Helmet")
                active_violations.append({
                    "violation_type": "No Helmet",
                    "vehicle_number": v["plate"],
                    "vehicle_type": v["type"],
                    "confidence": 0.91,
                    "location": "SG Highway Intersection, Ahmedabad",
                    "fine_amount": 500,
                    "speed": int(v["speed"])
                })
                
            # Check Triple Riding
            if v["triple_riding"] and "Triple Riding" not in v["violation_logged"] and v["y"] > 320:
                v["violation_logged"].add("Triple Riding")
                active_violations.append({
                    "violation_type": "Triple Riding",
                    "vehicle_number": v["plate"],
                    "vehicle_type": v["type"],
                    "confidence": 0.93,
                    "location": "SG Highway Intersection, Ahmedabad",
                    "fine_amount": 1000,
                    "speed": int(v["speed"])
                })

        # Remove out of bounds vehicles & respawn
        self.vehicles = [v for v in self.vehicles if -120 <= v["y"] <= self.height + 120]
        
        target_count = 6 if self.weather != "fog" else 4
        while len(self.vehicles) < target_count:
            plates = ["GJ01AB1234", "GJ05XY8821", "GJ01CD4521", "MH12DE5678", "DL3C9999", "GJ03KL7711", "GJ18TR3322", "GJ01MN4455"]
            types = [
                {"type": "Car", "w": 120, "h": 70, "color": (50, 150, 255)},
                {"type": "Motorcycle", "w": 60, "h": 40, "color": (0, 220, 255)},
                {"type": "Bus", "w": 180, "h": 85, "color": (255, 100, 50)}
            ]
            vt = random.choice(types)
            plate = random.choice(plates)
            
            is_wrong = random.random() < 0.2
            has_no_h = (vt["type"] == "Motorcycle") and (random.random() < 0.45)
            has_trip = (vt["type"] == "Motorcycle") and not has_no_h and (random.random() < 0.35)
            
            self.vehicles.append({
                "id": self.next_vehicle_id,
                "type": vt["type"],
                "width": vt["w"],
                "height": vt["h"],
                "color": vt["color"],
                "x": float(random.randint(350, 850)),
                "y": -100.0 if not is_wrong else float(self.height + 50),
                "vx": 0 if not is_wrong else random.choice([-1.0, 1.0]),
                "vy": random.uniform(3.0, 6.0) if not is_wrong else -4.0,
                "plate": plate,
                "speed": random.randint(40, 95),
                "no_helmet": has_no_h,
                "triple_riding": has_trip,
                "wrong_side": is_wrong,
                "phone_use": False,
                "parked": False,
                "crossed_stop_line": False,
                "violation_logged": set()
            })
            self.next_vehicle_id += 1
            
        return active_violations

    def draw_frame(self):
        frame = np.zeros((self.height, self.width, 3), dtype=np.uint8)
        
        # Base Road Asphalt Color according to Weather
        if self.weather == "fog":
            frame[:, :] = (15, 20, 25) # Dark Cyber Night Fog
        elif self.weather == "rain":
            frame[:, :] = (25, 30, 35) # Wet Asphalt
        else:
            frame[:, :] = (35, 38, 42) # Clear Day
            
        # Sidewalk
        frame[:, :250] = (20, 22, 25)
        frame[:, 1030:] = (20, 22, 25)
        
        # Yellow lane dividers
        cv2.line(frame, (250, 0), (250, self.height), (0, 255, 255), 4)
        cv2.line(frame, (1030, 0), (1030, self.height), (0, 255, 255), 4)
        
        # Center lane dashed white markings
        lane_x1, lane_x2 = 510, 770
        for y in range(0, self.height, 40):
            cv2.line(frame, (lane_x1, y), (lane_x1, y + 20), (200, 200, 200), 2)
            cv2.line(frame, (lane_x2, y), (lane_x2, y + 20), (200, 200, 200), 2)
            
        # Pedestrian Zebra Crossing Line
        for x in range(250, 1030, 60):
            cv2.rectangle(frame, (x, self.stop_line_y + 15), (x + 35, self.stop_line_y + 45), (220, 220, 220), -1)
            
        # STOP LINE
        stop_line_color = (0, 0, 255) if self.signal_state == "RED" else (255, 255, 255)
        cv2.line(frame, (250, self.stop_line_y), (1030, self.stop_line_y), stop_line_color, 6)
        cv2.putText(frame, "STOP LINE", (260, self.stop_line_y - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.6, stop_line_color, 2)
        
        # Traffic Signal Box
        sig_box_x, sig_box_y = 1080, 60
        cv2.rectangle(frame, (sig_box_x, sig_box_y), (sig_box_x + 90, sig_box_y + 220), (20, 20, 20), -1)
        cv2.rectangle(frame, (sig_box_x, sig_box_y), (sig_box_x + 90, sig_box_y + 220), (100, 100, 100), 3)
        
        red_col = (0, 0, 255) if self.signal_state == "RED" else (40, 40, 80)
        yel_col = (0, 255, 255) if self.signal_state == "YELLOW" else (40, 80, 80)
        grn_col = (0, 255, 0) if self.signal_state == "GREEN" else (40, 80, 40)
        
        cv2.circle(frame, (sig_box_x + 45, sig_box_y + 40), 26, red_col, -1)
        cv2.circle(frame, (sig_box_x + 45, sig_box_y + 110), 26, yel_col, -1)
        cv2.circle(frame, (sig_box_x + 45, sig_box_y + 180), 26, grn_col, -1)
        cv2.putText(frame, f"SIGNAL: {self.signal_state}", (sig_box_x - 30, sig_box_y + 250), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Vehicles & AI Bounding Boxes
        for v in self.vehicles:
            x, y, w, h = int(v["x"]), int(v["y"]), v["width"], v["height"]
            has_violation = len(v["violation_logged"]) > 0
            box_color = (0, 0, 255) if has_violation else (0, 255, 120)
            
            # Headlight Beams in Fog/Night Mode
            if self.weather in ["fog", "rain"]:
                cv2.ellipse(frame, (x + w // 2, y + h + 30), (40, 60), 0, 0, 180, (255, 255, 200), -1)
                
            cv2.rectangle(frame, (x, y), (x + w, y + h), v["color"], -1)
            cv2.rectangle(frame, (x + 5, y + 5), (x + w - 5, y + h - 5), (10, 10, 10), 2)
            
            if v["type"] == "Motorcycle":
                head_color = (0, 255, 0) if not v["no_helmet"] else (0, 0, 255)
                cv2.circle(frame, (x + w // 2, y + 10), 10, head_color, -1)
                if v["triple_riding"]:
                    cv2.circle(frame, (x + w // 2 - 12, y + 10), 8, (0, 0, 255), -1)
                    cv2.circle(frame, (x + w // 2 + 12, y + 10), 8, (0, 0, 255), -1)

            cv2.rectangle(frame, (x - 8, y - 8), (x + w + 8, y + h + 8), box_color, 2)
            
            violation_str = f" | {list(v['violation_logged'])[0]}" if v["violation_logged"] else ""
            tag = f"{v['type']} ({v['plate']}){violation_str}"
            
            (tw, th), _ = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
            cv2.rectangle(frame, (x - 8, y - 30), (x - 8 + tw + 10, y - 8), box_color, -1)
            cv2.putText(frame, tag, (x - 4, y - 14), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame, f"{v['speed']} km/h", (x, y + h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 255, 200), 1)

        # Weather Animation Layer (Raindrops)
        if self.weather == "rain":
            for drop in self.raindrops:
                cv2.line(frame, (drop["x"], drop["y"]), (drop["x"] - 2, drop["y"] + drop["length"]), (200, 230, 255), 1)
                drop["y"] += drop["speed"]
                if drop["y"] > self.height:
                    drop["y"] = 0
                    drop["x"] = random.randint(0, self.width)
                    
        elif self.weather == "fog":
            fog_overlay = np.full((self.height, self.width, 3), 100, dtype=np.uint8)
            frame = cv2.addWeighted(frame, 0.75, fog_overlay, 0.25, 0)

        # HUD Header
        cv2.rectangle(frame, (20, 20), (480, 115), (15, 20, 28), -1)
        cv2.rectangle(frame, (20, 20), (480, 115), (0, 220, 255), 1)
        
        cv2.putText(frame, "SMART TRAFFIC AI DETECTOR 2.0", (35, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 220, 255), 2)
        cv2.putText(frame, f"FPS: 30 | WEATHER: {self.weather.upper()} | SPEED: {self.speed_multiplier}x", (35, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
        cv2.putText(frame, "LOCATION: SG HIGHWAY JUNCTION (AHMEDABAD)", (35, 96), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (150, 180, 200), 1)

        return frame

if __name__ == "__main__":
    sim = TrafficSimulator()
    print("Traffic Simulator updated successfully!")
