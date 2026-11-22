





const K='pocket-ledger-v1',$=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DEF=['Food','Travel','Cafes','Medical','Entertainment','Shopping','Bills','Other'],CURS=['INR','USD','EUR','GBP','JPY','AUD','CAD','AED','SGD'];
let S={};try{S=JSON.parse(localStorage.getItem(K))||{}}catch(e){}
S.ex=S.ex||[];S.cats=S.cats&&S.cats.length?S.cats:DEF.slice();S.cur=S.cur||'INR';S.bud=S.bud||{total:0,cats:{}};S.theme=['dark','light','system'].includes(S.theme)?S.theme:'dark';
const applyTheme=()=>document.documentElement.setAttribute('data-theme',S.theme);applyTheme();
let sb=null,currentUser=null,syncTimer=null,syncing=false;
try{const cfg=window.SUPABASE_CONFIG;if(window.supabase&&cfg?.url&&cfg?.publishableKey&&!cfg.url.includes('YOUR_')&&!cfg.publishableKey.includes('YOUR_'))sb=window.supabase.createClient(cfg.url,cfg.publishableKey)}catch(e){console.error('Supabase setup error',e)}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){};if(sb&&currentUser){clearTimeout(syncTimer);syncTimer=setTimeout(syncCloud,500)}};
async function syncCloud(){if(!sb||!currentUser||syncing)return;syncing=true;try{const {error}=await sb.from('user_data').upsert({user_id:currentUser.id,data:S,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)throw error;const st=$('#syncStatus');if(st)st.textContent='Synced to Supabase'}catch(e){console.error(e);const st=$('#syncStatus');if(st)st.textContent='Cloud sync failed: '+e.message}finally{syncing=false}}
function authPage(message=''){const A=$('#app');A.innerHTML=`<div class="narrow"><h1>Pocket Ledger</h1><p class="sub">Sign in to sync your expenses across devices.</p><form class="card" id="authForm"><div class="row"><div><label class="f" for="authEmail">Email</label><input id="authEmail" type="email" required autocomplete="email"></div></div><div class="row"><div><label class="f" for="authPassword">Password</label><input id="authPassword" type="password" required minlength="6" autocomplete="current-password"></div></div><p class="err" id="authErr" role="alert">${esc(message)}</p><button class="btn big" type="submit">Sign in</button><button class="btn ghost" type="button" id="authSignUp" style="width:100%;margin-top:10px">Create account</button></form>${!sb?'<p class="sub">Add your Supabase URL and publishable key to supabase-config.js to enable cloud sync.</p>':''}</div>`;if(!sb)return;$('#authForm').onsubmit=async e=>{e.preventDefault();const {error}=await sb.auth.signInWithPassword({email:$('#authEmail').value.trim(),password:$('#authPassword').value});if(error)$('#authErr').textContent=error.message};$('#authSignUp').onclick=async()=>{const {data,error}=await sb.auth.signUp({email:$('#authEmail').value.trim(),password:$('#authPassword').value});$('#authErr').textContent=error?error.message:(data.session?'Account created.':'Account created. Check your email to confirm, then sign in.')};}
async function loadCloud(user){currentUser=user;try{const {data,error}=await sb.from('user_data').select('data').eq('user_id',user.id).maybeSingle();if(error)throw error;const owner=localStorage.getItem(K+'-owner');if(data?.data){S=data.data;S.ex=S.ex||[];S.cats=S.cats&&S.cats.length?S.cats:DEF.slice();S.cur=S.cur||'INR';S.bud=S.bud||{total:0,cats:{}};S.theme=['dark','light','system'].includes(S.theme)?S.theme:'dark';S.bud.months=S.bud.months||{};applyTheme();try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}else{if(owner&&owner!==user.id)S={ex:[],cats:DEF.slice(),cur:'INR',bud:{total:0,cats:{},months:{}},theme:'dark'};await syncCloud()}try{localStorage.setItem(K+'-owner',user.id)}catch(e){}route()}catch(e){console.error(e);$('#app').innerHTML=`<div class="card"><h1>Could not load your cloud data</h1><p>${esc(e.message)}</p><button class="btn" onclick="location.reload()">Try again</button></div>`}}
async function boot(){if(!sb){route();return}$('#app').innerHTML='<p class="sub">Connecting to Supabase…</p>';const {data:{session}}=await sb.auth.getSession();if(session){signOutBtn.style.display='inline-flex';await loadCloud(session.user)}else authPage();sb.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'&&session&&session.user.id!==currentUser?.id){signOutBtn.style.display='inline-flex';loadCloud(session.user)}else if(event==='SIGNED_OUT'){currentUser=null;signOutBtn.style.display='none';authPage()}})}
const iso=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const money=n=>{try{return new Intl.NumberFormat(undefined,{style:'currency',currency:S.cur}).format(n)}catch(e){return n.toFixed(2)}};
const fd=s=>new Date(s+'T00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
const MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const P={plus:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',hist:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',wallet:'<path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 7l12-3v3M17 14h2"/>',sliders:'<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',coin:'<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.6-.8-1.5-1.2-2.5-1.2-1.4 0-2.5.8-2.5 1.9 0 2.6 5 1.3 5 3.9 0 1.1-1.1 1.9-2.5 1.9-1 0-1.9-.4-2.5-1.2M12 6.5v1.8m0 7.4v1.8"/>',check:'<path d="M5 12l5 5 9-10"/>',up:'<path d="M6 15l6-6 6 6"/>',down:'<path d="M6 9l6 6 6-6"/>',food:'<path d="M5 3v8a2 2 0 0 0 2 2v8M9 3v8M7 3v8M17 3c-2 2-3 5-3 8h3v10"/>',plane:'<path d="M2 14l20-8-8 16-3-7z"/>',cafe:'<path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M7 2v3M11 2v3"/>',med:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v14M16 5v14M3 10h5M3 14h5M16 10h5M16 14h5"/>',bag:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',bill:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>',moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'};
const ic=p=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const CI={Food:P.food,Travel:P.plane,Cafes:P.cafe,Medical:P.med,Entertainment:P.film,Shopping:P.bag,Bills:P.bill};
const m0=n=>{try{return new Intl.NumberFormat(undefined,{style:'currency',currency:S.cur,maximumFractionDigits:0}).format(n)}catch(e){return String(n)}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const sum=a=>a.reduce((t,e)=>t+e.amount,0),key=(y,m)=>{const d=new Date(y,m,1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const sym=()=>{try{return new Intl.NumberFormat(undefined,{style:'currency',currency:S.cur}).formatToParts(0).find(p=>p.type==='currency').value}catch(e){return S.cur}};
let now=new Date(),H={y:now.getFullYear(),m:now.getMonth(),quarter:Math.floor(now.getMonth()/3),period:'month',q:'',cat:'',min:'',max:'',view:S.hv==='day'?'day':'cat'},sel='';
S.bud.months=S.bud.months||{};
if(!Object.keys(S.bud.months).length&&S.bud.total>0)for(let i=0;i<12;i++)S.bud.months[key(now.getFullYear(),i)]=S.bud.total;
function toast(t){const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.innerHTML=ic(P.check)+'<span>'+esc(t)+'</span>';document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function route(){if(sb&&!currentUser){authPage();return}const r=(location.hash.slice(1)||'add');const R={add,history:hist,budget:budg,prefs}[r]?r:'add';
document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===R));
const A=$('#app');A.classList.remove('enter');void A.offsetWidth;A.classList.add('enter');({add,history:hist,budget:budg,prefs})[R]();window.scrollTo(0,0)}
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
function hist(){$('#app').innerHTML=`<h1>History</h1>
<div class="seg" id="periods" aria-label="History period"><button data-period="month">Month</button><button data-period="quarter">Quarter</button><button data-period="year">Year</button><button data-period="summary">Expense summary</button></div>
<div id="periodPick"></div><div class="total" id="tot"></div>
<div class="filters"><input id="q" type="search" placeholder="Search description" aria-label="Search" value="${esc(H.q)}">
<select id="fc" aria-label="Category"><option value="">All categories</option>${S.cats.map(c=>`<option ${H.cat===c?'selected':''}>${esc(c)}</option>`).join('')}</select>
${[['mn','min','Min amount','minimum'],['mx','max','Max amount','maximum']].map(([id,k,p,w])=>`<div class="step"><span class="cur">${esc(sym())}</span><input id="${id}" type="number" min="0" step="any" inputmode="decimal" placeholder="${p}" aria-label="${p} in ${esc(S.cur)}" value="${H[k]}"><button type="button" class="sb" data-t="${id}" data-k="${k}" data-d="-10" aria-label="Decrease ${w} by 10">−</button><button type="button" class="sb" data-t="${id}" data-k="${k}" data-d="10" aria-label="Increase ${w} by 10">+</button></div>`).join('')}
<button type="button" class="btn ghost" id="cf">Clear amount filters</button></div>
<ul class="list" id="ls"></ul>
<h2>Spending chart</h2><div class="card"><div class="seg" id="chartModes"></div><div class="chart" id="ch"></div></div>`;
document.querySelectorAll('[data-period]').forEach(b=>b.onclick=()=>{H.period=b.dataset.period;H.view='cat';upd(1)});
$('#q').oninput=e=>{H.q=e.target.value;upd(1)};$('#fc').onchange=e=>{H.cat=e.target.value;upd(1)};
const stp=(id,k,d)=>{const i=$('#'+id);let v=parseFloat(i.value);v=Math.max(0,Math.round(((isNaN(v)?0:v)+d)*100)/100);i.value=v;H[k]=String(v);upd(1)};
[['mn','min'],['mx','max']].forEach(([id,k])=>{const i=$('#'+id);i.oninput=()=>{H[k]=i.value;upd(1)};i.onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();stp(id,k,e.key==='ArrowUp'?10:-10)}}});
document.querySelectorAll('.sb').forEach(b=>b.onclick=()=>stp(b.dataset.t,b.dataset.k,+b.dataset.d));
$('#cf').onclick=()=>{H.min=H.max='';$('#mn').value=$('#mx').value='';upd(1)};
$('#chartModes').onclick=e=>{const b=e.target.closest('button');if(!b)return;H.view=b.dataset.view;S.hv=H.view;save();upd(1)};
upd()}
function upd(){
if(H.period!=='month'&&H.view==='day')H.view='cat';
document.querySelectorAll('[data-period]').forEach(b=>b.classList.toggle('on',b.dataset.period===H.period));
const pp=$('#periodPick');
if(H.period==='month'){
pp.innerHTML=`<div class="mpick"><button type="button" class="mbtn" id="mb" aria-haspopup="true" aria-expanded="false"><span id="ml"></span>${ic(P.down)}</button><div class="pop" id="pop" hidden><div class="yr"><button id="yu" aria-label="Previous year">${ic(P.up)}</button><b id="yl"></b><button id="yd" aria-label="Next year">${ic(P.down)}</button></div><div class="months" id="mg"></div></div></div>`;
$('#yl').textContent=H.y;$('#ml').textContent=new Date(H.y,H.m,1).toLocaleDateString(undefined,{month:'long',year:'numeric'});
$('#mg').innerHTML=MN.map((n,i)=>`<button data-m="${i}" class="${i===H.m?'on':''}" aria-pressed="${i===H.m}">${n}</button>`).join('');
$('#yu').onclick=()=>{H.y--;upd()};$('#yd').onclick=()=>{H.y++;upd()};
$('#mb').onclick=()=>{const p=$('#pop'),o=p.hidden;p.hidden=!o;$('#mb').setAttribute('aria-expanded',String(o))};
$('#mg').querySelectorAll('button').forEach(b=>b.onclick=()=>{H.m=+b.dataset.m;closePop();upd();$('#mb').focus()});
document.onclick=e=>{if(!e.target.closest('.mpick'))closePop()};
document.onkeydown=e=>{const p=$('#pop');if(e.key==='Escape'&&p&&!p.hidden){closePop();$('#mb').focus()}};
}else if(H.period==='quarter'){
pp.innerHTML=`<div class="yr"><button id="yu" aria-label="Previous year">${ic(P.up)}</button><b>${H.y}</b><button id="yd" aria-label="Next year">${ic(P.down)}</button></div><div class="seg" id="quarters">${[1,2,3,4].map(q=>`<button data-quarter="${q-1}" class="${H.quarter===q-1?'on':''}" aria-pressed="${H.quarter===q-1}">Q${q}</button>`).join('')}</div>`;
$('#yu').onclick=()=>{H.y--;upd()};$('#yd').onclick=()=>{H.y++;upd()};
$('#quarters').querySelectorAll('button').forEach(b=>b.onclick=()=>{H.quarter=+b.dataset.quarter;upd()});
}else if(H.period==='year'){
pp.innerHTML=`<div class="yr"><button id="yu" aria-label="Previous year">${ic(P.up)}</button><b>${H.y}</b><button id="yd" aria-label="Next year">${ic(P.down)}</button></div>`;
$('#yu').onclick=()=>{H.y--;upd()};$('#yd').onclick=()=>{H.y++;upd()};
}else{pp.innerHTML='<p class="sub">All recorded expenses</p>'}
let start='',end='',label='Expense summary';
if(H.period==='month'){start=key(H.y,H.m)+'-01';end=key(H.y,H.m+1)+'-01';label=new Date(H.y,H.m,1).toLocaleDateString(undefined,{month:'long',year:'numeric'})}
if(H.period==='quarter'){const m=H.quarter*3;start=key(H.y,m)+'-01';end=key(H.y,m+3)+'-01';label=`Q${H.quarter+1} ${H.y}`}
if(H.period==='year'){start=key(H.y,0)+'-01';end=key(H.y+1,0)+'-01';label=String(H.y)}
const periodData=S.ex.filter(e=>H.period==='summary'||(e.date>=start&&e.date<end));
$('#tot').innerHTML=`Spent ${H.period==='summary'?'in total':'in '+esc(label)}<b>${money(sum(periodData))}</b><span>${periodData.length} expense${periodData.length===1?'':'s'}</span>`;
const q=H.q.toLowerCase(),mn=parseFloat(H.min),mx=parseFloat(H.max);
const L=periodData.filter(e=>(!H.cat||e.cat===H.cat)&&(!q||(e.desc+' '+e.cat).toLowerCase().includes(q))&&(isNaN(mn)||e.amount>=mn)&&(isNaN(mx)||e.amount<=mx)).sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
$('#ls').innerHTML=L.length?L.map(e=>`<li><button data-id="${e.id}"><span>${e.desc?esc(e.desc)+'<span class="tag">'+esc(e.cat)+'</span>':'<span class="tag" style="margin-left:0">'+esc(e.cat)+'</span>'}</span><span class="a">${money(e.amount)}</span><span class="d">${fd(e.date)}</span></button></li>`).join(''):`<li class="empty">${!periodData.length?(S.ex.length?'No expenses in this period.':'No expenses yet. Add your first one from the Add tab.'):'No expenses match these filters.'}</li>`;
$('#ls').querySelectorAll('button').forEach(b=>b.onclick=()=>openE(b.dataset.id));
const modes=$('#chartModes'),second=H.period==='month'?'day':'month';
modes.innerHTML=`<button data-view="cat" class="${H.view==='cat'?'on':''}">By category</button><button data-view="${second}" class="${H.view===second?'on':''}">${second==='day'?'By day':'By month'}</button>`;
chart(periodData)}
function chart(a){const c=$('#ch');if(!a.length){c.innerHTML='<div class="empty">No expenses in this period.</div>';return}
if(H.view==='cat'){const t=sum(a),g={};a.forEach(e=>g[e.cat]=(g[e.cat]||0)+e.amount);
c.innerHTML=Object.entries(g).sort((x,y)=>y[1]-x[1]).map(([k,v])=>`<div class="cb"><span>${esc(k)}</span><div class="bar"><i style="width:${v/t*100}%"></i></div><span>${money(v)} · ${Math.round(v/t*100)}%</span></div>`).join('');return}
let labels=[],values=[],names=[];
if(H.period==='month'){
const n=new Date(H.y,H.m+1,0).getDate(),d=Array(n).fill(0);a.forEach(e=>d[+e.date.slice(8)-1]+=e.amount);
labels=d.map((_,i)=>String(i+1));values=d;names=d.map((_,i)=>`${MN[H.m]} ${i+1}`)}
else{const g={};a.forEach(e=>{const k=e.date.slice(0,7);g[k]=(g[k]||0)+e.amount});
const keys=Object.keys(g).sort();labels=keys.map(k=>{const [y,m]=k.split('-');return H.period==='summary'?`${MN[+m-1]} '${y.slice(-2)}`:MN[+m-1]});
values=keys.map(k=>g[k]);names=keys.map(k=>{const [y,m]=k.split('-');return `${MN[+m-1]} ${y}`})}
const max=Math.max(...values),bw=660/values.length,stride=Math.max(1,Math.ceil(values.length/10));
let s=`<svg viewBox="0 0 700 230" role="img" aria-label="Spending ${H.period==='month'?'by day':'by month'}"><line x1="30" y1="190" x2="690" y2="190" stroke="var(--ln)"/>`;
values.forEach((v,i)=>{const h=v/max*160,x=30+i*bw;s+=`<rect x="${x+bw*.15}" y="${190-h}" width="${Math.max(1,bw*.7)}" height="${h}" rx="3" fill="var(--ac)"><title>${esc(names[i])}: ${money(v)}</title></rect>`;
if(i%stride===0)s+=`<text x="${x+bw/2}" y="210" text-anchor="middle" font-size="12" fill="var(--mut)">${esc(labels[i])}</text>`});
s+=`<text x="30" y="16" font-size="12" fill="var(--mut)">Peak ${H.period==='month'?'day':'month'}: ${money(max)}</text></svg>`;c.innerHTML=s}
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
function budg(){const y=now.getFullYear(),k=key(y,now.getMonth()),m=S.ex.filter(e=>e.date.startsWith(k)),tot=sum(m),months=S.bud.months,annual=Number(S.bud.annual)||0;
const row=(name,spent,lim,inp)=>{const left=lim-spent,p=lim?Math.min(100,spent/lim*100):0;
return `<div class="bud"><div class="h"><span>${esc(name)}</span><span>${money(spent)}${lim?' of '+money(lim):''}</span></div>${inp}${lim?`<div class="bar ${left<0?'over':''}"><i style="width:${p}%"></i></div><small>${left>=0?money(left)+' remaining':money(-left)+' over budget'}</small>`:'<small>No limit set</small>'}</div>`};
const annualShown=annual||Object.keys(months).reduce((t,m)=>m.startsWith(String(y)+'-')?t+(Number(months[m])||0):t,0);
$('#app').innerHTML=`<h1>Budget</h1><p style="color:var(--mut);margin-top:-8px">For ${MN[now.getMonth()]} ${y}</p>
<div class="card"><label class="f" for="ba">Annual budget</label><div class="step lg"><span class="cur">${esc(sym())}</span><input id="ba" type="number" min="0" step="any" inputmode="decimal" placeholder="0" aria-label="Annual budget in ${esc(S.cur)}" value="${annualShown||''}"></div>
<p class="annual-result" id="annualResult"></p><div class="stats" id="bs" aria-live="polite"></div><div class="bar" id="bb"><i></i></div><p class="bmsg" id="bm"></p></div>
<h2>Monthly budgets</h2><p class="sub">Set an annual budget to divide it equally, or enter monthly amounts individually.</p>
<div class="card"><div class="month-budgets">${Array.from({length:12},(_,i)=>{const mk=key(y,i),v=Number(months[mk])||0,n=new Date(y,i,1).toLocaleDateString(undefined,{month:'long'}),spent=sum(S.ex.filter(e=>e.date.startsWith(mk)));return `<div class="month-budget"><label for="mb${i}">${n}</label><input id="mb${i}" type="number" min="0" step="any" inputmode="decimal" placeholder="No limit" aria-label="${n} budget in ${esc(S.cur)}" data-month="${mk}" value="${v||''}"><small>Spent: ${money(spent)}</small></div>`}).join('')}</div></div>
<h2>Category budgets <span style="font-weight:400;color:var(--mut);font-size:14px">(optional)</span></h2>
<div class="card">${S.cats.map((c,i)=>{const L=S.bud.cats[c]||0;return row(c,sum(m.filter(e=>e.cat===c)),L,`<div class="in"><input type="number" min="0" placeholder="Set budget" aria-label="${esc(c)} budget" data-c="${i}" value="${L||''}"></div>`)}).join('')}</div>`;
const monthlySum=()=>Object.keys(months).reduce((t,mk)=>mk.startsWith(String(y)+'-')?t+(Number(months[mk])||0):t,0);
const bstat=()=>{const T=Number(months[k])||0,left=T-tot,over=T&&left<0,p=T?Math.min(100,tot/T*100):0,annualTotal=Number(S.bud.annual)||monthlySum();
$('#bs').innerHTML=`<div><span>Limit</span><b>${T?money(T):'Not set'}</b></div><div><span>Spent</span><b>${money(tot)}</b></div><div><span>${over?'Over by':'Remaining'}</span><b class="${over?'neg':''}">${T?money(Math.abs(left)):'—'}</b></div>`;
$('#annualResult').textContent=`${Number(S.bud.annual)?'Annual budget':'Calculated annual budget'}: ${money(annualTotal)} · Average monthly budget: ${money(annualTotal/12)}`;
$('#bb').className='bar'+(over?' over':'');$('#bb').firstElementChild.style.width=p+'%';$('#bm').textContent=T?Math.round(tot/T*100)+'% of this month’s budget used.':'Set a monthly budget to see how much you have left.'};
const ba=$('#ba');
ba.oninput=()=>{const raw=ba.value.trim();if(!raw){S.bud.annual=0;save();bstat();return}
const v=Number(raw);if(!Number.isFinite(v)||v<0)return;
S.bud.annual=Math.round(v*100)/100;const share=Math.round((S.bud.annual/12)*1000000)/1000000;
for(let i=0;i<12;i++){const mk=key(y,i);if(share)months[mk]=share;else delete months[mk];const input=$(`[data-month="${mk}"]`);if(input)input.value=share||''}
S.bud.total=Number(months[k])||0;save();bstat()};
document.querySelectorAll('[data-month]').forEach(i=>i.oninput=()=>{const v=Number(i.value);S.bud.annual=0;if(Number.isFinite(v)&&v>0)months[i.dataset.month]=v;else delete months[i.dataset.month];
S.bud.total=Number(months[k])||0;save();ba.value=monthlySum()||'';bstat()});bstat();
document.querySelectorAll('[data-c]').forEach(i=>i.onchange=e=>{const c=S.cats[+i.dataset.c],v=Math.max(0,parseFloat(e.target.value)||0);if(v)S.bud.cats[c]=v;else delete S.bud.cats[c];save();budg()})}

/* SETTINGS */
const TH=[['dark','Dark',P.moon],['light','Light',P.sun],['system','System',P.monitor]];
function prefs(){$('#app').innerHTML=`<h1>Settings</h1><div class="card"><fieldset style="border:0;padding:0;margin:0"><legend class="f">Theme</legend><div class="chips">${TH.map(([v,l,p])=>`<label class="chip"><input type="radio" name="th" value="${v}" ${S.theme===v?'checked':''}><span>${ic(p)}${l}</span></label>`).join('')}</div><small id="themeNote" class="theme-note" ${S.theme==='system'?'':'hidden'}>System follows your device’s light or dark settings</small></fieldset></div><div style="height:var(--s4)"></div><div class="card"><label class="f" for="cu">Currency</label><select id="cu">${CURS.map(c=>`<option ${c===S.cur?'selected':''}>${c}</option>`).join('')}</select></div>
<h2>Categories</h2><div class="card" id="cl">${S.cats.map((c,i)=>`<div class="cat-row"><input value="${esc(c)}" data-i="${i}" aria-label="Category name" maxlength="24">${c==='Other'?'':`<button class="btn del" data-d="${i}" aria-label="Delete ${esc(c)}">Delete</button>`}</div>`).join('')}
<div class="cat-row" style="margin-top:14px"><input id="nc" placeholder="New category name" maxlength="24"><button class="btn" id="na">Add</button></div>
<small style="color:var(--mut)">Renaming updates past expenses. Deleting a category moves its expenses to Other.</small></div>`;
document.querySelectorAll('[name=th]').forEach(r=>r.onchange=()=>{const R=document.documentElement;if(!matchMedia('(prefers-reduced-motion:reduce)').matches){R.classList.add('tt');setTimeout(()=>R.classList.remove('tt'),400)}S.theme=r.value;applyTheme();$('#themeNote').hidden=S.theme!=='system';save();toast('Theme: '+TH.find(t=>t[0]===r.value)[1])});
$('#cu').onchange=e=>{S.cur=e.target.value;save();toast('Currency set to '+S.cur)};
document.querySelectorAll('[data-i]').forEach(i=>i.onchange=()=>{const o=S.cats[+i.dataset.i],n=i.value.trim();if(!n||(S.cats.includes(n)&&n!==o)){toast('Use a unique, non-empty name');prefs();return}
if(o==='Other'&&n!=='Other'){toast('“Other” can’t be renamed');prefs();return}
S.cats[+i.dataset.i]=n;S.ex.forEach(e=>{if(e.cat===o)e.cat=n});if(S.bud.cats[o]){S.bud.cats[n]=S.bud.cats[o];delete S.bud.cats[o]}save();toast('Category renamed')});
document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const c=S.cats[+b.dataset.d];if(!confirm('Delete “'+c+'”? Its expenses move to Other.'))return;
if(!S.cats.includes('Other'))S.cats.push('Other');S.ex.forEach(e=>{if(e.cat===c)e.cat='Other'});delete S.bud.cats[c];S.cats=S.cats.filter(x=>x!==c);save();prefs()});
$('#na').onclick=()=>{const n=$('#nc').value.trim();if(!n||S.cats.includes(n)){toast('Use a unique, non-empty name');return}S.cats.splice(Math.max(0,S.cats.indexOf('Other')),0,n);save();prefs()}}
$('.logo i').innerHTML=ic(P.coin);
$('nav').innerHTML=[['add','Add',P.plus],['history','History',P.hist],['budget','Budget',P.wallet],['prefs','Settings',P.sliders]].map(([r,l,p])=>`<a href="#${r}" data-r="${r}">${ic(p)}<span>${l}</span></a>`).join('');
const signOutBtn=document.createElement('button');signOutBtn.type='button';signOutBtn.textContent='Sign out';signOutBtn.className='btn ghost';signOutBtn.style.cssText='padding:6px 10px;font-size:12px;display:none';signOutBtn.onclick=async()=>{if(sb){const {error}=await sb.auth.signOut();if(error)toast(error.message)}};document.querySelector('header').appendChild(signOutBtn);
boot();
