const SERPAPI_URL="https://serpapi.com/search.json";
const PROGRAMS={
  "Hilton Honors":["Waldorf Astoria","Conrad","LXR","NoMad","Hilton","DoubleTree","Hilton Garden Inn","Hampton","Embassy Suites","Canopy","Curio Collection","Curio","Tapestry Collection","Tapestry","Homewood Suites","Home2 Suites","LivSmart Studios"],
  "Marriott Bonvoy":["Ritz-Carlton","St. Regis","JW Marriott","W Hotels","EDITION","The Luxury Collection","Marriott","Sheraton","Westin","Renaissance","Le Méridien","Autograph Collection","Tribute Portfolio","Courtyard","Four Points","Moxy","Aloft","AC Hotels","Element","Residence Inn","SpringHill Suites","TownePlace Suites","Fairfield by Marriott"],
  "IHG One Rewards":["InterContinental","Six Senses","Regent","Kimpton","Vignette Collection","Hotel Indigo","Crowne Plaza","Holiday Inn Express","Holiday Inn Resort","Holiday Inn","voco","avid hotels","Staybridge Suites","Candlewood Suites","Garner"],
  "ALL - Accor Live Limitless":["Raffles","Fairmont","Sofitel","MGallery","Pullman","Swissôtel","Mövenpick","Grand Mercure","Novotel","Mercure","Adagio","25hours","Mondrian","The Hoxton","ibis Styles","ibis budget","ibis"],
  "Radisson Rewards":["Radisson Collection","Radisson Blu","Radisson RED","Park Plaza","Park Inn by Radisson","Radisson"],
  "MeliáRewards":["Gran Meliá","ME by Meliá","INNSiDE","Paradisus","Zel","Meliá"],
  "GHA DISCOVERY":["Kempinski","NH Collection","NH Hotels","Anantara","Capella","Tivoli","Avani","Viceroy"],
  "Wyndham Rewards":["Wyndham Grand","Wyndham","Ramada Encore","Ramada","Days Inn","Super 8","La Quinta"],
  "WorldHotels Rewards":["WorldHotels"],
  "Best Western Rewards":["Best Western Premier","Best Western Plus","Best Western"]
};
const flat=Object.entries(PROGRAMS).flatMap(([program,brands])=>brands.map(brand=>({program,brand})));
function headers(stream=false){return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Content-Type":stream?"application/x-ndjson; charset=utf-8":"application/json;charset=utf-8","Cache-Control":"no-store"}}
function json(x,s=200){return new Response(JSON.stringify(x),{status:s,headers:headers(false)})}
function clean(x){return String(x??"").replace(/\s+/g," ").trim()}
function norm(x){return clean(x).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}
function num(x){
  if(x==null||x==="")return null;
  if(typeof x==="number")return Number.isFinite(x)?x:null;
  if(typeof x==="object")return num(x.extracted_lowest??x.extracted_price??x.extracted_total??x.lowest??x.price??x.total??x.value);
  const t=String(x).replace(/[^\d.,-]/g,"");if(!t)return null;let v=t;
  if(t.includes(",")&&t.includes("."))v=t.lastIndexOf(",")>t.lastIndexOf(".")?t.replace(/\./g,"").replace(",","."):t.replace(/,/g,"");
  else if(t.includes(",")){const a=t.split(",");v=a.length===2&&a[1].length<=2?t.replace(",","."):t.replace(/,/g,"")}
  else if(t.includes(".")){const a=t.split(".");if(a.length===2&&a[1].length===3)v=t.replace(".","")}
  const n=Number(v);return Number.isFinite(n)?n:null
}
function first(o,keys){for(const k of keys)if(o&&o[k]!=null&&o[k]!=="")return o[k];return null}
function url(x){if(typeof x==="string"&&/^https?:\/\//i.test(x))return x;if(x&&typeof x==="object")return url(x.url)||url(x.link)||url(x.website)||url(x.website_url);return null}
function urls(p){
  let official=url(first(p,["official_website","official_website_url","hotel_website","website","website_url","official_url"]));
  let booking=url(first(p,["booking_url","hotel_url","link"]));
  for(const x of (Array.isArray(p?.prices)?p.prices:[])){const u=url(x);if(u&&!booking)booking=u}
  return {official_url:official,booking_url:booking}
}
function amenity(v){
  const t=norm(v);
  if(/\b(pool|swimming pool|indoor pool|outdoor pool|infinity pool|rooftop pool)\b/.test(t))return "Pool";
  if(/\b(spa|wellness|wellness centre|wellness center|massage|thermal spa|wellness area|health spa)\b/.test(t))return "Spa";
  if(/\b(sauna|steam room|steam bath|steam sauna|hammam|hamam|infrared sauna|saunarium)\b/.test(t))return "Sauna";
  if(/\b(fitness|gym|fitness centre|fitness center|workout)\b/.test(t))return "Fitness";
  if(/\b(breakfast|buffet breakfast)\b/.test(t))return "Breakfast";
  if(/\b(parking|car park|garage|valet parking|private parking)\b/.test(t))return "Parking";
  return null
}
function amenities(p){
  const vals=[];const raw=first(p,["amenities","facilities","amenity"]);
  if(Array.isArray(raw))for(const x of raw)vals.push(typeof x==="string"?x:first(x,["name","label","title","text","description"]));
  else if(typeof raw==="string")vals.push(...raw.split(/[,;|]/));
  vals.push(p.description,p.amenities_text,p.hotel_amenities,p.facilities_text,p.services,p.highlights);
  return [...new Set(vals.filter(Boolean).flatMap(v=>String(v).split(/[,;|]/).map(amenity)).filter(Boolean))]
}
function images(p){
  const out=[];const add=x=>{const u=url(x);if(u&&!out.includes(u))out.push(u)};
  for(const x of (Array.isArray(p?.images)?p.images:[]))add(x);
  [p.original_image,p.image,p.image_url,p.thumbnail,p.thumbnail_url].forEach(add);
  return out
}
function address(p){
  const a=p?.address||p?.location||p?.formatted_address;
  if(typeof a==="string")return clean(a);
  if(a&&typeof a==="object")return clean([a.street,a.street_address,a.housenumber,a.city,a.postal_code,a.zip,a.country].filter(Boolean).join(", "));
  return null
}
function classify(p){
  const name=clean(p?.name||p?.hotel_name||p?.title);
  const text=norm(`${name} ${p?.brand||""} ${p?.brand_name||""} ${p?.chain||""} ${p?.chain_name||""}`);
  for(const {program,brand} of [...flat].sort((a,b)=>b.brand.length-a.brand.length)){
    if(text.includes(norm(brand)))return {program,brand,chain:program.split(" ")[0]}
  }
  return {program:null,brand:p?.brand||p?.brand_name||null,chain:p?.chain||p?.chain_name||null}
}
function price(p,nights){
  let night=num(p?.rate_per_night),total=num(p?.total_rate);
  night=night??num(first(p,["extracted_price","price_per_night","nightly_price","price"]));
  total=total??num(first(p,["extracted_total","total_price","total"]));
  for(const x of (Array.isArray(p?.prices)?p.prices:[])){
    night=night??num(first(x,["rate_per_night","price_per_night","price"]));
    total=total??num(first(x,["total_rate","total_price","total"]));
    if(night!=null||total!=null)break
  }
  if(total==null&&night!=null)total=night*nights;
  if(night==null&&total!=null)night=total/nights;
  return {night,total,available:night!=null||total!=null}
}
function normalize(p,ci,co){
  const nights=Math.max(1,Math.round((new Date(`${co}T00:00:00`)-new Date(`${ci}T00:00:00`))/86400000));
  const c=classify(p),pr=price(p,nights),g=p?.gps_coordinates||p?.coordinates||{};
  let stars=num(first(p,["extracted_hotel_class","hotel_class","star_rating","stars","hotel_stars"]));
  if(stars==null){const m=String(first(p,["hotel_class"])||"").match(/([1-5](?:\.[05])?)/);if(m)stars=Number(m[1])}
  const u=urls(p),imgs=images(p);
  return {
    hotel_id:p?.property_token||p?.place_id||p?.id||`${p?.name}|${address(p)}`,
    name:clean(p?.name||p?.hotel_name||p?.title)||"Unnamed hotel",
    brand:c.brand,chain:c.chain,program:c.program,stars,
    rating:num(p?.overall_rating??p?.rating??p?.rating_value),
    reviews:num(p?.reviews??p?.review_count??p?.ratings_count),
    amenities:amenities(p),images:imgs,thumbnail:imgs[0]||null,address:address(p),
    latitude:num(g.latitude??p?.latitude),longitude:num(g.longitude??p?.longitude),
    official_url:u.official_url,booking_url:u.booking_url,property_token:p?.property_token||null,
    price:pr,sponsored:Boolean(p?.sponsored),
    points:first(p,["points","loyalty_points","reward_points"])
  }
}
function dedupe(a){
  const m=new Map();
  for(const h of a){const k=String(h.hotel_id||`${h.name}|${h.address}`).toLowerCase();if(!m.has(k)||score(h)>score(m.get(k)))m.set(k,h)}
  return [...m.values()]
}
function score(h){return (h.price.available?5:0)+(h.images.length?3:0)+(h.stars?2:0)+(h.rating?2:0)+(h.official_url?3:0)+(h.amenities.length?2:0)}
async function serp(params,key){
  const u=new URL(SERPAPI_URL);u.searchParams.set("engine","google_hotels");u.searchParams.set("api_key",key);
  for(const[k,v]of Object.entries(params))if(v!==undefined&&v!==null&&v!=="")u.searchParams.set(k,String(v));
  const r=await fetch(u,{headers:{Accept:"application/json"}}),d=await r.json();
  if(!r.ok||d.error)throw new Error(d.error||`SerpApi ${r.status}`);return d
}
export async function onRequest(context){
  const {request,env}=context;
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:headers(false)});
  if(request.method!=="GET")return json({error:"Method not allowed"},405);
  const q=new URL(request.url),location=clean(q.searchParams.get("location")),ci=q.searchParams.get("check_in"),co=q.searchParams.get("check_out");
  const adults=Math.max(1,Math.min(20,Number(q.searchParams.get("adults")||2))),pages=Math.max(1,Math.min(10,Number(q.searchParams.get("pages")||10)));
  const stream=q.searchParams.get("stream")==="1";
  if(!location)return json({error:"Missing location"},400);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(ci)||!/^\d{4}-\d{2}-\d{2}$/.test(co)||co<=ci)return json({error:"Invalid dates"},400);
  if(!env?.SERPAPI_KEY)return json({error:"SERPAPI_KEY missing"},500);
  const base={q:location,check_in_date:ci,check_out_date:co,adults,currency:"EUR",gl:"de",hl:"en"};
  const queries=[base];
  let all=[],seen=new Set();
  const push=async(hotelBatch)=>{
    for(const p of hotelBatch){const h=normalize(p,ci,co),k=String(h.hotel_id).toLowerCase();if(!seen.has(k)){seen.add(k);all.push(h)}}
  };
  const run=async(send)=>{
    let token=null;
    for(let page=0;page<pages;page++){
      const data=await serp(token?{...send,next_page_token:token}:send,env.SERPAPI_KEY);
      const props=[...(Array.isArray(data.properties)?data.properties:[]),...(Array.isArray(data.hotels)?data.hotels:[])];
      await push(props);
      token=data?.serpapi_pagination?.next_page_token||null;
      if(stream)sendEvent({type:"hotels",hotels:dedupe(all),count:dedupe(all).length});
      if(!token)break;
    }
  };
  if(!stream){
    try{for(const qp of queries)await run(qp);const hotels=dedupe(all);return json({location,check_in:ci,check_out:co,adults,currency:"EUR",hotels,total_count:hotels.length,pages_requested:pages,search_metadata:{source:"Google Hotels via SerpApi",stream:false}})}
    catch(e){return json({error:"Hotel search failed",details:e.message},502)}
  }
  let controllerRef;
  const streamBody=new ReadableStream({
    start(controller){
      controllerRef=controller;
      const sendEvent=o=>{try{controller.enqueue(new TextEncoder().encode(JSON.stringify(o)+"\n"))}catch{}};
      globalThis.__smbSendEvent=sendEvent;
      (async()=>{
        try{
          const send=base;let token=null;
          for(let page=0;page<pages;page++){
            const data=await serp(token?{...send,next_page_token:token}:send,env.SERPAPI_KEY);
            const props=[...(Array.isArray(data.properties)?data.properties:[]),...(Array.isArray(data.hotels)?data.hotels:[])];
            await push(props);
            sendEvent({type:"hotels",hotels:dedupe(all),count:dedupe(all).length,page:page+1});
            token=data?.serpapi_pagination?.next_page_token||null;if(!token)break;
          }
          sendEvent({type:"done",hotels:dedupe(all),count:dedupe(all).length});
          controller.close();
        }catch(e){sendEvent({type:"error",error:e.message});controller.close()}
      })()
    }
  });
  return new Response(streamBody,{status:200,headers:headers(true)});
}
function sendEvent(o){if(globalThis.__smbSendEvent)globalThis.__smbSendEvent(o)}
export async function onRequestOptions(){return new Response(null,{status:204,headers:headers(false)})}
