/* ===== Supabase settings: paste yours from Project Settings > API ===== */
const SUPABASE_URL='YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY';
/* ====================================================================== */
const K='pocket-ledger-v1',$=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DEF=['Food','Travel','Cafes','Medical','Entertainment','Shopping','Bills','Other'],CURS=['INR','USD','EUR','GBP','JPY','AUD','CAD','AED','SGD'];
let S={};try{S=JSON.parse(localStorage.getItem(K))||{}}catch(e){}
function norm(){S.ex=S.ex||[];S.cats=S.cats&&S.cats.length?S.cats:DEF.slice();S.cur=S.cur||'INR';S.bud=S.bud||{total:0,cats:{}};S.bud.cats=S.bud.cats||{};S.bud.ov=S.bud.ov||{};S.bud.ann=S.bud.ann||0;S.theme=['dark','light','system'].includes(S.theme)?S.theme:'dark'}norm();
const applyTheme=()=>document.documentElement.setAttribute('data-theme',S.theme);applyTheme();
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}push()};
const iso=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const money=n=>{try{return new Intl.NumberFormat(undefined,{style:'currency',currency:S.cur}).format(n)}catch(e){return n.toFixed(2)}};
const fd=s=>new Date(s+'T00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
const MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const P={plus:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',hist:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',wallet:'<path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 7l12-3v3M17 14h2"/>',sliders:'<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',coin:'<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.6-.8-1.5-1.2-2.5-1.2-1.4 0-2.5.8-2.5 1.9 0 2.6 5 1.3 5 3.9 0 1.1-1.1 1.9-2.5 1.9-1 0-1.9-.4-2.5-1.2M12 6.5v1.8m0 7.4v1.8"/>',check:'<path d="M5 12l5 5 9-10"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',up:'<path d="M6 15l6-6 6 6"/>',down:'<path d="M6 9l6 6 6-6"/>',food:'<path d="M5 3v8a2 2 0 0 0 2 2v8M9 3v8M7 3v8M17 3c-2 2-3 5-3 8h3v10"/>',plane:'<path d="M2 14l20-8-8 16-3-7z"/>',cafe:'<path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M7 2v3M11 2v3"/>',med:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v14M16 5v14M3 10h5M3 14h5M16 10h5M16 14h5"/>',bag:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',bill:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>',moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'};
const ic=p=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const CI={Food:P.food,Travel:P.plane,Cafes:P.cafe,Medical:P.med,Entertainment:P.film,Shopping:P.bag,Bills:P.bill};
const m0=n=>{try{return new Intl.NumberFormat(undefined,{style:'currency',currency:S.cur,maximumFractionDigits:0}).format(n)}catch(e){return String(n)}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const sum=a=>a.reduce((t,e)=>t+e.amount,0),key=(y,m)=>y+'-'+String(m+1).padStart(2,'0');
const sym=()=>{try{return new Intl.NumberFormat(undefined,{style:'currency',currency:S.cur}).formatToParts(0).find(p=>p.type==='currency').value}catch(e){return S.cur}};
let now=new Date(),H={y:now.getFullYear(),m:now.getMonth(),qn:Math.floor(now.getMonth()/3),mode:['month','quarter','year','summary'].includes(S.hm)?S.hm:'month',q:'',cat:'',min:'',max:'',view:(S.hv==='day'||S.hv==='time')?'time':'cat'},sel='';
function toast(t){const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.innerHTML=ic(P.check)+'<span>'+esc(t)+'</span>';document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function route(){const r=(location.hash.slice(1)||'add');const R={add,history:hist,budget:budg,prefs}[r]?r:'add';
document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===R));
const A=$('#app');A.classList.remove('enter');void A.offsetWidth;A.classList.add('enter');({add,history:hist,budget:budg,prefs})[R]();if(R==='prefs'){acct();danger()}window.scrollTo(0,0)}
addEventListener('hashchange',route);

/* ADD */
function fail(m,a){$('#err').textContent=m;$('.amt').classList.toggle('bad',!!a);if(a)$('#amt').focus()}
function add(){const A=$('#app');sel=sel&&S.cats.includes(sel)?sel:'';
A.innerHTML=`<div class="narrow"><h1>Add expense</h1><p class="sub">Record a purchase in a few seconds.</p><form class="card" id="f" novalidate>
<div class="row"><div><label class="f" for="amt">Amount</label><div class="amt"><span>${esc(sym())}</span><input id="amt" inputmode="decimal" placeholder="0.00" autocomplete="off"></div></div></div>
<div class="row"><fieldset style="border:0;padding:0;margin:0"><legend class="f">Category</legend><div class="chips">${S.cats.map(c=>`<label class="chip"><input type="radio" name="cat" value="${esc(c)}" ${c===sel?'checked':''}><span>${ic(CI[c]||P.tag)}${esc(c)}</span></label>`).join('')}</div></fieldset></div>
<div class="row"><div><label class="f" for="desc">Description <span style="font-weight:400;color:var(--mut)">(optional)</span></label><input id="desc" placeholder="e.g. Lunch with friends" maxlength="120"></div></div>
<div class="row"><div class="date"><label class="f" for="dt">Date</label><input type="date" id="dt" value="${iso(new Date())}"></div></div>
<p class="err" id="err" role="alert"></p><button class="btn big" type="submit">${ic(P.plus)}Add expense</button></form></div>`;
$('#f').onsubmit=e=>{e.preventDefault();const v=parseFloat($('#amt').value.replace(/,/g,'')),c=(document.querySelector('[name=cat]:checked')||{}).value,d=$('#dt').value;
const raw=$('#amt').value.trim().replace(/,/g,'');if(!raw){fail('Enter an amount to save this expense.',1);return}
if(!/^(\d+\.?\d*|\.\d+)$/.test(raw)||!(v>0)){fail('Enter a valid amount greater than zero, like 12.50.',1);return}
if(!c){fail('Choose a category to continue.');return}
if(!d){fail('Choose a date.');return}
S.ex.push({id:uid(),amount:Math.round(v*100)/100,cat:c,desc:$('#desc').value.trim(),date:d});save();
toast('Added '+money(v)+' to '+c);sel='';add();$('#dt').value=d;$('#amt').focus()};
$('#f').oninput=()=>fail('');
document.querySelectorAll('[name=cat]').forEach(r=>r.onchange=()=>sel=r.value)}

/* HISTORY */
function closePop(){const p=$('#pop');if(p){p.hidden=true;const b=$('#mb');if(b)b.setAttribute('aria-expanded','false')}}
const MODES=[['month','Month'],['quarter','Quarter'],['year','Year'],['summary','Summary']];
function rng(){const y=H.y,M=H.mode;let m0,m1,lab;
if(M==='month'){m0=m1=H.m;lab=new Date(y,H.m,1).toLocaleDateString(undefined,{month:'long',year:'numeric'})}
else if(M==='quarter'){m0=H.qn*3;m1=m0+2;lab='Q'+(H.qn+1)+' '+y+' ('+MN[m0]+'–'+MN[m1]+')'}
else{m0=0;m1=11;lab=String(y)}
return{from:iso(new Date(y,m0,1)),to:iso(new Date(y,m1+1,0)),m0,m1,lab}}
function hist(){$('#app').innerHTML=`<h1>History</h1>
<div class="seg full" id="ms" role="group" aria-label="History view">${MODES.map(([v,l])=>`<button type="button" data-md="${v}">${l}</button>`).join('')}</div>
<div class="mpick"><button type="button" class="mbtn" id="mb" aria-haspopup="true" aria-expanded="false" aria-label="Choose period"><span id="ml"></span>${ic(P.down)}</button><div class="pop" id="pop" hidden><div class="yr"><button type="button" id="yu" aria-label="Previous year">${ic(P.up)}</button><b id="yl"></b><button type="button" id="yd" aria-label="Next year">${ic(P.down)}</button></div>
<div class="months" id="mg"></div></div></div>
<div class="total" id="tot"></div><div class="stats" id="sm" hidden></div>
<div class="filters"><input id="q" type="search" placeholder="Search description" aria-label="Search" value="${esc(H.q)}">
<select id="fc" aria-label="Category"><option value="">All categories</option>${S.cats.map(c=>`<option ${H.cat===c?'selected':''}>${esc(c)}</option>`).join('')}</select>
${[['mn','min','Min amount','minimum'],['mx','max','Max amount','maximum']].map(([id,k,p,w])=>`<div class="step"><span class="cur">${esc(sym())}</span><input id="${id}" type="number" min="0" step="any" inputmode="decimal" placeholder="${p}" aria-label="${p} in ${esc(S.cur)}" value="${H[k]}"><button type="button" class="sb" data-t="${id}" data-k="${k}" data-d="-10" aria-label="Decrease ${w} by 10">−</button><button type="button" class="sb" data-t="${id}" data-k="${k}" data-d="10" aria-label="Increase ${w} by 10">+</button></div>`).join('')}
<button type="button" class="btn ghost" id="cf">${ic(P.x)}Clear filters</button></div>
<ul class="list" id="ls"></ul>
<h2 id="cht">Spending chart</h2><div class="card"><div class="seg" id="cs"><button type="button" id="vc">By category</button><button type="button" id="vd"></button></div><div class="chart" id="ch"></div></div>`;
$('#yu').onclick=()=>{H.y--;upd()};$('#yd').onclick=()=>{H.y++;upd()};
$('#mb').onclick=()=>{const p=$('#pop'),o=p.hidden;p.hidden=!o;$('#mb').setAttribute('aria-expanded',String(o))};
document.onclick=e=>{if(!e.target.closest('.mpick'))closePop()};
document.onkeydown=e=>{const p=$('#pop');if(e.key==='Escape'&&p&&!p.hidden){closePop();$('#mb').focus()}};
document.querySelectorAll('[data-md]').forEach(b=>b.onclick=()=>{H.mode=S.hm=b.dataset.md;if(H.mode==='quarter')H.qn=Math.floor(H.m/3);save();closePop();upd()});
$('#q').oninput=e=>{H.q=e.target.value;upd()};$('#fc').onchange=e=>{H.cat=e.target.value;upd()};
const stp=(id,k,d)=>{const i=$('#'+id);let v=parseFloat(i.value);v=Math.max(0,Math.round(((isNaN(v)?0:v)+d)*100)/100);i.value=v;H[k]=String(v);upd()};
[['mn','min'],['mx','max']].forEach(([id,k])=>{const i=$('#'+id);i.oninput=()=>{H[k]=i.value;upd()};i.onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();stp(id,k,e.key==='ArrowUp'?10:-10)}}});
document.querySelectorAll('.sb').forEach(b=>b.onclick=()=>stp(b.dataset.t,b.dataset.k,+b.dataset.d));
$('#cf').onclick=()=>{H.min=H.max='';$('#mn').value='';$('#mx').value='';upd()};
$('#vd').onclick=()=>{H.view=S.hv='time';save();upd()};$('#vc').onclick=()=>{H.view=S.hv='cat';save();upd()};upd()}
function upd(){const R=rng(),M=H.mode;
$('#yl').textContent=H.y;$('#ml').textContent=R.lab;
document.querySelectorAll('[data-md]').forEach(b=>{const on=b.dataset.md===M;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
const g=$('#mg');g.hidden=(M==='year'||M==='summary');g.className='months'+(M==='quarter'?' q':'');
g.innerHTML=M==='month'?MN.map((n,i)=>`<button type="button" data-m="${i}" class="${i===H.m?'on':''}" aria-pressed="${i===H.m}">${n}</button>`).join(''):M==='quarter'?[0,1,2,3].map(i=>`<button type="button" data-q="${i}" class="${i===H.qn?'on':''}" aria-pressed="${i===H.qn}">Q${i+1}<small>${MN[i*3]}–${MN[i*3+2]}</small></button>`).join(''):'';
g.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.m!=null){H.m=+b.dataset.m;H.qn=Math.floor(H.m/3)}else{H.qn=+b.dataset.q;H.m=H.qn*3}closePop();upd();$('#mb').focus()});
const inP=S.ex.filter(e=>e.date>=R.from&&e.date<=R.to),tot=sum(inP);
$('#tot').hidden=M==='summary';$('#sm').hidden=M!=='summary';
$('#tot').innerHTML=`Spent in ${R.lab}<b>${money(tot)}</b>`;
if(M==='summary')summ(inP,tot);
const q=H.q.toLowerCase(),mn=parseFloat(H.min),mx=parseFloat(H.max);
const L=inP.filter(e=>(!H.cat||e.cat===H.cat)&&(!q||(e.desc+' '+e.cat).toLowerCase().includes(q))&&(isNaN(mn)||e.amount>=mn)&&(isNaN(mx)||e.amount<=mx)).sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
$('#ls').innerHTML=L.length?L.map(e=>`<li><button type="button" data-id="${e.id}"><span>${e.desc?esc(e.desc)+'<span class="tag">'+esc(e.cat)+'</span>':'<span class="tag" style="margin-left:0">'+esc(e.cat)+'</span>'}</span><span class="a">${money(e.amount)}</span><span class="d">${fd(e.date)}</span></button></li>`).join(''):`<li class="empty">${!S.ex.length?'No expenses yet. Add your first one from the Add tab.':!inP.length?'No expenses in this period.':'No expenses match these filters.'}</li>`;
$('#ls').querySelectorAll('button').forEach(b=>b.onclick=()=>openE(b.dataset.id));
$('#cs').hidden=M==='summary';$('#cht').textContent=M==='summary'?'Spending overview':'Spending chart';
$('#vd').textContent=M==='month'?'By day':'By month';
$('#vd').classList.toggle('on',H.view==='time');$('#vc').classList.toggle('on',H.view!=='time');
chart(inP,R)}
function summ(a,t){const bm=Array(12).fill(0),bc={};a.forEach(e=>{bm[+e.date.slice(5,7)-1]+=e.amount;bc[e.cat]=(bc[e.cat]||0)+e.amount});
const td=new Date(),ty=td.getFullYear(),months=H.y<ty?12:H.y===ty?td.getMonth()+1:0,days=H.y>ty?0:Math.round(((H.y===ty?td:new Date(H.y,11,31))-new Date(H.y,0,1))/864e5)+1;
const top=Object.entries(bc).sort((x,y)=>y[1]-x[1])[0],hm=bm.indexOf(Math.max(...bm));
$('#sm').innerHTML=[['Total spent',money(t)],['Expenses',a.length],['Monthly average',months?money(t/months):'—'],['Daily average',days?money(t/days):'—'],['Top category',top?esc(top[0])+' · '+money(top[1]):'—'],['Highest month',a.length?MN[hm]+' · '+money(bm[hm]):'—']].map(([l,v])=>`<div><span>${l}</span><b>${v}</b></div>`).join('')}
function catHTML(a){const t=sum(a),g={};a.forEach(e=>g[e.cat]=(g[e.cat]||0)+e.amount);
return Object.entries(g).sort((x,y)=>y[1]-x[1]).map(([k,v])=>`<div class="cb"><span>${esc(k)}</span><div class="bar"><i style="width:${v/t*100}%"></i></div><span>${money(v)} · ${Math.round(v/t*100)}%</span></div>`).join('')}
function barsHTML(a,R){let val,lab,ttl;
if(H.mode==='month'){const n=new Date(H.y,H.m+1,0).getDate();val=Array(n).fill(0);a.forEach(e=>{val[+e.date.slice(8,10)-1]+=e.amount});lab=val.map((_,i)=>i===0||(i+1)%5===0?String(i+1):'');ttl=val.map((_,i)=>MN[H.m]+' '+(i+1))}
else{val=Array(R.m1-R.m0+1).fill(0);a.forEach(e=>{val[+e.date.slice(5,7)-1-R.m0]+=e.amount});lab=val.map((_,i)=>MN[R.m0+i]);ttl=lab}
const n=val.length,mx=Math.max(...val),bw=660/n;
let s=`<svg viewBox="0 0 700 230" role="img" aria-label="Spending by ${H.mode==='month'?'day':'month'}"><line class="ax" x1="30" y1="190" x2="690" y2="190"/>`;
val.forEach((v,i)=>{const h=mx?v/mx*160:0,x=30+i*bw,hh=v>0?Math.max(h,2):0;
s+=`<rect class="bz" x="${x+bw*.15}" y="${190-hh}" width="${bw*.7}" height="${hh}" rx="3"><title>${ttl[i]}: ${money(v)}</title></rect>`;
if(lab[i])s+=`<text class="tx" x="${x+bw/2}" y="210" text-anchor="middle">${lab[i]}</text>`});
return s+`<text class="tx" x="30" y="16">Peak: ${money(mx)}</text></svg>`}
function chart(a,R){const c=$('#ch');if(!a.length){c.innerHTML='<div class="empty">Nothing spent in this period.</div>';return}
if(H.mode==='summary')c.innerHTML='<h3 class="ch3">By month</h3>'+barsHTML(a,R)+'<h3 class="ch3">By category</h3>'+catHTML(a);
else c.innerHTML=H.view==='time'?barsHTML(a,R):catHTML(a)}
function openE(id){const e=S.ex.find(x=>x.id===id);if(!e)return;const D=$('#dlg');
D.innerHTML=`<form method="dialog" id="ef"><h2 style="margin-top:0">Expense details</h2>
<label class="f" for="ea">Amount</label><input id="ea" inputmode="decimal" value="${e.amount}"><div style="height:12px"></div>
<label class="f" for="ec">Category</label><select id="ec">${S.cats.concat(S.cats.includes(e.cat)?[]:[e.cat]).map(c=>`<option ${c===e.cat?'selected':''}>${esc(c)}</option>`).join('')}</select><div style="height:12px"></div>
<label class="f" for="ed">Description</label><input id="ed" value="${esc(e.desc)}" maxlength="120"><div style="height:12px"></div>
<label class="f" for="edt">Date</label><input type="date" id="edt" value="${e.date}">
<p class="err" id="ee" role="alert"></p>
<div class="acts"><button class="btn" type="button" id="sv">Save changes</button><button class="btn del" type="button" id="dl">Delete</button><button class="btn ghost" value="x">Close</button></div></form>`;
D.showModal();
$('#sv').onclick=()=>{const v=parseFloat($('#ea').value.replace(/,/g,''));if(!(v>0)||!$('#edt').value){$('#ee').textContent='Enter an amount above zero and a date.';return}
Object.assign(e,{amount:Math.round(v*100)/100,cat:$('#ec').value,desc:$('#ed').value.trim(),date:$('#edt').value});save();D.close();upd();toast('Changes saved')};
$('#dl').onclick=()=>{if(confirm('Delete this expense? This can’t be undone.')){S.ex=S.ex.filter(x=>x.id!==id);save();D.close();upd();toast('Expense deleted')}}}

/* BUDGET */
const R2=v=>Math.round(v*100)/100,bm=i=>{const o=S.bud.ov[i];return o!=null?o:(S.bud.total||0)},annual=()=>S.bud.ann||[...Array(12).keys()].reduce((t,i)=>t+bm(i),0),varies=()=>new Set([...Array(12).keys()].map(bm)).size>1;
function budg(){const Y=now.getFullYear(),Mi=now.getMonth(),k=key(Y,Mi),m=S.ex.filter(e=>e.date.startsWith(k)),tot=sum(m),ytd=sum(S.ex.filter(e=>e.date.startsWith(Y+'-')));
const row=(name,spent,lim,inp)=>{const left=lim-spent,p=lim?Math.min(100,spent/lim*100):0;
return `<div class="bud"><div class="h"><span>${esc(name)}</span><span>${money(spent)}${lim?' of '+money(lim):''}</span></div>${inp}${lim?`<div class="bar ${left<0?'over':''}"><i style="width:${p}%"></i></div><small>${left>=0?money(left)+' remaining':money(-left)+' over budget'}</small>`:'<small>No limit set</small>'}</div>`};
const fld=(id,lbl)=>`<label class="f" for="${id}">${lbl}</label><div class="step lg"><span class="cur">${esc(sym())}</span><input id="${id}" type="number" min="0" step="any" inputmode="decimal" placeholder="0" aria-label="${lbl} in ${esc(S.cur)}"></div>`;
$('#app').innerHTML=`<h1>Budget</h1><p style="color:var(--mut);margin-top:-8px">For ${MN[Mi]} ${Y}</p>
<div class="card">${fld('ba','Annual budget')}<small class="hint" id="bn"></small>
<div class="stats" id="as" aria-live="polite"></div><div class="bar" id="ab"><i></i></div><p class="bmsg" id="am"></p></div>
<h2>Monthly budget</h2>
<div class="card">${fld('bt','Monthly budget')}<small class="hint" id="bh"></small>
<div class="stats" id="bs" aria-live="polite"></div><div class="bar" id="bb"><i></i></div><p class="bmsg" id="bm"></p>
<details class="mdet"><summary>Set a different budget for each month</summary><div class="mgrid">${MN.map((n,i)=>`<label><span>${n}</span><input type="number" min="0" step="any" inputmode="decimal" data-o="${i}" aria-label="${n} budget in ${esc(S.cur)}"></label>`).join('')}</div></details></div>
<h2>Category budgets <span style="font-weight:400;color:var(--mut);font-size:14px">(optional)</span></h2>
<div class="card">${S.cats.map((c,i)=>{const L=S.bud.cats[c]||0;return row(c,sum(m.filter(e=>e.cat===c)),L,`<div class="in"><input type="number" min="0" placeholder="Set budget" aria-label="${esc(c)} budget" data-c="${i}" value="${L||''}"></div>`)}).join('')}</div>`;
const ba=$('#ba'),bt=$('#bt'),num=i=>Math.max(0,parseFloat(i.value)||0);
const st=(id,bid,mid,bud,sp,per,lab)=>{const left=bud-sp,over=bud&&left<0,p=bud?Math.min(100,sp/bud*100):0;
$('#'+id).innerHTML=`<div><span>${lab}</span><b>${bud?money(bud):'Not set'}</b></div><div><span>Spent</span><b>${money(sp)}</b></div><div><span>${over?'Over by':'Remaining'}</span><b class="${over?'neg':''}">${bud?money(Math.abs(left)):'—'}</b></div>`;
$('#'+bid).className='bar'+(over?' over':'');$('#'+bid).firstElementChild.style.width=p+'%';
$('#'+mid).textContent=bud?Math.round(sp/bud*100)+'% of '+per+' used.':'Set a budget to see how much you have left.'};
const refresh=src=>{const A=annual(),vs=[...Array(12).keys()].map(bm);
if(src!=='a')ba.value=A?R2(A):'';if(src!=='t')bt.value=S.bud.total?R2(S.bud.total):'';
document.querySelectorAll('[data-o]').forEach(i=>{if(src!=='o')i.value=S.bud.ov[i.dataset.o]!=null?R2(S.bud.ov[i.dataset.o]):'';i.placeholder=R2(bm(+i.dataset.o))||'0'});
$('#bn').textContent=!A?'Enter a yearly amount and it will be split into 12 equal monthly budgets.':S.bud.ann?`Split into 12 equal monthly budgets of ${money(A/12)}.`:varies()?'Calculated from your monthly budgets: the sum of all 12 months.':`Calculated from your monthly budget: ${money(S.bud.total)} × 12.`;
$('#bh').textContent=varies()?`Budgets vary by month, from ${money(Math.min(...vs))} to ${money(Math.max(...vs))}.`:S.bud.total?`${money(S.bud.total)} applies to every month.`:'Applies to every month. Leave blank if you don’t want a monthly limit.';
st('as','ab','am',A,ytd,'your annual budget','Annual budget');st('bs','bb','bm',bm(Mi),tot,'this month’s budget','This month’s budget')};
ba.oninput=()=>{const A=num(ba);S.bud.ann=A;S.bud.total=A/12;S.bud.ov={};save();refresh('a')};
bt.oninput=()=>{S.bud.total=num(bt);S.bud.ann=0;S.bud.ov={};save();refresh('t')};
document.querySelectorAll('[data-o]').forEach(i=>i.oninput=()=>{if(i.value.trim()==='')delete S.bud.ov[i.dataset.o];else S.bud.ov[i.dataset.o]=num(i);S.bud.ann=0;save();refresh('o')});
if(Object.keys(S.bud.ov).length)$('.mdet').open=true;
refresh();
document.querySelectorAll('[data-c]').forEach(i=>i.onchange=e=>{const c=S.cats[+i.dataset.c],v=Math.max(0,parseFloat(e.target.value)||0);if(v)S.bud.cats[c]=v;else delete S.bud.cats[c];save();budg()})}

/* SETTINGS */
function danger(){const n=S.ex.length,d=document.createElement('div');
d.innerHTML=`<h2>Clear history</h2><div class="card"><p style="margin:0 0 var(--s4);color:var(--mut)">Permanently delete all ${n} saved expense${n===1?'':'s'}. Your categories, budgets and settings are kept.</p><button type="button" class="btn del" id="ch0"${n?'':' disabled'}>${ic(P.trash)}Clear history</button></div>`;
$('#app').append(...d.childNodes);
$('#ch0').onclick=()=>{if(!S.ex.length)return;const D=$('#dlg'),c=S.ex.length;
D.innerHTML=`<form method="dialog"><h2 style="margin-top:0">Clear all history?</h2><p style="color:var(--mut)">This permanently deletes ${c} expense${c===1?'':'s'}. This can’t be undone.</p><div class="acts"><button class="btn del" type="button" id="cy">Delete all</button><button class="btn ghost" value="x">Cancel</button></div></form>`;
D.showModal();$('#cy').onclick=()=>{S.ex=[];save();D.close();toast('History cleared');route()}}}
const TH=[['dark','Dark',P.moon],['light','Light',P.sun],['system','System',P.monitor]];
function prefs(){$('#app').innerHTML=`<h1>Settings</h1><div class="card"><fieldset style="border:0;padding:0;margin:0"><legend class="f">Theme</legend><div class="chips">${TH.map(([v,l,p])=>`<label class="chip"><input type="radio" name="th" value="${v}" ${S.theme===v?'checked':''}><span>${ic(p)}${l}</span></label>`).join('')}</div><small class="hint" id="thn" ${S.theme==='system'?'':'hidden'}>System follows your device’s light or dark settings.</small></fieldset></div><div style="height:var(--s4)"></div><div class="card"><label class="f" for="cu">Currency</label><select id="cu">${CURS.map(c=>`<option ${c===S.cur?'selected':''}>${c}</option>`).join('')}</select></div>
<h2>Categories</h2><div class="card" id="cl">${S.cats.map((c,i)=>`<div class="cat-row"><input value="${esc(c)}" data-i="${i}" aria-label="Category name" maxlength="24">${c==='Other'?'':`<button class="btn del" data-d="${i}" aria-label="Delete ${esc(c)}">Delete</button>`}</div>`).join('')}
<div class="cat-row" style="margin-top:14px"><input id="nc" placeholder="New category name" maxlength="24"><button class="btn" id="na">Add</button></div>
<small style="color:var(--mut)">Renaming updates past expenses. Deleting a category moves its expenses to Other.</small></div>`;
document.querySelectorAll('[name=th]').forEach(r=>r.onchange=()=>{const R=document.documentElement;if(!matchMedia('(prefers-reduced-motion:reduce)').matches){R.classList.add('tt');setTimeout(()=>R.classList.remove('tt'),400)}S.theme=r.value;applyTheme();save();$('#thn').hidden=S.theme!=='system';toast('Theme: '+TH.find(t=>t[0]===r.value)[1])});
$('#cu').onchange=e=>{S.cur=e.target.value;save();toast('Currency set to '+S.cur)};
document.querySelectorAll('[data-i]').forEach(i=>i.onchange=()=>{const o=S.cats[+i.dataset.i],n=i.value.trim();if(!n||(S.cats.includes(n)&&n!==o)){toast('Use a unique, non-empty name');prefs();return}
if(o==='Other'&&n!=='Other'){toast('“Other” can’t be renamed');prefs();return}
S.cats[+i.dataset.i]=n;S.ex.forEach(e=>{if(e.cat===o)e.cat=n});if(S.bud.cats[o]){S.bud.cats[n]=S.bud.cats[o];delete S.bud.cats[o]}save();toast('Category renamed')});
document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const c=S.cats[+b.dataset.d];if(!confirm('Delete “'+c+'”? Its expenses move to Other.'))return;
if(!S.cats.includes('Other'))S.cats.push('Other');S.ex.forEach(e=>{if(e.cat===c)e.cat='Other'});delete S.bud.cats[c];S.cats=S.cats.filter(x=>x!==c);save();prefs()});
$('#na').onclick=()=>{const n=$('#nc').value.trim();if(!n||S.cats.includes(n)){toast('Use a unique, non-empty name');return}S.cats.splice(Math.max(0,S.cats.indexOf('Other')),0,n);save();prefs()}}
$('.logo i').innerHTML=ic(P.coin);
$('nav').innerHTML=[['add','Add',P.plus],['history','History',P.hist],['budget','Budget',P.wallet],['prefs','Settings',P.sliders]].map(([r,l,p])=>`<a href="#${r}" data-r="${r}">${ic(p)}<span>${l}</span></a>`).join('');
/* ===== Supabase sync: one row per user in public.user_data ===== */
const CFG_OK=SUPABASE_URL&&SUPABASE_ANON_KEY&&!SUPABASE_URL.startsWith('YOUR')&&window.supabase;
let sb=null,user=null,pushT=null,syncSt='';
const SYL={saving:'Saving…',saved:'All changes saved to your account',error:'Sync failed. Changes are kept on this device.'};
function setSync(t){syncSt=t;const e=$('#sy');if(e)e.textContent=SYL[t]||''}
function push(now){if(!sb||!user)return;const run=async()=>{const{error}=await sb.from('user_data').upsert({user_id:user.id,data:S,updated_at:new Date().toISOString()});setSync(error?'error':'saved');if(error)toast('Sync failed')};clearTimeout(pushT);if(now)return run();setSync('saving');pushT=setTimeout(run,600)}
async function pull(){const{data,error}=await sb.from('user_data').select('data').eq('user_id',user.id).maybeSingle();
if(error){toast('Could not load your saved data');return}
if(data&&data.data&&Object.keys(data.data).length){S=data.data;norm();try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}else{await push(true)}
applyTheme()}
function showAuth(){document.body.classList.add('auth');$('#app').className='enter';
$('#app').innerHTML=`<div class="narrow"><h1>Sign in</h1><p class="sub">Your expenses sync to your account on every device.</p><form class="card" id="af" novalidate>
<div class="row"><div><label class="f" for="ae">Email</label><input id="ae" type="email" autocomplete="email" placeholder="you@example.com"></div>
<div><label class="f" for="ap">Password</label><input id="ap" type="password" autocomplete="current-password" placeholder="At least 6 characters"></div></div>
<p class="err" id="aerr" role="alert"></p><div class="acts"><button class="btn" type="submit">Sign in</button><button class="btn ghost" type="button" id="su">Create account</button></div></form></div>`;
$('#af').onsubmit=e=>{e.preventDefault();authGo('in')};$('#su').onclick=()=>authGo('up')}
async function authGo(kind){const email=$('#ae').value.trim(),pw=$('#ap').value,E=$('#aerr');
if(!email||pw.length<6){E.textContent='Enter your email and a password of at least 6 characters.';return}
E.textContent='';const r=kind==='up'?await sb.auth.signUp({email,password:pw}):await sb.auth.signInWithPassword({email,password:pw});
if(r.error){E.textContent=r.error.message;return}
if(!r.data.session){E.textContent='Check your email to confirm your account, then sign in.';return}
user=r.data.session.user;await pull();document.body.classList.remove('auth');route()}
function acct(){if(!user)return;const d=document.createElement('div');
d.innerHTML=`<h2>Account</h2><div class="card"><p style="margin:0 0 var(--s2)">Signed in as <b>${esc(user.email||'')}</b></p><small class="hint" id="sy" style="margin:0 0 var(--s4)"></small><button type="button" class="btn ghost" id="so">Sign out</button></div>`;
$('#app').append(...d.childNodes);setSync(syncSt);
$('#so').onclick=async()=>{clearTimeout(pushT);await push(true);await sb.auth.signOut();try{localStorage.removeItem(K)}catch(e){}S={};norm();applyTheme();user=null;showAuth()}}
async function boot(){if(!CFG_OK){route();return}
sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const{data}=await sb.auth.getSession();
if(data.session){user=data.session.user;await pull();route()}else showAuth()}
boot();
