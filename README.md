# S.M.B. HOTEL LOYALTY

Current app build with:

- Live Google Hotels search via SerpApi
- Up to 20 pages / up to roughly 400 live properties when pagination is available
- City, country and region searches such as `Frankfurt`, `Germany` or `Europe`
- Loyalty-program expansion searches for Hilton, Marriott, IHG, Accor, Radisson, Meliá, GHA, Wyndham, WorldHotels and Best Western
- Real hotel category / star filtering using Google Hotels `hotel_class`
- Structured Pool / Spa / Sauna / Fitness / Breakfast / Parking / Restaurant / Bar filtering
- Hotel programme, brand and personal status shown on every classified hotel
- Personal points shown where a programme is detected and points are saved
- Meaningful loyalty benefits prioritised: free breakfast, lounge, early/late check-out, upgrades and welcome gifts/amenities
- Official hotel website links preferred from the Google Hotels property `link`
- Additional booking-provider lookup through `/api/links`
- Favorites with persistent local records and remove controls
- Compare for up to three hotels with remove controls
- Modern Leaflet/CARTO map
- Pagination with 20 hotels per page
- Local profile, loyalty status, points, saved filters and search defaults

## Cloudflare

Set the secret:

`SERPAPI_KEY`

Optional for additional booking-provider links:

`STAYAPI_KEY`

Deploy as a Cloudflare Pages project. The functions live in `functions/api/`.

## Important search behaviour

Google Hotels returns a finite ranked result set. The app now follows the `next_page_token` repeatedly and can request up to 20 pages. For a single loyalty programme or amenity filter, the app also expands the live query (for example `Germany Hilton hotels` or `Germany hotels with sauna`) and applies the exact structured filter to the returned properties.

This gives substantially broader coverage, but no third-party search API can guarantee a literal census of every hotel in a whole continent in one request.

## Local accounts

The current account/profile is local to the browser. A real multi-device authentication/database layer can be added later without replacing the UI architecture.
