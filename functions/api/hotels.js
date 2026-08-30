/* Cloudflare Pages Function: S.M.B. HOTEL LOYALTY
 * SERPAPI_KEY required.
 * Uses Google Hotels pagination and optional query expansion for loyalty-program searches.
 */
const SERPAPI_URL = "https://serpapi.com/search.json";

const PROGRAM_QUERIES = {
  "Hilton Honors": "Hilton hotels",
  "Marriott Bonvoy": "Marriott Bonvoy hotels",
  "IHG One Rewards": "IHG hotels",
  "ALL - Accor Live Limitless": "Accor hotels",
  "Radisson Rewards": "Radisson hotels",
  "MeliáRewards": "Meliá hotels",
  "GHA DISCOVERY": "GHA Discovery hotels",
  "Wyndham Rewards": "Wyndham hotels",
  "WorldHotels Rewards": "WorldHotels",
  "Best Western Rewards": "Best Western hotels"
};

const AMENITY_PATTERNS = {
  Pool: /\bpool\b|swimming pool|indoor pool|outdoor pool|infinity pool|rooftop pool/i,
  Spa: /\bspa\b|wellness|wellness centre|wellness center|massage|thermal bath|thermal spa/i,
  Sauna: /\bsauna\b|steam room|steam bath|hammam|hamam|infrared sauna/i,
  Fitness: /fitness|gym|fitness centre|fitness center|workout/i,
  Breakfast: /breakfast|continental breakfast|buffet breakfast/i,
  Parking: /parking|car park|garage|valet parking|private parking/i,
  Restaurant: /restaurant|dining room|fine dining/i,
  Bar: /\bbar\b|cocktail bar|lounge bar/i
};

function headers() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=900"
  };
}
function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: headers() }); }
function clean(v) { return String(v ?? "").replace(/\s+/g, " ").trim(); }
function http(v) { return typeof v === "string" && /^https?:\/\//i.test(v.trim()) ? v.trim() : null; }
function first(o, keys) { for (const k of keys) if (o && o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k]; return null; }
function num(v) {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "object") return num(first(v, ["extracted_lowest", "extracted_price", "extracted_total", "lowest", "price", "total", "value"]));
  const s = String(v).replace(/[^\d.,-]/g, "").trim();
  if (!s) return null;
  let t = s;
  if (t.includes(",") && t.includes(".")) t = t.lastIndexOf(",") > t.lastIndexOf(".") ? t.replace(/\./g, "").replace(",", ".") : t.replace(/,/g, "");
  else if (t.includes(",")) t = t.split(",").length === 2 && t.split(",")[1].length <= 2 ? t.replace(",", ".") : t.replace(/,/g, "");
  else if (t.includes(".")) { const p = t.split("."); if (p.length === 2 && p[1].length === 3) t = t.replace(".", ""); }
  const n = Number(t); return Number.isFinite(n) ? n : null;
}
function nights(a,b) { return Math.max(1, Math.round((new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)) / 86400000)); }
function dateOK(v) { return /^\d{4}-\d{2}-\d{2}$/.test(v); }
function address(p) {
  const a = p?.address ?? p?.location ?? p?.formatted_address;
  if (typeof a === "string") return clean(a);
  if (a && typeof a === "object") return clean([a.street, a.street_address, a.housenumber, a.city, a.postal_code, a.zip, a.country].filter(Boolean).join(", ")) || null;
  return null;
}
function collectText(p) {
  const out = [];
  const add = v => { if (!v) return; if (typeof v === "string") out.push(v); else if (Array.isArray(v)) v.forEach(add); else if (typeof v === "object") Object.values(v).forEach(add); };
  add(p.amenities);
  add(p.amenities_text);
  add(p.hotel_amenities);
  add(p.facilities);
  add(p.facilities_text);
  add(p.description);
  if (p.amenities_detailed?.groups) {
    for (const group of p.amenities_detailed.groups) {
      for (const item of (group?.list || [])) {
        if (item?.available !== false) add([item?.title, item?.label, item?.details?.snippet]);
      }
    }
  }
  return out.join(" | ");
}
function positiveAmenityText(value) {
  const text = clean(value);
  if (!text) return "";
  if (/^(no|not|without|unavailable)\b/i.test(text)) return "";
  if (/\b(no|not available|unavailable|not offered)\b.*\b(pool|spa|sauna|steam|gym|fitness|breakfast|parking|restaurant|bar)\b/i.test(text)) return "";
  return text;
}
function amenities(p) {
  const values = [];
  const raw = p?.amenities;
  if (Array.isArray(raw)) for (const item of raw) {
    const text = typeof item === "string" ? item : first(item, ["name", "label", "title", "text"]);
    const positive = positiveAmenityText(text);
    if (positive) values.push(positive);
  }
  if (p?.amenities_detailed?.groups) {
    for (const group of p.amenities_detailed.groups) for (const item of (group?.list || [])) {
      if (item?.available === false) continue;
      const positive = positiveAmenityText([item?.title, item?.label].filter(Boolean).join(" "));
      if (positive) values.push(positive);
    }
  }
  values.push(positiveAmenityText(p?.amenities_text), positiveAmenityText(p?.hotel_amenities), positiveAmenityText(p?.facilities), positiveAmenityText(p?.facilities_text), positiveAmenityText(p?.description));
  const text = values.filter(Boolean).join(" | ");
  return Object.entries(AMENITY_PATTERNS).filter(([, rx]) => rx.test(text)).map(([name]) => name);
}
function starValue(p) { return num(p?.extracted_hotel_class ?? p?.hotel_class ?? p?.star_rating ?? p?.stars); }
function urls(p) {
  // SerpApi documents `link` as the property's website. Prefer it over meta/OTA links.
  const official = http(first(p, ["official_website", "official_website_url", "hotel_website", "website", "website_url", "link"]));
  let provider = null;
  for (const x of [p?.prices, p?.booking_options, p?.providers]) {
    if (!Array.isArray(x)) continue;
    for (const item of x) {
      const u = http(first(item, ["link", "url", "booking_url"]));
      if (u) { provider = u; break; }
    }
    if (provider) break;
  }
  return { official, provider };
}
function normalize(p, ci, co) {
  const n = nights(ci, co);
  const rate = num(p?.rate_per_night ?? p?.price_per_night ?? p?.extracted_price ?? p?.price);
  const total = num(p?.total_rate ?? p?.total_price ?? p?.extracted_total ?? p?.total) ?? (rate == null ? null : rate * n);
  const nightly = rate ?? (total == null ? null : total / n);
  const u = urls(p);
  const images = Array.isArray(p?.images) ? p.images.map(x => typeof x === "string" ? x : first(x, ["original_image", "thumbnail", "url", "image"])).filter(Boolean) : [];
  const id = p?.property_token || p?.place_id || p?.id || `${p?.name || "hotel"}|${address(p) || ""}`;
  return {
    hotel_id: String(id), property_token: p?.property_token || null, place_id: p?.place_id || null,
    name: clean(p?.name || p?.hotel_name || p?.title) || "Unnamed hotel",
    brand: clean(p?.brand || p?.brand_name || p?.chain || p?.chain_name) || null,
    chain: clean(p?.chain || p?.chain_name || p?.brand || p?.brand_name) || null,
    location: { address: address(p), latitude: num(p?.gps_coordinates?.latitude ?? p?.latitude), longitude: num(p?.gps_coordinates?.longitude ?? p?.longitude) },
    price: { current: nightly, price_per_night: nightly, total_price: total, currency: "EUR" },
    rating: { value: num(p?.overall_rating ?? p?.rating), votes: num(p?.reviews ?? p?.review_count ?? p?.ratings_count) },
    stars: starValue(p), hotel_class: clean(p?.hotel_class) || null,
    amenities: amenities(p), amenities_source_text: collectText(p),
    images, thumbnail: images[0] || p?.thumbnail || null,
    official_url: u.official, booking_url: u.provider, hotel_url: u.official, url: u.official || u.provider,
    description: clean(p?.description) || null,
    check_in_time: p?.check_in_time || null, check_out_time: p?.check_out_time || null,
    sponsored: Boolean(p?.sponsored), source: "Google Hotels / SerpApi"
  };
}
function dedupe(items) {
  const map = new Map();
  for (const h of items) {
    const key = String(h.hotel_id || `${h.name}|${h.location?.address || ""}`).toLowerCase();
    const old = map.get(key);
    if (!old || score(h) > score(old)) map.set(key, h);
  }
  return [...map.values()];
}
function score(h) { return (h.price?.total_price != null ? 5 : 0) + (h.images?.length ? 3 : 0) + (h.amenities?.length ? 3 : 0) + (h.stars ? 2 : 0) + (h.rating?.value ? 2 : 0) + (h.official_url ? 2 : 0); }
async function serp(params, key) {
  const u = new URL(SERPAPI_URL); u.searchParams.set("engine", "google_hotels"); u.searchParams.set("api_key", key);
  for (const [k,v] of Object.entries(params)) if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, String(v));
  const r = await fetch(u, { headers: { Accept: "application/json" } });
  const text = await r.text(); let d; try { d = JSON.parse(text); } catch { throw new Error("SerpApi returned invalid JSON"); }
  if (!r.ok || d?.error) throw new Error(d?.error || `SerpApi request failed (${r.status})`);
  return d;
}

export async function onRequest(context) {
  const { request, env, waitUntil } = context;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers() });
  if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);
  const q = new URL(request.url).searchParams;
  const location = clean(q.get("location"));
  const checkIn = q.get("check_in") || "", checkOut = q.get("check_out") || "";
  const adults = Math.max(1, Math.min(20, Number(q.get("adults") || 2)));
  const requestedPages = Math.max(1, Math.min(20, Number(q.get("pages") || 15)));
  const program = clean(q.get("program"));
  const stars = clean(q.get("stars"));
  const amenityFilter = clean(q.get("amenities"));
  if (!location) return json({ error: "Missing required parameter: location." }, 400);
  if (!dateOK(checkIn) || !dateOK(checkOut) || checkOut <= checkIn) return json({ error: "Please provide valid check-in and check-out dates." }, 400);
  if (!env?.SERPAPI_KEY) return json({ error: "SERPAPI_KEY is missing in Cloudflare environment variables." }, 500);

  const cache = caches.default;
  const cacheKey = new Request(request.url, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return new Response(cached.body, { status: cached.status, headers: headers() });

  try {
    const base = { check_in_date: checkIn, check_out_date: checkOut, adults, currency: "EUR", gl: "de", hl: "en" };
    const amenityWords = amenityFilter ? amenityFilter.split(",").map(x => clean(x)).filter(Boolean).join(" ") : "";
    const query = [location, program && PROGRAM_QUERIES[program] ? PROGRAM_QUERIES[program] : "hotels", amenityWords && `with ${amenityWords.toLowerCase()}`].filter(Boolean).join(" ");
    const all = [];
    let token = null, pagesFetched = 0;
    for (let page = 1; page <= requestedPages; page++) {
      const params = { ...base, q: query };
      if (stars === "3") params.hotel_class = "3,4,5";
      if (stars === "4") params.hotel_class = "4,5";
      if (stars === "5") params.hotel_class = "5";
      if (token) params.next_page_token = token;
      const d = await serp(params, env.SERPAPI_KEY);
      pagesFetched++;
      if (Array.isArray(d?.properties)) all.push(...d.properties);
      if (Array.isArray(d?.hotels)) all.push(...d.hotels);
      // Keep non-matching properties too: Google can return them when active API filters are used.
      if (Array.isArray(d?.non_matching_properties)) all.push(...d.non_matching_properties);
      token = d?.serpapi_pagination?.next_page_token || null;
      if (!token) break;
    }
    const hotels = dedupe(all.map(p => normalize(p, checkIn, checkOut)));
    const payload = {
      location, check_in: checkIn, check_out: checkOut, adults, currency: "EUR", hotels,
      total_count: hotels.length, pages_requested: requestedPages, pages_fetched: pagesFetched,
      search_metadata: { source: "Google Hotels via SerpApi", pagination: true, official_hotel_links: true, expanded_query: query, max_pages: 20 }
    };
    const response = new Response(JSON.stringify(payload), { status: 200, headers: { ...headers(), "Cache-Control": "public, max-age=900" } });
    if (typeof waitUntil === "function") waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    console.error("Hotel search error", error);
    return json({ error: "Hotel search failed.", details: String(error?.message || error) }, 502);
  }
}
