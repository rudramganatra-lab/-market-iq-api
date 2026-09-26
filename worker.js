<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>MarketIQ</title>
<script src="https://cdn.jsdelivr.net/npm/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js"></script>
<style>
:root{
  --bg:#0B0E14; --panel:#12161F; --panel2:#171C27; --line:#232936;
  --text:#E7EAF0; --sub:#7C8698; --gold:#F0B90B; --gold-dim:#8a6c1f;
  --up:#2FD675; --down:#F5455C;
  --radius:14px;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%;margin:0;background:var(--bg);color:var(--text);overscroll-behavior:none}
body{padding-top:env(safe-area-inset-top,0);padding-bottom:env(safe-area-inset-bottom,0);display:flex;flex-direction:column;height:100vh;overflow:hidden}
.num{font-variant-numeric:tabular-nums;font-family:ui-monospace,"SF Mono",Menlo,monospace}
::-webkit-scrollbar{display:none}

header{padding:14px 16px 10px;flex-shrink:0}
.h-row{display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;align-items:center;gap:8px;font-weight:700;font-size:17px;letter-spacing:.2px}
.brand .dot{width:8px;height:8px;border-radius:50%;background:var(--gold)}
.status{font-size:11px;color:var(--sub)}
.status.live{color:var(--up)}
.cash-pill{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:6px 12px;font-size:12.5px;color:var(--sub)}
.cash-pill b{color:var(--text)}

.stories{display:flex;gap:14px;overflow-x:auto;padding:14px 16px 4px;scroll-snap-type:x proximity}
.story{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:6px;width:64px;scroll-snap-align:start;cursor:pointer}
.ring{width:56px;height:56px;border-radius:50%;padding:2.5px;background:conic-gradient(var(--gold),var(--gold-dim));display:flex;align-items:center;justify-content:center}
.ring.down{background:conic-gradient(var(--down),#5a2530)}
.ring-inner{width:100%;height:100%;border-radius:50%;background:var(--panel2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700}
.story-label{font-size:10.5px;color:var(--sub);text-align:center;white-space:nowrap}
.story-pct{font-size:9.5px}
.up-txt{color:var(--up)} .down-txt{color:var(--down)}

.tabbar{display:flex;padding:0 16px;gap:4px;border-bottom:1px solid var(--line);flex-shrink:0}
.tab{flex:1;text-align:center;padding:12px 0;font-size:12.5px;color:var(--sub);position:relative;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px}
.tab.active{color:var(--gold)}
.tab.active::after{content:'';position:absolute;bottom:-1px;left:20%;right:20%;height:2px;background:var(--gold);border-radius:2px}

main{flex:1;overflow-y:auto;padding:8px 12px 90px}

/* search + categories */
.search-wrap{position:relative;margin:6px 2px 10px}
.search-input{width:100%;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:11px 14px 11px 36px;color:var(--text);font-size:14px}
.search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--sub);font-size:14px}
.cat-row{display:flex;gap:8px;overflow-x:auto;margin-bottom:10px;padding-bottom:2px}
.cat-chip{flex-shrink:0;background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:7px 14px;font-size:12px;color:var(--sub);cursor:pointer}
.cat-chip.active{background:var(--gold);color:#1a1400;border-color:var(--gold);font-weight:700}

.row{display:flex;align-items:center;justify-content:space-between;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:13px 14px;margin-bottom:8px;cursor:pointer}
.row-left{display:flex;align-items:center;gap:11px;min-width:0}
.star-btn{color:var(--sub);font-size:16px;flex-shrink:0;width:20px;text-align:center}
.star-btn.active{color:var(--gold)}
.sym-block{min-width:0}
.sym{font-weight:700;font-size:14.5px}
.sym-sub{font-size:11px;color:var(--sub);margin-top:1px}
.row-right{text-align:right}
.price{font-weight:700;font-size:14.5px}
.chg{font-size:11.5px;margin-top:2px}
.empty-hint{color:var(--sub);font-size:13px;text-align:center;padding:40px 20px}

.pos-row{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:13px 14px;margin-bottom:8px}
.pos-top{display:flex;justify-content:space-between;font-weight:700;font-size:14px}
.pos-meta{display:flex;justify-content:space-between;font-size:11.5px;color:var(--sub);margin-top:6px}
.pnl-pos{color:var(--up)} .pnl-neg{color:var(--down)}

.sheet-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:40;opacity:0;pointer-events:none;transition:opacity .2s}
.sheet-overlay.show{opacity:1;pointer-events:auto}
.detail{position:fixed;left:0;right:0;bottom:0;top:6vh;background:var(--bg);border-radius:20px 20px 0 0;z-index:41;transform:translateY(100%);transition:transform .28s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;box-shadow:0 -10px 40px rgba(0,0,0,.5)}
.detail.show{transform:translateY(0)}
.detail.fullscreen{top:0;border-radius:0}
.detail.fullscreen .dh-sector,.detail.fullscreen .stat-grid,.detail.fullscreen .indicators{display:none}
.detail.fullscreen .grabber{display:none}
.detail-head{padding:16px 18px 10px;border-bottom:1px solid var(--line);flex-shrink:0}
.grabber{width:36px;height:4px;background:var(--line);border-radius:3px;margin:0 auto 12px}
.dh-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.dh-name{font-size:17px;font-weight:700}
.dh-sector{font-size:11.5px;color:var(--sub)}
.head-btns{display:flex;gap:14px;align-items:center;flex-shrink:0}
.icon-btn{color:var(--sub);font-size:18px;cursor:pointer}
.dh-price{font-size:28px;font-weight:800;margin-top:8px}
.dh-chg{font-size:13px;margin-top:2px;display:inline-block;padding:2px 8px;border-radius:8px}
.dh-chg.up{color:var(--up);background:rgba(47,214,117,.12)}
.dh-chg.down{color:var(--down);background:rgba(245,69,92,.12)}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}
.stat{background:var(--panel);border-radius:10px;padding:8px 6px;text-align:center}
.stat-label{font-size:9.5px;color:var(--sub)}
.stat-val{font-size:12px;font-weight:700;margin-top:2px}

.chart-controls{display:flex;justify-content:space-between;align-items:center;padding:10px 18px 6px;gap:8px;flex-wrap:wrap}
.tf-group,.style-group{display:flex;gap:6px;background:var(--panel);border-radius:10px;padding:3px}
.tf-btn{font-size:11px;color:var(--sub);padding:5px 9px;border-radius:7px;cursor:pointer;white-space:nowrap}
.tf-btn.active{background:var(--gold);color:#1a1400;font-weight:700}
.ind-toggles{display:flex;gap:6px;overflow-x:auto;padding:0 18px 8px}
.ind-toggle{flex-shrink:0;font-size:11px;padding:6px 10px;border-radius:8px;background:var(--panel);border:1px solid var(--line);color:var(--sub);cursor:pointer}
.ind-toggle.on{color:var(--gold);border-color:var(--gold)}
.chart-area{flex:1;min-height:0;margin:0 6px;position:relative}
#chart{width:100%;height:100%}
.draw-toolbar{position:absolute;left:2px;top:8px;display:flex;flex-direction:column;gap:6px;z-index:5}
.draw-btn{width:32px;height:32px;border-radius:8px;background:var(--panel2);border:1px solid var(--line);color:var(--sub);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer}
.draw-btn.on{color:var(--gold);border-color:var(--gold)}
.detail-scroll{flex:1;overflow-y:auto;display:flex;flex-direction:column;min-height:0}
.indicators{display:flex;gap:8px;padding:12px 18px;overflow-x:auto;flex-shrink:0}
.ind-pill{flex-shrink:0;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:8px 12px;min-width:84px}
.ind-name{font-size:9.5px;color:var(--sub)}
.ind-val{font-size:13px;font-weight:700;margin-top:2px}

.action-bar{display:flex;gap:10px;padding:12px 18px calc(14px + env(safe-area-inset-bottom,0));border-top:1px solid var(--line);flex-shrink:0}
.act-btn{flex:1;padding:14px;border-radius:12px;text-align:center;font-weight:700;font-size:15px;cursor:pointer;border:none}
.buy-btn{background:var(--up);color:#04220f}
.sell-btn{background:var(--down);color:#2a0509}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:50;display:none;align-items:flex-end}
.modal-overlay.show{display:flex}
.modal{background:var(--panel2);width:100%;border-radius:20px 20px 0 0;padding:20px 20px calc(20px + env(safe-area-inset-bottom,0))}
.modal-title{font-size:16px;font-weight:700;margin-bottom:4px}
.modal-sub{font-size:12px;color:var(--sub);margin-bottom:16px}
.qty-row{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.qty-btn{width:42px;height:42px;border-radius:10px;background:var(--panel);border:1px solid var(--line);color:var(--text);font-size:20px;display:flex;align-items:center;justify-content:center}
.qty-input{flex:1;text-align:center;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px;color:var(--text);font-size:18px;font-weight:700}
.est-row{display:flex;justify-content:space-between;font-size:13px;color:var(--sub);margin-bottom:4px}
.confirm-btn{width:100%;padding:15px;border-radius:12px;border:none;font-weight:700;font-size:15px;margin-top:10px}
.toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--panel2);border:1px solid var(--line);padding:10px 18px;border-radius:12px;font-size:13px;z-index:60;opacity:0;transition:opacity .25s;pointer-events:none}
.toast.show{opacity:1}

/* landscape auto-fullscreen */
@media (orientation:landscape) and (max-height:500px){
  .detail .dh-sector,.detail .stat-grid,.detail .indicators,.detail .grabber{display:none}
  .detail-head{padding:8px 14px}
  .dh-price{font-size:20px;margin-top:2px}
  .action-bar{padding:8px 14px}
}
</style>
</head>
<body>

<header>
  <div class="h-row">
    <div class="brand"><span class="dot"></span>MarketIQ</div>
    <div id="clock" class="status num">--:--:--</div>
  </div>
  <div class="h-row" style="margin-top:8px">
    <div id="marketStatus" class="status">Connecting…</div>
    <div class="cash-pill">Cash <b id="cashVal" class="num">₹0</b></div>
  </div>
</header>

<div class="stories" id="stories"></div>

<div class="tabbar">
  <div class="tab active" data-tab="market">⌂<span>Market</span></div>
  <div class="tab" data-tab="watchlist">☆<span>Watchlist</span></div>
  <div class="tab" data-tab="portfolio">▣<span>Portfolio</span></div>
  <div class="tab" data-tab="orders">≡<span>Orders</span></div>
</div>

<main>
  <div id="view-market">
    <div class="search-wrap"><span class="search-icon">⌕</span><input class="search-input" id="searchInput" placeholder="Search stocks, index, commodity…"></div>
    <div class="cat-row" id="catRow"></div>
    <div id="marketList"></div>
  </div>
  <div id="view-watchlist" style="display:none"></div>
  <div id="view-portfolio" style="display:none"></div>
  <div id="view-orders" style="display:none"></div>
</main>

<div class="sheet-overlay" id="sheetOverlay"></div>
<div class="detail" id="detail">
  <div class="detail-head">
    <div class="grabber"></div>
    <div class="dh-top">
      <div>
        <div class="dh-name" id="dName">—</div>
        <div class="dh-sector" id="dSector">—</div>
      </div>
      <div class="head-btns">
        <div class="icon-btn" id="expandBtn" title="Fullscreen">⤢</div>
        <div class="icon-btn" id="closeDetail">✕</div>
      </div>
    </div>
    <div class="dh-price num" id="dPrice">₹0.00</div>
    <span class="dh-chg" id="dChg">0.00%</span>
    <div class="stat-grid">
      <div class="stat"><div class="stat-label">Open</div><div class="stat-val num" id="sOpen">-</div></div>
      <div class="stat"><div class="stat-label">High</div><div class="stat-val num" id="sHigh">-</div></div>
      <div class="stat"><div class="stat-label">Low</div><div class="stat-val num" id="sLow">-</div></div>
      <div class="stat"><div class="stat-label">Volume</div><div class="stat-val num" id="sVol">-</div></div>
    </div>
  </div>
  <div class="detail-scroll">
    <div class="chart-controls">
      <div class="tf-group" id="tfGroup">
        <div class="tf-btn active" data-tf="1">1m</div>
        <div class="tf-btn" data-tf="5">5m</div>
        <div class="tf-btn" data-tf="15">15m</div>
      </div>
      <div class="style-group" id="styleGroup">
        <div class="tf-btn active" data-style="candle">Candle</div>
        <div class="tf-btn" data-style="line">Line</div>
      </div>
    </div>
    <div class="ind-toggles" id="indToggles">
      <div class="ind-toggle" data-ind="sma5">SMA 5</div>
      <div class="ind-toggle" data-ind="sma20">SMA 20</div>
      <div class="ind-toggle on" data-ind="ema9">EMA 9</div>
      <div class="ind-toggle" data-ind="bb">Bollinger</div>
    </div>
    <div class="chart-area">
      <div class="draw-toolbar">
        <div class="draw-btn" id="drawLineBtn" title="Add price line">—</div>
        <div class="draw-btn" id="clearLinesBtn" title="Clear lines">✕</div>
      </div>
      <div id="chart"></div>
    </div>
    <div class="indicators" id="indicators"></div>
  </div>
  <div class="action-bar">
    <button class="act-btn buy-btn" id="buyBtn">BUY</button>
    <button class="act-btn sell-btn" id="sellBtn">SELL</button>
  </div>
</div>

<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <div class="modal-title" id="modalTitle">Buy RELIANCE</div>
    <div class="modal-sub" id="modalSub">LTP ₹0.00 · Lot size 1</div>
    <div class="qty-row">
      <div class="qty-btn" id="qtyMinus">−</div>
      <input class="qty-input num" id="qtyInput" value="1" inputmode="numeric">
      <div class="qty-btn" id="qtyPlus">+</div>
    </div>
    <div class="est-row"><span>Estimated value</span><span class="num" id="estVal">₹0</span></div>
    <div class="est-row"><span>Brokerage (0.05%)</span><span class="num" id="estFee">₹0</span></div>
    <button class="confirm-btn" id="confirmOrder">Confirm</button>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const API_BASE = "https://market-iq-api-v2.rudramganatra-2ee.workers.dev";
let UID = localStorage.getItem('miq_uid');
if(!UID){ UID = 'u'+Math.random().toString(36).slice(2,10); localStorage.setItem('miq_uid',UID); }
let watchlist = JSON.parse(localStorage.getItem('miq_watch')||'["RELIANCE","NIFTY50","TCS"]');

let state=null, activeSymbol=null, activeSide='BUY', chart=null, series=null, volSeries=null;
let tf='1', chartStyle='candle', searchText='', activeCat='All';
let indState={sma5:false,sma20:false,ema9:true,bb:false};
let overlaySeries={};
let priceLines=[];
let drawMode=false;

const $=s=>document.querySelector(s);
const fmt=n=>n==null?'-':Number(n).toLocaleString('en-IN',{maximumFractionDigits:2});
const fmtCr=n=>'₹'+fmt(n);
const api=(path)=>API_BASE+path+(path.includes('?')?'&':'?')+'uid='+UID;

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800); }

async function fetchState(){
  try{
    const r = await fetch(api('/api/state'));
    const d = await r.json();
    if(d.ok){ state=d; $('#marketStatus').textContent = d.marketOpen? 'Market open · live' : 'Market closed (simulated)'; $('#marketStatus').className='status'+(d.marketOpen?' live':''); $('#cashVal').textContent=fmtCr(d.cash); render(); }
  }catch(e){ $('#marketStatus').textContent='Offline — check API_BASE URL'; }
}

function pctClass(p){ return p>=0?'up-txt':'down-txt'; }

function renderStories(){
  const el=$('#stories'); el.innerHTML='';
  const symbols=['NIFTY50','BANKNIFTY','GOLD','SILVER','RELIANCE','TCS','HDFCBANK'];
  symbols.forEach(sym=>{
    if(!state.instruments[sym]) return;
    const chg=state.changePct[sym]||0;
    const d=document.createElement('div'); d.className='story';
    d.innerHTML=`<div class="ring ${chg<0?'down':''}"><div class="ring-inner">${sym.slice(0,3)}</div></div>
      <div class="story-label">${sym}</div><div class="story-pct ${pctClass(chg)}">${chg>=0?'+':''}${chg}%</div>`;
    d.onclick=()=>openDetail(sym);
    el.appendChild(d);
  });
}

function renderCategories(){
  const cats=['All',...new Set(Object.values(state.instruments).map(i=>i.sector))];
  $('#catRow').innerHTML = cats.map(c=>`<div class="cat-chip ${c===activeCat?'active':''}" data-cat="${c}">${c}</div>`).join('');
  document.querySelectorAll('.cat-chip').forEach(el=>el.onclick=()=>{ activeCat=el.dataset.cat; renderMarketList(); document.querySelectorAll('.cat-chip').forEach(x=>x.classList.remove('active')); el.classList.add('active'); });
}

function rowHtml(sym){
  const ins=state.instruments[sym], p=state.prices[sym], chg=state.changePct[sym]||0, starred=watchlist.includes(sym);
  return `<div class="row" data-sym="${sym}">
    <div class="row-left">
      <div class="star-btn ${starred?'active':''}" data-star="${sym}">${starred?'★':'☆'}</div>
      <div class="sym-block"><div class="sym">${sym}</div><div class="sym-sub">${ins.name}</div></div>
    </div>
    <div class="row-right"><div class="price num">₹${fmt(p)}</div><div class="chg num ${pctClass(chg)}">${chg>=0?'+':''}${chg}%</div></div>
  </div>`;
}

function renderMarketList(){
  const q=searchText.trim().toUpperCase();
  const list=Object.keys(state.instruments).filter(sym=>{
    const ins=state.instruments[sym];
    const matchCat = activeCat==='All' || ins.sector===activeCat;
    const matchSearch = !q || sym.includes(q) || ins.name.toUpperCase().includes(q);
    return matchCat && matchSearch;
  });
  $('#marketList').innerHTML = list.length? list.map(rowHtml).join('') : `<div class="empty-hint">No matches.</div>`;
  bindRowEvents();
}

function bindRowEvents(){
  document.querySelectorAll('[data-star]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); toggleWatch(el.dataset.star); });
  document.querySelectorAll('.row,.pos-row').forEach(el=>{ if(el.dataset.sym) el.onclick=()=>openDetail(el.dataset.sym); });
}

function render(){
  renderStories();
  renderCategories();
  renderMarketList();
  const wl = watchlist.filter(s=>state.instruments[s]);
  $('#view-watchlist').innerHTML = wl.length? wl.map(rowHtml).join('') : `<div class="empty-hint">Tap the star on any stock to add it here.</div>`;

  const posEntries = Object.entries(state.positions);
  $('#view-portfolio').innerHTML = posEntries.length? posEntries.map(([sym,pos])=>{
    const ltp=state.prices[sym], pnl=(ltp-pos.avg)*pos.qty, pnlPct=((ltp-pos.avg)/pos.avg*100).toFixed(2);
    return `<div class="pos-row" data-sym="${sym}">
      <div class="pos-top"><span>${sym}</span><span class="num">₹${fmt(ltp*pos.qty)}</span></div>
      <div class="pos-meta"><span>${pos.qty} @ ₹${fmt(pos.avg)}</span><span class="${pnl>=0?'pnl-pos':'pnl-neg'} num">${pnl>=0?'+':''}₹${fmt(pnl)} (${pnlPct}%)</span></div>
    </div>`;
  }).join('') : `<div class="empty-hint">No holdings yet. Buy something from Market.</div>`;

  const orders=[...state.orders].reverse();
  $('#view-orders').innerHTML = orders.length? orders.map(o=>`
    <div class="pos-row">
      <div class="pos-top"><span>${o.symbol} · ${o.side}</span><span class="num">₹${fmt(o.value)}</span></div>
      <div class="pos-meta"><span>${o.qty} @ ₹${fmt(o.price)}</span><span>${new Date(o.time).toLocaleTimeString('en-IN',{hour12:false})}</span></div>
    </div>`).join('') : `<div class="empty-hint">No orders yet.</div>`;

  bindRowEvents();
  if(activeSymbol) updateDetailStats();
}

function toggleWatch(sym){
  if(watchlist.includes(sym)) watchlist=watchlist.filter(s=>s!==sym); else watchlist.push(sym);
  localStorage.setItem('miq_watch', JSON.stringify(watchlist));
  render();
}

$('#searchInput').oninput=(e)=>{ searchText=e.target.value; renderMarketList(); };

document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  ['market','watchlist','portfolio','orders'].forEach(v=>$('#view-'+v).style.display = v===t.dataset.tab?'block':'none');
});

setInterval(()=>{ $('#clock').textContent = new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour12:false}); },1000);

function openDetail(sym){
  activeSymbol=sym;
  $('#sheetOverlay').classList.add('show');
  $('#detail').classList.add('show');
  $('#dName').textContent=sym;
  $('#dSector').textContent=state.instruments[sym].sector;
  updateDetailStats();
  initChart();
  loadCandles();
}
function closeDetail(){ $('#sheetOverlay').classList.remove('show'); $('#detail').classList.remove('show'); $('#detail').classList.remove('fullscreen'); activeSymbol=null; }
$('#closeDetail').onclick=closeDetail; $('#sheetOverlay').onclick=closeDetail;
$('#expandBtn').onclick=()=>{ $('#detail').classList.toggle('fullscreen'); setTimeout(resizeChart,50); };
window.addEventListener('orientationchange',()=>setTimeout(resizeChart,200));
window.addEventListener('resize',()=>resizeChart());

function updateDetailStats(){
  if(!activeSymbol||!state) return;
  const sym=activeSymbol, p=state.prices[sym], chg=state.changePct[sym]||0;
  $('#dPrice').textContent='₹'+fmt(p);
  const chgEl=$('#dChg'); chgEl.textContent=(chg>=0?'+':'')+chg+'%'; chgEl.className='dh-chg '+(chg>=0?'up':'down');
  $('#sOpen').textContent=fmt(state.dayOpen[sym]);
  $('#sHigh').textContent=fmt(state.dayHigh[sym]);
  $('#sLow').textContent=fmt(state.dayLow[sym]);
}

function resizeChart(){
  if(!chart) return;
  const el=document.getElementById('chart');
  chart.applyOptions({width:el.clientWidth, height:el.clientHeight});
}

function initChart(){
  $('#chart').innerHTML='';
  overlaySeries={}; priceLines=[];
  const el=document.getElementById('chart');
  chart = LightweightCharts.createChart(el, {
    width: el.clientWidth, height: el.clientHeight,
    layout:{background:{color:'transparent'},textColor:'#7C8698',fontSize:11},
    grid:{vertLines:{color:'#1A2029'},horzLines:{color:'#1A2029'}},
    rightPriceScale:{borderColor:'#232936'}, timeScale:{borderColor:'#232936',timeVisible:true},
    crosshair:{mode:1}
  });
  addSeries();
  volSeries = chart.addHistogramSeries({priceFormat:{type:'volume'},priceScaleId:'vol',color:'#2FD67566'});
  chart.priceScale('vol').applyOptions({scaleMargins:{top:0.82,bottom:0}});
  chart.subscribeClick(param=>{
    if(!drawMode||!param.point) return;
    const price = series.coordinateToPrice(param.point.y);
    if(price==null) return;
    let label = prompt('Label this line (Stop Loss / Target / Custom):','Stop Loss');
    if(!label) return;
    const l=label.toLowerCase();
    const color = l.includes('stop')||l.includes('sl') ? '#F5455C' : l.includes('target')||l.includes('profit') ? '#2FD675' : '#F0B90B';
    const pl = series.createPriceLine({price, color, lineWidth:2, lineStyle:2, axisLabelVisible:true, title:label});
    priceLines.push(pl);
    drawMode=false; $('#drawLineBtn').classList.remove('on');
  });
}
function addSeries(){
  if(series) chart.removeSeries(series);
  overlaySeries={};
  if(chartStyle==='candle'){
    series = chart.addCandlestickSeries({upColor:'#2FD675',downColor:'#F5455C',borderVisible:false,wickUpColor:'#2FD675',wickDownColor:'#F5455C'});
  } else {
    series = chart.addAreaSeries({lineColor:'#F0B90B',topColor:'rgba(240,185,11,.25)',bottomColor:'rgba(240,185,11,0)',lineWidth:2});
  }
  series.priceScale().applyOptions({scaleMargins:{top:0.08,bottom:0.28}});
}

$('#drawLineBtn').onclick=()=>{ drawMode=!drawMode; $('#drawLineBtn').classList.toggle('on',drawMode); if(drawMode) toast('Tap the chart to place a line'); };
$('#clearLinesBtn').onclick=()=>{ priceLines.forEach(l=>series.removePriceLine(l)); priceLines=[]; toast('Lines cleared'); };

document.querySelectorAll('.ind-toggle').forEach(el=>el.onclick=()=>{
  const k=el.dataset.ind; indState[k]=!indState[k]; el.classList.toggle('on',indState[k]); applyOverlays(lastGrouped);
});

async function loadCandles(){
  if(!activeSymbol) return;
  try{
    const r=await fetch(api('/api/candles?symbol='+activeSymbol));
    const d=await r.json();
    if(!d.ok) return;
    const raw=d.candles;
    const grouped = groupCandles(raw, parseInt(tf));
    lastGrouped=grouped;
    if(chartStyle==='candle'){
      series.setData(grouped.map(c=>({time:Math.floor(c.t/1000),open:c.o,high:c.h,low:c.l,close:c.c})));
    } else {
      series.setData(grouped.map(c=>({time:Math.floor(c.t/1000),value:c.c})));
    }
    volSeries.setData(grouped.map(c=>({time:Math.floor(c.t/1000),value:c.v,color:c.c>=c.o?'#2FD67566':'#F5455C66'})));
    $('#sVol').textContent = fmt(raw.reduce((a,c)=>a+c.v,0));
    applyOverlays(grouped);
    renderIndicators(grouped);
    chart.timeScale().fitContent();
  }catch(e){}
}
let lastGrouped=[];

function groupCandles(raw,mins){
  if(mins<=1) return raw;
  const ms=mins*60000, out=[]; let bucketStart=null,cur=null;
  raw.forEach(c=>{
    const b=Math.floor(c.t/ms)*ms;
    if(b!==bucketStart){ if(cur) out.push(cur); cur={t:b,o:c.o,h:c.h,l:c.l,c:c.c,v:c.v}; bucketStart=b; }
    else { cur.h=Math.max(cur.h,c.h); cur.l=Math.min(cur.l,c.l); cur.c=c.c; cur.v+=c.v; }
  });
  if(cur) out.push(cur);
  return out;
}

function smaSeries(candles,period){ const out=[]; for(let i=period-1;i<candles.length;i++){ let sum=0; for(let j=i-period+1;j<=i;j++) sum+=candles[j].c; out.push({time:Math.floor(candles[i].t/1000), value:sum/period}); } return out; }
function emaSeries(candles,period){ if(candles.length<period) return []; const out=[]; const k=2/(period+1); let sum=0; for(let j=0;j<period;j++) sum+=candles[j].c; let prev=sum/period; out.push({time:Math.floor(candles[period-1].t/1000),value:prev}); for(let i=period;i<candles.length;i++){ prev=candles[i].c*k+prev*(1-k); out.push({time:Math.floor(candles[i].t/1000),value:prev}); } return out; }
function bollingerSeries(candles,period=20,mult=2){ const upper=[],lower=[]; for(let i=period-1;i<candles.length;i++){ const slice=candles.slice(i-period+1,i+1).map(c=>c.c); const mean=slice.reduce((a,b)=>a+b,0)/period; const variance=slice.reduce((a,b)=>a+(b-mean)**2,0)/period; const sd=Math.sqrt(variance); const t=Math.floor(candles[i].t/1000); upper.push({time:t,value:mean+mult*sd}); lower.push({time:t,value:mean-mult*sd}); } return {upper,lower}; }

function applyOverlays(candles){
  if(!candles||!candles.length||!chart) return;
  ['sma5','sma20','ema9','bbUpper','bbLower'].forEach(k=>{ if(overlaySeries[k]){ chart.removeSeries(overlaySeries[k]); delete overlaySeries[k]; } });
  if(indState.sma5 && candles.length>=5){ overlaySeries.sma5=chart.addLineSeries({color:'#4EA1F7',lineWidth:1,priceLineVisible:false}); overlaySeries.sma5.setData(smaSeries(candles,5)); }
  if(indState.sma20 && candles.length>=20){ overlaySeries.sma20=chart.addLineSeries({color:'#B15EFF',lineWidth:1,priceLineVisible:false}); overlaySeries.sma20.setData(smaSeries(candles,20)); }
  if(indState.ema9 && candles.length>=9){ overlaySeries.ema9=chart.addLineSeries({color:'#F0B90B',lineWidth:1,priceLineVisible:false}); overlaySeries.ema9.setData(emaSeries(candles,9)); }
  if(indState.bb && candles.length>=20){ const bb=bollingerSeries(candles,20,2); overlaySeries.bbUpper=chart.addLineSeries({color:'#7C8698',lineWidth:1,priceLineVisible:false}); overlaySeries.bbUpper.setData(bb.upper); overlaySeries.bbLower=chart.addLineSeries({color:'#7C8698',lineWidth:1,priceLineVisible:false}); overlaySeries.bbLower.setData(bb.lower); }
}

function rsi(vals,period=14){ if(vals.length<period+1) return null; let gains=0,losses=0; for(let i=vals.length-period;i<vals.length;i++){ const diff=vals[i]-vals[i-1]; if(diff>=0) gains+=diff; else losses-=diff; } if(losses===0) return 100; const rs=(gains/period)/(losses/period); return 100-(100/(1+rs)); }
function macdLast(candles){
  if(candles.length<35) return null;
  const closes=candles.map(c=>c.c);
  function emaArr(vals,period){ const k=2/(period+1); const out=[vals[0]]; for(let i=1;i<vals.length;i++) out.push(vals[i]*k+out[i-1]*(1-k)); return out; }
  const ema12=emaArr(closes,12), ema26=emaArr(closes,26);
  const macdLine=ema12.map((v,i)=>v-ema26[i]);
  const signalArr=emaArr(macdLine,9);
  return {macd:macdLine[macdLine.length-1], signal:signalArr[signalArr.length-1]};
}
function renderIndicators(candles){
  const closes=candles.map(c=>c.c);
  const s5=closes.length>=5?closes.slice(-5).reduce((a,b)=>a+b,0)/5:null;
  const s20=closes.length>=20?closes.slice(-20).reduce((a,b)=>a+b,0)/20:null;
  const r=rsi(closes,14);
  const macd=macdLast(candles);
  const items=[
    ['SMA 5', s5?'₹'+fmt(s5):'-'],
    ['SMA 20', s20?'₹'+fmt(s20):'-'],
    ['RSI 14', r?r.toFixed(1):'-'],
    ['MACD', macd?macd.macd.toFixed(2):'-'],
    ['Signal', macd?macd.signal.toFixed(2):'-'],
    ['Day range', fmt(state.dayLow[activeSymbol])+' – '+fmt(state.dayHigh[activeSymbol])]
  ];
  $('#indicators').innerHTML = items.map(([k,v])=>`<div class="ind-pill"><div class="ind-name">${k}</div><div class="ind-val num">${v}</div></div>`).join('');
}

document.querySelectorAll('#tfGroup .tf-btn').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#tfGroup .tf-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  tf=b.dataset.tf; loadCandles();
});
document.querySelectorAll('#styleGroup .tf-btn').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#styleGroup .tf-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  chartStyle=b.dataset.style; addSeries(); loadCandles();
});

function openModal(side){
  activeSide=side;
  const sym=activeSymbol, ins=state.instruments[sym], p=state.prices[sym];
  $('#modalTitle').textContent=(side==='BUY'?'Buy ':'Sell ')+sym;
  $('#modalSub').textContent='LTP ₹'+fmt(p)+' · Lot size '+ins.lot;
  $('#qtyInput').value=ins.lot;
  updateEstimate();
  const btn=$('#confirmOrder');
  btn.style.background = side==='BUY'?'var(--up)':'var(--down)';
  btn.style.color = side==='BUY'?'#04220f':'#2a0509';
  $('#modalOverlay').classList.add('show');
}
$('#buyBtn').onclick=()=>openModal('BUY');
$('#sellBtn').onclick=()=>openModal('SELL');
$('#modalOverlay').onclick=(e)=>{ if(e.target.id==='modalOverlay') $('#modalOverlay').classList.remove('show'); };

function updateEstimate(){
  const q=parseInt($('#qtyInput').value)||0, p=state.prices[activeSymbol];
  const val=q*p, fee=val*.0005;
  $('#estVal').textContent='₹'+fmt(val); $('#estFee').textContent='₹'+fmt(fee);
}
$('#qtyInput').oninput=updateEstimate;
$('#qtyMinus').onclick=()=>{ const ins=state.instruments[activeSymbol]; let v=Math.max(ins.lot,(parseInt($('#qtyInput').value)||0)-ins.lot); $('#qtyInput').value=v; updateEstimate(); };
$('#qtyPlus').onclick=()=>{ const ins=state.instruments[activeSymbol]; let v=(parseInt($('#qtyInput').value)||0)+ins.lot; $('#qtyInput').value=v; updateEstimate(); };

$('#confirmOrder').onclick=async()=>{
  const qty=parseInt($('#qtyInput').value)||0;
  try{
    const r=await fetch(api('/api/order'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({symbol:activeSymbol,side:activeSide,qty})});
    const d=await r.json();
    if(d.ok){ toast(activeSide+' order filled: '+qty+' '+activeSymbol); $('#modalOverlay').classList.remove('show'); await fetchState(); }
    else toast(d.error||'Order failed');
  }catch(e){ toast('Network error'); }
};

fetchState();
setInterval(fetchState, 3000);
</script>
</body>
</html>
