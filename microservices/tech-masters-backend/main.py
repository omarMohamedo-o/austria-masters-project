from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Tech Masters Backend API")

class Program(BaseModel):
    id: str
    country: str
    title: str
    inst: str
    deadlineEU: str
    deadlineNonEU: str
    feeEU: str

    class Config:
        extra = "allow"

import json
import os

# In a real enterprise app, this will connect to PostgreSQL via SQLAlchemy
programs_db = []
data_path = os.path.join(os.path.dirname(__file__), '../../data/programs.json')
if os.path.exists(data_path):
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for p in data:
            # Create a mock ID if missing
            p['id'] = p.get('id', p['title'].lower().replace(' ', '-') + '-' + p['inst'].lower().replace(' ', '-'))
            p['country'] = p.get('country', 'Austria') # Default country for old data
            programs_db.append(Program(**p))

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend API is running."}

@app.get("/api/programs", response_model=List[Program])
def get_programs(country: str = None):
    if country:
        return [p for p in programs_db if p.country.lower() == country.lower()]
    return programs_db

@app.post("/api/programs/update")
def update_program(program: Program):
    # Endpoint for the LLM scraper to push updates
    for i, p in enumerate(programs_db):
        if p.id == program.id:
            programs_db[i] = program
            return {"status": "updated"}
    programs_db.append(program)
    return {"status": "created"}
