# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import cv2
# import numpy as np
# import urllib.request
# import re 
# # from pyzbar.pyzbar import decode
# from playwright.sync_api import sync_playwright
# # import easyocr 
# import pytesseract
# from urlextract import URLExtract
# import os
# # pytesseract.pytesseract.tesseract_cmd = r"C:\Users\Nitin\Documents\GitHub\AI-Powered-Certificate-Authentication-For-Recruitment\tesseract.exe"
# # base_dir = os.path.dirname(os.path.abspath(__file__))
# # pytesseract.pytesseract.tesseract_cmd = os.path.join(base_dir, "tesseract.exe")
# # pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"

# app = FastAPI()

# # print("Loading EasyOCR AI model... (This takes a few seconds)")
# # # reader = easyocr.Reader(['en'], gpu=False)
# # reader = None
# # print("✅ EasyOCR loaded and ready!")

# print("Loading URLExtract...")
# url_extractor = URLExtract()

# class ValidationRequest(BaseModel):
#     image_url: str
#     institution_email: str
#     pdf_url: str

# def fetch_image_from_url(url):
#     try:
#         req = urllib.request.Request(
#             url,
#             headers={'User-Agent': 'Mozilla/5.0'}
#         )

#         response = urllib.request.urlopen(req)

#         arr = np.asarray(
#             bytearray(response.read()),
#             dtype=np.uint8
#         )

#         img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

#         if img is None:
#             raise ValueError("Could not decode image")

#         gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#         gray_img = cv2.GaussianBlur(gray_img, (3,3), 0)

#         _, gray_img = cv2.threshold(
#             gray_img,
#             0,
#             255,
#             cv2.THRESH_BINARY + cv2.THRESH_OTSU
#         )

#         large_img = cv2.resize(
#             gray_img,
#             None,
#             fx=2,
#             fy=2,
#             interpolation=cv2.INTER_CUBIC
#         )

#         return large_img

#     except Exception as e:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Failed to fetch image: {str(e)}"
#         )

# def get_word_set(text):
#     """Cleans text and returns a set of unique, meaningful words (3+ letters)"""
#     words = re.findall(r'\b[a-z]{3,}\b', text.lower())
#     stop_words = {"the", "and", "for", "with", "this", "that", "has", "been"}
#     return set(w for w in words if w not in stop_words)

# def clean_url(url):
#     url = url.strip()

#     # Fix protocol
#     url = url.replace("https:/", "https://")
#     url = url.replace("http:/", "http://")

#     # Fix missing 'www.'
#     if "mygreatlearning.com" in url and "www." not in url:
#         url = url.replace("https://", "https://www.")

#     return url

# @app.post("/verify-qr-and-data")
# def verify_qr_and_data(data: ValidationRequest):
#     # global reader

#     # if reader is None:
#     #     print("Loading EasyOCR model...")
#     #     reader = easyocr.Reader(['en'], gpu=False)
    
#     img = fetch_image_from_url(data.image_url)
    
#     # --- 1. Extract Text using EasyOCR ---
#     # detail=0 returns a simple list of strings instead of complex bounding box coordinates
#     # reader = None

#     # def get_reader():
#     #     global reader
#     #     if reader is None:
#     #         reader = easyocr.Reader(['en'], gpu=False)
#     #     return reader

#     # reader_instance = get_reader()
#     cert_text = pytesseract.image_to_string(
#         img,
#         config="--oem 3 --psm 6"
#     )

#     cert_text = clean_url(cert_text)

#     cert_words = get_word_set(cert_text)

#     cert_text_string = cert_text
#     if len(cert_words) == 0:
#         return {"status": "Failed", "reason": "Could not read any text from the certificate image.", "is_verified": False}

#     print(f"URL Text:", cert_text_string)
#     # --- 2. Scan for QR Code and URL in certificate---
#     # qr_data = decode(img)
#     # qr_url = None
#     # if len(qr_data) > 0:
#     #     qr_url = qr_data[0].data.decode('utf-8')
#     #     print(f"Found URL via QR Code: {qr_url}")
#     detector = cv2.QRCodeDetector()

#     qr_url = None
#     data, bbox, _ = detector.detectAndDecode(img)

#     if data:
#         qr_url = data
#         print(f"Found URL via QR Code: {qr_url}")
#     else:
#         found_urls = url_extractor.find_urls(cert_text_string)
#         if len(found_urls) > 0:
#             qr_url = found_urls[0] # Grab the first URL found
            
#             # Safely add https:// if the printed link was missing it (e.g. Great Learning)
#             if not qr_url.startswith('http'):
#                 qr_url = 'https://' + qr_url
                
#             print(f"✅ Found URL via urlextract: {qr_url}")
    
#     if qr_url:
#         # --- 3. Scrape the Verification Webpage ---
#         page_text = ""
#         try:
#             with sync_playwright() as p:
#                 browser = p.chromium.launch(headless=True)
#                 page = browser.new_page()
#                 page.goto(qr_url, wait_until="networkidle", timeout=15000)
#                 page_text = page.evaluate("document.body.innerText")
#                 browser.close()
#         except Exception as e:
#             return {"status": "Failed", "reason": "Could not load the verification webpage.", "is_verified": False}

#         # --- 4. Compare the Two Texts ---
#         page_words = get_word_set(page_text)
#         matching_words = cert_words.intersection(page_words)
        
#         # print(page_words)
#         # print(cert_words)
#         # Calculate the percentage
#         match_percentage = (len(matching_words) / len(cert_words)) * 100
#         is_verified = match_percentage >= 10.00 and qr_url is not None

#         return {
#             "status": "Verified" if is_verified else "Data Mismatch",
#             "match_percentage": round(match_percentage, 2),
#             "matched_words_count": len(matching_words),
#             "total_cert_words": len(cert_words),
#             "reason": f"Matched {round(match_percentage, 2)}% of words between certificate and website.",
#             "is_verified": is_verified,
#             "qr_link": qr_url
#         }
#     else:
#         print("🔍 Executing Path B: No links found. Forwarding URL to Node.js for clean download...")
    
#         import requests
        
#         # Updated endpoint that expects a JSON URL payload instead of a file
#         node_backend_url = "https://ai-powered-certificate-authentication.onrender.com/api/institution/verify-pdf-url"
        
#         payload = {
#             "email": data.institution_email,
#             "certificateUrl": data.pdf_url
#         }
        
#         try:
#             # Fire a clean JSON POST request
#             node_response = requests.post(node_backend_url, json=payload)

#             node_data = node_response.json()

#             return node_data
            
#         except Exception as e:
#             return {
#                 "success": False,
#                 "status": "Error",
#                 "message": f"Failed to communicate with Node.js router: {str(e)}"
#             }

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import cv2
import numpy as np
import urllib.request
import re
import pytesseract
from playwright.sync_api import sync_playwright
from urlextract import URLExtract
import requests

app = FastAPI()

print("Loading URLExtract...")
url_extractor = URLExtract()

# Uncomment for local Windows testing
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

class ValidationRequest(BaseModel):
    image_url: str
    institution_email: str
    pdf_url: str


def fetch_image_from_url(url):
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0"}
        )

        response = urllib.request.urlopen(req)

        arr = np.asarray(
            bytearray(response.read()),
            dtype=np.uint8
        )

        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Could not decode image")

        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        gray_img = cv2.GaussianBlur(gray_img, (3, 3), 0)

        _, gray_img = cv2.threshold(
            gray_img,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )

        large_img = cv2.resize(
            gray_img,
            None,
            fx=2,
            fy=2,
            interpolation=cv2.INTER_CUBIC
        )

        return large_img

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch image: {str(e)}"
        )


def get_word_set(text):
    words = re.findall(r'\b[a-z]{3,}\b', text.lower())

    stop_words = {
        "the", "and", "for", "with",
        "this", "that", "has", "been"
    }

    return set(
        word for word in words
        if word not in stop_words
    )


def clean_url(url):
    url = url.strip()

    url = url.replace("https:/", "https://")
    url = url.replace("http:/", "http://")

    if "mygreatlearning.com" in url and "www." not in url:
        url = url.replace("https://", "https://www.")

    return url


@app.get("/")
def home():
    return {
        "status": "running",
        "message": "Certificate Verification API"
    }


@app.post("/verify-qr-and-data")
def verify_qr_and_data(data: ValidationRequest):

    img = fetch_image_from_url(data.image_url)

    # OCR using Tesseract
    cert_text = pytesseract.image_to_string(
        img,
        config="--oem 3 --psm 6"
    )

    cert_text = clean_url(cert_text)

    cert_words = get_word_set(cert_text)

    if len(cert_words) == 0:
        return {
            "status": "Failed",
            "reason": "Could not read any text from certificate image.",
            "is_verified": False
        }

    print("OCR TEXT:")
    print(cert_text)

    # QR Detection
    detector = cv2.QRCodeDetector()

    qr_url = None

    qr_data, bbox, _ = detector.detectAndDecode(img)

    if qr_data:
        qr_url = qr_data
        print(f"QR URL Found: {qr_url}")

    else:
        found_urls = url_extractor.find_urls(cert_text)

        if len(found_urls) > 0:
            qr_url = found_urls[0]

            if not qr_url.startswith("http"):
                qr_url = "https://" + qr_url

            print(f"URL Found in OCR Text: {qr_url}")

    # Path A - Verification URL Found
    if qr_url:

        try:
            with sync_playwright() as p:

                browser = p.chromium.launch(
                    headless=True,
                    args=["--no-sandbox"]
                )

                page = browser.new_page()

                page.goto(
                    qr_url,
                    wait_until="domcontentloaded",
                    timeout=15000
                )

                page_text = page.evaluate(
                    "document.body.innerText"
                )

                browser.close()

        except Exception as e:
            return {
                "status": "Failed",
                "reason": f"Could not load verification page: {str(e)}",
                "is_verified": False
            }

        page_words = get_word_set(page_text)

        matching_words = cert_words.intersection(page_words)

        match_percentage = (
            len(matching_words) / len(cert_words)
        ) * 100

        is_verified = match_percentage >= 10

        return {
            "status": "Verified" if is_verified else "Data Mismatch",
            "match_percentage": round(match_percentage, 2),
            "matched_words_count": len(matching_words),
            "total_cert_words": len(cert_words),
            "reason": f"Matched {round(match_percentage,2)}% of words.",
            "is_verified": is_verified,
            "qr_link": qr_url
        }

    # Path B - No URL Found
    else:

        print("No URL found. Forwarding to Node Backend.")

        node_backend_url = (
            "https://ai-powered-certificate-authentication.onrender.com/api/institution/verify-pdf-url"
        )

        payload = {
            "email": data.institution_email,
            "certificateUrl": data.pdf_url
        }

        try:
            response = requests.post(
                node_backend_url,
                json=payload,
                timeout=60
            )

            return response.json()

        except Exception as e:
            return {
                "success": False,
                "status": "Error",
                "message": str(e)
            }