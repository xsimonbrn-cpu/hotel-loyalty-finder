# S.M.B. Hotel Loyalty — V12

Cloudflare Pages project.

## Secrets
Set these as Cloudflare Pages/Functions environment secrets — never put them in frontend files:

- `SERPAPI_KEY` — used by `functions/api/hotels.js`
- `STAYAPI_KEY` — used by `functions/api/links.js`

## Structure
- `index.html` — app shell
- `style.css` — UI
- `app.js` — frontend state, filters, loyalty benefits, offers, favorites and compare
- `functions/api/hotels.js` — Google Hotels / SerpApi search proxy
- `functions/api/links.js` — StayAPI hotel metadata proxy
- `logo.png` — S.M.B. logo

## V12 personal offers
Amex Offers are stored locally in the browser. A user can add an offer such as `€200 spend → €50 back`, edit it, activate/deactivate it and remove it. The MeliáRewards 20% personal offer is also available as a toggle. Active offers are used in the effective-price calculation only where the offer matches and its spend threshold is met.
