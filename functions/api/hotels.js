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

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);

    const required = ["location", "check_in", "check_out"];
    for (const key of required) {
      if (!url.searchParams.get(key)) {
        return new Response(
          JSON.stringify({ error: `Missing parameter: ${key}` }),
          { status: 400, headers: corsHeaders() }
        );
      }
    }

    if (!env.STAYAPI_KEY) {
      return new Response(
        JSON.stringify({ error: "STAYAPI_KEY is not configured on the Worker." }),
        { status: 500, headers: corsHeaders() }
      );
    }

    const params = new URLSearchParams({
      location: url.searchParams.get("location"),
      check_in: url.searchParams.get("check_in"),
      check_out: url.searchParams.get("check_out"),
      adults: url.searchParams.get("adults") || "2",
      currency: url.searchParams.get("currency") || "EUR"
    });

    const minRating = url.searchParams.get("min_rating");
    if (minRating) params.set("min_rating", minRating);

    const upstream = await fetch(`${STAYAPI_URL}?${params}`, {
      headers: {
        "X-API-Key": env.STAYAPI_KEY,
        "Accept": "application/json"
      }
    });

    const body = await upstream.text();

    // IMPORTANT: do not slice, rank, or otherwise truncate `hotels`.
    // StayAPI documents `hotels` as the result array and `total_count` as
    // the total number found.
    return new Response(body, {
      status: upstream.status,
      headers: corsHeaders()
    });
  }
};
