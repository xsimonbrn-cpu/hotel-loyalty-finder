/*
Cloudflare Pages Function: functions/api/hotels.js

Hotel Loyalty Finder
Google Hotels via SerpApi

Required Cloudflare Secret:
SERPAPI_KEY

The worker fetches multiple Google Hotels pages so the frontend
can receive substantially more than the first ~20 hotels.
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

function json(data, status = 200, extraHeaders = {}) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders(),
        ...extraHeaders
      }
    }
  );
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
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

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function nightsBetween(checkIn, checkOut) {
  const a = new Date(`${checkIn}T00:00:00`);
  const b = new Date(`${checkOut}T00:00:00`);

  const diff = Math.round(
    (b.getTime() - a.getTime()) / 86400000
  );

  return Math.max(diff, 1);
}

function buildAddress(property) {
  const address =
    property?.address ||
    property?.location ||
    property?.formatted_address ||
    null;

  if (typeof address === "string") {
    return cleanText(address);
  }

  if (address && typeof address === "object") {
    const parts = [
      address.street,
      address.city,
      address.postal_code,
      address.country
    ].filter(Boolean);

    if (parts.length) {
      return parts.join(", ");
    }
  }

  return null;
}

function normalizeAmenities(property) {
  const raw = property?.amenities;

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map(item => {
      if (typeof item === "string") {
        return cleanText(item);
      }

      return cleanText(
        first(item, [
          "name",
          "label",
          "title"
        ])
      );
    })
    .filter(Boolean);
}

function normalizeImages(property) {
  const images = [];

  if (Array.isArray(property?.images)) {
    for (const item of property.images) {
      if (typeof item === "string") {
        images.push(item);
        continue;
      }

      const url = first(item, [
        "original_image",
        "thumbnail",
        "image",
        "url"
      ]);

      if (url) {
        images.push(url);
      }
    }
  }

  const singleImage = first(property, [
    "image",
    "image_url",
    "thumbnail"
  ]);

  if (singleImage) {
    images.push(singleImage);
  }

  return [...new Set(images.filter(Boolean))];
}

function normalizeBookingUrl(property) {
  const direct = first(property, [
    "link",
    "hotel_url",
    "booking_url"
  ]);

  if (direct) {
    return direct;
  }

  if (
    Array.isArray(property?.booking_options) &&
    property.booking_options.length
  ) {
    for (const option of property.booking_options) {
      const link = first(option, [
        "link",
        "url"
      ]);

      if (link) {
        return link;
      }
    }
  }

  return null;
}

function normalizePrice(property, nights) {
  const ratePerNight =
    property?.rate_per_night ||
    property?.price_per_night ||
    property?.nightly_price ||
    null;

  const totalPrice =
    property?.total_price ||
    property?.total ||
    property?.price?.total ||
    null;

  let nightly = number(ratePerNight);
  let total = number(totalPrice);

  /*
  SerpApi Google Hotels commonly provides a rate_per_night
  object. Handle both numeric and object formats.
  */

  if (
    ratePerNight &&
    typeof ratePerNight === "object"
  ) {
    nightly = number(
      first(ratePerNight, [
        "extracted_price",
        "price",
        "value"
      ])
    );

    if (total == null) {
      total = number(
        first(ratePerNight, [
          "total",
          "extracted_total"
        ])
      );
    }
  }

  /*
  Some Google Hotels results provide the total through
  a price object.
  */

  if (
    property?.price &&
    typeof property.price === "object"
  ) {
    if (total == null) {
      total = number(
        first(property.price, [
          "extracted_total",
          "total",
          "value"
        ])
      );
    }

    if (nightly == null) {
      nightly = number(
        first(property.price, [
          "extracted_price",
          "price",
          "value"
        ])
      );
    }
  }

  if (total == null && nightly != null) {
    total = nightly * nights;
  }

  if (nightly == null && total != null) {
    nightly = total / nights;
  }

  return {
    current: nightly,
    price_per_night: nightly,
    total_price: total,
    currency: "EUR"
  };
}

function normalizeProperty(property, checkIn, checkOut) {
  const nights = nightsBetween(
    checkIn,
    checkOut
  );

  const price = normalizePrice(
    property,
    nights
  );

  const gps =
    property?.gps_coordinates ||
    property?.coordinates ||
    {};

  const rating =
    property?.overall_rating ??
    property?.rating ??
    null;

  const reviews =
    property?.reviews ??
    property?.review_count ??
    null;

  const stars =
    property?.hotel_class ??
    property?.star_rating ??
    property?.stars ??
    null;

  let hotelStars = number(stars);

  if (
    hotelStars == null &&
    typeof stars === "string"
  ) {
    const match = stars.match(/([1-5])/);

    if (match) {
      hotelStars = Number(match[1]);
    }
  }

  return {
    hotel_id:
      property?.property_token ||
      property?.place_id ||
      property?.id ||
      `${cleanText(property?.name)}|${cleanText(buildAddress(property))}`,

    name:
      cleanText(property?.name) ||
      "Unnamed hotel",

    brand:
      cleanText(
        property?.brand ||
        property?.brand_name ||
        property?.chain
      ) || null,

    chain:
      cleanText(
        property?.chain ||
        property?.brand ||
        property?.brand_name
      ) || null,

    location: {
      address: buildAddress(property),

      latitude:
        number(gps?.latitude) ??
        number(property?.latitude),

      longitude:
        number(gps?.longitude) ??
        number(property?.longitude)
    },

    price,

    rating: {
      value: number(rating),
      votes: number(reviews)
    },

    stars: hotelStars,

    amenities:
      normalizeAmenities(property),

    images:
      normalizeImages(property),

    booking_url:
      normalizeBookingUrl(property),

    description:
      cleanText(property?.description) || null,

    property_token:
      property?.property_token || null,

    sponsored:
      Boolean(property?.sponsored),

    source: "Google Hotels / SerpApi"
  };
}

function dedupeHotels(hotels) {
  const seen = new Map();

  for (const hotel of hotels) {
    const key =
      String(
        hotel.hotel_id ||
        `${hotel.name}|${hotel.location?.address || ""}`
      )
        .toLowerCase()
        .trim();

    if (!key) {
      continue;
    }

    const existing = seen.get(key);

    if (!existing) {
      seen.set(key, hotel);
      continue;
    }

    /*
    Prefer the version that contains a price,
    image, address or rating.
    */

    const existingScore =
      Number(existing.price?.total_price != null) +
      Number(existing.images?.length > 0) +
      Number(existing.location?.address != null) +
      Number(existing.rating?.value != null);

    const newScore =
      Number(hotel.price?.total_price != null) +
      Number(hotel.images?.length > 0) +
      Number(hotel.location?.address != null) +
      Number(hotel.rating?.value != null);

    if (newScore > existingScore) {
      seen.set(key, hotel);
    }
  }

  return [...seen.values()];
}

async function fetchSerpApi(params, apiKey) {
  const url = new URL(SERPAPI_URL);

  url.searchParams.set(
    "engine",
    "google_hotels"
  );

  url.searchParams.set(
    "api_key",
    apiKey
  );

  for (const [key, value] of Object.entries(params)) {
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

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }
  );

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
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

export async function onRequest(context) {
  const {
    request,
    env,
    waitUntil
  } = context;

  if (request.method === "OPTIONS") {
    return new Response(
      null,
      {
        status: 204,
        headers: corsHeaders()
      }
    );
  }

  if (request.method !== "GET") {
    return json(
      {
        error: "Method not allowed."
      },
      405
    );
  }

  const incoming =
    new URL(request.url);

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
  pages controls how many Google Hotels pages
  are fetched.

  Default: 3 pages
  Approximate result target: up to ~60 hotels

  Maximum: 5 pages
  This prevents accidental unlimited API usage.
  */

  const requestedPages =
    Number(
      incoming.searchParams
        .get("pages") || 3
    );

  const pages = Math.min(
    Math.max(
      Number.isFinite(requestedPages)
        ? Math.floor(requestedPages)
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

  /*
  Cache the complete multi-page search.

  Identical searches can be served from cache instead
  of making fresh SerpApi requests.
  */

  const cache =
    caches.default;

  const cacheUrl =
    new URL(incoming.toString());

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
    await cache.match(cacheKey);

  if (cached) {
    return new Response(
      cached.body,
      {
        status: 200,
        headers: corsHeaders()
      }
    );
  }

  try {
    const allProperties = [];

    let nextPageToken = null;

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

      if (nextPageToken) {
        params.next_page_token =
          nextPageToken;
      }

      const data =
        await fetchSerpApi(
          params,
          apiKey
        );

      pagesFetched++;

      const properties =
        Array.isArray(
          data?.properties
        )
          ? data.properties
          : [];

      allProperties.push(
        ...properties
      );

      const pagination =
        data?.serpapi_pagination;

      nextPageToken =
        pagination?.next_page_token ||
        null;

      if (!nextPageToken) {
        break;
      }
    }

    const hotels =
      dedupeHotels(
        allProperties.map(
          property =>
            normalizeProperty(
              property,
              checkIn,
              checkOut
            )
        )
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

        pagination:
          true
      }
    };

    const response =
      new Response(
        JSON.stringify(payload),
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

    waitUntil(
      cache.put(
        cacheKey,
        response.clone()
      )
    );

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
