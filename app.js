const API_URL = "/api/hotels";

const LOYALTY_PROGRAMS = {
  "Hilton Honors": [
    "Member",
    "Silver",
    "Gold",
    "Diamond",
    "Diamond Reserve"
  ],
  "Marriott Bonvoy": [
    "Member",
    "Silver Elite",
    "Gold Elite",
    "Platinum Elite",
    "Titanium Elite"
  ],
  "IHG One Rewards": [
    "Club Member",
    "Silver Elite",
    "Gold Elite",
    "Platinum Elite",
    "Diamond Elite"
  ],
  "ALL - Accor Live Limitless": [
    "Classic",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond"
  ],
  "Radisson Rewards": [
    "Club",
    "Premium",
    "VIP"
  ],
  "MeliáRewards": [
    "White",
    "Silver",
    "Gold",
    "Platinum"
  ],
  "GHA DISCOVERY": [
    "Silver",
    "Gold",
    "Platinum",
    "Titanium"
  ],
  "Wyndham Rewards": [
    "Blue",
    "Gold",
    "Platinum",
    "Diamond"
  ],
  "WorldHotels Rewards": [
    "Red",
    "Gold",
    "Platinum",
    "Diamond",
    "Diamond Select"
  ],
  "Best Western Rewards": [
    "Blue",
    "Gold",
    "Platinum",
    "Diamond",
    "Diamond Select"
  ]
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
  Object.keys(LOYALTY_PROGRAMS).map(program => [program, 0])
);

let amexOffers = [
  {
    name: "WorldHotels",
    spend: 250,
    credit: 50
  }
];

const STATUS_BENEFITS = {
  "Hilton Honors": {
    "Member": [
      "Member Rate",
      "Free Wi-Fi",
      "Points earning"
    ],
    "Silver": [
      "20% bonus points",
      "5th night free on reward stays"
    ],
    "Gold": [
      "80% bonus points",
      "Room upgrade subject to availability",
      "Breakfast outside the US / F&B credit in the US",
      "5th night free on reward stays",
      "MyWay hotel benefits depending on brand"
    ],
    "Diamond": [
      "100% bonus points",
      "Room upgrade subject to availability",
      "Breakfast / F&B credit",
      "Executive Lounge at participating hotels",
      "Premium Wi-Fi",
      "48-hour room guarantee"
    ],
    "Diamond Reserve": [
      "All Diamond benefits",
      "Additional Diamond Reserve benefits"
    ]
  },

  "Marriott Bonvoy": {
    "Member": [
      "Member Rate",
      "Free Wi-Fi",
      "Points earning"
    ],
    "Silver Elite": [
      "10% bonus points",
      "Late check-out subject to availability"
    ],
    "Gold Elite": [
      "25% bonus points",
      "Room upgrade subject to availability",
      "Late check-out subject to availability"
    ],
    "Platinum Elite": [
      "50% bonus points",
      "Room upgrade including selected suites",
      "4pm late check-out subject to availability",
      "Welcome gift",
      "Lounge access at participating brands"
    ],
    "Titanium Elite": [
      "75% bonus points",
      "Room upgrade including selected suites",
      "4pm late check-out subject to availability",
      "Welcome gift",
      "Lounge access at participating brands"
    ]
  },

  "IHG One Rewards": {
    "Club Member": [
      "Member Rate",
      "Free Wi-Fi",
      "Points earning"
    ],
    "Silver Elite": [
      "20% bonus points",
      "Member Rate",
      "Free Wi-Fi"
    ],
    "Gold Elite": [
      "40% bonus points",
      "Member Rate",
      "Free Wi-Fi"
    ],
    "Platinum Elite": [
      "60% bonus points",
      "Room upgrade subject to availability",
      "Member Rate",
      "Free Wi-Fi",
      "Late check-out subject to availability"
    ],
    "Diamond Elite": [
      "100% bonus points",
      "Room upgrade subject to availability",
      "Breakfast at participating brands",
      "Member Rate",
      "Free Wi-Fi",
      "Late check-out subject to availability"
    ]
  },

  "ALL - Accor Live Limitless": {
    "Classic": [
      "Member Rate",
      "Free Wi-Fi",
      "Reward points"
    ],
    "Silver": [
      "Welcome drink",
      "Priority Welcome",
      "Late check-out subject to availability",
      "24% Reward Points bonus"
    ],
    "Gold": [
      "Welcome drink",
      "Priority Welcome",
      "Room upgrade subject to availability",
      "Early check-in or late check-out",
      "48% Reward Points bonus"
    ],
    "Platinum": [
      "Welcome drink",
      "Room upgrade subject to availability",
      "Suite Night Upgrade(s)",
      "Lounge access at participating hotels",
      "Early check-in and late check-out",
      "76% Reward Points bonus"
    ],
    "Diamond": [
      "All Platinum benefits",
      "Free weekend breakfast",
      "Dining & Spa Rewards",
      "Gold status for one person",
      "100% Reward Points bonus"
    ]
  },

  "Radisson Rewards": {
    "Club": [
      "Member Rate",
      "Member discount",
      "Priority Line"
    ],
    "Premium": [
      "Room upgrade subject to availability",
      "Early check-in subject to availability",
      "Late check-out subject to availability",
      "Food & beverage discount"
    ],
    "VIP": [
      "Room upgrade subject to availability",
      "Early check-in subject to availability",
      "Late check-out subject to availability",
      "Complimentary breakfast for two at participating hotels",
      "VIP benefits"
    ]
  },

  "MeliáRewards": {
    "White": [
      "Member Rate",
      "Points earning"
    ],
    "Silver": [
      "Room upgrade subject to availability",
      "Late check-out subject to availability"
    ],
    "Gold": [
      "Room upgrade subject to availability",
      "Early check-in subject to availability",
      "Late check-out subject to availability",
      "20% personal promotion"
    ],
    "Platinum": [
      "Room upgrade subject to availability",
      "Early check-in subject to availability",
      "Late check-out subject to availability",
      "Additional Platinum benefits",
      "20% personal promotion"
    ]
  },

  "GHA DISCOVERY": {
    "Silver": [
      "4% D$ on eligible spend",
      "Member Rate",
      "Local Offers",
      "Experiences"
    ],
    "Gold": [
      "5% D$ on eligible spend",
      "Member Rate",
      "Local Offers",
      "Experiences"
    ],
    "Platinum": [
      "6% D$ on eligible spend",
      "3pm late check-out subject to availability",
      "Room upgrade subject to availability",
      "Welcome amenity"
    ],
    "Titanium": [
      "7% D$ on eligible spend",
      "Early check-in from 11am subject to availability",
      "Late check-out until 4pm subject to availability",
      "Room upgrade subject to availability",
      "Welcome amenity"
    ]
  },

  "Wyndham Rewards": {
    "Blue": [
      "Member Rate",
      "Points earning"
    ],
    "Gold": [
      "Early check-in subject to availability",
      "Late check-out subject to availability",
      "Preferred room subject to availability",
      "10% points bonus"
    ],
    "Platinum": [
      "Early check-in subject to availability",
      "Late check-out subject to availability",
      "Preferred room subject to availability",
      "15% points bonus"
    ],
    "Diamond": [
      "Early check-in subject to availability",
      "Late check-out subject to availability",
      "Preferred room subject to availability",
      "Suite upgrade subject to availability",
      "20% points bonus"
    ]
  },

  "WorldHotels Rewards": {
    "Red": [
      "Member Rate",
      "Points earning"
    ],
    "Gold": [
      "Points bonus",
      "Early check-in / late check-out subject to availability",
      "Upgrade subject to availability",
      "Welcome amenity"
    ],
    "Platinum": [
      "Points bonus",
      "Early check-in / late check-out subject to availability",
      "Upgrade subject to availability",
      "Welcome amenity"
    ],
    "Diamond": [
      "Points bonus",
      "Upgrade subject to availability",
      "Welcome amenity",
      "Lounge access at participating hotels"
    ],
    "Diamond Select": [
      "Points bonus",
      "Upgrade subject to availability",
      "Welcome amenity",
      "Lounge access",
      "Breakfast at participating hotels"
    ]
  },

  "Best Western Rewards": {
    "Blue": [
      "Member Rate",
      "Points earning"
    ],
    "Gold": [
      "10% bonus points",
      "Welcome amenity",
      "Member Rate"
    ],
    "Platinum": [
      "15% bonus points",
      "Welcome amenity",
      "Early check-in / late check-out subject to availability",
      "Member Rate"
    ],
    "Diamond": [
      "30% bonus points",
      "Welcome amenity",
      "Early check-in / late check-out subject to availability",
      "Member Rate"
    ],
    "Diamond Select": [
      "50% bonus points",
      "Welcome amenity",
      "Early check-in / late check-out subject to availability",
      "Member Rate"
    ]
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
  ["curio", "Hilton", "Curio Collection", "Hilton Honors"],
  ["tapestry", "Hilton", "Tapestry Collection", "Hilton Honors"],
  ["homewood suites", "Hilton", "Homewood Suites", "Hilton Honors"],
  ["home2 suites", "Hilton", "Home2 Suites", "Hilton Honors"],
  ["hilton", "Hilton", "Hilton", "Hilton Honors"],

  ["ritz-carlton", "Marriott", "The Ritz-Carlton", "Marriott Bonvoy"],
  ["st regis", "Marriott", "St. Regis", "Marriott Bonvoy"],
  ["jw marriott", "Marriott", "JW Marriott", "Marriott Bonvoy"],
  ["w hotels", "Marriott", "W Hotels", "Marriott Bonvoy"],
  ["edition", "Marriott", "EDITION", "Marriott Bonvoy"],
  ["sheraton", "Marriott", "Sheraton", "Marriott Bonvoy"],
  ["westin", "Marriott", "Westin", "Marriott Bonvoy"],
  ["renaissance", "Marriott", "Renaissance", "Marriott Bonvoy"],
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
  ["swissotel", "Accor", "Swissôtel", "ALL - Accor Live Limitless"],
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

  ["gran melia", "Meliá", "Gran Meliá", "MeliáRewards"],
  ["me by melia", "Meliá", "ME by Meliá", "MeliáRewards"],
  ["innside", "Meliá", "INNSiDE", "MeliáRewards"],
  ["zel", "Meliá", "Zel", "MeliáRewards"],
  ["paradisus", "Meliá", "Paradisus", "MeliáRewards"],
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
  Pool: '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M4 14c2.5-2.5 5.5-2.5 8 0s5.5 2.5 8 0"/><path d="M4 18c2.5-2.5 5.5-2.5 8 0s5.5 2.5 8 0"/></svg>',
  Sauna: '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M7 19c0-2 2-3 2-5 0-1.5-1-2-1-3"/><path d="M12 19c0-2 2-3 2-5 0-1.5-1-2-1-3"/><path d="M17 19c0-2 2-3 2-5 0-1.5-1-2-1-3"/><path d="M4 21h16"/></svg>',
  Spa: '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M12 21c4-3 6-6.5 6-10A6 6 0 0 0 6 11c0 3.5 2 7 6 10Z"/><path d="M12 4V2"/></svg>',
  Fitness: '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/></svg>',
  Breakfast: '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M5 18h14"/><path d="M7 18c0-4 2-6 5-6s5 2 5 6"/><path d="M12 12V5"/></svg>',
  Parking: '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M7 20V4h5a4 4 0 0 1 0 8H7"/><path d="M4 20h16"/></svg>',
  Restaurant: '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3v18M17 3c3 2 3 7 0 9"/></svg>',
  Bar: '<svg class="amenity-icon" viewBox="0 0 24 24"><path d="M5 4h14l-5 7v7h3v2H7v-2h3v-7L5 4Z"/><path d="M8 8h8"/></svg>'
};

const state = {
  chain: "all",
  activePrograms: new Set(),
  amenities: new Set(),
  sort: "effective"
};

let liveHotels = [];
let searchPerformed = false;

let lastSearchMeta = {
  totalCount: 0,
  sourceUrl: null
};

const $ = id => document.getElementById(id);

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
  const checkIn = $("checkIn")?.value;
  const checkOut = $("checkOut")?.value;

  if (!checkIn || !checkOut) {
    return 1;
  }

  const a = new Date(`${checkIn}T00:00:00`);
  const b = new Date(`${checkOut}T00:00:00`);

  const diff = Math.round((b - a) / 86400000);

  return Math.max(diff, 1);
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function number(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const parsed = Number(
    String(value).replace(/[^0-9.-]/g, "")
  );

  return Number.isFinite(parsed) ? parsed : null;
}

function first(obj, keys) {
  for (const key of keys) {
    if (
      obj &&
      obj[key] !== null &&
      obj[key] !== undefined
    ) {
      return obj[key];
    }
  }

  return null;
}

function normalizeBookingUrl(value) {
  if (!value) return null;

  try {
    const url = new URL(value, window.location.origin);

    if (
      url.protocol === "http:" ||
      url.protocol === "https:"
    ) {
      return url.href;
    }

    return null;
  } catch {
    return null;
  }
}

function extractHotels(payload) {
  const possible = [
    payload?.hotels,
    payload?.data?.hotels,
    payload?.results,
    payload?.data?.results,
    payload?.data
  ];

  return possible.find(item => Array.isArray(item)) || [];
}

function normalizeAmenities(hotel) {
  const raw = first(hotel, [
    "amenities",
    "facilities",
    "amenity"
  ]) || [];

  if (Array.isArray(raw)) {
    return raw
      .map(item => {
        if (typeof item === "string") {
          return item;
        }

        return String(
          first(item, [
            "name",
            "label",
            "title"
          ]) || ""
        );
      })
      .filter(Boolean);
  }

  if (typeof raw === "string") {
    return raw
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeHotel(hotel) {
  const price = hotel?.price || {};
  const location = hotel?.location || {};
  const rating = hotel?.rating || {};

  const nightly = number(
    price.price_per_night ??
    price.current ??
    price.nightly ??
    hotel?.price_per_night ??
    null
  );

  const suppliedTotal = number(
    price.total_price ??
    price.total ??
    hotel?.total_price ??
    null
  );

  let image = null;

  const images = Array.isArray(hotel?.images)
    ? hotel.images
    : [];

  if (images.length) {
    image =
      typeof images[0] === "string"
        ? images[0]
        : first(images[0], [
            "url",
            "src",
            "image_url"
          ]);
  }

  if (!image) {
    image = first(hotel, [
      "image",
      "image_url",
      "photo",
      "thumbnail"
    ]);
  }

  return {
    raw: hotel,

    id:
      hotel?.hotel_id ??
      hotel?.id ??
      null,

    name: String(
      hotel?.name ??
      "Unnamed hotel"
    ),

    suppliedTotal,
    nightly,
    image,

    rating: number(
      rating?.value ??
      hotel?.rating_value ??
      hotel?.score ??
      null
    ),

    reviewCount: number(
      rating?.votes ??
      hotel?.review_count ??
      hotel?.reviews ??
      null
    ),

    stars: number(
      hotel?.stars ??
      hotel?.hotel_class ??
      null
    ),

    amenities: normalizeAmenities(hotel),

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

    url: normalizeBookingUrl(
      hotel?.booking_url ??
      hotel?.hotel_url ??
      hotel?.url ??
      null
    ),

    isPaid: Boolean(hotel?.is_paid)
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

function classifyHotel(name) {
  const text = normalizeBrandText(name);

  for (const [
    needle,
    chain,
    brand,
    program
  ] of PROGRAM_ALIASES) {
    const normalizedNeedle =
      normalizeBrandText(needle);

    if (
      normalizedNeedle &&
      text.includes(normalizedNeedle)
    ) {
      return {
        chain,
        brand,
        program
      };
    }
  }

  return {
    chain:
