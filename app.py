import streamlit as st

# ============================================================
# HOTEL LOYALTY FINDER
# Personal hotel finder for 10 loyalty programmes
# ============================================================

st.set_page_config(
    page_title="Hotel Loyalty Finder",
    page_icon="🏨",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ------------------------------------------------------------
# PERSONAL SETTINGS
# Change these defaults if your status changes.
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

PERSONAL_PROMOTIONS = {
    "MeliáRewards": 20,  # Your personal 20% Meliá promotion
}

PROGRAMS = {
    "Hilton Honors": {
        "color": "🟦",
        "brands": [
            "Waldorf Astoria", "Conrad", "LXR", "NoMad", "Canopy",
            "Hilton", "Curio Collection", "DoubleTree",
            "Tapestry Collection", "Embassy Suites", "Hilton Garden Inn",
            "Hampton", "Homewood Suites", "Home2 Suites", "Tru"
        ],
        "statuses": {
            "Member": ["Member Rate", "Punkte sammeln", "Kostenloses WLAN"],
            "Silver": ["20 % Bonuspunkte", "5. Nacht bei Prämienaufenthalten kostenlos"],
            "Gold": [
                "80 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Frühstück außerhalb der USA / Food & Beverage Credit in den USA",
                "5. Nacht bei Prämienaufenthalten kostenlos",
                "MyWay-Hotelvorteile je nach Marke"
            ],
            "Diamond": [
                "100 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Frühstück bzw. Food & Beverage Credit",
                "Executive Lounge Zugang bei teilnehmenden Hotels",
                "Premium WLAN",
                "48-Stunden-Zimmergarantie"
            ],
            "Diamond Reserve": [
                "Alle Diamond-Vorteile",
                "Zusätzliche Diamond Reserve Vorteile"
            ],
        },
    },

    "Marriott Bonvoy": {
        "color": "🟫",
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
            "Gold Elite": ["25 % Punktebonus", "Zimmer-Upgrade nach Verfügbarkeit", "Late Check-out nach Verfügbarkeit"],
            "Platinum Elite": [
                "50 % Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit, einschließlich ausgewählter Suiten",
                "Late Check-out bis 16:00 Uhr nach Verfügbarkeit",
                "Willkommensgeschenk",
                "Lounge-Zugang bei teilnehmenden Marken"
            ],
            "Titanium Elite": [
                "75 % Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit, einschließlich ausgewählter Suiten",
                "Late Check-out bis 16:00 Uhr nach Verfügbarkeit",
                "Willkommensgeschenk",
                "Lounge-Zugang bei teilnehmenden Marken"
            ],
        },
    },

    "IHG One Rewards": {
        "color": "🟪",
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
                "Late Check-out nach Verfügbarkeit"
            ],
            "Diamond Elite": [
                "100 % Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Frühstück bei teilnehmenden Marken",
                "Member Rate",
                "Kostenloses WLAN",
                "Late Check-out nach Verfügbarkeit"
            ],
        },
    },

    "ALL - Accor Live Limitless": {
        "color": "🟥",
        "brands": [
            "Raffles", "Fairmont", "Sofitel", "MGallery", "Pullman",
            "Swissôtel", "Mövenpick", "Grand Mercure", "Novotel",
            "Mercure", "Adagio", "ibis", "ibis Styles", "ibis budget",
            "25hours", "Mondrian", "The Hoxton"
        ],
        "statuses": {
            "Classic": ["Member Rate", "Premium WLAN", "Reward Points sammeln"],
            "Silver": [
                "Welcome Drink",
                "Priority Welcome",
                "Late Check-out nach Verfügbarkeit",
                "24 % Reward-Points-Bonus"
            ],
            "Gold": [
                "Welcome Drink",
                "Priority Welcome",
                "Garantierte Zimmerverfügbarkeit nach Bedingungen",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in oder Late Check-out",
                "48 % Reward-Points-Bonus"
            ],
            "Platinum": [
                "Welcome Drink",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Suite Night Upgrade(s)",
                "Lounge-Zugang bei teilnehmenden Hotels",
                "Early Check-in und Late Check-out",
                "76 % Reward-Points-Bonus"
            ],
            "Diamond": [
                "Alle Platinum-Vorteile",
                "Kostenloses Frühstück am Wochenende",
                "Dining & Spa Rewards",
                "Gold-Status für eine Person deiner Wahl",
                "100 % Reward-Points-Bonus"
            ],
        },
    },

    "Radisson Rewards": {
        "color": "🟧",
        "brands": [
            "Radisson Collection", "Radisson Blu", "Radisson",
            "Radisson RED", "Park Plaza", "Park Inn by Radisson",
            "Country Inn & Suites", "art'otel"
        ],
        "statuses": {
            "Club": ["Member Rate", "Bis zu 15 % Mitgliederrabatt", "Priority Line", "10 % Rabatt auf Speisen und Getränke"],
            "Premium": [
                "Kostenloses Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "10 % Rabatt auf Speisen und Getränke",
                "Optionaler Sonderrabatt bis zu 20 %"
            ],
            "VIP": [
                "Upgrade bis zur besten verfügbaren Zimmerkategorie",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Kostenloses Frühstück für zwei Personen",
                "Exklusiver VIP-Zugang bei ausgewählten Hotels",
                "15 % Rabatt auf Speisen und Getränke",
                "24h VIP Contact Center"
            ],
        },
    },

    "MeliáRewards": {
        "color": "🟨",
        "brands": [
            "Gran Meliá", "ME by Meliá", "Paradisus", "Meliá",
            "INNSiDE", "Zel", "TRYP", "Sol by Meliá"
        ],
        "statuses": {
            "White": ["Member Rate", "Punkte sammeln"],
            "Silver": ["Zimmer-Upgrade nach Verfügbarkeit", "Late Check-out nach Verfügbarkeit"],
            "Gold": [
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Deine persönliche 20 % Promotion"
            ],
            "Platinum": [
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Weitere Platinum-Vorteile je nach Marke",
                "Deine persönliche 20 % Promotion"
            ],
        },
    },

    "GHA DISCOVERY": {
        "color": "🟩",
        "brands": [
            "Anantara", "Capella", "Kempinski", "NH Collection", "NH Hotels",
            "Tivoli", "Avani", "Viceroy", "The Doyle Collection",
            "Pan Pacific", "Park Hyatt", "Anantara Vacation Club"
        ],
        "statuses": {
            "Silver": [
                "4 % D$ auf anrechenbare Ausgaben",
                "Member Rate",
                "Local Offers",
                "Experiences",
                "Kostenloses WLAN"
            ],
            "Gold": [
                "5 % D$ auf anrechenbare Ausgaben",
                "Member Rate",
                "Local Offers",
                "Experiences",
                "Kostenloses WLAN"
            ],
            "Platinum": [
                "6 % D$ auf anrechenbare Ausgaben",
                "3pm Late Check-out nach Verfügbarkeit",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Welcome Amenity",
                "Local Offers und Experiences"
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
        "color": "🟦",
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
        "color": "⬛",
        "brands": [
            "WorldHotels Luxury", "WorldHotels Elite",
            "WorldHotels Crafted", "WorldHotels Distinctive"
        ],
        "statuses": {
            "Red": ["Member Rate", "10 Punkte pro US-Dollar"],
            "Gold": [
                "10 % Bonuspunkte",
                "Früher Check-in / späte Abreise nach Verfügbarkeit",
                "Beste Zimmerzuweisung / Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity"
            ],
            "Platinum": [
                "15 % Bonuspunkte",
                "Früher Check-in / späte Abreise nach Verfügbarkeit",
                "Beste Zimmerzuweisung / Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity"
            ],
            "Diamond": [
                "30 % Bonuspunkte",
                "Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity",
                "Lounge-Zugang bei teilnehmenden Hotels"
            ],
            "Diamond Select": [
                "50 % Bonuspunkte",
                "Upgrade nach Verfügbarkeit",
                "Willkommens-Amenity",
                "Lounge-Zugang",
                "Kostenloses Frühstück bei teilnehmenden Hotels"
            ],
        },
    },

    "Best Western Rewards": {
        "color": "🟦",
        "brands": [
            "Best Western", "Best Western Plus", "Best Western Premier",
            "BW Premier Collection", "Executive Residency",
            "SureStay", "SureStay Plus", "SureStay Collection"
        ],
        "statuses": {
            "Blue": ["10 Punkte pro US-Dollar", "Punkte verfallen nicht", "Member Rate"],
            "Gold": [
                "10 % Bonuspunkte",
                "Kostenlose Flasche Wasser und Punkte bei der Ankunft",
                "Member Rate",
                "Punkte verfallen nicht"
            ],
            "Platinum": [
                "15 % Bonuspunkte",
                "Kostenlose Flasche Wasser und Punkte bei der Ankunft",
                "Früher Check-in / später Check-out nach Verfügbarkeit",
                "Member Rate"
            ],
            "Diamond": [
                "30 % Bonuspunkte",
                "Kostenlose Flasche Wasser und Punkte bei der Ankunft",
                "Früher Check-in / später Check-out nach Verfügbarkeit",
                "Member Rate"
            ],
            "Diamond Select": [
                "50 % Bonuspunkte",
                "Kostenlose Flasche Wasser und Punkte bei der Ankunft",
                "Früher Check-in / später Check-out nach Verfügbarkeit",
                "Member Rate"
            ],
        },
    },
}

# ------------------------------------------------------------
# TEST HOTEL DATA
# This will later be replaced by a live hotel data source.
# ------------------------------------------------------------

HOTELS = [
    # Berlin
    ("Hilton Berlin", "Hilton", "Hilton Honors", "Berlin", 170),
    ("Waldorf Astoria Berlin", "Waldorf Astoria", "Hilton Honors", "Berlin", 420),
    ("Berlin Marriott Hotel", "Marriott Hotels", "Marriott Bonvoy", "Berlin", 180),
    ("JW Marriott Hotel Berlin", "JW Marriott", "Marriott Bonvoy", "Berlin", 240),
    ("InterContinental Berlin", "InterContinental", "IHG One Rewards", "Berlin", 160),
    ("Hotel Indigo Berlin", "Hotel Indigo", "IHG One Rewards", "Berlin", 150),
    ("Pullman Berlin Schweizerhof", "Pullman", "ALL - Accor Live Limitless", "Berlin", 145),
    ("Novotel Berlin Mitte", "Novotel", "ALL - Accor Live Limitless", "Berlin", 120),
    ("Radisson Collection Hotel Berlin", "Radisson Collection", "Radisson Rewards", "Berlin", 190),
    ("Meliá Berlin", "Meliá", "MeliáRewards", "Berlin", 155),
    ("NH Collection Berlin Mitte", "NH Collection", "GHA DISCOVERY", "Berlin", 145),
    ("Best Western Premier Berlin", "Best Western Premier", "Best Western Rewards", "Berlin", 125),

    # London
    ("Conrad London St. James", "Conrad", "Hilton Honors", "London", 350),
    ("Hilton London Bankside", "Hilton", "Hilton Honors", "London", 280),
    ("London Marriott Hotel County Hall", "Marriott Hotels", "Marriott Bonvoy", "London", 360),
    ("St. Pancras Renaissance Hotel London", "Renaissance", "Marriott Bonvoy", "London", 330),
    ("InterContinental London Park Lane", "InterContinental", "IHG One Rewards", "London", 400),
    ("Hotel Indigo London", "Hotel Indigo", "IHG One Rewards", "London", 230),
    ("Novotel London Blackfriars", "Novotel", "ALL - Accor Live Limitless", "London", 190),
    ("Pullman London St Pancras", "Pullman", "ALL - Accor Live Limitless", "London", 210),
    ("Radisson Blu Edwardian", "Radisson Blu", "Radisson Rewards", "London", 220),
    ("Meliá White House", "Meliá", "MeliáRewards", "London", 200),
    ("NH Collection London", "NH Collection", "GHA DISCOVERY", "London", 230),
    ("Best Western London", "Best Western", "Best Western Rewards", "London", 120),

    # New York
    ("Hilton Midtown", "Hilton", "Hilton Honors", "New York", 280),
    ("Conrad New York Downtown", "Conrad", "Hilton Honors", "New York", 330),
    ("New York Marriott Marquis", "Marriott Hotels", "Marriott Bonvoy", "New York", 320),
    ("JW Marriott Essex House", "JW Marriott", "Marriott Bonvoy", "New York", 450),
    ("InterContinental New York Barclay", "InterContinental", "IHG One Rewards", "New York", 270),
    ("Kimpton Hotel Eventi", "Kimpton", "IHG One Rewards", "New York", 250),
    ("Novotel New York Times Square", "Novotel", "ALL - Accor Live Limitless", "New York", 230),
    ("Radisson Hotel New York", "Radisson", "Radisson Rewards", "New York", 190),
    ("Meliá New York", "Meliá", "MeliáRewards", "New York", 220),
    ("NH Collection New York", "NH Collection", "GHA DISCOVERY", "New York", 250),

    # Paris
    ("Hilton Paris Opera", "Hilton", "Hilton Honors", "Paris", 320),
    ("Paris Marriott Opera Ambassador", "Marriott Hotels", "Marriott Bonvoy", "Paris", 280),
    ("Renaissance Paris Arc de Triomphe", "Renaissance", "Marriott Bonvoy", "Paris", 300),
    ("InterContinental Paris Le Grand", "InterContinental", "IHG One Rewards", "Paris", 420),
    ("Hotel Indigo Paris", "Hotel Indigo", "IHG One Rewards", "Paris", 240),
    ("Pullman Paris Tour Eiffel", "Pullman", "ALL - Accor Live Limitless", "Paris", 330),
    ("Novotel Paris Centre Tour Eiffel", "Novotel", "ALL - Accor Live Limitless", "Paris", 190),
    ("Meliá Paris La Défense", "Meliá", "MeliáRewards", "Paris", 180),
    ("Radisson Blu Paris", "Radisson Blu", "Radisson Rewards", "Paris", 210),

    # Tokyo
    ("Hilton Tokyo", "Hilton", "Hilton Honors", "Tokyo", 300),
    ("Conrad Tokyo", "Conrad", "Hilton Honors", "Tokyo", 420),
    ("The Ritz-Carlton Tokyo", "The Ritz-Carlton", "Marriott Bonvoy", "Tokyo", 600),
    ("JW Marriott Tokyo", "JW Marriott", "Marriott Bonvoy", "Tokyo", 500),
    ("InterContinental Tokyo Bay", "InterContinental", "IHG One Rewards", "Tokyo", 280),
    ("Hotel Indigo Tokyo Shibuya", "Hotel Indigo", "IHG One Rewards", "Tokyo", 260),
    ("Pullman Tokyo Tamachi", "Pullman", "ALL - Accor Live Limitless", "Tokyo", 250),
    ("Meliá Tokyo", "Meliá", "MeliáRewards", "Tokyo", 210),
    ("Radisson Tokyo", "Radisson", "Radisson Rewards", "Tokyo", 220),
    ("NH Collection Tokyo", "NH Collection", "GHA DISCOVERY", "Tokyo", 230),

    # Istanbul
    ("Hilton Istanbul Bosphorus", "Hilton", "Hilton Honors", "Istanbul", 150),
    ("Conrad Istanbul Bosphorus", "Conrad", "Hilton Honors", "Istanbul", 170),
    ("Istanbul Marriott Hotel Sisli", "Marriott Hotels", "Marriott Bonvoy", "Istanbul", 150),
    ("JW Marriott Istanbul Bosphorus", "JW Marriott", "Marriott Bonvoy", "Istanbul", 220),
    ("InterContinental Istanbul", "InterContinental", "IHG One Rewards", "Istanbul", 160),
    ("Hotel Indigo Istanbul", "Hotel Indigo", "IHG One Rewards", "Istanbul", 130),
    ("Novotel Istanbul Bosphorus", "Novotel", "ALL - Accor Live Limitless", "Istanbul", 120),
    ("Meliá Istanbul", "Meliá", "MeliáRewards", "Istanbul", 110),
    ("Radisson Blu Istanbul", "Radisson Blu", "Radisson Rewards", "Istanbul", 120),
    ("NH Collection Istanbul", "NH Collection", "GHA DISCOVERY", "Istanbul", 130),
]

def get_benefits(program, status):
    return PROGRAMS.get(program, {}).get("statuses", {}).get(status, [])

def promotion(program):
    return PERSONAL_PROMOTIONS.get(program, 0)

def effective_price(price, program):
    discount = promotion(program)
    return price * (1 - discount / 100)

def score_hotel(program, benefits, promo):
    score = 50
    text = " ".join(benefits).lower()

    if "frühstück" in text:
        score += 15
    if "upgrade" in text:
        score += 12
    if "late check-out" in text or "späte abreise" in text:
        score += 8
    if "lounge" in text:
        score += 8
    if promo:
        score += min(promo / 2, 10)

    return min(round(score), 100)


# ============================================================
# LIVE STAYAPI SEARCH
# ============================================================
#
# Streamlit Cloud Secret:
# STAYAPI_KEY = "your_key"
#
# StayAPI endpoint:
# GET https://api.stayapi.com/v1/google_hotels/search
# ============================================================

import requests
from datetime import date, timedelta

STAYAPI_URL = "https://api.stayapi.com/v1/google_hotels/search"

def search_live_hotels(api_key, location, check_in, check_out, adults, currency):
    response = requests.get(
        STAYAPI_URL,
        headers={"X-API-Key": api_key},
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
        raise RuntimeError("StayAPI-Key ungültig oder nicht akzeptiert.")
    if response.status_code == 403:
        raise RuntimeError("StayAPI-Zugriff verweigert oder Kontingent erreicht.")
    if not response.ok:
        try:
            detail = response.json()
        except Exception:
            detail = response.text[:500]
        raise RuntimeError(f"StayAPI Fehler {response.status_code}: {detail}")

    return response.json()

def classify_hotel(name):
    name_low = name.lower()

    rules = [
        ("waldorf astoria", "Waldorf Astoria", "Hilton Honors"),
        ("conrad", "Conrad", "Hilton Honors"),
        ("doubletree", "DoubleTree", "Hilton Honors"),
        ("hilton garden inn", "Hilton Garden Inn", "Hilton Honors"),
        ("hampton", "Hampton", "Hilton Honors"),
        ("homewood", "Homewood Suites", "Hilton Honors"),
        ("home2", "Home2 Suites", "Hilton Honors"),
        ("curio", "Curio Collection", "Hilton Honors"),
        ("tapestry", "Tapestry Collection", "Hilton Honors"),
        ("hilton", "Hilton", "Hilton Honors"),

        ("ritz-carlton", "The Ritz-Carlton", "Marriott Bonvoy"),
        ("ritz carlton", "The Ritz-Carlton", "Marriott Bonvoy"),
        ("st. regis", "St. Regis", "Marriott Bonvoy"),
        ("jw marriott", "JW Marriott", "Marriott Bonvoy"),
        ("w hotel", "W Hotels", "Marriott Bonvoy"),
        ("w hotels", "W Hotels", "Marriott Bonvoy"),
        ("edition", "EDITION", "Marriott Bonvoy"),
        ("sheraton", "Sheraton", "Marriott Bonvoy"),
        ("westin", "Westin", "Marriott Bonvoy"),
        ("renaissance", "Renaissance", "Marriott Bonvoy"),
        ("le méridien", "Le Méridien", "Marriott Bonvoy"),
        ("le meridien", "Le Méridien", "Marriott Bonvoy"),
        ("autograph collection", "Autograph Collection", "Marriott Bonvoy"),
        ("courtyard", "Courtyard", "Marriott Bonvoy"),
        ("moxy", "Moxy", "Marriott Bonvoy"),
        ("aloft", "Aloft", "Marriott Bonvoy"),
        ("marriott", "Marriott Hotels", "Marriott Bonvoy"),

        ("intercontinental", "InterContinental", "IHG One Rewards"),
        ("six senses", "Six Senses", "IHG One Rewards"),
        ("regent", "Regent", "IHG One Rewards"),
        ("kimpton", "Kimpton", "IHG One Rewards"),
        ("hotel indigo", "Hotel Indigo", "IHG One Rewards"),
        ("crowne plaza", "Crowne Plaza", "IHG One Rewards"),
        ("holiday inn express", "Holiday Inn Express", "IHG One Rewards"),
        ("holiday inn", "Holiday Inn", "IHG One Rewards"),
        ("voco", "voco", "IHG One Rewards"),

        ("raffles", "Raffles", "ALL - Accor Live Limitless"),
        ("fairmont", "Fairmont", "ALL - Accor Live Limitless"),
        ("sofitel", "Sofitel", "ALL - Accor Live Limitless"),
        ("mgallery", "MGallery", "ALL - Accor Live Limitless"),
        ("pullman", "Pullman", "ALL - Accor Live Limitless"),
        ("swissôtel", "Swissôtel", "ALL - Accor Live Limitless"),
        ("swissotel", "Swissôtel", "ALL - Accor Live Limitless"),
        ("mövenpick", "Mövenpick", "ALL - Accor Live Limitless"),
        ("movenpick", "Mövenpick", "ALL - Accor Live Limitless"),
        ("novotel", "Novotel", "ALL - Accor Live Limitless"),
        ("mercure", "Mercure", "ALL - Accor Live Limitless"),
        ("ibis", "ibis", "ALL - Accor Live Limitless"),
        ("25hours", "25hours", "ALL - Accor Live Limitless"),
        ("mondrian", "Mondrian", "ALL - Accor Live Limitless"),
        ("the hoxton", "The Hoxton", "ALL - Accor Live Limitless"),

        ("radisson collection", "Radisson Collection", "Radisson Rewards"),
        ("radisson blu", "Radisson Blu", "Radisson Rewards"),
        ("radisson red", "Radisson RED", "Radisson Rewards"),
        ("radisson", "Radisson", "Radisson Rewards"),
        ("park plaza", "Park Plaza", "Radisson Rewards"),
        ("park inn", "Park Inn by Radisson", "Radisson Rewards"),

        ("gran melia", "Gran Meliá", "MeliáRewards"),
        ("gran meliá", "Gran Meliá", "MeliáRewards"),
        ("me by melia", "ME by Meliá", "MeliáRewards"),
        ("me by meliá", "ME by Meliá", "MeliáRewards"),
        ("innside", "INNSiDE", "MeliáRewards"),
        ("melia", "Meliá", "MeliáRewards"),
        ("meliá", "Meliá", "MeliáRewards"),

        ("anantara", "Anantara", "GHA DISCOVERY"),
        ("kempinski", "Kempinski", "GHA DISCOVERY"),
        ("nh collection", "NH Collection", "GHA DISCOVERY"),
        ("nh hotels", "NH Hotels", "GHA DISCOVERY"),
        ("nh ", "NH Hotels", "GHA DISCOVERY"),
        ("tivoli", "Tivoli", "GHA DISCOVERY"),
        ("avani", "Avani", "GHA DISCOVERY"),

        ("wyndham grand", "Wyndham Grand", "Wyndham Rewards"),
        ("wyndham", "Wyndham", "Wyndham Rewards"),
        ("ramada", "Ramada", "Wyndham Rewards"),
        ("days inn", "Days Inn", "Wyndham Rewards"),
        ("super 8", "Super 8", "Wyndham Rewards"),
        ("la quinta", "La Quinta", "Wyndham Rewards"),

        ("worldhotels", "WorldHotels", "WorldHotels Rewards"),

        ("best western premier", "Best Western Premier", "Best Western Rewards"),
        ("best western plus", "Best Western Plus", "Best Western Rewards"),
        ("best western", "Best Western", "Best Western Rewards"),
    ]

    for needle, brand, program in rules:
        if needle in name_low:
            return program, brand

    return None, None

def calc_score(benefits, promo, rating):
    score = 45
    text = " ".join(benefits).lower()

    if "frühstück" in text:
        score += 15
    if "upgrade" in text:
        score += 12
    if "late check-out" in text or "späte abreise" in text:
        score += 8
    if "lounge" in text:
        score += 8
    if promo:
        score += min(promo / 2, 10)
    if rating:
        score += min(max((rating - 4.0) * 5, 0), 10)

    return min(round(score), 100)

# ============================================================
# APP UI
# ============================================================

st.markdown("""
<style>
.block-container {
    max-width: 1250px;
    padding-top: 1.5rem;
}
.hotel-card {
    padding: 1rem 1.1rem;
    border: 1px solid rgba(128,128,128,.22);
    border-radius: 16px;
    margin-bottom: 1rem;
}
</style>
""", unsafe_allow_html=True)

st.title("🏨 Hotel Loyalty Finder")
st.caption("Live-Hotels · Live-Preise · dein Status · deine Promotions")

st.sidebar.header("🔎 Suche")

city = st.sidebar.text_input(
    "Stadt",
    value="Istanbul",
)

today = date.today()

check_in = st.sidebar.date_input(
    "Check-in",
    value=today + timedelta(days=7),
    min_value=today,
)

check_out = st.sidebar.date_input(
    "Check-out",
    value=today + timedelta(days=9),
    min_value=today + timedelta(days=1),
)

adults = st.sidebar.number_input(
    "Erwachsene",
    min_value=1,
    max_value=10,
    value=2,
)

currency = st.sidebar.selectbox(
    "Währung",
    ["EUR", "GBP", "USD"],
)

st.sidebar.divider()
st.sidebar.subheader("Hotelketten")

selected_programs = []
for program in PROGRAMS:
    if st.sidebar.checkbox(program, value=True):
        selected_programs.append(program)

with st.sidebar.expander("💳 Meine Status"):
    st.caption("Deine Statuslevel")
    for program, data in PROGRAMS.items():
        statuses = list(data["statuses"].keys())
        default = DEFAULT_STATUS.get(program, statuses[0])
        if default not in statuses:
            default = statuses[0]

        st.session_state[f"status_{program}"] = st.selectbox(
            program,
            statuses,
            index=statuses.index(default),
            key=f"status_box_{program}",
        )

with st.sidebar.expander("🎁 Meine Promotions"):
    st.write("MeliáRewards")
    st.success("20 % persönliche Promotion")

sort_by = st.sidebar.selectbox(
    "Sortieren nach",
    ["Persönlicher Statuswert", "Preis", "Hotelbewertung", "Hotelname"],
)

api_key = st.secrets.get("STAYAPI_KEY", "")

if not api_key:
    st.warning("🔑 Dein StayAPI-Key fehlt noch.")
    st.info(
        "Streamlit → Manage app → Settings → Secrets → "
        "STAYAPI_KEY = \"DEIN_KEY\""
    )
    st.stop()

if check_out <= check_in:
    st.error("Check-out muss nach Check-in liegen.")
    st.stop()

try:
    with st.spinner(f"🔎 Live-Hotels und Preise für {city} werden gesucht..."):
        payload = search_live_hotels(
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

results = []

for hotel in raw_hotels:
    name = hotel.get("name", "")
    program, brand = classify_hotel(name)

    if not program or program not in selected_programs:
        continue

    status = st.session_state.get(
        f"status_{program}",
        DEFAULT_STATUS.get(program, "Member"),
    )

    benefits = PROGRAMS[program]["statuses"].get(status, [])
    promo = PERSONAL_PROMOTIONS.get(program, 0)

    price_obj = hotel.get("price") or {}

    current = price_obj.get("current")
    if current is None:
        continue

    try:
        current = float(current)
    except (TypeError, ValueError):
        continue

    price_currency = price_obj.get("currency") or currency
    effective = current * (1 - promo / 100)

    rating_obj = hotel.get("rating") or {}
    rating = rating_obj.get("value")

    try:
        rating = float(rating)
    except (TypeError, ValueError):
        rating = None

    score = calc_score(
        benefits,
        promo,
        rating,
    )

    location = hotel.get("location") or {}

    results.append({
        "name": name,
        "brand": brand,
        "program": program,
        "status": status,
        "benefits": benefits,
        "promo": promo,
        "price": current,
        "effective": effective,
        "currency": price_currency,
        "nightly": price_obj.get("price_per_night"),
        "rating": rating,
        "rating_votes": rating_obj.get("votes"),
        "stars": hotel.get("stars"),
        "amenities": hotel.get("amenities") or [],
        "address": location.get("address"),
        "image": (hotel.get("images") or [None])[0],
        "is_paid": hotel.get("is_paid", False),
        "check_in_time": hotel.get("check_in_time"),
        "check_out_time": hotel.get("check_out_time"),
        "score": score,
    })

if sort_by == "Persönlicher Statuswert":
    results.sort(key=lambda x: (-x["score"], x["effective"]))
elif sort_by == "Preis":
    results.sort(key=lambda x: x["effective"])
elif sort_by == "Hotelbewertung":
    results.sort(key=lambda x: (-(x["rating"] or 0), x["effective"]))
else:
    results.sort(key=lambda x: x["name"].lower())

st.subheader(f"Hotels in {city}")

st.caption(
    f"Live-Suche · {check_in.strftime('%d.%m.%Y')} – "
    f"{check_out.strftime('%d.%m.%Y')} · {adults} Erwachsene"
)

if not results:
    st.warning(
        "Keine Hotels deiner ausgewählten Loyalty-Ketten wurden in den "
        "Live-Ergebnissen erkannt. Die allgemeine StayAPI-Hotelsuche kann "
        "mehr Hotels liefern als unsere aktuelle Marken-Zuordnung erkennt."
    )

    with st.expander("🔧 Debug: erkannte Live-Hotels"):
        for hotel in raw_hotels[:50]:
            st.write(hotel.get("name", "Unbekannt"))

    st.stop()

best = results[0]

c1, c2, c3, c4 = st.columns(4)

with c1:
    st.metric("Passende Hotels", len(results))

with c2:
    st.metric(
        "Günstigster Preis",
        f"{min(x['effective'] for x in results):.0f} {currency}"
    )

with c3:
    st.metric("Bestes Match", f"{best['score']}/100")

with c4:
    ratings = [x["rating"] for x in results if x["rating"]]
    st.metric(
        "Ø Bewertung",
        f"{sum(ratings) / len(ratings):.1f}/5" if ratings else "–"
    )

st.success(
    f"🏆 Bestes persönliches Match: **{best['name']}** · "
    f"{best['program']} {best['status']} · {best['score']}/100"
)

for r in results:
    with st.container(border=True):
        col1, col2, col3 = st.columns([5, 2, 2])

        with col1:
            st.markdown(f"### 🏨 {r['name']}")
            st.write(f"**{r['brand']}** · {r['program']}")
            if r["address"]:
                st.caption(r["address"])

            parts = [f"Status: {r['status']}", f"Match: {r['score']}/100"]

            if r["rating"]:
                parts.append(f"⭐ {r['rating']:.1f}/5")

            if r["stars"]:
                parts.append(f"★ {r['stars']}")

            st.write(" · ".join(parts))

        with col2:
            st.metric(
                "Live-Preis",
                f"{r['price']:.2f} {r['currency']}"
            )

            if r["promo"]:
                st.success(f"🎁 -{r['promo']} %")
                st.write(
                    f"Effektiv: **{r['effective']:.2f} {r['currency']}**"
                )

            if r["nightly"] is not None:
                st.caption(
                    f"≈ {r['nightly']} {r['currency']}/Nacht"
                )

        with col3:
            if r["rating"]:
                st.write(f"⭐ **{r['rating']:.1f}/5**")

            if r["stars"]:
                st.write(f"★ {r['stars']} Sterne")

            if r["check_in_time"]:
                st.caption(f"Check-in: {r['check_in_time']}")

            if r["check_out_time"]:
                st.caption(f"Check-out: {r['check_out_time']}")

            if r["is_paid"]:
                st.caption("Gesponsertes Ergebnis")

        with st.expander("🎁 Meine Vorteile"):
            for benefit in r["benefits"]:
                st.write(f"✓ {benefit}")

            if r["promo"]:
                st.write(
                    f"✓ Persönliche {r['promo']} % Meliá-Promotion"
                )

        with st.expander("🏨 Hotelinformationen"):
            if r["amenities"]:
                st.write("**Ausstattung:**")
                st.write(", ".join(str(a) for a in r["amenities"][:25]))

        with st.expander("💶 Preis"):
            st.write(
                "Der Preis stammt aus dem aktuellen Live-Ergebnis. "
                "Preise und Verfügbarkeit können sich jederzeit ändern."
            )
            if r["promo"]:
                st.write(f"API-Preis: {r['price']:.2f} {r['currency']}")
                st.write(
                    f"Nach deiner Promotion: "
                    f"{r['effective']:.2f} {r['currency']}"
                )

st.divider()

st.caption(
    "Live-Hotel- und Preisdaten: StayAPI/Google Hotels. "
    "Loyalty-Vorteile: persönliche Regel-Datenbank. "
    "Die Vorteile können je nach Marke, Land, Tarif und Verfügbarkeit abweichen."
)
