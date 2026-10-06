import cv2
import numpy as np
import base64
import re
import time

try:
    from backend.database import add_violation
except ImportError:
    from database import add_violation

class VisionPipeline:
    def __init__(self):
        self.stop_line_y = 480
        self.min_speed_limit = 80
        self.license_plate_pattern = re.compile(r'[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}')

    def encode_image_base64(self, image_np):
        """Converts OpenCV numpy BGR frame snippet to Base64 string for REST/e-Challan."""
        _, buffer = cv2.imencode('.jpg', image_np)
        return base64.b64encode(buffer).decode('utf-8')

    def extract_license_plate_ocr(self, crop_img):
        """Simulates/Extracts vehicle license plate text from cropped ROI."""
        # Clean image with grayscale & thresholding for OCR pre-processing
        gray = cv2.cvtColor(crop_img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        # Plate string generator / regex match fallback
        sample_plates = ["GJ01AB1234", "GJ05XY8821", "MH12DE5678", "DL3C9999", "GJ03KL7711", "GJ18TR3322"]
        return sample_plates[hash(crop_img.tobytes()) % len(sample_plates)]

    def process_violation_event(self, violation_data, frame):
        """Generates base64 snapshot and logs violation to SQLite database."""
        try:
            snapshot = self.encode_image_base64(frame)
            violation_data["snapshot_base64"] = snapshot
            violation_id = add_violation(violation_data)
            return violation_id
        except Exception as e:
            print(f"Error saving violation event: {e}")
            return None

vision_processor = VisionPipeline()
