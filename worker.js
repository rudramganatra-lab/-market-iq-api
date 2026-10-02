const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization"};
const START_CASH=1000000;
const CANDLE_MS=60000;
const MAX_CANDLES=3000;
const MAX_DAILY=2200;
const I={
RELIANCE:{name:"Reliance Industries",sector:"Stocks",price:2925.4,lot:1},TCS:{name:"Tata Consultancy Services",sector:"IT",price:4140.2,lot:1},
HDFCBANK:{name:"HDFC Bank",sector:"Banking",price:1948.6,lot:1},INFY:{name:"Infosys",sector:"IT",price:1512.3,lot:1},
ICICIBANK:{name:"ICICI Bank",sector:"Banking",price:1425.7,lot:1},SBIN:{name:"State Bank of India",sector:"Banking",price:825.3,lot:1},
BHARTIARTL:{name:"Bharti Airtel",sector:"Telecom",price:1810.5,lot:1},ITC:{name:"ITC",sector:"FMCG",price:458.25,lot:1},
LT:{name:"Larsen & Toubro",sector:"Industrials",price:3840.8,lot:1},MARUTI:{name:"Maruti Suzuki",sector:"Auto",price:14220,lot:1},
TATASTEEL:{name:"Tata Steel",sector:"Metals",price:178.4,lot:10},SUNPHARMA:{name:"Sun Pharma",sector:"Healthcare",price:1745.2,lot:1},
HINDUNILVR:{name:"Hindustan Unilever",sector:"FMCG",price:2765.1,lot:1},AXISBANK:{name:"Axis Bank",sector:"Banking",price:1235.6,lot:1},
NIFTY50:{name:"NIFTY 50",sector:"Index",price:25840.2,lot:1},BANKNIFTY:{name:"NIFTY Bank",sector:"Index",price:58540,lot:1},
GOLD:{name:"Gold (educational proxy)",sector:"Commodity",price:112850,lot:1},SILVER:{name:"Silver (educational proxy)",sector:"Commodity",price:132450,lot:1},
SWIGGY:{name:"Swiggy Ltd",sector:"IPO",price:420.5,lot:1},OLAELEC:{name:"Ola Electric Mobility",sector:"IPO",price:68.2,lot:1},
VMM:{name:"Vishal Mega Mart",sector:"IPO",price:112.8,lot:1},HYUNDAI:{name:"Hyundai Motor India",sector:"IPO",price:1865.0,lot:1},
NTPCGREEN:{name:"NTPC Green Energy",sector:"IPO",price:118.4,lot:1}};
const json=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{"content-type":"application/json",...CORS}});

function istDate(ts){ return new Date(new Date(ts).toLocaleString("en-US",{timeZone:"Asia/Kolkata"})); }
function dayKey(ts){ return Math.floor((ts+19800000)/86400000); }
function istDateStr(){ return dayKey(Date.now()); }
// practice mode (default) = simulated market runs 24x7; otherwise real NSE hours Mon-Fri 9:15-15:30 IST
function open(ts){ const d=istDate(ts||Date.now()); const m=d.getHours()*60+d.getMinutes(); return d.getDay()>0&&d.getDay()<6&&m>=555&&m<930; } // NSE Mon-Fri 9:15-15:30 IST

// Backfill: random walk going BACKWARDS so the last close equals the anchor price
function histCandles(anchor,n,stepMs,endT,vol,volBase){
  const cl=[anchor]; for(let i=0;i<n;i++) cl.unshift(Math.max(.01,cl[0]/(1+(Math.random()-.5)*vol)));
  const out=[]; for(let i=0;i<n;i++){ const o=cl[i],c=cl[i+1];
    out.push({t:endT-(n-i)*stepMs,o,h:Math.max(o,c)*(1+Math.random()*vol/4),l:Math.min(o,c)*(1-Math.random()*vol/4),c,v:Math.round(Math.random()*volBase+volBase/4)}); }
  return out;
}

function freshCandles(){ let c={}; const t=Math.floor(Date.now()/CANDLE_MS)*CANDLE_MS; for(let k in I) c[k]=[{t,o:I[k].price,h:I[k].price,l:I[k].price,c:I[k].price,v:0}]; return c; }
function freshDaily(){ let c={}; for(let k in I) c[k]=[]; return c; }
const seed=()=>({
  cash:START_CASH, positions:{}, orders:[],
  prices:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,v.price])),
  dayOpen:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,v.price])),
  dayHigh:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,v.price])),
  dayLow:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,v.price])),
  dayVol:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,0])),
  candles:freshCandles(), dailyCandles:freshDaily(), lastDay:istDateStr(), practice:false,
  updatedAt:Date.now()
});

function rolloverDayIfNeeded(s){
  const today=dayKey(Date.now());
  if(s.lastDay<today){
    for(let k in I){
      s.dailyCandles[k].push({t:s.lastDay*86400000-19800000, o:s.dayOpen[k], h:s.dayHigh[k], l:s.dayLow[k], c:s.prices[k], v:s.dayVol[k]});
      if(s.dailyCandles[k].length>MAX_DAILY) s.dailyCandles[k].shift();
      s.dayOpen[k]=s.prices[k]; s.dayHigh[k]=s.prices[k]; s.dayLow[k]=s.prices[k]; s.dayVol[k]=0;
    }
    s.lastDay=today;
  }
}

function tickOne(s,k,ts){
  let old=s.prices[k];
  let np=Math.max(.01, old*(1+(Math.random()-.5)*.0016));
  s.prices[k]=np;
  if(np>s.dayHigh[k])s.dayHigh[k]=np;
  if(np<s.dayLow[k])s.dayLow[k]=np;
  let vol=Math.round(Math.abs(np-old)/old*5000000+Math.random()*8000);
  s.dayVol[k]=(s.dayVol[k]||0)+vol;
  let bucket=Math.floor(ts/CANDLE_MS)*CANDLE_MS;
  let arr=s.candles[k];
  let last=arr[arr.length-1];
  if(last&&last.t===bucket){ last.h=Math.max(last.h,np); last.l=Math.min(last.l,np); last.c=np; last.v+=vol; }
  else { arr.push({t:bucket,o:old,h:Math.max(old,np),l:Math.min(old,np),c:np,v:vol}); if(arr.length>MAX_CANDLES) arr.shift(); }
}

function advance(s){
  rolloverDayIfNeeded(s);
  const n=Date.now(); let gap=Math.max(0,n-s.updatedAt);
  if(gap>6*3600000){ s.updatedAt=n-6*3600000; gap=6*3600000; }
  const steps=Math.min(1500,Math.floor(gap/2500));
  // only move updatedAt when ticks happen, so fast polling no longer starves the simulation
  if(steps>0){
    const stepMs=gap/steps;
    for(let i=1;i<=steps;i++){ const ts=s.updatedAt+i*stepMs; if(open(ts)) for(let sym in I) tickOne(s,sym,ts); }
    s.updatedAt=n;
  }
  return s;
}

function aggC(arr,mins){
  if(mins<=1) return arr; const ms=mins*60000,out=[]; let cur=null;
  for(const c of arr){ const b=Math.floor(c.t/ms)*ms;
    if(!cur||cur.t!==b){ if(cur) out.push(cur); cur={t:b,o:c.o,h:c.h,l:c.l,c:c.c,v:c.v||0}; }
    else { cur.h=Math.max(cur.h,c.h); cur.l=Math.min(cur.l,c.l); cur.c=c.c; cur.v+=c.v||0; } }
  if(cur) out.push(cur); return out;
}
// ---------- News (live RSS, cached 4 min in KV) ----------
const FEEDS=[
 ["India","https://news.google.com/rss/search?q=Sensex+OR+Nifty+OR+%22Indian+stock+market%22+when:1d&hl=en-IN&gl=IN&ceid=IN:en"],
 ["Global","https://news.google.com/rss/search?q=%22Wall+Street%22+OR+%22global+markets%22+OR+%22stock+market%22+when:1d&hl=en-US&gl=US&ceid=US:en"],
 ["Buzz","https://news.google.com/rss/search?q=%22stocks+to+watch%22+OR+%22buzzing+stocks%22+OR+rumour+India+when:1d&hl=en-IN&gl=IN&ceid=IN:en"]];
const POS=/\b(rally|rallies|surge|surges|jump|jumps|gain|gains|rise|rises|soar|soars|record high|bullish|upbeat|rebound|climb|climbs|advance|advances|boost)\b/i;
const NEG=/\b(fall|falls|drop|drops|slump|slumps|plunge|plunges|crash|tumble|tumbles|sink|sinks|decline|declines|slide|slides|bearish|selloff|sell-off|losses|weak|fear|fears)\b/i;
const dec=x=>x.replace(/<!\[CDATA\[|\]\]>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/<[^>]+>/g,"").trim();
async function loadNews(env){
  const cached=await env.USERS_KV.get("news:cache",{type:"json"});
  if(cached&&Date.now()-cached.at<240000) return cached.data;
  const all=[];
  await Promise.all(FEEDS.map(async([cat,url])=>{ try{
    const x=await (await fetch(url,{headers:{"user-agent":"Mozilla/5.0"}})).text(), items=[];
    for(const m of x.matchAll(/<item>([\s\S]*?)<\/item>/g)){ const b=m[1];
      const g=t=>{const q=b.match(new RegExp("<"+t+"[^>]*>([\\s\\S]*?)</"+t+">")); return q?dec(q[1]):"";};
      let title=g("title"), source=g("source"); if(source&&title.endsWith(" - "+source)) title=title.slice(0,-(source.length+3));
      items.push({id:cat+":"+title.slice(0,80),cat,title,link:g("link"),source,ts:Date.parse(g("pubDate"))||Date.now(),sent:(POS.test(title)?1:0)-(NEG.test(title)?1:0)}); }
    all.push(...items.sort((a,b)=>b.ts-a.ts).slice(0,15));
  }catch(e){} }));
  if(!all.length) return cached?cached.data:{items:[],outlook:null};
  all.sort((a,b)=>b.ts-a.ts);
  let up=0,down=0; all.forEach(i=>{ if(i.cat!=="Buzz"){ if(i.sent>0)up++; else if(i.sent<0)down++; } });
  const label=up>down*1.3?"Bullish":down>up*1.3?"Bearish":"Mixed";
  const data={items:all,outlook:{label,up,down}};
  await env.USERS_KV.put("news:cache",JSON.stringify({at:Date.now(),data}),{expirationTtl:600});
  return data;
}

function validCandle(c){
  return c && Number.isFinite(Number(c.t)) && Number.isFinite(Number(c.o)) &&
    Number.isFinite(Number(c.h)) && Number.isFinite(Number(c.l)) &&
    Number.isFinite(Number(c.c));
}
function validSeries(a){
  return Array.isArray(a) && a.length>0 && a.every(validCandle);
}
function repairState(s){
  const fresh=seed();
  const repaired={
    cash:Number.isFinite(Number(s.cash))?Number(s.cash):fresh.cash,
    positions:s.positions&&typeof s.positions==="object"?s.positions:{},
    orders:Array.isArray(s.orders)?s.orders:[],
    prices:s.prices&&typeof s.prices==="object"?s.prices:fresh.prices,
    dayOpen:s.dayOpen&&typeof s.dayOpen==="object"?s.dayOpen:fresh.dayOpen,
    dayHigh:s.dayHigh&&typeof s.dayHigh==="object"?s.dayHigh:fresh.dayHigh,
    dayLow:s.dayLow&&typeof s.dayLow==="object"?s.dayLow:fresh.dayLow,
    dayVol:s.dayVol&&typeof s.dayVol==="object"?s.dayVol:fresh.dayVol,
    candles:{},
    dailyCandles:{},
    lastDay:Number.isFinite(Number(s.lastDay))?Number(s.lastDay):fresh.lastDay,
    practice:false,
    updatedAt:Number.isFinite(Number(s.updatedAt))?Number(s.updatedAt):Date.now()
  };
  for(const k in I){
    repaired.candles[k]=validSeries(s.candles&&s.candles[k]) ? s.candles[k].map(c=>({...c,v:Number.isFinite(Number(c.v))?Number(c.v):0})) : fresh.candles[k];
    repaired.dailyCandles[k]=Array.isArray(s.dailyCandles&&s.dailyCandles[k]) ?
      s.dailyCandles[k].filter(validCandle).map(c=>({...c,v:Number.isFinite(Number(c.v))?Number(c.v):0})) : [];
    if(!Number.isFinite(Number(repaired.prices[k]))) repaired.prices[k]=I[k].price;
    if(repaired.candles[k].length<1000){ const f=repaired.candles[k][0]; repaired.candles[k]=histCandles(f.o,1500,CANDLE_MS,f.t,.003,15000).concat(repaired.candles[k]); }
    if(repaired.dailyCandles[k].length<1000){ repaired.dailyCandles[k]=histCandles(Number.isFinite(Number(repaired.dayOpen[k]))?repaired.dayOpen[k]:I[k].price,1825,86400000,dayKey(Date.now())*86400000-19800000,.02,2000000); }
    if(!Number.isFinite(Number(repaired.dayOpen[k]))) repaired.dayOpen[k]=repaired.prices[k];
    if(!Number.isFinite(Number(repaired.dayHigh[k]))) repaired.dayHigh[k]=repaired.prices[k];
    if(!Number.isFinite(Number(repaired.dayLow[k]))) repaired.dayLow[k]=repaired.prices[k];
    if(!Number.isFinite(Number(repaired.dayVol[k]))) repaired.dayVol[k]=0;
  }
  return repaired;
}

export class MarketState{
  constructor(state){this.state=state;this.mem=null;this.lastBulk=0}
  async get(){
    if(this.mem) return this.mem;
    let m=await this.state.storage.get("state");
    if(!m) return repairState(seed());
    if(!m.candles){ // split storage: one key per symbol (keeps every value well under the size limit)
      const keys=[]; for(const k in I) keys.push("c:"+k,"d:"+k);
      const got=await this.state.storage.get(keys);
      m.candles={}; m.dailyCandles={};
      for(const k in I){ m.candles[k]=got.get("c:"+k)||[]; m.dailyCandles[k]=got.get("d:"+k)||[]; }
    }
    return repairState(m);
  }
  async put(s,force){
    this.mem=s;
    const {candles,dailyCandles,...meta}=s; const ent={state:meta}, now=Date.now();
    if(force||now-this.lastBulk>20000){ for(const k in I){ ent["c:"+k]=candles[k]; ent["d:"+k]=dailyCandles[k]; } this.lastBulk=now; }
    await this.state.storage.put(ent); return s;
  }
  async fetch(req){
    let s=advance(await this.get()), u=new URL(req.url);

    if(u.pathname==="/api/state"&&req.method==="GET"){
      await this.put(s);
      let change={};
      for(let k in I) change[k]=+(((s.prices[k]-s.dayOpen[k])/s.dayOpen[k])*100).toFixed(2);
      return json({ok:true,onlineOnly:true,serverTime:new Date().toISOString(),marketOpen:open(Date.now()),cash:s.cash,positions:s.positions,orders:s.orders.slice(-100),prices:s.prices,dayOpen:s.dayOpen,dayHigh:s.dayHigh,dayLow:s.dayLow,dayVol:s.dayVol,changePct:change,instruments:I});
    }
    if(u.pathname==="/api/candles"&&req.method==="GET"){
      let sym=String(u.searchParams.get("symbol")||"").toUpperCase();
      if(!I[sym]) return json({ok:false,error:"Unknown instrument"},400);
      await this.put(s);
      const tf=Math.max(1,parseInt(u.searchParams.get("tf"))||1);
      return json({ok:true,symbol:sym,tf,candles:aggC(s.candles[sym]||[],tf).slice(-400)});
    }
    if(u.pathname==="/api/daily"&&req.method==="GET"){
      let sym=String(u.searchParams.get("symbol")||"").toUpperCase();
      if(!I[sym]) return json({ok:false,error:"Unknown instrument"},400);
      await this.put(s);
      const hist=[...(s.dailyCandles[sym]||[]), {t:Date.now(), o:s.dayOpen[sym], h:s.dayHigh[sym], l:s.dayLow[sym], c:s.prices[sym], v:s.dayVol[sym]}];
      const days=Math.min(2000,parseInt(u.searchParams.get("days"))||365), y=hist.slice(-365);
      return json({ok:true,symbol:sym,daily:hist.slice(-days),hi52:Math.max(...y.map(c=>c.h)),lo52:Math.min(...y.map(c=>c.l))});
    }
    if(u.pathname==="/api/order"&&req.method==="POST"){
      let b; try{b=await req.json()}catch{return json({ok:false,error:"Invalid JSON"},400)};
      let sym=String(b.symbol||"").toUpperCase(),side=String(b.side||"").toUpperCase(),q=Number(b.qty),x=I[sym];
      if(!x)return json({ok:false,error:"Unknown instrument"},400);
      if(!["BUY","SELL"].includes(side)||!Number.isInteger(q)||q<=0||q%x.lot)return json({ok:false,error:"Quantity must be a positive multiple of the MarketIQ game lot size ("+x.lot+")."},400);
      s=advance(s);
      let p=s.prices[sym],value=p*q,fee=value*.0005,pos=s.positions[sym]||{qty:0,avg:0};
      if(side==="BUY"){
        if(s.cash<value+fee)return json({ok:false,error:"Insufficient virtual cash"},400);
        pos.avg=(pos.avg*pos.qty+value)/(pos.qty+q); pos.qty+=q; s.cash-=value+fee;
      } else {
        if(pos.qty<q)return json({ok:false,error:"Insufficient virtual units"},400);
        pos.qty-=q; s.cash+=value-fee; if(!pos.qty)delete s.positions[sym];
      }
      if(pos.qty)s.positions[sym]=pos;
      let o={id:crypto.randomUUID(),symbol:sym,side,qty:q,price:p,value,brokerage:fee,time:new Date().toISOString(),status:"FILLED",virtual:true};
      s.orders.push(o); await this.put(s);
      return json({ok:true,order:o,cash:s.cash,positions:s.positions});
    }
    if(u.pathname==="/api/settings"&&req.method==="POST"){
      let b; try{b=await req.json()}catch{b={}}
      s.practice=!!b.practice; await this.put(s);
      return json({ok:true,practice:s.practice,marketOpen:open(Date.now())});
    }
    if(u.pathname==="/api/reset"&&req.method==="POST"){ await this.put(repairState(seed()),true); return json({ok:true,reset:true}); }
    if(u.pathname==="/api/seed-demo"&&req.method==="POST"){
      const now=Date.now();
      for(let k in I){
        let p=I[k].price*(0.9+Math.random()*0.2);
        const intraday=[]; const start=now-390*CANDLE_MS;
        for(let i=0;i<390;i++){ const o=p; p=Math.max(.01,p*(1+(Math.random()-.5)*.003)); const h=Math.max(o,p)*(1+Math.random()*.001), l=Math.min(o,p)*(1-Math.random()*.001); intraday.push({t:start+i*CANDLE_MS,o,h,l,c:p,v:Math.round(Math.random()*15000+2000)}); }
        s.candles[k]=intraday;
        s.prices[k]=p;
        s.dayOpen[k]=intraday[0].o; s.dayHigh[k]=Math.max(...intraday.map(c=>c.h)); s.dayLow[k]=Math.min(...intraday.map(c=>c.l)); s.dayVol[k]=intraday.reduce((a,c)=>a+c.v,0);
        const daily=[]; let dp=I[k].price*(0.85+Math.random()*0.3);
        for(let d=60;d>=1;d--){ const o=dp; dp=Math.max(.01,dp*(1+(Math.random()-.5)*.02)); const h=Math.max(o,dp)*(1+Math.random()*.01), l=Math.min(o,dp)*(1-Math.random()*.01); daily.push({t:now-d*86400000,o,h,l,c:dp,v:Math.round(Math.random()*2000000+300000)}); }
        s.dailyCandles[k]=daily;
      }
      s.updatedAt=now; await this.put(s);
      return json({ok:true,seeded:true});
    }
    return json({ok:false,error:"Not found"},404);
  }
}

export default{
  async fetch(req,env){
    if(req.method==="OPTIONS")return new Response(null,{headers:CORS});
    let url=new URL(req.url);

    // ---- Auth endpoints (use USERS_KV, not Durable Object) ----
    if(url.pathname==="/api/auth/signup"&&req.method==="POST"){
      let b; try{b=await req.json()}catch{return json({ok:false,error:"Invalid JSON"},400)};
      let username=String(b.username||"").trim().toLowerCase();
      let password=String(b.password||"");
      if(!/^[a-z0-9_]{3,20}$/.test(username)) return json({ok:false,error:"Username must be 3-20 chars: letters, numbers, underscore only"},400);
      if(password.length<6) return json({ok:false,error:"Password must be at least 6 characters"},400);
      const existing=await env.USERS_KV.get("user:"+username);
      if(existing) return json({ok:false,error:"Username already taken"},400);
      const salt=crypto.randomUUID();
      const hash=await hashPassword(password,salt);
      await env.USERS_KV.put("user:"+username, JSON.stringify({hash,salt,createdAt:Date.now()}));
      const token=crypto.randomUUID();
      await env.USERS_KV.put("session:"+token, username, {expirationTtl:60*60*24*365});
      return json({ok:true,token,username});
    }
    if(url.pathname==="/api/auth/login"&&req.method==="POST"){
      let b; try{b=await req.json()}catch{return json({ok:false,error:"Invalid JSON"},400)};
      let username=String(b.username||"").trim().toLowerCase();
      let password=String(b.password||"");
      const raw=await env.USERS_KV.get("user:"+username);
      if(!raw) return json({ok:false,error:"Invalid username or password"},400);
      const rec=JSON.parse(raw);
      const hash=await hashPassword(password,rec.salt);
      if(hash!==rec.hash) return json({ok:false,error:"Invalid username or password"},400);
      const token=crypto.randomUUID();
      await env.USERS_KV.put("session:"+token, username, {expirationTtl:60*60*24*365});
      return json({ok:true,token,username});
    }
    if(url.pathname==="/api/auth/me"&&req.method==="GET"){
      const username=await resolveUser(req,env);
      if(!username) return json({ok:false,error:"Not logged in"},401);
      return json({ok:true,username});
    }

    if(url.pathname==="/api/news"&&req.method==="GET"){ const d=await loadNews(env); return json({ok:true,...d}); }

    // ---- Game endpoints (require session) ----
    if(url.pathname.startsWith("/api/")){
      const username=await resolveUser(req,env);
      if(!username) return json({ok:false,error:"Not logged in"},401);
      let id=env.MARKET_STATE.idFromName("player-"+username);
      return env.MARKET_STATE.get(id).fetch(req);
    }
    return new Response("MarketIQ API server is running.",{headers:CORS});
  }
}

async function hashPassword(password,salt){
  const data=new TextEncoder().encode(salt+":"+password);
  const buf=await crypto.subtle.digest("SHA-256",data);
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function resolveUser(req,env){
  const auth=req.headers.get("Authorization")||"";
  const token=auth.startsWith("Bearer ")?auth.slice(7):null;
  if(!token) return null;
  return await env.USERS_KV.get("session:"+token);
}
