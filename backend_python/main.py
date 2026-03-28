from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import cv2
import numpy as np
import urllib.request
from pyzbar.pyzbar import decode
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright 

app = FastAPI()

class QRValidationRequest(BaseModel):
    image_url: str
    expected_name: str
    expected_course: str

def fetch_image_from_url(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        arr = np.asarray(bytearray(response.read()), dtype=np.uint8)
        img = cv2.imdecode(arr, -1)
        if img is None:
            raise ValueError("OpenCV could not decode the image.")
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to load image")

@app.post("/verify-qr-and-data")
def verify_qr_and_data(data: QRValidationRequest): 
    img = fetch_image_from_url(data.image_url)
    
    # --- 1. Scan for QR Code ---
    qr_data = decode(img)
    if not qr_data:
        return {"status": "Failed", "reason": "No QR code detected.", "is_verified": False}
        
    qr_url = qr_data[0].data.decode('utf-8')
    
    # --- 2. Visit the Link with a REAL Invisible Browser ---
    page_text = ""
    try:
        print(f"🌐 Launching browser to visit: {qr_url}")
        
        # 🟢 CHANGED to synchronous Playwright
        with sync_playwright() as p:
            # Launch an invisible Chromium browser
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Go to the URL and wait until all the JavaScript finishes loading
            page.goto(qr_url, wait_until="networkidle", timeout=15000)
            
            # Extract the fully rendered text from the page
            page_text = page.evaluate("document.body.innerText")
            print(page_text)
            browser.close()
            
    except Exception as e:
        print(f"❌ Browser Error: {e}")
        return {"status": "Failed", "reason": "Could not load the verification page.", "is_verified": False}

    # --- 3. Cross-Reference the Data ---
    page_text_lower = page_text.lower()
    expected_name_lower = data.expected_name.lower()
    expected_course_lower = data.expected_course.lower()
    
    name_matched = expected_name_lower in page_text_lower
    course_matched = expected_course_lower in page_text_lower
    
    if name_matched and course_matched:
        return {
            "status": "Verified",
            "reason": "QR valid and data matches perfectly.",
            "is_verified": True,
            "qr_link": qr_url
        }
    else:
        return {
            "status": "Data Mismatch",
            "reason": f"Name matched: {name_matched}. Course matched: {course_matched}.",
            "is_verified": False,
            "qr_link": qr_url
        }

