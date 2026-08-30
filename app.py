import streamlit as st
import requests
from datetime import date, timedelta

st.set_page_config(
    page_title="Hotel Loyalty",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ============================================================
# HOTEL LOYALTY FINDER
# Live hotel data: StayAPI / Google Hotels
# Personal loyalty + points + Amex offers
# ============================================================

API_URL = "https://api.stayapi.com/v1/google_hotels/search"
USAGE_URL = "https://api.stayapi.com/v1/account/usage"

DEFAULT_STATUS = {
    "Hilton Honors": "Gold",
    "Marriott Bonvoy": "Platinum Elite",
    "IHG One Rewards": "Club Member",
    "ALL - Accor Live Limitless": "Silver",
    "Radisson Rewards": "Premium",
    "MeliáRewards": "Gold",
    "GHA DISCOVERY": "Gold",
    "Wyndham Rewards": "Gold",
    "WorldHotels Rewards": "Gold",
    "Best Western Rewards": "Gold",
}

DEFAULT_POINTS = {program: 0 for program in DEFAULT_STATUS}

DEFAULT_POINT_VALUE_EUR_PER_1000 = {
    "Hilton Honors": 4.0,
    "Marriott Bonvoy": 7.0,
    "IHG One Rewards": 5.0,
    "ALL - Accor Live Limitless": 20.0,
    "Radisson Rewards": 3.0,
    "MeliáRewards": 4.0,
    "GHA DISCOVERY": 50.0,
    "Wyndham Rewards": 7.0,
    "WorldHotels Rewards": 5.0,
    "Best Western Rewards": 5.0,
}

PERSONAL_PROMOTIONS = {
    "MeliáRewards": 20,
}

DEFAULT_AMEX_OFFERS = [
    {
        "name": "WorldHotels",
        "spend": 250.0,
        "credit": 50.0,
        "expires": "",
        "active": True,
    }
]

PROGRAMS = {
    "Hilton Honors": {
        "brands": [
            "Waldorf Astoria", "Conrad", "LXR", "NoMad", "Canopy",
            "Hilton", "Curio", "DoubleTree", "Tapestry",
            "Embassy Suites", "Hilton Garden Inn", "Hampton",
            "Homewood Suites", "Home2 Suites", "Tru",
        ],
        "statuses": {
            "Member": ["Member Rate", "Punkte sammeln", "Kostenloses WLAN"],
            "Silver": ["20 % Bonuspunkte", "5. Nacht bei Prämienaufenthalten kostenlos"],
            "Gold": [
                "80 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Frühstück außerhalb der USA / Food & Beverage Credit in den USA",
                "5. Nacht bei Prämienaufenthalten kostenlos",
                "MyWay-Vorteile je nach Marke",
            ],
            "Diamond": [
                "100 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Frühstück bzw. Food & Beverage Credit",
                "Executive Lounge bei teilnehmenden Hotels",
                "Premium WLAN",
            ],
            "Diamond Reserve": [
                "Alle Diamond-Vorteile",
                "Zusätzliche Diamond Reserve Vorteile",
            ],
        },
    },
    "Marriott Bonvoy": {
        "brands": [
            "The Ritz-Carlton", "St. Regis", "JW Marriott", "W Hotels",
            "EDITION", "The Luxury Collection", "Marriott Hotels",
            "Sheraton", "Westin", "Renaissance", "Le Méridien",
            "Autograph Collection", "Tribute Portfolio", "Delta Hotels",
            "Courtyard", "Four Points", "Aloft", "Moxy", "Element",
            "AC Hotels", "Residence Inn", "TownePlace Suites",
        ],
        "statuses": {
            "Member": ["Member Rate", "Punkte sammeln", "Kostenloses WLAN"],
            "Silver Elite": ["10 % Punktebonus", "Late Check-out nach Verfügbarkeit"],
            "Gold Elite": [
                "25 % Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
            ],
            "Platinum Elite": [
                "50 % Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit, einschließlich ausgewählter Suiten",
                "Late Check-out bis 16:00 Uhr nach Verfügbarkeit",
                "Willkommensgeschenk",
                "Lounge-Zugang bei teilnehmenden Marken",
            ],
            "Titanium Elite": [
                "75 % Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit, einschließlich ausgewählter Suiten",
                "Late Check-out bis 16:00 Uhr nach Verfügbarkeit",
                "Willkommensgeschenk",
                "Lounge-Zugang bei teilnehmenden Marken",
            ],
        },
    },
    "IHG One Rewards": {
        "brands": [
            "InterContinental", "Six Senses", "Regent", "Kimpton",
            "Vignette Collection", "Hotel Indigo", "Crowne Plaza",
            "voco", "EVEN Hotels", "Holiday Inn", "Holiday Inn Express",
            "Staybridge Suites", "Candlewood Suites",
        ],
        "statuses": {
            "Club Member": ["Member Rate", "Punkte sammeln", "Kostenloses WLAN"],
            "Silver Elite": ["20 % Punktebonus", "Member Rate", "Kostenloses WLAN"],
            "Gold Elite": ["40 % Punktebonus", "Member Rate", "Kostenloses WLAN"],
            "Platinum Elite": [
                "60 % Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Member Rate",
                "Kostenloses WLAN",
                "Late Check-out nach Verfügbarkeit",
            ],
            "Diamond Elite": [
                "100 % Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Frühstück bei teilnehmenden Marken",
                "Member Rate",
                "Kostenloses WLAN",
                "Late Check-out nach Verfügbarkeit",
            ],
        },
    },
    "ALL - Accor Live Limitless": {
        "brands": [
            "Raffles", "Fairmont", "Sofitel", "MGallery", "Pullman",
            "Swissôtel", "Mövenpick", "Grand Mercure", "Novotel",
            "Mercure", "Adagio", "ibis", "25hours", "Mondrian", "The Hoxton",
        ],
        "statuses": {
            "Classic": ["Member Rate", "Premium WLAN", "Reward Points sammeln"],
            "Silver": [
                "Welcome Drink",
                "Priority Welcome",
                "Late Check-out nach Verfügbarkeit",
                "24 % Reward-Points-Bonus",
            ],
            "Gold": [
                "Welcome Drink",
                "Priority Welcome",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in oder Late Check-out",
                "48 % Reward-Points-Bonus",
            ],
            "Platinum": [
                "Welcome Drink",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Suite Night Upgrade(s)",
                "Lounge-Zugang bei teilnehmenden Hotels",
                "Early Check-in und Late Check-out",
                "76 % Reward-Points-Bonus",
            ],
            "Diamond": [
                "Alle Platinum-Vorteile",
                "Kostenloses Frühstück am Wochenende",
                "Dining & Spa Rewards",
                "Gold-Status für eine Person deiner Wahl",
                "100 % Reward-Points-Bonus",
            ],
        },
    },
    "Radisson Rewards": {
        "brands": [
            "Radisson Collection", "Radisson Blu", "Radisson",
            "Radisson RED", "Park Plaza", "Park Inn by Radisson",
            "Country Inn & Suites", "art'otel",
        ],
        "statuses": {
            "Club": ["Member Rate", "Mitgliederrabatt", "Priority Line"],
            "Premium": [
                "Kostenloses Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Rabatt auf Speisen und Getränke",
            ],
            "VIP": [
                "Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Kostenloses Frühstück für zwei Personen",
                "VIP-Vorteile bei ausgewählten Hotels",
            ],
        },
    },
    "MeliáRewards": {
        "brands": [
            "Gran Meliá", "ME by Meliá", "Paradisus", "Meliá",
            "INNSiDE", "Zel", "TRYP", "Sol by Meliá",
        ],
        "statuses": {
            "White": ["Member Rate", "Punkte sammeln"],
            "Silver": ["Zimmer-Upgrade nach Verfügbarkeit", "Late Check-out nach Verfügbarkeit"],
            "Gold": [
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Deine persönliche 20 % Promotion",
            ],
            "Platinum": [
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Weitere Platinum-Vorteile je nach Marke",
                "Deine persönliche 20 % Promotion",
            ],
        },
    },
    "GHA DISCOVERY": {
        "brands": [
            "Anantara", "Capella", "Kempinski", "NH Collection", "NH Hotels",
            "Tivoli", "Avani", "Viceroy", "The Doyle Collection", "Pan Pacific",
        ],
        "statuses": {
            "Silver": ["4 % D$ auf anrechenbare Ausgaben", "Member Rate", "Local Offers", "Experiences"],
            "Gold": ["5 % D$ auf anrechenbare Ausgaben", "Member Rate", "Local Offers", "Experiences"],
            "Platinum": [
                "6 % D$ auf anrechenbare Ausgaben",
                "3pm Late Check-out nach Verfügbarkeit",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Welcome Amenity",
            ],
            "Titanium": [
                "7 % D$ auf anrechenbare Ausgaben",
                "Early Check-in ab 11:00 Uhr nach Verfügbarkeit",
                "Late Check-out bis 16:00 Uhr nach Verfügbarkeit",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Welcome Amenity",
                "Frühstück bei teilnehmenden Marken",
            ],
        },
    },
    "Wyndham Rewards": {
        "brands": [
            "Wyndham Grand", "Wyndham", "TRYP", "Esplendor", "Dazzler",
            "Ramada", "Ramada Encore", "Days Inn", "Super 8", "Baymont",
            "Howard Johnson", "La Quinta", "Microtel",
        ],
        "statuses": {
            "Blue": ["Member Rate", "Punkte sammeln"],
            "Gold": [
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Preferred Room nach Verfügbarkeit",
                "10 % Punktebonus",
            ],
            "Platinum": [
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Preferred Room nach Verfügbarkeit",
                "15 % Punktebonus",
            ],
            "Diamond": [
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Preferred Room nach Verfügbarkeit",
                "Suite Upgrade nach Verfügbarkeit",
                "20 % Punktebonus",
            ],
        },
    },
    "WorldHotels Rewards": {
        "brands": [
            "WorldHotels Luxury", "WorldHotels Elite",
            "WorldHotels Crafted", "WorldHotels Distinctive",
        ],
        "statuses": {
            "Red": ["Member Rate", "Punkte sammeln"],
            "Gold": [
                "Bonus auf Punkte",
                "Früher Check-in / spätere Abreise nach Verfügbarkeit",
                "Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity",
            ],
            "Platinum": [
                "Bonus auf Punkte",
                "Früher Check-in / spätere Abreise nach Verfügbarkeit",
                "Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity",
            ],
            "Diamond": [
                "Bonus auf Punkte",
                "Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity",
                "Lounge-Zugang bei teilnehmenden Hotels",
            ],
            "Diamond Select": [
                "Bonus auf Punkte",
                "Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity",
                "Lounge-Zugang",
                "Frühstück bei teilnehmenden Hotels",
            ],
        },
    },
    "Best Western Rewards": {
        "brands": [
            "Best Western", "Best Western Plus", "Best Western Premier",
            "BW Premier Collection", "Executive Residency",
            "SureStay", "SureStay Plus", "SureStay Collection",
        ],
        "statuses": {
            "Blue": ["Member Rate", "Punkte sammeln"],
            "Gold": ["10 % Bonuspunkte", "Willkommens-Amenity", "Member Rate"],
            "Platinum": [
                "15 % Bonuspunkte",
                "Willkommens-Amenity",
                "Früher Check-in / später Check-out nach Verfügbarkeit",
                "Member Rate",
            ],
            "Diamond": [
                "30 % Bonuspunkte",
                "Willkommens-Amenity",
                "Früher Check-in / später Check-out nach Verfügbarkeit",
                "Member Rate",
            ],
            "Diamond Select": [
                "50 % Bonuspunkte",
                "Willkommens-Amenity",
                "Früher Check-in / später Check-out nach Verfügbarkeit",
                "Member Rate",
            ],
        },
    },
}

# ------------------------------------------------------------
# BRAND MATCHING
# ------------------------------------------------------------

BRAND_RULES = [
    # Hilton
    ("Waldorf Astoria", "Waldorf Astoria", "Hilton Honors"),
    ("Conrad Hotels", "Conrad", "Hilton Honors"),
    ("Conrad", "Conrad", "Hilton Honors"),
    ("DoubleTree by Hilton", "DoubleTree", "Hilton Honors"),
    ("DoubleTree", "DoubleTree", "Hilton Honors"),
    ("Hilton Garden Inn", "Hilton Garden Inn", "Hilton Honors"),
    ("Hampton by Hilton", "Hampton", "Hilton Honors"),
    ("Hampton", "Hampton", "Hilton Honors"),
    ("Embassy Suites by Hilton", "Embassy Suites", "Hilton Honors"),
    ("Embassy Suites", "Embassy Suites", "Hilton Honors"),
    ("Canopy by Hilton", "Canopy", "Hilton Honors"),
    ("Canopy", "Canopy", "Hilton Honors"),
    ("Curio Collection by Hilton", "Curio", "Hilton Honors"),
    ("Curio Collection", "Curio", "Hilton Honors"),
    ("Tapestry Collection by Hilton", "Tapestry", "Hilton Honors"),
    ("Tapestry Collection", "Tapestry", "Hilton Honors"),
    ("Homewood Suites", "Homewood Suites", "Hilton Honors"),
    ("Home2 Suites", "Home2 Suites", "Hilton Honors"),
    ("Hilton", "Hilton", "Hilton Honors"),

    # Marriott
    ("The Ritz-Carlton", "The Ritz-Carlton", "Marriott Bonvoy"),
    ("Ritz-Carlton", "The Ritz-Carlton", "Marriott Bonvoy"),
    ("Ritz Carlton", "The Ritz-Carlton", "Marriott Bonvoy"),
    ("St. Regis", "St. Regis", "Marriott Bonvoy"),
    ("JW Marriott", "JW Marriott", "Marriott Bonvoy"),
    ("W Hotels", "W Hotels", "Marriott Bonvoy"),
    ("W Hotel", "W Hotels", "Marriott Bonvoy"),
    ("EDITION", "EDITION", "Marriott Bonvoy"),
    ("Sheraton", "Sheraton", "Marriott Bonvoy"),
    ("Westin", "Westin", "Marriott Bonvoy"),
    ("Renaissance", "Renaissance", "Marriott Bonvoy"),
    ("Le Méridien", "Le Méridien", "Marriott Bonvoy"),
    ("Le Meridien", "Le Méridien", "Marriott Bonvoy"),
    ("Autograph Collection", "Autograph Collection", "Marriott Bonvoy"),
    ("Courtyard", "Courtyard", "Marriott Bonvoy"),
    ("Four Points", "Four Points", "Marriott Bonvoy"),
    ("Moxy", "Moxy", "Marriott Bonvoy"),
    ("Aloft", "Aloft", "Marriott Bonvoy"),
    ("Marriott", "Marriott Hotels", "Marriott Bonvoy"),

    # IHG
    ("InterContinental", "InterContinental", "IHG One Rewards"),
    ("Six Senses", "Six Senses", "IHG One Rewards"),
    ("Regent", "Regent", "IHG One Rewards"),
    ("Kimpton", "Kimpton", "IHG One Rewards"),
    ("Vignette Collection", "Vignette Collection", "IHG One Rewards"),
    ("Hotel Indigo", "Hotel Indigo", "IHG One Rewards"),
    ("Crowne Plaza", "Crowne Plaza", "IHG One Rewards"),
    ("Holiday Inn Express", "Holiday Inn Express", "IHG One Rewards"),
    ("Holiday Inn", "Holiday Inn", "IHG One Rewards"),
    ("voco", "voco", "IHG One Rewards"),

    # Accor
    ("Raffles", "Raffles", "ALL - Accor Live Limitless"),
    ("Fairmont", "Fairmont", "ALL - Accor Live Limitless"),
    ("Sofitel", "Sofitel", "ALL - Accor Live Limitless"),
    ("MGallery", "MGallery", "ALL - Accor Live Limitless"),
    ("Pullman", "Pullman", "ALL - Accor Live Limitless"),
    ("Swissôtel", "Swissôtel", "ALL - Accor Live Limitless"),
    ("Swissotel", "Swissôtel", "ALL - Accor Live Limitless"),
    ("Mövenpick", "Mövenpick", "ALL - Accor Live Limitless"),
    ("Movenpick", "Mövenpick", "ALL - Accor Live Limitless"),
    ("Novotel", "Novotel", "ALL - Accor Live Limitless"),
    ("Mercure", "Mercure", "ALL - Accor Live Limitless"),
    ("25hours", "25hours", "ALL - Accor Live Limitless"),
    ("Mondrian", "Mondrian", "ALL - Accor Live Limitless"),
    ("The Hoxton", "The Hoxton", "ALL - Accor Live Limitless"),
    ("ibis", "ibis", "ALL - Accor Live Limitless"),

    # Radisson
    ("Radisson Collection", "Radisson Collection", "Radisson Rewards"),
    ("Radisson Blu", "Radisson Blu", "Radisson Rewards"),
    ("Radisson RED", "Radisson RED", "Radisson Rewards"),
    ("Radisson", "Radisson", "Radisson Rewards"),
    ("Park Plaza", "Park Plaza", "Radisson Rewards"),
    ("Park Inn by Radisson", "Park Inn by Radisson", "Radisson Rewards"),
    ("Park Inn", "Park Inn by Radisson", "Radisson Rewards"),

    # Meliá
    ("Gran Meliá", "Gran Meliá", "MeliáRewards"),
    ("Gran Melia", "Gran Meliá", "MeliáRewards"),
    ("ME by Meliá", "ME by Meliá", "MeliáRewards"),
    ("ME by Melia", "ME by Meliá", "MeliáRewards"),
    ("INNSiDE", "INNSiDE", "MeliáRewards"),
    ("INNSIDE", "INNSiDE", "MeliáRewards"),
    ("Meliá", "Meliá", "MeliáRewards"),
    ("Melia", "Meliá", "MeliáRewards"),

    # GHA
    ("Kempinski", "Kempinski", "GHA DISCOVERY"),
    ("NH Collection", "NH Collection", "GHA DISCOVERY"),
    ("NH Hotels", "NH Hotels", "GHA DISCOVERY"),
    ("Anantara", "Anantara", "GHA DISCOVERY"),
    ("Tivoli", "Tivoli", "GHA DISCOVERY"),
    ("Avani", "Avani", "GHA DISCOVERY"),
    ("Viceroy", "Viceroy", "GHA DISCOVERY"),
    ("Capella", "Capella", "GHA DISCOVERY"),

    # Wyndham
    ("Wyndham Grand", "Wyndham Grand", "Wyndham Rewards"),
    ("Wyndham", "Wyndham", "Wyndham Rewards"),
    ("Ramada", "Ramada", "Wyndham Rewards"),
    ("Days Inn", "Days Inn", "Wyndham Rewards"),
    ("Super 8", "Super 8", "Wyndham Rewards"),
    ("La Quinta", "La Quinta", "Wyndham Rewards"),

    # WorldHotels / Best Western
    ("WorldHotels", "WorldHotels", "WorldHotels Rewards"),
    ("Best Western Premier", "Best Western Premier", "Best Western Rewards"),
    ("Best Western Plus", "Best Western Plus", "Best Western Rewards"),
    ("Best Western", "Best Western", "Best Western Rewards"),
]

def classify_hotel(name: str):
    low = name.lower()
    for needle, brand, program in BRAND_RULES:
        if needle.lower() in low:
            return program, brand
    return None, None

# ------------------------------------------------------------
# API HELPERS
# ------------------------------------------------------------

@st.cache_data(ttl=600, show_spinner=False)
def live_search(api_key, location, check_in, check_out, adults, currency):
    r = requests.get(
        API_URL,
        headers={"x-api-key": api_key},
        params={
            "location": location,
            "check_in": check_in,
            "check_out": check_out,
            "adults": adults,
            "currency": currency,
        },
        timeout=60,
    )

    if r.status_code == 401:
        raise RuntimeError("StayAPI-Key ungültig.")
    if r.status_code == 403:
        raise RuntimeError("StayAPI Zugriff oder Kontingent verweigert.")
    if not r.ok:
        try:
            detail = r.json()
        except Exception:
            detail = r.text[:500]
        raise RuntimeError(f"StayAPI {r.status_code}: {detail}")

    return r.json()

@st.cache_data(ttl=60, show_spinner=False)
def get_usage(api_key):
    r = requests.get(
        USAGE_URL,
        headers={"x-api-key": api_key},
        timeout=20,
    )
    if not r.ok:
        return {}
    try:
        return r.json()
    except Exception:
        return {}

def to_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None

def get_price(hotel):
    p = hotel.get("price") or {}
    for key in ("current", "total", "amount"):
        v = to_float(p.get(key))
        if v is not None:
            return v
    for key in ("current_price", "price"):
        v = to_float(hotel.get(key))
        if v is not None:
            return v
    return None

def get_currency(hotel, fallback):
    p = hotel.get("price") or {}
    return p.get("currency") or hotel.get("currency") or fallback

def get_nightly(hotel):
    p = hotel.get("price") or {}
    return to_float(p.get("price_per_night") or p.get("nightly"))

def get_rating(hotel):
    r = hotel.get("rating")
    if isinstance(r, dict):
        return to_float(r.get("value") or r.get("score"))
    return to_float(r)

# ------------------------------------------------------------
# AMEX / POINTS
# ------------------------------------------------------------

def amex_match(hotel_name, program, brand):
    offers = st.session_state.get("amex_offers", [])
    low_name = hotel_name.lower()
    low_program = program.lower()
    low_brand = brand.lower()

    candidates = []
    for offer in offers:
        if not offer.get("active", True):
            continue
        target = str(offer.get("name", "")).strip().lower()
        if not target:
            continue
        if target in low_name or target in low_brand or target in low_program:
            candidates.append(offer)

    if not candidates:
        return None

    return max(candidates, key=lambda x: float(x.get("credit", 0) or 0))

def amex_credit(hotel_name, program, brand, price):
    offer = amex_match(hotel_name, program, brand)
    if not offer:
        return 0.0, None, False

    spend = float(offer.get("spend", 0) or 0)
    credit = float(offer.get("credit", 0) or 0)

    if spend > 0 and price >= spend:
        return credit, offer, True

    return 0.0, offer, False

# ------------------------------------------------------------
# CSS: beige / white / minimal
# ------------------------------------------------------------

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap');

    :root {
        --ivory: #f7f3ec;
        --paper: #fffdf9;
        --sand: #e9e0d2;
        --olive: #46513d;
        --olive-dark: #35402f;
        --terracotta: #9a5d4f;
        --ink: #24241f;
        --muted: #777268;
    }

    .stApp {
        background: var(--ivory);
        color: var(--ink);
    }

    section[data-testid="stSidebar"] {
        background: #eee7dc;
        border-right: 1px solid var(--sand);
    }

    .block-container {
        max-width: 1180px;
        padding-top: 2rem;
        padding-bottom: 3rem;
    }

    h1, h2, h3 {
        font-family: 'Playfair Display', Georgia, serif !important;
        color: var(--olive-dark) !important;
        letter-spacing: -0.02em;
        font-weight: 600 !important;
    }

    p, label, div, span, button, input, textarea, select {
        font-family: 'DM Sans', Arial, sans-serif;
    }

    h1 {
        font-size: 3rem !important;
        line-height: 1.05 !important;
        margin-bottom: .3rem !important;
    }

    h2 {
        font-size: 1.8rem !important;
    }

    h3 {
        font-size: 1.25rem !important;
    }

    [data-testid="stCaptionContainer"] {
        color: var(--muted);
    }

    .hotel-card {
        background: var(--paper);
        border: 1px solid var(--sand);
        border-radius: 18px;
        padding: 1.05rem 1.15rem;
        margin-bottom: .85rem;
        box-shadow: 0 4px 18px rgba(70, 60, 45, 0.035);
    }

    .hotel-card:hover {
        border-color: #d9cbb8;
    }

    div[data-testid="stMetric"] {
        background: var(--paper);
        border: 1px solid var(--sand);
        border-radius: 14px;
        padding: .35rem .65rem;
    }

    div[data-testid="stMetricLabel"] {
        color: var(--muted);
        font-size: .75rem;
    }

    div[data-testid="stMetricValue"] {
        color: var(--olive-dark);
        font-weight: 600;
    }

    .stButton > button {
        border-radius: 999px;
        border: 1px solid #cdbfae;
        background: var(--paper);
        color: var(--olive-dark);
        font-weight: 500;
    }

    .stButton > button:hover {
        border-color: var(--olive);
        color: var(--olive-dark);
    }

    div[data-baseweb="select"] > div {
        background: var(--paper);
        border-color: var(--sand);
        border-radius: 10px;
    }

    div[data-baseweb="input"] > div {
        background: var(--paper);
        border-color: var(--sand);
        border-radius: 10px;
    }

    .stSuccess {
        background: #edf2e9 !important;
        border-color: #cbd8c3 !important;
    }

    .stInfo {
        background: #f3eee6 !important;
        border-color: #e2d6c6 !important;
    }

    .stWarning {
        background: #f7eee8 !important;
        border-color: #e6cfc2 !important;
    }

    hr {
        border-color: var(--sand);
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# ------------------------------------------------------------
# HEADER
# ------------------------------------------------------------

st.title("Hotel Loyalty")
st.caption("Dein persönlicher Hotel-Finder · Status · Wert · Vorteile")
st.markdown("<div style=\"height:2px;width:54px;background:#46513d;margin:18px 0 28px 0;border-radius:2px;\"></div>", unsafe_allow_html=True)

# ------------------------------------------------------------
# SIDEBAR
# ------------------------------------------------------------

st.sidebar.header("Suche")

city = st.sidebar.text_input("Stadt", value="Frankfurt")

today = date.today()

check_in = st.sidebar.date_input(
    "Check-in",
    today + timedelta(days=7),
    min_value=today,
)

check_out = st.sidebar.date_input(
    "Check-out",
    today + timedelta(days=9),
    min_value=today + timedelta(days=1),
)

adults = st.sidebar.number_input("Erwachsene", 1, 10, 2)
currency = st.sidebar.selectbox("Währung", ["EUR", "GBP", "USD"])

st.sidebar.divider()
st.sidebar.subheader("Hotelketten")

selected_programs = [
    program
    for program in PROGRAMS
    if st.sidebar.checkbox(program, value=True)
]

with st.sidebar.expander("Status"):
    for program in PROGRAMS:
        statuses = list(PROGRAMS[program]["statuses"].keys())
        default = DEFAULT_STATUS[program]
        if default not in statuses:
            default = statuses[0]

        st.selectbox(
            program,
            statuses,
            index=statuses.index(default),
            key=f"status_select_{program}",
        )

with st.sidebar.expander("Punkte"):
    for program in PROGRAMS:
        st.number_input(
            program,
            min_value=0,
            value=int(DEFAULT_POINTS[program]),
            step=1000,
            key=f"points_{program}",
        )

with st.sidebar.expander("Punktewert"):
    for program in PROGRAMS:
        st.number_input(
            f"{program} · €/1.000",
            min_value=0.0,
            value=float(DEFAULT_POINT_VALUE_EUR_PER_1000[program]),
            step=0.5,
            key=f"value_{program}",
        )

with st.sidebar.expander("Amex Offers"):
    st.caption("Beispiel: WorldHotels → 250 € Umsatz → 50 € Gutschrift.")

    if "amex_offers" not in st.session_state:
        st.session_state.amex_offers = [x.copy() for x in DEFAULT_AMEX_OFFERS]

    if st.button("Offer hinzufügen"):
        st.session_state.amex_offers.append(
            {
                "name": "",
                "spend": 0.0,
                "credit": 0.0,
                "expires": "",
                "active": True,
            }
        )
        st.rerun()

    for i, offer in enumerate(st.session_state.amex_offers):
        st.markdown(f"**Offer {i + 1}**")

        offer["name"] = st.text_input(
            "Hotel / Kette",
            offer.get("name", ""),
            key=f"offer_name_{i}",
        )
        offer["spend"] = st.number_input(
            "Mindestumsatz €",
            min_value=0.0,
            value=float(offer.get("spend", 0.0)),
            step=10.0,
            key=f"offer_spend_{i}",
        )
        offer["credit"] = st.number_input(
            "Gutschrift €",
            min_value=0.0,
            value=float(offer.get("credit", 0.0)),
            step=5.0,
            key=f"offer_credit_{i}",
        )
        offer["expires"] = st.text_input(
            "Ablauf optional",
            offer.get("expires", ""),
            key=f"offer_expires_{i}",
        )

        if st.button("Offer löschen", key=f"offer_delete_{i}"):
            st.session_state.amex_offers.pop(i)
            st.rerun()

with st.sidebar.expander("Filter"):
    amenity_options = [
        "Pool",
        "Sauna",
        "Fitness",
        "Spa",
        "Frühstück",
        "Parkplatz",
        "Restaurant",
        "Bar",
    ]

    selected_amenities = [
        a for a in amenity_options
        if st.checkbox(a, key=f"amenity_{a}")
    ]

if st.sidebar.button("Neue Live-Suche"):
    st.cache_data.clear()
    st.rerun()

sort_by = st.sidebar.selectbox(
    "Sortierung",
    [
        "Effektiver Preis",
        "Beste Kombination",
        "Hotelbewertung",
        "Name",
    ],
    index=0,
)

# ------------------------------------------------------------
# VALIDATION / API
# ------------------------------------------------------------

api_key = st.secrets.get("STAYAPI_KEY", "")

if not api_key:
    st.error("STAYAPI_KEY fehlt unter Streamlit → Settings → Secrets.")
    st.stop()

if check_out <= check_in:
    st.error("Check-out muss nach Check-in liegen.")
    st.stop()

nights = (check_out - check_in).days

try:
    with st.spinner(f"Live-Suche in {city}..."):
        payload = live_search(
            api_key,
            city,
            check_in.isoformat(),
            check_out.isoformat(),
            adults,
            currency,
        )
except Exception as exc:
    st.error(f"Live-Suche fehlgeschlagen: {exc}")
    st.stop()

raw_hotels = payload.get("hotels", [])

# ------------------------------------------------------------
# BUILD RESULTS
# ------------------------------------------------------------

results = []
unmatched = []

for hotel in raw_hotels:

    name = str(hotel.get("name", "")).strip()
    if not name:
        continue

    program, brand = classify_hotel(name)

    if not program:
        unmatched.append(name)
        continue

    if program not in selected_programs:
        continue

    amenities_raw = hotel.get("amenities") or []
    amenity_text = " ".join(str(x) for x in amenities_raw).lower()

    if selected_amenities:
        matches = 0
        for required in selected_amenities:
            if required.lower() in amenity_text:
                matches += 1
        if matches < len(selected_amenities):
            continue

    nightly_api = get_nightly(hotel)
    total_api = get_price(hotel)

    if nightly_api is None and total_api is None:
        continue

    # Prefer the API's complete stay price if it appears available.
    total_price = total_api

    if total_price is None and nightly_api is not None:
        total_price = nightly_api * nights

    # If API returns only total, calculate a display nightly amount.
    nightly_display = (
        nightly_api
        if nightly_api is not None
        else total_price / nights
    )

    status = st.session_state.get(
        f"status_{program}",
        DEFAULT_STATUS[program],
    )

    benefits = PROGRAMS[program]["statuses"].get(
        status,
        [],
    )

    promo = PERSONAL_PROMOTIONS.get(program, 0)

    after_promo = total_price * (1 - promo / 100)

    credit, amex_offer, triggered = amex_credit(
        name,
        program,
        brand,
        after_promo,
    )

    effective_total = max(after_promo - credit, 0)
    effective_nightly = effective_total / nights

    rating = get_rating(hotel)
    stars = to_float(hotel.get("stars"))

    point_balance = st.session_state.get(
        f"points_{program}",
        DEFAULT_POINTS[program],
    )

    point_rate = st.session_state.get(
        f"value_{program}",
        DEFAULT_POINT_VALUE_EUR_PER_1000[program],
    )

    point_value = (point_balance / 1000) * point_rate

    benefit_score = 0
    text = " ".join(benefits).lower()

    if "frühstück" in text:
        benefit_score += 18
    if "upgrade" in text:
        benefit_score += 16
    if "lounge" in text:
        benefit_score += 15
    if "late check-out" in text or "späte abreise" in text:
        benefit_score += 10
    if "early check-in" in text:
        benefit_score += 5
    if promo:
        benefit_score += min(promo / 2, 10)
    if credit:
        benefit_score += min(credit / 5, 10)
    if rating:
        benefit_score += min(max((rating - 4.0) * 5, 0), 10)

    match_score = min(round(45 + benefit_score), 100)

    image = None
    images = hotel.get("images") or []
    if images:
        first = images[0]
        if isinstance(first, str):
            image = first
        elif isinstance(first, dict):
            image = first.get("url")

    results.append(
        {
            "name": name,
            "brand": brand,
            "program": program,
            "status": status,
            "benefits": benefits,
            "promo": promo,
            "gross_total": total_price,
            "after_promo": after_promo,
            "amex_credit": credit,
            "amex_offer": amex_offer,
            "amex_triggered": triggered,
            "effective_total": effective_total,
            "effective_nightly": effective_nightly,
            "nightly": nightly_display,
            "currency": get_currency(hotel, currency),
            "rating": rating,
            "stars": stars,
            "points_balance": point_balance,
            "point_value": point_value,
            "match_score": match_score,
            "amenities": amenities_raw,
            "image": image,
            "address": (
                hotel.get("location", {}).get("address")
                if isinstance(hotel.get("location"), dict)
                else hotel.get("address")
            ),
            "hotel_id": hotel.get("hotel_id"),
        }
    )

# ------------------------------------------------------------
# SORTING
# ------------------------------------------------------------

if sort_by == "Effektiver Preis":
    results.sort(key=lambda x: x["effective_total"])
elif sort_by == "Beste Kombination":
    results.sort(key=lambda x: (-x["match_score"], x["effective_total"]))
elif sort_by == "Hotelbewertung":
    results.sort(key=lambda x: (-(x["rating"] or 0), x["effective_total"]))
else:
    results.sort(key=lambda x: x["name"].lower())

# ------------------------------------------------------------
# RESULTS HEADER
# ------------------------------------------------------------

st.subheader(city)

st.caption(
    f"{check_in.strftime('%d.%m.%Y')} – "
    f"{check_out.strftime('%d.%m.%Y')} · "
    f"{nights} Nächte · {adults} Erwachsene"
)

if not results:
    st.warning(
        "Keine passenden Hotels gefunden. "
        "Deaktiviere testweise die Annehmlichkeitsfilter."
    )

    if unmatched:
        with st.expander("Nicht zugeordnete Hotels"):
            st.write("\n".join(unmatched[:100]))

    st.stop()

best = results[0]

c1, c2, c3, c4 = st.columns(4)

with c1:
    st.metric("Hotels", len(results))

with c2:
    st.metric(
        "Ab effektiv",
        f"{min(x['effective_total'] for x in results):.0f} {currency}",
    )

with c3:
    st.metric("Bestes Match", f"{best['match_score']}/100")

with c4:
    ratings = [x["rating"] for x in results if x["rating"]]
    st.metric(
        "Ø Bewertung",
        f"{sum(ratings) / len(ratings):.1f}/5"
        if ratings else "–",
    )

st.success(
    f"Bestes Match: {best['name']} · "
    f"{best['effective_total']:.0f} {best['currency']}"
)

# ------------------------------------------------------------
# HOTEL CARDS
# ------------------------------------------------------------

for r in results:

    with st.container(border=True):

        image_col, info_col, price_col = st.columns(
            [2.0, 4.6, 2.2]
        )

        with image_col:
            if r["image"]:
                st.image(
                    r["image"],
                    use_container_width=True,
                )
            else:
                st.caption("Kein Hotelbild verfügbar.")

        with info_col:
            st.markdown(f"### {r['name']}")
            st.write(f"**{r['brand']}** · {r['program']}")

            meta = [f"Status: {r['status']}"]

            if r["rating"]:
                meta.append(f"Bewertung {r['rating']:.1f}")

            if r["stars"]:
                meta.append(f"{int(r['stars'])} Sterne")

            meta.append(f"Match {r['match_score']}/100")
            st.caption(" · ".join(meta))

            if r["address"]:
                st.caption(r["address"])

            # Show only the strongest 4 benefits here.
            if r["benefits"]:
                for benefit in r["benefits"][:4]:
                    st.markdown(f":green[{benefit}]")

            if len(r["benefits"]) > 4:
                st.caption(f"+ {len(r['benefits']) - 4} weitere Vorteile")

        with price_col:
            # Large complete-stay price
            st.metric(
                "Effektiver Aufenthalt",
                f"{r['effective_total']:.0f} {r['currency']}",
            )

            # Small nightly price
            st.caption(
                f"{r['effective_nightly']:.0f} {r['currency']} / Nacht"
            )

            if r["promo"]:
                st.success(
                    f"Meliá -{r['promo']} %"
                )

            if r["amex_credit"]:
                st.success(
                    f"Amex -{r['amex_credit']:.0f} €"
                )
            elif r["amex_offer"]:
                st.caption(
                    f"Amex: {r['amex_offer']['spend']:.0f} € → "
                    f"{r['amex_offer']['credit']:.0f} €"
                )

            st.caption(
                f"Vorher {r['gross_total']:.0f} {r['currency']} gesamt"
            )

        with st.expander("Vorteile & Preisdetails"):

            st.write(f"Status: {r['status']}")

            for benefit in r["benefits"]:
                st.markdown(f":green[{benefit}]")

            st.divider()

            st.write(
                f"Gesamtpreis: {r['gross_total']:.2f} {r['currency']}"
            )

            if r["promo"]:
                st.write(
                    f"Nach Promotion: {r['after_promo']:.2f} {r['currency']}"
                )

            if r["amex_credit"]:
                st.write(
                    f"Amex Gutschrift: -{r['amex_credit']:.2f} €"
                )

            st.write(
                f"Effektiver Aufenthalt: "
                f"**{r['effective_total']:.2f} {r['currency']}**"
            )

            st.write(
                f"Effektiv pro Nacht: "
                f"**{r['effective_nightly']:.2f} {r['currency']}**"
            )

            st.divider()

            st.write(
                f"Punktebestand bei {r['program']}: "
                f"{r['points_balance']:,.0f}"
            )

            st.write(
                f"Geschätzter Punktwert: "
                f"{r['point_value']:.2f} €"
            )

            if r["amenities"]:
                st.write("Ausstattung")
                st.write(
                    ", ".join(
                        str(x) for x in r["amenities"][:30]
                    )
                )

# ------------------------------------------------------------
# UNMATCHED
# ------------------------------------------------------------

if unmatched:
    with st.expander(
        f"Weitere Live-Hotels ohne erkannte Loyalty-Marke ({len(unmatched)})"
    ):
        st.caption(
            "Diese Hotels wurden live gefunden, aber die Marken-Zuordnung "
            "muss noch ergänzt werden."
        )
        st.write("\n".join(unmatched[:150]))

# ------------------------------------------------------------
# POINTS OVERVIEW
# ------------------------------------------------------------

st.divider()
st.subheader("Punkte")

point_rows = []

for program in PROGRAMS:
    points = st.session_state.get(
        f"points_{program}",
        DEFAULT_POINTS[program],
    )
    rate = st.session_state.get(
        f"value_{program}",
        DEFAULT_POINT_VALUE_EUR_PER_1000[program],
    )

    point_rows.append(
        {
            "Programm": program,
            "Punkte": f"{points:,.0f}",
            "Wert / 1.000": f"{rate:.2f} €",
            "Geschätzter Wert": f"{points / 1000 * rate:.2f} €",
        }
    )

st.dataframe(
    point_rows,
    use_container_width=True,
    hide_index=True,
)

# ------------------------------------------------------------
# USAGE
# ------------------------------------------------------------

usage = get_usage(api_key)
if usage:
    remaining = usage.get("remaining")
    if remaining is not None:
        st.caption(f"StayAPI: {remaining} Requests verbleibend")

st.caption(
    "Live-Preise und Verfügbarkeit können sich jederzeit ändern. "
    "Loyalty-Vorteile gelten abhängig von Marke, Land, Tarif und Verfügbarkeit."
)
