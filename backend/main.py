from fastapi import FastAPI
from pydantic import BaseModel
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from fastapi.middleware.cors import CORSMiddleware
import lmdb
import os

app = FastAPI(title="Text Sanitizer API", description="API for sanitizing PII from text")

# Setup LMDB environment
DB_DIR = os.getenv("DB_DIR", "./data")
os.makedirs(DB_DIR, exist_ok=True)
env = lmdb.open(DB_DIR, max_dbs=1, map_size=10485760) # 10MB map size is plenty for a counter


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to sanitize.oneforalllabs.com
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

class SanitizeRequest(BaseModel):
    text: str
    language: str = "en"

class SanitizeResponse(BaseModel):
    sanitized_text: str

@app.post("/api/sanitize", response_model=SanitizeResponse)
async def sanitize_text(request: SanitizeRequest):
    # Analyze the text to identify PII entities
    results = analyzer.analyze(text=request.text, language=request.language)
    
    # Anonymize the identified entities
    anonymized_result = anonymizer.anonymize(text=request.text, analyzer_results=results)
    
    return SanitizeResponse(sanitized_text=anonymized_result.text)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/visit")
async def record_visit():
    with env.begin(write=True) as txn:
        # Get current count
        count_bytes = txn.get(b'visit_count')
        if count_bytes:
            count = int(count_bytes.decode('utf-8'))
        else:
            count = 0
            
        # Increment
        count += 1
        
        # Save new count
        txn.put(b'visit_count', str(count).encode('utf-8'))
        
    return {"visits": count}

@app.get("/api/visit")
async def get_visits():
    with env.begin() as txn:
        count_bytes = txn.get(b'visit_count')
        count = int(count_bytes.decode('utf-8')) if count_bytes else 0
    return {"visits": count}

