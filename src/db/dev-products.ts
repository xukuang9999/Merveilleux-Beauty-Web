// Local-dev product fixture — NOT part of the storefront seed catalogue.
// seedProducts (src/lib/seed-data.ts) stays empty so production shows only the
// real, admin-managed DB rows. db:seed inserts these so a freshly seeded
// local.db has the 7 real products to develop against. This is a snapshot and
// may drift from later admin edits in production; refresh by re-exporting.
import type { products } from "./schema";

type DevProduct = typeof products.$inferInsert;

export const devProducts: DevProduct[] = [
  {
    "slug": "intensive-hydro-treatment-silk-mask",
    "name": "Intensive Hydro-Treatment Silk Mask",
    "type": "Silk Treatment Mask",
    "tagline": "72-hour intensive hydration silk mask",
    "description": "Specially for dehydrated skin — intensive calming, soothing and deep hydration that brightens and lifts. Enhances moisture retention, protects cell membranes and improves the skin's resistance to ageing. 5 silk sheet masks.",
    "keyIngredients": [],
    "benefits": [
      "72-hour moisture retention",
      "Calms & soothes dehydrated skin",
      "Brightens and lifts"
    ],
    "priceRM": "RM168",
    "graphic": "/images/products/merveilleux-intensive-hydro-treatment-silk-mask.jpg",
    "sortOrder": 101,
    "published": true
  },
  {
    "slug": "intensive-restoration-treatment-silk-mask",
    "name": "Intensive Restoration Treatment Silk Mask",
    "type": "Silk Treatment Mask",
    "tagline": "Repairing silk mask for sensitive, blemish-prone skin",
    "description": "Designed for sensitive, blemish-prone skin — antioxidant, anti-bacterial and anti-inflammatory. Helps repair cells, normalise skin condition, calm breakouts and restore a healthy barrier. 5 silk sheet masks.",
    "keyIngredients": [],
    "benefits": [
      "Soothes sensitive",
      "blemish-prone skin",
      "Antioxidant & anti-inflammatory",
      "Supports barrier repair"
    ],
    "priceRM": "RM178",
    "graphic": "/images/products/merveilleux-intensive-restoration-treatment-silk-mask.jpg",
    "sortOrder": 102,
    "published": true
  },
  {
    "slug": "daily-care-trial-set",
    "name": "Daily Care Trial Set",
    "type": "Trial Set",
    "tagline": "Cleanse · refine · hydrate — daily essentials",
    "description": "A 3-piece daily essentials trial set: Gentle Cleansing Milk (30ml), Ultrafine Cleansing Gel (20ml) and Ceramide Ice-Essence Toner (30ml).",
    "keyIngredients": [],
    "benefits": [
      "Complete daily cleanse routine",
      "Refines and tones",
      "Trial sizes to try the range"
    ],
    "priceRM": "RM168",
    "graphic": "/images/products/merveilleux-daily-care-trial-set.png",
    "sortOrder": 103,
    "published": true
  },
  {
    "slug": "repairing-hydrating-trial-set",
    "name": "Repairing + Hydrating Trial Set",
    "type": "Trial Set",
    "tagline": "Repair & deep-hydrate trio",
    "description": "A 3-piece repair-and-hydrate trial set: Intensive Restoration Serum (10ml), Hydro-Sensi Concentre (10ml) and Hydro Moist Serum (10ml).",
    "keyIngredients": [],
    "benefits": [
      "Targets repair and hydration",
      "Layerable serum trio",
      "Trial sizes"
    ],
    "priceRM": "RM288",
    "graphic": "/images/products/merveilleux-repairing-hydrating-trial-set.png",
    "sortOrder": 104,
    "published": true
  },
  {
    "slug": "brightening-hydrating-trial-set",
    "name": "Brightening + Hydrating Trial Set",
    "type": "Trial Set",
    "tagline": "Brighten & hydrate trio",
    "description": "A 3-piece brighten-and-hydrate trial set featuring OXY-Bright Serum (10ml) and Hydro Moist Serum (10ml), plus one more serum (to be confirmed).",
    "keyIngredients": [],
    "benefits": [
      "Brightening + hydration",
      "Layerable serum trio",
      "Trial sizes"
    ],
    "priceRM": "RM288",
    "graphic": "/images/products/merveilleux-brightening-hydrating-trial-set.png",
    "sortOrder": 105,
    "published": true
  },
  {
    "slug": "congested-set",
    "name": "Congested Set",
    "type": "Trial Set",
    "tagline": "Clarify & de-congest trio",
    "description": "A 3-piece trial set for congested skin: Intensive Restoration Serum (10ml), Pore Refine Serum (5ml) and Hydro-Sensi Concentre (10ml).",
    "keyIngredients": [],
    "benefits": [
      "Clears congestion & refines pores",
      "For oily / blemish-prone skin",
      "Trial sizes"
    ],
    "priceRM": "RM260",
    "graphic": "/images/products/merveilleux-congested-set.png",
    "sortOrder": 106,
    "published": true
  },
  {
    "slug": "pimples-trial-set",
    "name": "Pimples Trial Set",
    "type": "Trial Set",
    "tagline": "Blemish-care trio",
    "description": "A 3-piece trial set for blemish-prone skin: Intensive Restoration Serum (10ml), Blemish Serum (10ml) and Hydro-Sensi Concentre (10ml).",
    "keyIngredients": [],
    "benefits": [
      "Calms breakouts",
      "For blemish-prone skin",
      "Trial sizes"
    ],
    "priceRM": "RM260",
    "graphic": "/images/products/merveilleux-pimples-trial-set.png",
    "sortOrder": 107,
    "published": true
  }
];
