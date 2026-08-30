/*
Cloudflare Pages Function
functions/api/hotels.js

Hotel Loyalty Finder
Google Hotels via SerpApi

Required Cloudflare Secret:
SERPAPI_KEY
*/

const SERPAPI_URL =
  "https://serpapi.com/search.json";

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
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: corsHeaders()
    }
  );
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(
    String(value || "")
  );
}

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
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

  if (typeof value === "object") {
    return number(
      value.extracted_lowest ??
      value.extracted_price ??
      value.extracted_total ??
      value.lowest ??
      value.price ??
      value.total ??
      value.value ??
      null
    );
  }

  let text = String(value)
    .replace(/[^\d.,-]/g, "")
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
      text = text
        .replace(/\./g, "")
        .replace(",", ".");
    } else {
      text = text.replace(/,/g, "");
    }
  } else if (text.includes(",")) {
    const parts = text.split(",");

    if (
      parts.length === 2 &&
      parts[1].length <= 2
    ) {
      text = text.replace(",", ".");
    } else {
      text = text.replace(/,/g, "");
    }
  } else if (text.includes(".")) {
    const parts = text.split(".");

    if (
      parts.length === 2 &&
      parts[1].length === 3
    ) {
      text = text.replace(".", "");
    }
  }

  const parsed = Number(text);

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

function nightsBetween(
  checkIn,
  checkOut
) {
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

  return Math.max(diff, 1);
}

/* =========================================================
   URLS
========================================================= */

function isHttpUrl(value) {
  return (
    typeof value === "string" &&
    /^https?:\/\//i.test(
      value.trim()
    )
  );
}

function extractUrl(value) {
  if (isHttpUrl(value)) {
    return value.trim();
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return (
      extractUrl(value.url) ||
      extractUrl(value.link) ||
      extractUrl(value.website) ||
      extractUrl(value.website_url)
    );
  }

  return null;
}

function normalizeUrls(property) {
  /*
    Google Hotels / SerpApi commonly exposes
    the property's direct link through `link`.

    Prefer explicit website fields if available.
  */

  const officialUrl =
    extractUrl(
      first(property, [
        "official_website",
        "official_website_url",
        "hotel_website",
        "website",
        "website_url",
        "link"
      ])
    );

  let bookingUrl =
    extractUrl(
      first(property, [
        "booking_url",
        "hotel_url"
      ])
    );

  const providers =
    property?.prices ||
    property?.booking_options ||
    property?.providers ||
    [];

  if (
    Array.isArray(providers)
  ) {
    for (
      const provider of providers
    ) {
      if (
        !provider ||
        typeof provider !== "object"
      ) {
        continue;
      }

      const url =
        extractUrl(provider);

      if (
        url &&
        !bookingUrl
      ) {
        bookingUrl = url;
      }
    }
  }

  return {
    official_url:
      officialUrl,

    booking_url:
      bookingUrl
  };
}

/* =========================================================
   ADDRESS
========================================================= */

function buildAddress(property) {
  const address =
    property?.address ||
    property?.location ||
    property?.formatted_address ||
    null;

  if (
    typeof address === "string"
  ) {
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

/* =========================================================
   AMENITIES
========================================================= */

function canonicalAmenity(
  value
) {
  const text =
    cleanText(value)
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase();

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
  property
) {
  const raw =
    property?.amenities ||
    property?.facilities ||
    property?.amenity ||
    [];

  const values = [];

  if (
    Array.isArray(raw)
  ) {
    for (
      const item of raw
    ) {
      if (
        typeof item === "string"
      ) {
        values.push(item);
      } else if (
        item &&
        typeof item === "object"
      ) {
        const value =
          first(item, [
            "name",
            "label",
            "title",
            "text"
          ]);

        if (value) {
          values.push(value);
        }
      }
    }
  } else if (
    typeof raw === "string"
  ) {
    values.push(
      ...raw.split(
        /[,;|]/
      )
    );
  }

  values.push(
    property?.description,
    property?.amenities_text,
    property?.hotel_amenities,
    property?.facilities_text
  );

  const result = [];

  for (
    const value of
    values.filter(Boolean)
  ) {
    const amenity =
      canonicalAmenity(value);

    if (amenity) {
      result.push(amenity);
    }
  }

  return [
    ...new Set(result)
  ];
}

/* =========================================================
   IMAGES
========================================================= */

function normalizeImages(
  property
) {
  const images = [];

  const addImage =
    value => {
      if (
        typeof value === "string" &&
        value.trim()
      ) {
        images.push(
          value.trim()
        );
      }
    };

  if (
    Array.isArray(
      property?.images
    )
  ) {
    for (
      const item of
      property.images
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

  addImage(
    property?.original_image
  );

  addImage(
    property?.image
  );

  addImage(
    property?.image_url
  );

  addImage(
    property?.thumbnail
  );

  addImage(
    property?.thumbnail_url
  );

  return [
    ...new Set(images)
  ];
}

/* =========================================================
   PRICE
========================================================= */

function normalizePrice(
  property,
  nights
) {
  let nightly = null;
  let total = null;

  const rate =
    property?.rate_per_night ||
    {};

  const totalRate =
    property?.total_rate ||
    {};

  nightly =
    number(
      rate?.extracted_lowest ??
      rate?.extracted_price ??
      rate?.lowest ??
      rate?.price ??
      null
    );

  total =
    number(
      totalRate?.extracted_lowest ??
      totalRate?.extracted_total ??
      totalRate?.lowest ??
      totalRate?.total ??
      null
    );

  if (
    nightly == null
  ) {
    nightly =
      number(
        property?.extracted_price ??
        property?.price_per_night ??
        property?.nightly_price ??
        property?.price ??
        null
      );
  }

  if (
    total == null
  ) {
    total =
      number(
        property?.extracted_total ??
        property?.total_price ??
        property?.total ??
        null
      );
  }

  if (
    Array.isArray(
      property?.prices
    )
  ) {
    for (
      const provider of
      property.prices
    ) {
      if (
        !provider ||
        typeof provider !== "object"
      ) {
        continue;
      }

      if (
        nightly == null
      ) {
        nightly =
          number(
            provider?.rate_per_night ??
            provider?.price_per_night ??
            provider?.price ??
            null
          );
      }

      if (
        total == null
      ) {
        total =
          number(
            provider?.total_rate ??
            provider?.total_price ??
            provider?.total ??
            null
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
    price_per_night:
      nightly,
    total_price:
      total,
    currency: "EUR"
  };
}

/* =========================================================
   NORMALIZE PROPERTY
========================================================= */

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

  const images =
    normalizeImages(
      property
    );

  const urls =
    normalizeUrls(
      property
    );

  const gps =
    property?.gps_coordinates ||
    property?.coordinates ||
    {};

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

  let hotelClass =
    property?.extracted_hotel_class ??
    property?.hotel_class ??
    property?.star_rating ??
    property?.stars ??
    null;

  let stars =
    number(hotelClass);

  if (
    stars == null &&
    typeof hotelClass === "string"
  ) {
    const match =
      hotelClass.match(
        /([1-5])/
      );

    if (match) {
      stars =
        Number(match[1]);
    }
  }

  const rating =
    number(
      property?.overall_rating ??
      property?.rating ??
      property?.rating_value ??
      null
    );

  const reviews =
    number(
      property?.reviews ??
      property?.review_count ??
      property?.ratings_count ??
      null
    );

  const brand =
    cleanText(
      property?.brand ||
      property?.brand_name ||
      property?.chain ||
      property?.chain_name ||
      ""
    ) || null;

  const chain =
    cleanText(
      property?.chain ||
      property?.chain_name ||
      property?.brand ||
      property?.brand_name ||
      ""
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
      cleanText(
        property?.brand_name ||
        brand ||
        ""
      ) || null,

    chain,

    chain_name:
      cleanText(
        property?.chain_name ||
        chain ||
        ""
      ) || null,

    hotel_brand:
      cleanText(
        property?.hotel_brand ||
        brand ||
        ""
      ) || null,

    property_brand:
      cleanText(
        property?.property_brand ||
        brand ||
        ""
      ) || null,

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
      value: rating,
      votes: reviews
    },

    stars,

    amenities:
      normalizeAmenities(
        property
      ),

    images,

    thumbnail:
      images[0] ||
      null,

    /*
      Direct hotel website.
    */
    official_url:
      urls.official_url,

    /*
      Booking/provider fallback.
    */
    booking_url:
      urls.booking_url,

    /*
      Backwards compatibility.
    */
    hotel_url:
      urls.official_url ||
      null,

    url:
      urls.official_url ||
      urls.booking_url ||
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

/* =========================================================
   DEDUPE
========================================================= */

function dedupeHotels(
  hotels
) {
  const seen =
    new Map();

  const score =
    hotel => {
      let value = 0;

      if (
        hotel.price?.total_price !=
        null
      ) {
        value += 5;
      }

      if (
        hotel.price?.price_per_night !=
        null
      ) {
        value += 3;
      }

      if (
        hotel.images?.length
      ) {
        value += 3;
      }

      if (
        hotel.location?.address
      ) {
        value += 2;
      }

      if (
        hotel.rating?.value !=
        null
      ) {
        value += 2;
      }

      if (
        hotel.amenities?.length
      ) {
        value += 2;
      }

      if (
        hotel.official_url
      ) {
        value += 4;
      }

      if (
        hotel.booking_url
      ) {
        value += 1;
      }

      return value;
    };

  for (
    const hotel of
    hotels
  ) {
    const id =
      String(
        hotel.hotel_id ||
        ""
      )
        .toLowerCase()
        .trim();

    const fallback =
      `${cleanText(
        hotel.name
      )}|${cleanText(
        hotel.location?.address ||
        ""
      )}`
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

/* =========================================================
   SERPAPI
========================================================= */

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
    ] of Object.entries(
      params
    )
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

/* =========================================================
   MAIN
========================================================= */

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
      ?.trim() ||
    "";

  const checkIn =
    incoming.searchParams
      .get("check_in") ||
    "";

  const checkOut =
    incoming.searchParams
      .get("check_out") ||
    "";

  const adults =
    Number(
      incoming.searchParams
        .get("adults") ||
      2
    );

  const requestedPages =
    Number(
      incoming.searchParams
        .get("pages") ||
      3
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

  /* CACHE */

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
        status:
          cached.status,
        headers:
          corsHeaders()
      }
    );
  }

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
          true,

        official_hotel_links:
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
