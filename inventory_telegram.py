#!/usr/bin/env python3
"""Step 1 - Telegram export inventory (READ-ONLY).
Usage: python3 inventory_telegram.py ./ChatExport_2026-07-14"""
import csv, json, re, sys
from pathlib import Path

PRICE_RE = re.compile(r"(?:RM|rm)\s?\d{1,4}(?:[.,]\d{2})?")
SIZE_RE = re.compile(r"\b\d{1,4}\s?(?:ml|ML|mL|g|G)\b")
KEYWORD_RE = re.compile(
    r"serum|cream|cleanser|toner|mask|essence|spf|sunscreen|"
    r"精华|面霜|洗面|洁面|爽肤|面膜|防晒|乳液|套装|功效|成分|用法",
    re.IGNORECASE)

def flatten_text(t):
    if isinstance(t, str): return t
    if isinstance(t, list):
        return "".join(p if isinstance(p, str) else p.get("text", "") for p in t)
    return ""

def main():
    if len(sys.argv) != 2:
        print(__doc__); sys.exit(1)
    export_dir = Path(sys.argv[1]).expanduser().resolve()
    rj = export_dir / "result.json"
    if not rj.exists():
        print(f"ERROR: {rj} not found. Re-export as Machine-readable JSON."); sys.exit(1)
    print(f"Reading {rj} ...")
    data = json.load(open(rj, encoding="utf-8"))
    messages = data.get("messages", [])
    print(f"Chat name : {data.get('name','(unknown)')}")
    rows, dates = [], []
    c = dict(total=0, with_text=0, with_photo=0, with_video=0,
             with_file=0, price=0, size=0, keyword=0, candidates=0)
    for m in messages:
        if m.get("type") != "message": continue
        c["total"] += 1
        text = flatten_text(m.get("text", "")).strip()
        has_photo = "photo" in m
        has_video = m.get("media_type") == "video_file"
        has_file = "file" in m and not has_video
        date = m.get("date", "")
        if date: dates.append(date)
        price = bool(PRICE_RE.search(text)); size = bool(SIZE_RE.search(text))
        kw = bool(KEYWORD_RE.search(text))
        if text: c["with_text"] += 1
        if has_photo: c["with_photo"] += 1
        if has_video: c["with_video"] += 1
        if has_file: c["with_file"] += 1
        if price: c["price"] += 1
        if size: c["size"] += 1
        if kw: c["keyword"] += 1
        cand = (kw and (price or size)) or (has_photo and len(text) > 120)
        if cand: c["candidates"] += 1
        rows.append({"msg_id": m.get("id",""), "date": date[:10],
            "has_photo": int(has_photo), "has_video": int(has_video),
            "has_file": int(has_file), "text_len": len(text),
            "price_found": int(price), "size_found": int(size),
            "keyword_found": int(kw), "candidate": int(cand),
            "preview": text[:80].replace("\n"," ")})
    out = export_dir / "inventory.csv"
    with open(out, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else [])
        w.writeheader(); w.writerows(rows)
    print("\n================ SUMMARY ================")
    if dates: print(f"Date range        : {min(dates)[:10]} -> {max(dates)[:10]}")
    print(f"Messages          : {c['total']}")
    print(f"  with text       : {c['with_text']}")
    print(f"  with photo      : {c['with_photo']}")
    print(f"  with video      : {c['with_video']}")
    print(f"  with other file : {c['with_file']}")
    print(f"Price mentions    : {c['price']}")
    print(f"Size mentions     : {c['size']}")
    print(f"Product keywords  : {c['keyword']}")
    print(f"PRODUCT CANDIDATES: {c['candidates']}")
    print(f"\nWrote: {out}")

if __name__ == "__main__":
    main()
