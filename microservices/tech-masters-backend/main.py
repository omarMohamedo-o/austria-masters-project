from fastapi import FastAPI, Query, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
import time

from kafka_stream import publish_event, get_stream_events, get_kafka_status

app = FastAPI(title="Tech Masters Global Enterprise API", version="3.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Comprehensive cities directory
CITIES_BY_COUNTRY = {
    "Austria": [
        "Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", 
        "Villach", "Hagenberg", "St. Pölten", "Eisenstadt", "Leoben", 
        "Dornbirn", "Krems", "Wiener Neustadt", "Kufstein"
    ],
    "Germany": [
        "Munich", "Berlin", "Aachen", "Karlsruhe", "Heidelberg", "Stuttgart", 
        "Darmstadt", "Dresden", "Hamburg", "Frankfurt", "Cologne", "Leipzig"
    ]
}

# Predefined verified university database covering ALL institutions in Austria & Germany
UNIVERSITY_DATA = {
    # Austria Public & Technical Universities
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
        "description": "Austria's premier engineering and computer science university, leading Europe in algorithms, robotics, and cybersecurity."
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
        "description": "Alpine Quantum Valley hub renowned for quantum computing, theoretical computer science, and distributed high-performance systems."
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
        "description": "Top-tier technical university famous for cryptographic hardware, software technology, autonomous AI, and GraML."
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
        "description": "Pioneer of Europe's first Artificial Intelligence Master's, home of the LIT AI Lab and LSTM pioneer Sepp Hochreiter."
    },
    "University of Klagenfurt": {
        "name": "University of Klagenfurt (AAU)",
        "short_name": "Uni Klagenfurt",
        "city": "Klagenfurt",
        "country": "Austria",
        "rank_world": 580,
        "rank_country": 6,
        "type": "Public University",
        "website": "https://www.aau.at",
        "description": "Strong research center for networked systems, drone robotics, cloud computing, and cybersecurity."
    },
    "University of Graz": {
        "name": "University of Graz (Karl-Franzens-Universität)",
        "short_name": "Uni Graz",
        "city": "Graz",
        "country": "Austria",
        "rank_world": 661,
        "rank_country": 7,
        "type": "Public Research University",
        "website": "https://www.uni-graz.at",
        "description": "Major Styrian university collaborating on joint NAWI Graz Master's in computational sciences and data analytics."
    },
    "Paris Lodron University of Salzburg": {
        "name": "Paris Lodron University of Salzburg (PLUS)",
        "short_name": "Uni Salzburg",
        "city": "Salzburg",
        "country": "Austria",
        "rank_world": 681,
        "rank_country": 8,
        "type": "Public University",
        "website": "https://www.plus.ac.at",
        "description": "Specialized in Artificial Intelligence and Human Interfaces (HCI) and digital geoinformatics."
    },
    "BOKU University": {
        "name": "BOKU University (University of Natural Resources and Life Sciences)",
        "short_name": "BOKU Vienna",
        "city": "Vienna",
        "country": "Austria",
        "rank_world": 710,
        "rank_country": 9,
        "type": "Life Sciences University",
        "website": "https://boku.ac.at",
        "description": "Premier center for bioinformatics, ecological data science, and environmental computing."
    },
    "Montanuniversität Leoben": {
        "name": "Montanuniversität Leoben",
        "short_name": "Montanuni Leoben",
        "city": "Leoben",
        "country": "Austria",
        "rank_world": 750,
        "rank_country": 10,
        "type": "Technical University",
        "website": "https://www.unileoben.ac.at",
        "description": "Pioneering industrial informatics, cyber-physical automation, and sustainable materials computing."
    },
    "Medical University of Vienna": {
        "name": "Medical University of Vienna (MedUni Wien)",
        "short_name": "MedUni Vienna",
        "city": "Vienna",
        "country": "Austria",
        "rank_world": 200,
        "rank_country": 11,
        "type": "Medical University",
        "website": "https://www.meduniwien.ac.at",
        "description": "Top European medical research institution offering joint Bioinformatics, Medical Informatics, and AI in Healthcare degrees."
    },

    # Austria Universities of Applied Sciences (Fachhochschulen - FHs)
    "FH Upper Austria": {
        "name": "FH Upper Austria — Campus Hagenberg",
        "short_name": "FH OÖ Hagenberg",
        "city": "Hagenberg",
        "country": "Austria",
        "rank_world": 800,
        "rank_country": 12,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-ooe.at/campus-hagenberg/",
        "description": "Austria's Silicon Valley of applied informatics, renowned across Europe for software engineering, cybersecurity, and MLOps."
    },
    "FH JOANNEUM": {
        "name": "FH JOANNEUM (University of Applied Sciences)",
        "short_name": "FH JOANNEUM",
        "city": "Graz",
        "country": "Austria",
        "rank_world": 820,
        "rank_country": 13,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-joanneum.at",
        "description": "Leading Styrian applied sciences institution specializing in applied informatics, IT security, and automotive systems."
    },
    "FH Technikum Wien": {
        "name": "UAS Technikum Wien",
        "short_name": "Technikum Wien",
        "city": "Vienna",
        "country": "Austria",
        "rank_world": 850,
        "rank_country": 14,
        "type": "University of Applied Sciences",
        "website": "https://www.technikum-wien.at",
        "description": "Austria's largest technical UAS, focusing on industrial computer science, AI, cloud engineering, and telecom."
    },
    "Hochschule Campus Wien": {
        "name": "FH Campus Wien (University of Applied Sciences)",
        "short_name": "FH Campus Wien",
        "city": "Vienna",
        "country": "Austria",
        "rank_world": 870,
        "rank_country": 15,
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
        "rank_country": 16,
        "type": "University of Applied Sciences",
        "website": "https://www.fhstp.ac.at",
        "description": "Pioneering center for cyber defense, resilient digital systems, and digital media technologies."
    },
    "FH Salzburg": {
        "name": "Salzburg University of Applied Sciences (FH Salzburg)",
        "short_name": "FH Salzburg",
        "city": "Salzburg",
        "country": "Austria",
        "rank_world": 920,
        "rank_country": 17,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-salzburg.ac.at",
        "description": "Specialized in applied cyber security, human-computer interaction, and smart building informatics."
    },
    "Carinthia UAS": {
        "name": "Carinthia University of Applied Sciences (CUAS)",
        "short_name": "FH Kärnten",
        "city": "Villach",
        "country": "Austria",
        "rank_world": 950,
        "rank_country": 18,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-kaernten.at",
        "description": "Applied engineering center located adjacent to Infineon Austria semiconductor research facilities in Villach."
    },
    "Hochschule Burgenland": {
        "name": "Hochschule Burgenland",
        "short_name": "HS Burgenland",
        "city": "Eisenstadt",
        "country": "Austria",
        "rank_world": 980,
        "rank_country": 19,
        "type": "University of Applied Sciences",
        "website": "https://www.hochschule-burgenland.at",
        "description": "Tuition-free applied master degrees in Cloud Computing Engineering and Business Informatics."
    },
    "FH Vorarlberg": {
        "name": "FH Vorarlberg (Vorarlberg University of Applied Sciences)",
        "short_name": "FHV Dornbirn",
        "city": "Dornbirn",
        "country": "Austria",
        "rank_world": 990,
        "rank_country": 20,
        "type": "University of Applied Sciences",
        "website": "https://www.fhv.at",
        "description": "Located in the high-tech Lake Constance region with research in intelligent mechatronics and computer science."
    },
    "MCI Innsbruck": {
        "name": "MCI The Entrepreneurial School",
        "short_name": "MCI Innsbruck",
        "city": "Innsbruck",
        "country": "Austria",
        "rank_world": 995,
        "rank_country": 21,
        "type": "University of Applied Sciences",
        "website": "https://www.mci.edu",
        "description": "AACSB-accredited Tyrolean institution offering applied degrees in Digital Business & Software Engineering."
    },
    "FH Kufstein": {
        "name": "FH Kufstein Tirol (University of Applied Sciences)",
        "short_name": "FH Kufstein",
        "city": "Kufstein",
        "country": "Austria",
        "rank_world": 1000,
        "rank_country": 22,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-kufstein.ac.at",
        "description": "Specialized in data science, intelligent logistics, and enterprise software engineering."
    },
    "FH Wiener Neustadt": {
        "name": "University of Applied Sciences Wiener Neustadt (FHWN)",
        "short_name": "FHWN",
        "city": "Wiener Neustadt",
        "country": "Austria",
        "rank_world": 1005,
        "rank_country": 23,
        "type": "University of Applied Sciences",
        "website": "https://www.fhwn.ac.at",
        "description": "Austria's first FH, offering applied informatics, aerospace software engineering, and robotics."
    },
    "IMC Krems": {
        "name": "IMC University of Applied Sciences Krems",
        "short_name": "IMC Krems",
        "city": "Krems",
        "country": "Austria",
        "rank_world": 1010,
        "rank_country": 24,
        "type": "University of Applied Sciences",
        "website": "https://www.fh-krems.ac.at",
        "description": "Modern international campus focusing on digital business transformation and medical informatics."
    },

    # Germany Top Universities of Excellence & TU9
    "Technical University of Munich": {
        "name": "Technical University of Munich (TUM)",
        "short_name": "TUM Munich",
        "city": "Munich",
        "country": "Germany",
        "rank_world": 28,
        "rank_country": 1,
        "type": "University of Excellence / TU9",
        "website": "https://www.tum.de",
        "description": "Germany's #1 ranked university and global powerhouse for Computer Science, Robotics, and Artificial Intelligence."
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
        "description": "World-leading research university with premier programs in Data Science, AI, and Computational Linguistics."
    },
    "Heidelberg University": {
        "name": "Heidelberg University (Ruprecht-Karls-Universität)",
        "short_name": "Uni Heidelberg",
        "city": "Heidelberg",
        "country": "Germany",
        "rank_world": 87,
        "rank_country": 3,
        "type": "University of Excellence",
        "website": "https://www.uni-heidelberg.de",
        "description": "Germany's oldest university, globally noted for scientific computing, image analysis, and biomedical informatics."
    },
    "RWTH Aachen University": {
        "name": "RWTH Aachen University",
        "short_name": "RWTH Aachen",
        "city": "Aachen",
        "country": "Germany",
        "rank_world": 99,
        "rank_country": 4,
        "type": "University of Excellence / TU9",
        "website": "https://www.rwth-aachen.de",
        "description": "Europe's leading technical research university with world-renowned faculties in software engineering and algorithms."
    },
    "Karlsruhe Institute of Technology": {
        "name": "Karlsruhe Institute of Technology (KIT)",
        "short_name": "KIT Karlsruhe",
        "city": "Karlsruhe",
        "country": "Germany",
        "rank_world": 102,
        "rank_country": 5,
        "type": "University of Excellence / TU9",
        "website": "https://www.kit.edu",
        "description": "National Research Center of the Helmholtz Association, birth of German computer science and internet networking."
    },
    "TU Berlin": {
        "name": "Technical University of Berlin (TU Berlin)",
        "short_name": "TU Berlin",
        "city": "Berlin",
        "country": "Germany",
        "rank_world": 147,
        "rank_country": 6,
        "type": "University of Excellence / TU9",
        "website": "https://www.tu.berlin",
        "description": "Berlin technical powerhouse renowned for machine learning, big data architectures, and computer vision."
    },
    "University of Hamburg": {
        "name": "University of Hamburg (Universität Hamburg)",
        "short_name": "Uni Hamburg",
        "city": "Hamburg",
        "country": "Germany",
        "rank_world": 205,
        "rank_country": 7,
        "type": "University of Excellence",
        "website": "https://www.uni-hamburg.de",
        "description": "Northern Germany's largest academic center with recognized master degrees in intelligent systems and data science."
    },
    "TU Dresden": {
        "name": "TU Dresden (Dresden University of Technology)",
        "short_name": "TU Dresden",
        "city": "Dresden",
        "country": "Germany",
        "rank_world": 234,
        "rank_country": 8,
        "type": "University of Excellence / TU9",
        "website": "https://tu-dresden.de",
        "description": "Hub of Silicon Saxony, Europe's leading microelectronics, cloud, and distributed computing cluster."
    },
    "TU Darmstadt": {
        "name": "TU Darmstadt (Technical University of Darmstadt)",
        "short_name": "TU Darmstadt",
        "city": "Darmstadt",
        "country": "Germany",
        "rank_world": 246,
        "rank_country": 9,
        "type": "Technical University / TU9",
        "website": "https://www.tu-darmstadt.de",
        "description": "Europe's foremost cybersecurity research center (ATHENE) and premier institution for artificial intelligence."
    },
    "University of Stuttgart": {
        "name": "University of Stuttgart",
        "short_name": "Uni Stuttgart",
        "city": "Stuttgart",
        "country": "Germany",
        "rank_world": 312,
        "rank_country": 10,
        "type": "Technical University / TU9",
        "website": "https://www.uni-stuttgart.de",
        "description": "Home of the High-Performance Computing Center Stuttgart (HLRS) and leading computational engineering."
    },
    "Goethe University Frankfurt": {
        "name": "Goethe University Frankfurt",
        "short_name": "Uni Frankfurt",
        "city": "Frankfurt",
        "country": "Germany",
        "rank_world": 300,
        "rank_country": 11,
        "type": "Research University",
        "website": "https://www.uni-frankfurt.de",
        "description": "Financial capital research university leading FinTech analytics, high-performance computing, and AI ethics."
    },
    "University of Cologne": {
        "name": "University of Cologne (Universität zu Köln)",
        "short_name": "Uni Cologne",
        "city": "Cologne",
        "country": "Germany",
        "rank_world": 268,
        "rank_country": 12,
        "type": "Public University",
        "website": "https://www.uni-koeln.de",
        "description": "Major research university offering Master's degrees in Computational Sciences and Information Systems."
    },
    "Leipzig University": {
        "name": "Leipzig University (Universität Leipzig)",
        "short_name": "Uni Leipzig",
        "city": "Leipzig",
        "country": "Germany",
        "rank_world": 440,
        "rank_country": 13,
        "type": "Public University",
        "website": "https://www.uni-leipzig.de",
        "description": "Leading center for data science, bioinformatics, and natural language processing in Saxony."
    }
}

def resolve_university(inst_str: str) -> Dict[str, Any]:
    inst_lower = inst_str.lower()
    
    # Check by key direct match
    for key, val in UNIVERSITY_DATA.items():
        if key.lower() in inst_lower or val["short_name"].lower() in inst_lower:
            return val

    # Special aliases
    if "tu wien" in inst_lower:
        return UNIVERSITY_DATA["TU Wien"]
    if "university of vienna" in inst_lower or "univie" in inst_lower:
        return UNIVERSITY_DATA["University of Vienna"]
    if "innsbruck" in inst_lower and "mci" not in inst_lower:
        return UNIVERSITY_DATA["University of Innsbruck"]
    if "mci" in inst_lower:
        return UNIVERSITY_DATA["MCI Innsbruck"]
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
    if "carinthia" in inst_lower or "cuas" in inst_lower or "kärnten" in inst_lower:
        return UNIVERSITY_DATA["Carinthia UAS"]
    if "burgenland" in inst_lower:
        return UNIVERSITY_DATA["Hochschule Burgenland"]
    if "vorarlberg" in inst_lower:
        return UNIVERSITY_DATA["FH Vorarlberg"]
    if "kufstein" in inst_lower:
        return UNIVERSITY_DATA["FH Kufstein"]
    if "neustadt" in inst_lower:
        return UNIVERSITY_DATA["FH Wiener Neustadt"]
    if "krems" in inst_lower:
        return UNIVERSITY_DATA["IMC Krems"]
    if "leoben" in inst_lower:
        return UNIVERSITY_DATA["Montanuniversität Leoben"]
    if "boku" in inst_lower:
        return UNIVERSITY_DATA["BOKU University"]
    if "tum" in inst_lower or "munich" in inst_lower:
        return UNIVERSITY_DATA["Technical University of Munich"]
    if "lmu" in inst_lower:
        return UNIVERSITY_DATA["LMU Munich"]
    if "aachen" in inst_lower:
        return UNIVERSITY_DATA["RWTH Aachen University"]
    if "kit" in inst_lower or "karlsruhe" in inst_lower:
        return UNIVERSITY_DATA["Karlsruhe Institute of Technology"]
    if "berlin" in inst_lower:
        return UNIVERSITY_DATA["TU Berlin"]
    if "heidelberg" in inst_lower:
        return UNIVERSITY_DATA["Heidelberg University"]
    if "stuttgart" in inst_lower:
        return UNIVERSITY_DATA["University of Stuttgart"]
    if "darmstadt" in inst_lower:
        return UNIVERSITY_DATA["TU Darmstadt"]
    if "dresden" in inst_lower:
        return UNIVERSITY_DATA["TU Dresden"]
    if "hamburg" in inst_lower:
        return UNIVERSITY_DATA["University of Hamburg"]
    if "frankfurt" in inst_lower:
        return UNIVERSITY_DATA["Goethe University Frankfurt"]
    if "cologne" in inst_lower or "köln" in inst_lower:
        return UNIVERSITY_DATA["University of Cologne"]
    if "leipzig" in inst_lower:
        return UNIVERSITY_DATA["Leipzig University"]

    return {
        "name": inst_str,
        "short_name": inst_str[:20],
        "city": "Vienna",
        "country": "Austria",
        "rank_world": 999,
        "rank_country": 99,
        "type": "Accredited Higher Education Institution",
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

def load_data():
    global programs_db
    programs_db = []
    if os.path.exists(data_path):
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for p in data:
                uni_info = resolve_university(p.get('inst', ''))
                p['id'] = p.get('id', p['title'].lower().replace(' ', '-') + '-' + p['inst'].lower().replace(' ', '-'))
                p['country'] = p.get('country', uni_info['country'])
                p['city'] = p.get('city', uni_info['city'])
                p['uni_name'] = uni_info['name']
                p['uni_short'] = uni_info['short_name']
                p['uni_rank_world'] = uni_info['rank_world']
                p['uni_rank_country'] = uni_info['rank_country']
                p['uni_url'] = uni_info['website']
                programs_db.append(Program(**p))

def save_data():
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump([p.dict() for p in programs_db], f, indent=2, ensure_ascii=False)

load_data()

# ----------------- PUBLIC REST ENDPOINTS -----------------

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "service": "tech-masters-backend",
        "programs_count": len(programs_db),
        "universities_count": len(UNIVERSITY_DATA),
        "kafka_stream_topic": "techmasters.admissions.stream"
    }

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
        count = sum(1 for p in programs_db if info["name"].lower() in p.uni_name.lower() or key.lower() in p.inst.lower())
        unis.append({
            "key": key,
            **info,
            "programs_count": count
        })
    return sorted(unis, key=lambda u: (u["country"], u["rank_country"]))

@app.get("/api/cities")
def get_cities(country: Optional[str] = None):
    if country and country in CITIES_BY_COUNTRY:
        return {country: CITIES_BY_COUNTRY[country]}
    return CITIES_BY_COUNTRY

# ----------------- ADMIN AUTHENTICATION -----------------

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
def admin_login(creds: LoginRequest):
    if creds.email == "admin@techmasters.eu" and creds.password == "admin123":
        return {
            "token": "admin_jwt_session_token_xyz987",
            "user": {
                "name": "System Administrator",
                "email": "admin@techmasters.eu",
                "role": "SuperAdmin",
                "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=TechAdmin"
            }
        }
    raise HTTPException(status_code=401, detail="Invalid administrator credentials")

# ----------------- ADMIN PROGRAM CRUD WITH KAFKA STREAMING -----------------

@app.post("/api/programs", status_code=status.HTTP_201_CREATED)
def create_program(prog: Program):
    uni_info = resolve_university(prog.inst)
    if not prog.id:
        prog.id = f"{prog.title.lower().replace(' ', '-')}-{prog.inst.lower().replace(' ', '-')}"
    prog.uni_name = uni_info['name']
    prog.uni_short = uni_info['short_name']
    prog.uni_rank_world = uni_info['rank_world']
    prog.uni_rank_country = uni_info['rank_country']
    prog.uni_url = uni_info['website']

    programs_db.insert(0, prog)
    save_data()

    # Emit Kafka real-time stream event
    publish_event("PROGRAM_CREATED", {
        "id": prog.id,
        "title": prog.title,
        "institution": prog.inst,
        "seats": prog.seats,
        "field": prog.field,
        "timestamp": time.time()
    })

    return {"status": "created", "program": prog}

@app.put("/api/programs/{program_id}")
def update_program_by_id(program_id: str, updated: Program):
    for i, p in enumerate(programs_db):
        if p.id == program_id:
            updated.id = program_id
            uni_info = resolve_university(updated.inst)
            updated.uni_name = uni_info['name']
            updated.uni_short = uni_info['short_name']
            updated.uni_rank_world = uni_info['rank_world']
            updated.uni_rank_country = uni_info['rank_country']
            updated.uni_url = uni_info['website']
            
            programs_db[i] = updated
            save_data()

            # Emit Kafka real-time stream event
            publish_event("PROGRAM_UPDATED", {
                "id": program_id,
                "title": updated.title,
                "status": updated.status,
                "seats": updated.seats,
                "deadlineEU": updated.deadlineEU
            })

            return {"status": "updated", "program": updated}
    
    raise HTTPException(status_code=404, detail="Program not found")

@app.delete("/api/programs/{program_id}")
def delete_program(program_id: str):
    global programs_db
    initial_len = len(programs_db)
    programs_db = [p for p in programs_db if p.id != program_id]
    if len(programs_db) == initial_len:
        raise HTTPException(status_code=404, detail="Program not found")
    
    save_data()

    # Emit Kafka real-time stream event
    publish_event("PROGRAM_DELETED", {
        "id": program_id,
        "deleted_at": time.time()
    })

    return {"status": "deleted", "id": program_id}

# ----------------- ADMIN UNIVERSITY MANAGEMENT -----------------

@app.put("/api/universities/{uni_key}")
def update_university_ranking(uni_key: str, data: Dict[str, Any] = Body(...)):
    if uni_key in UNIVERSITY_DATA:
        UNIVERSITY_DATA[uni_key].update(data)
        publish_event("UNIVERSITY_RANKING_UPDATED", {
            "university": uni_key,
            "rank_world": UNIVERSITY_DATA[uni_key].get("rank_world"),
            "website": UNIVERSITY_DATA[uni_key].get("website")
        })
        return {"status": "success", "university": UNIVERSITY_DATA[uni_key]}
    raise HTTPException(status_code=404, detail="University key not found")

# ----------------- KAFKA DATA STREAMING MONITOR -----------------

@app.get("/api/kafka/events")
def get_kafka_events():
    return {"events": get_stream_events(50)}

@app.get("/api/kafka/status")
def get_kafka_broker_status():
    return get_kafka_status()

@app.post("/api/kafka/publish")
def manual_publish_stream_event(event_type: str = Body(...), payload: Dict[str, Any] = Body(...)):
    evt = publish_event(event_type, payload)
    return {"status": "published", "event": evt}

# ----------------- COMMUNITY KNOWLEDGE SHARING PLATFORM -----------------

class CommunityComment(BaseModel):
    id: str
    author_name: str
    author_handle: str
    author_role: str
    created_at: str
    content: str
    upvotes: int = 0

class CommunityPost(BaseModel):
    id: str
    title: str
    category: str
    country: str
    university: str
    author_name: str
    author_handle: str
    author_role: str
    created_at: str
    upvotes: int = 0
    tags: List[str] = []
    content: str
    comments: List[CommunityComment] = []

class CreatePostRequest(BaseModel):
    title: str
    category: str
    country: str
    university: str
    author_name: str
    author_handle: Optional[str] = None
    author_role: str
    content: str
    tags: List[str] = []

class CreateCommentRequest(BaseModel):
    author_name: str
    author_handle: Optional[str] = None
    author_role: str
    content: str

class GradeConversionRequest(BaseModel):
    max_grade: float
    min_passing_grade: float
    actual_grade: float

community_path = os.path.join(os.path.dirname(__file__), '../../data/community_posts.json')
requirements_path = os.path.join(os.path.dirname(__file__), '../../data/requirements_guide.json')
payout_path = os.path.join(os.path.dirname(__file__), '../../data/payout_settings.json')

community_posts_db: List[CommunityPost] = []

def load_community_posts():
    global community_posts_db
    community_posts_db = []
    if os.path.exists(community_path):
        with open(community_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                community_posts_db.append(CommunityPost(**item))

def save_community_posts():
    with open(community_path, 'w', encoding='utf-8') as f:
        json.dump([p.dict() for p in community_posts_db], f, indent=2, ensure_ascii=False)

load_community_posts()

@app.get("/api/community/posts", response_model=List[CommunityPost])
def get_community_posts(
    category: Optional[str] = None,
    country: Optional[str] = None,
    university: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = Query("popular", enum=["popular", "recent"])
):
    results = community_posts_db

    if category and category.lower() != "all":
        results = [p for p in results if p.category.lower() == category.lower()]

    if country and country.lower() != "all":
        results = [p for p in results if p.country.lower() == country.lower()]

    if university and university.lower() != "all":
        results = [p for p in results if university.lower() in p.university.lower()]

    if search:
        q = search.lower()
        results = [
            p for p in results
            if q in p.title.lower() or q in p.content.lower() or any(q in t.lower() for t in p.tags)
        ]

    if sort_by == "popular":
        results = sorted(results, key=lambda x: x.upvotes, reverse=True)
    elif sort_by == "recent":
        results = sorted(results, key=lambda x: x.created_at, reverse=True)

    return results

@app.post("/api/community/posts")
def create_community_post(post_req: CreatePostRequest):
    post_id = f"post-{int(time.time())}"
    handle = post_req.author_handle or f"@{post_req.author_name.lower().replace(' ', '_')}"
    created_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    new_post = CommunityPost(
        id=post_id,
        title=post_req.title,
        category=post_req.category,
        country=post_req.country,
        university=post_req.university,
        author_name=post_req.author_name,
        author_handle=handle,
        author_role=post_req.author_role,
        created_at=created_at,
        upvotes=1,
        tags=post_req.tags,
        content=post_req.content,
        comments=[]
    )

    community_posts_db.insert(0, new_post)
    save_community_posts()

    # Emit Kafka event
    publish_event("COMMUNITY_POST_CREATED", {
        "id": new_post.id,
        "title": new_post.title,
        "author": new_post.author_name,
        "category": new_post.category,
        "university": new_post.university,
        "timestamp": created_at
    })

    return {"status": "created", "post": new_post}

@app.post("/api/community/posts/{post_id}/upvote")
def upvote_community_post(post_id: str):
    for p in community_posts_db:
        if p.id == post_id:
            p.upvotes += 1
            save_community_posts()
            publish_event("COMMUNITY_POST_UPVOTED", {
                "post_id": post_id,
                "title": p.title,
                "upvotes": p.upvotes
            })
            return {"status": "upvoted", "post_id": post_id, "upvotes": p.upvotes}
    raise HTTPException(status_code=404, detail="Post not found")

@app.post("/api/community/posts/{post_id}/comments")
def add_community_comment(post_id: str, comment_req: CreateCommentRequest):
    for p in community_posts_db:
        if p.id == post_id:
            c_id = f"c-{int(time.time())}"
            handle = comment_req.author_handle or f"@{comment_req.author_name.lower().replace(' ', '_')}"
            created_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

            comment = CommunityComment(
                id=c_id,
                author_name=comment_req.author_name,
                author_handle=handle,
                author_role=comment_req.author_role,
                created_at=created_at,
                content=comment_req.content,
                upvotes=1
            )
            p.comments.append(comment)
            save_community_posts()

            # Emit Kafka event
            publish_event("COMMUNITY_COMMENT_ADDED", {
                "post_id": post_id,
                "comment_id": c_id,
                "author": comment.author_name,
                "timestamp": created_at
            })

            return {"status": "comment_added", "comment": comment}
    raise HTTPException(status_code=404, detail="Post not found")

# ----------------- MASTER REQUIREMENTS & BAVARIAN GRADE CONVERTER -----------------

@app.get("/api/requirements")
def get_requirements():
    if os.path.exists(requirements_path):
        with open(requirements_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Requirements guide not found")

@app.post("/api/requirements/convert-grade")
def convert_bavarian_grade(req: GradeConversionRequest):
    if req.max_grade == req.min_passing_grade:
        raise HTTPException(status_code=400, detail="Max grade and min passing grade cannot be equal.")

    # Modified Bavarian Formula: N = 1 + 3 * ((N_max - N_d) / (N_max - N_min))
    converted = 1.0 + 3.0 * ((req.max_grade - req.actual_grade) / (req.max_grade - req.min_passing_grade))
    # Clamp between 1.0 (highest) and 5.0 (lowest)
    converted_clamped = max(1.0, min(5.0, converted))
    grade_rounded = round(converted_clamped, 2)

    if grade_rounded <= 1.5:
        category = "Sehr gut (Outstanding)"
        competitiveness = "Extremely Competitive — Direct shortlist potential at TU Wien, TUM, Uni Vienna"
        color = "emerald"
    elif grade_rounded <= 2.5:
        category = "Gut (Good / Above Average)"
        competitiveness = "Highly Competitive — Fulfills standard GPA thresholds for European Master admissions"
        color = "teal"
    elif grade_rounded <= 3.5:
        category = "Befriedigend (Satisfactory)"
        competitiveness = "Eligible — May be asked for GRE Quantitative 160+ or additional aptitude interview"
        color = "amber"
    elif grade_rounded <= 4.0:
        category = "Ausreichend (Minimum Pass)"
        competitiveness = "Borderline — Requires strong statement of purpose, publications, or practical experience"
        color = "orange"
    else:
        category = "Nicht ausreichend (Ineligible)"
        competitiveness = "Below statutory Master's entry threshold"
        color = "rose"

    return {
        "converted_grade": grade_rounded,
        "classification": category,
        "competitiveness": competitiveness,
        "color": color,
        "formula_used": "N = 1 + 3 * ((N_max - N_d) / (N_max - N_min))",
        "austrian_equivalent": 1 if grade_rounded <= 1.5 else (2 if grade_rounded <= 2.5 else (3 if grade_rounded <= 3.5 else 4))
    }

# ----------------- ADMIN PAYOUT & MONETIZATION SETTINGS -----------------

DEFAULT_PAYOUT = {
    "payout_method": "visa_bank_wire",
    "account_holder": "Omar Mohamed",
    "iban_or_card": "AT89 3700 **** **** 4821",
    "bic_swift": "BKAUATWW",
    "bank_name": "Erste Bank Vienna / Visa Debit Payout",
    "paypal_email": "admin@techmasters.eu",
    "stripe_account_id": "acct_1TechMastersStripeConnected",
    "auto_payout_threshold": 100.00,
    "payout_schedule": "Monthly on the 21st",
    "currency": "USD / EUR",
    "ad_network_mode": "hybrid"
}

@app.get("/api/admin/payout-settings")
def get_payout_settings():
    if os.path.exists(payout_path):
        with open(payout_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return DEFAULT_PAYOUT

@app.post("/api/admin/payout-settings")
def update_payout_settings(settings: Dict[str, Any] = Body(...)):
    with open(payout_path, 'w', encoding='utf-8') as f:
        json.dump(settings, f, indent=2)
    return {"status": "success", "settings": settings}

