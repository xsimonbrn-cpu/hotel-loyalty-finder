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

# ------------------------------------------------------------
# CSS - more app-like / mobile-friendly
# ------------------------------------------------------------

st.markdown("""
<style>
.block-container {
    max-width: 1250px;
    padding-top: 2rem;
}
.hotel-card {
    padding: 1.1rem 1.2rem;
    border: 1px solid rgba(128,128,128,.25);
    border-radius: 16px;
    margin-bottom: 1rem;
}
.badge {
    display: inline-block;
    padding: 0.3rem 0.65rem;
    border-radius: 999px;
    background: #eef6ff;
    margin-right: .35rem;
    margin-bottom: .35rem;
    font-size: .9rem;
}
.small {
    color: #777;
    font-size: .9rem;
}
.big-score {
    font-size: 1.8rem;
    font-weight: 700;
}
</style>
""", unsafe_allow_html=True)

# ------------------------------------------------------------
# HEADER
# ------------------------------------------------------------

st.title("🏨 Hotel Loyalty Finder")
st.caption("Deine Hotelketten • dein Status • deine echten Vorteile • später mit Live-Hotels")

# ------------------------------------------------------------
# SIDEBAR
# ------------------------------------------------------------

st.sidebar.header("🔎 Suche")

cities = sorted(set(h[3] for h in HOTELS))
selected_city = st.sidebar.selectbox("Stadt", cities)

st.sidebar.divider()
st.sidebar.subheader("Hotelketten")

selected_programs = []
for program in PROGRAMS:
    if st.sidebar.checkbox(program, value=True):
        selected_programs.append(program)

with st.sidebar.expander("💳 Meine Status", expanded=False):
    st.caption("Hier kannst du deine aktuellen Statuslevel ändern.")
    for program, data in PROGRAMS.items():
        statuses = list(data["statuses"].keys())
        current = DEFAULT_STATUS.get(program, statuses[0])
        if current not in statuses:
            current = statuses[0]
        st.session_state[f"status_{program}"] = st.selectbox(
            program,
            statuses,
            index=statuses.index(current),
            key=f"select_{program}"
        )

with st.sidebar.expander("🎁 Meine Promotions", expanded=False):
    st.write(f"MeliáRewards: **{PERSONAL_PROMOTIONS['MeliáRewards']} % Rabatt**")
    st.caption("Persönliche Promotion – wird automatisch in die Preisberechnung einbezogen.")

# ------------------------------------------------------------
# FILTER OPTIONS
# ------------------------------------------------------------

st.sidebar.divider()
sort_by = st.sidebar.selectbox(
    "Sortieren nach",
    ["Persönlicher Statuswert", "Preis", "Hotelname"]
)

# ------------------------------------------------------------
# FILTER HOTELS
# ------------------------------------------------------------

results = []
for hotel in HOTELS:
    name, brand, program, city, price = hotel

    if city != selected_city or program not in selected_programs:
        continue

    status = st.session_state.get(
        f"status_{program}",
        DEFAULT_STATUS.get(program, "Member")
    )
    benefits = get_benefits(program, status)
    promo = promotion(program)
    final_price = effective_price(price, program)
    score = score_hotel(program, benefits, promo)

    results.append({
        "name": name,
        "brand": brand,
        "program": program,
        "price": price,
        "final_price": final_price,
        "promo": promo,
        "status": status,
        "benefits": benefits,
        "score": score,
    })

if sort_by == "Persönlicher Statuswert":
    results.sort(key=lambda x: (-x["score"], x["final_price"]))
elif sort_by == "Preis":
    results.sort(key=lambda x: x["final_price"])
else:
    results.sort(key=lambda x: x["name"])

# ------------------------------------------------------------
# SUMMARY
# ------------------------------------------------------------

st.subheader(f"Hotels in {selected_city}")

c1, c2, c3 = st.columns(3)
with c1:
    st.metric("Hotels", len(results))
with c2:
    if results:
        st.metric("Bestes Match", f"{results[0]['score']}/100")
    else:
        st.metric("Bestes Match", "–")
with c3:
    promo_count = sum(1 for r in results if r["promo"] > 0)
    st.metric("Mit persönlicher Promotion", promo_count)

# ------------------------------------------------------------
# BEST MATCH
# ------------------------------------------------------------

if results:
    best = results[0]
    st.success(
        f"🏆 Bestes persönliches Match: **{best['name']}** — "
        f"{best['program']} {best['status']} — {best['score']}/100"
    )

# ------------------------------------------------------------
# HOTEL CARDS
# ------------------------------------------------------------

for r in results:
    st.markdown('<div class="hotel-card">', unsafe_allow_html=True)

    top1, top2, top3 = st.columns([4, 2, 1])

    with top1:
        st.markdown(f"### 🏨 {r['name']}")
        st.write(f"**{r['brand']}** · {r['program']}")
        st.markdown(
            f'<span class="badge">Status: {r["status"]}</span>'
            f'<span class="badge">Persönlicher Wert: {r["score"]}/100</span>',
            unsafe_allow_html=True
        )

    with top2:
        st.write("**Dein Statuswert**")
        if r["promo"]:
            st.success(f"🎁 {r['promo']} % persönliche Promotion")
        else:
            st.info("Keine persönliche Promotion")

    with top3:
        st.metric("Preis", f"{r['price']:.0f} €")
        if r["promo"]:
            st.metric("Effektiv", f"{r['final_price']:.0f} €")

    with st.expander("🎁 Alle meine Vorteile"):
        for benefit in r["benefits"]:
            st.write(f"✓ {benefit}")

    st.markdown("</div>", unsafe_allow_html=True)

# ------------------------------------------------------------
# MY LOYALTY OVERVIEW
# ------------------------------------------------------------

st.divider()
st.subheader("💳 Meine Loyalty-Programme")

for program, data in PROGRAMS.items():
    status = st.session_state.get(
        f"status_{program}",
        DEFAULT_STATUS.get(program, "Member")
    )
    promo = promotion(program)
    st.write(f"{data['color']} **{program}** — {status}" + (f" · 🎁 {promo}% Promotion" if promo else ""))

# ------------------------------------------------------------
# DATA SOURCE NOTE
# ------------------------------------------------------------

with st.expander("⚙️ Aktueller Stand / nächste Ausbaustufe"):
    st.write(
        "Die App läuft bereits online, verwendet aber noch Test-Hotels. "
        "Die nächste Ausbaustufe ersetzt diese Testdaten durch eine echte "
        "Hotelsuche und ordnet die gefundenen Hotels automatisch Marke und "
        "Loyalty-Programm zu."
    )
