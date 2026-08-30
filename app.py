import streamlit as st
import requests
from datetime import date, timedelta
from urllib.parse import quote_plus

st.set_page_config(
    page_title="Hotel Loyalty",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ============================================================
#  PERSONAL HOTEL LOYALTY FINDER
# ============================================================
# Live hotel data: StayAPI / Google Hotels
# Loyalty: personal rules database
#
# Secret required in Streamlit:
# STAYAPI_KEY = "..."
# ============================================================

API_URL = "https://api.stayapi.com/v1/google_hotels/search"
USAGE_URL = "https://api.stayapi.com/v1/account/usage"

# ------------------------------------------------------------
# YOUR DEFAULT STATUS
# ------------------------------------------------------------

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

# ------------------------------------------------------------
# YOUR POINTS BALANCES
# Enter your current balances here.
# The app converts points to an estimated EUR value.
# ------------------------------------------------------------

DEFAULT_POINTS = {
    "Hilton Honors": 0,
    "Marriott Bonvoy": 0,
    "IHG One Rewards": 0,
    "ALL - Accor Live Limitless": 0,
    "Radisson Rewards": 0,
    "MeliáRewards": 0,
    "GHA DISCOVERY": 0,
    "Wyndham Rewards": 0,
    "WorldHotels Rewards": 0,
    "Best Western Rewards": 0,
}

# Estimated value per 1,000 points in EUR.
# These are YOUR valuation assumptions, not guaranteed cash values.
DEFAULT_POINT_VALUE_EUR_PER_1000 = {
    "Hilton Honors": 4.0,
    "Marriott Bonvoy": 7.0,
    "IHG One Rewards": 5.0,
    "ALL - Accor Live Limitless": 20.0,
    "Radisson Rewards": 3.0,
    "MeliáRewards": 4.0,
    "GHA DISCOVERY": 50.0,  # D$ is different from classic points.
    "Wyndham Rewards": 7.0,
    "WorldHotels Rewards": 5.0,
    "Best Western Rewards": 5.0,
}

# Your personal Meliá promotion.
PERSONAL_PROMOTIONS = {
    "MeliáRewards": 20,
}

# Personal Amex Offers / statement credits.
# Example:
# "WorldHotels" -> spend 250 EUR, get 50 EUR back.
# These are user-entered values and are only applied to matching hotels.
DEFAULT_AMEX_OFFERS = [
    {
        "name": "WorldHotels",
        "spend": 250.0,
        "credit": 50.0,
        "expires": "",
        "active": True,
    }
]

# ------------------------------------------------------------
# LOYALTY DATABASE
# ------------------------------------------------------------

PROGRAMS = {
    "Hilton Honors": {
        "brands": [
            "Waldorf Astoria", "Conrad", "LXR", "NoMad", "Canopy",
            "Hilton", "Curio", "DoubleTree", "Tapestry",
            "Embassy Suites", "Hilton Garden Inn", "Hampton",
            "Homewood Suites", "Home2 Suites", "Tru"
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
            "AC Hotels", "Residence Inn", "TownePlace Suites"
        ],
        "statuses": {
            "Member": ["Member Rate", "Punkte sammeln", "Kostenloses WLAN"],
            "Silver Elite": ["10 % Punktebonus", "Late Check-out nach Verfügbarkeit"],
            "Gold Elite": [
                "25 % Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit"
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
            "Staybridge Suites", "Candlewood Suites"
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
            "Mercure", "Adagio", "ibis", "25hours", "Mondrian", "The Hoxton"
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
            "Country Inn & Suites", "art'otel"
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
            "INNSiDE", "Zel", "TRYP", "Sol by Meliá"
        ],
        "statuses": {
            "White": ["Member Rate", "Punkte sammeln"],
            "Silver": [
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
            ],
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
            "Tivoli", "Avani", "Viceroy", "The Doyle Collection", "Pan Pacific"
        ],
        "statuses": {
            "Silver": [
                "4 % D$ auf anrechenbare Ausgaben",
                "Member Rate", "Local Offers", "Experiences"
            ],
            "Gold": [
                "5 % D$ auf anrechenbare Ausgaben",
                "Member Rate", "Local Offers", "Experiences"
            ],
            "Platinum": [
                "6 % D$ auf anrechenbare Ausgaben",
                "3pm Late Check-out nach Verfügbarkeit",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Welcome Amenity"
            ],
            "Titanium": [
                "7 % D$ auf anrechenbare Ausgaben",
                "Early Check-in ab 11:00 Uhr nach Verfügbarkeit",
                "Late Check-out bis 16:00 Uhr nach Verfügbarkeit",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Welcome Amenity",
                "Frühstück bei teilnehmenden Marken"
            ],
        },
    },
    "Wyndham Rewards": {
        "brands": [
            "Wyndham Grand", "Wyndham", "TRYP", "Esplendor", "Dazzler",
            "Ramada", "Ramada Encore", "Days Inn", "Super 8", "Baymont",
            "Howard Johnson", "La Quinta", "Microtel"
        ],
        "statuses": {
            "Blue": ["Member Rate", "Punkte sammeln"],
            "Gold": [
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Preferred Room nach Verfügbarkeit",
                "10 % Punktebonus"
            ],
            "Platinum": [
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Preferred Room nach Verfügbarkeit",
                "15 % Punktebonus"
            ],
            "Diamond": [
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Preferred Room nach Verfügbarkeit",
                "Suite Upgrade nach Verfügbarkeit",
                "20 % Punktebonus"
            ],
        },
    },
    "WorldHotels Rewards": {
        "brands": [
            "WorldHotels Luxury", "WorldHotels Elite",
            "WorldHotels Crafted", "WorldHotels Distinctive"
        ],
        "statuses": {
            "Red": ["Member Rate", "Punkte sammeln"],
            "Gold": [
                "Bonus auf Punkte",
                "Früher Check-in / spätere Abreise nach Verfügbarkeit",
                "Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity"
            ],
            "Platinum": [
                "Bonus auf Punkte",
                "Früher Check-in / spätere Abreise nach Verfügbarkeit",
                "Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity"
            ],
            "Diamond": [
                "Bonus auf Punkte",
                "Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity",
                "Lounge-Zugang bei teilnehmenden Hotels"
            ],
            "Diamond Select": [
                "Bonus auf Punkte",
                "Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity",
                "Lounge-Zugang",
                "Frühstück bei teilnehmenden Hotels"
            ],
        },
    },
    "Best Western Rewards": {
        "brands": [
            "Best Western", "Best Western Plus", "Best Western Premier",
            "BW Premier Collection", "Executive Residency",
            "SureStay", "SureStay Plus", "SureStay Collection"
        ],
        "statuses": {
            "Blue": ["Member Rate", "Punkte sammeln"],
            "Gold": ["10 % Bonuspunkte", "Willkommens-Amenity", "Member Rate"],
            "Platinum": [
                "15 % Bonuspunkte",
                "Willkommens-Amenity",
                "Früher Check-in / später Check-out nach Verfügbarkeit",
                "Member Rate"
            ],
            "Diamond": [
                "30 % Bonuspunkte",
                "Willkommens-Amenity",
                "Früher Check-in / später Check-out nach Verfügbarkeit",
                "Member Rate"
            ],
            "Diamond Select": [
                "50 % Bonuspunkte",
                "Willkommens-Amenity",
                "Früher Check-in / später Check-out nach Verfügbarkeit",
                "Member Rate"
            ],
        },
    },
}

# ------------------------------------------------------------
# BRAND CLASSIFICATION
# More specific brand names are tested first.
# INNSiDE is intentionally mapped to MeliáRewards.
# ------------------------------------------------------------

BRAND_RULES = [
    ("Waldorf Astoria", "Waldorf Astoria", "Hilton Honors"),
    ("Conrad", "Conrad", "Hilton Honors"),
    ("DoubleTree", "DoubleTree", "Hilton Honors"),
    ("Hilton Garden Inn", "Hilton Garden Inn", "Hilton Honors"),
    ("Hampton", "Hampton", "Hilton Honors"),
    ("Homewood", "Homewood Suites", "Hilton Honors"),
    ("Home2", "Home2 Suites", "Hilton Honors"),
    ("Curio", "Curio Collection", "Hilton Honors"),
    ("Tapestry", "Tapestry Collection", "Hilton Honors"),
    ("Hilton", "Hilton", "Hilton Honors"),

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
    ("Moxy", "Moxy", "Marriott Bonvoy"),
    ("Aloft", "Aloft", "Marriott Bonvoy"),
    ("Marriott", "Marriott Hotels", "Marriott Bonvoy"),

    ("InterContinental", "InterContinental", "IHG One Rewards"),
    ("Six Senses", "Six Senses", "IHG One Rewards"),
    ("Regent", "Regent", "IHG One Rewards"),
    ("Kimpton", "Kimpton", "IHG One Rewards"),
    ("Hotel Indigo", "Hotel Indigo", "IHG One Rewards"),
    ("Crowne Plaza", "Crowne Plaza", "IHG One Rewards"),
    ("Holiday Inn Express", "Holiday Inn Express", "IHG One Rewards"),
    ("Holiday Inn", "Holiday Inn", "IHG One Rewards"),
    ("voco", "voco", "IHG One Rewards"),

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

    ("Radisson Collection", "Radisson Collection", "Radisson Rewards"),
    ("Radisson Blu", "Radisson Blu", "Radisson Rewards"),
    ("Radisson RED", "Radisson RED", "Radisson Rewards"),
    ("Radisson", "Radisson", "Radisson Rewards"),
    ("Park Plaza", "Park Plaza", "Radisson Rewards"),
    ("Park Inn", "Park Inn by Radisson", "Radisson Rewards"),

    ("Gran Meliá", "Gran Meliá", "MeliáRewards"),
    ("Gran Melia", "Gran Meliá", "MeliáRewards"),
    ("ME by Meliá", "ME by Meliá", "MeliáRewards"),
    ("ME by Melia", "ME by Meliá", "MeliáRewards"),
    ("INNSiDE", "INNSiDE", "MeliáRewards"),
    ("INNSIDE", "INNSiDE", "MeliáRewards"),
    ("Meliá", "Meliá", "MeliáRewards"),
    ("Melia", "Meliá", "MeliáRewards"),

    ("Kempinski", "Kempinski", "GHA DISCOVERY"),
    ("NH Collection", "NH Collection", "GHA DISCOVERY"),
    ("NH Hotels", "NH Hotels", "GHA DISCOVERY"),
    ("NH ", "NH Hotels", "GHA DISCOVERY"),
    ("Anantara", "Anantara", "GHA DISCOVERY"),
    ("Tivoli", "Tivoli", "GHA DISCOVERY"),
    ("Avani", "Avani", "GHA DISCOVERY"),
    ("Viceroy", "Viceroy", "GHA DISCOVERY"),
    ("Capella", "Capella", "GHA DISCOVERY"),

    ("Wyndham Grand", "Wyndham Grand", "Wyndham Rewards"),
    ("Wyndham", "Wyndham", "Wyndham Rewards"),
    ("Ramada", "Ramada", "Wyndham Rewards"),
    ("Days Inn", "Days Inn", "Wyndham Rewards"),
    ("Super 8", "Super 8", "Wyndham Rewards"),
    ("La Quinta", "La Quinta", "Wyndham Rewards"),

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
# STAYAPI
# ------------------------------------------------------------

@st.cache_data(ttl=600, show_spinner=False)
def live_search(api_key, location, check_in, check_out, adults, currency):
    response = requests.get(
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

    if response.status_code == 401:
        raise RuntimeError("API-Key ungültig.")
    if response.status_code == 403:
        raise RuntimeError("API-Zugriff oder Kontingent verweigert.")
    if not response.ok:
        try:
            detail = response.json()
        except Exception:
            detail = response.text[:500]
        raise RuntimeError(f"StayAPI {response.status_code}: {detail}")

    return response.json()

@st.cache_data(ttl=60, show_spinner=False)
def get_usage(api_key):
    response = requests.get(
        USAGE_URL,
        headers={"x-api-key": api_key},
        timeout=20,
    )
    if not response.ok:
        return {}
    try:
        return response.json()
    except Exception:
        return {}

# ------------------------------------------------------------
# BOOKING LINKS — fetched ONLY when the user clicks "Buchen"
# so normal hotel searches do not burn one request per hotel.
# ------------------------------------------------------------

@st.cache_data(ttl=900, show_spinner=False)
def get_booking_links(api_key, hotel_name, location):
    response = requests.get(
        "https://api.stayapi.com/v1/meta/search",
        headers={"x-api-key": api_key},
        params={
            "hotel_name": hotel_name,
            "location": location,
        },
        timeout=40,
    )

    if not response.ok:
        try:
            detail = response.json()
        except Exception:
            detail = response.text[:300]
        raise RuntimeError(
            f"Booking-Link-Suche {response.status_code}: {detail}"
        )

    data = response.json()
    return data.get("data", data.get("results", []))

# ------------------------------------------------------------
# ROBUST PRICE PARSER
# ------------------------------------------------------------

def to_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None

def get_price(hotel):
    price = hotel.get("price") or {}

    for key in ("current", "total", "amount"):
        value = to_float(price.get(key))
        if value is not None:
            return value

    for key in ("current_price", "price"):
        value = to_float(hotel.get(key))
        if value is not None:
            return value

    return None

def get_currency(hotel, fallback):
    price = hotel.get("price") or {}
    return price.get("currency") or hotel.get("currency") or fallback

def get_rating(hotel):
    rating = hotel.get("rating")
    if isinstance(rating, dict):
        return to_float(rating.get("value") or rating.get("score"))
    return to_float(rating)

def get_nightly(hotel):
    price = hotel.get("price") or {}
    return price.get("price_per_night") or price.get("nightly")

# ------------------------------------------------------------
# AMEX OFFER CALCULATION
# ------------------------------------------------------------

def amex_offer_for_hotel(hotel_name, program, brand):
    offers = st.session_state.get("amex_offers", [])
    matches = []

    hotel_low = hotel_name.lower()
    program_low = program.lower()
    brand_low = brand.lower()

    for offer in offers:
        if not offer.get("active", True):
            continue

        target = str(offer.get("name", "")).strip().lower()
        if not target:
            continue

        if (
            target in hotel_low
            or target in brand_low
            or target in program_low
        ):
            matches.append(offer)

    if not matches:
        return None

    # Use the highest credit from matching active offers.
    return max(
        matches,
        key=lambda x: float(x.get("credit", 0) or 0)
    )

def amex_credit_for_hotel(hotel_name, program, brand, price):
    offer = amex_offer_for_hotel(hotel_name, program, brand)

    if not offer:
        return 0.0, None, False

    spend = float(offer.get("spend", 0) or 0)
    credit = float(offer.get("credit", 0) or 0)

    # The app treats the offer as realizable only when the
    # live hotel price reaches the stated minimum spend.
    if spend <= 0 or price >= spend:
        return credit, offer, True

    return 0.0, offer, False

# ------------------------------------------------------------
# VALUE / SCORE
# ------------------------------------------------------------

def points_value_eur(program, points):
    rate = DEFAULT_POINT_VALUE_EUR_PER_1000.get(program, 0)
    return (points / 1000.0) * rate

def benefit_value_score(benefits):
    text = " ".join(benefits).lower()
    score = 0

    if "frühstück" in text:
        score += 18
    if "upgrade" in text:
        score += 16
    if "lounge" in text:
        score += 15
    if "late check-out" in text or "späte abreise" in text:
        score += 10
    if "early check-in" in text:
        score += 5
    if "welcome" in text:
        score += 4

    return score

def hotel_score(program, status, benefits, promo, rating, price):
    score = 45
    score += benefit_value_score(benefits)

    if promo:
        score += min(promo / 2, 10)

    if rating:
        score += min(max((rating - 4.0) * 5, 0), 10)

    if price and price < 150:
        score += 4
    elif price and price < 250:
        score += 2

    return min(int(round(score)), 100)

# ------------------------------------------------------------
# MINIMAL CSS
# ------------------------------------------------------------

st.markdown(
    """
    <style>
    .stApp {
        background: #f8f4ed;
    }
    section[data-testid="stSidebar"] {
        background: #f2ede4;
    }
    .block-container {
        max-width: 1180px;
        padding-top: 1.2rem;
        padding-bottom: 2rem;
    }
    .hotel-card {
        padding: 1rem 1.1rem;
        border: 1px solid #e8dfd3;
        border-radius: 16px;
        margin-bottom: .9rem;
        background: #fffdf9;
    }
    .muted {
        color: #777;
        font-size: .9rem;
    }
    div[data-testid="stMetric"] {
        background: #fffdf9;
        border: 1px solid #e8dfd3;
        border-radius: 14px;
        padding: .4rem .6rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# ------------------------------------------------------------
# HEADER
# ------------------------------------------------------------

st.title("🏨 Hotel Loyalty")
st.caption("Live Preise · dein Status · deine Punkte · deine Vorteile")

# ------------------------------------------------------------
# SIDEBAR: SEARCH
# ------------------------------------------------------------

st.sidebar.header("Suche")

city = st.sidebar.text_input(
    "Stadt",
    value="Frankfurt",
)

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

adults = st.sidebar.number_input(
    "Erwachsene",
    1, 10, 2,
)

currency = st.sidebar.selectbox(
    "Währung",
    ["EUR", "GBP", "USD"],
)

st.sidebar.divider()
st.sidebar.subheader("Ketten")

selected_programs = [
    program
    for program in PROGRAMS
    if st.sidebar.checkbox(program, value=True)
]

with st.sidebar.expander("Status", expanded=False):
    for program in PROGRAMS:
        statuses = list(PROGRAMS[program]["statuses"].keys())
        current = DEFAULT_STATUS.get(program, statuses[0])

        if current not in statuses:
            current = statuses[0]

        st.session_state[f"status_{program}"] = st.selectbox(
            program,
            statuses,
            index=statuses.index(current),
            key=f"status_select_{program}",
        )

with st.sidebar.expander("Meine Punkte", expanded=False):
    st.caption("Optional: deine aktuellen Punktestände")
    for program in PROGRAMS:
        st.session_state[f"points_{program}"] = st.number_input(
            program,
            min_value=0,
            value=int(DEFAULT_POINTS.get(program, 0)),
            step=1000,
            key=f"points_input_{program}",
        )

with st.sidebar.expander("Punktewert", expanded=False):
    st.caption("Deine eigene Bewertung pro 1.000 Punkte in EUR")
    for program in PROGRAMS:
        st.session_state[f"value_{program}"] = st.number_input(
            program,
            min_value=0.0,
            value=float(DEFAULT_POINT_VALUE_EUR_PER_1000.get(program, 0)),
            step=0.5,
            key=f"value_input_{program}",
        )

with st.sidebar.expander("Amex Offers & Promotions", expanded=False):
    st.write("MeliáRewards: **20 % persönliche Promotion**")

    st.caption(
        "Trage hier persönliche Amex Statement Credits ein. "
        "Beispiel: 250 € Mindestumsatz → 50 € zurück."
    )

    if "amex_offers" not in st.session_state:
        st.session_state.amex_offers = [x.copy() for x in DEFAULT_AMEX_OFFERS]

    if st.button("Neues Amex Offer", key="add_amex"):
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
            value=offer.get("name", ""),
            key=f"amex_name_{i}",
        )
        offer["spend"] = st.number_input(
            "Mindestumsatz (€)",
            min_value=0.0,
            value=float(offer.get("spend", 0.0)),
            step=10.0,
            key=f"amex_spend_{i}",
        )
        offer["credit"] = st.number_input(
            "Amex Gutschrift (€)",
            min_value=0.0,
            value=float(offer.get("credit", 0.0)),
            step=5.0,
            key=f"amex_credit_{i}",
        )
        offer["expires"] = st.text_input(
            "Ablauf (optional)",
            value=offer.get("expires", ""),
            key=f"amex_expiry_{i}",
        )

        if st.button("Offer löschen", key=f"delete_amex_{i}"):
            st.session_state.amex_offers.pop(i)
            st.rerun()

        st.divider()

sort_by = st.sidebar.selectbox(
    "Ranking",
    [
        "Beste Kombination",
        "Niedrigster Preis",
        "Höchster Punktewert",
        "Niedrigster effektiver Preis",
        "Beste Hotelbewertung",
        "Name",
    ],
)

# ------------------------------------------------------------
# API KEY + USAGE
# ------------------------------------------------------------

api_key = st.secrets.get("STAYAPI_KEY", "")

if not api_key:
    st.error("STAYAPI_KEY fehlt in Streamlit → Settings → Secrets.")
    st.stop()

usage = get_usage(api_key)

if usage:
    remaining = usage.get("remaining")
    used = usage.get("used")
    tier = usage.get("tier")

    if remaining is not None:
        st.sidebar.caption(
            f"API: {tier or 'free'} · {remaining} Requests übrig"
        )
    elif used is not None:
        st.sidebar.caption(
            f"API: {tier or 'free'} · {used} Requests genutzt"
        )

if check_out <= check_in:
    st.error("Check-out muss nach Check-in liegen.")
    st.stop()

# ------------------------------------------------------------
# ONE LIVE REQUEST PER SEARCH
# ------------------------------------------------------------

try:
    with st.spinner(f"🔎 Live-Suche in {city}..."):
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
# MAP LIVE RESULTS
# ------------------------------------------------------------

results = []
unmatched = []

for hotel in raw_hotels:
    name = str(hotel.get("name", "")).strip()

    if not name:
        continue

    program, brand = classify_hotel(name)

    if program is None:
        unmatched.append(name)
        continue

    if program not in selected_programs:
        continue

    price = get_price(hotel)
    if price is None:
        continue

    status = st.session_state.get(
        f"status_{program}",
        DEFAULT_STATUS.get(program, "Member"),
    )

    benefits = PROGRAMS[program]["statuses"].get(status, [])

    promo = PERSONAL_PROMOTIONS.get(program, 0)

    effective_price = price * (1 - promo / 100)

    rating = get_rating(hotel)
    stars = to_float(hotel.get("stars"))

    points = st.session_state.get(
        f"points_{program}",
        DEFAULT_POINTS.get(program, 0),
    )

    point_rate = st.session_state.get(
        f"value_{program}",
        DEFAULT_POINT_VALUE_EUR_PER_1000.get(program, 0),
    )

    total_points_value = (points / 1000) * point_rate

    amex_credit, amex_offer, amex_triggered = amex_credit_for_hotel(
        name,
        program,
        brand,
        effective_price,
    )

    net_price = max(effective_price - amex_credit, 0.0)

    score = hotel_score(
        program,
        status,
        benefits,
        promo,
        rating,
        net_price,
    )

    results.append({
        "name": name,
        "brand": brand,
        "program": program,
        "status": status,
        "benefits": benefits,
        "promo": promo,
        "price": price,
        "effective": effective_price,
        "amex_credit": amex_credit,
        "amex_offer": amex_offer,
        "amex_triggered": amex_triggered,
        "net_price": net_price,
        "currency": get_currency(hotel, currency),
        "rating": rating,
        "stars": stars,
        "nightly": get_nightly(hotel),
        "score": score,
        "points_balance": points,
        "points_value": total_points_value,
        "amenities": hotel.get("amenities") or [],
        "address": (hotel.get("location") or {}).get("address")
            if isinstance(hotel.get("location"), dict)
            else hotel.get("address"),
        "image": (hotel.get("images") or [None])[0],
        "is_paid": bool(hotel.get("is_paid", False)),
    })

# ------------------------------------------------------------
# SORTING
# ------------------------------------------------------------

if sort_by == "Beste Kombination":
    results.sort(key=lambda x: (-x["score"], x["effective"]))
elif sort_by == "Niedrigster Preis":
    results.sort(key=lambda x: x["effective"])
elif sort_by == "Höchster Punktewert":
    results.sort(key=lambda x: -x["points_value"])
elif sort_by == "Niedrigster effektiver Preis":
    results.sort(key=lambda x: x["net_price"])
elif sort_by == "Beste Hotelbewertung":
    results.sort(key=lambda x: (-(x["rating"] or 0), x["effective"]))
else:
    results.sort(key=lambda x: x["name"].lower())

# ------------------------------------------------------------
# RESULTS
# ------------------------------------------------------------

st.subheader(f"{city}")

st.info(
    f"📅 **{check_in.strftime('%d.%m.%Y')} → {check_out.strftime('%d.%m.%Y')}**"
    f" · {adults} Erwachsene · {len(raw_hotels)} Live-Ergebnisse"
)

if not results:
    st.warning(
        "Keine passenden Hotels mit erkannter Marke und Preis gefunden."
    )

    if unmatched:
        with st.expander("Nicht erkannte Hotels anzeigen"):
            st.write("\n".join(unmatched[:100]))

    st.stop()

best = results[0]

c1, c2, c3, c4 = st.columns(4)

with c1:
    st.metric("Hotels", len(results))

with c2:
    st.metric(
        "Ab effektiv",
        f"{min(x['net_price'] for x in results):.0f} {currency}",
    )

with c3:
    st.metric(
        "Bestes Match",
        f"{best['score']}/100",
    )

with c4:
    ratings = [x["rating"] for x in results if x["rating"]]
    st.metric(
        "Ø Bewertung",
        f"{sum(ratings) / len(ratings):.1f}/5"
        if ratings else "–",
    )

st.success(
    f"🏆 **{best['name']}** · {best['program']} {best['status']} · "
    f"{best['score']}/100"
)

# ------------------------------------------------------------
# HOTEL CARDS
# ------------------------------------------------------------

for r in results:

    with st.container(border=True):

        left, price_col, value_col = st.columns([5, 2, 2])

        with left:
            st.markdown(f"### {r['name']}")
            st.write(f"**{r['brand']}** · {r['program']}")

            meta = [
                f"Status: {r['status']}",
                f"Match: {r['score']}/100",
            ]

            if r["rating"]:
                meta.append(f"⭐ {r['rating']:.1f}")

            if r["stars"]:
                meta.append(f"★ {int(r['stars'])}")

            st.caption(" · ".join(meta))

            if r["address"]:
                st.caption(r["address"])

        with price_col:
            st.metric(
                "Live-Preis",
                f"{r['price']:.2f} {r['currency']}",
            )

            if r["promo"]:
                st.success(
                    f"-{r['promo']} % Promotion"
                )
                st.caption(
                    f"Nach Promotion: {r['effective']:.2f} {r['currency']}"
                )

            if r["amex_credit"]:
                st.success(
                    f"Amex: -{r['amex_credit']:.2f} {r['currency']}"
                )
                st.caption(
                    f"Effektiv nach Amex: {r['net_price']:.2f} {r['currency']}"
                )

            elif r["amex_offer"]:
                st.caption(
                    f"Amex Offer: {r['amex_offer']['spend']:.0f} € Mindestumsatz"
                    f" → {r['amex_offer']['credit']:.0f} € Gutschrift"
                )

            if r["nightly"] is not None:
                st.caption(
                    f"≈ {r['nightly']} {r['currency']}/Nacht"
                )

        with value_col:

            benefits = r["benefits"]

            if benefits:
                st.write("**Deine Vorteile**")
                for benefit in benefits[:4]:
                    st.write(f":green[✓ {benefit}]")

                if len(benefits) > 4:
                    st.caption(
                        f"+ {len(benefits) - 4} weitere"
                    )

        # Dates are repeated directly on each hotel card so they
        # remain visible while scrolling.
        st.caption(
            f"📅 {check_in.strftime('%d.%m.%Y')} → "
            f"{check_out.strftime('%d.%m.%Y')} · {adults} Erwachsene"
        )

        # Booking links are requested only after a click.
        # This avoids spending one API request for every hotel.
        book_key = f"book_{r['program']}_{r['name']}"
        if st.button(
            "🔗 Buchen",
            key=book_key,
            use_container_width=False,
        ):
            try:
                with st.spinner("Buchungslinks werden gesucht..."):
                    links = get_booking_links(
                        api_key,
                        r["name"],
                        city,
                    )

                if not links:
                    st.info(
                        "Für dieses Hotel wurde kein direkter Partner-Link gefunden."
                    )
                else:
                    st.write("**Buchen bei:**")
                    shown = 0
                    for item in links:
                        if not isinstance(item, dict):
                            continue

                        partner = (
                            item.get("partner")
                            or item.get("provider")
                            or item.get("name")
                            or "Anbieter"
                        )

                        url = (
                            item.get("booking_link")
                            or item.get("url")
                            or item.get("link")
                        )

                        if url:
                            st.markdown(
                                f"- [{partner}]({url})"
                            )
                            shown += 1

                    if shown == 0:
                        st.info(
                            "Es wurde ein Ergebnis gefunden, aber kein nutzbarer Link geliefert."
                        )

            except Exception as exc:
                st.error(f"Buchungslinks konnten nicht geladen werden: {exc}")

        with st.expander("Alle Vorteile & Wert"):

            for benefit in benefits:
                st.write(f":green[✓ {benefit}]")

            if r["promo"]:
                st.write(
                    f"✓ Deine persönliche {r['promo']} % Promotion"
                )

            if r["amex_offer"]:
                if r["amex_triggered"]:
                    st.success(
                        f"✓ Amex Offer: {r['amex_credit']:.2f} € Gutschrift"
                    )
                else:
                    st.write(
                        f"Amex Offer: {r['amex_offer']['spend']:.0f} € Mindestumsatz"
                        f" → {r['amex_offer']['credit']:.0f} € zurück"
                    )

            st.write(
                f"**Netto nach hinterlegten Rabatten/Gutschriften: "
                f"{r['net_price']:.2f} {r['currency']}**"
            )

            st.divider()

            point_balance = r["points_balance"]
            point_value = r["points_value"]

            st.write(
                f"⭐ Dein Punktestand bei {r['program']}: "
                f"**{point_balance:,.0f} Punkte**"
            )

            st.write(
                f"Geschätzter Wert nach deiner Bewertung: "
                f"**{point_value:.2f} €**"
            )

            st.caption(
                "Der Punktwert ist deine persönliche Bewertungsannahme, "
                "kein garantierter Geldwert."
            )

        with st.expander("Hotelinformationen"):
            if r["amenities"]:
                st.write(
                    ", ".join(
                        str(x) for x in r["amenities"][:25]
                    )
                )

# ------------------------------------------------------------
# UNMATCHED HOTELS
# ------------------------------------------------------------

if unmatched:

    with st.expander(
        f"Nicht zugeordnete Live-Hotels ({len(unmatched)})"
    ):
        st.caption(
            "Diese Hotels wurden live gefunden, konnten aber noch keiner "
            "deiner 10 Loyalty-Ketten sicher zugeordnet werden."
        )
        st.write("\n".join(unmatched[:150]))

# ------------------------------------------------------------
# PERSONAL POINTS OVERVIEW
# ------------------------------------------------------------

st.divider()
st.subheader("⭐ Deine Punkte")

point_rows = []

for program in PROGRAMS:
    points = st.session_state.get(
        f"points_{program}",
        DEFAULT_POINTS.get(program, 0),
    )
    rate = st.session_state.get(
        f"value_{program}",
        DEFAULT_POINT_VALUE_EUR_PER_1000.get(program, 0),
    )

    point_rows.append(
        {
            "Programm": program,
            "Punkte": points,
            "Bewertung / 1.000": f"{rate:.2f} €",
            "Geschätzter Wert": f"{points / 1000 * rate:.2f} €",
        }
    )

st.dataframe(
    point_rows,
    use_container_width=True,
    hide_index=True,
)

st.caption(
    "API-Nutzung: 1 Live-Suche = 1 StayAPI-Request. "
    "Die Usage-Abfrage selbst ist bei StayAPI nicht abrechenbar."
)
