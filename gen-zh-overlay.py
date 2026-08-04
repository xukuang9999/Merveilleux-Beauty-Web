#!/usr/bin/env python3
"""Regenerate the `products` section of src/i18n/content/zh.ts from the enriched
bilingual product cards in content/extracted/zh/*.json.

    python3 gen-zh-overlay.py            # rewrite zh.ts products section in place
    python3 gen-zh-overlay.py --print    # print the block to stdout, write nothing

English copy lives in the canonical DB columns (loaded by src/db/import-extracted.ts);
this overlay carries the Chinese (name_zh / tagline_zh / overview_zh / benefits_zh),
keyed by the same slug the importer uses. keyIngredients are the universal English
INCI (same as canonical) — INCI is conventionally shown in Latin. The other overlay
sections (testimonials / faqs / modules / kb) are left untouched.
"""
import json, glob, os, sys

ZH_TS = os.path.join("src", "i18n", "content", "zh.ts")
CARDS = os.path.join("content", "extracted", "zh")
TYPE_ZH = {"product": "产品", "treatment": "护理疗程", "bundle": "套装"}


def dq(s):
    return json.dumps(s, ensure_ascii=False)


def arr(items, indent):
    if not items:
        return "[]"
    pad = " " * indent
    return "[\n" + ",\n".join(f"{pad}  {dq(x)}" for x in items) + "\n" + pad + "]"


def build_block():
    entries = []
    for f in sorted(glob.glob(os.path.join(CARDS, "*.json"))):
        c = json.load(open(f, encoding="utf-8"))
        slug = os.path.basename(f)[:-5]
        b = [
            f'    {dq(slug)}: {{',
            f'      "name": {dq(c.get("name_zh") or c.get("name_en") or slug)},',
            f'      "type": {dq(TYPE_ZH.get(c.get("type") or "product", "产品"))},',
            f'      "tagline": {dq(c.get("tagline_zh") or "")},',
            f'      "description": {dq(c.get("overview_zh") or "")},',
            f'      "keyIngredients": {arr(c.get("key_ingredients") or [], 6)},',
            f'      "benefits": {arr(c.get("benefits_zh") or [], 6)}',
            '    }',
        ]
        entries.append("\n".join(b))
    return '  "products": {\n' + ",\n".join(entries) + "\n  },"


def main():
    block = build_block()
    if "--print" in sys.argv:
        print(block)
        return
    src = open(ZH_TS, encoding="utf-8").read()
    start = src.index('  "products": {')
    end = src.index('  "testimonials": {')
    open(ZH_TS, "w", encoding="utf-8").write(src[:start] + block + "\n" + src[end:])
    n = len(glob.glob(os.path.join(CARDS, "*.json")))
    print(f"Rewrote {ZH_TS} products section — {n} entries.")


if __name__ == "__main__":
    main()
