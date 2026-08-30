const API_URL = new URL("/api/hotels", window.location.origin).toString();

const LOYALTY_PROGRAMS = {
  "Hilton Honors": ["Member", "Silver", "Gold", "Diamond", "Diamond Reserve"],
  "Marriott Bonvoy": ["Member", "Silver Elite", "Gold Elite", "Platinum Elite", "Titanium Elite"],
  "IHG One Rewards": ["Club Member", "Silver Elite", "Gold Elite", "Platinum Elite", "Diamond Elite"],
  "ALL - Accor Live Limitless": ["Classic", "Silver", "Gold", "Platinum", "Diamond"],
  "Radisson Rewards": ["Club", "Premium", "VIP"],
  "MeliáRewards": ["White", "Silver", "Gold", "Platinum"],
  "GHA DISCOVERY": ["Silver", "Gold", "Platinum", "Titanium"],
  "Wyndham Rewards": ["Blue", "Gold", "Platinum", "Diamond"],
  "WorldHotels Rewards": ["Red", "Gold", "Platinum", "Diamond", "Diamond Select"],
  "Best Western Rewards": ["Blue", "Gold", "Platinum", "Diamond", "Diamond Select"]
};

const PERSONAL_STATUS = {
  "Hilton Honors": "Gold",
  "Marriott Bonvoy": "Platinum Elite",
  "IHG One Rewards": "Club Member",
  "ALL - Accor Live Limitless": "Silver",
  "Radisson Rewards": "Premium",
  "MeliáRewards": "Gold",
  "GHA DISCOVERY": "Gold",
  "Wyndham Rewards": "Gold",
  "WorldHotels Rewards": "Gold",
  "Best Western Rewards": "Gold"
};

const PERSONAL_POINTS = Object.fromEntries(
  Object.keys(LOYALTY_PROGRAMS).map((p) => [p, 0])
);

let amexOffers = [
  { name: "WorldHotels", spend: 250, credit: 50 }
];

const STATUS_BENEFITS = {
  "Hilton Honors": {
    "Member": ["Member Rate", "Free Wi-Fi", "Points earning"],
    "Silver": ["20% bonus points", "5th night free on reward stays"],
    "Gold": ["80% bonus points", "Room upgrade subject to availability", "Breakfast outside the US / F&B credit in the US", "5th night free on reward stays"],
    "Diamond": ["100% bonus points", "Room upgrade subject to availability", "Breakfast / F&B credit", "Executive Lounge at participating hotels"],
    "Diamond Reserve": ["All Diamond benefits", "Additional Diamond Reserve benefits"]
  },
  "Marriott Bonvoy": {
    "Member": ["Member Rate", "Free Wi-Fi", "Points earning"],
    "Silver Elite": ["10% bonus points", "Late check-out subject to availability"],
    "Gold Elite": ["25% bonus points", "Room upgrade subject to availability", "Late check-out subject to availability"],
    "Platinum Elite": ["50% bonus points", "Room upgrade, including selected suites, subject to availability", "4pm late check-out subject to availability", "Welcome gift", "Lounge access at participating brands"],
    "Titanium Elite": ["75% bonus points", "Room upgrade, including selected suites, subject to availability", "4pm late check-out subject to availability", "Welcome gift", "Lounge access at participating brands"]
  },
  "IHG One Rewards": {
    "Club Member": ["Member Rate", "Free Wi-Fi", "Points earning"],
    "Silver Elite": ["20% bonus points", "Member Rate", "Free Wi-Fi"],
    "Gold Elite": ["40% bonus points", "Member Rate", "Free Wi-Fi"],
    "Platinum Elite": ["60% bonus points", "Room upgrade subject to availability", "Member Rate", "Free Wi-Fi", "Late check-out subject to availability"],
    "Diamond Elite": ["100% bonus points", "Room upgrade subject to availability", "Breakfast at participating brands", "Member Rate", "Free Wi-Fi", "Late check-out subject to availability"]
  },
  "ALL - Accor Live Limitless": {
    "Classic": ["Member Rate", "Free Wi-Fi", "Reward points"],
    "Silver": ["Welcome drink", "Priority Welcome", "Late check-out subject to availability", "24% Reward Points bonus"],
    "Gold": ["Welcome drink", "Priority Welcome", "Room upgrade subject to availability", "Early check-in or late check-out", "48% Reward Points bonus"],
    "Platinum": ["Welcome drink", "Room upgrade subject to availability", "Suite Night Upgrade(s)", "Lounge access at participating hotels", "Early check-in and late check-out", "76% Reward Points bonus"],
    "Diamond": ["All Platinum benefits", "Free weekend breakfast", "Dining & Spa Rewards", "Gold status for one person", "100% Reward Points bonus"]
  },
  "Radisson Rewards": {
    "Club": ["Member Rate", "Member discount", "Priority Line"],
    "Premium": ["Room upgrade subject to availability", "Early check-in subject to availability", "Late check-out subject to availability", "Food & beverage discount"],
    "VIP": ["Room upgrade subject to availability", "Early check-in subject to availability", "Late check-out subject to availability", "Complimentary breakfast for two at participating hotels", "VIP benefits"]
  },
  "MeliáRewards": {
    "White": ["Member Rate", "Points earning"],
    "Silver": ["Room upgrade subject to availability", "Late check-out subject to availability"],
    "Gold": ["Room upgrade subject to availability", "Early check-in subject to availability", "Late check-out subject to availability", "20% personal promotion"],
    "Platinum": ["Room upgrade subject to availability", "Early check-in subject to availability", "Late check-out subject to availability", "Additional Platinum benefits", "20% personal promotion"]
  },
  "GHA DISCOVERY": {
    "Silver": ["4% D$ on eligible spend", "Member Rate", "Local Offers", "Experiences"],
    "Gold": ["5% D$ on eligible spend", "Member Rate", "Local Offers", "Experiences"],
    "Platinum": ["6% D$ on eligible spend", "3pm late check-out subject to availability", "Room upgrade subject to availability", "Welcome amenity"],
    "Titanium": ["7% D$ on eligible spend", "Early check-in from 11am subject to availability", "Late check-out until 4pm subject to availability", "Room upgrade subject to availability", "Welcome amenity"]
  },
  "Wyndham Rewards": {
    "Blue": ["Member Rate", "Points earning"],
    "Gold": ["Early check-in subject to availability", "Late check-out subject to availability", "Preferred room subject to availability", "10% points bonus"],
    "Platinum": ["Early check-in subject to availability", "Late check-out subject to availability", "Preferred room subject to availability", "15% points bonus"],
    "Diamond": ["Early check-in subject to availability", "Late check-out subject to availability", "Preferred room subject to availability", "Suite upgrade subject to availability", "20% points bonus"]
  },
  "WorldHotels Rewards": {
    "Red": ["Member Rate", "Points earning"],
    "Gold": ["Points bonus", "Early check-in / late check-out subject to availability", "Upgrade subject to availability", "Welcome amenity"],
    "Platinum": ["Points bonus", "Early check-in / late check-out subject to availability", "Upgrade subject to availability", "Welcome amenity"],
    "Diamond": ["Points bonus", "Upgrade subject to availability", "Welcome amenity", "Lounge access at participating hotels"],
    "Diamond Select": ["Points bonus", "Upgrade subject to availability", "Welcome amenity", "Lounge access", "Breakfast at participating hotels"]
  },
  "Best Western Rewards": {
    "Blue": ["Member Rate", "Points earning"],
    "Gold": ["10% bonus points", "Welcome amenity", "Member Rate"],
    "Platinum": ["15% bonus points", "Welcome amenity", "Early check-in / late check-out subject to availability", "Member Rate"],
    "Diamond": ["30% bonus points", "Welcome amenity", "Early check-in / late check-out subject to availability", "Member Rate"],
    "Diamond Select": ["50% bonus points", "Welcome amenity", "Early check-in / late check-out subject to availability", "Member Rate"]
  }
};

const PROGRAM_ALIASES = [
  ["waldorf astoria", "Hilton", "Waldorf Astoria", "Hilton Honors"],
  ["conrad", "Hilton", "Conrad", "Hilton Honors"],
  ["doubletree", "Hilton", "DoubleTree", "Hilton Honors"],
  ["hilton garden inn", "Hilton", "Hilton Garden Inn", "Hilton Honors"],
  ["hampton", "Hilton", "Hampton", "Hilton Honors"],
  ["embassy suites", "Hilton", "Embassy Suites", "Hilton Honors"],
  ["canopy", "Hilton", "Canopy", "Hilton Honors"],
  ["curio", "Hilton", "Curio", "Hilton Honors"],
  ["tapestry", "Hilton", "Tapestry", "Hilton Honors"],
  ["homewood suites", "Hilton", "Homewood Suites", "Hilton Honors"],
  ["home2 suites", "Hilton", "Home2 Suites", "Hilton Honors"],
  ["hilton", "Hilton", "Hilton", "Hilton Honors"],

  ["ritz-carlton", "Marriott", "The Ritz-Carlton", "Marriott Bonvoy"],
  ["st. regis", "Marriott", "St. Regis", "Marriott Bonvoy"],
  ["jw marriott", "Marriott", "JW Marriott", "Marriott Bonvoy"],
  ["w hotels", "Marriott", "W Hotels", "Marriott Bonvoy"],
  ["edition", "Marriott", "EDITION", "Marriott Bonvoy"],
  ["sheraton", "Marriott", "Sheraton", "Marriott Bonvoy"],
  ["westin", "Marriott", "Westin", "Marriott Bonvoy"],
  ["renaissance", "Marriott", "Renaissance", "Marriott Bonvoy"],
  ["le méridien", "Marriott", "Le Méridien", "Marriott Bonvoy"],
  ["le meridien", "Marriott", "Le Méridien", "Marriott Bonvoy"],
  ["autograph collection", "Marriott", "Autograph Collection", "Marriott Bonvoy"],
  ["tribute portfolio", "Marriott", "Tribute Portfolio", "Marriott Bonvoy"],
  ["courtyard", "Marriott", "Courtyard", "Marriott Bonvoy"],
  ["four points", "Marriott", "Four Points", "Marriott Bonvoy"],
  ["moxy", "Marriott", "Moxy", "Marriott Bonvoy"],
  ["aloft", "Marriott", "Aloft", "Marriott Bonvoy"],
  ["ac hotel", "Marriott", "AC Hotels", "Marriott Bonvoy"],
  ["marriott", "Marriott", "Marriott Hotels", "Marriott Bonvoy"],

  ["intercontinental", "IHG", "InterContinental", "IHG One Rewards"],
  ["six senses", "IHG", "Six Senses", "IHG One Rewards"],
  ["regent", "IHG", "Regent", "IHG One Rewards"],
  ["kimpton", "IHG", "Kimpton", "IHG One Rewards"],
  ["vignette collection", "IHG", "Vignette Collection", "IHG One Rewards"],
  ["hotel indigo", "IHG", "Hotel Indigo", "IHG One Rewards"],
  ["crowne plaza", "IHG", "Crowne Plaza", "IHG One Rewards"],
  ["holiday inn express", "IHG", "Holiday Inn Express", "IHG One Rewards"],
  ["holiday inn", "IHG", "Holiday Inn", "IHG One Rewards"],
  ["voco", "IHG", "voco", "IHG One Rewards"],

  ["raffles", "Accor", "Raffles", "ALL - Accor Live Limitless"],
  ["fairmont", "Accor", "Fairmont", "ALL - Accor Live Limitless"],
  ["sofitel", "Accor", "Sofitel", "ALL - Accor Live Limitless"],
  ["mgallery", "Accor", "MGallery", "ALL - Accor Live Limitless"],
  ["pullman", "Accor", "Pullman", "ALL - Accor Live Limitless"],
  ["swissôtel", "Accor", "Swissôtel", "ALL - Accor Live Limitless"],
  ["swissotel", "Accor", "Swissôtel", "ALL - Accor Live Limitless"],
  ["mövenpick", "Accor", "Mövenpick", "ALL - Accor Live Limitless"],
  ["movenpick", "Accor", "Mövenpick", "ALL - Accor Live Limitless"],
  ["grand mercure", "Accor", "Grand Mercure", "ALL - Accor Live Limitless"],
  ["novotel", "Accor", "Novotel", "ALL - Accor Live Limitless"],
  ["mercure", "Accor", "Mercure", "ALL - Accor Live Limitless"],
  ["adagio", "Accor", "Adagio", "ALL - Accor Live Limitless"],
  ["25hours", "Accor", "25hours", "ALL - Accor Live Limitless"],
  ["mondrian", "Accor", "Mondrian", "ALL - Accor Live Limitless"],
  ["the hoxton", "Accor", "The Hoxton", "ALL - Accor Live Limitless"],
  ["ibis", "Accor", "ibis", "ALL - Accor Live Limitless"],

  ["radisson collection", "Radisson", "Radisson Collection", "Radisson Rewards"],
  ["radisson blu", "Radisson", "Radisson Blu", "Radisson Rewards"],
  ["radisson red", "Radisson", "Radisson RED", "Radisson Rewards"],
  ["park plaza", "Radisson", "Park Plaza", "Radisson Rewards"],
  ["park inn", "Radisson", "Park Inn by Radisson", "Radisson Rewards"],
  ["radisson", "Radisson", "Radisson", "Radisson Rewards"],

  ["gran meliá", "Meliá", "Gran Meliá", "MeliáRewards"],
  ["gran melia", "Meliá", "Gran Meliá", "MeliáRewards"],
  ["me by meliá", "Meliá", "ME by Meliá", "MeliáRewards"],
  ["me by melia", "Meliá", "ME by Meliá", "MeliáRewards"],
  ["innside", "Meliá", "INNSiDE", "MeliáRewards"],
  ["zel", "Meliá", "Zel", "MeliáRewards"],
  ["paradisus", "Meliá", "Paradisus", "MeliáRewards"],
  ["meliá", "Meliá", "Meliá", "MeliáRewards"],
  ["melia", "Meliá", "Meliá", "MeliáRewards"],

  ["kempinski", "GHA", "Kempinski", "GHA DISCOVERY"],
  ["nh collection", "GHA", "NH Collection", "GHA DISCOVERY"],
  ["nh hotels", "GHA", "NH Hotels", "GHA DISCOVERY"],
  ["anantara", "GHA", "Anantara", "GHA DISCOVERY"],
  ["capella", "GHA", "Capella", "GHA DISCOVERY"],
  ["tivoli", "GHA", "Tivoli", "GHA DISCOVERY"],
  ["avani", "GHA", "Avani", "GHA DISCOVERY"],
  ["viceroy", "GHA", "Viceroy", "GHA DISCOVERY"],

  ["wyndham grand", "Wyndham", "Wyndham Grand", "Wyndham Rewards"],
  ["wyndham", "Wyndham", "Wyndham", "Wyndham Rewards"],
  ["ramada encore", "Wyndham", "Ramada Encore", "Wyndham Rewards"],
  ["ramada", "Wyndham", "Ramada", "Wyndham Rewards"],
  ["days inn", "Wyndham", "Days Inn", "Wyndham Rewards"],
  ["super 8", "Wyndham", "Super 8", "Wyndham Rewards"],
  ["la quinta", "Wyndham", "La Quinta", "Wyndham Rewards"],

  ["worldhotels", "WorldHotels", "WorldHotels", "WorldHotels Rewards"],
  ["best western premier", "Best Western", "Best Western Premier", "Best Western Rewards"],
  ["best western plus", "Best Western", "Best Western Plus", "Best Western Rewards"],
  ["best western", "Best Western", "Best Western", "Best Western Rewards"]
];

const AMENITY_ICON = {
  "Pool": '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M4 14c2.5-2.5 5.5-2.5 8 0s5.5 2.5 8 0"/><path d="M4 18c2.5-2.5 5.5-2.5 8 0s5.5 2.5 8 0"/></svg>',
  "Sauna": '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M7 19c0-2 2-3 2-5 0-1.5-1-2-1-3"/><path d="M12 19c0-2 2-3 2-5 0-1.5-1-2-1-3"/><path d="M17 19c0-2 2-3 2-5 0-1.5-1-2-1-3"/><path d="M4 21h16"/></svg>',
  "Spa": '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M12 21c4-3 6-6.5 6-10A6 6 0 0 0 6 11c0 3.5 2 7 6 10Z"/><path d="M12 4V2"/></svg>',
  "Fitness": '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/></svg>',
  "Breakfast": '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M5 18h14"/><path d="M7 18c0-4 2-6 5-6s5 2 5 6"/><path d="M12 12V5"/></svg>',
  "Parking": '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M7 20V4h5a4 4 0 0 1 0 8H7"/><path d="M4 20h16"/></svg>',
  "Restaurant": '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3v18M17 3c3 2 3 7 0 9"/></svg>',
  "Bar": '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M5 4h14l-5 7v7h3v2H7v-2h3v-7L5 4Z"/><path d="M8 8h8"/></svg>'
};

const state = {
  chain: "all",
  activePrograms: new Set(),
  amenities: new Set(),
  sort: "effective"
};

let liveHotels = [];
let searchPerformed = false;
let liveTotalCount = null;

const $ = (id) => document.getElementById(id);

function setDefaultDates() {
  const today = new Date();
  const checkIn = new Date(today);
  const checkOut = new Date(today);
  checkIn.setDate(today.getDate() + 7);
  checkOut.setDate(today.getDate() + 9);

  $("checkIn").value = checkIn.toISOString().slice(0, 10);
  $("checkOut").value = checkOut.toISOString().slice(0, 10);
}

function nights() {
  const a = new Date($("checkIn").value);
  const b = new Date($("checkOut").value);
  return Math.max(Math.round((b - a) / 86400000), 1);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function number(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function first(obj, keys) {
  for (const key of keys) {
    if (obj && obj[key] !== null && obj[key] !== undefined) return obj[key];
  }
  return null;
}

function extractHotels(payload) {
  const candidates = [
    payload?.hotels,
    payload?.data?.hotels,
    payload?.properties,
    payload?.data?.properties,
    payload?.results,
    payload?.data?.results,
    Array.isArray(payload?.data) ? payload.data : null
  ];
  return candidates.find(Array.isArray) || [];
}

function normalizeAmenities(hotel) {
  const raw = first(hotel, ["amenities", "facilities", "amenity"]) || [];
  if (Array.isArray(raw)) {
    return raw.map(item => {
      if (typeof item === "string") return item;
      return String(first(item, ["name", "label", "title"]) || "");
    }).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw.split(",").map(x => x.trim()).filter(Boolean);
  }
  return [];
}

function normalizeHotel(hotel) {
  const price = hotel?.price || {};
  const location = hotel?.location || {};
  const rating = hotel?.rating || {};

  const totalRaw =
    price.total_price ??
    price.total ??
    price.current ??
    null;

  const nightlyRaw =
    price.price_per_night ??
    price.nightly ??
    null;

  let total = number(totalRaw);
  let nightly = number(nightlyRaw);

  const images =
    Array.isArray(hotel?.images)
      ? hotel.images
      : [];

  let image =
    images.length
      ? (
          typeof images[0] === "string"
            ? images[0]
            : first(images[0], ["url", "src", "image_url"])
        )
      : null;

  if (!image) {
    image =
      first(
        hotel,
        [
          "image",
          "image_url",
          "photo",
          "thumbnail"
        ]
      );
  }

  return {
    raw: hotel,

    id:
      hotel?.hotel_id ??
      null,

    name:
      String(
        hotel?.name ??
        "Unnamed hotel"
      ),

    total,

    nightly,

    image,

    rating:
      number(
        rating?.value ??
        hotel?.overall_rating ??
        hotel?.rating_value ??
        hotel?.score ??
        hotel?.stars
      ),

    reviewCount:
      number(
        rating?.votes ??
        hotel?.reviews ??
        hotel?.review_count
      ),

    stars:
      number(
        hotel?.stars ??
        hotel?.hotel_class ??
        null
      ),

    amenities:
      normalizeAmenities(
        hotel
      ),

    address:
      location?.address ??
      hotel?.address ??
      null,

    latitude:
      location?.latitude ??
      location?.lat ??
      hotel?.latitude ??
      null,

    longitude:
      location?.longitude ??
      location?.lng ??
      location?.lon ??
      hotel?.longitude ??
      null,

    url:
      first(hotel, ["booking_url", "hotel_url", "url", "link"]),

    isPaid:
      Boolean(
        hotel?.is_paid
      )
  };
}

function normalizeBrandText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function classifyHotel(hotelOrName) {
  const hotel = typeof hotelOrName === "object" && hotelOrName !== null
    ? hotelOrName
    : { name: hotelOrName };

  const searchable = [
    hotel.name, hotel.hotel_name, hotel.title,
    hotel.brand, hotel.brand_name,
    hotel.chain, hotel.chain_name,
    hotel.hotel_brand, hotel.property_brand,
    hotel.description
  ].filter(Boolean).map(normalizeBrandText).join(" ");

  const rules = PROGRAM_ALIASES
    .map(([needle, chain, brand, program]) => ({ needle, chain, brand, program }))
    .sort((a, b) =>
      normalizeBrandText(b.needle).length - normalizeBrandText(a.needle).length
    );

  for (const rule of rules) {
    const needle = normalizeBrandText(rule.needle);
    if (needle && searchable.includes(needle)) {
      return { chain: rule.chain, brand: rule.brand, program: rule.program };
    }
  }

  return { chain: "Other", brand: "Other", program: null };
}

function dedupeHotels(hotels) {
  const seen = new Map();

  for (const hotel of hotels) {
    const key = normalizeBrandText(
      hotel.id ||
      hotel.name ||
      `${hotel.address || ""}|${hotel.latitude || ""}|${hotel.longitude || ""}`
    );
    if (!key) continue;

    const previous = seen.get(key);
    if (!previous || (hotel.total != null && previous.total == null)) {
      seen.set(key, hotel);
    }
  }

  return [...seen.values()];
}

function benefitsFor(program) {
  const status = PERSONAL_STATUS[program];
  return STATUS_BENEFITS[program]?.[status] || [];
}

function amexFor(hotel, program, brand) {
  const haystack = `${hotel.name} ${program || ""} ${brand || ""}`.toLowerCase();
  return amexOffers
    .filter(o => o.name && haystack.includes(String(o.name).toLowerCase()))
    .sort((a, b) => Number(b.credit || 0) - Number(a.credit || 0))[0] || null;
}

function enrich(hotel) {
  const cls = classifyHotel(hotel.raw || hotel);
  const n = nights();

  let total = hotel.total;
  let nightly = hotel.nightly;

  if (total == null && nightly != null) total = nightly * n;
  if (nightly == null && total != null) nightly = total / n;
  if (total == null) total = 0;
  if (nightly == null) nightly = 0;

  const program = cls.program;
  const status = program ? (PERSONAL_STATUS[program] || "Member") : "—";
  const benefits = benefitsFor(program);
  const promotion = program === "MeliáRewards" ? 0.20 : 0;
  const discounted = total * (1 - promotion);

  const amex = amexFor(hotel, program, cls.brand);
  const amexTriggered = !!amex && discounted >= Number(amex.spend || 0);
  const amexCredit = amexTriggered ? Number(amex.credit || 0) : 0;
  const effective = Math.max(discounted - amexCredit, 0);

  return {
    ...hotel,
    ...cls,
    status,
    benefits,
    total,
    nightly,
    promotion,
    amex,
    amexTriggered,
    amexCredit,
    effective,
    effectiveNightly: effective / n
  };
}

async function searchLive() {
  const city = $("city").value.trim();
  const checkIn = $("checkIn").value;
  const checkOut = $("checkOut").value;
  const guests = Number($("guests").value || 2);

  if (!city) {
    alert("Please enter a city.");
    return;
  }
  if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
    alert("Please choose valid check-in and check-out dates.");
    return;
  }

  const params = new URLSearchParams({
    location: city,
    check_in: checkIn,
    check_out: checkOut,
    adults: String(guests),
    currency: "EUR"
  });

  const button = $("searchButton");
  button.disabled = true;
  button.textContent = "Searching...";

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`, {
      method: "GET"
    });

    const payload = await response.json();

    if (!response.ok || payload.error) {
      throw new Error(payload.error || `Request failed (${response.status})`);
    }

    const extracted = extractHotels(payload);
    liveHotels = dedupeHotels(extracted.map(normalizeHotel));
    liveTotalCount = number(
      payload?.total_count ??
      payload?.data?.total_count ??
      extracted.length
    );
    searchPerformed = true;
    render();
  } catch (error) {
    console.error(error);
    alert(`Hotel search failed: ${error.message}`);
  } finally {
    button.disabled = false;
    button.textContent = "Search";
  }
}

function programBenefitsText(benefits) {
  return benefits
    .slice(0, 5)
    .map(b => `<span>${escapeHtml(b)}</span>`)
    .join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function amenityChip(name) {
  const known = Object.keys(AMENITY_ICON).find(
    key => name.toLowerCase().includes(key.toLowerCase())
  );
  const icon = known ? AMENITY_ICON[known] : "";
  return `
    <span class="amenity-chip">
      ${icon}
      <span>${escapeHtml(name)}</span>
    </span>
  `;
}



function render() {
  const n = nights();

  let hotels = liveHotels.map(enrich);

  if (state.chain !== "all") {
    hotels = hotels.filter(h => h.chain === state.chain);
  }

  if (state.activePrograms.size) {
    hotels = hotels.filter(h => state.activePrograms.has(h.program));
  }

  if (state.amenities.size) {
    hotels = hotels.filter(h => {
      const all = h.amenities.map(a => a.toLowerCase());
      return [...state.amenities].every(required =>
        all.some(a => a.includes(required.toLowerCase()))
      );
    });
  }

  if ($("onlyBenefits")?.checked) {
    hotels = hotels.filter(h => h.program && h.benefits.length);
  }

  if ($("onlyOffers")?.checked) {
    hotels = hotels.filter(h => h.promotion > 0 || h.amexTriggered);
  }

  if (state.sort === "effective") {
    hotels.sort((a, b) => a.effective - b.effective);
  } else if (state.sort === "rating") {
    hotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (state.sort === "benefits") {
    hotels.sort((a, b) => b.benefits.length - a.benefits.length);
  } else if (state.sort === "value") {
    hotels.sort((a, b) => {
      const valueA = (a.rating || 0) + a.benefits.length * 0.15 + (a.promotion ? 0.2 : 0);
      const valueB = (b.rating || 0) + b.benefits.length * 0.15 + (b.promotion ? 0.2 : 0);
      return valueB - valueA;
    });
  }

  $("resultTitle").textContent = `Hotels in ${$("city").value.trim() || "your city"}`;

  if (!searchPerformed) {
    $("resultMeta").textContent = "Choose your dates and search for live hotels.";
    $("results").innerHTML = "";
    $("emptyState").style.display = "block";
    return;
  }

  $("resultMeta").textContent =
    `${hotels.length} shown · ${liveTotalCount ?? liveHotels.length} found · ${formatDate($("checkIn").value)} – ${formatDate($("checkOut").value)} · ${n} nights · ${$("guests").value} guests`;

  if (!hotels.length) {
    $("results").innerHTML = "";
    $("emptyState").style.display = "block";
    $("emptyState").querySelector("p:last-child").textContent =
      "No hotels match your current filters.";
    updateFilterCount();
    return;
  }

  $("emptyState").style.display = "none";

  $("results").innerHTML = hotels.map(h => {
    const benefits = h.benefits || [];

    const selectedBenefits = benefits.slice(0, 4).map(
      b => `<span>${escapeHtml(b)}</span>`
    ).join("");

    const offerChip = h.amexTriggered
      ? `<span>Amex -€${Math.round(h.amexCredit)}</span>`
      : "";

    const promoChip = h.promotion
      ? `<span>20% personal promotion</span>`
      : "";

    const image = h.image
      ? `<img class="hotel-image" src="${escapeHtml(h.image)}" alt="${escapeHtml(h.name)}" loading="lazy">`
      : `<div class="hotel-image"></div>`;

    const booking = h.url
      ? `<a class="view-button" href="${escapeHtml(h.url)}" target="_blank" rel="noopener">View hotel</a>`
      : "";

    return `
      <article class="hotel">
        ${image}

        <div class="hotel-main">
          <h3 class="hotel-name">${escapeHtml(h.name)}</h3>
          <p class="hotel-brand">
            ${escapeHtml(h.brand)}
            ·
            ${escapeHtml(h.program || "Independent / unmatched")}
            ${h.program ? ` · ${escapeHtml(h.status)}` : ""}
          </p>

          <div class="hotel-meta">
            ${h.rating ? `<span>Rating ${h.rating.toFixed(1)}</span>` : ""}
            ${h.address ? `<span>${escapeHtml(h.address)}</span>` : ""}
          </div>

          <div class="hotel-amenities">
            ${h.amenities.slice(0, 6).map(amenityChip).join("")}
          </div>

          ${selectedBenefits || promoChip || offerChip
            ? `<div class="special">${selectedBenefits}${promoChip}${offerChip}</div>`
            : ""}
        </div>

        <div class="hotel-price">
          <div>
            <div class="price-label">Effective stay</div>
            <div class="effective">€${Math.round(h.effective)}</div>
            <div class="nightly">€${Math.round(h.effectiveNightly)} / night</div>

            <div class="price-detail">
              Original: €${Math.round(h.total)}
              ${h.promotion ? `<br>Personal promotion: -20%` : ""}
              ${h.amexTriggered ? `<br>Amex credit: -€${Math.round(h.amexCredit)}` : ""}
            </div>
          </div>

          ${booking}
        </div>
      </article>
    `;
  }).join("");

  updateFilterCount();
}

function updateFilterCount() {
  const programChecks = [...document.querySelectorAll(".program-filter:checked")].length;
  const amenityChecks = [...document.querySelectorAll(".amenity-filter:checked")].length;
  const extras =
    Number($("onlyBenefits")?.checked || false) +
    Number($("onlyOffers")?.checked || false);

  const count = programChecks + amenityChecks + extras;
  $("activeFilterCount").textContent =
    count ? `${count} filter${count === 1 ? "" : "s"} active` : "No filters";
}

function buildStatusFields() {
  const container = $("statusFields");
  if (!container) return;

  container.innerHTML = Object.entries(LOYALTY_PROGRAMS).map(([program, statuses]) => `
    <div class="status-row">
      <span class="status-name">${escapeHtml(program)}</span>
      <select data-program-status="${escapeHtml(program)}">
        ${statuses.map(status =>
          `<option value="${escapeHtml(status)}" ${status === PERSONAL_STATUS[program] ? "selected" : ""}>${escapeHtml(status)}</option>`
        ).join("")}
      </select>
    </div>
  `).join("");

  container.querySelectorAll("[data-program-status]").forEach(select => {
    select.addEventListener("change", () => {
      PERSONAL_STATUS[select.dataset.programStatus] = select.value;
      render();
    });
  });
}

function buildPointsFields() {
  const container = $("pointsFields");
  if (!container) return;

  container.innerHTML = Object.keys(LOYALTY_PROGRAMS).map(program => `
    <div class="status-row">
      <span class="status-name">${escapeHtml(program)}</span>
      <input type="number" min="0" step="1000" value="${PERSONAL_POINTS[program]}" data-program-points="${escapeHtml(program)}">
    </div>
  `).join("");

  container.querySelectorAll("[data-program-points]").forEach(input => {
    input.addEventListener("input", () => {
      PERSONAL_POINTS[input.dataset.programPoints] = Number(input.value) || 0;
    });
  });
}

function buildAmexFields() {
  const container = $("amexFields");
  if (!container) return;

  container.innerHTML = amexOffers.map((offer, index) => `
    <div class="amex-row">
      <input value="${escapeHtml(offer.name || "")}" placeholder="Hotel / chain" data-amex-name="${index}">
      <input type="number" min="0" step="10" value="${Number(offer.spend || 0)}" placeholder="Spend" data-amex-spend="${index}">
      <input type="number" min="0" step="5" value="${Number(offer.credit || 0)}" placeholder="Credit" data-amex-credit="${index}">
      <button type="button" class="remove-amex" data-remove-amex="${index}">×</button>
    </div>
  `).join("");

  container.querySelectorAll("[data-amex-name]").forEach(el => {
    el.addEventListener("input", () => {
      amexOffers[Number(el.dataset.amexName)].name = el.value;
      render();
    });
  });

  container.querySelectorAll("[data-amex-spend]").forEach(el => {
    el.addEventListener("input", () => {
      amexOffers[Number(el.dataset.amexSpend)].spend = Number(el.value) || 0;
      render();
    });
  });

  container.querySelectorAll("[data-amex-credit]").forEach(el => {
    el.addEventListener("input", () => {
      amexOffers[Number(el.dataset.amexCredit)].credit = Number(el.value) || 0;
      render();
    });
  });

  container.querySelectorAll("[data-remove-amex]").forEach(button => {
    button.addEventListener("click", () => {
      amexOffers.splice(Number(button.dataset.removeAmex), 1);
      buildAmexFields();
      render();
    });
  });
}

function setup() {
  setDefaultDates();

  $("searchButton")?.addEventListener("click", searchLive);

  $("sort")?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      state.chain = button.dataset.chain || "all";
      render();
    });
  });

  $("openFilters")?.addEventListener("click", () => {
    $("filterDrawer")?.classList.add("open");
    $("filterDrawer")?.setAttribute("aria-hidden", "false");
  });

  $("closeFilters")?.addEventListener("click", () => {
    $("filterDrawer")?.classList.remove("open");
    $("filterDrawer")?.setAttribute("aria-hidden", "true");
  });

  document.querySelectorAll(".program-filter").forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) state.activePrograms.add(input.value);
      else state.activePrograms.delete(input.value);
      updateFilterCount();
      render();
    });
  });

  document.querySelectorAll(".amenity-filter").forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) state.amenities.add(input.value);
      else state.amenities.delete(input.value);
      updateFilterCount();
      render();
    });
  });

  $("onlyBenefits")?.addEventListener("change", render);
  $("onlyOffers")?.addEventListener("change", render);

  $("applyFilters")?.addEventListener("click", () => {
    render();
    $("filterDrawer")?.classList.remove("open");
    $("filterDrawer")?.setAttribute("aria-hidden", "true");
  });

  $("resetFilters")?.addEventListener("click", () => {
    document.querySelectorAll(".program-filter, .amenity-filter").forEach(input => {
      input.checked = false;
    });
    if ($("onlyBenefits")) $("onlyBenefits").checked = false;
    if ($("onlyOffers")) $("onlyOffers").checked = false;
    state.activePrograms.clear();
    state.amenities.clear();
    buildStatusFields();
    updateFilterCount();
    render();
  });

  $("addAmex")?.addEventListener("click", () => {
    amexOffers.push({ name: "", spend: 0, credit: 0 });
    buildAmexFields();
  });

  buildStatusFields();
  buildPointsFields();
  buildAmexFields();
  updateFilterCount();
  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setup);
} else {
  setup();
}
