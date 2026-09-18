from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os

app = FastAPI(title="Tech Masters Global API", version="2.0.0")

# Predefined verified university database with official websites and rankings
UNIVERSITY_DATA = {
    "University of Vienna": {
        "name": "University of Vienna (Universität Wien)",
        "short_name": "Uni Vienna",
        "city": "Vienna",
        "country": "Austria",
        "rank_world": 130,
        "rank_country": 1,
        "type": "Public Research University",
        "website": "https://www.univie.ac.at",
        "description": "Austria's oldest and highest-ranking university, globally renowned for research in Computer Science, Data Science, and Mathematics."
    },
    "TU Wien": {
        "name": "TU Wien (Vienna University of Technology)",
        "short_name": "TU Wien",
        "city": "Vienna",
        "country": "Austria",
        "rank_world": 190,
        "rank_country": 2,
        "type": "Technical University",
        "website": "https://www.tuwien.at",
        "description": "Austria's premier engineering and computer science university, world-renowned for informatics, algorithms, and cybersecurity."
    },
    "University of Innsbruck": {
        "name": "University of Innsbruck (Universität Innsbruck)",
        "short_name": "Uni Innsbruck",
        "city": "Innsbruck",
        "country": "Austria",
        "rank_world": 362,
        "rank_country": 3,
        "type": "Public University",
        "website": "https://www.uibk.ac.at",
        "description": "Major Alpine research institution known for quantum computing, theoretical computer science, and distributed systems."
    },
    "TU Graz": {
        "name": "TU Graz (Graz University of Technology)",
        "short_name": "TU Graz",
        "city": "Graz",
        "country": "Austria",
        "rank_world": 421,
        "rank_country": 4,
        "type": "Technical University",
        "website": "https://www.tugraz.at",
        "description": "Top-tier technical university famous for cryptographic hardware, software technology, and autonomous AI systems."
    },
    "JKU Linz": {
        "name": "Johannes Kepler University Linz (JKU Linz)",
        "short_name": "JKU Linz",
        "city": "Linz",
        "country": "Austria",
        "rank_world": 446,
        "rank_country": 5,
        "type": "Public Research University",
        "website": "https://www.jku.at",
        "description": "Pioneer of Europe's first Artificial Intelligence Master's, home of the world-leading LIT AI Lab and LSTM pioneer Sepp Hochreiter."
    },
    "University of Klagenfurt": {
        "name": "University of Klagenfurt (Universität Klagenfurt)",
        "short_name": "Uni Klagenfurt",
        "city": "Klagenfurt",
        "country": "Austria",
        "rank_world": 580,
        "rank_country": 6,
        "type": "Public University",
        "website": "https://www.aau.at",
        "description": "Strong focus on networked systems, robotics, and cybersecurity in Carinthia's technology hub."
    },
    "Paris Lodron University of Salzburg": {
        "name": "Paris Lodron University of Salzburg (PLUS)",
        "short_name": "Uni Salzburg",
        "city": "Salzburg",
        "country": "Austria",
        "rank_world": 681,
        "rank_country": 7,
        "type": "Public University",
        "website": "https://www.plus.ac.at",
        "description": "Renowned for its Department of Artificial Intelligence and Human Interfaces and geospatial technologies."
    },
    "FH Upper Austria": {
        "name": "FH Upper Austria — Campus Hagenberg",
        "short_name": "FH OÖ Hagenberg",
        "city": "Hagenberg",
        "country": "Austria",
        "rank_world": 800,
        "rank_country": 8,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-ooe.at/campus-hagenberg/",
        "description": "Austria's Silicon Valley of applied informatics, renowned across Europe for software engineering and IT security."
    },
    "FH JOANNEUM": {
        "name": "FH JOANNEUM (University of Applied Sciences)",
        "short_name": "FH JOANNEUM",
        "city": "Graz",
        "country": "Austria",
        "rank_world": 820,
        "rank_country": 9,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-joanneum.at",
        "description": "Leading Styrian applied sciences institution specializing in applied informatics and automotive computing."
    },
    "FH Technikum Wien": {
        "name": "UAS Technikum Wien",
        "short_name": "Technikum Wien",
        "city": "Vienna",
        "country": "Austria",
        "rank_world": 850,
        "rank_country": 10,
        "type": "University of Applied Sciences",
        "website": "https://www.technikum-wien.at",
        "description": "Austria's largest technical UAS, focusing on industrial computer science, AI, and telecom systems."
    },
    "Hochschule Campus Wien": {
        "name": "FH Campus Wien (University of Applied Sciences)",
        "short_name": "FH Campus Wien",
        "city": "Vienna",
        "country": "Austria",
        "rank_world": 870,
        "rank_country": 11,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-campuswien.ac.at",
        "description": "Major Viennese UAS offering applied IT security and digital healthcare engineering."
    },
    "UAS St. Pölten": {
        "name": "St. Pölten University of Applied Sciences (USTP)",
        "short_name": "FH St. Pölten",
        "city": "St. Pölten",
        "country": "Austria",
        "rank_world": 890,
        "rank_country": 12,
        "type": "University of Applied Sciences",
        "website": "https://www.fhstp.ac.at",
        "description": "Pioneering center for cyber security, resilient digital systems, and digital media technologies."
    },
    "FH Salzburg": {
        "name": "Salzburg University of Applied Sciences (FH Salzburg)",
        "short_name": "FH Salzburg",
        "city": "Salzburg",
        "country": "Austria",
        "rank_world": 920,
        "rank_country": 13,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-salzburg.ac.at",
        "description": "Specialized in cyber defense, smart building technologies, and human-centered computing."
    },
    "Carinthia UAS": {
        "name": "Carinthia University of Applied Sciences (CUAS)",
        "short_name": "FH Kärnten",
        "city": "Villach",
        "country": "Austria",
        "rank_world": 950,
        "rank_country": 14,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-kaernten.at",
        "description": "Applied engineering center located near Infineon Austria semiconductor research facilities."
    },
    "Hochschule Burgenland": {
        "name": "Hochschule Burgenland",
        "short_name": "HS Burgenland",
        "city": "Eisenstadt",
        "country": "Austria",
        "rank_world": 980,
        "rank_country": 15,
        "type": "University of Applied Sciences",
        "website": "https://www.hochschule-burgenland.at",
        "description": "Cloud computing, applied IT management, and business informatics degrees."
    },
    # Germany institutions for global expansion
    "Technical University of Munich": {
        "name": "Technical University of Munich (TUM)",
        "short_name": "TUM Munich",
        "city": "Munich",
        "country": "Germany",
        "rank_world": 28,
        "rank_country": 1,
        "type": "University of Excellence",
        "website": "https://www.tum.de",
        "description": "Germany's top-ranked university and global powerhouse for Computer Science, Robotics, and Artificial Intelligence."
    },
    "LMU Munich": {
        "name": "LMU Munich (Ludwig-Maximilians-Universität München)",
        "short_name": "LMU Munich",
        "city": "Munich",
        "country": "Germany",
        "rank_world": 54,
        "rank_country": 2,
        "type": "University of Excellence",
        "website": "https://www.lmu.de",
        "description": "Prestigious German research university with leading programs in Data Science and Computational Linguistics."
    },
    "RWTH Aachen University": {
        "name": "RWTH Aachen University",
        "short_name": "RWTH Aachen",
        "city": "Aachen",
        "country": "Germany",
        "rank_world": 99,
        "rank_country": 3,
        "type": "Technical University",
        "website": "https://www.rwth-aachen.de",
        "description": "Europe's largest technical university with exceptional computer science and software systems faculties."
    },
    "TU Berlin": {
        "name": "Technical University of Berlin (TU Berlin)",
        "short_name": "TU Berlin",
        "city": "Berlin",
        "country": "Germany",
        "rank_world": 147,
        "rank_country": 4,
        "type": "Technical University",
        "website": "https://www.tu.berlin",
        "description": "Capital city technical university renowned for internet technologies, AI, and big data."
    }
}

def resolve_university(inst_str: str) -> Dict[str, Any]:
    inst_lower = inst_str.lower()
    if "tu wien" in inst_lower:
        return UNIVERSITY_DATA["TU Wien"]
    if "university of vienna" in inst_lower or "univie" in inst_lower:
        return UNIVERSITY_DATA["University of Vienna"]
    if "innsbruck" in inst_lower:
        return UNIVERSITY_DATA["University of Innsbruck"]
    if "tu graz" in inst_lower:
        return UNIVERSITY_DATA["TU Graz"]
    if "jku" in inst_lower or "linz" in inst_lower:
        return UNIVERSITY_DATA["JKU Linz"]
    if "klagenfurt" in inst_lower:
        return UNIVERSITY_DATA["University of Klagenfurt"]
    if "salzburg" in inst_lower and "fh" not in inst_lower:
        return UNIVERSITY_DATA["Paris Lodron University of Salzburg"]
    if "hagenberg" in inst_lower or "upper austria" in inst_lower:
        return UNIVERSITY_DATA["FH Upper Austria"]
    if "joanneum" in inst_lower:
        return UNIVERSITY_DATA["FH JOANNEUM"]
    if "technikum" in inst_lower:
        return UNIVERSITY_DATA["FH Technikum Wien"]
    if "campus wien" in inst_lower:
        return UNIVERSITY_DATA["Hochschule Campus Wien"]
    if "pölten" in inst_lower or "polten" in inst_lower or "ustp" in inst_lower:
        return UNIVERSITY_DATA["UAS St. Pölten"]
    if "fh salzburg" in inst_lower:
        return UNIVERSITY_DATA["FH Salzburg"]
    if "carinthia" in inst_lower or "cuas" in inst_lower:
        return UNIVERSITY_DATA["Carinthia UAS"]
    if "burgenland" in inst_lower:
        return UNIVERSITY_DATA["Hochschule Burgenland"]
    if "tum" in inst_lower or "munich" in inst_lower:
        return UNIVERSITY_DATA["Technical University of Munich"]
    if "lmu" in inst_lower:
        return UNIVERSITY_DATA["LMU Munich"]
    if "aachen" in inst_lower:
        return UNIVERSITY_DATA["RWTH Aachen University"]
    if "berlin" in inst_lower:
        return UNIVERSITY_DATA["TU Berlin"]
    
    # Fallback
    return {
        "name": inst_str,
        "short_name": inst_str[:20],
        "city": "Austria",
        "country": "Austria",
        "rank_world": 999,
        "rank_country": 99,
        "type": "Higher Education Institution",
        "website": "https://www.studienwahl.at",
        "description": "Accredited European Higher Education Institution."
    }

class Program(BaseModel):
    id: str
    country: str
    city: str
    title: str
    inst: str
    uni_name: str
    uni_short: str
    uni_rank_world: int
    uni_rank_country: int
    uni_url: str
    field: str
    status: str
    statusLabel: str
    sortDate: str
    dateLabel: str
    deadlineEU: str
    deadlineNonEU: str
    windowLabel: str
    desc: str
    tags: List[str] = []
    lang: str
    url: str
    applyUrl: str
    feeEU: str
    feeNonEU: str
    seats: Optional[str] = "Open quota"
    admissionProcess: Optional[str] = None
    minDegree: Optional[str] = None
    englishLevel: Optional[str] = None
    workRights: Optional[str] = None
    industryPartners: Optional[str] = None
    duration: Optional[str] = "4 Semesters (2 Years) · 120 ECTS"

    class Config:
        extra = "allow"

programs_db: List[Program] = []

data_path = os.path.join(os.path.dirname(__file__), '../../data/programs.json')
if os.path.exists(data_path):
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for p in data:
            uni_info = resolve_university(p.get('inst', ''))
            p['id'] = p.get('id', p['title'].lower().replace(' ', '-') + '-' + p['inst'].lower().replace(' ', '-'))
            p['country'] = p.get('country', uni_info['country'])
            p['city'] = uni_info['city']
            p['uni_name'] = uni_info['name']
            p['uni_short'] = uni_info['short_name']
            p['uni_rank_world'] = uni_info['rank_world']
            p['uni_rank_country'] = uni_info['rank_country']
            p['uni_url'] = uni_info['website']
            programs_db.append(Program(**p))

@app.get("/")
def read_root():
    return {"status": "ok", "service": "tech-masters-backend", "programs_count": len(programs_db)}

@app.get("/api/programs", response_model=List[Program])
def get_programs(
    country: Optional[str] = None,
    city: Optional[str] = None,
    university: Optional[str] = None,
    sort_by: Optional[str] = Query("rank_world", enum=["rank_world", "rank_country", "date", "fee", "name"])
):
    results = programs_db

    if country and country.lower() != "all":
        results = [p for p in results if p.country.lower() == country.lower()]

    if city and city.lower() != "all":
        results = [p for p in results if p.city.lower() == city.lower()]

    if university and university.lower() != "all":
        results = [p for p in results if university.lower() in p.uni_name.lower() or university.lower() in p.inst.lower()]

    if sort_by == "rank_world":
        results = sorted(results, key=lambda x: x.uni_rank_world)
    elif sort_by == "rank_country":
        results = sorted(results, key=lambda x: x.uni_rank_country)
    elif sort_by == "date":
        results = sorted(results, key=lambda x: x.sortDate)
    elif sort_by == "fee":
        results = sorted(results, key=lambda x: 0 if "free" in x.feeEU.lower() else 1)
    elif sort_by == "name":
        results = sorted(results, key=lambda x: x.title)

    return results

@app.get("/api/universities")
def get_universities(country: Optional[str] = None):
    unis = []
    for key, info in UNIVERSITY_DATA.items():
        if country and country.lower() != "all" and info["country"].lower() != country.lower():
            continue
        # Count programs in this university
        count = sum(1 for p in programs_db if info["name"].lower() in p.uni_name.lower() or key.lower() in p.inst.lower())
        unis.append({
            **info,
            "programs_count": count
        })
    return sorted(unis, key=lambda u: (u["country"], u["rank_country"]))

@app.post("/api/programs/update")
def update_program(program: Program):
    for i, p in enumerate(programs_db):
        if p.id == program.id:
            programs_db[i] = program
            return {"status": "updated"}
    programs_db.append(program)
    return {"status": "created"}
