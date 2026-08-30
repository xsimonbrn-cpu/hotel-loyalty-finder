import streamlit as st

# ============================================================
# HOTEL LOYALTY FINDER
# ============================================================
#
# Version 2
#
# Hotelprogramme:
# Hilton
# Marriott
# IHG
# Accor
# Radisson
# Meliá
# GHA DISCOVERY
# Wyndham
# WorldHotels
# Best Western
#
# AKTUELL:
# - Test-Hoteldaten
# - Loyalty-Datenbank
# - persönliche Statuslevel
# - Meliá 20%-Promotion
# - Filter nach Hotelkette
#
# NÄCHSTER SCHRITT:
# Echte Hotel-Datenquelle/API
# ============================================================


# ============================================================
# SEITENKONFIGURATION
# ============================================================

st.set_page_config(
    page_title="Hotel Loyalty Finder",
    page_icon="🏨",
    layout="wide"
)


# ============================================================
# DEINE PERSÖNLICHEN STATUSLEVEL
# ============================================================
#
# Diese Werte kannst du jederzeit ändern.
#
# Die App zeigt nur die Vorteile des hier eingetragenen
# Statuslevels.
# ============================================================

MY_STATUS = {

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


# ============================================================
# PERSÖNLICHE PROMOTIONS
# ============================================================
#
# Deine Meliá 20%-Promotion.
#
# 20 = 20 Prozent Rabatt.
# ============================================================

PERSONAL_PROMOTIONS = {

    "MeliáRewards": 20

}


# ============================================================
# LOYALTY-DATENBANK
# ============================================================
#
# Hier liegen die Programme, Statuslevel und Vorteile.
#
# Die Struktur ist so aufgebaut, dass später weitere
# Statuslevel problemlos ergänzt werden können.
# ============================================================

LOYALTY = {

    # ========================================================
    # HILTON
    # ========================================================

    "Hilton Honors": {

        "brands": [
            "Waldorf Astoria",
            "Conrad",
            "LXR",
            "NoMad",
            "Signia Hilton",
            "Canopy",
            "Hilton",
            "Curio Collection",
            "DoubleTree",
            "Tapestry Collection",
            "Embassy Suites",
            "Hilton Garden Inn",
            "Hampton",
            "Homewood Suites",
            "Home2 Suites",
            "Tru"
        ],

        "statuses": {

            "Member": [
                "Member Rate",
                "Punkte sammeln",
                "Kostenloses WLAN"
            ],

            "Silver": [
                "20 % Bonuspunkte",
                "5. Nacht bei Prämienaufenthalten kostenlos",
                "Kostenloses WLAN",
                "Weitere Silver-Vorteile je nach Marke"
            ],

            "Gold": [
                "80 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Frühstück außerhalb der USA bzw. Food & Beverage Credit in den USA",
                "5. Nacht bei Prämienaufenthalten kostenlos",
                "Kostenloses WLAN",
                "Weitere Gold-Vorteile je nach Marke"
            ],

            "Diamond": [
                "100 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Frühstück bzw. Food & Beverage Credit",
                "Executive Lounge Zugang bei teilnehmenden Hotels",
                "Premium WLAN",
                "48-Stunden-Zimmergarantie",
                "5. Nacht bei Prämienaufenthalten kostenlos"
            ]
        }
    },


    # ========================================================
    # MARRIOTT
    # ========================================================

    "Marriott Bonvoy": {

        "brands": [
            "The Ritz-Carlton",
            "St. Regis",
            "JW Marriott",
            "W Hotels",
            "EDITION",
            "The Luxury Collection",
            "Marriott Hotels",
            "Sheraton",
            "Westin",
            "Renaissance",
            "Le Méridien",
            "Autograph Collection",
            "Tribute Portfolio",
            "Delta Hotels",
            "Gaylord Hotels",
            "Courtyard",
            "Four Points",
            "Aloft",
            "Moxy",
            "Element",
            "AC Hotels",
            "Residence Inn",
            "TownePlace Suites"
        ],

        "statuses": {

            "Member": [
                "Member Rate",
                "Kostenloses WLAN",
                "Punkte sammeln"
            ],

            "Silver Elite": [
                "10 % Bonuspunkte",
                "Late Check-out nach Verfügbarkeit",
                "Priority Late Check-out"
            ],

            "Gold Elite": [
                "25 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit"
            ],

            "Platinum Elite": [
                "50 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Suite-Upgrade nach Verfügbarkeit",
                "Late Check-out bis 16:00 Uhr nach Verfügbarkeit",
                "Willkommensgeschenk",
                "Lounge-Zugang bei teilnehmenden Marken"
            ],

            "Titanium Elite": [
                "75 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Suite-Upgrade nach Verfügbarkeit",
                "Late Check-out bis 16:00 Uhr nach Verfügbarkeit",
                "Willkommensgeschenk",
                "Lounge-Zugang bei teilnehmenden Marken"
            ]
        }
    },


    # ========================================================
    # IHG
    # ========================================================

    "IHG One Rewards": {

        "brands": [
            "InterContinental",
            "Six Senses",
            "Regent",
            "Kimpton",
            "Vignette Collection",
            "Hotel Indigo",
            "Crowne Plaza",
            "EVEN Hotels",
            "voco",
            "Holiday Inn",
            "Holiday Inn Express",
            "Staybridge Suites",
            "Candlewood Suites"
        ],

        "statuses": {

            "Club Member": [
                "Member Rate",
                "Punkte sammeln",
                "Kostenloses WLAN"
            ],

            "Silver Elite": [
                "20 % Bonuspunkte",
                "Member Rate",
                "Kostenloses WLAN"
            ],

            "Gold Elite": [
                "40 % Bonuspunkte",
                "Member Rate",
                "Kostenloses WLAN",
                "Late Check-out nach Verfügbarkeit"
            ],

            "Platinum Elite": [
                "60 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Member Rate",
                "Kostenloses WLAN",
                "Late Check-out nach Verfügbarkeit"
            ],

            "Diamond Elite": [
                "100 % Bonuspunkte",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Frühstück bei teilnehmenden Marken",
                "Member Rate",
                "Kostenloses WLAN",
                "Late Check-out nach Verfügbarkeit"
            ]
        }
    },


    # ========================================================
    # ACCOR
    # ========================================================

    "ALL - Accor Live Limitless": {

        "brands": [
            "Raffles",
            "Fairmont",
            "Sofitel",
            "Sofitel Legend",
            "MGallery",
            "Pullman",
            "Swissôtel",
            "Mövenpick",
            "Grand Mercure",
            "Novotel",
            "Mercure",
            "Adagio",
            "ibis",
            "ibis Styles",
            "ibis budget",
            "25hours",
            "Mondrian",
            "The Hoxton"
        ],

        "statuses": {

            "Classic": [
                "Member Rate",
                "Premium WLAN",
                "Reward Points sammeln"
            ],

            "Silver": [
                "Welcome Drink",
                "Priority Welcome",
                "Late Check-out nach Verfügbarkeit",
                "24 % Bonus auf Reward Points"
            ],

            "Gold": [
                "Welcome Drink",
                "Priority Welcome",
                "Garantierte Zimmerverfügbarkeit nach Bedingungen",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in oder Late Check-out",
                "48 % Bonus auf Reward Points"
            ],

            "Platinum": [
                "Welcome Drink",
                "Zimmer-Upgrade",
                "Suite Night Upgrade(s)",
                "Lounge-Zugang bei teilnehmenden Hotels",
                "Early Check-in",
                "Late Check-out",
                "76 % Bonus auf Reward Points"
            ],

            "Diamond": [
                "Alle Platinum-Vorteile",
                "Kostenloses Frühstück am Wochenende",
                "Dining & Spa Rewards",
                "Gold-Status für eine Person deiner Wahl",
                "100 % Bonus auf Reward Points"
            ]
        }
    },


    # ========================================================
    # RADISSON
    # ========================================================

    "Radisson Rewards": {

        "brands": [
            "Radisson Collection",
            "Radisson Blu",
            "Radisson",
            "Radisson RED",
            "Park Plaza",
            "Park Inn by Radisson",
            "Country Inn & Suites",
            "art'otel"
        ],

        "statuses": {

            "Club": [
                "Member Rate",
                "Bis zu 15 % Mitgliederrabatt",
                "Priority Line",
                "10 % Rabatt auf Speisen und Getränke"
            ],

            "Premium": [
                "Member Rate",
                "Bis zu 15 % Mitgliederrabatt",
                "Kostenloses Zimmer-Upgrade nach Verfügbarkeit",
                "Früher Check-in nach Verfügbarkeit",
                "Später Check-out nach Verfügbarkeit",
                "10 % Rabatt auf Speisen und Getränke"
            ],

            "VIP": [
                "Kostenloses Zimmer-Upgrade nach Verfügbarkeit",
                "Upgrade bis zur besten verfügbaren Kategorie nach Bedingungen",
                "Früher Check-in",
                "Später Check-out",
                "Kostenloses Frühstück für zwei Personen",
                "VIP-Zugang bei ausgewählten Hotels",
                "15 % Rabatt auf Speisen und Getränke",
                "24h VIP Contact Center"
            ]
        }
    },


    # ========================================================
    # MELIÁ
    # ========================================================

    "MeliáRewards": {

        "brands": [
            "Gran Meliá",
            "ME by Meliá",
            "Paradisus",
            "Meliá",
            "INNSiDE",
            "Zel",
            "TRYP",
            "Sol by Meliá"
        ],

        "statuses": {

            "White": [
                "Member Rate",
                "Punkte sammeln",
                "MeliáRewards Vorteile"
            ],

            "Silver": [
                "Member Rate",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Später Check-out nach Verfügbarkeit",
                "Weitere Silver-Vorteile je nach Marke"
            ],

            "Gold": [
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Weitere Gold-Vorteile je nach Marke",
                "20 % persönliche Promotion berücksichtigt"
            ],

            "Platinum": [
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Weitere Platinum-Vorteile je nach Marke",
                "20 % persönliche Promotion berücksichtigt"
            ]
        }
    },


    # ========================================================
    # GHA DISCOVERY
    # ========================================================

    "GHA DISCOVERY": {

        "brands": [
            "Anantara",
            "Anantara Hotels",
            "Capella",
            "Kempinski",
            "NH Collection",
            "NH Hotels",
            "Tivoli",
            "Avani",
            "Viceroy",
            "The Doyle Collection",
            "Pan Pacific",
            "Park Hyatt",
            "Marriott? "
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
                "Member Rate",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Late Check-out bis 15:00 Uhr nach Verfügbarkeit",
                "Welcome Amenity",
                "Local Offers",
                "Experiences",
                "Kostenloses WLAN"
            ],

            "Titanium": [
                "7 % D$ auf anrechenbare Ausgaben",
                "Member Rate",
                "Double Room Upgrade nach Verfügbarkeit",
                "Early Check-in ab 11:00 Uhr nach Verfügbarkeit",
                "Late Check-out bis 16:00 Uhr nach Verfügbarkeit",
                "Welcome Amenity",
                "Kostenloses Frühstück bei teilnehmenden Marken",
                "Status Sharing",
                "Kostenloses WLAN"
            ]
        }
    },


    # ========================================================
    # WYNDHAM
    # ========================================================

    "Wyndham Rewards": {

        "brands": [
            "Wyndham Grand",
            "Wyndham",
            "TRYP",
            "Esplendor",
            "Dazzler",
            "Ramada",
            "Ramada Encore",
            "Days Inn",
            "Super 8",
            "Baymont",
            "Howard Johnson",
            "La Quinta",
            "Microtel",
            "Registry Collection"
        ],

        "statuses": {

            "Blue": [
                "Member Rate",
                "Punkte sammeln"
            ],

            "Gold": [
                "Member Rate",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Preferred Room nach Verfügbarkeit",
                "10 % Bonuspunkte"
            ],

            "Platinum": [
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Preferred Room nach Verfügbarkeit",
                "15 % Bonuspunkte"
            ],

            "Diamond": [
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Preferred Room nach Verfügbarkeit",
                "Suite Upgrade nach Verfügbarkeit",
                "20 % Bonuspunkte"
            ]
        }
    },


    # ========================================================
    # WORLDHOTELS
    # ========================================================

    "WorldHotels Rewards": {

        "brands": [
            "WorldHotels Luxury",
            "WorldHotels Elite",
            "WorldHotels Crafted",
            "WorldHotels Distinctive",
            "WorldHotels Collection"
        ],

        "statuses": {

            "Classic": [
                "Member Rate",
                "Punkte sammeln",
                "Kostenloses WLAN"
            ],

            "Gold": [
                "Member Rate",
                "Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit"
            ],

            "Platinum": [
                "Member Rate",
                "Punktebonus",
                "Zimmer-Upgrade nach Verfügbarkeit",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit"
            ]
        }
    },


    # ========================================================
    # BEST WESTERN
    # ========================================================

    "Best Western Rewards": {

        "brands": [
            "Best Western",
            "Best Western Plus",
            "Best Western Premier",
            "BW Premier Collection",
            "Executive Residency",
            "SureStay",
            "SureStay Plus",
            "SureStay Collection"
        ],

        "statuses": {

            "Blue": [
                "10 Punkte pro US-Dollar",
                "Punkte verfallen nicht",
                "Member Rate"
            ],

            "Gold": [
                "10 % Bonuspunkte",
                "Kostenlose Flasche Wasser und Punkte bei Ankunft",
                "Member Rate",
                "Punkte verfallen nicht"
            ],

            "Platinum": [
                "15 % Bonuspunkte",
                "Kostenlose Flasche Wasser und Punkte bei Ankunft",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Member Rate"
            ],

            "Diamond": [
                "30 % Bonuspunkte",
                "Kostenlose Flasche Wasser und Punkte bei Ankunft",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Member Rate"
            ],

            "Diamond Select": [
                "50 % Bonuspunkte",
                "Kostenlose Flasche Wasser und Punkte bei Ankunft",
                "Early Check-in nach Verfügbarkeit",
                "Late Check-out nach Verfügbarkeit",
                "Member Rate"
            ]
        }
    }
}


# ============================================================
# TEST-HOTEL-DATENBANK
# ============================================================
#
# NUR TESTDATEN!
#
# Später wird diese Funktion durch eine echte Hotel-Suche
# ersetzt.
# ============================================================

HOTELS = [

    # ---------------- BERLIN ----------------

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

    # ---------------- LONDON ----------------

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

    # ---------------- NEW YORK ----------------

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

    # ---------------- PARIS ----------------

    ("Hilton Paris Opera", "Hilton", "Hilton Honors", "Paris", 320),
    ("Hôtel du Louvre", "Hyatt", "GHA DISCOVERY", "Paris", 280),
    ("Paris Marriott Opera Ambassador", "Marriott Hotels", "Marriott Bonvoy", "Paris", 280),
    ("Renaissance Paris Arc de Triomphe", "Renaissance", "Marriott Bonvoy", "Paris", 300),
    ("InterContinental Paris Le Grand", "InterContinental", "IHG One Rewards", "Paris", 420),
    ("Hotel Indigo Paris", "Hotel Indigo", "IHG One Rewards", "Paris", 240),
    ("Pullman Paris Tour Eiffel", "Pullman", "ALL - Accor Live Limitless", "Paris", 330),
    ("Novotel Paris Centre Tour Eiffel", "Novotel", "ALL - Accor Live Limitless", "Paris", 190),
    ("Meliá Paris La Défense", "Meliá", "MeliáRewards", "Paris", 180),
    ("Radisson Blu Paris", "Radisson Blu", "Radisson Rewards", "Paris", 210),

    # ---------------- TOKYO ----------------

    ("Hilton Tokyo", "Hilton", "Hilton Honors", "Tokyo", 300),
    ("Conrad Tokyo", "Conrad", "Hilton Honors", "Tokyo", 420),
    ("The Ritz-Carlton Tokyo", "The Ritz-Carlton", "Marriott Bonvoy", "Tokyo", 600),
    ("JW Marriott Hotel Tokyo", "JW Marriott", "Marriott Bonvoy", "Tokyo", 500),
    ("InterContinental Tokyo Bay", "InterContinental", "IHG One Rewards", "Tokyo", 280),
    ("Hotel Indigo Tokyo Shibuya", "Hotel Indigo", "IHG One Rewards", "Tokyo", 260),
    ("Pullman Tokyo Tamachi", "Pullman", "ALL - Accor Live Limitless", "Tokyo", 250),
    ("Meliá Tokyo", "Meliá", "MeliáRewards", "Tokyo", 210),
    ("Radisson Tokyo", "Radisson", "Radisson Rewards", "Tokyo", 220),
    ("NH Collection Tokyo", "NH Collection", "GHA DISCOVERY", "Tokyo", 230),

    # ---------------- ISTANBUL ----------------

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


# ============================================================
# HILFSFUNKTIONEN
# ============================================================

def get_benefits(program, status):

    if program not in LOYALTY:
        return []

    statuses = LOYALTY[program]["statuses"]

    return statuses.get(
        status,
        []
    )


def get_promotion(program):

    return PERSONAL_PROMOTIONS.get(
        program,
        0
    )


def get_effective_price(price, program):

    discount = get_promotion(program)

    return price * (1 - discount / 100)


def get_brand_match(program, brand):

    if program not in LOYALTY:
        return False

    return brand in LOYALTY[program]["brands"]


# ============================================================
# HEADER
# ============================================================

st.title("🏨 Hotel Loyalty Finder")

st.write(
    "Finde Hotels nach Stadt, Hotelkette und deinem persönlichen "
    "Loyalty-Status."
)


# ============================================================
# SIDEBAR
# ============================================================

st.sidebar.header("🔎 Suche")


cities = sorted(
    list(
        set(
            hotel[3]
            for hotel in HOTELS
        )
    )
)


selected_city = st.sidebar.selectbox(
    "Stadt",
    cities
)


st.sidebar.divider()

st.sidebar.subheader("Hotelketten")


selected_programs = []

for program in LOYALTY:

    checked = st.sidebar.checkbox(
        program,
        value=True
    )

    if checked:
        selected_programs.append(
            program
        )


# ============================================================
# STATUS-EINSTELLUNGEN
# ============================================================

with st.sidebar.expander("💳 Meine Status"):

    st.caption(
        "Du kannst deine Statuslevel hier jederzeit ändern."
    )

    for program in LOYALTY:

        possible_statuses = list(
            LOYALTY[program]["statuses"].keys()
        )

        current_status = MY_STATUS.get(
            program,
            possible_statuses[0]
        )

        if current_status not in possible_statuses:
            current_status = possible_statuses[0]

        MY_STATUS[program] = st.selectbox(
            program,
            possible_statuses,
            index=possible_statuses.index(
                current_status
            )
        )


# ============================================================
# MÄLIÁ PROMOTION
# ============================================================

with st.sidebar.expander("🎁 Meine Promotions"):

    st.write(
        f"MeliáRewards: "
        f"**{PERSONAL_PROMOTIONS['MeliáRewards']} % Rabatt**"
    )

    st.caption(
        "Dieser Rabatt wird bei Meliá-Hotels "
        "automatisch in der Preisberechnung berücksichtigt."
    )


# ============================================================
# HOTEL FILTER
# ============================================================

filtered_hotels = [

    hotel
    for hotel in HOTELS

    if hotel[3] == selected_city

    and hotel[2] in selected_programs

]


# ============================================================
# ERGEBNIS
# ============================================================

st.subheader(
    f"Hotels in {selected_city}"
)

st.caption(
    f"{len(filtered_hotels)} Hotels gefunden"
)


if not filtered_hotels:

    st.warning(
        "Keine Hotels für deine Auswahl gefunden."
    )


# ============================================================
# HOTELKARTEN
# ============================================================

for hotel in filtered_hotels:

    name = hotel[0]
    brand = hotel[1]
    program = hotel[2]
    city = hotel[3]
    price = hotel[4]

    status = MY_STATUS.get(
        program,
        "Member"
    )

    benefits = get_benefits(
        program,
        status
    )

    effective_price = get_effective_price(
        price,
        program
    )

    promotion = get_promotion(
        program
    )


    with st.container(border=True):

        col1, col2, col3 = st.columns(
            [4, 3, 2]
        )


        # ----------------------------------------------------
        # HOTEL
        # ----------------------------------------------------

        with col1:

            st.markdown(
                f"### 🏨 {name}"
            )

            st.write(
                f"**{brand}**"
            )

            st.caption(
                f"{city} · {program}"
            )


        # ----------------------------------------------------
        # STATUS
        # ----------------------------------------------------

        with col2:

            st.markdown(
                f"**Dein Status**"
            )

            st.success(
                status
            )

            if promotion > 0:

                st.info(
                    f"🎁 {promotion} % Promotion"
                )


        # ----------------------------------------------------
        # PREIS
        # ----------------------------------------------------

        with col3:

            st.metric(
                "Testpreis",
                f"{price:.0f} €"
            )

            if promotion > 0:

                st.metric(
                    "Preis nach Promotion",
                    f"{effective_price:.0f} €",
                    f"-{promotion} %"
                )


        st.divider()


        # ----------------------------------------------------
        # VORTEILE
        # ----------------------------------------------------

        st.markdown(
            f"**🎁 Deine Vorteile als {status}**"
        )


        if benefits:

            benefit_columns = st.columns(
                2
            )

            for index, benefit in enumerate(
                benefits
            ):

                with benefit_columns[
                    index % 2
                ]:

                    st.write(
                        f"✓ {benefit}"
                    )

        else:

            st.write(
                "Keine Vorteile hinterlegt."
            )


# ============================================================
# STATUSÜBERSICHT
# ============================================================

st.divider()

st.subheader(
    "💳 Deine Loyalty-Welt"
)


status_columns = st.columns(
    2
)


for index, program in enumerate(
    LOYALTY
):

    with status_columns[
        index % 2
    ]:

        status = MY_STATUS.get(
            program,
            "-"
        )

        st.markdown(
            f"**{program}**"
        )

        st.write(
            f"Status: **{status}**"
        )

        if program in PERSONAL_PROMOTIONS:

            st.write(
                f"🎁 Persönliche Promotion: "
                f"**{PERSONAL_PROMOTIONS[program]} %**"
            )


# ============================================================
# MARKEN
# ============================================================

with st.expander(
    "🏷️ Alle hinterlegten Marken"
):

    for program, data in LOYALTY.items():

        st.markdown(
            f"**{program}**"
        )

        st.write(
            ", ".join(
                data["brands"]
            )
        )


# ============================================================
# TECHNISCHE INFO
# ============================================================

with st.expander(
    "⚙️ Datenquelle"
):

    st.info(
        "Aktuell verwendet diese Version Testdaten. "
        "Im nächsten Schritt wird die Test-Hoteldatenbank "
        "durch eine echte Hotelsuche ersetzt."
    )
