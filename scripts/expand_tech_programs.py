import json
import os

data_path = os.path.join(os.path.dirname(__file__), '../data/programs.json')

with open(data_path, 'r', encoding='utf-8') as f:
    programs = json.load(f)

# Enhance existing programs with ML/DL tags where appropriate
for p in programs:
    if "Artificial Intelligence" in p.get("title", ""):
        tags = set(p.get("tags", []))
        tags.update(["Machine Learning", "Deep Learning", "Neural Networks"])
        p["tags"] = list(tags)
    if "Data Science" in p.get("title", ""):
        tags = set(p.get("tags", []))
        tags.update(["Machine Learning", "Statistical Learning"])
        p["tags"] = list(tags)

new_programs = [
    {
        "title": "Machine Learning & Deep Learning (Dipl.-Ing. / MSc)",
        "inst": "TU Wien Informatics",
        "field": "Machine Learning & Deep Learning",
        "status": "open",
        "statusLabel": "Open now",
        "sortDate": "2026-10-31",
        "dateLabel": "General admission period runs to 31 Oct 2026",
        "deadlineEU": "General admission period runs to 31 Oct 2026",
        "deadlineNonEU": "3 Aug 2026 (Winter) / 5 Jan 2027 (Summer)",
        "windowLabel": "Window running",
        "desc": "Elite research track focusing on deep neural networks, reinforcement learning, probabilistic graphical models, and neural architecture search. Directly connected to the Machine Learning Group at TU Wien and the ELLIS Unit Vienna.",
        "tags": [
            "120 ECTS",
            "English",
            "Machine Learning",
            "Deep Learning",
            "Neural Networks",
            "PyTorch",
            "ELLIS Unit Vienna"
        ],
        "lang": "English",
        "url": "https://informatics.tuwien.ac.at/master/",
        "applyUrl": "https://tiss.tuwien.ac.at/aufnahme/aufnahmeverfahren",
        "feeEU": "Free (ÖH fee only, €26.20/sem)",
        "feeEUNote": "within standard duration + 2 tolerance semesters; €363.36/sem after",
        "feeNonEU": "€726.72/semester",
        "feeApp": "No separate application fee",
        "feeFree": True
    },
    {
        "title": "Machine Learning & Autonomous Intelligence (MSc)",
        "inst": "TU Graz",
        "field": "Machine Learning & Deep Learning",
        "status": "soon",
        "statusLabel": "Opening soon",
        "sortDate": "2026-10-15",
        "dateLabel": "Registration opens 15 Oct, closes 15 Dec 2026",
        "deadlineEU": "Registration opens 15 Oct, closes 15 Dec 2026",
        "deadlineNonEU": "Registration opens 15 Oct, closes 15 Dec 2026",
        "windowLabel": "Intake opens Oct 2026",
        "desc": "Deep neural architectures, statistical learning theory, generative AI, and intelligent signal processing at the Institute of Theoretical Computer Science and Graz Center for Machine Learning (GraML).",
        "tags": [
            "120 ECTS",
            "English",
            "Machine Learning",
            "Deep Learning",
            "GraML Hub",
            "Statistical Learning"
        ],
        "lang": "English",
        "url": "https://www.tugraz.at/en/studying-and-teaching/degree-and-certificate-programmes/masters-degree-programmes/computer-science",
        "applyUrl": "https://online.tugraz.at/",
        "feeEU": "Free (ÖH fee only, €26.20/sem)",
        "feeEUNote": "within standard duration + 2 tolerance semesters; €363.36/sem after",
        "feeNonEU": "€726.72/semester",
        "feeApp": "No separate admission-procedure fee — only document upload required",
        "feeFree": True
    },
    {
        "title": "Visual Computing & Computer Vision (Dipl.-Ing. / MSc)",
        "inst": "TU Wien Informatics",
        "field": "Computer Vision",
        "status": "open",
        "statusLabel": "Open now",
        "sortDate": "2026-10-31",
        "dateLabel": "General admission period runs to 31 Oct 2026",
        "deadlineEU": "General admission period runs to 31 Oct 2026",
        "deadlineNonEU": "Earlier special deadline, ~6 Jul – 3 Aug 2026",
        "windowLabel": "Window running",
        "desc": "World-leading program in computer vision, deep visual learning, 3D reconstruction, neural radiance fields (NeRF), real-time rendering, and medical visual computing at TU Wien's Institute of Visual Computing & Human-Centered Technology.",
        "tags": [
            "Dipl.-Ing. (≈MSc)",
            "English",
            "Computer Vision",
            "Deep Learning",
            "NeRF",
            "3D Graphics"
        ],
        "lang": "English",
        "url": "https://informatics.tuwien.ac.at/master/visual-computing/",
        "applyUrl": "https://tiss.tuwien.ac.at/aufnahme/aufnahmeverfahren",
        "feeEU": "Free (ÖH fee only, €26.20/sem)",
        "feeEUNote": "within standard duration + 2 tolerance semesters; €363.36/sem after",
        "feeNonEU": "€726.72/semester",
        "feeApp": "No separate application fee",
        "feeFree": True
    },
    {
        "title": "Robotics & Autonomous Systems (Dipl.-Ing. / MSc)",
        "inst": "TU Wien",
        "field": "Robotics & Autonomous Systems",
        "status": "open",
        "statusLabel": "Open now",
        "sortDate": "2026-10-31",
        "dateLabel": "General admission period runs to 31 Oct 2026",
        "deadlineEU": "General admission period runs to 31 Oct 2026",
        "deadlineNonEU": "3 Aug 2026 (confirm exact date with Admissions Office)",
        "windowLabel": "Window running",
        "desc": "Interdisciplinary engineering Master combining autonomous robot navigation, SLAM, deep reinforcement learning for physical control, sensor fusion, and robotic manipulators.",
        "tags": [
            "120 ECTS",
            "English",
            "Robotics",
            "ROS 2",
            "Reinforcement Learning",
            "Control Systems"
        ],
        "lang": "English",
        "url": "https://informatics.tuwien.ac.at/master/",
        "applyUrl": "https://tiss.tuwien.ac.at/aufnahme/aufnahmeverfahren",
        "feeEU": "Free (ÖH fee only, €26.20/sem)",
        "feeEUNote": "within standard duration + 2 tolerance semesters; €363.36/sem after",
        "feeNonEU": "€726.72/semester",
        "feeApp": "No separate application fee",
        "feeFree": True
    },
    {
        "title": "Quantum Information & Computing (MSc)",
        "inst": "University of Innsbruck",
        "field": "Quantum Computing",
        "status": "open",
        "statusLabel": "Open now",
        "sortDate": "2026-10-31",
        "dateLabel": "Admission period open until 31 Oct 2026",
        "deadlineEU": "Admission period open until 31 Oct 2026",
        "deadlineNonEU": "5 Sep 2026",
        "windowLabel": "Alpine Quantum Valley",
        "desc": "Innsbruck is globally recognized as one of the world capitals of experimental and theoretical quantum computation. Curriculum covers quantum algorithms, trapped-ion computing, quantum cryptography, and quantum fault tolerance.",
        "tags": [
            "120 ECTS",
            "English",
            "Quantum Algorithms",
            "Qiskit",
            "Alpine Quantum Hub",
            "Quantum Hardware"
        ],
        "lang": "English",
        "url": "https://www.uibk.ac.at/studium/angebot/ma-quantum-science-and-technology-en/",
        "applyUrl": "https://orawww.uibk.ac.at/public_prod/owa/lfuonline_inso.anmeldung",
        "feeEU": "Free (ÖH fee only, €26.20/sem)",
        "feeEUNote": "within standard duration + 2 tolerance semesters; €363.36/sem after",
        "feeNonEU": "€726.72/semester",
        "feeApp": "No separate application fee",
        "feeFree": True
    },
    {
        "title": "Bioinformatics & Computational Biology (MSc)",
        "inst": "University of Vienna",
        "field": "Bioinformatics",
        "status": "open",
        "statusLabel": "Closing soon",
        "sortDate": "2026-09-05",
        "dateLabel": "EU/EEA deadline 5 Sep 2026",
        "deadlineEU": "5 Sep 2026 (general EU/EEA/CH window)",
        "deadlineNonEU": "3 Aug 2026 (earlier deadline for non-EU/EEA)",
        "windowLabel": "Joint UniVie & MedUni",
        "desc": "Computational life sciences, deep learning for genomics and protein folding (AlphaFold paradigms), algorithmic molecular biology, and large-scale biomedical high-performance analytics.",
        "tags": [
            "120 ECTS",
            "English",
            "Bioinformatics",
            "Deep Learning",
            "AlphaFold",
            "Genomics"
        ],
        "lang": "English",
        "url": "https://bioinformatics.univie.ac.at/",
        "applyUrl": "https://uspace.univie.ac.at/en/",
        "feeEU": "Free (ÖH fee only, €26.20/sem)",
        "feeEUNote": "within standard duration + 2 tolerance semesters; €363.36/sem after",
        "feeNonEU": "€726.72/semester",
        "feeApp": "No separate application fee",
        "feeFree": True
    },
    {
        "title": "Human-Computer Interaction (MSc)",
        "inst": "Paris Lodron University of Salzburg",
        "field": "Human-Computer Interaction",
        "status": "open",
        "statusLabel": "Open now",
        "sortDate": "2026-10-31",
        "dateLabel": "Winter intake runs to 31 Oct 2026",
        "deadlineEU": "31 Oct 2026",
        "deadlineNonEU": "1 Sep 2026",
        "windowLabel": "Joint PLUS & FH Salzburg",
        "desc": "Joint English Master by Paris Lodron University of Salzburg and Salzburg UAS. Covers multimodal interaction, generative AI UX, augmented & virtual reality, and user research methodologies.",
        "tags": [
            "120 ECTS",
            "English",
            "HCI / UX",
            "AR / VR",
            "Generative Interfaces",
            "Interaction Design"
        ],
        "lang": "English",
        "url": "https://www.plus.ac.at/hci",
        "applyUrl": "https://online.uni-salzburg.at/",
        "feeEU": "Free (ÖH fee only, €26.20/sem)",
        "feeEUNote": "within standard duration + 2 tolerance semesters; €363.36/sem after",
        "feeNonEU": "€726.72/semester",
        "feeApp": "No separate application fee",
        "feeFree": True
    },
    {
        "title": "Applied Machine Learning & AI Engineering (MSc)",
        "inst": "FH Upper Austria — Campus Hagenberg",
        "field": "Machine Learning & Deep Learning",
        "status": "soon",
        "statusLabel": "Opening soon ~Nov 2026",
        "sortDate": "2026-11-15",
        "dateLabel": "Next application cycle opens Nov 2026",
        "deadlineEU": "31 May 2027",
        "deadlineNonEU": "31 Mar 2027",
        "windowLabel": "Campus Hagenberg",
        "desc": "Industrial machine learning pipelines, LLMOps, model distillation, edge AI deployment, automated ML testing, and cloud distributed training at Austria's flagship software engineering campus.",
        "tags": [
            "120 ECTS",
            "English",
            "MLOps",
            "Machine Learning",
            "Deep Learning",
            "Edge AI",
            "LLMOps"
        ],
        "lang": "English",
        "url": "https://www.fh-ooe.at/campus-hagenberg/",
        "applyUrl": "https://fh-ooe.at/en/application",
        "feeEU": "Free (ÖH fee only, €26.20/sem)",
        "feeEUNote": "FH Upper Austria waives tuition fees for qualified tech degrees",
        "feeNonEU": "Free / ÖH fee only",
        "feeApp": "No separate application fee; admission by interview",
        "feeFree": True
    },
    {
        "title": "Distributed Systems & Cloud Computing (MSc)",
        "inst": "University of Klagenfurt",
        "field": "Cloud Computing",
        "status": "open",
        "statusLabel": "Open now",
        "sortDate": "2026-10-31",
        "dateLabel": "Admission period open until 31 Oct 2026",
        "deadlineEU": "31 Oct 2026",
        "deadlineNonEU": "5 Sep 2026",
        "windowLabel": "Window running",
        "desc": "Specialized Informatics track focusing on distributed algorithms, container orchestration (Kubernetes), serverless paradigms, fault-tolerant consensus, and microservice architectures.",
        "tags": [
            "120 ECTS",
            "English",
            "Kubernetes",
            "Microservices",
            "Cloud Native",
            "Distributed Systems"
        ],
        "lang": "English",
        "url": "https://www.aau.at/en/study/courses/master-informatics/",
        "applyUrl": "https://campus.aau.at/",
        "feeEU": "Free (ÖH fee only, €26.20/sem)",
        "feeEUNote": "within standard duration + 2 tolerance semesters; €363.36/sem after",
        "feeNonEU": "€726.72/semester",
        "feeApp": "No separate application fee",
        "feeFree": True
    },
    {
        "title": "Robotics, Cognition, Intelligence (MSc)",
        "inst": "Technical University of Munich",
        "field": "Robotics & Autonomous Systems",
        "status": "soon",
        "statusLabel": "Opening soon ~Jan 2027",
        "sortDate": "2027-01-15",
        "dateLabel": "Applications open 1 Jan – 31 May 2027",
        "deadlineEU": "31 May 2027",
        "deadlineNonEU": "31 Mar 2027",
        "windowLabel": "TUM Department of CIT",
        "desc": "World-renowned Master combining robotics, cognitive systems, machine perception, and deep learning for humanoid and autonomous mobile systems at Germany's #1 university.",
        "tags": [
            "120 ECTS",
            "English",
            "QS #28 World",
            "Robotics",
            "Deep Learning",
            "Machine Learning",
            "TUM"
        ],
        "lang": "English",
        "url": "https://www.cit.tum.de/en/cit/studies/degree-programs/master-robotics-cognition-intelligence/",
        "applyUrl": "https://campus.tum.de/",
        "feeEU": "Free (Semester ticket only, ~€150/sem)",
        "feeEUNote": "Regular public university model; nominal solidarity/student services fee",
        "feeNonEU": "€4,000–6,000/semester",
        "feeApp": "TUM Uni-Assist preliminary review fee applies",
        "feeFree": False
    },
    {
        "title": "Machine Learning & Data Engineering (MSc)",
        "inst": "Technical University of Munich",
        "field": "Machine Learning & Deep Learning",
        "status": "soon",
        "statusLabel": "Opening soon ~Jan 2027",
        "sortDate": "2027-01-15",
        "dateLabel": "Applications open 1 Jan – 31 May 2027",
        "deadlineEU": "31 May 2027",
        "deadlineNonEU": "31 Mar 2027",
        "windowLabel": "Munich Data Science Hub",
        "desc": "Elite Master program covering deep learning foundations, statistical learning, geometric deep learning, and scalable distributed training on high-performance compute clusters.",
        "tags": [
            "120 ECTS",
            "English",
            "QS #28 World",
            "Deep Learning",
            "Machine Learning",
            "ELLIS Munich",
            "Big Data"
        ],
        "lang": "English",
        "url": "https://www.cit.tum.de/en/cit/studies/degree-programs/master-data-engineering-and-analytics/",
        "applyUrl": "https://campus.tum.de/",
        "feeEU": "Free (Semester fee only, ~€150/sem)",
        "feeEUNote": "Regular public university model; nominal solidarity/student services fee",
        "feeNonEU": "€4,000–6,000/semester",
        "feeApp": "TUM Uni-Assist preliminary review fee applies",
        "feeFree": False
    },
    {
        "title": "Digital Healthcare & Medical Informatics (MSc)",
        "inst": "UAS St. Pölten",
        "field": "Bioinformatics",
        "status": "soon",
        "statusLabel": "Opening soon ~Oct 2026",
        "sortDate": "2026-10-15",
        "dateLabel": "Next cycle opens Oct 2026 for Autumn 2027",
        "deadlineEU": "31 May 2027",
        "deadlineNonEU": "31 Mar 2027",
        "windowLabel": "St. Pölten HealthTech Hub",
        "desc": "Intersection of medical AI, clinical data standards (HL7/FHIR), biomedical signal analysis, and regulatory software engineering for certified health tech applications.",
        "tags": [
            "120 ECTS",
            "English/German",
            "Medical AI",
            "HealthTech",
            "Bioinformatics",
            "FHIR"
        ],
        "lang": "English/German",
        "url": "https://www.fhstp.ac.at/en/academic-programmes/digital-technologies/digital-healthcare",
        "applyUrl": "https://bewerbung.fhstp.ac.at/",
        "feeEU": "€363.36/semester",
        "feeEUNote": "standard FH statutory tuition fee",
        "feeNonEU": "€363.36/semester",
        "feeApp": "No separate application fee",
        "feeFree": False
    },
    {
        "title": "Media Informatics (Dipl.-Ing. / MSc)",
        "inst": "TU Wien Informatics",
        "field": "Human-Computer Interaction",
        "status": "open",
        "statusLabel": "Open now",
        "sortDate": "2026-10-31",
        "dateLabel": "General admission period runs to 31 Oct 2026",
        "deadlineEU": "General admission period runs to 31 Oct 2026",
        "deadlineNonEU": "3 Aug 2026 (Winter) / 5 Jan 2027 (Summer)",
        "windowLabel": "Window running",
        "desc": "Human-centered computing, interactive systems, computer audio processing, immersive virtual environments, and generative multimedia engineering.",
        "tags": [
            "Dipl.-Ing. (≈MSc)",
            "English",
            "Media Tech",
            "Audio DSP",
            "HCI",
            "Creative AI"
        ],
        "lang": "English",
        "url": "https://informatics.tuwien.ac.at/master/media-informatics/",
        "applyUrl": "https://tiss.tuwien.ac.at/aufnahme/aufnahmeverfahren",
        "feeEU": "Free (ÖH fee only, €26.20/sem)",
        "feeEUNote": "within standard duration + 2 tolerance semesters; €363.36/sem after",
        "feeNonEU": "€726.72/semester",
        "feeApp": "No separate application fee",
        "feeFree": True
    }
]

existing_keys = set((p["title"].lower(), p["inst"].lower()) for p in programs)

added = 0
for np in new_programs:
    key = (np["title"].lower(), np["inst"].lower())
    if key not in existing_keys:
        programs.append(np)
        existing_keys.add(key)
        added += 1

print(f"Added {added} new high-demand tech programs. Total programs now: {len(programs)}")

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(programs, f, indent=2, ensure_ascii=False)
