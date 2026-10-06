// MarketIQ backend v3 — shared world-market simulation (same prices for every user), per-user wallet.
const START_CASH=10000000, FEE=0.0005;
const json=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{"content-type":"application/json"}});
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
let DSET=null; function derivedSet(now){ if(!DSET||now-DSET.at>60000) DSET={at:now,set:new Set(derivedList(now))}; return DSET.set; }
function inst(sym){
  if(T[sym]) return T[sym];
  if(DC.size>400) DC.clear();
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
  async alarm(){ await this.state.storage.deleteAll(); }
  async internal(req,u){
    const P=u.pathname, now=Date.now();
    if(P==="/internal/rl"){ // atomic sliding-window counter
      const win=Math.min(86400,+u.searchParams.get("win")||60)*1000, lim=+u.searchParams.get("limit")||10;
      let w=await this.state.storage.get("w")||{s:now,n:0}; if(now-w.s>win) w={s:now,n:0}; w.n++;
      await this.state.storage.put("w",w); if(w.n===1) await this.state.storage.setAlarm(now+win+60000);
      return json({ok:w.n<=lim,retry:Math.max(1,Math.ceil((w.s+win-now)/1000))});
    }
    if(P==="/internal/claim"){ // atomic "first come" claim of a username / phone number
      const cur=await this.state.storage.get("o"), v=u.searchParams.get("v")||"";
      if(req.method==="POST"){ if(cur&&cur!==v) return json({ok:false,owner:cur}); await this.state.storage.put("o",v); return json({ok:true}); }
      if(req.method==="DELETE"){ if(cur===v) await this.state.storage.deleteAll(); return json({ok:true}); }
      return json({ok:true,owner:cur||null});
    }
    if(P==="/internal/wipe"&&req.method==="POST"){ this.mem=null; await this.state.storage.deleteAll(); return json({ok:true}); }
    return json({ok:false,error:"Not found"},404);
  }
  async fetch(req){
    const u=new URL(req.url); if(u.pathname.startsWith("/internal/")) return this.internal(req,u);
    const s=await this.get();
    if(u.pathname==="/api/state"&&req.method==="GET"){
      const snap=snapshot(Object.keys(s.positions));
      return json({ok:true,serverTime:new Date().toISOString(),marketOpen:snap.markets.IN,markets:snap.markets,cash:s.cash,positions:s.positions,orders:s.orders.slice(-100),...snap});
    }
    if(u.pathname==="/api/order"&&req.method==="POST"){
      let b; try{b=await req.json()}catch{return json({ok:false,error:"Invalid JSON"},400)}
      const sym=String(b.symbol||"").toUpperCase().slice(0,60), side=String(b.side||"").toUpperCase(), q=Number(b.qty), ins=/^[A-Z0-9_.\-]{1,60}$/.test(sym)?inst(sym):null, cid=String(b.cid||"");
      if(!/^[A-Za-z0-9-]{8,64}$/.test(cid)) return json({ok:false,error:"Missing order id"},400);
      const dup=s.orders.find(o=>o.cid===cid); // replay / double-tap protection: same id returns the original fill, never a second one
      if(dup) return json({ok:true,order:dup,cash:s.cash,positions:s.positions,duplicate:true});
      if(!ins) return json({ok:false,error:"Unknown instrument"},400);
      if(!["BUY","SELL"].includes(side)||!Number.isSafeInteger(q)||q<=0||q>10000000||q%ins.lot) return json({ok:false,error:"Quantity must be a positive multiple of the lot size ("+ins.lot+")."},400);
      const now=Date.now(); s.rt=(s.rt||[]).filter(t=>now-t<60000);
      if(s.rt.length>=30) return json({ok:false,error:"Too many orders — slow down for a minute."},429);
      s.rt.push(now);
      if(!isOpen(ins.mkt,now)) return json({ok:false,error:MN[ins.mkt]+" is closed right now. "+HRS[ins.mkt]},400);
      if(ins.exp&&now>=ins.exp) return json({ok:false,error:"This contract has expired."},400);
      if(side==="BUY"&&ins.kind!=="EQ"&&!derivedSet(now).has(sym)) return json({ok:false,error:"This contract is not currently listed."},400);
      if(!s.positions[sym]&&Object.keys(s.positions).length>=60) return json({ok:false,error:"You can hold up to 60 different instruments in this game."},400);
      const p=price(sym,now), valN=p*q, valI=valN*ins.fx, fee=valI*FEE, pos=s.positions[sym]||{qty:0,avg:0};
      if(!Number.isFinite(valI)||valI<=0) return json({ok:false,error:"Price unavailable"},400);
      if(valI>50000000) return json({ok:false,error:"Order value is above the ₹5 crore per-order limit."},400);
      if(side==="BUY"){
        if(s.cash<valI+fee) return json({ok:false,error:"Insufficient virtual cash"},400);
        pos.avg=(pos.avg*pos.qty+valN)/(pos.qty+q); pos.qty+=q; s.cash-=valI+fee;
      } else {
        if(pos.qty<q) return json({ok:false,error:"Insufficient holdings (short selling not enabled)"},400);
        pos.qty-=q; s.cash+=valI-fee; if(!pos.qty) delete s.positions[sym];
      }
      if(pos.qty) s.positions[sym]=pos;
      const o={id:crypto.randomUUID(),cid,symbol:sym,side,qty:q,price:p,ccy:ins.ccy,value:valI,brokerage:fee,time:new Date().toISOString(),status:"FILLED",virtual:true};
      s.orders.push(o); if(s.orders.length>300) s.orders.shift(); await this.put(s);
      return json({ok:true,order:o,cash:s.cash,positions:s.positions});
    }
    if(u.pathname==="/api/topup"&&req.method==="POST"){
      if(s.cash>=50000000) return json({ok:false,error:"Virtual wallet is already above ₹5 crore"},400);
      if(s.lastTopup&&Date.now()-s.lastTopup<86400000) return json({ok:false,error:"Virtual cash can be added once every 24 hours."},429);
      s.lastTopup=Date.now(); s.cash+=10000000; await this.put(s); return json({ok:true,cash:s.cash});
    }
    if(u.pathname==="/api/reset"&&req.method==="POST"){ await this.put({cash:START_CASH,positions:{},orders:[]}); return json({ok:true,reset:true}); }
    return json({ok:false,error:"Not found"},404);
  }
}

/* ================= NEWS (publisher RSS with summaries + images, plus Google News) ================= */
const G=q=>"https://news.google.com/rss/search?q="+encodeURIComponent(q+" when:2d")+"&hl=en-IN&gl=IN&ceid=IN:en";
const SECTIONS=[
 ["India",G("Sensex OR Nifty OR \"Indian stock market\"")],["India","https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms"],["India","https://www.livemint.com/rss/markets"],
 ["India","https://www.moneycontrol.com/rss/marketreports.xml"],["IPO",G("IPO OR \"stocks to watch\" OR \"buzzing stocks\" India")],["Economy",G("RBI OR inflation OR \"Federal Reserve\" OR \"interest rate\" OR GDP")],
 ["US",G("\"Wall Street\" OR \"S&P 500\" OR Nasdaq OR \"Dow Jones\"")],["US","https://www.cnbc.com/id/10000664/device/rss/rss.html"],["US","https://feeds.content.dowjones.io/public/rss/mw_topstories"],
 ["Europe",G("\"European stocks\" OR FTSE OR DAX OR STOXX")],["Asia",G("Nikkei OR \"Hang Seng\" OR \"Asian markets\" OR \"China stocks\"")],["Europe","https://feeds.bbci.co.uk/news/business/rss.xml"],
 ["Commodities",G("\"gold price\" OR \"crude oil\" OR Brent OR \"silver price\"")],["Forex",G("rupee OR \"dollar index\" OR forex OR \"currency market\"")],["Crypto",G("bitcoin OR ethereum OR \"crypto market\"")],
 ["Alerts",G("\"breaking news\" stock market OR \"market alert\" OR SEBI OR \"circuit breaker\" OR \"stocks crash\" OR \"rate cut\"")]];
const POS=/\b(rally|rallies|surge|surges|jump|jumps|gain|gains|rise|rises|soar|soars|record high|bullish|upbeat|rebound|climb|climbs|advance|advances|boost)\b/i;
const NEG=/\b(fall|falls|drop|drops|slump|slumps|plunge|plunges|crash|tumble|tumbles|sink|sinks|decline|declines|slide|slides|bearish|selloff|sell-off|losses|weak|fear|fears)\b/i;
const dec=x=>x.replace(/<!\[CDATA\[|\]\]>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#0?39;|&apos;/g,"'").replace(/&nbsp;/g," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const safeUrl=u=>{ try{ const x=new URL(u); return x.protocol==="https:"?x.href:""; }catch{ return ""; } }; // https only: blocks javascript:/data: links
async function feedItems(cat,url,n){
  const r=await fetch(url,{headers:{"user-agent":"Mozilla/5.0 (compatible; BazarBot/1.0)"},cf:{cacheTtl:180,cacheEverything:true}}); if(!r.ok) return [];
  const x=(await r.text()).slice(0,600000), items=[], isG=url.includes("news.google.com");
  for(const m of x.matchAll(/<item[\s>]([\s\S]*?)<\/item>/g)){ const b=m[1];
    const g=t=>{const q=b.match(new RegExp("<"+t+"[^>]*>([\\s\\S]*?)</"+t+">","i"));return q?q[1]:"";};
    let title=dec(g("title")), source=dec(g("source"))||(()=>{try{return new URL(url).hostname.replace(/^www\.|^feeds\./,"")}catch{return""}})(); if(!title) continue;
    if(source&&title.endsWith(" - "+source)) title=title.slice(0,-(source.length+3));
    let desc=isG?"":dec(g("description")); if(desc.toLowerCase().startsWith(title.toLowerCase().slice(0,40))) desc=""; if(desc.length>190) desc=desc.slice(0,187).replace(/\s+\S*$/,"")+"…";
    const im=b.match(/<media:(?:content|thumbnail)[^>]*url=["']([^"']+)/i)||b.match(/<enclosure[^>]*url=["']([^"']+)[^>]*type=["']image/i)||b.match(/<enclosure[^>]*type=["']image[^>]*url=["']([^"']+)/i)||b.match(/<img[^>]*src=["']([^"']+)/i);
    const link=safeUrl(dec(g("link"))||(b.match(/<link[^>]*href=["']([^"']+)/)||[])[1]||""); if(!link) continue;
    items.push({id:cat+":"+title.slice(0,80),cat,title,desc,img:im?safeUrl(im[1].replace(/&amp;/g,"&")):"",link,source,ts:Date.parse(g("pubDate"))||Date.now(),sent:(POS.test(title)?1:0)-(NEG.test(title)?1:0)}); }
  return items.sort((a,b)=>b.ts-a.ts).slice(0,n);
}
async function loadNews(env){
  const cached=await env.USERS_KV.get("news:cache4",{type:"json"});
  if(cached&&Date.now()-cached.at<240000) return cached.data;
  const all=[], seen=new Set();
  await Promise.all(SECTIONS.map(async([c,u])=>{ try{ all.push(...await feedItems(c,u,8)); }catch(e){} }));
  if(!all.length) return cached?cached.data:{items:[],outlook:null};
  all.sort((a,b)=>(b.desc?1:0)+(b.img?1:0)-((a.desc?1:0)+(a.img?1:0))*0 || b.ts-a.ts);
  const items=all.filter(i=>{ const k=i.title.toLowerCase().slice(0,60); if(seen.has(k)) return false; seen.add(k); return true; }).sort((a,b)=>b.ts-a.ts).slice(0,160);
  let up=0,down=0; items.forEach(i=>{ if(["India","US","Europe","Asia"].includes(i.cat)){ if(i.sent>0)up++; else if(i.sent<0)down++; } });
  const label=up>down*1.3?"Bullish":down>up*1.3?"Bearish":"Mixed", data={items,outlook:{label,up,down}};
  await env.USERS_KV.put("news:cache4",JSON.stringify({at:Date.now(),data}),{expirationTtl:900});
  return data;
}

/* ================= SECURITY HELPERS ================= */
const DEFAULT_ORIGINS=["https://bazar-v.rudramganatra-2ee.workers.dev","https://bazar-v1.rudramganatra-2ee.workers.dev","https://bazar.rudramganatra-2ee.workers.dev","https://market-iq-live2.rudramganatra-2ee.workers.dev","https://firstsuccess.rudramganatra-2ee.workers.dev"];
const SEC={"X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","X-Frame-Options":"DENY","Cache-Control":"no-store","Strict-Transport-Security":"max-age=31536000; includeSubDomains","Cross-Origin-Resource-Policy":"cross-origin","Permissions-Policy":"camera=(),microphone=(),geolocation=()"};
const enc=new TextEncoder(), b64=u=>btoa(String.fromCharCode(...u)), unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const b64u=u=>b64(u).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const rand=n=>{const a=new Uint8Array(n);crypto.getRandomValues(a);return a;};
async function sha256(s){return [...new Uint8Array(await crypto.subtle.digest("SHA-256",enc.encode(s)))].map(b=>b.toString(16).padStart(2,"0")).join("");}
const ITER=100000; // Cloudflare Workers' maximum for PBKDF2
async function pbkdf2(pw,salt,iter){const k=await crypto.subtle.importKey("raw",enc.encode(pw),"PBKDF2",false,["deriveBits"]);return new Uint8Array(await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations:iter},k,256));}
function ctEq(a,b){a=String(a);b=String(b);let d=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)d|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return d===0;}
async function makePw(pw){const salt=rand(16);return {algo:"pbkdf2",iter:ITER,salt:b64(salt),hash:b64(await pbkdf2(pw,salt,ITER))};}
async function checkPw(pw,rec){
  if(rec.algo==="pbkdf2") return ctEq(b64(await pbkdf2(pw,unb64(rec.salt),rec.iter||ITER)),rec.hash);
  return ctEq(await sha256(rec.salt+":"+pw),rec.hash); // legacy accounts, upgraded on next login
}
const COMMON=new Set(["password","password1","12345678","123456789","qwerty123","iloveyou","11111111","abc12345","admin123","welcome1","letmein1","password123","qwertyuiop"]);
function pwProblem(pw,user){ if(pw.length<8) return "Password must be at least 8 characters"; if(pw.length>128) return "Password is too long"; if(!/[a-zA-Z]/.test(pw)||!/\d/.test(pw)) return "Use letters and at least one number"; if(COMMON.has(pw.toLowerCase())||pw.toLowerCase().includes(user)) return "That password is too easy to guess"; return ""; }
async function readJson(req,max=8192){ const cl=+req.headers.get("content-length")||0; if(cl>max) return null; try{ const t=await req.text(); if(t.length>max) return null; const j=JSON.parse(t); return j&&typeof j==="object"&&!Array.isArray(j)?j:null; }catch{ return null; } }
const stub=(env,name)=>env.MARKET_STATE.get(env.MARKET_STATE.idFromName(name));
async function rl(env,key,limit,win){ try{ const r=await stub(env,"rl:"+key).fetch("https://do/internal/rl?limit="+limit+"&win="+win); return await r.json(); }catch{ return {ok:true}; } }
const tooMany=r=>new Response(JSON.stringify({ok:false,error:"Too many attempts. Try again in "+Math.ceil((r.retry||60)/60)+" min."}),{status:429,headers:{"content-type":"application/json","Retry-After":String(r.retry||60)}});
const claim=(env,k,v,m)=>stub(env,"claim:"+k).fetch("https://do/internal/claim?v="+encodeURIComponent(v),{method:m||"POST"}).then(r=>r.json());
function normPhone(p){ let d=String(p||"").replace(/[\s\-()+]/g,""); if(!/^\d+$/.test(d)) return ""; if(d.length===12&&d.startsWith("91")) d=d.slice(2); if(d.length===11&&d.startsWith("0")) d=d.slice(1); return /^[6-9]\d{9}$/.test(d)?d:""; }
const phoneHash=(env,d)=>sha256((env.PHONE_PEPPER||"bazar-pepper")+":"+d);
const mask=d=>"+91 ••••••"+d.slice(-4);
async function newSession(env,user,req){
  const tok=b64u(rand(32)), h=await sha256(tok);
  await env.USERS_KV.put("s:"+h,JSON.stringify({u:user,c:Date.now()}),{expirationTtl:2592000});
  await env.USERS_KV.put("su:"+user+":"+h,"1",{expirationTtl:2592000});
  return tok;
}
async function resolveUser(req,env){
  const a=req.headers.get("Authorization")||"", t=a.startsWith("Bearer ")?a.slice(7).trim():""; if(t.length<30||t.length>80) return null;
  const h=await sha256(t), raw=await env.USERS_KV.get("s:"+h); if(!raw) return null;
  try{ const s=JSON.parse(raw); if(Date.now()-s.c>86400000){ s.c=Date.now(); await env.USERS_KV.put("s:"+h,JSON.stringify(s),{expirationTtl:2592000}); await env.USERS_KV.put("su:"+s.u+":"+h,"1",{expirationTtl:2592000}); } return {u:s.u,h}; }catch{ return null; }
}
async function revokeAll(env,user,except){ const l=await env.USERS_KV.list({prefix:"su:"+user+":"}); for(const k of l.keys){ const h=k.name.split(":")[2]; if(h===except) continue; await env.USERS_KV.delete("s:"+h); await env.USERS_KV.delete(k.name); } }
const pubUser=(u,rec)=>({username:u,display:rec.display||u,phone:rec.phoneMask||null,hasPhone:!!rec.phoneH,hasPw:rec.hash!=="!",google:!!rec.gsub,created:rec.createdAt});

/* ================= BAZARAI (proxy + built-in demo brain) ================= */
const GLOSS={"stop loss":"A stop-loss is a pre-set exit price that limits how much you can lose on a trade. In the chart tool, the red zone is your risk and the green zone is your target.","target":"A target is the price where you plan to book profit. Compare it with your stop-loss to get the risk:reward ratio.","risk reward":"Risk:reward compares potential profit to potential loss. 1:2 means you risk ₹1 to try to make ₹2. Many learners look for at least 1:2.","volume":"Volume is how many units traded in a period. Big price moves on high volume are usually considered stronger than moves on low volume.","sma":"SMA (simple moving average) is the average closing price over N candles. It smooths noise so you can see the trend.","ema":"EMA is like SMA but gives more weight to recent prices, so it reacts faster.","bollinger":"Bollinger Bands draw a moving average with bands 2 standard deviations away. Price near the outer bands means it is stretched.","vwap":"VWAP is the volume-weighted average price for the day — a benchmark for whether you bought above or below the day's average.","rsi":"RSI measures momentum from 0 to 100. Above 70 is often called overbought, below 30 oversold — but strong trends can stay there.","option":"An option gives the right (not the obligation) to buy (call) or sell (put) at a strike price before expiry. The price you pay is the premium.","future":"A futures contract is an agreement to buy or sell at a set price on a future date. Each contract has a fixed lot size.","nifty":"NIFTY 50 tracks 50 large companies on the NSE. It is a quick read on how the Indian market is doing.","sensex":"Sensex tracks 30 large companies on the BSE.","brokerage":"Brokerage is the fee charged when you trade. In this game it is 0.05% of the order value, applied on both buy and sell.","bull":"A bull market means prices are broadly rising; a bear market means they are falling.","etf":"An ETF is a basket of assets (like the NIFTY 50) that trades like a single stock.","mutual fund":"A mutual fund pools money from many investors and a manager invests it in stocks or bonds.","ipo":"An IPO is when a private company first sells shares to the public."};
function localAI(msg,snap,w){
  const q=msg.toLowerCase(), out=[]; let emo="happy";
  for(const k in GLOSS){ if(q.includes(k)){ out.push(GLOSS[k]); break; } }
  const ins=snap.instruments; let hit=null;
  for(const s in ins){ if(q.includes(s.toLowerCase())||(ins[s].name.length>4&&q.includes(ins[s].name.toLowerCase()))){ hit=s; break; } }
  if(hit){ const c=snap.changePct[hit]||0; out.push(hit+" ("+ins[hit].name+") is at "+(ins[hit].ccy||"INR")+" "+snap.prices[hit]+", "+(c>=0?"up ":"down ")+Math.abs(c)+"% today. "+(ins[hit].open?"Its market is open.":"Its market is closed right now.")+" Remember: all prices here are simulated for learning."); emo=c>=0?"happy":"worried"; }
  if(/top|mover|gainer|loser|trend/.test(q)){ const l=Object.keys(ins).filter(x=>["India","USA"].includes(ins[x].grp)).sort((a,b)=>Math.abs(snap.changePct[b])-Math.abs(snap.changePct[a])).slice(0,4); out.push("Biggest movers right now: "+l.map(x=>x+" "+(snap.changePct[x]>=0?"+":"")+snap.changePct[x]+"%").join(", ")+"."); }
  if(/portfolio|holding|my money|cash|p&l|profit|loss/.test(q)){ const n=Object.keys(w.positions).length; out.push("You have ₹"+Math.round(w.cash).toLocaleString("en-IN")+" virtual cash and "+n+" open position"+(n===1?"":"s")+". Open Portfolio from the menu for live P&L."); }
  if(/market|nifty|sensex|today|mood|outlook/.test(q)&&!hit){ const n=snap.changePct.NIFTY50, s=snap.changePct.SENSEX; out.push("NIFTY 50 is "+(n>=0?"up ":"down ")+Math.abs(n)+"% and Sensex "+(s>=0?"up ":"down ")+Math.abs(s)+"% today (simulated). Check the News tab for the headline mood."); emo=n>=0?"happy":"worried"; }
  if(/^(hi|hello|hey|namaste)/.test(q)) out.push("Hi! I'm BazarAI 🐂 — I explain markets, indicators and risk. Ask me anything, like “what is stop loss?” or “how is TCS doing?”.");
  if(/buy|sell|should i|tip|target price|will .* (go|rise|fall)/.test(q)){ out.push("I can't tell you what will happen — nobody can, and prices in this game are simulated. I can help you build a plan: entry, stop-loss, target, and position size."); emo="think"; }
  if(!out.length){ out.push("I'm in demo mode, so I know market basics (stop-loss, SMA/EMA, volume, options, futures, ETFs…), live prices in this game, and your cash. Try: “explain risk reward” or “how is RELIANCE?”."); emo="think"; }
  return {reply:out.join("\n\n"),emotion:emo,mode:"demo"};
}
async function askAI(env,user,msg,hist,snap,w){
  const url=env.AI_URL||"https://bazar-market-copilot.rudra-bazar.workers.dev";
  if(env.AI_KEY){ // only used once you add an AI backend + secret; the browser never sees the key
    try{ const r=await fetch(url+"/api/chat",{method:"POST",headers:{"content-type":"application/json","authorization":"Bearer "+env.AI_KEY},body:JSON.stringify({message:msg,history:hist,user:await sha256(user)}),signal:AbortSignal.timeout(15000)});
      if(r.ok&&(r.headers.get("content-type")||"").includes("json")){ const j=await r.json(); const t=String(j.reply||j.answer||j.message||"").slice(0,4000); if(t) return {reply:t,emotion:"happy",mode:"live"}; } }catch{}
  }
  return localAI(msg,snap,w);
}

/* ================= ROUTER ================= */
const J=(x,s=200)=>json(x,s);
async function handle(req,env,url){
  const P=url.pathname, M=req.method, ip=req.headers.get("CF-Connecting-IP")||"x";
  if(P==="/api/config"&&M==="GET") return J({ok:true,google:env.GOOGLE_CLIENT_ID||null});
  if(P==="/api/auth/signup"&&M==="POST"){
    const r0=await rl(env,"su:"+ip,6,3600); if(!r0.ok) return tooMany(r0);
    const b=await readJson(req); if(!b) return J({ok:false,error:"Invalid request"},400);
    const username=String(b.username||"").trim().toLowerCase(), password=String(b.password||""), display=String(b.display||"").trim().slice(0,30).replace(/[<>&"'`]/g,""), phone=normPhone(b.phone);
    if(!/^[a-z0-9_]{3,20}$/.test(username)) return J({ok:false,error:"Username must be 3-20 chars: letters, numbers, underscore only"},400);
    const pp=pwProblem(password,username); if(pp) return J({ok:false,error:pp},400);
    if(!phone) return J({ok:false,error:"Enter a valid 10-digit Indian mobile number"},400);
    if(await env.USERS_KV.get("user:"+username)) return J({ok:false,error:"Username already taken"},409);
    const ph=await phoneHash(env,phone), uid=b64u(rand(12));
    if(!(await claim(env,"ph:"+ph,uid)).ok) return J({ok:false,error:"This mobile number is already linked to another account."},409);
    if(!(await claim(env,"un:"+username,uid)).ok){ await claim(env,"ph:"+ph,uid,"DELETE"); return J({ok:false,error:"Username already taken"},409); }
    const rec={...await makePw(password),uid,display:display||username,phoneH:ph,phoneMask:mask(phone),createdAt:Date.now()};
    await env.USERS_KV.put("user:"+username,JSON.stringify(rec));
    return J({ok:true,token:await newSession(env,username,req),username});
  }
  if(P==="/api/auth/login"&&M==="POST"){
    const b=await readJson(req); if(!b) return J({ok:false,error:"Invalid request"},400);
    const username=String(b.username||"").trim().toLowerCase().slice(0,30), password=String(b.password||"").slice(0,200);
    const a=await rl(env,"li:"+ip+":"+username,8,600); if(!a.ok) return tooMany(a); const a2=await rl(env,"lip:"+ip,40,600); if(!a2.ok) return tooMany(a2);
    const raw=await env.USERS_KV.get("user:"+username), rec=raw?JSON.parse(raw):null;
    if(!rec){ await pbkdf2(password,rand(16),ITER); return J({ok:false,error:"Invalid username or password"},400); } // same cost for unknown users: no timing oracle
    if(!(await checkPw(password,rec))) return J({ok:false,error:"Invalid username or password"},400);
    if(rec.algo!=="pbkdf2"){ Object.assign(rec,await makePw(password)); await env.USERS_KV.put("user:"+username,JSON.stringify(rec)); }
    return J({ok:true,token:await newSession(env,username,req),username});
  }
  if(P==="/api/auth/google"&&M==="POST"){
    if(!env.GOOGLE_CLIENT_ID) return J({ok:false,error:"Google sign-in is not enabled"},404);
    const a=await rl(env,"gi:"+ip,20,600); if(!a.ok) return tooMany(a);
    const b=await readJson(req,6000); const cred=b&&String(b.credential||""); if(!cred||cred.length>4000) return J({ok:false,error:"Invalid request"},400);
    let t; try{ t=await (await fetch("https://oauth2.googleapis.com/tokeninfo?id_token="+encodeURIComponent(cred))).json(); }catch{ return J({ok:false,error:"Google check failed"},502); }
    if(t.aud!==env.GOOGLE_CLIENT_ID||!["accounts.google.com","https://accounts.google.com"].includes(t.iss)||String(t.email_verified)!=="true"||!t.sub||+t.exp*1000<Date.now()) return J({ok:false,error:"Google sign-in rejected"},401);
    let user=await env.USERS_KV.get("g:"+t.sub);
    if(!user){ const base=String(t.email||"user").split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g,"").slice(0,12)||"user", uid=b64u(rand(12)); let ok=false;
      for(let i=0;i<8&&!ok;i++){ user=base+Math.floor(1000+Math.random()*9000); ok=!(await env.USERS_KV.get("user:"+user))&&(await claim(env,"un:"+user,uid)).ok; }
      if(!ok) return J({ok:false,error:"Try again"},503);
      await env.USERS_KV.put("user:"+user,JSON.stringify({algo:"none",uid,salt:"",hash:"!",display:String(t.name||user).slice(0,30).replace(/[<>&"'`]/g,""),gsub:t.sub,createdAt:Date.now()})); await env.USERS_KV.put("g:"+t.sub,user); }
    return J({ok:true,token:await newSession(env,user,req),username:user});
  }
  if(P==="/api/admin/support"||P==="/api/admin/support/list"){ // team inbox: needs the ADMIN_KEY secret, otherwise looks like a 404
    const k=req.headers.get("X-Admin-Key")||""; if(!env.ADMIN_KEY||!ctEq(k,env.ADMIN_KEY)) return J({ok:false,error:"Not found"},404);
    if(P.endsWith("/list")){ const l=await env.USERS_KV.list({prefix:"sup:"}); return J({ok:true,threads:l.keys.map(x=>x.name.slice(4))}); }
    const u=String(url.searchParams.get("user")||"").toLowerCase(); if(!/^[a-z0-9_]{3,30}$/.test(u)) return J({ok:false,error:"Bad user"},400);
    const th=await env.USERS_KV.get("sup:"+u,{type:"json"})||[];
    if(M==="POST"){ const b=await readJson(req); const text=String(b&&b.text||"").trim().slice(0,800); if(!text) return J({ok:false,error:"Empty"},400); th.push({from:"team",text,ts:Date.now()}); await env.USERS_KV.put("sup:"+u,JSON.stringify(th.slice(-100))); }
    return J({ok:true,thread:th});
  }
  if(!P.startsWith("/api/")) return new Response("MarketIQ API server is running.",{headers:{"content-type":"text/plain"}});

  // ---- everything below needs a valid session (deny by default) ----
  const ses=await resolveUser(req,env); if(!ses) return J({ok:false,error:"Not logged in"},401);
  const user=ses.u, recRaw=await env.USERS_KV.get("user:"+user); if(!recRaw) return J({ok:false,error:"Not logged in"},401); const rec=JSON.parse(recRaw);
  if(P==="/api/auth/me"&&M==="GET") return J({ok:true,...pubUser(user,rec)});
  if(P==="/api/auth/logout"&&M==="POST"){ await env.USERS_KV.delete("s:"+ses.h); await env.USERS_KV.delete("su:"+user+":"+ses.h); return J({ok:true}); }
  if(P==="/api/auth/logout-all"&&M==="POST"){ await revokeAll(env,user,ses.h); return J({ok:true}); }
  if(P==="/api/account"&&M==="POST"){
    const b=await readJson(req); if(!b) return J({ok:false,error:"Invalid request"},400);
    if(b.display!==undefined) rec.display=String(b.display).trim().slice(0,30).replace(/[<>&"'`]/g,"")||user;
    if(b.phone!==undefined){ if(rec.phoneH) return J({ok:false,error:"Mobile number is locked to this account. Contact the Bazar team to change it."},400);
      const d=normPhone(b.phone); if(!d) return J({ok:false,error:"Enter a valid 10-digit Indian mobile number"},400); const ph=await phoneHash(env,d);
      if(!rec.uid) rec.uid=b64u(rand(12));
      if(!(await claim(env,"ph:"+ph,rec.uid)).ok) return J({ok:false,error:"This mobile number is already linked to another account."},409); rec.phoneH=ph; rec.phoneMask=mask(d); }
    if(b.newPassword!==undefined){ const a=await rl(env,"pw:"+user,5,900); if(!a.ok) return tooMany(a);
      if(rec.hash!=="!"&&!(await checkPw(String(b.oldPassword||""),rec))) return J({ok:false,error:"Current password is wrong"},400);
      const pp=pwProblem(String(b.newPassword),user); if(pp) return J({ok:false,error:pp},400); Object.assign(rec,await makePw(String(b.newPassword))); await revokeAll(env,user,ses.h); }
    await env.USERS_KV.put("user:"+user,JSON.stringify(rec)); return J({ok:true,...pubUser(user,rec)});
  }
  if(P==="/api/account/delete"&&M==="POST"){
    const a=await rl(env,"del:"+user,3,900); if(!a.ok) return tooMany(a);
    const b=await readJson(req); if(!b) return J({ok:false,error:"Invalid request"},400);
    const ok=rec.hash==="!"?String(b.confirm||"")===user:await checkPw(String(b.password||""),rec); if(!ok) return J({ok:false,error:rec.hash==="!"?"Type your username to confirm":"Wrong password"},400);
    await revokeAll(env,user,""); await env.USERS_KV.delete("user:"+user); await env.USERS_KV.delete("prefs:"+user); await env.USERS_KV.delete("sup:"+user);
    if(rec.uid){ if(rec.phoneH) await claim(env,"ph:"+rec.phoneH,rec.uid,"DELETE"); await claim(env,"un:"+user,rec.uid,"DELETE"); } if(rec.gsub) await env.USERS_KV.delete("g:"+rec.gsub);
    await stub(env,"player-"+user).fetch("https://do/internal/wipe",{method:"POST"}); return J({ok:true,deleted:true});
  }
  if(P==="/api/support"){
    let th=await env.USERS_KV.get("sup:"+user,{type:"json"})||[];
    if(M==="POST"){ const a=await rl(env,"sup:"+user,10,3600); if(!a.ok) return tooMany(a); const b=await readJson(req); const text=String(b&&b.text||"").trim().slice(0,600); if(!text) return J({ok:false,error:"Write a message first"},400);
      th.push({from:"user",text,ts:Date.now()}); if(th.filter(m=>m.from==="user").length===1) th.push({from:"team",text:"Thanks for reaching out! The Bazar team has your message and will reply here. Please never share your password with anyone — including us.",ts:Date.now()+1});
      th=th.slice(-100); await env.USERS_KV.put("sup:"+user,JSON.stringify(th)); }
    return J({ok:true,thread:th});
  }
  if(P==="/api/ai"&&M==="POST"){
    const a=await rl(env,"ai:"+user,20,300); if(!a.ok) return tooMany(a); const d=await rl(env,"aid:"+user,300,86400); if(!d.ok) return tooMany(d);
    const b=await readJson(req,6000); const msg=String(b&&b.message||"").trim().slice(0,500); if(!msg) return J({ok:false,error:"Ask something first"},400);
    const hist=(Array.isArray(b.history)?b.history:[]).slice(-6).map(h=>({role:h.role==="ai"?"assistant":"user",content:String(h.text||"").slice(0,500)}));
    const ws=await (await stub(env,"player-"+user).fetch("https://x/api/state")).json();
    return J({ok:true,...await askAI(env,user,msg,hist,ws,{cash:ws.cash,positions:ws.positions})});
  }
  if(P==="/api/news"&&M==="GET"){
    const q=(url.searchParams.get("q")||"").trim().slice(0,80);
    if(q){ const a=await rl(env,"ns:"+user,20,300); if(!a.ok) return tooMany(a); try{ return J({ok:true,query:q,items:await feedItems("Search",G(q),25)}); }catch{ return J({ok:true,query:q,items:[]}); } }
    return J({ok:true,...await loadNews(env)});
  }
  if(P==="/api/candles"||P==="/api/daily"||P==="/api/spark"){ const a=await rl(env,"dat:"+user,300,60); if(!a.ok) return tooMany(a); }
  if(P==="/api/candles"||P==="/api/daily"){
    const sym=String(url.searchParams.get("symbol")||"").toUpperCase().slice(0,60); if(!/^[A-Z0-9_.\-]+$/.test(sym)||!inst(sym)) return J({ok:false,error:"Unknown instrument"},400);
    if(P==="/api/candles"){ const tf=Math.min(1440,Math.max(1,parseInt(url.searchParams.get("tf"))||1)); return J({ok:true,symbol:sym,tf,candles:candlesFor(sym,tf)}); }
    const days=Math.min(2000,Math.max(1,parseInt(url.searchParams.get("days"))||365)), y=dailyFor(sym,365);
    return J({ok:true,symbol:sym,daily:days>365?dailyFor(sym,days):y.slice(-days),hi52:Math.max(...y.map(c=>c.h)),lo52:Math.min(...y.map(c=>c.l))});
  }
  if(P==="/api/spark"){ const out={}; for(const x of String(url.searchParams.get("symbols")||"").toUpperCase().split(",").slice(0,16)){ if(/^[A-Z0-9_.\-]{1,60}$/.test(x)&&inst(x)) out[x]=sparkFor(x); } return J({ok:true,spark:out}); }
  if(P==="/api/prefs"){
    if(M==="GET") return J({ok:true,prefs:await env.USERS_KV.get("prefs:"+user,{type:"json"})||{}});
    const b=await readJson(req,6000)||{}; const prefs={watch:(Array.isArray(b.watch)?b.watch:[]).map(String).filter(x=>/^[A-Z0-9_.\-]{1,60}$/.test(x)).slice(0,100),fs:Math.min(1.3,Math.max(.85,Number(b.fs)||1)),theme:["dark","light","system"].includes(b.theme)?b.theme:"dark",mascot:b.mascot===false?false:true};
    await env.USERS_KV.put("prefs:"+user,JSON.stringify(prefs)); return J({ok:true});
  }
  if(P==="/api/state"&&M==="GET"||(P==="/api/order"&&M==="POST")||(P==="/api/topup"&&M==="POST")||(P==="/api/reset"&&M==="POST")){
    if(P==="/api/order"){ if(!rec.phoneH) return J({ok:false,error:"Add your mobile number in Settings → Account to start trading."},403); const a=await rl(env,"ord:"+user,60,60); if(!a.ok) return tooMany(a); }
    const body=M==="POST"?await req.text():undefined; if(body&&body.length>4096) return J({ok:false,error:"Too large"},413);
    return stub(env,"player-"+user).fetch(new Request(url.origin+P+url.search,{method:M,body,headers:{"content-type":"application/json"}}));
  }
  return J({ok:false,error:"Not found"},404);
}
export default{
  async fetch(req,env){
    const o=req.headers.get("Origin")||"", allow=(env.ALLOWED_ORIGINS?env.ALLOWED_ORIGINS.split(",").map(x=>x.trim()):DEFAULT_ORIGINS);
    const cors={"Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization, X-Admin-Key","Access-Control-Max-Age":"600","Vary":"Origin"}; if(allow.includes(o)) cors["Access-Control-Allow-Origin"]=o;
    if(req.method==="OPTIONS") return new Response(null,{status:204,headers:{...cors,...SEC}});
    let res; try{ res=await handle(req,env,new URL(req.url)); }catch(e){ console.error("handler error",e&&e.stack||e); res=J({ok:false,error:"Server error"},500); } // details go to server logs only, never to the client
    const h=new Headers(res.headers); for(const k in cors) h.set(k,cors[k]); for(const k in SEC) h.set(k,SEC[k]); return new Response(res.body,{status:res.status,headers:h});
  }
}
