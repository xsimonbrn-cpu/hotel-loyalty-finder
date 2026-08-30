const API_URL = "/api/hotels";

/* =========================================================
   LOYALTY PROGRAMS
========================================================= */

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
  "Hilton Honors":
    "Gold",

  "Marriott Bonvoy":
    "Platinum Elite",

  "IHG One Rewards":
    "Club Member",

  "ALL - Accor Live Limitless":
    "Silver",

  "Radisson Rewards":
    "Premium",

  "MeliáRewards":
    "Gold",

  "GHA DISCOVERY":
    "Gold",

  "Wyndham Rewards":
    "Gold",

  "WorldHotels Rewards":
    "Gold",

  "Best Western Rewards":
    "Gold"
};

const PERSONAL_POINTS =
  Object.fromEntries(
    Object.keys(
      LOYALTY_PROGRAMS
    ).map(
      program => [
        program,
        0
      ]
    )
  );

let amexOffers = [
  {
    name:
      "WorldHotels",
    spend:
      250,
    credit:
      50
  }
];

/* =========================================================
   BENEFITS
========================================================= */

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

/* =========================================================
   HOTEL BRAND CLASSIFICATION
========================================================= */

const PROGRAM_ALIASES = [

  /* HILTON */

  ["waldorf astoria", "Hilton", "Waldorf Astoria", "Hilton Honors"],
  ["conrad", "Hilton", "Conrad", "Hilton Honors"],
  ["doubletree", "Hilton", "DoubleTree", "Hilton Honors"],
  ["hilton garden inn", "Hilton", "Hilton Garden Inn", "Hilton Honors"],
  ["hampton inn", "Hilton", "Hampton", "Hilton Honors"],
  ["hampton", "Hilton", "Hampton", "Hilton Honors"],
  ["embassy suites", "Hilton", "Embassy Suites", "Hilton Honors"],
  ["canopy by hilton", "Hilton", "Canopy", "Hilton Honors"],
  ["canopy", "Hilton", "Canopy", "Hilton Honors"],
  ["curio collection", "Hilton", "Curio Collection", "Hilton Honors"],
  ["curio", "Hilton", "Curio", "Hilton Honors"],
  ["tapestry collection", "Hilton", "Tapestry Collection", "Hilton Honors"],
  ["tapestry", "Hilton", "Tapestry", "Hilton Honors"],
  ["homewood suites", "Hilton", "Homewood Suites", "Hilton Honors"],
  ["home2 suites", "Hilton", "Home2 Suites", "Hilton Honors"],
  ["livsmart studios", "Hilton", "LivSmart Studios", "Hilton Honors"],
  ["hilton", "Hilton", "Hilton Hotels", "Hilton Honors"],

  /* MARRIOTT */

  ["ritz carlton", "Marriott", "The Ritz-Carlton", "Marriott Bonvoy"],
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

  /* IHG */

  ["intercontinental", "IHG", "InterContinental", "IHG One Rewards"],
  ["six senses", "IHG", "Six Senses", "IHG One Rewards"],
  ["regent", "IHG", "Regent", "IHG One Rewards"],
  ["kimpton", "IHG", "Kimpton", "IHG One Rewards"],
  ["vignette collection", "IHG", "Vignette Collection", "IHG One Rewards"],
  ["hotel indigo", "IHG", "Hotel Indigo", "IHG One Rewards"],
  ["crowne plaza", "IHG", "Crowne Plaza", "IHG One Rewards"],
  ["holiday inn express", "IHG", "Holiday Inn Express", "IHG One Rewards"],
  ["holiday inn resort", "IHG", "Holiday Inn Resort", "IHG One Rewards"],
  ["holiday inn", "IHG", "Holiday Inn", "IHG One Rewards"],
  ["voco", "IHG", "voco", "IHG One Rewards"],
  ["avid hotel", "IHG", "avid hotels", "IHG One Rewards"],
  ["staybridge suites", "IHG", "Staybridge Suites", "IHG One Rewards"],
  ["candlewood suites", "IHG", "Candlewood Suites", "IHG One Rewards"],

  /* ACCOR */

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
  ["ibis styles", "Accor", "ibis Styles", "ALL - Accor Live Limitless"],
  ["ibis budget", "Accor", "ibis budget", "ALL - Accor Live Limitless"],
  ["ibis", "Accor", "ibis", "ALL - Accor Live Limitless"],

  /* RADISSON */

  ["radisson collection", "Radisson", "Radisson Collection", "Radisson Rewards"],
  ["radisson blu", "Radisson", "Radisson Blu", "Radisson Rewards"],
  ["radisson red", "Radisson", "Radisson RED", "Radisson Rewards"],
  ["park plaza", "Radisson", "Park Plaza", "Radisson Rewards"],
  ["park inn by radisson", "Radisson", "Park Inn by Radisson", "Radisson Rewards"],
  ["park inn", "Radisson", "Park Inn by Radisson", "Radisson Rewards"],
  ["radisson", "Radisson", "Radisson", "Radisson Rewards"],

  /* MELIÁ */

  ["gran melia", "Meliá", "Gran Meliá", "MeliáRewards"],
  ["me by melia", "Meliá", "ME by Meliá", "MeliáRewards"],
  ["innside", "Meliá", "INNSiDE", "MeliáRewards"],
  ["paradisus", "Meliá", "Paradisus", "MeliáRewards"],
  ["zel", "Meliá", "Zel", "MeliáRewards"],
  ["melia", "Meliá", "Meliá", "MeliáRewards"],

  /* GHA */

  ["kempinski", "GHA", "Kempinski", "GHA DISCOVERY"],
  ["nh collection", "GHA", "NH Collection", "GHA DISCOVERY"],
  ["nh hotels", "GHA", "NH Hotels", "GHA DISCOVERY"],
  ["anantara", "GHA", "Anantara", "GHA DISCOVERY"],
  ["capella", "GHA", "Capella", "GHA DISCOVERY"],
  ["tivoli", "GHA", "Tivoli", "GHA DISCOVERY"],
  ["avani", "GHA", "Avani", "GHA DISCOVERY"],
  ["viceroy", "GHA", "Viceroy", "GHA DISCOVERY"],

  /* WYNDHAM */

  ["wyndham grand", "Wyndham", "Wyndham Grand", "Wyndham Rewards"],
  ["wyndham", "Wyndham", "Wyndham", "Wyndham Rewards"],
  ["ramada encore", "Wyndham", "Ramada Encore", "Wyndham Rewards"],
  ["ramada", "Wyndham", "Ramada", "Wyndham Rewards"],
  ["days inn", "Wyndham", "Days Inn", "Wyndham Rewards"],
  ["super 8", "Wyndham", "Super 8", "Wyndham Rewards"],
  ["la quinta", "Wyndham", "La Quinta", "Wyndham Rewards"],

  /* WORLDHOTELS */

  ["worldhotels", "WorldHotels", "WorldHotels", "WorldHotels Rewards"],

  /* BEST WESTERN */

  ["best western premier", "Best Western", "Best Western Premier", "Best Western Rewards"],
  ["best western plus", "Best Western", "Best Western Plus", "Best Western Rewards"],
  ["best western", "Best Western", "Best Western", "Best Western Rewards"]
];

/* =========================================================
   AMENITY ICONS
========================================================= */

const AMENITY_ICON = {
  Pool: "○",
  Sauna: "⌁",
  Spa: "◇",
  Fitness: "+",
  Breakfast: "□",
  Parking: "P",
  Restaurant: "≡",
  Bar: "•"
};

/* =========================================================
   STATE
========================================================= */

const state = {
  chain: "all",
  activePrograms: new Set(),
  amenities: new Set(),
  stars: new Set(),
  compare: new Set(),
  cityCoords: null,
  sort: "effective"
};

let liveHotels = [];

let searchPerformed =
  false;

let lastSearchMeta = {
  totalCount: 0,
  pagesFetched: 0
};

const $ =
  id =>
    document.getElementById(id);

/* =========================================================
   DATE
========================================================= */

function localDateString(
  date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function setDefaultDates(
  force = true
) {
  const today =
    new Date();

  const tomorrow =
    new Date(today);

  tomorrow.setDate(
    today.getDate() + 1
  );

  const checkIn =
    localDateString(
      today
    );

  const checkOut =
    localDateString(
      tomorrow
    );

  if (
    force ||
    !$("checkIn")?.value
  ) {
    if ($("checkIn")) {
      $("checkIn").value =
        checkIn;
    }
  }

  if (
    force ||
    !$("checkOut")?.value
  ) {
    if ($("checkOut")) {
      $("checkOut").value =
        checkOut;
    }
  }
}

function nights() {
  const checkIn =
    $("checkIn")?.value;

  const checkOut =
    $("checkOut")?.value;

  if (
    !checkIn ||
    !checkOut
  ) {
    return 1;
  }

  const a =
    new Date(
      `${checkIn}T00:00:00`
    );

  const b =
    new Date(
      `${checkOut}T00:00:00`
    );

  const diff =
    Math.round(
      (
        b.getTime() -
        a.getTime()
      ) / 86400000
    );

  return Math.max(
    diff,
    1
  );
}

function formatDate(
  value
) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(
    new Date(
      `${value}T00:00:00`
    )
  );
}

/* =========================================================
   HELPERS
========================================================= */

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
    return Number.isFinite(
      value
    )
      ? value
      : null;
  }

  if (
    typeof value === "object"
  ) {
    return number(
      value.extracted_lowest ??
      value.extracted_price ??
      value.extracted_total ??
      value.price ??
      value.total ??
      value.value ??
      null
    );
  }

  let text =
    String(value)
      .replace(
        /[^\d.,-]/g,
        ""
      )
      .trim();

  if (!text) {
    return null;
  }

  if (
    text.includes(",") &&
    text.includes(".")
  ) {
    if (
      text.lastIndexOf(",") >
      text.lastIndexOf(".")
    ) {
      text =
        text
          .replace(
            /\./g,
            ""
          )
          .replace(
            ",",
            "."
          );
    } else {
      text =
        text.replace(
          /,/g,
          ""
        );
    }
  } else if (
    text.includes(",")
  ) {
    const parts =
      text.split(",");

    if (
      parts.length === 2 &&
      parts[1].length <= 2
    ) {
      text =
        text.replace(
          ",",
          "."
        );
    } else {
      text =
        text.replace(
          /,/g,
          ""
        );
    }
  }

  const parsed =
    Number(text);

  return Number.isFinite(
    parsed
  )
    ? parsed
    : null;
}

function first(
  obj,
  keys
) {
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

function escapeHtml(
  value
) {
  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

/* =========================================================
   API EXTRACTION
========================================================= */

function extractHotels(
  payload
) {
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

/* =========================================================
   AMENITIES
========================================================= */

function canonicalAmenity(
  value
) {
  const text =
    String(value || "")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .trim();

  if (
    /pool|swimming|indoor pool|outdoor pool|infinity pool/.test(
      text
    )
  ) {
    return "Pool";
  }

  if (
    /spa|wellness|wellness centre|wellness center|massage|thermal/.test(
      text
    )
  ) {
    return "Spa";
  }

  if (
    /sauna|steam room|steam bath|hammam|hamam|infrared/.test(
      text
    )
  ) {
    return "Sauna";
  }

  if (
    /fitness|gym|fitness centre|fitness center|workout/.test(
      text
    )
  ) {
    return "Fitness";
  }

  if (
    /breakfast|continental breakfast|buffet breakfast/.test(
      text
    )
  ) {
    return "Breakfast";
  }

  if (
    /parking|car park|garage|valet parking|private parking/.test(
      text
    )
  ) {
    return "Parking";
  }

  if (
    /restaurant|dining|dining room/.test(
      text
    )
  ) {
    return "Restaurant";
  }

  if (
    /\bbar\b|cocktail bar|lounge bar/.test(
      text
    )
  ) {
    return "Bar";
  }

  return null;
}

function normalizeAmenities(
  hotel
) {
  const raw =
    first(
      hotel,
      [
        "amenities",
        "facilities",
        "amenity"
      ]
    ) || [];

  const values = [];

  if (
    Array.isArray(raw)
  ) {
    for (
      const item of raw
    ) {
      if (
        typeof item ===
        "string"
      ) {
        values.push(
          item
        );
      } else if (
        item &&
        typeof item ===
        "object"
      ) {
        const value =
          first(
            item,
            [
              "name",
              "label",
              "title",
              "text"
            ]
          );

        if (value) {
          values.push(
            value
          );
        }
      }
    }
  } else if (
    typeof raw ===
    "string"
  ) {
    values.push(
      ...raw.split(
        /[,;|]/
      )
    );
  }

  const text = [
    hotel?.description,
    hotel?.amenities_text,
    hotel?.hotel_amenities,
    hotel?.facilities_text
  ]
    .filter(Boolean)
    .join(" ");

  values.push(text);

  const result = [];

  for (
    const value of
    values.filter(Boolean)
  ) {
    const amenity =
      canonicalAmenity(
        value
      );

    if (amenity) {
      result.push(
        amenity
      );
    }
  }

  return [
    ...new Set(result)
  ];
}

/* =========================================================
   HOTEL NORMALIZATION
========================================================= */

function normalizeHotel(
  hotel
) {
  const price =
    hotel?.price || {};

  let nightly =
    number(
      price?.price_per_night ??
      price?.current ??
      price?.nightly ??
      null
    );

  let total =
    number(
      price?.total_price ??
      price?.total ??
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

  let image =
    null;

  for (
    const item of images
  ) {
    if (
      typeof item ===
      "string" &&
      item.trim()
    ) {
      image =
        item.trim();

      break;
    }

    if (
      item &&
      typeof item ===
      "object"
    ) {
      image =
        first(
          item,
          [
            "original_image",
            "original",
            "image",
            "image_url",
            "url",
            "src",
            "thumbnail"
          ]
        );

      if (image) {
        break;
      }
    }
  }

  if (!image) {
    image =
      first(
        hotel,
        [
          "thumbnail",
          "image",
          "image_url",
          "original_image",
          "thumbnail_url"
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
      hotel?.ratings_count ??
      null
    );

  let stars =
    number(
      hotel?.stars ??
      hotel?.hotel_class ??
      hotel?.extracted_hotel_class ??
      null
    );

  if (
    stars == null &&
    typeof hotel?.hotel_class ===
    "string"
  ) {
    const match =
      hotel.hotel_class.match(
        /([1-5])/
      );

    if (match) {
      stars =
        Number(
          match[1]
        );
    }
  }

  const address =
    hotel?.location?.address ??
    hotel?.address ??
    null;

  return {
    raw:
      hotel,

    id:
      hotel?.hotel_id ??
      hotel?.property_token ??
      hotel?.place_id ??
      hotel?.id ??
      null,

    name:
      String(
        hotel?.name ??
        hotel?.hotel_name ??
        hotel?.title ??
        "Unnamed hotel"
      ),

    brand:
      hotel?.brand ??
      hotel?.brand_name ??
      hotel?.chain ??
      hotel?.chain_name ??
      null,

    chain:
      hotel?.chain ??
      hotel?.chain_name ??
      hotel?.brand ??
      hotel?.brand_name ??
      null,

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

    address,

    latitude:
      hotel?.location?.latitude ??
      hotel?.latitude ??
      null,

    longitude:
      hotel?.location?.longitude ??
      hotel?.longitude ??
      null,

    /*
      NEW:
      official hotel website.
    */
    official_url:
      hotel?.official_url ??
      hotel?.hotel_url ??
      null,

    /*
      Booking/provider URL.
    */
    booking_url:
      hotel?.booking_url ??
      null,

    /*
      Backwards-compatible URL.
    */
    url:
      hotel?.official_url ??
      hotel?.hotel_url ??
      hotel?.booking_url ??
      hotel?.url ??
      hotel?.link ??
      null,

    property_token:
      hotel?.property_token ??
      null
  };
}

/* =========================================================
   BRAND NORMALIZATION
========================================================= */

function normalizeBrandText(
  value
) {
  return String(value || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[’']/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      " "
    )
    .trim();
}

function classifyHotel(
  name,
  brand = "",
  chain = ""
) {
  const text =
    normalizeBrandText(
      `${name} ${brand} ${chain}`
    );

  /*
    Longest / most specific
    matches first.
  */
  const aliases =
    [...PROGRAM_ALIASES]
      .sort(
        (a, b) =>
          normalizeBrandText(
            b[0]
          ).length -
          normalizeBrandText(
            a[0]
          ).length
      );

  for (
    const [
      needle,
      chainName,
      brandName,
      program
    ] of aliases
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
        chain:
          chainName,

        brand:
          brandName,

        program
      };
    }
  }

  return {
    chain:
      "Other",

    brand:
      brand ||
      "Other",

    program:
      null
  };
}

/* =========================================================
   FILTER MATCHING
========================================================= */

function matchesChainFilter(
  hotel,
  selectedChain
) {
  if (
    !selectedChain ||
    selectedChain ===
      "all"
  ) {
    return true;
  }

  const cls =
    classifyHotel(
      hotel.name,
      hotel.brand,
      hotel.chain
    );

  /*
    IMPORTANT:
    We compare the classified
    parent chain, not the raw
    SerpApi chain.
  */

  return (
    cls.chain ===
    selectedChain
  );
}

/* =========================================================
   BENEFITS / AMEX
========================================================= */

function benefitsFor(
  program
) {
  const status =
    PERSONAL_STATUS[
      program
    ];

  return (
    STATUS_BENEFITS[
      program
    ]?.[status] ||
    []
  );
}

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
          Number(
            b.credit || 0
          ) -
          Number(
            a.credit || 0
          )
      )[0] ||
    null
  );
}

function enrich(
  hotel
) {
  const cls =
    classifyHotel(
      hotel.name,
      hotel.brand,
      hotel.chain
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
      ? PERSONAL_STATUS[
          program
        ] || "Member"
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

  const loyaltyPoints =
    program && Number.isFinite(Number(PERSONAL_POINTS?.[program]))
      ? Number(PERSONAL_POINTS[program])
      : null;

  const distance =
    state.cityCoords
      ? distanceKm(
          state.cityCoords.latitude,
          state.cityCoords.longitude,
          hotel.latitude,
          hotel.longitude
        )
      : null;

  return {
    ...hotel,

    ...cls,

    status,

    loyaltyPoints,

    distanceKm: distance,

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

/* =========================================================
   SEARCH
========================================================= */

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
        ?.value ||
      2
    );

  if (!city) {
    alert(
      "Please enter a city."
    );

    $("city")?.focus();

    return;
  }

  if (
    !checkIn ||
    !checkOut ||
    checkOut <= checkIn
  ) {
    alert(
      "Please choose a valid check-in and check-out date."
    );

    return;
  }

  if (
    !Number.isFinite(
      guests
    ) ||
    guests < 1
  ) {
    alert(
      "Please enter at least 1 guest."
    );

    return;
  }

  // Resolve the requested city once so hotel cards can show real distances.
  state.cityCoords = null;
  try {
    const geo = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(city)}`, { headers: { "Accept-Language": "en" } });
    if (geo.ok) {
      const places = await geo.json();
      if (places[0]) state.cityCoords = { latitude: Number(places[0].lat), longitude: Number(places[0].lon) };
    }
  } catch (error) {
    console.warn("City geocoding unavailable:", error);
  }

  const params =
    new URLSearchParams({
      location:
        city,

      check_in:
        checkIn,

      check_out:
        checkOut,

      adults:
        String(guests),

      currency:
        "EUR",

      pages:
        "5"
    });

  const button =
    $("searchButton");

  if (button) {
    button.disabled =
      true;

    button.dataset.originalText =
      button.textContent;

    button.textContent =
      "Searching…";
  }

  try {
    const response =
      await fetch(
        `${API_URL}?${params.toString()}`,
        {
          method:
            "GET",

          headers: {
            Accept:
              "application/json"
          }
        }
      );

    const text =
      await response.text();

    let payload;

    try {
      payload =
        JSON.parse(text);
    } catch {
      throw new Error(
        `API returned ${response.status}, not JSON.`
      );
    }

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
      button.disabled =
        false;

      button.textContent =
        button.dataset.originalText ||
        "Search";
    }
  }
}

/* =========================================================
   AMENITY CHIP
========================================================= */

function amenityChip(
  name
) {
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

/* =========================================================
   FILTER STATE
========================================================= */

const PROGRAM_FILTER_MAP = {
  Hilton: "Hilton Honors",
  Marriott: "Marriott Bonvoy",
  IHG: "IHG One Rewards",
  Accor: "ALL - Accor Live Limitless",
  Radisson: "Radisson Rewards",
  "Meliá": "MeliáRewards",
  GHA: "GHA DISCOVERY",
  Wyndham: "Wyndham Rewards",
  WorldHotels: "WorldHotels Rewards",
  "Best Western": "Best Western Rewards"
};

function selectedProgramFilters() {
  return new Set(
    [
      ...document.querySelectorAll(
        'input.program-filter:checked, input[data-filter="program"]:checked'
      )
    ].map(
      input =>
        PROGRAM_FILTER_MAP[input.value] || input.value
    )
  );
}

function selectedAmenityFilters() {
  return new Set(
    [
      ...document.querySelectorAll(
        'input.amenity-filter:checked, input[data-filter="amenity"]:checked, input[data-type="amenity"]:checked'
      )
    ].map(
      input =>
        input.value
    )
  );
}

function selectedStarFilters() {
  return new Set(
    [...document.querySelectorAll('input[data-filter="stars"]:checked')].map(input => Number(input.value))
  );
}

function distanceKm(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some(v => v == null || !Number.isFinite(Number(v)))) return null;
  const toRad = value => Number(value) * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function benefitScore(benefit) {
  const text = String(benefit || '').toLowerCase();
  if (/breakfast|f&b credit|food.*beverage/.test(text)) return 100;
  if (/lounge/.test(text)) return 90;
  if (/early check|late check|check-out|check out/.test(text)) return 80;
  if (/upgrade|suite night/.test(text)) return 70;
  if (/welcome|amenity|gift|drink/.test(text)) return 60;
  return 20;
}

function topBenefits(benefits) {
  return [...(benefits || [])].sort((a,b) => benefitScore(b) - benefitScore(a)).slice(0, 4);
}

/* =========================================================
   RENDER
========================================================= */

function render() {
  const n =
    nights();

  let hotels =
    liveHotels.map(
      enrich
    );

  /* CHAIN FILTER */

  if (
    state.chain !==
    "all"
  ) {
    hotels =
      hotels.filter(
        hotel =>
          matchesChainFilter(
            hotel,
            state.chain
          )
      );
  }

  /* LOYALTY FILTER */

  const activePrograms =
    selectedProgramFilters();

  if (
    activePrograms.size
  ) {
    hotels =
      hotels.filter(
        hotel =>
          hotel.program &&
          activePrograms.has(
            hotel.program
          )
      );
  }

  /* AMENITY FILTER */

  const activeAmenities =
    selectedAmenityFilters();

  if (
    activeAmenities.size
  ) {
    hotels =
      hotels.filter(
        hotel => {
          const available =
            new Set(
              (
                hotel.amenities ||
                []
              ).map(
                amenity =>
                  String(
                    amenity
                  )
              )
            );

          return [
            ...activeAmenities
          ].every(
            required =>
              available.has(
                required
              )
          );
        }
      );
  }

  /* STAR FILTER — actual hotel classification */

  const activeStars = selectedStarFilters();

  if (activeStars.size) {
    hotels = hotels.filter(hotel => hotel.stars != null && activeStars.has(Math.round(Number(hotel.stars))));
  }

  /* BENEFITS */

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

  /* OFFERS */

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
            : 0) +
          (a.amexTriggered
            ? 0.3
            : 0);

        const valueB =
          (b.rating || 0) +
          b.benefits.length *
            0.15 +
          (b.promotion
            ? 0.2
            : 0) +
          (b.amexTriggered
            ? 0.3
            : 0);

        return (
          valueB -
          valueA
        );
      }
    );
  }

  /* TITLE */

  if (
    $("resultTitle")
  ) {
    $("resultTitle")
      .textContent =
      `Hotels in ${
        $("city")
          ?.value
          .trim() ||
        "your city"
      }`;
  }

  /* BEFORE SEARCH */

  if (
    !searchPerformed
  ) {
    if (
      $("resultMeta")
    ) {
      $("resultMeta")
        .textContent =
        "Choose your dates and search for live hotels.";
    }

    if (
      $("results")
    ) {
      $("results")
        .innerHTML =
        "";
    }

    if (
      $("emptyState")
    ) {
      $("emptyState")
        .style.display =
        "block";
    }

    updateFilterCount();

    return;
  }

  const apiFound =
    Number(
      lastSearchMeta.totalCount ||
      hotels.length
    );

  if (
    $("resultMeta")
  ) {
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
      ` · ${n} night${
        n === 1
          ? ""
          : "s"
      }` +
      ` · ${
        $("guests")
          ?.value ||
        2
      } guests` +
      ` · Live Google Hotels`;
  }

  /* EMPTY */

  if (
    !hotels.length
  ) {
    if (
      $("results")
    ) {
      $("results")
        .innerHTML =
        "";
    }

    if (
      $("emptyState")
    ) {
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

  if (
    $("emptyState")
  ) {
    $("emptyState")
      .style.display =
      "none";
  }

  if (
    !$("results")
  ) {
    updateFilterCount();

    return;
  }

  /* CARDS */

  $("results")
    .innerHTML =
    hotels
      .map(
        hotel => {
          const benefits =
            hotel.benefits ||
            [];

          const selectedBenefits =
            topBenefits(benefits)
              .map(
                benefit =>
                  `
                  <span>
                    ${escapeHtml(
                      benefit
                    )}
                  </span>
                  `
              )
              .join("");

          const offerChip =
            hotel.amexTriggered
              ? `
                <span>
                  AMEX · -€${Math.round(
                    hotel.amexCredit
                  )}
                </span>
              `
              : "";

          const promoChip =
            hotel.promotion
              ? `
                <span>
                  20% personal promotion
                </span>
              `
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
                  □
                </div>
              `;

          const rating =
            hotel.rating != null
              ? `
                Rating ${hotel.rating.toFixed(
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
                    Math.round(
                      hotel.stars
                    ),
                    5
                  )
                )
              : "";

          /*
            DIRECT HOTEL WEBSITE
          */

          const officialWebsite =
            hotel.official_url
              ? `
                <a
                  class="view-button hotel-website-button"
                  href="${escapeHtml(
                    hotel.official_url
                  )}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hotel website  ↗
                </a>
              `
              : "";

          /*
            HOTEL LINKS
          */

          const booking =
            `
              <button
                class="view-button booking-button"
                type="button"
                data-book-hotel="${escapeHtml(
                  hotel.name
                )}"
                data-book-location="${escapeHtml(
                  $("city")
                    ?.value ||
                  ""
                )}"
                data-book-url="${escapeHtml(
                  hotel.booking_url ||
                  ""
                )}"
              >
                Booking options
              </button>
            `;

          return `
            <article
              class="hotel"
            >

              ${image}

              <div
                class="hotel-main"
              >

                <h3
                  class="hotel-name"
                >
                  ${escapeHtml(
                    hotel.name
                  )}
                </h3>

                <p
                  class="hotel-brand"
                >
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

                <div
                  class="hotel-meta"
                >

                  ${
                    rating
                      ? `<span>${rating}</span>`
                      : ""
                  }

                  ${
                    stars
                      ? `
                        <span
                          class="hotel-stars"
                        >
                          ${stars}
                        </span>
                      `
                      : ""
                  }

                  ${
                    hotel.address
                      ? `
                        <span class="hotel-location">
                          ${escapeHtml(hotel.address)}
                        </span>
                      `
                      : ""
                  }

                  ${
                    hotel.distanceKm != null
                      ? `<span>${hotel.distanceKm < 10 ? hotel.distanceKm.toFixed(1) : Math.round(hotel.distanceKm)} km from city centre</span>`
                      : ""
                  }

                </div>

                ${
                  hotel.program && hotel.loyaltyPoints != null && hotel.loyaltyPoints > 0
                    ? `<div class="loyalty-line"><span class="loyalty-badge"><strong>${escapeHtml(hotel.program)}</strong> · <span class="loyalty-points">${hotel.loyaltyPoints.toLocaleString("en-GB")} points</span></span></div>`
                    : ""
                }

                <div
                  class="hotel-amenities"
                >
                  ${
                    (
                      hotel.amenities ||
                      []
                    )
                      .slice(
                        0,
                        8
                      )
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
                      <div
                        class="special"
                      >
                        ${selectedBenefits}
                        ${promoChip}
                        ${offerChip}
                      </div>
                    `
                    : ""
                }

              </div>

              <div
                class="hotel-price"
              >

                <div>

                  <div
                    class="price-label"
                  >
                    Effective stay
                  </div>

                  <div
                    class="price-source"
                  >
                    Live Google Hotels price
                  </div>

                  <div
                    class="effective"
                  >
                    €${Math.round(
                      hotel.effective
                    )}
                  </div>

                  <div
                    class="nightly"
                  >
                    €${Math.round(
                      hotel.effectiveNightly
                    )}
                    / night
                  </div>

                  <div
                    class="price-detail"
                  >
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
                        ? `
                          <br>
                          Personal promotion:
                          -20%
                        `
                        : ""
                    }

                    ${
                      hotel.amexTriggered
                        ? `
                          <br>
                          AMEX credit:
                          -€${Math.round(
                            hotel.amexCredit
                          )}
                        `
                        : ""
                    }
                  </div>

                </div>

                <div
                  class="hotel-actions"
                >

                  <button class="view-button compare-button ${state.compare.has(hotel.id) ? "selected" : ""}" type="button" data-compare-id="${escapeHtml(String(hotel.id || ""))}">
                    ${state.compare.has(hotel.id) ? "✓ In compare" : "Compare"}
                  </button>

                  ${officialWebsite}

                  ${booking}

                </div>

              </div>

            </article>
          `;
        }
      )
      .join("");

  const compareBar = $("compareBar");
  const compareCount = $("compareCount");
  if (compareBar && compareCount) {
    compareBar.hidden = state.compare.size === 0;
    compareCount.textContent = `${state.compare.size} selected`;
  }

  updateFilterCount();
}

/* =========================================================
   FILTER COUNT
========================================================= */

function updateFilterCount() {
  const programChecks =
    document.querySelectorAll(
      'input.program-filter:checked, input[data-filter="program"]:checked'
    ).length;

  const amenityChecks =
    document.querySelectorAll(
      'input.amenity-filter:checked, input[data-filter="amenity"]:checked, input[data-type="amenity"]:checked'
    ).length;

  const starChecks = document.querySelectorAll('input[data-filter="stars"]:checked').length;

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
    starChecks +
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

/* =========================================================
   STATUS FIELDS
========================================================= */

function buildStatusFields() {
  const container =
    $("statusFields");

  if (!container) {
    return;
  }

  container.innerHTML =
    Object.entries(
      LOYALTY_PROGRAMS
    )
      .map(
        (
          [
            program,
            statuses
          ]
        ) => `
          <div
            class="status-row"
          >

            <span
              class="status-name"
            >
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
                  status => `
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

/* =========================================================
   POINTS
========================================================= */

function buildPointsFields() {
  const container =
    $("pointsFields");

  if (!container) {
    return;
  }

  container.innerHTML =
    Object.keys(
      LOYALTY_PROGRAMS
    )
      .map(
        program => `
          <div
            class="status-row"
          >

            <span
              class="status-name"
            >
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

/* =========================================================
   AMEX
========================================================= */

function buildAmexFields() {
  const container =
    $("amexFields");

  if (!container) {
    return;
  }

  container.innerHTML =
    amexOffers
      .map(
        (
          offer,
          index
        ) => `
          <div
            class="amex-row"
          >

            <input
              value="${escapeHtml(
                offer.name ||
                ""
              )}"
              placeholder="Hotel / chain"
              data-amex-name="${index}"
            >

            <input
              type="number"
              min="0"
              step="10"
              value="${Number(
                offer.spend ||
                0
              )}"
              placeholder="Spend"
              data-amex-spend="${index}"
            >

            <input
              type="number"
              min="0"
              step="5"
              value="${Number(
                offer.credit ||
                0
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
            const index =
              Number(
                element.dataset
                  .amexName
              );

            if (
              amexOffers[
                index
              ]
            ) {
              amexOffers[
                index
              ].name =
                element.value;
            }

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
            const index =
              Number(
                element.dataset
                  .amexSpend
              );

            if (
              amexOffers[
                index
              ]
            ) {
              amexOffers[
                index
              ].spend =
                Number(
                  element.value
                ) || 0;
            }

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
            const index =
              Number(
                element.dataset
                  .amexCredit
              );

            if (
              amexOffers[
                index
              ]
            ) {
              amexOffers[
                index
              ].credit =
                Number(
                  element.value
                ) || 0;
            }

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

/* =========================================================
   BOOKING MODAL
========================================================= */

function closeBookingModal() {
  document
    .getElementById(
      "bookingModal"
    )
    ?.remove();
}

function openBookingModal(
  hotelName,
  location,
  directUrl = ""
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

      <div
        class="booking-modal-head"
      >

        <div>

          <p
            class="eyebrow"
          >
            HOTEL LINKS
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

      ${
        directUrl
          ? `
            <div
              class="booking-links"
            >

              <a
                class="booking-link"
                href="${escapeHtml(
                  directUrl
                )}"
                target="_blank"
                rel="noopener noreferrer"
              >

                <span>
                  Booking provider
                </span>

                <span>
                  ↗
                </span>

              </a>

            </div>
          `
          : ""
      }

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

  if (directUrl) {
    const loading =
      document.getElementById(
        "bookingLoading"
      );

    if (loading) {
      loading.style.display =
        "none";
    }
  }

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
        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        if (
          !contentType.includes(
            "json"
          )
        ) {
          throw new Error(
            "Booking links API did not return JSON."
          );
        }

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

        if (!container) {
          return;
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
              /^https?:\/\//i.test(
                value
              )
          );

        if (!links.length) {
          if (!directUrl) {
            container.innerHTML = `
              <p
                class="booking-empty"
              >
                No booking platform links were returned.
              </p>
            `;
          }

          return;
        }

        container.innerHTML =
          links
            .map(
              (
                [key, value]
              ) => `
                <a
                  class="booking-link"
                  href="${escapeHtml(
                    value
                  )}"
                  target="_blank"
                  rel="noopener noreferrer"
                >

                  <span>
                    ${escapeHtml(
                      labels[
                        key
                      ] ||
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

        if (
          container &&
          !directUrl
        ) {
          container.innerHTML = `
            <p
              class="booking-empty"
            >
              ${escapeHtml(
                error.message
              )}
            </p>
          `;
        }
      }
    );
}

/* =========================================================
   BOOKING EVENTS
========================================================= */

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
            .bookLocation,

          button.dataset
            .bookUrl
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

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key ===
        "Escape"
      ) {
        closeBookingModal();
      }
    }
  );
}

/* =========================================================
   COMPARE
========================================================= */

function compareHotels() {
  const selected = [];
  for (const id of state.compare) {
    const hotel = liveHotels.map(enrich).find(h => String(h.id || "") === String(id));
    if (hotel) selected.push(hotel);
  }
  return selected;
}

function openCompare() {
  const hotels = compareHotels();
  if (hotels.length < 2) { alert("Select at least 2 hotels to compare."); return; }
  const modal = $("compareModal");
  const content = $("compareContent");
  if (!modal || !content) return;
  const rows = [
    ["Hotel", h => `<span class="compare-hotel-name">${escapeHtml(h.name)}</span>`],
    ["Classification", h => h.stars ? `${Math.round(h.stars)} stars` : "—"],
    ["Guest rating", h => h.rating != null ? `${h.rating.toFixed(1)}${h.reviewCount ? ` · ${h.reviewCount.toLocaleString("en-GB")} reviews` : ""}` : "—"],
    ["Loyalty", h => h.program ? `${escapeHtml(h.program)} · ${escapeHtml(h.status)}` : "—"],
    ["Personal points", h => h.loyaltyPoints > 0 ? `${h.loyaltyPoints.toLocaleString("en-GB")} points` : "—"],
    ["Distance", h => h.distanceKm != null ? `${h.distanceKm.toFixed(1)} km from city centre` : "—"],
    ["Top benefits", h => topBenefits(h.benefits).map(b => escapeHtml(b)).join("<br>") || "—"],
    ["Amenities", h => (h.amenities || []).join(" · ") || "—"],
    ["Effective stay", h => h.total != null ? `€${Math.round(h.effective)} · €${Math.round(h.effectiveNightly)}/night` : "—"]
  ];
  content.innerHTML = `<div class="compare-table-wrap"><table class="compare-table"><thead><tr><th>Compare</th>${hotels.map(h => `<th>${escapeHtml(h.name)}</th>`).join("")}</tr></thead><tbody>${rows.map(([label, fn]) => `<tr><th>${label}</th>${hotels.map(h => `<td>${fn(h)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><div id="compareMap" class="compare-map"></div>`;
  modal.hidden = false;
  renderCompareMap(hotels);
}

function closeCompare() { if ($("compareModal")) $("compareModal").hidden = true; }

function renderCompareMap(hotels) {
  const points = hotels.filter(h => Number.isFinite(Number(h.latitude)) && Number.isFinite(Number(h.longitude)));
  const el = $("compareMap");
  if (!el || !window.L || !points.length) { if (el) el.innerHTML = `<div class="muted" style="padding:18px">Map unavailable because hotel coordinates are not available.</div>`; return; }
  const map = L.map(el).setView([Number(points[0].latitude), Number(points[0].longitude)], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(map);
  const markers = points.map(h => L.marker([Number(h.latitude), Number(h.longitude)]).addTo(map).bindPopup(`<strong>${escapeHtml(h.name)}</strong>`));
  if (markers.length > 1) { const group = L.featureGroup(markers); map.fitBounds(group.getBounds().pad(0.18)); }
}

/* =========================================================
   SETUP
========================================================= */

function setup() {
  setDefaultDates(
    true
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

  const searchButton =
    $("searchButton");

  if (searchButton) {
    searchButton.addEventListener(
      "click",
      searchLive
    );
  }

  [
    "city",
    "checkIn",
    "checkOut",
    "guests"
  ].forEach(
    id => {
      $(id)?.addEventListener(
        "keydown",
        event => {
          if (
            event.key ===
            "Enter"
          ) {
            event.preventDefault();

            searchLive();
          }
        }
      );
    }
  );

  /* SORT */

  $("sort")?.addEventListener(
    "change",
    event => {
      state.sort =
        event.target.value ||
        "effective";

      render();
    }
  );

  /* CHAIN FILTERS */

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

  /* OPEN DRAWER */

  $("openFilters")?.addEventListener(
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

  /* CLOSE DRAWER */

  $("closeFilters")?.addEventListener(
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

  /* BACKDROP */

  $("filterDrawer")?.addEventListener(
    "click",
    event => {
      if (
        event.target ===
        $("filterDrawer")
      ) {
        $("filterDrawer")
          .classList.remove(
            "open"
          );

        $("filterDrawer")
          .setAttribute(
            "aria-hidden",
            "true"
          );
      }
    }
  );

  /* LOYALTY FILTERS */

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

  /* AMENITY FILTERS */

  document
    .querySelectorAll(
      'input.amenity-filter, input[data-filter="amenity"], input[data-type="amenity"]'
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

  /* STAR FILTERS */

  document.querySelectorAll('input[data-filter="stars"]').forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) state.stars.add(Number(input.value));
      else state.stars.delete(Number(input.value));
      updateFilterCount();
      render();
    });
  });

  /* COMPARE */

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-compare-id]");
    if (button) {
      const id = button.dataset.compareId;
      if (state.compare.has(id)) state.compare.delete(id);
      else if (state.compare.size < 3) state.compare.add(id);
      else { alert("You can compare up to 3 hotels."); return; }
      render();
      return;
    }

    if (event.target.closest("#clearCompare")) {
      state.compare.clear();
      render();
      return;
    }

    if (event.target.closest("#openCompare")) {
      openCompare();
      return;
    }

    if (event.target.closest("[data-close-compare]")) {
      closeCompare();
    }
  });

  /* BENEFITS */

  $("onlyBenefits")?.addEventListener(
    "change",
    () => {
      updateFilterCount();
      render();
    }
  );

  /* OFFERS */

  $("onlyOffers")?.addEventListener(
    "change",
    () => {
      updateFilterCount();
      render();
    }
  );

  /* APPLY */

  $("applyFilters")?.addEventListener(
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

  /* RESET */

  $("resetFilters")?.addEventListener(
    "click",
    () => {
      document
        .querySelectorAll(
          'input.program-filter, input.amenity-filter, input[data-filter="program"], input[data-filter="amenity"], input[data-type="amenity"], input[data-filter="stars"]'
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

      state.activePrograms.clear();

      state.amenities.clear();
      state.stars.clear();
      state.compare.clear();

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

      const allButton =
        document.querySelector(
          '.filter[data-chain="all"]'
        );

      allButton?.classList.add(
        "active"
      );

      updateFilterCount();

      render();
    }
  );

  /* ADD AMEX */

  $("addAmex")?.addEventListener(
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

/* =========================================================
   START
========================================================= */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    setup,
    {
      once: true
    }
  );
} else {
  setup();
}
