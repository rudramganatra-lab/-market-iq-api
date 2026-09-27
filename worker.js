const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
const START_CASH=1000000;
const CANDLE_MS=60000;
const MAX_CANDLES=500;
const MAX_DAILY=1500;
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

function istParts(){ const d=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Kolkata"})); return d; }
function istDateStr(){ const d=istParts(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function open(){ const d=istParts(); const m=d.getHours()*60+d.getMinutes(); return d.getDay()!==0 && m>=555 && m<930; } // Mon-Sat, 9:15-15:30 IST

function freshCandles(){ let c={}; const t=Math.floor(Date.now()/CANDLE_MS)*CANDLE_MS; for(let k in I) c[k]=[{t,o:I[k].price,h:I[k].price,l:I[k].price,c:I[k].price,v:0}]; return c; }
function freshDaily(){ let c={}; for(let k in I) c[k]=[]; return c; }
const seed=()=>({
  cash:START_CASH, positions:{}, orders:[],
  prices:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,v.price])),
  dayOpen:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,v.price])),
  dayHigh:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,v.price])),
  dayLow:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,v.price])),
  dayVol:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,0])),
  candles:freshCandles(), dailyCandles:freshDaily(), lastDay:istDateStr(),
  updatedAt:Date.now()
});

function rolloverDayIfNeeded(s){
  const today=istDateStr();
  if(s.lastDay!==today){
    for(let k in I){
      s.dailyCandles[k].push({t:Date.now(), o:s.dayOpen[k], h:s.dayHigh[k], l:s.dayLow[k], c:s.prices[k], v:s.dayVol[k]});
      if(s.dailyCandles[k].length>MAX_DAILY) s.dailyCandles[k].shift();
      s.dayOpen[k]=s.prices[k]; s.dayHigh[k]=s.prices[k]; s.dayLow[k]=s.prices[k]; s.dayVol[k]=0;
    }
    s.lastDay=today;
  }
}

function tickOne(s,k){
  let old=s.prices[k];
  let np=Math.max(.01, old*(1+(Math.random()-.5)*.0016));
  s.prices[k]=np;
  if(np>s.dayHigh[k])s.dayHigh[k]=np;
  if(np<s.dayLow[k])s.dayLow[k]=np;
  let vol=Math.round(Math.abs(np-old)/old*5000000+Math.random()*8000);
  s.dayVol[k]=(s.dayVol[k]||0)+vol;
  let bucket=Math.floor(Date.now()/CANDLE_MS)*CANDLE_MS;
  let arr=s.candles[k];
  let last=arr[arr.length-1];
  if(last&&last.t===bucket){ last.h=Math.max(last.h,np); last.l=Math.min(last.l,np); last.c=np; last.v+=vol; }
  else { arr.push({t:bucket,o:old,h:Math.max(old,np),l:Math.min(old,np),c:np,v:vol}); if(arr.length>MAX_CANDLES) arr.shift(); }
}

function advance(s){
  if(!s.candles || !s.dailyCandles || !s.dayVol){
    const fresh=seed();
    s=Object.assign(fresh, {cash:s.cash, positions:s.positions, orders:s.orders});
  }
  rolloverDayIfNeeded(s);
  let n=Date.now(), steps=Math.min(40,Math.floor(Math.max(0,n-s.updatedAt)/2500));
  if(open()) for(let k=0;k<steps;k++) for(let sym in I) tickOne(s,sym);
  s.updatedAt=n;
  return s;
}

export class MarketState{
  constructor(state){this.state=state}
  async get(){ let s=await this.state.storage.get("state"); return (s&&s.candles&&s.dailyCandles)?s:seed(); }
  async put(s){await this.state.storage.put("state",s);return s}
  async fetch(req){
    let s=advance(await this.get()), u=new URL(req.url);

    if(u.pathname==="/api/state"&&req.method==="GET"){
      await this.put(s);
      let change={};
      for(let k in I) change[k]=+(((s.prices[k]-s.dayOpen[k])/s.dayOpen[k])*100).toFixed(2);
      return json({ok:true,onlineOnly:true,serverTime:new Date().toISOString(),marketOpen:open(),cash:s.cash,positions:s.positions,orders:s.orders.slice(-100),prices:s.prices,dayOpen:s.dayOpen,dayHigh:s.dayHigh,dayLow:s.dayLow,dayVol:s.dayVol,changePct:change,instruments:I});
    }
    if(u.pathname==="/api/candles"&&req.method==="GET"){
      let sym=String(u.searchParams.get("symbol")||"").toUpperCase();
      if(!I[sym]) return json({ok:false,error:"Unknown instrument"},400);
      await this.put(s);
      return json({ok:true,symbol:sym,candles:s.candles[sym]||[]});
    }
    if(u.pathname==="/api/daily"&&req.method==="GET"){
      let sym=String(u.searchParams.get("symbol")||"").toUpperCase();
      if(!I[sym]) return json({ok:false,error:"Unknown instrument"},400);
      await this.put(s);
      const hist=[...(s.dailyCandles[sym]||[]), {t:Date.now(), o:s.dayOpen[sym], h:s.dayHigh[sym], l:s.dayLow[sym], c:s.prices[sym], v:s.dayVol[sym]}];
      return json({ok:true,symbol:sym,daily:hist});
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
    if(u.pathname==="/api/reset"&&req.method==="POST"){ await this.put(seed()); return json({ok:true,reset:true}); }
    return json({ok:false,error:"Not found"},404);
  }
}

export default{
  async fetch(req,env){
    if(req.method==="OPTIONS")return new Response(null,{headers:CORS});
    let url=new URL(req.url);
    if(url.pathname.startsWith("/api/")){
      let uid=url.searchParams.get("uid")||"guest";
      let id=env.MARKET_STATE.idFromName("player-"+uid);
      return env.MARKET_STATE.get(id).fetch(req);
    }
    return new Response("MarketIQ API server is running.",{headers:CORS});
  }
}
