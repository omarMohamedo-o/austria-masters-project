#!/usr/bin/env python3
"""
Regenerates the embedded FALLBACK_DATA array inside frontend/index.html
from data/programs.json, so the standalone HTML file always has a
reasonably fresh offline snapshot even if nobody's running the backend.

Run this after you (or a reviewer, following data/REVIEW_NEEDED.md) hand-
edit data/programs.json:

    python3 scripts/build_frontend.py

Then commit both data/programs.json and frontend/index.html together.
"""
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PROGRAMS_FILE = BASE_DIR / "data" / "programs.json"
FRONTEND_FILE = BASE_DIR / "frontend" / "index.html"


def to_js_literal(value, indent=2):
    """Pretty-print a Python object as a JS object/array literal with
    unquoted keys, matching the style already used in index.html."""
    pad = " " * indent
    if isinstance(value, dict):
        lines = ["{"]
        for k, v in value.items():
            lines.append(f'{pad}  {k}: {to_js_literal(v, indent + 2)},')
        lines.append(pad + "}")
        return "\n".join(lines)
    if isinstance(value, list):
        lines = ["["]
        for item in value:
            lines.append(f"{pad}  {to_js_literal(item, indent + 2)},")
        lines.append(pad + "]")
        return "\n".join(lines)
    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return "null"
    if isinstance(value, (int, float)):
        return json.dumps(value)
    # string: JSON-encode for safe escaping, JS double-quoted strings are JSON-compatible
    return json.dumps(value, ensure_ascii=False)


def main():
    with open(PROGRAMS_FILE, encoding="utf-8") as f:
        programs = json.load(f)

    js_array = to_js_literal(programs, indent=0)
    new_block = f"const FALLBACK_DATA = {js_array};"

    html = FRONTEND_FILE.read_text(encoding="utf-8")
    pattern = re.compile(r"const FALLBACK_DATA = \[.*?\n\];", re.DOTALL)
    if not pattern.search(html):
        raise SystemExit(
            "Could not find 'const FALLBACK_DATA = [...];' block in "
            f"{FRONTEND_FILE}. Has the file structure changed?"
        )
    new_html = pattern.sub(new_block.replace("\\", "\\\\"), html, count=1)

    # also bump the visible "N programmes tracked" count if present
    new_html = re.sub(
        r"<span><b>\d+</b> programmes tracked</span>",
        f"<span><b>{len(programs)}</b> programmes tracked</span>",
        new_html,
        count=1,
    )

    FRONTEND_FILE.write_text(new_html, encoding="utf-8")
    print(f"Synced {len(programs)} programmes from {PROGRAMS_FILE.name} "
          f"into {FRONTEND_FILE.relative_to(BASE_DIR)}")


if __name__ == "__main__":
    main()
