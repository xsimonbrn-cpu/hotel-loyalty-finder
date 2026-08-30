const API_URL="/api/hotels";
const STATUS={"Hilton Honors":"Gold","Marriott Bonvoy":"Platinum Elite","IHG One Rewards":"Club Member","ALL - Accor Live Limitless":"Silver","Radisson Rewards":"Premium","MeliáRewards":"Gold","GHA DISCOVERY":"Gold","Wyndham Rewards":"Gold","WorldHotels Rewards":"Gold","Best Western Rewards":"Gold"};
const BENEFITS={
  "Hilton Honors":{"Gold":["Free breakfast / F&B credit","Room upgrade subject to availability"]},
  "Marriott Bonvoy":{"Platinum Elite":["Lounge access at participating brands","Room upgrade including selected suites","4pm late check-out","Welcome gift"]},
  "IHG One Rewards":{"Club Member":[]},
  "ALL - Accor Live Limitless":{"Silver":["Late check-out subject to availability","Welcome drink"]},
  "Radisson Rewards":{"Premium":["Room upgrade subject to availability","Early check-in subject to availability","Late check-out subject to availability"]},
  "MeliáRewards":{"Gold":["Room upgrade subject to availability","Early check-in subject to availability","Late check-out subject to availability"]},
  "GHA DISCOVERY":{"Gold":["Member benefits","Local Offers"]},
  "Wyndham Rewards":{"Gold":["Early check-in subject to availability","Late check-out subject to availability","Preferred room subject to availability"]},
  "WorldHotels Rewards":{"Gold":["Early check-in / late check-out subject to availability","Upgrade subject to availability","Welcome amenity"]},
  "Best Western Rewards":{"Gold":["Welcome amenity","Member Rate"]}
};

const state={
  hotels:[],filtered:[],page:1,perPage:20,
  programs:new Set(),amenities:new Set(),minStars:0,
  onlyBenefits:false,onlyOffers:false,loading:false,
  favorites:new Set(JSON.parse(localStorage.getItem("smb-favorites")||"[]")),
  compare:new Set(JSON.parse(localStorage.getItem("smb-compare")||"[]")),
  map:null,markers:[],mapReady:false
};
const $=id=>document.getElementById(id);
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const norm=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();

function dates(){
  const a=$("checkIn").value,b=$("checkOut").value;
  return {a,b,n:Math.max(1,Math.round((new Date(`${b}T00:00:00`)-new Date(`${a}T00:00:00`))/86400000))}
}
function initDates(){
  const d=new Date(),t=new Date(d);t.setDate(d.getDate()+1);
  $("checkIn").value=d.toISOString().slice(0,10);
  $("checkOut").value=t.toISOString().slice(0,10);
}
function save(){
  localStorage.setItem("smb-favorites",JSON.stringify([...state.favorites]));
  localStorage.setItem("smb-compare",JSON.stringify([...state.compare]));
  $("favCount").textContent=state.favorites.size;
  $("compareCount").textContent=state.compare.size;
}
function benefits(h){return BENEFITS[h.program]?.[STATUS[h.program]]||[]}
function benefitScore(h){
  const b=benefits(h).join(" ").toLowerCase();
  let s=0;
  if(/free breakfast|f&b credit/.test(b))s+=100;
  if(/lounge/.test(b))s+=80;
  if(/early check|late check/.test(b))s+=60;
  if(/upgrade/.test(b))s+=50;
  if(/welcome gift|welcome amenity/.test(b))s+=30;
  return s;
}
function enrich(h){
  const total=h.price?.total??null,night=h.price?.night??null;
  const b=benefits(h);
  return {...h,benefits:b,effective:total,effectiveNightly:night,
    available:Boolean(h.price?.available&&((total??0)>0||(night??0)>0)),
    benefitScore:benefitScore(h),
    amenitySet:new Set((h.amenities||[]).map(x=>norm(x)))
  };
}
function hasAmenity(h,a){
  const set=h.amenitySet||new Set((h.amenities||[]).map(x=>norm(x)));
  return set.has(norm(a));
}
function passes(h){
  if(state.programs.size&&!state.programs.has(h.program))return false;
  if(state.amenities.size&&!([...state.amenities].every(a=>hasAmenity(h,a))))return false;
  if(state.minStars && !(Number(h.stars)>=state.minStars))return false;
  if(state.onlyBenefits && !h.benefits.length)return false;
  if(state.onlyOffers && !h.sponsored && !h.official_url)return false;
  return true;
}
function applyFilters(resetPage=true){
  const all=state.hotels.map(enrich);
  state.filtered=all.filter(passes);
  if(resetPage)state.page=1;
  render();
}
function sorted(a){
  const sort=$("sort").value;
  const unavailable=(h)=>!h.available;
  return [...a].sort((x,y)=>{
    const end=Number(unavailable(x))-Number(unavailable(y));
    if(end)return end;
    if(sort==="effective")return (x.effective??Infinity)-(y.effective??Infinity);
    if(sort==="value")return (y.benefitScore+(y.rating||0)*8)-(x.benefitScore+(x.rating||0)*8);
    if(sort==="benefits")return y.benefitScore-x.benefitScore;
    if(sort==="rating")return (y.rating??0)-(x.rating??0);
    if(sort==="stars")return (y.stars??-1)-(x.stars??-1);
    return 0;
  });
}
function render(){
  const a=sorted(state.filtered);
  const pages=Math.max(1,Math.ceil(a.length/state.perPage));
  state.page=Math.min(state.page,pages);
  const slice=a.slice((state.page-1)*state.perPage,state.page*state.perPage);
  $("resultMeta").textContent=state.loading?`Searching · ${state.hotels.length} hotels found…`:`${a.length} hotels · page ${state.page} of ${pages}`;
  $("pageInfo").textContent=state.loading?`${state.hotels.length} found`:`${a.length} results`;
  $("emptyState").style.display=(!state.loading&&!a.length)?"block":"none";
  $("results").innerHTML=state.loading?loadingCards():slice.map(card).join("");
  pagination(pages);
  updateMap(slice);
  $("activeFilterCount").textContent=state.programs.size+state.amenities.size+(state.minStars?1:0)+(state.onlyBenefits?1:0)+(state.onlyOffers?1:0);
  save();
}
function loadingCards(){
  return Array.from({length:5},(_,i)=>`<article class="hotel skeleton-card"><div class="skeleton skeleton-image"></div><div class="hotel-main"><div class="skeleton skeleton-line wide"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line short"></div><div class="skeleton skeleton-block"></div></div><div class="hotel-price"><div class="skeleton skeleton-price"></div><div class="skeleton skeleton-button"></div></div></article>`).join("");
}
function starsMarkup(h){
  if(h.stars==null)return `<span class="stars-missing">Star class unavailable</span>`;
  const n=Math.max(0,Math.min(5,Math.round(Number(h.stars))));
  return `<span class="hotel-stars" aria-label="${n} star hotel">${"★".repeat(n)}${"☆".repeat(5-n)}</span><span>${n}★ hotel class</span>`;
}
function card(h){
  const idx=h._imageIndex||0,fav=state.favorites.has(String(h.hotel_id)),cmp=state.compare.has(String(h.hotel_id));
  const imgs=h.images||[],id=esc(h.hotel_id),points=h.points??h.loyalty_points??h.reward_points;
  const availability=h.available?`<div><div class="price-status">Effective stay</div><div class="price">€${Math.round(h.effective)}</div><div class="nightly">€${Math.round(h.effectiveNightly??0)} / night</div></div>`:
    `<div><div class="price-status">${h.price?.total===0?"Ausgebucht":"Nicht verfügbar"}</div><div class="unavailable">${h.price?.total===0?"No rooms available":"No live price"}</div></div>`;
  return `<article class="hotel ${h.available?"":"is-unavailable"}">
    <div class="gallery" data-gallery="${id}">${imgs[idx]?`<img src="${esc(imgs[idx])}" alt="${esc(h.name)}">`:`<div class="image-empty">No image</div>`}
      ${imgs.length>1?`<button class="gallery-btn prev" data-prev="${id}" aria-label="Previous image">‹</button><button class="gallery-btn next" data-next="${id}" aria-label="Next image">›</button><span class="dots">${idx+1} / ${imgs.length}</span>`:""}
    </div>
    <div class="hotel-main">
      <div class="hotel-title-row"><div><h3 class="hotel-name">${esc(h.name)}</h3><div class="hotel-sub"><span class="programme">${esc(h.program||"Independent")}</span>${h.brand?`<span>${esc(h.brand)}</span>`:""}${STATUS[h.program]?`<span>${esc(STATUS[h.program])}</span>`:""}</div></div></div>
      <div class="hotel-meta">${starsMarkup(h)}${h.rating!=null?`<span>Rating ${Number(h.rating).toFixed(1)}${h.reviews?` · ${Number(h.reviews).toLocaleString()}`:""}</span>`:""}${h.address?`<span>${esc(h.address)}</span>`:""}</div>
      <div class="amenities">${(h.amenities||[]).map(x=>`<span class="chip">${esc(x)}</span>`).join("")}</div>
      <div class="benefits">${h.benefits.map(x=>`<span class="chip benefit-chip">${esc(x)}</span>`).join("")}${points!=null?`<span class="chip points-chip">${esc(points)} points</span>`:""}</div>
    </div>
    <div class="hotel-price">${availability}<div class="actions">
      ${h.official_url?`<a href="${esc(h.official_url)}" target="_blank" rel="noopener noreferrer">Hotel website ↗</a>`:""}
      ${h.booking_url?`<a href="${esc(h.booking_url)}" target="_blank" rel="noopener noreferrer">Book ↗</a>`:""}
      <button class="fav ${fav?"active":""}" data-fav="${id}">${fav?"Saved":"Save"}</button>
      <button class="compare ${cmp?"active":""}" data-compare="${id}">${cmp?"Compared":"Compare"}</button>
    </div></div>
  </article>`;
}
function pagination(p){
  if(p<=1){$("pagination").innerHTML="";return}
  const current=state.page, nums=new Set([1,p,current,current-1,current+1].filter(n=>n>=1&&n<=p));
  const arr=[...nums].sort((a,b)=>a-b),out=[];
  let last=0;
  for(const n of arr){if(last&&n-last>1)out.push(`<span class="page-gap">…</span>`);out.push(`<button class="${n===current?"active":""}" data-page="${n}">${n}</button>`);last=n}
  $("pagination").innerHTML=`<button class="page-arrow" data-page="${Math.max(1,current-1)}" ${current===1?"disabled":""}>←</button>${out.join("")}<button class="page-arrow" data-page="${Math.min(p,current+1)}" ${current===p?"disabled":""}>→</button>`;
}
function setupFilters(){
  document.querySelectorAll("#programFilters input").forEach(x=>x.addEventListener("change",()=>x.checked?state.programs.add(x.value):state.programs.delete(x.value)));
  document.querySelectorAll(".amenity-filter-grid input").forEach(x=>x.addEventListener("change",()=>x.checked?state.amenities.add(x.value):state.amenities.delete(x.value)));
  document.querySelectorAll("#starFilters input").forEach(x=>x.addEventListener("change",()=>{if(x.checked)state.minStars=Number(x.value)}));
  $("onlyBenefits").addEventListener("change",e=>state.onlyBenefits=e.target.checked);
  $("onlyOffers").addEventListener("change",e=>state.onlyOffers=e.target.checked);
  $("applyFilters").onclick=()=>{$("filterDrawer").classList.remove("open");applyFilters()};
  $("resetFilters").onclick=resetFilters;
  $("resetAll").onclick=resetFilters;
}
function resetFilters(){
  document.querySelectorAll('#programFilters input,.amenity-filter-grid input').forEach(x=>x.checked=false);
  const any=$('#starFilters input[value="0"]');if(any)any.checked=true;
  $("onlyBenefits").checked=false;$("onlyOffers").checked=false;
  state.programs.clear();state.amenities.clear();state.minStars=0;state.onlyBenefits=false;state.onlyOffers=false;
  applyFilters();
}
async function search(){
  const city=$("city").value.trim(),{a,b}=dates();
  if(!city||!a||!b||b<=a)return alert("Please enter a valid location and dates.");
  $("searchButton").disabled=true;$("searchButton").textContent="Searching";
  state.loading=true;state.hotels=[];state.filtered=[];state.page=1;render();
  try{
    const u=new URLSearchParams({location:city,check_in:a,check_out:b,adults:$("guests").value,pages:"10",stream:"1"});
    const r=await fetch(`${API_URL}?${u}`);
    if(!r.ok)throw Error("Hotel search failed.");
    const reader=r.body?.getReader();
    if(!reader)throw Error("Streaming search is not supported by this browser.");
    const decoder=new TextDecoder();let buffer="";
    while(true){
      const {value,done}=await reader.read();if(done)break;
      buffer+=decoder.decode(value,{stream:true});
      const lines=buffer.split("\n");buffer=lines.pop()||"";
      for(const line of lines){if(!line.trim())continue;const ev=JSON.parse(line);
        if(ev.type==="hotels"){state.hotels=ev.hotels||[];applyFilters(false)}
        if(ev.type==="done"){state.hotels=ev.hotels||state.hotels;$("resultTitle").textContent=`Hotels in ${city}`;applyFilters(false)}
        if(ev.type==="error")throw Error(ev.error||"Hotel search failed.");
      }
    }
    if(buffer.trim()){const ev=JSON.parse(buffer);if(ev.hotels)state.hotels=ev.hotels}
    $("resultTitle").textContent=`Hotels in ${city}`;
  }catch(e){$("results").innerHTML="";alert(e.message)}
  finally{state.loading=false;applyFilters(false);$("searchButton").disabled=false;$("searchButton").textContent="Search"}
}
function updateMap(a){
  if(!state.map)return;
  state.markers.forEach(m=>m.remove());state.markers=[];
  const valid=a.filter(h=>Number.isFinite(h.latitude)&&Number.isFinite(h.longitude));
  valid.forEach(h=>{const m=L.marker([h.latitude,h.longitude]).addTo(state.map).bindPopup(`<strong>${esc(h.name)}</strong><br>${esc(h.program||"Independent")}<br>${h.available?`€${Math.round(h.effective)}`:"Not available"}`);state.markers.push(m)});
  if(valid.length)state.map.fitBounds(L.latLngBounds(valid.map(h=>[h.latitude,h.longitude])),{padding:[30,30],maxZoom:13});
}
function initMap(){
  if(!window.L||state.mapReady)return;
  state.map=L.map("map",{zoomControl:false}).setView([50.11,8.68],11);
  L.control.zoom({position:"bottomright"}).addTo(state.map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors",maxZoom:19}).addTo(state.map);
  state.mapReady=true;
}
function showCompare(){
  const a=state.hotels.map(enrich).filter(h=>state.compare.has(String(h.hotel_id)));
  if(!a.length){$("compareDrawer").classList.add("hidden");return alert("Add 2–3 hotels to Compare first.")}
  $("compareContent").innerHTML=`<div class="compare-grid">${a.map(h=>`<div class="compare-col">
    <div class="compare-top"><img src="${esc(h.thumbnail||h.images?.[0]||"")}" alt=""><button class="remove-btn" data-remove-compare="${esc(h.hotel_id)}" aria-label="Remove">×</button></div>
    <h3>${esc(h.name)}</h3><p>${esc(h.program||"Independent")}${h.brand?` · ${esc(h.brand)}`:""}</p>
    <div class="compare-row"><span class="compare-label">Hotel class</span>${h.stars??"—"}★</div>
    <div class="compare-row"><span class="compare-label">Price</span>${h.available?`€${Math.round(h.effective)} · €${Math.round(h.effectiveNightly??0)}/night`:"Not available"}</div>
    <div class="compare-row"><span class="compare-label">Benefits</span>${esc(h.benefits.join(" · ")||"—")}</div>
    <div class="compare-row"><span class="compare-label">Amenities</span>${esc((h.amenities||[]).join(" · ")||"—")}</div>
    <div class="compare-row"><span class="compare-label">Points</span>${esc(h.points??h.loyalty_points??h.reward_points??"—")}</div>
  </div>`).join("")}</div>`;
  $("compareDrawer").classList.remove("hidden");
}
document.addEventListener("click",e=>{
  const f=e.target.closest("[data-fav]");
  if(f){const id=f.dataset.fav;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);render();return}
  const c=e.target.closest("[data-compare]");
  if(c){const id=c.dataset.compare;if(state.compare.has(id))state.compare.delete(id);else{if(state.compare.size>=3)return alert("Compare is limited to 3 hotels.");state.compare.add(id)}render();return}
  const rm=e.target.closest("[data-remove-compare]");
  if(rm){state.compare.delete(rm.dataset.removeCompare);save();showCompare();render();return}
  const p=e.target.closest("[data-page]");
  if(p&&!p.disabled){state.page=Number(p.dataset.page);render();window.scrollTo({top:$("results").offsetTop-90,behavior:"smooth"});return}
  const prev=e.target.closest("[data-prev]"),next=e.target.closest("[data-next]");
  if(prev||next){const id=(prev||next).dataset.prev||(prev||next).dataset.next,h=state.hotels.find(x=>String(x.hotel_id)===id);if(!h)return;h._imageIndex=((h._imageIndex||0)+(next?1:-1)+(h.images?.length||1))%(h.images?.length||1);render();return}
});
$("searchButton").onclick=search;
$("openFilters").onclick=()=>$("filterDrawer").classList.add("open");
$("closeFilters").onclick=()=>$("filterDrawer").classList.remove("open");
$("sort").onchange=()=>render();
$("mapToggle").onclick=()=>{$("mapWrap").classList.toggle("hidden");if(!$("mapWrap").classList.contains("hidden")){initMap();setTimeout(()=>state.map?.invalidateSize(),100)}};
$("favoritesToggle").onclick=()=>{state.filtered=state.hotels.map(enrich).filter(h=>state.favorites.has(String(h.hotel_id)));state.page=1;render()};
$("compareToggle").onclick=showCompare;
$("closeCompare").onclick=()=>$("compareDrawer").classList.add("hidden");
initDates();setupFilters();save();render();
