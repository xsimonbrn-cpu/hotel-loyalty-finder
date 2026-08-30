const STAYAPI_URL =
  "https://api.stayapi.com/v1/google_hotels/search";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
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

export async function onRequest(context) {
  const request = context.request;
  const env = context.env;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }

  if (request.method !== "GET") {
    return json(
      {
        error: "Method not allowed."
      },
      405
    );
  }

  try {
    const incoming = new URL(request.url);

    const location =
      incoming.searchParams.get("location")?.trim() || "";

    const checkIn =
      incoming.searchParams.get("check_in") || "";

    const checkOut =
      incoming.searchParams.get("check_out") || "";

    const adults =
      incoming.searchParams.get("adults") || "2";

    const currency =
      incoming.searchParams.get("currency") || "EUR";

    if (!location) {
      return json(
        {
          error: "Missing required parameter: location"
        },
        400
      );
    }

    if (!checkIn) {
      return json(
        {
          error: "Missing required parameter: check_in"
        },
        400
      );
    }

    if (!checkOut) {
      return json(
        {
          error: "Missing required parameter: check_out"
        },
        400
      );
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(checkIn)) {
      return json(
        {
          error: `Invalid check_in date: ${checkIn}. Expected YYYY-MM-DD.`
        },
        400
      );
    }

    if (!datePattern.test(checkOut)) {
      return json(
        {
          error: `Invalid check_out date: ${checkOut}. Expected YYYY-MM-DD.`
        },
        400
      );
    }

    if (checkOut <= checkIn) {
      return json(
        {
          error: "check_out must be after check_in."
        },
        400
      );
    }

    const adultsNumber = Number(adults);

    if (
      !Number.isInteger(adultsNumber) ||
      adultsNumber < 1 ||
      adultsNumber > 10
    ) {
      return json(
        {
          error: "adults must be an integer between 1 and 10."
        },
        400
      );
    }

    const apiKey = env.STAYAPI_KEY;

    if (!apiKey) {
      return json(
        {
          error:
            "STAYAPI_KEY is missing in Cloudflare Pages environment variables."
        },
        500
      );
    }

    const params = new URLSearchParams();

    params.set("location", location);
    params.set("check_in", checkIn);
    params.set("check_out", checkOut);
    params.set("adults", String(adultsNumber));
    params.set("currency", currency);

    const upstreamUrl =
      `${STAYAPI_URL}?${params.toString()}`;

    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Accept": "application/json"
      }
    });

    const bodyText = await upstream.text();

    let body;

    try {
      body = JSON.parse(bodyText);
    } catch {
      body = {
        error: "StayAPI returned a non-JSON response.",
        status: upstream.status,
        raw: bodyText.slice(0, 1000)
      };
    }

    if (!upstream.ok) {
      return json(
        {
          error:
            body?.error ||
            body?.message ||
            `StayAPI request failed with HTTP ${upstream.status}.`,
          status: upstream.status,
          details: body
        },
        upstream.status
      );
    }

    return json(body, 200);

  } catch (error) {
    return json(
      {
        error: "Hotel search failed.",
        details: String(
          error?.message || error
        )
      },
      502
    );
  }
}
