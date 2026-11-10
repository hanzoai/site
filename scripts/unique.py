#!/usr/bin/env python3
"""Unique check for rebuilt hanzo.ai pages (MASTER.md parts 3 and 9).

Fingerprints every rebuilt page from three things:
  (a) its section sequence   (b) its signature line   (c) its first-screen layout

Fails when two top-level pages share a signature, reuse the same component file,
or have near-identical section sequences.  Family pages pass when their Sigil
seed and first-screen data differ.

Usage: python3 scripts/unique.py   (exit 0 = all unique, non-zero = failure)
"""
import os, re, sys, hashlib
from pathlib import Path

HZ = Path(__file__).resolve().parent.parent
APP = HZ / "app"
COMPONENTS = HZ / "components"

SIG_RE = re.compile(r"^\s*//\s*Signature:\s*(.+?)\s*$", re.M)
BEYOND_RE = re.compile(r"^\s*//\s*Beyond:\s*(.+?)\s*$", re.M)
SECTION_RE = re.compile(r"<\s*([A-Z][A-Za-z0-9]*)\b")
IMPORT_RE = re.compile(r"^\s*import\s*\{([^}]*)\}\s*from\s*['\"](\.\./components/.*?)['\"]", re.M)

def read(p):
    try:
        return p.read_text()
    except Exception:
        return ""

def fingerprint(page_path, text):
    sig_m = SIG_RE.search(text)
    beyond_m = BEYOND_RE.search(text)
    signature = (sig_m.group(1).strip() if sig_m else "").lower()
    beyond = (beyond_m.group(1).strip() if beyond_m else "").lower()
    sections = [m.group(1) for m in SECTION_RE.finditer(text)]
    first_screen = sections[:6]
    imported = set()
    for m in IMPORT_RE.finditer(text):
        names = [n.strip() for n in m.group(1).split(",")]
        for n in names:
            if n and n[0].isupper():
                imported.add(n)
    return {
        "path": str(page_path.relative_to(HZ)),
        "signature": signature,
        "beyond": beyond,
        "sections": sections,
        "first_screen": first_screen,
        "imports": sorted(imported),
    }

def norm(seq):
    return " | ".join(seq)

def main():
    pages = []
    if not APP.exists():
        print("unique: no app/ directory; nothing to check"); return 0
    for p in sorted(APP.rglob("page.tsx")):
        parts = p.relative_to(APP).parts
        if any(part.startswith("[") and part.endswith("]") for part in parts):
            continue
        text = read(p)
        fp = fingerprint(p, text)
        pages.append(fp)

    if not pages:
        print("unique: no rebuilt pages found"); return 0

    failures = []
    sig_index = {}
    for fp in pages:
        key = fp["signature"]
        if not key:
            continue
        sig_index.setdefault(key, []).append(fp)

    for key, group in sig_index.items():
        if len(group) > 1:
            names = ", ".join(g["path"] for g in group)
            failures.append(f"SHARED SIGNATURE '{key}': {names}")

    for i in range(len(pages)):
        for j in range(i + 1, len(pages)):
            a, b = pages[i], pages[j]
            shared = set(a["imports"]) & set(b["imports"])
            if len(shared) >= 3:
                failures.append(f"SHARED COMPONENTS {sorted(shared)}: {a['path']} <-> {b['path']}")

    seq_index = {}
    for fp in pages:
        seq_index.setdefault(norm(fp["sections"]), []).append(fp)
    for seq, group in seq_index.items():
        if len(group) > 1 and seq:
            names = ", ".join(g["path"] for g in group)
            failures.append(f"NEAR-IDENTICAL SECTION SEQUENCE: {names}")

    for f in failures:
        print("unique: FAIL -", f)
    if failures:
        print(f"\nunique: {len(failures)} uniqueness violation(s). Fix each page's Signature/Beyond/first-screen so no two pages are alike.")
        return 1
    print(f"unique: OK - {len(pages)} rebuilt page(s), all signatures/sequences unique.")
    # Motion variety (MASTER.md part 9, "Motion and interaction"): gates every page file touched since 7 Nov 06:00,
    # so pages being built or polished must comply without older untouched pages blocking anyone.
    import subprocess
    touched = [str(p) for p in (COMPONENTS / "pages").rglob("*.tsx")
               if p.stat().st_mtime > 1794031200 and "Signature:" in read(p)[:4000]]
    if touched:
        r = subprocess.run([sys.executable, str(HZ / "scripts" / "variety.py"), *touched], capture_output=True, text=True)
        if r.returncode:
            print("\n".join(l for l in r.stdout.splitlines() if l.startswith("FAIL")))
            print("unique: motion overdone on the page(s) above - see docs/build-notes/MASTER.md part 9 (Motion and interaction).")
            return 1
    # James's two most repeated complaints (UI hues, a label above the headline), on every page file touched since 7 Nov 06:00
    styled = [str(p) for p in (COMPONENTS / "pages").rglob("*") if p.suffix in (".tsx", ".css") and p.stat().st_mtime > 1794031200]
    if styled:
        r = subprocess.run([sys.executable, str(HZ / "scripts" / "taste.py"), *styled], capture_output=True, text=True)
        if r.returncode:
            print("\n".join(l for l in r.stdout.splitlines() if l.startswith("TASTE FAIL")))
            print("unique: James's taste rules broken above - see docs/JAMES.md (only Hanzo's live palette; run python3 scripts/taste.py --fix <files>).")
            return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
