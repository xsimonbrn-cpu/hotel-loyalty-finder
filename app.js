/* Hotel Loyalty – complete app.js replacement */
const API_BASE_URL = "https://hotel-loyalty-finder.pages.dev";
const API_URL = `${API_BASE_URL}/api/hotels`;

const LOYALTY_PROGRAMS = {
  "Hilton Honors": ["Member", "Silver", "Gold", "Diamond", "Diamond Reserve"],
  "Marriott Bonvoy": ["Member", "Silver Elite", "Gold Elite", "Platinum Elite", "Titanium Elite"],
  "IHG One Rewards": ["Club Member", "Silver Elite", "Gold Elite", "Platinum Elite", "Diamond Elite"],
  "ALL - Accor Live Limitless": ["Classic", "Silver", "Gold", "Platinum", "Diamond"],
  "Radisson Rewards": ["Club", "Premium", "VIP"],
  "MeliáRewards": ["White", "Silver", "Gold", "Platinum"],
  "GHA DISCOVERY": ["Silver", "Gold", "Platinum", "Titanium"],
  "Wyndham Rewards": ["Blue", "Gold", "Platinum", "Diamond"],
  "WorldHotels Rewards": ["Red", "Gold", "Platinum", "Diamond", "Diamond Select"],
  "Best Western Rewards": ["Blue", "Gold", "Platinum", "Diamond", "Diamond Select"]
};

const PERSONAL_STATUS = {
  "Hilton Honors": "Gold",
  "Marriott Bonvoy": "Platinum Elite",
  "IHG One Rewards": "Club Member",
  "ALL - Accor Live Limitless": "Silver",
  "Radisson Rewards": "Premium",
  "MeliáRewards": "Gold",
  "GHA DISCOVERY": "Gold",
  "Wyndham Rewards": "Gold",
  "WorldHotels Rewards": "Gold",
  "Best Western Rewards": "Gold"
};

const PERSONAL_POINTS = Object.fromEntries(Object.keys(LOYALTY_PROGRAMS).map(program => [program, 0]));
let amexOffers = [{ name: "WorldHotels", spend: 250, credit: 50 }];

/* Longer rules always win.  The final value is the loyalty programme, not the UI label. */
const PROGRAM_ALIASES = [
  ["Hilton Honors", "waldorf astoria", "conrad", "doubletree", "hilton garden inn", "hampton", "embassy suites", "canopy", "curio", "tapestry", "homewood suites", "home2 suites", "hilton"],
  ["Marriott Bonvoy", "ritz carlton", "st regis", "jw marriott", "w hotels", "edition", "sheraton", "westin", "renaissance", "le meridien", "autograph collection", "tribute portfolio", "courtyard", "four points", "moxy", "aloft", "ac hotel", "marriott"],
  ["IHG One Rewards", "intercontinental", "six senses", "regent", "kimpton", "vignette collection", "hotel indigo", "crowne plaza", "holiday inn express", "holiday inn", "voco"],
  ["ALL - Accor Live Limitless", "raffles", "fairmont", "sofitel", "mgallery", "pullman", "swissotel", "movenpick", "grand mercure", "novotel", "mercure", "adagio", "25hours", "mondrian", "the hoxton", "ibis"],
  ["Radisson Rewards", "radisson collection", "radisson blu", "radisson red", "park plaza", "park inn", "radisson"],
  ["MeliáRewards", "gran melia", "me by melia", "innside", "paradisus", "melia", "zel"],
  ["GHA DISCOVERY", "nh collection", "nh hotels", "nh hotel", "kempinski", "anantara", "capella", "tivoli", "avani", "viceroy"],
  ["Wyndham Rewards", "wyndham grand", "wyndham", "ramada encore", "ramada", "days inn", "super 8", "la quinta"],
  ["WorldHotels Rewards", "worldhotels"],
  ["Best Western Rewards", "best western premier", "best western plus", "best western"]
].flatMap(([program, ...aliases]) => aliases.map(alias => ({ program, alias }))).sort((a, b) => b.alias.length - a.alias.length);

const PROGRAM_TO_CHAIN = {
  "Hilton Honors": "Hilton", "Marriott Bonvoy": "Marriott", "IHG One Rewards": "IHG",
  "ALL - Accor Live Limitless": "Accor", "Radisson Rewards": "Radisson", "MeliáRewards": "Meliá",
  "GHA DISCOVERY": "GHA", "Wyndham Rewards": "Wyndham", "WorldHotels Rewards": "WorldHotels",
  "Best Western Rewards": "Best Western"
};

const state = { activePrograms: new Set(), amenities: new Set(), sort: "effective" };
let liveHotels = [];
let searchPerformed = false;
let liveTotalCount = 0;

const $ = id => document.getElementById(id);
const normaliseText = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const escapeHtml = value => String(value ?? "").replace(/[&<>'\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" }[character]));

function number(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function first(object, keys) {
  for (const key of keys) if (object && object[key] !== null && object[key] !== undefined) return object[key];
  return null;
}

function setDefaultDates() {
  const today = new Date();
  const checkIn = new Date(today); checkIn.setDate(today.getDate() + 7);
  const checkOut = new Date(today); checkOut.setDate(today.getDate() + 9);
  if ($("checkIn") && !$("checkIn").value) $("checkIn").value = checkIn.toISOString().slice(0, 10);
  if ($("checkOut") && !$("checkOut").value) $("checkOut").value = checkOut.toISOString().slice(0, 10);
}

function nights() {
  const start = new Date($("checkIn")?.value);
  const end = new Date($("checkOut")?.value);
  const result = Math.round((end - start) / 86400000);
  return Number.isFinite(result) && result > 0 ? result : 1;
}

function normalizeAmenities(hotel) {
  const raw = first(hotel, ["amenities", "facilities", "amenity"]) || [];
  if (typeof raw === "string") return raw.split(",").map(item => item.trim()).filter(Boolean);
  if (!Array.isArray(raw)) return [];
  return raw.map(item => typeof item === "string" ? item : first(item, ["name", "label", "title"]) || "").filter(Boolean);
}

function classifyHotel(hotel) {
  const metadata = [hotel.name, hotel.brand, hotel.chain, hotel.hotel_chain, hotel.hotel_brand, hotel.group, hotel.company, hotel.raw?.brand, hotel.raw?.chain].filter(Boolean).join(" ");
  const text = ` ${normaliseText(metadata)} `;
  const match = PROGRAM_ALIASES.find(rule => text.includes(` ${normaliseText(rule.alias)} `));
  return match ? { program: match.program, chain: PROGRAM_TO_CHAIN[match.program] } : { program: null, chain: "Other" };
}

function normalizeHotel(raw) {
  const price = raw.price || {};
  const rating = raw.rating || {};
  const images = Array.isArray(raw.images) ? raw.images : [];
  const imageValue = images[0];
  const image = typeof imageValue === "string" ? imageValue : first(imageValue, ["url", "src", "image_url"]) || first(raw, ["image", "image_url", "photo", "thumbnail"]);
  const nightly = number(price.price_per_night ?? price.current ?? price.nightly);
  const suppliedTotal = number(price.total_price ?? price.total);
  const total = suppliedTotal ?? (nightly === null ? null : nightly * nights());
  const hotel = {
    raw, id: raw.hotel_id ?? raw.id ?? `${raw.name || "hotel"}-${raw.location?.address || ""}`,
    name: String(raw.name || "Unnamed hotel"), image, total, nightly,
    currency: price.currency || raw.currency || "EUR",
    rating: number(rating.value ?? raw.overall_rating ?? raw.rating_value ?? raw.score),
    reviewCount: number(rating.votes ?? raw.reviews ?? raw.review_count),
    stars: number(raw.stars ?? raw.hotel_class), amenities: normalizeAmenities(raw),
    address: raw.location?.address ?? raw.address ?? "",
    bookingUrl: first(raw, ["booking_url", "url", "website", "link"])
  };
  return { ...hotel, ...classifyHotel(hotel) };
}

function extractHotels(payload) {
  const candidates = [payload?.hotels, payload?.data?.hotels, payload?.properties, payload?.data?.properties, payload?.results, payload?.data?.results, Array.isArray(payload?.data) ? payload.data : null];
  return candidates.find(Array.isArray) || [];
}

function deduplicateHotels(hotels) {
  const seen = new Set();
  return hotels.filter(hotel => {
    const key = String(hotel.id || `${hotel.name}|${hotel.address}`).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}

function filterHotels(hotels) {
  return hotels.filter(hotel => {
    if (state.activePrograms.size && !state.activePrograms.has(hotel.program)) return false;
    return [...state.amenities].every(required => hotel.amenities.some(amenity => normaliseText(amenity).includes(normaliseText(required))));
  });
}

function sortHotels(hotels) {
  return [...hotels].sort((a, b) => {
    if (state.sort === "rating") return (b.rating ?? -Infinity) - (a.rating ?? -Infinity);
    if (state.sort === "price") return (a.total ?? Infinity) - (b.total ?? Infinity);
    return (a.total ?? Infinity) - (b.total ?? Infinity);
  });
}

function resultsContainer() {
  return $("results") || $("hotelResults") || $("resultsGrid") || document.querySelector(".results-grid") || document.querySelector(".results-list");
}

function renderResults() {
  const container = resultsContainer();
  if (!container) return;
  const shown = sortHotels(filterHotels(liveHotels));
  const meta = $("resultsMeta") || $("resultMeta") || $("resultCount") || $("resultsCount");
  const emptyState = $("emptyState");
  if (emptyState) emptyState.hidden = searchPerformed;
  if (meta) meta.textContent = searchPerformed ? `${liveTotalCount} found · ${shown.length} shown` : "";
  const filterCount = $("activeFilterCount");
  if (filterCount) {
    const count = state.activePrograms.size + state.amenities.size;
    filterCount.textContent = count ? `${count} filter${count === 1 ? "" : "s"} active` : "No filters";
  }
  if (!shown.length) {
    container.innerHTML = searchPerformed ? '<p class="empty-results">No hotels match these filters.</p>' : "";
    return;
  }
  container.innerHTML = shown.map(hotel => {
    const price = hotel.total === null ? "Price unavailable" : new Intl.NumberFormat("en-GB", { style: "currency", currency: hotel.currency, maximumFractionDigits: 0 }).format(hotel.total);
    const rating = hotel.rating === null ? "" : `<span class="hotel-rating">★ ${escapeHtml(hotel.rating)}${hotel.reviewCount ? ` (${escapeHtml(hotel.reviewCount)})` : ""}</span>`;
    const program = hotel.program ? `<span class="hotel-program">${escapeHtml(hotel.program)} · ${escapeHtml(PERSONAL_STATUS[hotel.program] || "Member")}</span>` : '<span class="hotel-program hotel-program-other">Independent hotel</span>';
    const image = hotel.image ? `<img class="hotel-image" src="${escapeHtml(hotel.image)}" alt="" loading="lazy">` : "";
    const amenities = hotel.amenities.slice(0, 5).map(item => `<span class="amenity">${escapeHtml(item)}</span>`).join("");
    const link = /^https?:\/\//i.test(hotel.bookingUrl || "") ? `<a class="hotel-link" href="${escapeHtml(hotel.bookingUrl)}" target="_blank" rel="noopener">View hotel</a>` : "";
    return `<article class="hotel-card">${image}<div class="hotel-card-body"><div class="hotel-card-top"><div><h3>${escapeHtml(hotel.name)}</h3><p class="hotel-address">${escapeHtml(hotel.address)}</p></div><div class="hotel-price">${price}<small>${hotel.nightly !== null ? ` · ${new Intl.NumberFormat("en-GB", { style: "currency", currency: hotel.currency, maximumFractionDigits: 0 }).format(hotel.nightly)} / night` : ""}</small></div></div>${rating}${program}<div class="hotel-amenities">${amenities}</div>${link}</div></article>`;
  }).join("");
}

function readFilterInputs() {
  state.activePrograms.clear(); state.amenities.clear();
  /* The original markup has no stable wrapper on every checkbox, so read every
     checkbox by its declared value instead of relying on a CSS class. */
  document.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
    if (input.dataset.type === "amenity") state.amenities.add(input.value);
    else {
      const program = Object.entries(PROGRAM_TO_CHAIN).find(([, chain]) => normaliseText(chain) === normaliseText(input.value))?.[0] || (LOYALTY_PROGRAMS[input.value] ? input.value : null);
      if (program) state.activePrograms.add(program);
    }
  });
}

function setLoading(isLoading) {
  const button = $("searchButton");
  if (button) { button.disabled = isLoading; button.textContent = isLoading ? "Searching…" : "Search"; }
}

async function searchLive() {
  const location = $("city")?.value.trim() || "";
  const checkIn = $("checkIn")?.value || "";
  const checkOut = $("checkOut")?.value || "";
  const adults = $("guests")?.value || "2";
  if (!location || !checkIn || !checkOut) { alert("Please enter a city, check-in date and check-out date."); return; }
  if (checkOut <= checkIn) { alert("Check-out must be after check-in."); return; }
  setLoading(true);
  try {
    const params = new URLSearchParams({ location, check_in: checkIn, check_out: checkOut, adults, currency: "EUR" });
    const response = await fetch(`${API_URL}?${params.toString()}`, { headers: { Accept: "application/json" } });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || payload.message || `Search failed (${response.status}).`);
    const records = extractHotels(payload).map(normalizeHotel);
    liveHotels = deduplicateHotels(records);
    liveTotalCount = number(payload.total_count ?? payload.data?.total_count) ?? liveHotels.length;
    searchPerformed = true;
    renderResults();
  } catch (error) {
    searchPerformed = true; liveHotels = []; liveTotalCount = 0; renderResults();
    const meta = $("resultsMeta") || $("resultMeta") || $("resultCount") || $("resultsCount");
    if (meta) meta.textContent = error.message || "Hotel search failed.";
  } finally { setLoading(false); }
}

function setup() {
  setDefaultDates();
  /* The supplied index.html contains a Hampton sample card.  It is not an API
     result and must not be mistaken for one or survive a filtered search. */
  const initialResults = resultsContainer();
  if (initialResults) initialResults.innerHTML = "";
  $("searchButton")?.addEventListener("click", searchLive);
  $("openFilters")?.addEventListener("click", () => {
    const drawer = $("filterDrawer");
    if (drawer) {
      /* Existing style.css opens the drawer with .open; keep .is-open too for
         installations that use the newer selector. */
      drawer.classList.add("open", "is-open");
      drawer.style.transform = "translateX(0)";
      drawer.style.pointerEvents = "auto";
      drawer.setAttribute("aria-hidden", "false");
    }
  });
  $("closeFilters")?.addEventListener("click", () => {
    const drawer = $("filterDrawer");
    if (drawer) {
      drawer.classList.remove("open", "is-open");
      drawer.style.removeProperty("transform");
      drawer.style.removeProperty("pointer-events");
      drawer.setAttribute("aria-hidden", "true");
    }
  });
  document.querySelectorAll('input[type="checkbox"]').forEach(input => input.addEventListener("change", () => { readFilterInputs(); renderResults(); }));
  $("sort")?.addEventListener("change", event => { state.sort = event.target.value; renderResults(); });
  $("sortSelect")?.addEventListener("change", event => { state.sort = event.target.value; renderResults(); });
}

document.addEventListener("DOMContentLoaded", setup);
