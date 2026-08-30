/*
Cloudflare Pages Function: functions/api/hotels.js

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
- Hotel / brand / chain information
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
  return /^\d{4}-\d{2}-\d{2}$/.test(
    String(value || "")
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

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }

  if (
    typeof value === "object"
  ) {
    const nested =
      value.extracted_price ??
      value.extracted_total ??
      value.price ??
      value.total ??
      value.value ??
      null;

    if (
      nested !== null &&
      nested !== undefined
    ) {
      return number(nested);
    }

    return null;
  }

  const cleaned = String(value)
    .replace(/[^\d.,-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);

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

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function nightsBetween(
  checkIn,
  checkOut
) {
  const a = new Date(
    `${checkIn}T00:00:00`
  );

  const b = new Date(
    `${checkOut}T00:00:00`
  );

  const diff = Math.round(
    (b.getTime() - a.getTime()) /
      86400000
  );

  return Math.max(diff, 1);
}


/* ---------------------------------------------------------
   ADDRESS
--------------------------------------------------------- */

function buildAddress(property) {
  const address =
    property?.address ||
    property?.location ||
    property?.formatted_address ||
    null;

  if (typeof address === "string") {
    return cleanText(address);
  }

  if (
    address &&
    typeof address === "object"
  ) {
    const parts = [
      address.street,
      address.street_address,
      address.housenumber,
      address.city,
      address.postal_code,
      address.zip,
      address.country
    ].filter(Boolean);

    if (parts.length) {
      return cleanText(
        parts.join(", ")
      );
    }
  }

  return null;
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

        if (value) {
          result.push(value);
        }

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

        if (value) {
          result.push(value);
        }
      }
    }
  }

  /*
   Some Google Hotels results expose
   amenities as individual fields.
  */

  const textSources = [
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

  for (const [
    name,
    pattern
  ] of detected) {
    if (
      pattern.test(textSources)
    ) {
      result.push(name);
    }
  }

  return [
    ...new Set(
      result.filter(Boolean)
    )
  ];
}


/* ---------------------------------------------------------
   IMAGES
--------------------------------------------------------- */

function normalizeImages(property) {
  const images = [];

  const addImage = (value) => {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      images.push(value.trim());
    }
  };

  if (
    Array.isArray(
      property?.images
    )
  ) {
    for (
      const item of property.images
    ) {
      if (
        typeof item === "string"
      ) {
        addImage(item);
        continue;
      }

      if (
        item &&
        typeof item === "object"
      ) {
        addImage(
          first(item, [
            "original_image",
            "original",
            "image",
            "image_url",
            "url",
            "src",
            "thumbnail"
          ])
        );
      }
    }
  }

  /*
   SerpApi can expose images in
   additional image-related fields.
  */

  const singleFields = [
    "image",
    "image_url",
    "original_image",
    "thumbnail",
    "thumbnail_url"
  ];

  for (
    const field of singleFields
  ) {
    addImage(
      property?.[field]
    );
  }

  /*
   Some responses contain
   a property image object.
  */

  if (
    property?.image &&
    typeof property.image === "object"
  ) {
    addImage(
      first(property.image, [
        "original_image",
        "image",
        "url",
        "src"
      ])
    );
  }

  return [
    ...new Set(
      images.filter(Boolean)
    )
  ];
}


/* ---------------------------------------------------------
   BOOKING URL
--------------------------------------------------------- */

function normalizeBookingUrl(
  property
) {
  const direct = first(
    property,
    [
      "link",
      "hotel_url",
      "booking_url",
      "website",
      "url"
    ]
  );

  if (typeof direct === "string") {
    return direct;
  }

  /*
   Google Hotels sometimes returns
   booking options instead.
  */

  const options =
    property?.booking_options ||
    property?.prices ||
    property?.providers ||
    [];

  if (
    Array.isArray(options)
  ) {
    for (
      const option of options
    ) {
      if (
        !option ||
        typeof option !== "object"
      ) {
        continue;
      }

      const link = first(
        option,
        [
          "link",
          "url",
          "booking_url"
        ]
      );

      if (link) {
        return link;
      }
    }
  }

  return null;
}


/* ---------------------------------------------------------
   PRICE
--------------------------------------------------------- */

function normalizePrice(
  property,
  nights
) {
  let nightly = null;
  let total = null;

  /*
   Main SerpApi Google Hotels
   price fields.
  */

  const ratePerNight =
    property?.rate_per_night ??
    property?.price_per_night ??
    property?.nightly_price ??
    null;

  const totalPrice =
    property?.total_price ??
    property?.total ??
    null;

  /*
   rate_per_night can be an object:
   {
     extracted_price: 120,
     price: "$120"
   }
  */

  if (
    ratePerNight &&
    typeof ratePerNight === "object"
  ) {
    nightly = number(
      first(
        ratePerNight,
        [
          "extracted_price",
          "price",
          "value"
        ]
      )
    );

    total = number(
      first(
        ratePerNight,
        [
          "extracted_total",
          "total"
        ]
      )
    );
  } else {
    nightly =
      number(ratePerNight);
  }

  if (total == null) {
    total =
      number(totalPrice);
  }

  /*
   Some SerpApi responses have
   a price object.
  */

  if (
    property?.price &&
    typeof property.price === "object"
  ) {
    if (nightly == null) {
      nightly = number(
        first(
          property.price,
          [
            "extracted_price",
            "price",
            "value"
          ]
        )
      );
    }

    if (total == null) {
      total = number(
        first(
          property.price,
          [
            "extracted_total",
            "total",
            "value"
          ]
        )
      );
    }
  }

  /*
   Sometimes the total appears
   as a string in the property.
  */

  if (total == null) {
    total = number(
      property?.total_price ??
      property?.total_price_with_taxes ??
      property?.price_total ??
      null
    );
  }

  /*
   Calculate missing side.
  */

  if (
    total == null &&
    nightly != null
  ) {
    total =
      nightly * nights;
  }

  if (
    nightly == null &&
    total != null
  ) {
    nightly =
      total / nights;
  }

  return {
    current: nightly,
    price_per_night: nightly,
    total_price: total,
    currency:
      property?.currency ||
      "EUR"
  };
}


/* ---------------------------------------------------------
   NORMALIZE PROPERTY
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

  const ratingRaw =
    property?.overall_rating ??
    property?.rating ??
    null;

  const reviewRaw =
    property?.reviews ??
    property?.review_count ??
    property?.ratings_count ??
    null;

  const starsRaw =
    property?.hotel_class ??
    property?.star_rating ??
    property?.stars ??
    null;

  let stars =
    number(starsRaw);

  /*
   hotel_class may look like:
   "4-star hotel"
  */

  if (
    stars == null &&
    typeof starsRaw === "string"
  ) {
    const match =
      starsRaw.match(
        /([1-5])/
      );

    if (match) {
      stars =
        Number(match[1]);
    }
  }

  const images =
    normalizeImages(
      property
    );

  const bookingUrl =
    normalizeBookingUrl(
      property
    );

  const address =
    buildAddress(
      property
    );

  const name =
    cleanText(
      property?.name ||
      property?.hotel_name ||
      property?.title
    ) ||
    "Unnamed hotel";

  const brand =
    cleanText(
      property?.brand ||
      property?.brand_name ||
      property?.chain ||
      property?.hotel_brand
    ) || null;

  const chain =
    cleanText(
      property?.chain ||
      property?.chain_name ||
      property?.brand ||
      property?.brand_name
    ) || null;

  return {
    hotel_id:
      property?.property_token ||
      property?.place_id ||
      property?.id ||
      `${name}|${address || ""}`,

    name,

    brand,

    brand_name:
      property?.brand_name ||
      brand,

    chain,

    chain_name:
      property?.chain_name ||
      chain,

    hotel_brand:
      property?.hotel_brand ||
      brand,

    property_brand:
      property?.property_brand ||
      brand,

    location: {
      address,

      latitude:
        number(
          gps?.latitude
        ) ??
        number(
          property?.latitude
        ),

      longitude:
        number(
          gps?.longitude
        ) ??
        number(
          property?.longitude
        )
    },

    price,

    rating: {
      value:
        number(ratingRaw),

      votes:
        number(reviewRaw)
    },

    stars,

    amenities:
      normalizeAmenities(
        property
      ),

    images,

    booking_url:
      bookingUrl,

    hotel_url:
      property?.hotel_url ||
      null,

    url:
      property?.link ||
      property?.url ||
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
   DEDUPLICATION
--------------------------------------------------------- */

function dedupeHotels(
  hotels
) {
  const seen =
    new Map();

  for (
    const hotel of hotels
  ) {
    const id =
      String(
        hotel.hotel_id ||
        ""
      )
      .toLowerCase()
      .trim();

    const fallback =
      `${cleanText(hotel.name)}|${cleanText(hotel.location?.address || "")}`
        .toLowerCase()
        .trim();

    const key =
      id || fallback;

    if (!key) {
      continue;
    }

    const existing =
      seen.get(key);

    if (!existing) {
      seen.set(
        key,
        hotel
      );
      continue;
    }

    /*
     Prefer the hotel record
     with the most useful data.
    */

    const score = (
      item
    ) => {
      let value = 0;

      if (
        item.price?.total_price !=
        null
      ) {
        value += 4;
      }

      if (
        item.price?.price_per_night !=
        null
      ) {
        value += 2;
      }

      if (
        item.images?.length
      ) {
        value += 3;
      }

      if (
        item.location?.address
      ) {
        value += 2;
      }

      if (
        item.rating?.value !=
        null
      ) {
        value += 2;
      }

      if (
        item.amenities?.length
      ) {
        value += 1;
      }

      if (
        item.booking_url
      ) {
        value += 1;
      }

      return value;
    };

    if (
      score(hotel) >
      score(existing)
    ) {
      seen.set(
        key,
        hotel
      );
    }
  }

  return [
    ...seen.values()
  ];
}


/* ---------------------------------------------------------
   SERPAPI REQUEST
--------------------------------------------------------- */

async function fetchSerpApi(
  params,
  apiKey
) {
  const url =
    new URL(
      SERPAPI_URL
    );

  url.searchParams.set(
    "engine",
    "google_hotels"
  );

  url.searchParams.set(
    "api_key",
    apiKey
  );

  for (
    const [
      key,
      value
    ] of Object.entries(params)
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
   MAIN CLOUDFLARE FUNCTION
--------------------------------------------------------- */

export async function onRequest(
  context
) {
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
   Number of Google Hotels
   pages to request.

   3 pages ≈ substantially
   more than the first 20.

   Maximum 5 pages.
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
    const allProperties =
      [];

    let nextPageToken =
      null;

    let pagesFetched =
      0;

    for (
      let page = 1;
      page <= pages;
      page++
    ) {
      const params = {
        q:
          location,

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

      /*
       SerpApi pagination.
      */

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

      /*
       Google Hotels normally
       returns properties here.
      */

      if (
        Array.isArray(
          data?.properties
        )
      ) {
        allProperties.push(
          ...data.properties
        );
      }

      /*
       Fallbacks for alternative
       response structures.
      */

      if (
        Array.isArray(
          data?.hotels
        )
      ) {
        allProperties.push(
          ...data.hotels
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


    /* -----------------------------------------------------
       NORMALIZE + DEDUPE
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       RESPONSE
    ----------------------------------------------------- */

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

    /*
     Store the complete
     multi-page result.
    */

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
