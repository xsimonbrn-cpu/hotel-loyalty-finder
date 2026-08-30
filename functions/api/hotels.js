export async function onRequestGet(context) {
  const { request, env } = context;

  const url = new URL(request.url);

  const location = url.searchParams.get("location");
  const check_in = url.searchParams.get("check_in");
  const check_out = url.searchParams.get("check_out");
  const adults = url.searchParams.get("adults") || "2";
  const currency = url.searchParams.get("currency") || "EUR";

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=UTF-8"
  };

  if (!location || !check_in || !check_out) {
    return new Response(
      JSON.stringify({
        error: "Missing location, check_in or check_out"
      }),
      {
        status: 400,
        headers: corsHeaders
      }
    );
  }

  if (!env.STAYAPI_KEY) {
    return new Response(
      JSON.stringify({
        error: "STAYAPI_KEY is not configured"
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }

  const params = new URLSearchParams({
    location,
    check_in,
    check_out,
    adults,
    currency
  });

  try {
    const response = await fetch(
      `https://api.stayapi.com/v1/google_hotels/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": env.STAYAPI_KEY,
          "Accept": "application/json"
        }
      }
    );

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "StayAPI request failed",
        details: error.message
      }),
      {
        status: 502,
        headers: corsHeaders
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
