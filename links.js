export async function onRequestGet(context) {
  const { request, env } = context;

  const url =
    new URL(request.url);

  const hotelName =
    url.searchParams.get(
      "hotel_name"
    );

  const location =
    url.searchParams.get(
      "location"
    );

  const headers = {
    "Access-Control-Allow-Origin":
      "*",
    "Access-Control-Allow-Methods":
      "GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type",
    "Content-Type":
      "application/json; charset=UTF-8"
  };

  if (!hotelName) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          "Missing hotel_name"
      }),
      {
        status: 400,
        headers
      }
    );
  }

  if (!env.STAYAPI_KEY) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          "STAYAPI_KEY is not configured"
      }),
      {
        status: 500,
        headers
      }
    );
  }

  const params =
    new URLSearchParams({
      hotel_name:
        hotelName
    });

  if (location) {
    params.set(
      "location",
      location
    );
  }

  try {
    const response =
      await fetch(
        `https://api.stayapi.com/v1/meta/search?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "X-API-Key":
              env.STAYAPI_KEY,
            "Accept":
              "application/json"
          }
        }
      );

    const text =
      await response.text();

    return new Response(
      text,
      {
        status:
          response.status,
        headers
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          "StayAPI meta search failed",
        details:
          error.message
      }),
      {
        status: 502,
        headers
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(
    null,
    {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin":
          "*",
        "Access-Control-Allow-Methods":
          "GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type"
      }
    }
  );
}
