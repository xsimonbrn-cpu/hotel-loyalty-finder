/* Cloudflare Pages Function: functions/api/hotels.js
   Free hotel discovery via OpenStreetMap. No StayAPI key is required. */
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const USER_AGENT = "Hotel-Loyalty-Finder/1.0 (hotel discovery)";

function headers() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=900"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: headers() });
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function address(tags = {}) {
  const street = [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" ");
  const place = [tags["addr:postcode"], tags["addr:city"]].filter(Boolean).join(" ");
  return [street, place, tags["addr:country"]].filter(Boolean).join(", ") || null;
}

function amenities(tags = {}) {
  const result = [];
  const add = (name, condition) => { if (condition) result.push(name); };
  add("Pool", /pool|swimming/i.test(`${tags.leisure || ""} ${tags["leisure:swimming_pool"] || ""} ${tags["contact:website"] || ""}`));
  add("Spa", /spa/i.test(`${tags.spa || ""} ${tags.wellness || ""}`));
  add("Fitness", /fitness|gym/i.test(`${tags.fitness_centre || ""} ${tags.gym || ""}`));
  add("Breakfast", /yes|free|included/i.test(`${tags.breakfast || ""} ${tags["breakfast:included"] || ""}`));
  add("Parking", /yes|surface|underground|multi-storey/i.test(String(tags.parking || tags["parking:condition"] || "")));
  add("Restaurant", Boolean(tags.restaurant || tags["amenity:restaurant"]));
  add("Bar", Boolean(tags.bar || tags["amenity:bar"]));
  return result;
}

function normalizeElement(element) {
  const tags = element.tags || {};
  return {
    hotel_id: `osm/${element.type}/${element.id}`,
    name: tags.name || tags["name:en"] || "Unnamed hotel",
    brand: tags.brand || tags.operator || tags["brand:wikidata"] || null,
    chain: tags.operator || tags.brand || null,
    location: { address: address(tags), latitude: element.lat ?? element.center?.lat ?? null, longitude: element.lon ?? element.center?.lon ?? null },
    price: { current: null, total_price: null, currency: "EUR" },
    rating: { value: null, votes: null },
    stars: Number(tags.stars) || null,
    amenities: amenities(tags),
    images: tags.image ? [tags.image] : [],
    booking_url: tags.website || tags["contact:website"] || null,
    source: "OpenStreetMap"
  };
}

export async function onRequest(context) {
  const { request } = context;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers() });
  if (request.method !== "GET") return json({ error: "Method not allowed." }, 405);

  const incoming = new URL(request.url);
  const location = incoming.searchParams.get("location")?.trim() || "";
  const checkIn = incoming.searchParams.get("check_in") || "";
  const checkOut = incoming.searchParams.get("check_out") || "";
  if (!location) return json({ error: "Missing required parameter: location." }, 400);
  if (!validDate(checkIn) || !validDate(checkOut) || checkOut <= checkIn) return json({ error: "Please provide valid check-in and check-out dates." }, 400);

  /* Cache identical city searches for 15 minutes; local filter changes do not
     make a further request to either public OSM service. */
  const cache = caches.default;
  const cacheKey = new Request(incoming.toString(), { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return new Response(cached.body, { status: 200, headers: headers() });

  try {
    const geocodeParams = new URLSearchParams({ q: location, format: "jsonv2", limit: "1", addressdetails: "0" });
    const geocode = await fetch(`${NOMINATIM_URL}?${geocodeParams}`, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } });
    const places = await geocode.json();
    if (!geocode.ok || !Array.isArray(places) || !places.length) return json({ error: `Location not found: ${location}.` }, 404);
    const latitude = Number(places[0].lat);
    const longitude = Number(places[0].lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return json({ error: `Location not found: ${location}.` }, 404);

    /* Includes nodes, ways and relations; no result limit is requested. */
    const query = `[out:json][timeout:45];(nwr["tourism"="hotel"](around:20000,${latitude},${longitude});nwr["tourism"="motel"](around:20000,${latitude},${longitude}););out center tags;`;
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "User-Agent": USER_AGENT, "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({ data: query }).toString()
    });
    const body = await response.json();
    if (!response.ok || !Array.isArray(body.elements)) return json({ error: "OpenStreetMap hotel search is temporarily unavailable." }, 502);

    const seen = new Set();
    const hotels = body.elements.map(normalizeElement).filter(hotel => {
      const key = `${hotel.name}|${hotel.location.address || ""}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    const payload = { location, check_in: checkIn, check_out: checkOut, hotels, total_count: hotels.length, search_metadata: { source: "OpenStreetMap", pricing: "not included" } };
    context.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(payload), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=900" } })));
    return json(payload);
  } catch (error) {
    return json({ error: "Free hotel search is temporarily unavailable.", details: String(error?.message || error) }, 502);
  }
}
