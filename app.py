import streamlit as st
import pandas as pd

# ============================================================
# HOTEL LOYALTY FINDER
# ============================================================

st.set_page_config(
    page_title="Hotel Loyalty Finder",
    page_icon="🏨",
    layout="wide"
)

# ============================================================
# DEINE LOYALTY-PROGRAMME UND STATUS
# ============================================================

LOYALTY_PROGRAMS = {
    "Marriott Bonvoy": {
        "status": "Platinum Elite",
        "benefits": [
            "Zimmer-Upgrade nach Verfügbarkeit",
            "Late Check-out bis 16:00 Uhr nach Verfügbarkeit",
            "Willkommensgeschenk",
            "50 % Punktebonus",
            "Lounge-Zugang bei teilnehmenden Marken",
            "Frühstück bei ausgewählten Marken",
            "5 Suite Night Awards pro Jahr"
        ],
        "brands": [
            "JW Marriott",
            "The Ritz-Carlton",
            "St. Regis",
            "W Hotels",
            "Westin",
            "Sheraton",
            "Le Méridien",
            "Renaissance",
            "Marriott Hotels",
            "Courtyard",
            "Four Points",
            "Aloft",
            "Moxy",
            "Element",
            "AC Hotels"
        ]
    },

    "Hilton Honors": {
        "status": "Gold",
        "benefits": [
            "Kostenloses Frühstück bzw. Food & Beverage Credit",
            "Zimmer-Upgrade nach Verfügbarkeit",
            "5. Nacht bei Prämienaufenthalten kostenlos",
            "80 % Punktebonus",
            "Late Check-out nach Verfügbarkeit",
            "Kostenloses Wasser bei ausgewählten Marken"
        ],
        "brands": [
            "Waldorf Astoria",
            "Conrad",
            "LXR",
            "Canopy",
            "Hilton",
            "Curio Collection",
            "DoubleTree",
            "Embassy Suites",
            "Hilton Garden Inn",
            "Hampton",
            "Homewood Suites",
            "Home2 Suites",
            "Tru",
            "Tapestry Collection"
        ]
    },

    "IHG One Rewards": {
        "status": "Club Member",
        "benefits": [
            "Punkte sammeln",
            "Member Rate",
            "Kostenloses Internet",
            "Late Check-out abhängig vom Hotel",
            "Zimmer-Upgrade normalerweise nicht garantiert",
            "Frühstück normalerweise nicht enthalten"
        ],
        "brands": [
            "InterContinental",
            "Regent",
            "Six Senses",
            "Kimpton",
            "Vignette Collection",
            "Hotel Indigo",
            "Crowne Plaza",
            "Holiday Inn",
            "Holiday Inn Express",
            "Staybridge Suites",
            "Candlewood Suites"
        ]
    },

    "ALL - Accor Live Limitless": {
        "status": "Silver",
        "benefits": [
            "Kostenloses Internet",
            "Late Check-out nach Verfügbarkeit",
            "Zimmer-Upgrade nach Verfügbarkeit",
            "Welcome Drink",
            "10 % Bonus auf Reward Points",
            "Silver Member Vorteile bei teilnehmenden Marken"
        ],
        "brands": [
            "Raffles",
            "Fairmont",
            "Sofitel",
            "MGallery",
            "Pullman",
            "Swissôtel",
            "Mövenpick",
            "Novotel",
            "Mercure",
            "Adagio",
            "ibis",
            "ibis Styles",
            "ibis budget"
        ]
    }
}


# ============================================================
# HOTEL-DATENBANK
# ============================================================

HOTELS = [

    # ==================== BERLIN ====================

    {
        "name": "Berlin Marriott Hotel",
        "brand": "Marriott Hotels",
        "chain": "Marriott Bonvoy",
        "city": "Berlin",
        "address": "Inge-Beisheim-Platz 1",
        "price": 180
    },

    {
        "name": "JW Marriott Hotel Berlin",
        "brand": "JW Marriott",
        "chain": "Marriott Bonvoy",
        "city": "Berlin",
        "address": "Stauffenbergstraße 26",
        "price": 240
    },

    {
        "name": "Hilton Berlin",
        "brand": "Hilton",
        "chain": "Hilton Honors",
        "city": "Berlin",
        "address": "Mohrenstraße 30",
        "price": 170
    },

    {
        "name": "DoubleTree by Hilton Berlin Ku'damm",
        "brand": "DoubleTree",
        "chain": "Hilton Honors",
        "city": "Berlin",
        "address": "Los-Angeles-Platz 1",
        "price": 150
    },

    {
        "name": "InterContinental Berlin",
        "brand": "InterContinental",
        "chain": "IHG One Rewards",
        "city": "Berlin",
        "address": "Budapester Straße 2",
        "price": 160
    },

    {
        "name": "Pullman Berlin Schweizerhof",
        "brand": "Pullman",
        "chain": "ALL - Accor Live Limitless",
        "city": "Berlin",
        "address": "Budapester Straße 25",
        "price": 145
    },

    {
        "name": "Novotel Berlin Mitte",
        "brand": "Novotel",
        "chain": "ALL - Accor Live Limitless",
        "city": "Berlin",
        "address": "Fischerinsel 12",
        "price": 120
    },


    # ==================== NEW YORK ====================

    {
        "name": "New York Marriott Marquis",
        "brand": "Marriott Hotels",
        "chain": "Marriott Bonvoy",
        "city": "New York",
        "address": "1535 Broadway",
        "price": 320
    },

    {
        "name": "JW Marriott Essex House",
        "brand": "JW Marriott",
        "chain": "Marriott Bonvoy",
        "city": "New York",
        "address": "160 Central Park South",
        "price": 450
    },

    {
        "name": "Hilton Midtown",
        "brand": "Hilton",
        "chain": "Hilton Honors",
        "city": "New York",
        "address": "1335 6th Avenue",
        "price": 280
    },

    {
        "name": "Conrad New York Downtown",
        "brand": "Conrad",
        "chain": "Hilton Honors",
        "city": "New York",
        "address": "102 North End Avenue",
        "price": 330
    },

    {
        "name": "InterContinental New York Barclay",
        "brand": "InterContinental",
        "chain": "IHG One Rewards",
        "city": "New York",
        "address": "111 East 48th Street",
        "price": 270
    },

    {
        "name": "Kimpton Hotel Eventi",
        "brand": "Kimpton",
        "chain": "IHG One Rewards",
        "city": "New York",
        "address": "851 Avenue of the Americas",
        "price": 250
    },

    {
        "name": "Novotel New York Times Square",
        "brand": "Novotel",
        "chain": "ALL - Accor Live Limitless",
        "city": "New York",
        "address": "226 West 52nd Street",
        "price": 230
    },


    # ==================== TOKYO ====================

    {
        "name": "The Ritz-Carlton Tokyo",
        "brand": "The Ritz-Carlton",
        "chain": "Marriott Bonvoy",
        "city": "Tokyo",
        "address": "9-7-1 Akasaka",
        "price": 600
    },

    {
        "name": "The Prince Gallery Tokyo Kioicho",
        "brand": "Marriott Bonvoy",
        "chain": "Marriott Bonvoy",
        "city": "Tokyo",
        "address": "1-2 Kioicho",
        "price": 500
    },

    {
        "name": "Conrad Tokyo",
        "brand": "Conrad",
        "chain": "Hilton Honors",
        "city": "Tokyo",
        "address": "1-9-1 Higashi-Shimbashi",
        "price": 420
    },

    {
        "name": "Hilton Tokyo",
        "brand": "Hilton",
        "chain": "Hilton Honors",
        "city": "Tokyo",
        "address": "6-6-2 Nishi-Shinjuku",
        "price": 300
    },

    {
        "name": "InterContinental Tokyo Bay",
        "brand": "InterContinental",
        "chain": "IHG One Rewards",
        "city": "Tokyo",
        "address": "1-16-2 Kaigan",
        "price": 280
    },

    {
        "name": "Hotel Indigo Tokyo Shibuya",
        "brand": "Hotel Indigo",
        "chain": "IHG One Rewards",
        "city": "Tokyo",
        "address": "2-25-12 Dogenzaka",
        "price": 260
    },

    {
        "name": "Pullman Tokyo Tamachi",
        "brand": "Pullman",
        "chain": "ALL - Accor Live Limitless",
        "city": "Tokyo",
        "address": "3-1-21 Shibaura",
        "price": 250
    },

    {
        "name": "Novotel Tokyo",
        "brand": "Novotel",
        "chain": "ALL - Accor Live Limitless",
        "city": "Tokyo",
        "address": "Tokyo Bay",
        "price": 190
    }
]


# ============================================================
# SPÄTERE LIVE-API
# ============================================================
#
# HIER kann später eine echte Hotel-API angeschlossen werden.
#
# Beispiele:
# - Amadeus
# - Google Places
# - Expedia
# - Hotelbeds
#
# Die API sollte Hotelname, Marke, Kette, Stadt und Preis liefern.
# ============================================================

def get_hotels_from_live_api(city):

    # Hier später echte API einbauen.
    # Aktuell verwenden wir die Testdaten.

    return [
        hotel
        for hotel in HOTELS
        if hotel["city"] == city
    ]


# ============================================================
# LOYALTY-INFORMATIONEN
# ============================================================

def get_loyalty_info(chain):

    if chain in LOYALTY_PROGRAMS:

        program = LOYALTY_PROGRAMS[chain]

        return {
            "status": program["status"],
            "benefits": program["benefits"]
        }

    return {
        "status": "Kein Status",
        "benefits": []
    }


# ============================================================
# HEADER
# ============================================================

st.title("🏨 Hotel Loyalty Finder")

st.write(
    "Finde Hotels nach Stadt und Hotelkette "
    "und sehe sofort deine persönlichen Statusvorteile."
)


# ============================================================
# SIDEBAR
# ============================================================

st.sidebar.header("🔎 Suche")

selected_city = st.sidebar.selectbox(
    "Stadt auswählen",
    ["Berlin", "New York", "Tokyo"]
)

st.sidebar.subheader("Hotelketten")

selected_chains = []

for chain in LOYALTY_PROGRAMS:

    checked = st.sidebar.checkbox(
        chain,
        value=True
    )

    if checked:
        selected_chains.append(chain)


# ============================================================
# HOTELS LADEN
# ============================================================

hotels = get_hotels_from_live_api(selected_city)


# ============================================================
# FILTER
# ============================================================

filtered_hotels = [
    hotel
    for hotel in hotels
    if hotel["chain"] in selected_chains
]


# ============================================================
# ERGEBNISSE
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

else:

    for hotel in filtered_hotels:

        loyalty = get_loyalty_info(
            hotel["chain"]
        )

        with st.container(border=True):

            col1, col2, col3 = st.columns(
                [3, 2, 1]
            )

            with col1:

                st.markdown(
                    f"### 🏨 {hotel['name']}"
                )

                st.write(
                    f"**{hotel['brand']}**"
                )

                st.caption(
                    hotel["address"]
                )

            with col2:

                st.write(
                    f"**Kette:** {hotel['chain']}"
                )

                st.success(
                    f"Dein Status: {loyalty['status']}"
                )

            with col3:

                st.metric(
                    "Beispielpreis",
                    f"{hotel['price']} €"
                )

            st.markdown(
                f"**🎁 Deine Vorteile als "
                f"{loyalty['status']}**"
            )

            if loyalty["benefits"]:

                for benefit in loyalty["benefits"]:

                    st.write(
                        f"✓ {benefit}"
                    )

            else:

                st.write(
                    "Keine Vorteile hinterlegt."
                )


# ============================================================
# DEINE STATUSÜBERSICHT
# ============================================================

st.divider()

st.subheader("💳 Deine aktuellen Status")

status_data = []

for program, data in LOYALTY_PROGRAMS.items():

    status_data.append({
        "Programm": program,
        "Dein Status": data["status"],
        "Marken": len(data["brands"])
    })


status_df = pd.DataFrame(status_data)

st.dataframe(
    status_df,
    use_container_width=True,
    hide_index=True
)


# ============================================================
# MARKENÜBERSICHT
# ============================================================

with st.expander("🏷️ Alle hinterlegten Marken"):

    for program, data in LOYALTY_PROGRAMS.items():

        st.markdown(
            f"**{program} — {data['status']}**"
        )

        st.write(
            ", ".join(data["brands"])
        )
