const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
const START_CASH=1000000;
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
DIAMOND:{name:"Diamond (educational proxy)",sector:"Educational",price:100000,lot:1}};
const json=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{"content-type":"application/json",...CORS}});
const seed=()=>({cash:START_CASH,positions:{},orders:[],prices:Object.fromEntries(Object.entries(I).map(([k,v])=>[k,v.price])),updatedAt:Date.now()});
function open(){let d=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Kolkata"})),m=d.getHours()*60+d.getMinutes();return d.getDay()>0&&d.getDay()<6&&m>=570&&m<930}
function advance(s){let n=Date.now(),steps=Math.min(40,Math.floor(Math.max(0,n-s.updatedAt)/2500));if(open())for(let k=0;k<steps;k++)for(let [k2,v] of Object.entries(I))s.prices[k2]=Math.max(.01,s.prices[k2]*(1+(Math.random()-.495)*.0012));s.updatedAt=n;return s}
export class MarketState{
constructor(state){this.state=state}
async get(){return await this.state.storage.get("state")||seed()}
async put(s){await this.state.storage.put("state",s);return s}
async fetch(req){let s=advance(await this.get()),u=new URL(req.url);
if(u.pathname==="/api/state"&&req.method==="GET"){await this.put(s);return json({ok:true,onlineOnly:true,serverTime:new Date().toISOString(),marketOpen:open(),cash:s.cash,positions:s.positions,orders:s.orders.slice(-100),prices:s.prices,instruments:I})}
if(u.pathname==="/api/order"&&req.method==="POST"){let b;try{b=await req.json()}catch{return json({ok:false,error:"Invalid JSON"},400)};let sym=String(b.symbol||"").toUpperCase(),side=String(b.side||"").toUpperCase(),q=Number(b.qty),x=I[sym];if(!x)return json({ok:false,error:"Unknown instrument"},400);if(!["BUY","SELL"].includes(side)||!Number.isInteger(q)||q<=0||q%x.lot)return json({ok:false,error:"Quantity must be a positive multiple of the MarketIQ game lot size ("+x.lot+")."},400);s=advance(s);let p=s.prices[sym],value=p*q,fee=value*.0005,pos=s.positions[sym]||{qty:0,avg:0};
if(side==="BUY"){if(s.cash<value+fee)return json({ok:false,error:"Insufficient virtual cash"},400);pos.avg=(pos.avg*pos.qty+value)/(pos.qty+q);pos.qty+=q;s.cash-=value+fee}else{if(pos.qty<q)return json({ok:false,error:"Insufficient virtual units"},400);pos.qty-=q;s.cash+=value-fee;if(!pos.qty)delete s.positions[sym]}
if(pos.qty)s.positions[sym]=pos;let o={id:crypto.randomUUID(),symbol:sym,side,qty:q,price:p,value,brokerage:fee,time:new Date().toISOString(),status:"FILLED",virtual:true};s.orders.push(o);await this.put(s);return json({ok:true,order:o,cash:s.cash,positions:s.positions})}
return json({ok:false,error:"Not found"},404)}}
export default{async fetch(req,env){if(req.method==="OPTIONS")return new Response(null,{headers:CORS});if(new URL(req.url).pathname.startsWith("/api/")){let id=env.MARKET_STATE.idFromName("global-market");return env.MARKET_STATE.get(id).fetch(req)}return new Response("MarketIQ API server is running.",{headers:CORS})}}
