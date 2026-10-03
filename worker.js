// MarketIQ backend v3 — shared world-market simulation (same prices for every user), per-user wallet.
const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization"};
const START_CASH=10000000, FEE=0.0005;
const json=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{"content-type":"application/json",...CORS}});
const FX={INR:1,USD:88.2,EUR:103,GBP:118,JPY:0.59,HKD:11.3};

/* ================= INSTRUMENTS ================= */
const T={};
function add(grp,mkt,ccy,vol,rows){ for(const r of rows) T[r[0]]={sym:r[0],name:r[1],sector:r[2],grp,mkt,ccy,fx:FX[ccy],base:r[3],lot:r[4]||1,vol:vol,kind:"EQ"}; }
add("India","IN","INR",.017,[
["RELIANCE","Reliance Industries","Energy",2925.4],["TCS","Tata Consultancy Services","IT",4140.2],["HDFCBANK","HDFC Bank","Banking",1948.6],["INFY","Infosys","IT",1512.3],
["ICICIBANK","ICICI Bank","Banking",1425.7],["SBIN","State Bank of India","Banking",825.3],["BHARTIARTL","Bharti Airtel","Telecom",1810.5],["ITC","ITC","FMCG",458.25],
["LT","Larsen & Toubro","Industrials",3840.8],["MARUTI","Maruti Suzuki","Auto",14220],["TATASTEEL","Tata Steel","Metals",178.4,10],["SUNPHARMA","Sun Pharma","Healthcare",1745.2],
["HINDUNILVR","Hindustan Unilever","FMCG",2765.1],["AXISBANK","Axis Bank","Banking",1235.6],["WIPRO","Wipro","IT",265.4],["KOTAKBANK","Kotak Mahindra Bank","Banking",2150],
["BAJFINANCE","Bajaj Finance","Finance",950],["ADANIENT","Adani Enterprises","Conglomerate",2480],["TATAMOTORS","Tata Motors","Auto",720],["ONGC","ONGC","Energy",245],
["NTPC","NTPC","Power",350],["TITAN","Titan Company","Consumer",3500],["ASIANPAINT","Asian Paints","Consumer",2350],["HCLTECH","HCL Technologies","IT",1620]]);
add("India","IN","INR",.017,[
["BAJAJFINSV","Bajaj Finserv","Finance",2050],["DRREDDY","Dr. Reddy's Labs","Healthcare",1280],["CIPLA","Cipla","Healthcare",1560],["EICHERMOT","Eicher Motors","Auto",5600],
["GRASIM","Grasim Industries","Cement",2750],["HINDALCO","Hindalco","Metals",720],["JSWSTEEL","JSW Steel","Metals",1080],["POWERGRID","Power Grid Corp","Power",295],
["COALINDIA","Coal India","Mining",395],["NESTLEIND","Nestlé India","FMCG",1250],["ULTRACEMCO","UltraTech Cement","Cement",12300],["TECHM","Tech Mahindra","IT",1580],
["INDUSINDBK","IndusInd Bank","Banking",820],["ADANIPORTS","Adani Ports","Infra",1420],["APOLLOHOSP","Apollo Hospitals","Healthcare",7400],["BPCL","BPCL","Energy",330],
["BRITANNIA","Britannia","FMCG",5900],["DIVISLAB","Divi's Labs","Healthcare",6100],["HEROMOTOCO","Hero MotoCorp","Auto",4700],["SBILIFE","SBI Life Insurance","Insurance",1850],
["TATACONSUM","Tata Consumer","FMCG",1120],["ZOMATO","Zomato (Eternal)","Consumer",285],["IRCTC","IRCTC","Travel",760],["DMART","Avenue Supermarts","Retail",4100],
["PIDILITIND","Pidilite","Chemicals",3000],["VEDL","Vedanta","Metals",470],["LICI","LIC of India","Insurance",920],["BAJAJAUTO","Bajaj Auto","Auto",8900],["M_M","Mahindra & Mahindra","Auto",3300],["TRENT","Trent","Retail",5500]]);
add("India","IN","INR",.03,[["SWIGGY","Swiggy Ltd","IPO",420.5],["OLAELEC","Ola Electric Mobility","IPO",68.2],["VMM","Vishal Mega Mart","IPO",112.8],["HYUNDAI","Hyundai Motor India","IPO",1865],["NTPCGREEN","NTPC Green Energy","IPO",118.4]]);
add("Indices","IN","INR",.009,[["NIFTY50","NIFTY 50","Index",25840.2],["BANKNIFTY","NIFTY Bank","Index",58540],["SENSEX","BSE Sensex","Index",84600],["NIFTYIT","NIFTY IT","Index",38500]]);
add("Indices","US","USD",.009,[["SPX","S&P 500","Index",6700],["NDX","Nasdaq 100","Index",24500],["DJI","Dow Jones","Index",46500]]);
add("Indices","EU","EUR",.009,[["DAX","DAX 40","Index",24000],["CAC40","CAC 40","Index",7900]]);
add("Indices","EU","GBP",.009,[["FTSE","FTSE 100","Index",9500]]);
add("Indices","JP","JPY",.01,[["NIKKEI","Nikkei 225","Index",45000]]);
add("Indices","HK","HKD",.012,[["HSI","Hang Seng","Index",26500]]);
add("USA","US","USD",.018,[["AAPL","Apple","Technology",255],["MSFT","Microsoft","Technology",520],["NVDA","NVIDIA","Technology",185],["GOOGL","Alphabet","Technology",245],
["AMZN","Amazon","Consumer",230],["META","Meta Platforms","Technology",750],["TSLA","Tesla","Auto",430],["JPM","JPMorgan Chase","Banking",300],["V","Visa","Finance",345],
["WMT","Walmart","Retail",100],["KO","Coca-Cola","FMCG",68],["DIS","Walt Disney","Media",110],["NFLX","Netflix","Media",1200],["AMD","AMD","Technology",160],
["INTC","Intel","Technology",24],["BA","Boeing","Industrials",215],["PFE","Pfizer","Healthcare",26],["XOM","Exxon Mobil","Energy",110],["ORCL","Oracle","Technology",280],["TSM","TSMC (ADR)","Technology",285]]);
add("USA","US","USD",.018,[["BAC","Bank of America","Banking",50],["WFC","Wells Fargo","Banking",82],["GS","Goldman Sachs","Banking",760],["MA","Mastercard","Finance",580],
["HD","Home Depot","Retail",390],["PG","Procter & Gamble","FMCG",155],["JNJ","Johnson & Johnson","Healthcare",185],["UNH","UnitedHealth","Healthcare",320],["LLY","Eli Lilly","Healthcare",780],
["MRK","Merck","Healthcare",85],["ABBV","AbbVie","Healthcare",215],["CVX","Chevron","Energy",155],["CSCO","Cisco","Technology",68],["ADBE","Adobe","Technology",350],["CRM","Salesforce","Technology",245],
["QCOM","Qualcomm","Technology",165],["MU","Micron","Technology",125],["PYPL","PayPal","Finance",70],["UBER","Uber","Consumer",95],["COST","Costco","Retail",930],["MCD","McDonald's","Consumer",305],
["NKE","Nike","Consumer",75],["T","AT&T","Telecom",28],["VZ","Verizon","Telecom",42],["CAT","Caterpillar","Industrials",470],["GE","GE Aerospace","Industrials",285],["LMT","Lockheed Martin","Defense",470],
["PLTR","Palantir","Technology",175],["COIN","Coinbase","Finance",330]]);
add("Europe","EU","EUR",.014,[["SAP","SAP SE","Technology",230],["ASML","ASML Holding","Technology",800],["LVMH","LVMH","Luxury",560],["NESN","Nestlé","FMCG",90],["AIR","Airbus","Industrials",175],["SIE","Siemens","Industrials",220],["TTE","TotalEnergies","Energy",58]]);
add("Europe","EU","GBP",.014,[["SHEL","Shell","Energy",27],["HSBA","HSBC","Banking",9.5],["AZN","AstraZeneca","Healthcare",125]]);
add("Asia","JP","JPY",.016,[["TOYOTA","Toyota Motor","Auto",2800],["SONY","Sony Group","Technology",3900],["SOFTBANK","SoftBank Group","Technology",14000],["NINTENDO","Nintendo","Gaming",13500]]);
add("Asia","HK","HKD",.02,[["TENCENT","Tencent","Technology",620],["ALIBABA","Alibaba (HK)","Technology",150],["XIAOMI","Xiaomi","Technology",55],["BYD","BYD Company","Auto",105],["MEITUAN","Meituan","Consumer",120]]);
add("Mutual Funds","IN","INR",.008,[["PPFCF","Parag Parikh Flexi Cap Fund","Flexi Cap",88],["SBIBCF","SBI Bluechip Fund","Large Cap",98],["HDFCFC","HDFC Flexi Cap Fund","Flexi Cap",2050],
["AXISBCF","Axis Bluechip Fund","Large Cap",62],["MIRAELC","Mirae Asset Large Cap Fund","Large Cap",118],["NIPSMALL","Nippon India Small Cap Fund","Small Cap",172],["SBISMALL","SBI Small Cap Fund","Small Cap",165],
["QUANTSM","Quant Small Cap Fund","Small Cap",260],["KOTAKEMG","Kotak Emerging Equity Fund","Mid Cap",135],["HDFCMID","HDFC Mid-Cap Opportunities","Mid Cap",205],["ICICIBAL","ICICI Pru Balanced Advantage","Hybrid",68],
["UTINIFTY","UTI Nifty 50 Index Fund","Index Fund",165],["AXISELSS","Axis ELSS Tax Saver","ELSS",95],["MOTINQ","Motilal Oswal Nasdaq 100 FoF","International",38]]);
add("ETFs","IN","INR",.009,[["NIFTYBEES","Nippon Nifty 50 BeES","Index ETF",285],["BANKBEES","Nippon Bank BeES","Sector ETF",590],["GOLDBEES","Nippon Gold BeES","Gold ETF",105],["SILVERBEES","Nippon Silver BeES","Silver ETF",125],
["ITBEES","Nippon IT BeES","Sector ETF",46],["JUNIORBEES","Nippon Junior BeES","Index ETF",760],["MON100","Motilal Nasdaq 100 ETF","International",215],["SETFNIF50","SBI Nifty 50 ETF","Index ETF",280]]);
add("ETFs","US","USD",.01,[["SPY","SPDR S&P 500 ETF","Index ETF",670],["QQQ","Invesco QQQ Trust","Index ETF",590],["VOO","Vanguard S&P 500 ETF","Index ETF",615],["VTI","Vanguard Total Market","Index ETF",330],
["GLD","SPDR Gold Shares","Gold ETF",360],["IWM","iShares Russell 2000","Index ETF",245],["XLK","Technology Select Sector","Sector ETF",290],["ARKK","ARK Innovation ETF","Thematic ETF",75]]);
add("Commodities","MCX","INR",.011,[["GOLD","Gold (₹/10g, proxy)","Metal",112850],["SILVER","Silver (₹/kg, proxy)","Metal",132450],["CRUDEOIL","Crude Oil (₹/bbl)","Energy",5950],["NATGAS","Natural Gas (₹/mmBtu)","Energy",270],["COPPER","Copper (₹/kg)","Metal",920]]);
add("Commodities","GL","USD",.011,[["XAUUSD","Gold Spot (US$/oz)","Metal",3900],["XAGUSD","Silver Spot (US$/oz)","Metal",47],["WTI","WTI Crude (US$/bbl)","Energy",65],["BRENT","Brent Crude (US$/bbl)","Energy",69]]);
add("Currencies","GL","INR",.004,[["USDINR","US Dollar / Rupee","Currency",88.2,1000],["EURINR","Euro / Rupee","Currency",103,1000],["GBPINR","Pound / Rupee","Currency",118,1000],["JPYINR","Yen / Rupee","Currency",0.59,1000]]);
add("Currencies","GL","USD",.005,[["EURUSD","Euro / US Dollar","Currency",1.17,1000],["GBPUSD","Pound / US Dollar","Currency",1.34,1000]]);
add("Currencies","GL","JPY",.005,[["USDJPY","US Dollar / Yen","Currency",148,1000]]);
add("Crypto","CR","USD",.03,[["BTC","Bitcoin (per 0.01 BTC)","Crypto",1050],["ETH","Ethereum (per 0.1 ETH)","Crypto",420],["SOL","Solana","Crypto",200],["XRP","XRP","Crypto",2.6],["BNB","BNB","Crypto",900],["DOGE","Dogecoin","Crypto",0.24,100]]);

/* ================= MARKET HOURS (UTC minutes) ================= */
const MN={IN:"NSE",MCX:"MCX",US:"US market",EU:"European market",JP:"Tokyo market",HK:"Hong Kong market",GL:"Global market",CR:"Crypto"};
const HRS={IN:"NSE trades 9:15 AM–3:30 PM IST, Mon–Fri.",MCX:"MCX trades 9:00 AM–11:30 PM IST, Mon–Fri.",US:"US trades ≈7:00 PM–1:30 AM IST (Mon–Fri).",EU:"Europe trades ≈12:30 PM–9:00 PM IST (Mon–Fri).",JP:"Tokyo trades ≈5:30–11:30 AM IST (Mon–Fri).",HK:"Hong Kong trades ≈7:00 AM–1:30 PM IST (Mon–Fri).",GL:"Trades 24 hours, Mon–Fri.",CR:"Trades 24x7."};
function dstUS(ts){const d=new Date(ts),m=d.getUTCMonth()+1,x=d.getUTCDate();return (m>3&&m<11)||(m===3&&x>=9)||(m===11&&x<2);}
function dstEU(ts){const d=new Date(ts),m=d.getUTCMonth()+1,x=d.getUTCDate();return (m>3&&m<10)||(m===3&&x>=29)||(m===10&&x<25);}
function sess(mkt,ts){
  switch(mkt){case"IN":return[225,600];case"MCX":return[210,1080];case"JP":return[0,360];case"HK":return[90,480];
    case"US":return dstUS(ts)?[810,1200]:[870,1260];case"EU":return dstEU(ts)?[420,930]:[480,990];}
  return null;
}
function isOpen(mkt,ts){
  if(mkt==="CR") return true;
  const d=new Date(ts),dow=d.getUTCDay(),min=d.getUTCHours()*60+d.getUTCMinutes();
  if(mkt==="GL") return !(dow===6||(dow===0&&min<1320)||(dow===5&&min>=1320));
  const s=sess(mkt,ts); return dow>0&&dow<6&&min>=s[0]&&min<s[1];
}
function lastActive(mkt,ts){
  if(isOpen(mkt,ts)) return ts;
  let t=Math.floor(ts/60000)*60000;
  for(let i=0;i<8000;i++){ t-=60000; if(isOpen(mkt,t)) return t+59999; }
  return ts;
}

/* ================= DETERMINISTIC PRICE ENGINE ================= */
function hash32(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rnd(n){let t=(n+0x6D2B79F5)>>>0;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;}
const OCT=[5,12,30,75,180,450,1200,3000,7500,19000,48000,120000,300000,750000,1.9e6,4.7e6,1.2e7,2.4e7]; // seconds: self-similar "Brownian-like" layers
const ANCHOR=Date.UTC(2026,9,1,6,0), MC=new Map(), K_AMP=3.2;
function model(sym){
  let m=MC.get(sym); if(m) return m;
  const h=hash32(sym), vol=T[sym].vol; m={h,vol,A:OCT.map((P,k)=>vol*(P<=3000?2.6:1.8)*Math.sqrt(P/86400)*(0.8+rnd(h+k*131)*0.4))};
  MC.set(sym,m); return m;
}
function vn(h,k,x){const i=Math.floor(x),f=x-i,u=f*f*(3-2*f),a=rnd((h+Math.imul(i,0x9E3779B1)+k*7919)>>>0),b=rnd((h+Math.imul(i+1,0x9E3779B1)+k*7919)>>>0);return a+(b-a)*u-.5;}
function lp(m,t){
  const s=t/1000, reg=0.65+0.9*(vn(m.h,77,s/36000)+.5); let x=0; // volatility clustering on intraday layers
  for(let k=0;k<OCT.length;k++) x+=m.A[k]*vn(m.h,k,s/OCT[k])*(OCT[k]<=3000?reg:1);
  return x;
}
function uPrice(sym,t){const m=model(sym);return T[sym].base*Math.exp(lp(m,t)-lp(m,ANCHOR));}
const MON=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const expTs=(d,mon,y)=>Date.UTC(2000+ +y,MON.indexOf(mon),+d,10,0); // 15:30 IST
const OLOT={NIFTY:75,BANKNIFTY:35}, OUND={NIFTY:"NIFTY50",BANKNIFTY:"BANKNIFTY"}, OSIG={NIFTY:.14,BANKNIFTY:.17};
const FLOT={NIFTY:75,BANKNIFTY:35,RELIANCE:500,TCS:175,HDFCBANK:550,INFY:400,SBIN:750,MES:5,MNQ:2,MCL:100,MGC:10};
const FUND={NIFTY:"NIFTY50",BANKNIFTY:"BANKNIFTY",MES:"SPX",MNQ:"NDX",MCL:"WTI",MGC:"XAUUSD"};
const DC=new Map();
function inst(sym){
  if(T[sym]) return T[sym];
  if(DC.has(sym)) return DC.get(sym);
  let m=/^(NIFTY|BANKNIFTY)-(\d{2})([A-Z]{3})(\d{2})-(\d+)-(CE|PE)$/.exec(sym), r=null;
  if(m&&MON.includes(m[3])) r={sym,name:`${m[1]==="NIFTY"?"NIFTY":"BANK NIFTY"} ${m[2]} ${m[3][0]+m[3].slice(1).toLowerCase()} ${m[5]} ${m[6]}`,sector:`${m[1]} weekly options`,grp:"Options",mkt:"IN",ccy:"INR",fx:1,lot:OLOT[m[1]],kind:"OPT",und:OUND[m[1]],exp:expTs(m[2],m[3],m[4]),K:+m[5],cp:m[6],sig:OSIG[m[1]]};
  else { m=/^([A-Z0-9]+)-FUT-(\d{2})([A-Z]{3})(\d{2})$/.exec(sym);
    if(m&&FLOT[m[1]]&&MON.includes(m[3])){ const u=FUND[m[1]]||m[1]; if(T[u]) r={sym,name:`${m[1]} Futures ${m[2]} ${m[3][0]+m[3].slice(1).toLowerCase()}`,sector:"Futures",grp:"Futures",mkt:T[u].mkt,ccy:T[u].ccy,fx:T[u].fx,lot:FLOT[m[1]],kind:"FUT",und:u,exp:expTs(m[2],m[3],m[4])}; } }
  if(r){ DC.set(sym,r); }
  return r;
}
function ncdf(x){const a=Math.abs(x),t=1/(1+.2316419*a),d=.3989423*Math.exp(-a*a/2),p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return x>0?1-p:p;}
function bs(S,K,Tm,r,s,cp){
  if(Tm<=1e-7) return Math.max(0,cp==="CE"?S-K:K-S);
  const sq=s*Math.sqrt(Tm),d1=(Math.log(S/K)+(r+s*s/2)*Tm)/sq,d2=d1-sq;
  return cp==="CE"?S*ncdf(d1)-K*Math.exp(-r*Tm)*ncdf(d2):K*Math.exp(-r*Tm)*ncdf(-d2)-S*ncdf(-d1);
}
function price(sym,t){
  const i=inst(sym); let p;
  if(i.kind==="EQ") p=uPrice(sym,t);
  else { const S=uPrice(i.und,t), Tm=Math.max(0,(i.exp-t)/31557600000);
    p=i.kind==="FUT"?S*Math.exp((i.ccy==="INR"?.065:.045)*Tm):Math.max(.05,bs(S,i.K,Tm,.065,i.sig,i.cp)); }
  return +p.toFixed(p<10?4:2);
}
function lastThu(y,m){const d=new Date(Date.UTC(y,m+1,0,10,0));while(d.getUTCDay()!==4)d.setUTCDate(d.getUTCDate()-1);return d.getTime();}
const lbl=ts=>{const d=new Date(ts);return String(d.getUTCDate()).padStart(2,"0")+MON[d.getUTCMonth()]+String(d.getUTCFullYear()).slice(2);};
function derivedList(now){
  const d=new Date(now),y=d.getUTCFullYear(),mo=d.getUTCMonth(),out=[];
  let n1=lastThu(y,mo); if(n1<now) n1=lastThu(y,mo+1); const nd=new Date(n1); const n2=lastThu(nd.getUTCFullYear(),nd.getUTCMonth()+1);
  for(const b of["NIFTY","BANKNIFTY"]) out.push(`${b}-FUT-${lbl(n1)}`,`${b}-FUT-${lbl(n2)}`);
  for(const b of["RELIANCE","TCS","HDFCBANK","INFY","SBIN","MES","MNQ","MCL","MGC"]) out.push(`${b}-FUT-${lbl(n1)}`);
  let wk=Date.UTC(y,mo,d.getUTCDate()+((2-d.getUTCDay()+7)%7),10,0); if(wk<now) wk+=7*86400000;
  const C={}; const c=mctx("IN",now,C);
  for(const [b,step] of [["NIFTY",50],["BANKNIFTY",100]]){
    const S=uPrice(OUND[b],c.te), atm=Math.round(S/step)*step;
    for(let k=-6;k<=6;k++) for(const cp of["CE","PE"]) out.push(`${b}-${lbl(wk)}-${atm+k*step}-${cp}`);
  }
  return out;
}

/* ================= VOLUME ================= */
function vbase(sym){
  const i=inst(sym); if(i._vb) return i._vb;
  const u=i.kind==="EQ"?i:T[i.und], h=hash32(u.sym), r=0.2+rnd(h+5)*2;
  const tn={India:4e7,USA:2e9,Europe:3e8,Asia:3e8,Indices:1e8,ETFs:u.mkt==="US"?3e9:2e7,"Mutual Funds":1e6,Commodities:3e7,Currencies:8e7,Crypto:1e9}[u.grp]||1e7;
  i._vb=Math.max(10,Math.round(tn*r*(i.kind==="EQ"?1:.15)*(u.sector==="IPO"?.4:1)/(u.base*u.fx))); return i._vb;
}
function ushape(i,t){
  const s=sess(i.mkt,t), d=new Date(t), m=d.getUTCHours()*60+d.getUTCMinutes();
  if(!s) return 1+0.25*Math.sin(m/1440*6.283);
  const f=Math.min(1,Math.max(0,(m-s[0])/(s[1]-s[0]))); return 1+1.2*(Math.exp(-f*12)+Math.exp(-(1-f)*12));
}

/* ================= QUOTES ================= */
function mctx(mkt,now,C){
  if(C[mkt]) return C[mkt];
  const te=lastActive(mkt,now), d=new Date(te), day0=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()); let o,pc;
  if(mkt==="CR"||mkt==="GL"){ o=day0; pc=day0-1; }
  else { const s=sess(mkt,te); o=day0+s[0]*60000; let pd=day0-86400000;
    for(let i=0;i<7;i++){ const w=new Date(pd).getUTCDay(); if(w>0&&w<6) break; pd-=86400000; }
    pc=pd+sess(mkt,pd)[1]*60000-1; }
  return C[mkt]={te,o,pc,open:isOpen(mkt,now)};
}
function quote(sym,now,C){
  const i=inst(sym); if(!i) return null;
  const c=mctx(i.mkt,now,C), p=price(sym,c.te), pc=price(sym,c.pc), span=Math.max(0,c.te-c.o), n=Math.min(30,Math.max(1,Math.floor(span/600000)));
  let hi=p,lo=p; for(let k=0;k<=n;k++){ const q=price(sym,c.o+span*k/n); if(q>hi)hi=q; if(q<lo)lo=q; }
  return {i,p,op:price(sym,c.o),hi,lo,vol:Math.round(vbase(sym)*Math.max(1,span/60000)*1.2*(0.8+0.4*rnd(hash32(sym)+Math.floor(c.o/86400000)))),chg:+((p-pc)/pc*100).toFixed(2),open:c.open};
}
let SNAP=null;
function snapshot(held){
  const now=Date.now();
  if(!SNAP||now-SNAP.at>4000){
    const syms=[...Object.keys(T).filter(k=>T[k].kind==="EQ"),...derivedList(now)], C={}, o={instruments:{},prices:{},dayOpen:{},dayHigh:{},dayLow:{},dayVol:{},changePct:{}};
    for(const s of syms){ const q=quote(s,now,C); if(!q) continue; fill(o,s,q); }
    o.markets={}; for(const k in MN) o.markets[k]=isOpen(k,now);
    SNAP={at:now,o};
  }
  const o=SNAP.o, extra=held.filter(s=>!o.instruments[s]&&inst(s));
  if(!extra.length) return o;
  const r={...o,instruments:{...o.instruments},prices:{...o.prices},dayOpen:{...o.dayOpen},dayHigh:{...o.dayHigh},dayLow:{...o.dayLow},dayVol:{...o.dayVol},changePct:{...o.changePct}}, C={};
  for(const s of extra) fill(r,s,quote(s,now,C));
  return r;
}
function fill(o,s,q){
  const i=q.i; o.instruments[s]={name:i.name,sector:i.sector,grp:i.grp,mkt:i.mkt,ccy:i.ccy,fx:i.fx,lot:i.lot,open:q.open};
  o.prices[s]=q.p; o.dayOpen[s]=q.op; o.dayHigh[s]=q.hi; o.dayLow[s]=q.lo; o.dayVol[s]=q.vol; o.changePct[s]=q.chg;
}

/* ================= CANDLES ================= */
function aggC(arr,mins){
  if(mins<=1) return arr; const ms=mins*60000,out=[]; let cur=null;
  for(const c of arr){ const b=Math.floor(c.t/ms)*ms;
    if(!cur||cur.t!==b){ if(cur) out.push(cur); cur={t:b,o:c.o,h:c.h,l:c.l,c:c.c,v:c.v||0}; }
    else { cur.h=Math.max(cur.h,c.h); cur.l=Math.min(cur.l,c.l); cur.c=c.c; cur.v+=c.v||0; } }
  if(cur) out.push(cur); return out;
}
function minuteCandle(sym,t,hs,i,vb,vol){
  const o=price(sym,t),c=price(sym,t+59999); let h=Math.max(o,c),l=Math.min(o,c);
  for(let k=1;k<8;k++){ const q=price(sym,t+k*7500); if(q>h)h=q; if(q<l)l=q; }
  const mult=1+Math.min(4,Math.abs(Math.log(c/o))/(vol*0.03))*0.8;
  return {t,o,h,l,c,v:Math.max(1,Math.round(vb*ushape(i,t)*(0.4+rnd((hs+(t/60000|0))>>>0)*1.2)*mult))};
}
function sparkFor(sym){ const i=inst(sym), c=mctx(i.mkt,Date.now(),{}), a=[]; for(let k=0;k<30;k++) a.push(price(sym,c.te-86400000*(1-k/29))); return a; }
function candlesFor(sym,tf){
  const i=inst(sym), vb=vbase(sym), vol=(i.kind==="EQ"?i:T[i.und]).vol, now=Date.now(), c=mctx(i.mkt,now,{}), need=Math.min(9000,Math.max(380,tf*150)), mins=[], hs=hash32(sym);
  let t=Math.floor(c.te/60000)*60000, g=0;
  while(mins.length<need&&g++<70000){ if(isOpen(i.mkt,t)) mins.push(t); t-=60000; }
  mins.reverse();
  return aggC(mins.map(x=>minuteCandle(sym,x,hs,i,vb,vol)),tf).slice(-(tf===1?380:300));
}
function dailyFor(sym,days){
  const i=inst(sym), vb=vbase(sym), now=Date.now(), out=[], day0=Math.floor(now/86400000)*86400000, hs=hash32(sym);
  if(i.kind!=="EQ") days=Math.min(days,120);
  for(let k=days;k>=0;k--){
    const ds=day0-k*86400000, w=new Date(ds).getUTCDay(); let o,c;
    if(i.mkt==="CR"){ o=ds; c=ds+86399999; }
    else if(i.mkt==="GL"){ if(w===0||w===6) continue; o=ds; c=ds+86399999; }
    else { if(w===0||w===6) continue; const s=sess(i.mkt,ds); o=ds+s[0]*60000; c=ds+s[1]*60000-1; }
    if(o>now) continue; c=Math.min(c,now);
    const O=price(sym,o),C=price(sym,c); let h=Math.max(O,C),l=Math.min(O,C);
    for(let j=1;j<40;j++){ const q=price(sym,o+(c-o)*j/40); if(q>h)h=q; if(q<l)l=q; }
    out.push({t:o,o:O,h,l,c:C,v:Math.round(vb*(c-o+1)/60000*(i.mkt==="CR"||i.mkt==="GL"?1:1.2)*(0.65+0.7*rnd((hs+k)>>>0)))});
  }
  return out;
}

/* ================= WALLET (per-user Durable Object) ================= */
export class MarketState{
  constructor(state){this.state=state;this.mem=null}
  async get(){
    if(this.mem) return this.mem;
    let s=await this.state.storage.get("state");
    if(!s) s={cash:START_CASH,positions:{},orders:[]};
    else if(s.prices||s.candles||s.dayOpen){ // migrate old per-user simulation state
      const ks=[]; for(const k of Object.keys(s.prices||{})) ks.push("c:"+k,"d:"+k);
      try{ if(ks.length) await this.state.storage.delete(ks); }catch(e){}
      s={cash:s.cash,positions:s.positions||{},orders:s.orders||[]}; await this.state.storage.put("state",s);
    }
    return this.mem=s;
  }
  async put(s){this.mem=s;await this.state.storage.put("state",s);}
  async fetch(req){
    const s=await this.get(), u=new URL(req.url);
    if(u.pathname==="/api/state"&&req.method==="GET"){
      const snap=snapshot(Object.keys(s.positions));
      return json({ok:true,serverTime:new Date().toISOString(),marketOpen:snap.markets.IN,markets:snap.markets,cash:s.cash,positions:s.positions,orders:s.orders.slice(-100),...snap});
    }
    if(u.pathname==="/api/order"&&req.method==="POST"){
      let b; try{b=await req.json()}catch{return json({ok:false,error:"Invalid JSON"},400)}
      const sym=String(b.symbol||"").toUpperCase(), side=String(b.side||"").toUpperCase(), q=Number(b.qty), ins=inst(sym);
      if(!ins) return json({ok:false,error:"Unknown instrument"},400);
      if(!["BUY","SELL"].includes(side)||!Number.isInteger(q)||q<=0||q%ins.lot) return json({ok:false,error:"Quantity must be a positive multiple of the lot size ("+ins.lot+")."},400);
      const now=Date.now();
      if(!isOpen(ins.mkt,now)) return json({ok:false,error:MN[ins.mkt]+" is closed right now. "+HRS[ins.mkt]},400);
      if(ins.exp&&now>=ins.exp) return json({ok:false,error:"This contract has expired."},400);
      const p=price(sym,now), valN=p*q, valI=valN*ins.fx, fee=valI*FEE, pos=s.positions[sym]||{qty:0,avg:0};
      if(side==="BUY"){
        if(s.cash<valI+fee) return json({ok:false,error:"Insufficient virtual cash"},400);
        pos.avg=(pos.avg*pos.qty+valN)/(pos.qty+q); pos.qty+=q; s.cash-=valI+fee;
      } else {
        if(pos.qty<q) return json({ok:false,error:"Insufficient holdings (short selling not enabled)"},400);
        pos.qty-=q; s.cash+=valI-fee; if(!pos.qty) delete s.positions[sym];
      }
      if(pos.qty) s.positions[sym]=pos;
      const o={id:crypto.randomUUID(),symbol:sym,side,qty:q,price:p,ccy:ins.ccy,value:valI,brokerage:fee,time:new Date().toISOString(),status:"FILLED",virtual:true};
      s.orders.push(o); if(s.orders.length>300) s.orders.shift(); await this.put(s);
      return json({ok:true,order:o,cash:s.cash,positions:s.positions});
    }
    if(u.pathname==="/api/topup"&&req.method==="POST"){
      if(s.cash>=50000000) return json({ok:false,error:"Virtual wallet is already above ₹5 crore"},400);
      s.cash+=10000000; await this.put(s); return json({ok:true,cash:s.cash});
    }
    if(u.pathname==="/api/reset"&&req.method==="POST"){ await this.put({cash:START_CASH,positions:{},orders:[]}); return json({ok:true,reset:true}); }
    return json({ok:false,error:"Not found"},404);
  }
}

/* ================= NEWS (Google News RSS, sectioned) ================= */
const SECTIONS=[
 ["India","Sensex OR Nifty OR \"Indian stock market\" OR \"Indian shares\""],["US","\"Wall Street\" OR \"S&P 500\" OR Nasdaq OR \"Dow Jones\""],
 ["Europe","\"European stocks\" OR FTSE OR DAX OR STOXX"],["Asia","Nikkei OR \"Hang Seng\" OR \"Asian markets\" OR \"China stocks\""],
 ["Commodities","\"gold price\" OR \"crude oil\" OR Brent OR \"silver price\""],["Forex","rupee OR \"dollar index\" OR forex OR \"currency market\""],
 ["Crypto","bitcoin OR ethereum OR \"crypto market\""],["IPO","IPO OR \"stocks to watch\" OR \"buzzing stocks\" India"],["Alerts","\"breaking news\" stock market OR \"market alert\" OR SEBI OR \"circuit breaker\" OR \"stocks crash\" OR \"rate cut\""],
 ["Economy","RBI OR inflation OR \"Federal Reserve\" OR \"interest rate\" OR GDP"]];
const POS=/\b(rally|rallies|surge|surges|jump|jumps|gain|gains|rise|rises|soar|soars|record high|bullish|upbeat|rebound|climb|climbs|advance|advances|boost)\b/i;
const NEG=/\b(fall|falls|drop|drops|slump|slumps|plunge|plunges|crash|tumble|tumbles|sink|sinks|decline|declines|slide|slides|bearish|selloff|sell-off|losses|weak|fear|fears)\b/i;
const dec=x=>x.replace(/<!\[CDATA\[|\]\]>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/<[^>]+>/g,"").trim();
async function feedItems(cat,q,n){
  const url="https://news.google.com/rss/search?q="+encodeURIComponent(q+" when:2d")+"&hl=en-IN&gl=IN&ceid=IN:en";
  const x=await (await fetch(url,{headers:{"user-agent":"Mozilla/5.0"},cf:{cacheTtl:180,cacheEverything:true}})).text(), items=[];
  for(const m of x.matchAll(/<item>([\s\S]*?)<\/item>/g)){ const b=m[1];
    const g=t=>{const r=b.match(new RegExp("<"+t+"[^>]*>([\\s\\S]*?)</"+t+">"));return r?dec(r[1]):"";};
    let title=g("title"), source=g("source"); if(source&&title.endsWith(" - "+source)) title=title.slice(0,-(source.length+3));
    items.push({id:cat+":"+title.slice(0,80),cat,title,link:g("link"),source,ts:Date.parse(g("pubDate"))||Date.now(),sent:(POS.test(title)?1:0)-(NEG.test(title)?1:0)}); }
  return items.sort((a,b)=>b.ts-a.ts).slice(0,n);
}
async function loadNews(env){
  const cached=await env.USERS_KV.get("news:cache3",{type:"json"});
  if(cached&&Date.now()-cached.at<240000) return cached.data;
  const all=[];
  await Promise.all(SECTIONS.map(async([c,q])=>{ try{ all.push(...await feedItems(c,q,10)); }catch(e){} }));
  if(!all.length) return cached?cached.data:{items:[],outlook:null};
  all.sort((a,b)=>b.ts-a.ts);
  let up=0,down=0; all.forEach(i=>{ if(["India","US","Europe","Asia"].includes(i.cat)){ if(i.sent>0)up++; else if(i.sent<0)down++; } });
  const label=up>down*1.3?"Bullish":down>up*1.3?"Bearish":"Mixed";
  const data={items:all,outlook:{label,up,down}};
  await env.USERS_KV.put("news:cache3",JSON.stringify({at:Date.now(),data}),{expirationTtl:900});
  return data;
}

/* ================= ROUTER ================= */
export default{
  async fetch(req,env){
    if(req.method==="OPTIONS") return new Response(null,{headers:CORS});
    const url=new URL(req.url), P=url.pathname;
    if(P==="/api/auth/signup"&&req.method==="POST"){
      let b; try{b=await req.json()}catch{return json({ok:false,error:"Invalid JSON"},400)}
      const username=String(b.username||"").trim().toLowerCase(), password=String(b.password||"");
      if(!/^[a-z0-9_]{3,20}$/.test(username)) return json({ok:false,error:"Username must be 3-20 chars: letters, numbers, underscore only"},400);
      if(password.length<6) return json({ok:false,error:"Password must be at least 6 characters"},400);
      if(await env.USERS_KV.get("user:"+username)) return json({ok:false,error:"Username already taken"},400);
      const salt=crypto.randomUUID(), hash=await hashPassword(password,salt);
      await env.USERS_KV.put("user:"+username,JSON.stringify({hash,salt,createdAt:Date.now()}));
      const token=crypto.randomUUID(); await env.USERS_KV.put("session:"+token,username,{expirationTtl:31536000});
      return json({ok:true,token,username});
    }
    if(P==="/api/auth/login"&&req.method==="POST"){
      let b; try{b=await req.json()}catch{return json({ok:false,error:"Invalid JSON"},400)}
      const username=String(b.username||"").trim().toLowerCase(), password=String(b.password||"");
      const raw=await env.USERS_KV.get("user:"+username); if(!raw) return json({ok:false,error:"Invalid username or password"},400);
      const rec=JSON.parse(raw); if(await hashPassword(password,rec.salt)!==rec.hash) return json({ok:false,error:"Invalid username or password"},400);
      const token=crypto.randomUUID(); await env.USERS_KV.put("session:"+token,username,{expirationTtl:31536000});
      return json({ok:true,token,username});
    }
    if(P==="/api/auth/me"&&req.method==="GET"){ const u=await resolveUser(req,env); return u?json({ok:true,username:u}):json({ok:false,error:"Not logged in"},401); }
    if(P==="/api/news"&&req.method==="GET"){
      const q=(url.searchParams.get("q")||"").trim().slice(0,80);
      if(q){ try{ return json({ok:true,query:q,items:await feedItems("Search",q,25)}); }catch(e){ return json({ok:true,query:q,items:[]}); } }
      return json({ok:true,...await loadNews(env)});
    }
    if(P.startsWith("/api/")){
      const username=await resolveUser(req,env); if(!username) return json({ok:false,error:"Not logged in"},401);
      if(P==="/api/candles"||P==="/api/daily"){
        const sym=String(url.searchParams.get("symbol")||"").toUpperCase(); if(!inst(sym)) return json({ok:false,error:"Unknown instrument"},400);
        if(P==="/api/candles"){ const tf=Math.max(1,parseInt(url.searchParams.get("tf"))||1); return json({ok:true,symbol:sym,tf,candles:candlesFor(sym,tf)}); }
        const days=Math.min(2000,parseInt(url.searchParams.get("days"))||365), y=dailyFor(sym,365);
        return json({ok:true,symbol:sym,daily:days>365?dailyFor(sym,days):y.slice(-days),hi52:Math.max(...y.map(c=>c.h)),lo52:Math.min(...y.map(c=>c.l))});
      }
      if(P==="/api/spark"){ const out={}; for(const x of String(url.searchParams.get("symbols")||"").toUpperCase().split(",").slice(0,16)){ if(inst(x)) out[x]=sparkFor(x); } return json({ok:true,spark:out}); }
      if(P==="/api/prefs"){
        if(req.method==="GET"){ const r=await env.USERS_KV.get("prefs:"+username,{type:"json"}); return json({ok:true,prefs:r||{}}); }
        let b; try{b=await req.json()}catch{b={}}
        const prefs={watch:Array.isArray(b.watch)?b.watch.slice(0,100).map(String):[],fs:Math.min(1.3,Math.max(.85,Number(b.fs)||1))};
        await env.USERS_KV.put("prefs:"+username,JSON.stringify(prefs)); return json({ok:true});
      }
      return env.MARKET_STATE.get(env.MARKET_STATE.idFromName("player-"+username)).fetch(req);
    }
    return new Response("MarketIQ API server is running.",{headers:CORS});
  }
}
async function hashPassword(password,salt){
  const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(salt+":"+password));
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function resolveUser(req,env){
  const a=req.headers.get("Authorization")||""; const token=a.startsWith("Bearer ")?a.slice(7):null;
  return token?await env.USERS_KV.get("session:"+token):null;
}
