const demoHotels = [
  {name:"INNSiDE by Meliá Frankfurt Ostend",chain:"Meliá",program:"MeliáRewards",status:"Gold",rating:4.4,base:168,amenities:["Fitness","Spa","Restaurant","Bar"],image:"https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80",benefits:["20% personal promotion","Upgrade","Late check-out"]},
  {name:"Hilton Frankfurt City Centre",chain:"Hilton",program:"Hilton Honors",status:"Gold",rating:4.5,base:189,amenities:["Pool","Fitness","Sauna","Restaurant","Bar"],image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",benefits:["Breakfast / F&B credit","Upgrade","80% bonus"]},
  {name:"Frankfurt Marriott Hotel",chain:"Marriott",program:"Marriott Bonvoy",status:"Platinum Elite",rating:4.4,base:205,amenities:["Pool","Fitness","Restaurant","Bar"],image:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",benefits:["16:00 late check-out","Upgrade","Lounge"]},
  {name:"JW Marriott Hotel Frankfurt",chain:"Marriott",program:"Marriott Bonvoy",status:"Platinum Elite",rating:4.6,base:265,amenities:["Pool","Fitness","Spa","Restaurant","Bar"],image:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",benefits:["Suite upgrade","16:00 late check-out","Lounge"]},
  {name:"InterContinental Frankfurt",chain:"IHG",program:"IHG One Rewards",status:"Club Member",rating:4.3,base:181,amenities:["Fitness","Restaurant","Bar"],image:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",benefits:["Member rate","Wi-Fi"]},
  {name:"Novotel Frankfurt City",chain:"Accor",program:"ALL - Accor Live Limitless",status:"Silver",rating:4.1,base:132,amenities:["Fitness","Pool","Restaurant","Parking"],image:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",benefits:["Welcome drink","Late check-out"]},
  {name:"Radisson Blu Hotel Frankfurt",chain:"Radisson",program:"Radisson Rewards",status:"Premium",rating:4.2,base:145,amenities:["Pool","Fitness","Sauna","Restaurant","Bar"],image:"https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",benefits:["Upgrade","Late check-out"]},
  {name:"Kempinski Hotel Frankfurt Gravenbruch",chain:"GHA",program:"GHA DISCOVERY",status:"Gold",rating:4.5,base:220,amenities:["Pool","Spa","Fitness","Restaurant","Bar","Parking"],image:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",benefits:["5% D$","Member rate"]},
  {name:"Best Western Premier IB Hotel Friedberger Warte",chain:"Best Western",program:"Best Western Rewards",status:"Gold",rating:4.0,base:109,amenities:["Fitness","Parking","Restaurant"],image:"https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=900&q=80",benefits:["10% bonus","Welcome amenity"]}
];

const state={chain:"all",amenities:new Set(),sort:"effective",activePrograms:new Set()};
const loyaltyPrograms = {
  "Hilton Honors": ["Member","Silver","Gold","Diamond","Diamond Reserve"],
  "Marriott Bonvoy": ["Member","Silver Elite","Gold Elite","Platinum Elite","Titanium Elite"],
  "IHG One Rewards": ["Club Member","Silver Elite","Gold Elite","Platinum Elite","Diamond Elite"],
  "ALL - Accor Live Limitless": ["Classic","Silver","Gold","Platinum","Diamond"],
  "Radisson Rewards": ["Club","Premium","VIP"],
  "MeliáRewards": ["White","Silver","Gold","Platinum"],
  "GHA DISCOVERY": ["Silver","Gold","Platinum","Titanium"],
  "Wyndham Rewards": ["Blue","Gold","Platinum","Diamond"],
  "WorldHotels Rewards": ["Red","Gold","Platinum","Diamond","Diamond Select"],
  "Best Western Rewards": ["Blue","Gold","Platinum","Diamond","Diamond Select"]
};

const personalStatus = {
  "Hilton Honors":"Gold",
  "Marriott Bonvoy":"Platinum Elite",
  "IHG One Rewards":"Club Member",
  "ALL - Accor Live Limitless":"Silver",
  "Radisson Rewards":"Premium",
  "MeliáRewards":"Gold",
  "GHA DISCOVERY":"Gold",
  "Wyndham Rewards":"Gold",
  "WorldHotels Rewards":"Gold",
  "Best Western Rewards":"Gold"
};

const personalPoints = {
  "Hilton Honors":0,
  "Marriott Bonvoy":0,
  "IHG One Rewards":0,
  "ALL - Accor Live Limitless":0,
  "Radisson Rewards":0,
  "MeliáRewards":0,
  "GHA DISCOVERY":0,
  "Wyndham Rewards":0,
  "WorldHotels Rewards":0,
  "Best Western Rewards":0
};

let amexOffers = [
  {name:"WorldHotels", spend:250, credit:50}
];


const amenityIcons = {"Pool": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 14c2.5-2.5 5.5-2.5 8 0s5.5 2.5 8 0\"/><path d=\"M4 18c2.5-2.5 5.5-2.5 8 0s5.5 2.5 8 0\"/></svg>", "Sauna": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7 19c0-2 2-3 2-5 0-1.5-1-2-1-3\"/><path d=\"M12 19c0-2 2-3 2-5 0-1.5-1-2-1-3\"/><path d=\"M17 19c0-2 2-3 2-5 0-1.5-1-2-1-3\"/><path d=\"M4 21h16\"/></svg>", "Spa": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 21c4-3 6-6.5 6-10A6 6 0 0 0 6 11c0 3.5 2 7 6 10Z\"/><path d=\"M12 4V2\"/></svg>", "Fitness": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10\"/></svg>", "Breakfast": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M5 18h14\"/><path d=\"M7 18c0-4 2-6 5-6s5 2 5 6\"/><path d=\"M12 12V5\"/></svg>", "Parking": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7 20V4h5a4 4 0 0 1 0 8H7\"/><path d=\"M4 20h16\"/></svg>", "Restaurant": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3v18M17 3c3 2 3 7 0 9\"/></svg>", "Bar": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M5 4h14l-5 7v7h3v2H7v-2h3v-7L5 4Z\"/><path d=\"M8 8h8\"/></svg>"};

const cityEl=document.getElementById("city");
const checkInEl=document.getElementById("checkIn");
const checkOutEl=document.getElementById("checkOut");
const guestsEl=document.getElementById("guests");
const sortEl=document.getElementById("sort");
const resultsEl=document.getElementById("results");
const emptyEl=document.getElementById("emptyState");
const resultTitleEl=document.getElementById("resultTitle");
const resultMetaEl=document.getElementById("resultMeta");


const drawer = document.getElementById("filterDrawer");
const openFilters = document.getElementById("openFilters");
const closeFilters = document.getElementById("closeFilters");
const activeFilterCount = document.getElementById("activeFilterCount");
const statusFields = document.getElementById("statusFields");
const pointsFields = document.getElementById("pointsFields");
const amexFields = document.getElementById("amexFields");

function buildStatusFields(){
  statusFields.innerHTML = Object.entries(loyaltyPrograms).map(([program,statuses]) => `
    <div class="status-row">
      <span class="status-name">${program}</span>
      <select data-program-status="${program}">
        ${statuses.map(s=>`<option ${s===personalStatus[program]?"selected":""}>${s}</option>`).join("")}
      </select>
    </div>
  `).join("");
}

function buildPointsFields(){
  pointsFields.innerHTML = Object.keys(personalPoints).map(program => `
    <div class="status-row">
      <span class="status-name">${program}</span>
      <input type="number" min="0" step="1000" value="${personalPoints[program]}" data-program-points="${program}">
    </div>
  `).join("");
}

function buildAmexFields(){
  amexFields.innerHTML = amexOffers.map((o,i)=>`
    <div class="amex-row">
      <input value="${o.name||""}" placeholder="Hotel / chain" data-amex-name="${i}">
      <input type="number" min="0" step="10" value="${o.spend||0}" placeholder="Spend" data-amex-spend="${i}">
      <input type="number" min="0" step="5" value="${o.credit||0}" placeholder="Credit" data-amex-credit="${i}">
      <button class="remove-amex" data-remove-amex="${i}" type="button">×</button>
    </div>
  `).join("");

  amexFields.querySelectorAll("[data-remove-amex]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      amexOffers.splice(Number(btn.dataset.removeAmex),1);
      buildAmexFields();
    });
  });
}

function syncPersonalSettings(){
  document.querySelectorAll("[data-program-status]").forEach(el=>{
    personalStatus[el.dataset.programStatus]=el.value;
  });
  document.querySelectorAll("[data-program-points]").forEach(el=>{
    personalPoints[el.dataset.programPoints]=Number(el.value)||0;
  });
  document.querySelectorAll("[data-amex-name]").forEach(el=>{
    const i=Number(el.dataset.amexName);
    amexOffers[i].name=el.value;
  });
  document.querySelectorAll("[data-amex-spend]").forEach(el=>{
    const i=Number(el.dataset.amexSpend);
    amexOffers[i].spend=Number(el.value)||0;
  });
  document.querySelectorAll("[data-amex-credit]").forEach(el=>{
    const i=Number(el.dataset.amexCredit);
    amexOffers[i].credit=Number(el.value)||0;
  });
}

function updateFilterCount(){
  const checks=[...document.querySelectorAll('.filter-drawer input[type="checkbox"]:checked')];
  const count=checks.length;
  activeFilterCount.textContent=count ? `${count} filter${count===1?"":"s"} active` : "No filters";
}

openFilters.addEventListener("click",()=>{
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden","false");
});
closeFilters.addEventListener("click",()=>{
  syncPersonalSettings();
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden","true");
});
document.querySelectorAll('.drawer-check input').forEach(el=>{
  el.addEventListener("change",updateFilterCount);
});

document.getElementById("addAmex").addEventListener("click",()=>{
  syncPersonalSettings();
  amexOffers.push({name:"",spend:0,credit:0});
  buildAmexFields();
});

document.getElementById("applyFilters").addEventListener("click",()=>{
  syncPersonalSettings();

  state.activePrograms=new Set(
    [...document.querySelectorAll('.drawer-section input[type="checkbox"]:not([data-type="amenity"]):checked')]
      .filter(x=>x.value)
      .map(x=>x.value)
  );

  state.amenities=new Set(
    [...document.querySelectorAll('input[data-type="amenity"]:checked')]
      .map(x=>x.value)
  );

  render();
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden","true");
});

document.getElementById("resetFilters").addEventListener("click",()=>{
  document.querySelectorAll('.drawer-check input').forEach(x=>x.checked=false);
  document.querySelectorAll('[data-program-status]').forEach(el=>{
    el.value=personalStatus[el.dataset.programStatus];
  });
  state.activePrograms=new Set();
  state.amenities.clear();
  updateFilterCount();
  render();
});

buildStatusFields();
buildPointsFields();
buildAmexFields();
updateFilterCount();

function setDefaultDates(){
  const t=new Date(), a=new Date(t), b=new Date(t);
  a.setDate(t.getDate()+7); b.setDate(t.getDate()+9);
  checkInEl.value=a.toISOString().slice(0,10);
  checkOutEl.value=b.toISOString().slice(0,10);
}
function dateText(v){return new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date(v))}
function nightCount(){
  const a=new Date(checkInEl.value),b=new Date(checkOutEl.value);
  return Math.max(Math.round((b-a)/86400000),1)
}

function render(){
  const n=nightCount();
  let hotels=demoHotels.map(h=>{
    const total=h.base*n;
    const promo=h.program==="MeliáRewards"?total*.20:0;
    return {...h,total,effective:total-promo,nightly:(total-promo)/n,hasOffer:promo>0};
  });

  if(state.chain!=="all") hotels=hotels.filter(h=>h.chain===state.chain);

  if(state.activePrograms.size){
    hotels=hotels.filter(h=>state.activePrograms.has(h.chain));
  }

  if(state.amenities.size) hotels=hotels.filter(h=>{
    const a=h.amenities.map(x=>x.toLowerCase());
    return [...state.amenities].every(x=>a.includes(x.toLowerCase()));
  });

  if(document.getElementById("onlyBenefits").checked)
    hotels=hotels.filter(h=>h.benefits.length);

  if(document.getElementById("onlyOffers").checked)
    hotels=hotels.filter(h=>h.hasOffer);

  if(state.sort==="effective") hotels.sort((a,b)=>a.effective-b.effective);
  if(state.sort==="value") hotels.sort((a,b)=>(b.rating+b.benefits.length*.15)-(a.rating+a.benefits.length*.15));
  if(state.sort==="benefits") hotels.sort((a,b)=>b.benefits.length-a.benefits.length);
  if(state.sort==="rating") hotels.sort((a,b)=>b.rating-a.rating);

  resultTitleEl.textContent=`Hotels in ${cityEl.value.trim()||"your city"}`;
  resultMetaEl.textContent=`${hotels.length} hotels · ${dateText(checkInEl.value)} – ${dateText(checkOutEl.value)} · ${n} nights · ${guestsEl.value} guests`;

  if(!hotels.length){resultsEl.innerHTML="";emptyEl.style.display="block";return}
  emptyEl.style.display="none";

  resultsEl.innerHTML=hotels.map(h=>`
    <article class="hotel">
      <img class="hotel-image" src="${h.image}" alt="${h.name}" loading="lazy">
      <div class="hotel-main">
        <h3 class="hotel-name">${h.name}</h3>
        <p class="hotel-brand">${h.chain} · ${h.program} · ${h.status}</p>
        <div class="hotel-meta">
          <span>Rating ${h.rating.toFixed(1)}</span>
          <span>${h.status}</span>
        </div>

        <div class="hotel-amenities">
          ${h.amenities.slice(0,5).map(a => `
            <span class="amenity-chip">
              ${amenityIcons[a] || ""}
              <span>${a}</span>
            </span>
          `).join("")}
        </div>
        <div class="special">${h.benefits.map(b=>`<span>${b}</span>`).join("")}</div>
      </div>
      <div class="hotel-price">
        <div>
          <div class="price-label">Effective stay</div>
          <div class="effective">€${Math.round(h.effective)}</div>
          <div class="nightly">€${Math.round(h.nightly)} / night</div>
          <div class="price-detail">
            Original: €${Math.round(h.total)}<br>
            ${h.hasOffer?"Personal promotion applied":""}
          </div>
        </div>
        <a class="view-button" href="#" onclick="return false;">View hotel</a>
      </div>
    </article>
  `).join("");
}

document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); state.chain=b.dataset.chain; render();
}));
document.querySelectorAll(".amenity-filter").forEach(b=>b.addEventListener("click",()=>{
  const a=b.dataset.amenity;
  if(state.amenities.has(a)){state.amenities.delete(a);b.classList.remove("active")}
  else{state.amenities.add(a);b.classList.add("active")}
  render();
}));
document.getElementById("onlyBenefits").addEventListener("change",render);
document.getElementById("onlyOffers").addEventListener("change",render);
sortEl.addEventListener("change",()=>{state.sort=sortEl.value;render()});
document.getElementById("searchButton").addEventListener("click",render);

setDefaultDates();
render();
