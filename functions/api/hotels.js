/* Cloudflare Pages Function: functions/api/hotels.js */
const STAYAPI_URL = "https://api.stayapi.com/v1/google_hotels/search";

function headers() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: headers() });
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers() });
  if (request.method !== "GET") return json({ error: "Method not allowed." }, 405);

  const incoming = new URL(request.url);
  const location = incoming.searchParams.get("location")?.trim() || "";
  const checkIn = incoming.searchParams.get("check_in") || "";
  const checkOut = incoming.searchParams.get("check_out") || "";
  const adults = Number(incoming.searchParams.get("adults") || "2");
  const currency = (incoming.searchParams.get("currency") || "EUR").trim().toUpperCase();
  const minRating = incoming.searchParams.get("min_rating");

  if (!location) return json({ error: "Missing required parameter: location." }, 400);
  if (!validDate(checkIn) || !validDate(checkOut)) return json({ error: "check_in and check_out must use YYYY-MM-DD." }, 400);
  if (checkOut <= checkIn) return json({ error: "check_out must be after check_in." }, 400);
  if (!Number.isInteger(adults) || adults < 1 || adults > 10) return json({ error: "adults must be an integer between 1 and 10." }, 400);
  if (!/^[A-Z]{3}$/.test(currency)) return json({ error: "currency must be a three-letter currency code." }, 400);
  if (!env.STAYAPI_KEY) return json({ error: "STAYAPI_KEY is missing from the Cloudflare Pages environment variables." }, 500);

  const params = new URLSearchParams({ location, check_in: checkIn, check_out: checkOut, adults: String(adults), currency });
  if (minRating !== null && /^([1-4](\.\d+)?|5(\.0+)?)$/.test(minRating)) params.set("min_rating", minRating);

  try {
    const upstream = await fetch(`${STAYAPI_URL}?${params}`, { headers: { "X-API-Key": env.STAYAPI_KEY, Accept: "application/json" } });
    const text = await upstream.text();
    let body;
    try { body = JSON.parse(text); } catch { body = { error: "StayAPI returned a non-JSON response." }; }
    if (!upstream.ok) return json({ error: body.error || body.message || `StayAPI request failed (${upstream.status}).`, details: body }, upstream.status);

    /* Do not slice, map, or otherwise cap body.hotels here.  The entire documented response is passed through. */
    return json(body);
  } catch (error) {
    return json({ error: "Hotel search failed.", details: String(error?.message || error) }, 502);
  }
}
