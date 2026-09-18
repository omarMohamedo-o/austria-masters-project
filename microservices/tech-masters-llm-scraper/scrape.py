#!/usr/bin/env python3
"""
Austria Tech Masters Tracker — AI-powered change-detection scraper.

This script uses Playwright to render JavaScript-heavy university pages,
extracts the text, and uses Google Gemini to automatically parse out 
updated deadlines, fees, and statuses, directly updating programs.json.
"""
import hashlib
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright
from google import genai
from pydantic import BaseModel, Field

SERVICE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SERVICE_DIR.parent.parent
SOURCES_FILE = SERVICE_DIR / "sources.json"
PROGRAMS_FILE = PROJECT_ROOT / "data" / "programs.json"
SNAPSHOT_DIR = PROJECT_ROOT / "data" / "snapshots"
META_FILE = PROJECT_ROOT / "data" / "meta.json"
REQUEST_DELAY_SECONDS = 2

# Initialize Gemini Client (requires GEMINI_API_KEY env var)
# If not present, we will fallback to simple diffing or skip AI update
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

class ProgramUpdate(BaseModel):
    status: str = Field(description="One of: open, soon, unknown, closed")
    statusLabel: str
    sortDate: str = Field(description="YYYY-MM-DD format")
    dateLabel: str
    deadlineEU: str
    deadlineNonEU: str
    windowLabel: str
    feeEU: str
    feeNonEU: str

def fetch_text_playwright(url: str) -> str:
    """Fetch visible text from a URL using Playwright."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto(url, timeout=30000, wait_until="domcontentloaded")
            # Remove scripts and styles
            page.evaluate('''() => {
                document.querySelectorAll('script, style, noscript, header, footer, nav').forEach(el => el.remove());
            }''')
            text = page.locator("body").inner_text()
            lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
            return "\n".join(lines)
        finally:
            browser.close()

def sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def ask_ai_for_update(program_json: dict, new_text: str) -> dict:
    """Use Gemini to extract updated fields based on the new page text."""
    if not client:
        return program_json # No-op if no API key
        
    prompt = f"""
    You are an expert data extractor. The following is the current JSON data for a Master's program:
    {json.dumps(program_json, indent=2)}
    
    The university website has updated. Here is the new text from the admissions page:
    {new_text[:15000]} # Limit to avoid context bloat
    
    Please extract the updated deadlines, fees, and status. Return a JSON object with the updated fields matching the schema.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': ProgramUpdate,
            },
        )
        updated_fields = json.loads(response.text)
        # Merge updates
        for k, v in updated_fields.items():
            program_json[k] = v
        return program_json
    except Exception as e:
        print(f"AI Update failed: {e}", file=sys.stderr)
        return program_json

def main():
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    
    with open(SOURCES_FILE, encoding="utf-8") as f:
        config = json.load(f)
        
    with open(PROGRAMS_FILE, encoding="utf-8") as f:
        programs = json.load(f)
        
    sources = config.get("sources", [])
    programs_by_title = {p["title"] + p["inst"]: p for p in programs}

    warnings = []
    checked = 0
    errored = 0
    updated_count = 0

    for src in sources:
        sid = src["id"]
        for url in src["urls"]:
            checked += 1
            try:
                text = fetch_text_playwright(url)
            except Exception as exc:
                errored += 1
                msg = f"[{sid}] Could not fetch {url}: {exc}"
                warnings.append(msg)
                print("ERROR:", msg, file=sys.stderr)
                time.sleep(REQUEST_DELAY_SECONDS)
                continue

            snapshot_path = SNAPSHOT_DIR / f"{sid}.txt"
            new_hash = sha256(text)
            old_text = snapshot_path.read_text(encoding="utf-8") if snapshot_path.exists() else None
            old_hash = sha256(old_text) if old_text is not None else None

            if old_hash is None:
                snapshot_path.write_text(text, encoding="utf-8")
                print(f"[{sid}] baseline snapshot saved")
            elif new_hash != old_hash:
                print(f"[{sid}] CHANGED — querying AI for updates...")
                snapshot_path.write_text(text, encoding="utf-8")
                
                # Find matching program
                prog_key = src.get("title", "") + src.get("inst", "")
                if prog_key in programs_by_title:
                    prog = programs_by_title[prog_key]
                    updated_prog = ask_ai_for_update(prog, text)
                    if updated_prog != prog:
                        programs_by_title[prog_key] = updated_prog
                        updated_count += 1
                        print(f"[{sid}] Successfully updated via AI.")
            else:
                print(f"[{sid}] no change")

            time.sleep(REQUEST_DELAY_SECONDS)

    # Write updated programs back
    if updated_count > 0:
        with open(PROGRAMS_FILE, "w", encoding="utf-8") as f:
            # Reconstruct list from dict to preserve order roughly
            json.dump(list(programs_by_title.values()), f, indent=2, ensure_ascii=False)
            f.write('\n')

    meta = {
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "sources_checked": checked,
        "sources_errored": errored,
        "changes_detected_and_updated": updated_count,
        "warnings": warnings,
        "ai_enabled": bool(client)
    }
    with open(META_FILE, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

    print("\n--- Summary ---")
    print(json.dumps(meta, indent=2))
    sys.exit(1 if errored else 0)

if __name__ == "__main__":
    main()
