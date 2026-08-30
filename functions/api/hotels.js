const STAYAPI_URL = "https://api.stayapi.com/v1/google_hotels/search";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };
}

export async function onRequest(context) {
  const request = context.request;
  const env = context.env;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  const incoming = new URL(request.url);

  const location = incoming.searchParams.get("location")?.trim();
  const checkIn = incoming.searchParams.get("check_in");
  const checkOut = incoming.searchParams.get("check_out");
  const adults = incoming.searchParams.get("adults") || "2";
  const currency = incoming.searchParams.get("currency") || "EUR";

  if (!location || !checkIn || !checkOut) {
    return new Response(
      JSON.stringify({
        error: "Missing required parameters: location, check_in, check_out"
      }),
      { status: 400, headers: corsHeaders() }
    );
  }

  const apiKey = env.STAYAPI_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "STAYAPI_KEY is missing in Cloudflare Pages environment variables."
      }),
      { status: 500, headers: corsHeaders() }
    );
  }

  const upstreamUrl = new URL(STAYAPI_URL);
  upstreamUrl.searchParams.set("location", location);
  upstreamUrl.searchParams.set("check_in", checkIn);
  upstreamUrl.searchParams.set("check_out", checkOut);
  upstreamUrl.searchParams.set("adults", adults);
  upstreamUrl.searchParams.set("currency", currency);

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Accept": "application/json"
      }
    });

    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: corsHeaders()
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "StayAPI request failed.",
        details: String(error?.message || error)
      }),
      { status: 502, headers: corsHeaders() }
    );
  }
}
      headers: corsHeaders()
    });
  }
};
