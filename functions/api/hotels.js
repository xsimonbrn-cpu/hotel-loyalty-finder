/*
Cloudflare Pages Function
functions/api/hotels.js

Hotel Loyalty Finder
Google Hotels via SerpApi

Required Cloudflare Secret:
SERPAPI_KEY

Features:
- Multiple Google Hotels pages
- More than 20 hotels
- Live prices
- Hotel images
- Ratings / reviews
- Amenities
- Hotel / brand information
- Booking links
- Cloudflare caching
*/

const SERPAPI_URL = "https://serpapi.com/search.json";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=900"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders()
  });
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function number(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "object") {
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

  const text = String(value)
    .replace(/[^\d.,-]/g, "")
    .trim();

  if (!text) return null;

  /*
  Handles:
  1234
  1,234
  1.234
  1234.50
  */

  let normalized = text;

  if (
    normalized.includes(",") &&
    normalized.includes(".")
  ) {
    if (
      normalized.lastIndexOf(",") >
      normalized.lastIndexOf(".")
    ) {
      normalized = normalized
        .replace(/\./g, "")
        .replace(",", ".");
    } else {
      normalized = normalized.replace(/,/g, "");
    }
  } else if (
    normalized.includes(",") &&
    !normalized.includes(".")
  ) {
    const parts = normalized.split(",");

    if (
      parts.length === 2 &&
      parts[1].length <= 2
    ) {
      normalized = normalized.replace(",", ".");
    } else {
      normalized = normalized.replace(/,/g, "");
    }
  } else if (
    normalized.includes(".") &&
    !normalized.includes(",")
  ) {
    const parts = normalized.split(".");

    if (
      parts.length === 2 &&
      parts[1].length === 3
    ) {
      normalized = normalized.replace(".", "");
    }
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function first(obj, keys) {
  for (const key of keys) {
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

function nightsBetween(checkIn, checkOut) {
  const a = new Date(`${checkIn}T00:00:00`);
  const b = new Date(`${checkOut}T00:00:00`);

  return Math.max(
    Math.round(
      (b.getTime() - a.getTime()) / 86400000
    ),
    1
  );
}

/* ---------------------------------------------------------
   AMENITIES
--------------------------------------------------------- */

function normalizeAmenities(property) {
  const result = [];

  const raw =
    property?.amenities ||
    property?.facilities ||
    [];

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === "string") {
        const value = cleanText(item);
        if (value) result.push(value);
        continue;
      }

      if (
        item &&
        typeof item === "object"
      ) {
        const value = cleanText(
          first(item, [
            "name",
            "label",
            "title"
          ])
        );

        if (value) result.push(value);
      }
    }
  }

  const description = [
    property?.description,
    property?.amenities_text,
    property?.hotel_amenities
  ]
    .filter(Boolean)
    .join(" ");

  const detected = [
    ["Pool", /pool|swimming/i],
    ["Spa", /spa|wellness/i],
    ["Fitness", /fitness|gym/i],
    ["Breakfast", /breakfast/i],
    ["Parking", /parking/i],
    ["Restaurant", /restaurant/i],
    ["Bar", /\bbar\b/i],
    ["Sauna", /sauna/i]
  ];

  for (const [name, pattern] of detected) {
    if (pattern.test(description)) {
      result.push(name);
    }
  }

  return [...new Set(result)];
}

/* ---------------------------------------------------------
   IMAGES
--------------------------------------------------------- */

function normalizeImages(property) {
  const images = [];

  const add = (value) => {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      images.push(value.trim());
    }
  };

  if (Array.isArray(property?.images)) {
    for (const item of property.images) {
      if (typeof item === "string") {
        add(item);
        continue;
      }

      if (
        item &&
        typeof item === "object"
      ) {
        add(
          item.original_image ||
          item.image ||
          item.url ||
          item.src ||
          item.thumbnail
        );
      }
    }
  }

  add(property?.original_image);
  add(property?.image);
  add(property?.image_url);
  add(property?.thumbnail);
  add(property?.thumbnail_url);

  return [...new Set(images)];
}

/* ---------------------------------------------------------
   BOOKING URL
--------------------------------------------------------- */

function normalizeBookingUrl(property) {
  const direct = first(property, [
    "link",
    "hotel_url",
    "booking_url",
    "website",
    "url"
  ]);

  if (
    typeof direct === "string" &&
    direct.startsWith("http")
  ) {
    return direct;
  }

  /*
  Google Hotels also exposes booking providers
  through the prices array.
  */

  const providers =
    property?.prices ||
    property?.booking_options ||
    property?.providers ||
    [];

  if (Array.isArray(providers)) {
    for (const provider of providers) {
      const link = first(provider, [
        "link",
        "url",
        "booking_url"
      ]);

      if (
        typeof link === "string" &&
        link.startsWith("http")
      ) {
        return link;
      }
    }
  }

  return null;
}

/* ---------------------------------------------------------
   PRICE
--------------------------------------------------------- */

function normalizePrice(property, nights) {
  let nightly = null;
  let total = null;

  /*
  Official SerpApi Google Hotels structure:

  rate_per_night.extracted_lowest
  total_rate.extracted_lowest
  */

  const rate =
    property?.rate_per_night || {};

  const totalRate =
    property?.total_rate || {};

  nightly = number(
    rate.extracted_lowest ??
    rate.extracted_price ??
    rate.lowest ??
    null
  );

  total = number(
    totalRate.extracted_lowest ??
    totalRate.extracted_total ??
    totalRate.lowest ??
    null
  );

  /*
  Fallbacks.
  */

  if (nightly == null) {
    nightly = number(
      property?.extracted_price ??
      property?.price_per_night ??
      null
    );
  }

  if (total == null) {
    total = number(
      property?.extracted_total ??
      property?.total_price ??
      property?.total ??
      null
    );
  }

  /*
  Provider-level fallback.
  */

  if (
    Array.isArray(property?.prices)
  ) {
    for (const provider of property.prices) {
      if (nightly == null) {
        nightly = number(
          provider?.rate_per_night
        );
      }

      if (total == null) {
        total = number(
          provider?.total_rate
        );
      }

      if (
        nightly != null &&
        total != null
      ) {
        break;
      }
    }
  }

  /*
  If only nightly price exists,
  calculate the stay total.
  */

  if (
    total == null &&
    nightly != null
  ) {
    total = nightly * nights;
  }

  /*
  If only total exists,
  calculate nightly price.
  */

  if (
    nightly == null &&
    total != null
  ) {
    nightly = total / nights;
  }

  return {
    current: nightly,
    price_per_night: nightly,
    total_price: total,
    currency: "EUR"
  };
}

/* ---------------------------------------------------------
   NORMALIZE HOTEL
--------------------------------------------------------- */

function normalizeProperty(
  property,
  checkIn,
  checkOut
) {
  const nights =
    nightsBetween(
      checkIn,
      checkOut
    );

  const price =
    normalizePrice(
      property,
      nights
    );

  const gps =
    property?.gps_coordinates ||
    property?.coordinates ||
    {};

  const address =
    cleanText(
      property?.address ||
      property?.location ||
      ""
    ) || null;

  const name =
    cleanText(
      property?.name ||
      property?.hotel_name ||
      property?.title
    ) ||
    "Unnamed hotel";

  const images =
    normalizeImages(property);

  const bookingUrl =
    normalizeBookingUrl(property);

  const hotelClass =
    property?.extracted_hotel_class ??
    number(property?.hotel_class) ??
    property?.stars ??
    null;

  let stars =
    number(hotelClass);

  if (
    stars == null &&
    typeof hotelClass === "string"
  ) {
    const match =
      hotelClass.match(/([1-5])/);

    if (match) {
      stars = Number(match[1]);
    }
  }

  const rating =
    number(
      property?.overall_rating ??
      property?.rating ??
      null
    );

  const reviews =
    number(
      property?.reviews ??
      property?.review_count ??
      null
    );

  return {
    hotel_id:
      property?.property_token ||
      property?.place_id ||
      property?.id ||
      `${name}|${address || ""}`,

    name,

    brand:
      cleanText(
        property?.brand ||
        property?.brand_name ||
        property?.chain ||
        ""
      ) || null,

    brand_name:
      cleanText(
        property?.brand_name ||
        property?.brand ||
        ""
      ) || null,

    chain:
      cleanText(
        property?.chain ||
        property?.chain_name ||
        property?.brand ||
        property?.brand_name ||
        ""
      ) || null,

    chain_name:
      cleanText(
        property?.chain_name ||
        property?.chain ||
        ""
      ) || null,

    location: {
      address,

      latitude:
        number(gps?.latitude) ??
        number(property?.latitude),

      longitude:
        number(gps?.longitude) ??
        number(property?.longitude)
    },

    price,

    rating: {
      value: rating,
      votes: reviews
    },

    stars,

    amenities:
      normalizeAmenities(property),

    images,

    thumbnail:
      images[0] || null,

    booking_url:
      bookingUrl,

    hotel_url:
      property?.link ||
      property?.hotel_url ||
      null,

    description:
      cleanText(
        property?.description
      ) || null,

    property_token:
      property?.property_token ||
      null,

    place_id:
      property?.place_id ||
      null,

    sponsored:
      Boolean(
        property?.sponsored
      ),

    source:
      "Google Hotels / SerpApi"
  };
}

/* ---------------------------------------------------------
   DEDUPE
--------------------------------------------------------- */

function dedupeHotels(hotels) {
  const seen = new Map();

  const score = (hotel) => {
    let value = 0;

    if (
      hotel.price?.total_price != null
    ) value += 5;

    if (
      hotel.price?.price_per_night != null
    ) value += 3;

    if (
      hotel.images?.length
    ) value += 3;

    if (
      hotel.location?.address
    ) value += 2;

    if (
      hotel.rating?.value != null
    ) value += 2;

    if (
      hotel.amenities?.length
    ) value += 1;

    if (
      hotel.booking_url
    ) value += 1;

    return value;
  };

  for (const hotel of hotels) {
    const key =
      String(
        hotel.hotel_id ||
        `${hotel.name}|${hotel.location?.address || ""}`
      )
        .toLowerCase()
        .trim();

    if (!key) continue;

    const existing =
      seen.get(key);

    if (!existing) {
      seen.set(key, hotel);
      continue;
    }

    if (
      score(hotel) >
      score(existing)
    ) {
      seen.set(key, hotel);
    }
  }

  return [...seen.values()];
}

/* ---------------------------------------------------------
   SERPAPI
--------------------------------------------------------- */

async function fetchSerpApi(
  params,
  apiKey
) {
  const url =
    new URL(SERPAPI_URL);

  url.searchParams.set(
    "engine",
    "google_hotels"
  );

  url.searchParams.set(
    "api_key",
    apiKey
  );

  for (
    const [key, value]
    of Object.entries(params)
  ) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      url.searchParams.set(
        key,
        String(value)
      );
    }
  }

  const response =
    await fetch(
      url.toString(),
      {
        method: "GET",
        headers: {
          Accept:
            "application/json"
        }
      }
    );

  const text =
    await response.text();

  let data;

  try {
    data =
      JSON.parse(text);
  } catch {
    throw new Error(
      "SerpApi returned invalid JSON."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      `SerpApi request failed (${response.status}).`
    );
  }

  if (data?.error) {
    throw new Error(
      data.error
    );
  }

  return data;
}

/* ---------------------------------------------------------
   MAIN
--------------------------------------------------------- */

export async function onRequest(context) {
  const {
    request,
    env,
    waitUntil
  } = context;

  if (
    request.method ===
    "OPTIONS"
  ) {
    return new Response(
      null,
      {
        status: 204,
        headers:
          corsHeaders()
      }
    );
  }

  if (
    request.method !==
    "GET"
  ) {
    return json(
      {
        error:
          "Method not allowed."
      },
      405
    );
  }

  const incoming =
    new URL(
      request.url
    );

  const location =
    incoming.searchParams
      .get("location")
      ?.trim() || "";

  const checkIn =
    incoming.searchParams
      .get("check_in") || "";

  const checkOut =
    incoming.searchParams
      .get("check_out") || "";

  const adults =
    Number(
      incoming.searchParams
        .get("adults") || 2
    );

  /*
  Default = 3 pages.
  Approx. 60 results if available.

  Maximum = 5 pages.
  */

  const requestedPages =
    Number(
      incoming.searchParams
        .get("pages") || 3
    );

  const pages =
    Math.min(
      Math.max(
        Number.isFinite(
          requestedPages
        )
          ? Math.floor(
              requestedPages
            )
          : 3,
        1
      ),
      5
    );

  if (!location) {
    return json(
      {
        error:
          "Missing required parameter: location."
      },
      400
    );
  }

  if (
    !validDate(checkIn) ||
    !validDate(checkOut) ||
    checkOut <= checkIn
  ) {
    return json(
      {
        error:
          "Please provide valid check-in and check-out dates."
      },
      400
    );
  }

  if (
    !Number.isFinite(adults) ||
    adults < 1 ||
    adults > 20
  ) {
    return json(
      {
        error:
          "Adults must be between 1 and 20."
      },
      400
    );
  }

  const apiKey =
    env?.SERPAPI_KEY;

  if (!apiKey) {
    return json(
      {
        error:
          "SERPAPI_KEY is missing in Cloudflare environment variables."
      },
      500
    );
  }

  /* -------------------------------------------------------
     CACHE
  ------------------------------------------------------- */

  const cache =
    caches.default;

  const cacheUrl =
    new URL(
      incoming.toString()
    );

  cacheUrl.searchParams.set(
    "pages",
    String(pages)
  );

  const cacheKey =
    new Request(
      cacheUrl.toString(),
      {
        method: "GET"
      }
    );

  const cached =
    await cache.match(
      cacheKey
    );

  if (cached) {
    return new Response(
      cached.body,
      {
        status: 200,
        headers:
          corsHeaders()
      }
    );
  }

  /* -------------------------------------------------------
     FETCH MULTIPLE PAGES
  ------------------------------------------------------- */

  try {
    const allProperties = [];

    let nextPageToken =
      null;

    let pagesFetched = 0;

    for (
      let page = 1;
      page <= pages;
      page++
    ) {
      const params = {
        q: location,

        check_in_date:
          checkIn,

        check_out_date:
          checkOut,

        adults:
          String(adults),

        currency:
          "EUR",

        gl:
          "de",

        hl:
          "en"
      };

      if (
        nextPageToken
      ) {
        params.next_page_token =
          nextPageToken;
      }

      const data =
        await fetchSerpApi(
          params,
          apiKey
        );

      pagesFetched++;

      if (
        Array.isArray(
          data?.properties
        )
      ) {
        allProperties.push(
          ...data.properties
        );
      }

      const pagination =
        data?.serpapi_pagination;

      nextPageToken =
        pagination?.next_page_token ||
        null;

      if (
        !nextPageToken
      ) {
        break;
      }
    }

    const normalized =
      allProperties.map(
        property =>
          normalizeProperty(
            property,
            checkIn,
            checkOut
          )
      );

    const hotels =
      dedupeHotels(
        normalized
      );

    const payload = {
      location,

      check_in:
        checkIn,

      check_out:
        checkOut,

      adults,

      currency:
        "EUR",

      hotels,

      total_count:
        hotels.length,

      pages_requested:
        pages,

      pages_fetched:
        pagesFetched,

      search_metadata: {
        source:
          "Google Hotels via SerpApi",

        pricing:
          "Live Google Hotels pricing",

        images:
          true,

        pagination:
          true
      }
    };

    const response =
      new Response(
        JSON.stringify(
          payload
        ),
        {
          status: 200,

          headers: {
            "Content-Type":
              "application/json; charset=utf-8",

            "Cache-Control":
              "public, max-age=900"
          }
        }
      );

    if (
      typeof waitUntil ===
      "function"
    ) {
      waitUntil(
        cache.put(
          cacheKey,
          response.clone()
        )
      );
    }

    return response;

  } catch (error) {
    console.error(
      "Hotel search error:",
      error
    );

    return json(
      {
        error:
          "Hotel search failed.",

        details:
          String(
            error?.message ||
            error
          )
      },
      502
    );
  }
}
