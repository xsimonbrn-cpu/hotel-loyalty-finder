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
  Object.keys(LOYALTY_PROGRAMS)
    .map(program => [program, 0])
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
      "5th night free on reward stays"
    ],
    "Diamond": [
      "100% bonus points",
      "Room upgrade subject to availability",
      "Breakfast / F&B credit",
      "Executive Lounge at participating hotels"
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
      "Room upgrade, including selected suites, subject to availability",
      "4pm late check-out subject to availability",
      "Welcome gift",
      "Lounge access at participating brands"
    ],
    "Titanium Elite": [
      "75% bonus points",
      "Room upgrade, including selected suites, subject to availability",
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
  Pool: "🏊",
  Sauna: "♨️",
  Spa: "🧖",
  Fitness: "🏋️",
  Breakfast: "☕",
  Parking: "🅿️",
  Restaurant: "🍽️",
  Bar: "🍸"
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
  pagesFetched: 0
};

const $ = id =>
  document.getElementById(id);

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

function setDefaultDates() {
  const today = new Date();

  const checkIn =
    new Date(today);

  const checkOut =
    new Date(today);

  checkIn.setDate(
    today.getDate() + 7
  );

  checkOut.setDate(
    today.getDate() + 9
  );

  if ($("checkIn")) {
    $("checkIn").value =
      checkIn
        .toISOString()
        .slice(0, 10);
  }

  if ($("checkOut")) {
    $("checkOut").value =
      checkOut
        .toISOString()
        .slice(0, 10);
  }
}

function nights() {
  const a =
    new Date(
      $("checkIn").value
    );

  const b =
    new Date(
      $("checkOut").value
    );

  return Math.max(
    Math.round(
      (b - a) / 86400000
    ),
    1
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(
    new Date(value)
  );
}

function number(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    typeof value === "number"
  ) {
    return Number.isFinite(value)
      ? value
      : null;
  }

  const parsed =
    Number(
      String(value)
        .replace(/[^\d.,-]/g, "")
        .replace(/,/g, "")
    );

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function first(obj, keys) {
  for (
    const key of keys
  ) {
    if (
      obj &&
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== ""
    ) {
      return obj[key];
    }
  }

  return null;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function extractHotels(payload) {
  const possible = [
    payload?.hotels,
    payload?.data?.hotels,
    payload?.results,
    payload?.data?.results,
    payload?.data
  ];

  return (
    possible.find(
      Array.isArray
    ) || []
  );
}

/* ---------------------------------------------------------
   AMENITIES
--------------------------------------------------------- */

function normalizeAmenities(hotel) {
  const raw =
    first(
      hotel,
      [
        "amenities",
        "facilities",
        "amenity"
      ]
    ) || [];

  if (
    Array.isArray(raw)
  ) {
    return raw
      .map(item => {
        if (
          typeof item === "string"
        ) {
          return item;
        }

        return String(
          first(
            item,
            [
              "name",
              "label",
              "title"
            ]
          ) || ""
        );
      })
      .filter(Boolean);
  }

  if (
    typeof raw === "string"
  ) {
    return raw
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);
  }

  return [];
}

/* ---------------------------------------------------------
   IMAGES + PRICES
--------------------------------------------------------- */

function normalizeHotel(hotel) {
  const price =
    hotel?.price || {};

  const rate =
    price?.rate_per_night ||
    {};

  const totalRate =
    price?.total_rate ||
    {};

  /*
  Backend already normalizes these,
  but the frontend also accepts raw
  SerpApi structures for safety.
  */

  let nightly =
    number(
      price?.price_per_night ??
      price?.current ??
      rate?.extracted_lowest ??
      rate?.extracted_price ??
      null
    );

  let total =
    number(
      price?.total_price ??
      price?.total ??
      totalRate?.extracted_lowest ??
      totalRate?.extracted_total ??
      null
    );

  const n =
    nights();

  if (
    total == null &&
    nightly != null
  ) {
    total =
      nightly * n;
  }

  if (
    nightly == null &&
    total != null
  ) {
    nightly =
      total / n;
  }

  const images =
    Array.isArray(
      hotel?.images
    )
      ? hotel.images
      : [];

  let image = null;

  if (
    images.length
  ) {
    const firstImage =
      images[0];

    if (
      typeof firstImage ===
      "string"
    ) {
      image =
        firstImage;
    } else {
      image =
        first(
          firstImage,
          [
            "original_image",
            "image",
            "url",
            "src",
            "thumbnail"
          ]
        );
    }
  }

  if (!image) {
    image =
      first(
        hotel,
        [
          "thumbnail",
          "original_image",
          "image",
          "image_url"
        ]
      );
  }

  const rating =
    number(
      hotel?.rating?.value ??
      hotel?.overall_rating ??
      hotel?.rating_value ??
      hotel?.score ??
      null
    );

  const reviewCount =
    number(
      hotel?.rating?.votes ??
      hotel?.reviews ??
      hotel?.review_count ??
      null
    );

  const stars =
    number(
      hotel?.stars ??
      hotel?.extracted_hotel_class ??
      hotel?.hotel_class ??
      null
    );

  return {
    raw: hotel,

    id:
      hotel?.hotel_id ??
      hotel?.property_token ??
      hotel?.place_id ??
      hotel?.id ??
      null,

    name:
      String(
        hotel?.name ??
        "Unnamed hotel"
      ),

    total,

    nightly,

    image,

    images,

    rating,

    reviewCount,

    stars,

    amenities:
      normalizeAmenities(
        hotel
      ),

    address:
      hotel?.location?.address ??
      hotel?.address ??
      null,

    latitude:
      hotel?.location?.latitude ??
      hotel?.latitude ??
      null,

    longitude:
      hotel?.location?.longitude ??
      hotel?.longitude ??
      null,

    url:
      hotel?.booking_url ??
      hotel?.hotel_url ??
      hotel?.url ??
      null,

    property_token:
      hotel?.property_token ??
      null
  };
}

/* ---------------------------------------------------------
   LOYALTY CLASSIFICATION
--------------------------------------------------------- */

function normalizeBrandText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(
      /[^a-z0-9]+/g,
      " "
    )
    .trim();
}

function classifyHotel(name) {
  const text =
    normalizeBrandText(
      name
    );

  for (
    const [
      needle,
      chain,
      brand,
      program
    ]
    of PROGRAM_ALIASES
  ) {
    const normalizedNeedle =
      normalizeBrandText(
        needle
      );

    if (
      normalizedNeedle &&
      text.includes(
        normalizedNeedle
      )
    ) {
      return {
        chain,
        brand,
        program
      };
    }
  }

  return {
    chain: "Other",
    brand: "Other",
    program: null
  };
}

function benefitsFor(program) {
  const status =
    PERSONAL_STATUS[
      program
    ];

  return (
    STATUS_BENEFITS[
      program
    ]?.[status] || []
  );
}

/* ---------------------------------------------------------
   AMEX
--------------------------------------------------------- */

function amexFor(
  hotel,
  program,
  brand
) {
  const haystack =
    `${hotel.name} ${program || ""} ${brand || ""}`
      .toLowerCase();

  return (
    amexOffers
      .filter(
        offer =>
          offer.name &&
          haystack.includes(
            String(
              offer.name
            ).toLowerCase()
          )
      )
      .sort(
        (a, b) =>
          Number(b.credit || 0) -
          Number(a.credit || 0)
      )[0] ||
    null
  );
}

/* ---------------------------------------------------------
   ENRICH
--------------------------------------------------------- */

function enrich(hotel) {
  const cls =
    classifyHotel(
      hotel.name
    );

  const n =
    nights();

  const nightly =
    hotel.nightly != null
      ? hotel.nightly
      : hotel.total != null
        ? hotel.total / n
        : null;

  const total =
    hotel.total != null
      ? hotel.total
      : nightly != null
        ? nightly * n
        : null;

  const safeNightly =
    nightly ?? 0;

  const safeTotal =
    total ?? 0;

  const program =
    cls.program;

  const status =
    program
      ? (
          PERSONAL_STATUS[
            program
          ] || "Member"
        )
      : "—";

  const benefits =
    benefitsFor(
      program
    );

  const promotion =
    program ===
    "MeliáRewards"
      ? 0.20
      : 0;

  const discounted =
    safeTotal *
    (1 - promotion);

  const amex =
    amexFor(
      hotel,
      program,
      cls.brand
    );

  const amexTriggered =
    Boolean(
      amex &&
      discounted >=
        Number(
          amex.spend || 0
        )
    );

  const amexCredit =
    amexTriggered
      ? Number(
          amex.credit || 0
        )
      : 0;

  const effective =
    Math.max(
      discounted -
        amexCredit,
      0
    );

  return {
    ...hotel,
    ...cls,

    status,

    benefits,

    total:
      safeTotal,

    nightly:
      safeNightly,

    promotion,

    amex,

    amexTriggered,

    amexCredit,

    effective,

    effectiveNightly:
      effective / n
  };
}

/* ---------------------------------------------------------
   SEARCH
--------------------------------------------------------- */

async function searchLive() {
  const city =
    $("city")
      ?.value
      .trim();

  const checkIn =
    $("checkIn")
      ?.value;

  const checkOut =
    $("checkOut")
      ?.value;

  const guests =
    Number(
      $("guests")
        ?.value || 2
    );

  if (!city) {
    alert(
      "Please enter a city."
    );
    return;
  }

  if (
    !checkIn ||
    !checkOut ||
    new Date(checkOut) <=
      new Date(checkIn)
  ) {
    alert(
      "Please choose valid check-in and check-out dates."
    );
    return;
  }

  const params =
    new URLSearchParams({
      location: city,
      check_in: checkIn,
      check_out: checkOut,
      adults: String(
        guests
      ),
      currency: "EUR",

      /*
      3 pages = up to roughly
      60 Google Hotels results.
      */

      pages: "3"
    });

  const button =
    $("searchButton");

  if (button) {
    button.disabled = true;
    button.textContent =
      "Searching...";
  }

  try {
    const response =
      await fetch(
        `${API_URL}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/json"
          }
        }
      );

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    if (
      !contentType.includes(
        "application/json"
      )
    ) {
      throw new Error(
        `API returned ${response.status}. Expected JSON.`
      );
    }

    const payload =
      await response.json();

    if (
      !response.ok ||
      payload?.error
    ) {
      throw new Error(
        payload?.details ||
        payload?.error ||
        `Request failed (${response.status})`
      );
    }

    const rawHotels =
      extractHotels(
        payload
      );

    liveHotels =
      rawHotels.map(
        normalizeHotel
      );

    lastSearchMeta = {
      totalCount:
        Number(
          payload?.total_count ??
          liveHotels.length
        ),

      pagesFetched:
        Number(
          payload?.pages_fetched ||
          1
        )
    };

    searchPerformed =
      true;

    render();

  } catch (error) {
    console.error(
      "Hotel search error:",
      error
    );

    alert(
      `Hotel search failed: ${error.message}`
    );

  } finally {
    if (button) {
      button.disabled = false;
      button.textContent =
        "Search";
    }
  }
}

/* ---------------------------------------------------------
   AMENITY UI
--------------------------------------------------------- */

function amenityChip(name) {
  const key =
    Object.keys(
      AMENITY_ICON
    ).find(
      item =>
        String(name)
          .toLowerCase()
          .includes(
            item.toLowerCase()
          )
    );

  const icon =
    key
      ? AMENITY_ICON[key]
      : "•";

  return `
    <span class="amenity-chip">
      <span class="amenity-icon-text">
        ${icon}
      </span>
      <span>
        ${escapeHtml(name)}
      </span>
    </span>
  `;
}

/* ---------------------------------------------------------
   FILTERS
--------------------------------------------------------- */

function selectedProgramFilters() {
  return new Set(
    [
      ...document.querySelectorAll(
        'input.program-filter:checked, input[data-filter="program"]:checked'
      )
    ].map(
      input =>
        input.value
    )
  );
}

function selectedAmenityFilters() {
  return new Set(
    [
      ...document.querySelectorAll(
        'input.amenity-filter:checked, input[data-filter="amenity"]:checked'
      )
    ].map(
      input =>
        input.value
    )
  );
}

/* ---------------------------------------------------------
   RENDER
--------------------------------------------------------- */

function render() {
  const n =
    nights();

  let hotels =
    liveHotels.map(
      enrich
    );

  if (
    state.chain !==
    "all"
  ) {
    hotels =
      hotels.filter(
        hotel =>
          hotel.chain ===
          state.chain
      );
  }

  const activePrograms =
    selectedProgramFilters();

  const activeAmenities =
    selectedAmenityFilters();

  if (
    activePrograms.size
  ) {
    hotels =
      hotels.filter(
        hotel =>
          activePrograms.has(
            hotel.chain
          )
      );
  }

  if (
    activeAmenities.size
  ) {
    hotels =
      hotels.filter(
        hotel => {
          const all =
            hotel.amenities
              .map(
                amenity =>
                  String(
                    amenity
                  ).toLowerCase()
              );

          return [
            ...activeAmenities
          ].every(
            required =>
              all.some(
                value =>
                  value.includes(
                    String(
                      required
                    ).toLowerCase()
                  )
              )
          );
        }
      );
  }

  if (
    $("onlyBenefits")
      ?.checked
  ) {
    hotels =
      hotels.filter(
        hotel =>
          hotel.program &&
          hotel.benefits.length
      );
  }

  if (
    $("onlyOffers")
      ?.checked
  ) {
    hotels =
      hotels.filter(
        hotel =>
          hotel.promotion > 0 ||
          hotel.amexTriggered
      );
  }

  /* SORT */

  if (
    state.sort ===
    "effective"
  ) {
    hotels.sort(
      (a, b) =>
        a.effective -
        b.effective
    );
  }

  if (
    state.sort ===
    "rating"
  ) {
    hotels.sort(
      (a, b) =>
        (b.rating || 0) -
        (a.rating || 0)
    );
  }

  if (
    state.sort ===
    "benefits"
  ) {
    hotels.sort(
      (a, b) =>
        b.benefits.length -
        a.benefits.length
    );
  }

  if (
    state.sort ===
    "value"
  ) {
    hotels.sort(
      (a, b) => {
        const valueA =
          (a.rating || 0) +
          a.benefits.length *
            0.15 +
          (a.promotion
            ? 0.2
            : 0);

        const valueB =
          (b.rating || 0) +
          b.benefits.length *
            0.15 +
          (b.promotion
            ? 0.2
            : 0);

        return (
          valueB -
          valueA
        );
      }
    );
  }

  if (
    $("resultTitle")
  ) {
    $("resultTitle")
      .textContent =
      `Hotels in ${
        $("city")
          ?.value
          ?.trim() ||
        "your city"
      }`;
  }

  if (!searchPerformed) {
    if ($("resultMeta")) {
      $("resultMeta")
        .textContent =
        "Choose your dates and search for live hotels.";
    }

    if ($("results")) {
      $("results")
        .innerHTML = "";
    }

    if ($("emptyState")) {
      $("emptyState")
        .style.display =
        "block";
    }

    return;
  }

  const apiFound =
    Number(
      lastSearchMeta.totalCount ||
      hotels.length
    );

  if ($("resultMeta")) {
    $("resultMeta")
      .textContent =
      `${hotels.length} shown` +
      (
        apiFound >
        hotels.length
          ? ` · ${apiFound} found`
          : ""
      ) +
      ` · ${formatDate(
        $("checkIn").value
      )}` +
      ` – ${formatDate(
        $("checkOut").value
      )}` +
      ` · ${n} nights` +
      ` · ${
        $("guests").value
      } guests` +
      ` · Live Google Hotels`;
  }

  if (!hotels.length) {
    if ($("results")) {
      $("results")
        .innerHTML = "";
    }

    if ($("emptyState")) {
      $("emptyState")
        .style.display =
        "block";

      const text =
        $("emptyState")
          .querySelector(
            "p:last-child"
          );

      if (text) {
        text.textContent =
          "No hotels match your current filters.";
      }
    }

    updateFilterCount();
    return;
  }

  if ($("emptyState")) {
    $("emptyState")
      .style.display =
      "none";
  }

  $("results").innerHTML =
    hotels.map(
      hotel => {
        const benefits =
          hotel.benefits ||
          [];

        const selectedBenefits =
          benefits
            .slice(0, 4)
            .map(
              benefit =>
                `<span>${escapeHtml(
                  benefit
                )}</span>`
            )
            .join("");

        const offerChip =
          hotel.amexTriggered
            ? `<span>💳 Amex -€${Math.round(
                hotel.amexCredit
              )}</span>`
            : "";

        const promoChip =
          hotel.promotion
            ? `<span>🎁 20% personal promotion</span>`
            : "";

        const image =
          hotel.image
            ? `
              <img
                class="hotel-image"
                src="${escapeHtml(
                  hotel.image
                )}"
                alt="${escapeHtml(
                  hotel.name
                )}"
                loading="lazy"
                onerror="this.style.display='none'"
              >
            `
            : `
              <div class="hotel-image hotel-image-empty">
                🏨
              </div>
            `;

        const rating =
          hotel.rating
            ? `
              ⭐ ${hotel.rating.toFixed(
                1
              )}
              ${
                hotel.reviewCount
                  ? `(${hotel.reviewCount.toLocaleString(
                      "en-GB"
                    )})`
                  : ""
              }
            `
            : "";

        const stars =
          hotel.stars
            ? "★".repeat(
                Math.min(
                  hotel.stars,
                  5
                )
              )
            : "";

        const booking =
          `
          <button
            class="view-button booking-button"
            type="button"
            data-book-hotel="${escapeHtml(
              hotel.name
            )}"
            data-book-location="${escapeHtml(
              $("city")?.value ||
              ""
            )}"
          >
            View / compare
          </button>
          `;

        return `
          <article class="hotel">

            ${image}

            <div class="hotel-main">

              <h3 class="hotel-name">
                ${escapeHtml(
                  hotel.name
                )}
              </h3>

              <p class="hotel-brand">
                ${escapeHtml(
                  hotel.brand ||
                  "Hotel"
                )}

                ${
                  hotel.program
                    ? ` · ${escapeHtml(
                        hotel.program
                      )}`
                    : ""
                }

                ${
                  hotel.program
                    ? ` · ${escapeHtml(
                        hotel.status
                      )}`
                    : ""
                }
              </p>

              <div class="hotel-meta">

                ${
                  rating
                    ? `<span>${rating}</span>`
                    : ""
                }

                ${
                  stars
                    ? `<span class="hotel-stars">${stars}</span>`
                    : ""
                }

                ${
                  hotel.address
                    ? `<span>${escapeHtml(
                        hotel.address
                      )}</span>`
                    : ""
                }

              </div>

              <div class="hotel-amenities">

                ${
                  hotel.amenities
                    .slice(0, 8)
                    .map(
                      amenityChip
                    )
                    .join("")
                }

              </div>

              ${
                selectedBenefits ||
                promoChip ||
                offerChip
                  ? `
                    <div class="special">
                      ${selectedBenefits}
                      ${promoChip}
                      ${offerChip}
                    </div>
                  `
                  : ""
              }

            </div>

            <div class="hotel-price">

              <div>

                <div class="price-label">
                  Effective stay
                </div>

                <div class="price-source">
                  Live Google Hotels price
                </div>

                <div class="effective">
                  €${Math.round(
                    hotel.effective
                  )}
                </div>

                <div class="nightly">
                  €${Math.round(
                    hotel.effectiveNightly
                  )}
                  / night
                </div>

                <div class="price-detail">

                  Original stay:
                  €${Math.round(
                    hotel.total
                  )}

                  <br>

                  €${Math.round(
                    hotel.nightly
                  )}
                  / night

                  ${
                    hotel.promotion
                      ? `<br>🎁 Personal promotion: -20%`
                      : ""
                  }

                  ${
                    hotel.amexTriggered
                      ? `<br>💳 Amex credit: -€${Math.round(
                          hotel.amexCredit
                        )}`
                      : ""
                  }

                </div>

              </div>

              ${booking}

            </div>

          </article>
        `;
      }
    ).join("");

  updateFilterCount();
}

/* ---------------------------------------------------------
   FILTER COUNT
--------------------------------------------------------- */

function updateFilterCount() {
  const programChecks =
    document.querySelectorAll(
      'input.program-filter:checked, input[data-filter="program"]:checked'
    ).length;

  const amenityChecks =
    document.querySelectorAll(
      'input.amenity-filter:checked, input[data-filter="amenity"]:checked'
    ).length;

  const extras =
    Number(
      Boolean(
        $("onlyBenefits")
          ?.checked
      )
    ) +
    Number(
      Boolean(
        $("onlyOffers")
          ?.checked
      )
    );

  const count =
    programChecks +
    amenityChecks +
    extras;

  if (
    $("activeFilterCount")
  ) {
    $("activeFilterCount")
      .textContent =
      count
        ? `${count} filter${
            count === 1
              ? ""
              : "s"
          } active`
        : "No filters";
  }
}

/* ---------------------------------------------------------
   STATUS FIELDS
--------------------------------------------------------- */

function buildStatusFields() {
  const container =
    $("statusFields");

  if (!container)
    return;

  container.innerHTML =
    Object.entries(
      LOYALTY_PROGRAMS
    )
      .map(
        ([program, statuses]) =>
          `
          <div class="status-row">

            <span class="status-name">
              ${escapeHtml(
                program
              )}
            </span>

            <select
              data-program-status="${escapeHtml(
                program
              )}"
            >

              ${statuses
                .map(
                  status =>
                    `
                    <option
                      value="${escapeHtml(
                        status
                      )}"
                      ${
                        status ===
                        PERSONAL_STATUS[
                          program
                        ]
                          ? "selected"
                          : ""
                      }
                    >
                      ${escapeHtml(
                        status
                      )}
                    </option>
                    `
                )
                .join("")}

            </select>

          </div>
          `
      )
      .join("");

  container
    .querySelectorAll(
      "[data-program-status]"
    )
    .forEach(
      select => {
        select.addEventListener(
          "change",
          () => {
            PERSONAL_STATUS[
              select.dataset
                .programStatus
            ] =
              select.value;

            render();
          }
        );
      }
    );
}

/* ---------------------------------------------------------
   POINTS
--------------------------------------------------------- */

function buildPointsFields() {
  const container =
    $("pointsFields");

  if (!container)
    return;

  container.innerHTML =
    Object.keys(
      LOYALTY_PROGRAMS
    )
      .map(
        program =>
          `
          <div class="status-row">

            <span class="status-name">
              ${escapeHtml(
                program
              )}
            </span>

            <input
              type="number"
              min="0"
              step="1000"
              value="${
                PERSONAL_POINTS[
                  program
                ]
              }"
              data-program-points="${escapeHtml(
                program
              )}"
            >

          </div>
          `
      )
      .join("");

  container
    .querySelectorAll(
      "[data-program-points]"
    )
    .forEach(
      input => {
        input.addEventListener(
          "input",
          () => {
            PERSONAL_POINTS[
              input.dataset
                .programPoints
            ] =
              Number(
                input.value
              ) || 0;
          }
        );
      }
    );
}

/* ---------------------------------------------------------
   AMEX FIELDS
--------------------------------------------------------- */

function buildAmexFields() {
  const container =
    $("amexFields");

  if (!container)
    return;

  container.innerHTML =
    amexOffers
      .map(
        (offer, index) =>
          `
          <div class="amex-row">

            <input
              value="${escapeHtml(
                offer.name || ""
              )}"
              placeholder="Hotel / chain"
              data-amex-name="${index}"
            >

            <input
              type="number"
              min="0"
              step="10"
              value="${Number(
                offer.spend || 0
              )}"
              placeholder="Spend"
              data-amex-spend="${index}"
            >

            <input
              type="number"
              min="0"
              step="5"
              value="${Number(
                offer.credit || 0
              )}"
              placeholder="Credit"
              data-amex-credit="${index}"
            >

            <button
              type="button"
              class="remove-amex"
              data-remove-amex="${index}"
            >
              ×
            </button>

          </div>
          `
      )
      .join("");

  container
    .querySelectorAll(
      "[data-amex-name]"
    )
    .forEach(
      element => {
        element.addEventListener(
          "input",
          () => {
            amexOffers[
              Number(
                element.dataset
                  .amexName
              )
            ].name =
              element.value;

            render();
          }
        );
      }
    );

  container
    .querySelectorAll(
      "[data-amex-spend]"
    )
    .forEach(
      element => {
        element.addEventListener(
          "input",
          () => {
            amexOffers[
              Number(
                element.dataset
                  .amexSpend
              )
            ].spend =
              Number(
                element.value
              ) || 0;

            render();
          }
        );
      }
    );

  container
    .querySelectorAll(
      "[data-amex-credit]"
    )
    .forEach(
      element => {
        element.addEventListener(
          "input",
          () => {
            amexOffers[
              Number(
                element.dataset
                  .amexCredit
              )
            ].credit =
              Number(
                element.value
              ) || 0;

            render();
          }
        );
      }
    );

  container
    .querySelectorAll(
      "[data-remove-amex]"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            amexOffers.splice(
              Number(
                button.dataset
                  .removeAmex
              ),
              1
            );

            buildAmexFields();
            render();
          }
        );
      }
    );
}

/* ---------------------------------------------------------
   BOOKING MODAL
--------------------------------------------------------- */

function closeBookingModal() {
  document
    .getElementById(
      "bookingModal"
    )
    ?.remove();
}

function openBookingModal(
  hotelName,
  location
) {
  closeBookingModal();

  const modal =
    document.createElement(
      "div"
    );

  modal.id =
    "bookingModal";

  modal.className =
    "booking-modal";

  modal.innerHTML = `
    <div
      class="booking-modal-backdrop"
      data-close-booking
    ></div>

    <div
      class="booking-modal-panel"
      role="dialog"
      aria-modal="true"
    >

      <div class="booking-modal-head">

        <div>
          <p class="eyebrow">
            BOOKING OPTIONS
          </p>

          <h2>
            ${escapeHtml(
              hotelName
            )}
          </h2>
        </div>

        <button
          type="button"
          class="drawer-close"
          data-close-booking
        >
          Close
        </button>

      </div>

      <p
        id="bookingLoading"
        class="booking-loading"
      >
        Finding booking links…
      </p>

      <div
        id="bookingLinks"
        class="booking-links"
      ></div>

    </div>
  `;

  document.body.appendChild(
    modal
  );

  const params =
    new URLSearchParams({
      hotel_name:
        hotelName,
      location:
        location || ""
    });

  fetch(
    `/api/links?${params.toString()}`,
    {
      headers: {
        Accept:
          "application/json"
      }
    }
  )
    .then(
      async response => {
        const data =
          await response.json();

        if (
          !response.ok ||
          data?.error
        ) {
          throw new Error(
            data?.error ||
            "No booking links found."
          );
        }

        return data;
      }
    )
    .then(
      data => {
        const loading =
          document.getElementById(
            "bookingLoading"
          );

        const container =
          document.getElementById(
            "bookingLinks"
          );

        if (loading) {
          loading.style.display =
            "none";
        }

        const labels = {
          booking_com:
            "Booking.com",
          expedia:
            "Expedia",
          hotels_com:
            "Hotels.com",
          agoda:
            "Agoda",
          tripadvisor:
            "Tripadvisor",
          kayak:
            "KAYAK",
          priceline:
            "Priceline",
          marriott:
            "Marriott",
          hilton:
            "Hilton",
          ihg:
            "IHG",
          official_website:
            "Official website"
        };

        const links =
          Object.entries(
            data?.links || {}
          ).filter(
            ([, value]) =>
              typeof value ===
                "string" &&
              value.startsWith(
                "http"
              )
          );

        if (!links.length) {
          container.innerHTML =
            `
            <p class="booking-empty">
              No booking platform links were returned.
            </p>
            `;

          return;
        }

        container.innerHTML =
          links
            .map(
              ([key, value]) =>
                `
                <a
                  class="booking-link"
                  href="${escapeHtml(
                    value
                  )}"
                  target="_blank"
                  rel="noopener"
                >
                  <span>
                    ${escapeHtml(
                      labels[key] ||
                      key
                    )}
                  </span>

                  <span>
                    ↗
                  </span>
                </a>
                `
            )
            .join("");
      }
    )
    .catch(
      error => {
        const loading =
          document.getElementById(
            "bookingLoading"
          );

        const container =
          document.getElementById(
            "bookingLinks"
          );

        if (loading) {
          loading.style.display =
            "none";
        }

        if (container) {
          container.innerHTML =
            `
            <p class="booking-empty">
              ${escapeHtml(
                error.message
              )}
            </p>
            `;
        }
      }
    );
}

function setupBookingButtons() {
  document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-book-hotel]"
        );

      if (button) {
        openBookingModal(
          button.dataset
            .bookHotel,
          button.dataset
            .bookLocation
        );

        return;
      }

      if (
        event.target.closest(
          "[data-close-booking]"
        )
      ) {
        closeBookingModal();
      }
    }
  );
}

/* ---------------------------------------------------------
   SETUP
--------------------------------------------------------- */

function setup() {
  setDefaultDates();

  if (
    $("onlyBenefits")
  ) {
    $("onlyBenefits")
      .checked = false;
  }

  if (
    $("onlyOffers")
  ) {
    $("onlyOffers")
      .checked = false;
  }

  $("searchButton")
    ?.addEventListener(
      "click",
      searchLive
    );

  $("sort")
    ?.addEventListener(
      "change",
      event => {
        state.sort =
          event.target.value;

        render();
      }
    );

  document
    .querySelectorAll(
      ".filter"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            document
              .querySelectorAll(
                ".filter"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "active"
                  )
              );

            button.classList.add(
              "active"
            );

            state.chain =
              button.dataset
                .chain ||
              "all";

            render();
          }
        );
      }
    );

  $("openFilters")
    ?.addEventListener(
      "click",
      () => {
        $("filterDrawer")
          ?.classList.add(
            "open"
          );

        $("filterDrawer")
          ?.setAttribute(
            "aria-hidden",
            "false"
          );
      }
    );

  $("closeFilters")
    ?.addEventListener(
      "click",
      () => {
        $("filterDrawer")
          ?.classList.remove(
            "open"
          );

        $("filterDrawer")
          ?.setAttribute(
            "aria-hidden",
            "true"
          );
      }
    );

  document
    .querySelectorAll(
      'input.program-filter, input[data-filter="program"]'
    )
    .forEach(
      input => {
        input.addEventListener(
          "change",
          () => {
            if (
              input.checked
            ) {
              state.activePrograms.add(
                input.value
              );
            } else {
              state.activePrograms.delete(
                input.value
              );
            }

            updateFilterCount();
            render();
          }
        );
      }
    );

  document
    .querySelectorAll(
      'input.amenity-filter, input[data-filter="amenity"]'
    )
    .forEach(
      input => {
        input.addEventListener(
          "change",
          () => {
            if (
              input.checked
            ) {
              state.amenities.add(
                input.value
              );
            } else {
              state.amenities.delete(
                input.value
              );
            }

            updateFilterCount();
            render();
          }
        );
      }
    );

  $("onlyBenefits")
    ?.addEventListener(
      "change",
      () => {
        updateFilterCount();
        render();
      }
    );

  $("onlyOffers")
    ?.addEventListener(
      "change",
      () => {
        updateFilterCount();
        render();
      }
    );

  $("applyFilters")
    ?.addEventListener(
      "click",
      () => {
        render();

        $("filterDrawer")
          ?.classList.remove(
            "open"
          );

        $("filterDrawer")
          ?.setAttribute(
            "aria-hidden",
            "true"
          );
      }
    );

  $("resetFilters")
    ?.addEventListener(
      "click",
      () => {
        document
          .querySelectorAll(
            'input.program-filter, input.amenity-filter, input[data-filter="program"], input[data-filter="amenity"]'
          )
          .forEach(
            input => {
              input.checked =
                false;
            }
          );

        if (
          $("onlyBenefits")
        ) {
          $("onlyBenefits")
            .checked =
            false;
        }

        if (
          $("onlyOffers")
        ) {
          $("onlyOffers")
            .checked =
            false;
        }

        state.chain =
          "all";

        state.activePrograms
          .clear();

        state.amenities
          .clear();

        document
          .querySelectorAll(
            ".filter"
          )
          .forEach(
            button =>
              button.classList.remove(
                "active"
              )
          );

        updateFilterCount();
        render();
      }
    );

  $("addAmex")
    ?.addEventListener(
      "click",
      () => {
        amexOffers.push({
          name: "",
          spend: 0,
          credit: 0
        });

        buildAmexFields();
      }
    );

  setupBookingButtons();

  buildStatusFields();
  buildPointsFields();
  buildAmexFields();
  updateFilterCount();

  render();
}

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    setup
  );
} else {
  setup();
}
