(()=>{
'use strict';
const icons={home:'<path d="m3 10 9-7 9 7v10H15v-6H9v6H3Z"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',plus:'<path d="M12 4v16M4 12h16"/>',check:'<path d="m5 12 4 4L19 6"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',layers:'<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',left:'<path d="m15 5-7 7 7 7"/>',right:'<path d="m9 5 7 7-7 7"/>',play:'<path d="m7 4 14 8-14 8Z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5v14M16 5v14" stroke-width="4"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',arrow:'<path d="M5 19 19 5M5 5h14v14"/>',star:'<path d="m12 2 2.8 6.5L22 9l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9l7.2-.5Z"/>'};
const icon=name=>`<span class="tc-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.grid}</svg></span>`;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const categories=[
 {id:'brand',title:'Identità e comunicazione'},
 {id:'images',title:'Immagini e movimento'},
 {id:'web',title:'Esperienza e interazione'},
 {id:'tools',title:'AI tools'}
];
const projectCategories={
 'astrocane':'images','engineering-2k':'brand','coreve':'images','twiice':'web',
 'repo-ComfyUI-RPNodes':'tools','repo-gallery-dl-windows-gui':'images',
 'repo-yt-dlp-windows-gui':'images','repo-realtime-captions-system-audio-gui':'tools',
 'repo-batch-image-resizer':'images','repo-before-after-slider':'web',
 'repo-camera-motion-studio':'web','repo-chatbot_ZURU':'tools','repo-chatbot_semplice':'tools'
};
const studio=(window.TWIICE_PROJECTS||[]).map(p=>({...p,name:p.id,author:p.id==='twiice'?'TWIICE':'Nicole Piffer',type:'project',url:`progetto.html?id=${encodeURIComponent(p.id)}`,external:false}));
const projects=[...studio,...(window.TWIICE_REPOSITORIES||[])].map(p=>({...p,categories:[projectCategories[p.id]||'images']}));
const main=document.querySelector('#catalog-view');
const dialog=document.querySelector('#catalog-details');
const header=document.querySelector('.portfolio-header');
const light=document.querySelector('#portfolio-light');
let toastTimer,lastFocus,night=false;
let activeCategory='all',query='';
function loadList(key){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value.filter(x=>typeof x==='string'):[]}catch{return[]}}
function storeList(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{/* Browsing still works if storage is unavailable. */}}
const saved=new Set(loadList('twiice-catalog-saved'));
try{night=JSON.parse(sessionStorage.getItem('twiice-night'))===true}catch{}
function setTheme(value){night=value;document.body.classList.toggle('night',night);light.setAttribute('aria-pressed',String(night));document.querySelector('#portfolio-light-label').textContent=night?'Accendi la luce':'Spegni la luce';document.querySelectorAll('[data-brand-logo]').forEach(img=>img.src=night?'twiice-logo-hq-dark.svg':'twiice-logo-hq-day.svg');document.querySelector('meta[name="theme-color"]').content=night?'#10205A':'#F7F8FC';try{sessionStorage.setItem('twiice-night',JSON.stringify(night))}catch{}}
setTheme(night);light.addEventListener('click',()=>setTheme(!night));
function syncHeader(){header.classList.toggle('is-scrolled',scrollY>16)}
addEventListener('scroll',syncHeader,{passive:true});addEventListener('pageshow',()=>{try{setTheme(JSON.parse(sessionStorage.getItem('twiice-night'))===true)}catch{}syncHeader()});syncHeader();
function notify(message){const toast=document.querySelector('.tc-toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2600)}

function target(p){return p.external?' target="_blank" rel="noopener noreferrer"':''}
function actionLabel(p){return p.type==='repository'?'Apri repository':'Esplora il progetto'}
function projectTitle(p){return p.type==='repository'?p.name:p.title}
function saveButton(p){const selected=saved.has(p.id);return `<button type="button" class="tc-circle ${selected?'saved':''}" data-save="${esc(p.id)}" aria-label="${selected?'Rimuovi':'Aggiungi'} ${esc(p.title)} ${selected?'dalla':'alla'} mia lista" aria-pressed="${selected}">${icon(selected?'check':'plus')}</button>`}
function card(p){return `<article class="tc-card"><a class="tc-poster tc-art-${esc(p.imageClass)}" href="${esc(p.url)}"${target(p)} aria-label="${esc(actionLabel(p)+' '+projectTitle(p)+(p.external?' su GitHub (nuova scheda)':''))}"><img src="${esc(p.image)}" loading="lazy" decoding="async" alt="" width="640" height="360"></a><div class="tc-card-meta"><div class="tc-card-caption"><h2 class="tc-card-name"><a href="${esc(p.url)}"${target(p)}>${esc(projectTitle(p))}</a></h2><p>${esc(p.author)} · ${esc(p.kind)}</p></div><div class="tc-card-buttons">${saveButton(p)}<button type="button" class="tc-circle" data-info="${esc(p.id)}" aria-label="Informazioni su ${esc(p.title)}">${icon('info')}</button></div></div></article>`}
function filters(){return `<div class="tc-filters" role="group" aria-label="Filtra i progetti per categoria"><button type="button" class="tc-chip active" data-filter="all" aria-pressed="true" aria-controls="project-grid">Tutti i progetti</button>${categories.map(c=>`<button type="button" class="tc-chip" data-filter="${c.id}" aria-pressed="false" aria-controls="project-grid">${esc(c.title)}</button>`).join('')}</div>`}
function update(){
 const words=query.trim().toLocaleLowerCase('it').split(/\s+/).filter(Boolean);
 const items=projects.filter(p=>{
  const text=[p.name,p.title,p.subtitle,p.description,p.author,p.kind,...(p.tags||[]),...p.categories.map(id=>categories.find(c=>c.id===id)?.title)].join(' ').toLocaleLowerCase('it');
  return (activeCategory==='all'||p.categories.includes(activeCategory))&&words.every(word=>text.includes(word));
 });
 main.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===activeCategory;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 main.querySelector('.tc-result-count').textContent=`${items.length} ${items.length===1?'progetto':'progetti'}${words.length?(items.length===1?' trovato':' trovati'):''}`;
 main.querySelector('.tc-grid').innerHTML=items.length?items.map(card).join(''):`<div class="tc-empty"><h2>Nessun progetto trovato</h2><p>Prova un’altra parola o scegli una categoria diversa.</p><button type="button" class="tc-btn" data-reset>Mostra tutti i progetti</button></div>`;
 main.querySelector('.tc-search-clear').hidden=!query;
}
main.innerHTML=`<div class="tc-page"><div class="tc-page-head"><h1>Progetti</h1><p>Identità, immagini, esperienze e strumenti da esplorare.</p>${filters()}<div class="tc-search-field">${icon('search')}<label class="sr-only" for="tc-search">Cerca tra i progetti</label><input id="tc-search" type="search" autocomplete="off" placeholder="Cerca un progetto…" aria-controls="project-grid"><button type="button" class="tc-search-clear" aria-label="Cancella ricerca" hidden>${icon('close')}</button></div></div><p class="tc-result-count" role="status" aria-live="polite"></p><div class="tc-grid" id="project-grid" aria-label="Progetti"></div></div>`;
const input=main.querySelector('#tc-search');
input.addEventListener('input',()=>{query=input.value;update()});
main.addEventListener('click',e=>{
 const filter=e.target.closest('[data-filter]');if(filter){activeCategory=filter.dataset.filter;update()}
 if(e.target.closest('.tc-search-clear')){query=input.value='';update();input.focus({preventScroll:true})}
 if(e.target.closest('[data-reset]')){activeCategory='all';query=input.value='';update();main.querySelector('[data-filter=all]').focus({preventScroll:true})}
});
document.querySelector('[data-search]').addEventListener('click',()=>{input.focus({preventScroll:true});input.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});
// Old catalog hashes now resolve to this same grid; there are no separate views.
function clearLegacyHash(){if(location.hash&&location.hash!=='#catalog-view')history.replaceState(null,'',location.pathname+location.search)}
addEventListener('hashchange',clearLegacyHash);clearLegacyHash();
function showDetails(p){lastFocus=document.activeElement;const facts=p.type==='repository'?[['Repository',p.name],['Autore','raffaele-pet'],['Linguaggio principale',p.language],['Aggiornamento su GitHub',new Date(p.updated).toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})]]:[['Progetto',p.title],['Contesto',p.context],['Ambito',p.category],['Approfondimento','Scheda progetto e processo creativo']];dialog.innerHTML=`<div class="tc-detail-visual"><img src="${esc(p.image)}" alt=""><button type="button" class="tc-circle tc-close" aria-label="Chiudi informazioni">${icon('close')}</button></div><div class="tc-detail-body"><p class="tc-kicker">TWIICE / ${esc(p.author)}</p><h2 id="tc-detail-title">${esc(p.title)}</h2><div class="tc-detail-tags"><span>${esc(p.kind)}</span><span>${esc(p.categories.map(id=>categories.find(c=>c.id===id)?.title).join(' · '))}</span></div><div class="tc-actions"><a class="tc-btn" href="${esc(p.url)}" data-visit="${esc(p.id)}"${target(p)}>${icon('arrow')}${p.type==='repository'?'Apri su GitHub':'Apri la scheda progetto'}</a>${saveButton(p)}</div><p>${esc(p.description)}</p><dl class="tc-detail-facts">${facts.map(([key,value])=>`<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></div>`;dialog.showModal();document.body.style.overflow='hidden';dialog.dispatchEvent(new Event('catalog-open'));dialog.querySelector('.tc-close').addEventListener('click',()=>dialog.close())}
dialog.addEventListener('close',()=>{document.body.style.overflow='';if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true})});dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close()}});

document.addEventListener('click',e=>{
 const info=e.target.closest('[data-info]');if(info){const p=projects.find(p=>p.id===info.dataset.info);if(p)showDetails(p)}
 const button=e.target.closest('[data-save]');if(button){const id=button.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);storeList('twiice-catalog-saved',[...saved]);document.querySelectorAll('[data-save]').forEach(b=>{if(b.dataset.save!==id)return;const selected=saved.has(id),p=projects.find(p=>p.id===id);b.innerHTML=icon(selected?'check':'plus');b.classList.toggle('saved',selected);b.setAttribute('aria-pressed',String(selected));b.setAttribute('aria-label',`${selected?'Rimuovi':'Aggiungi'} ${p.title} ${selected?'dalla':'alla'} mia lista`)});notify(saved.has(id)?'Progetto aggiunto alla tua lista':'Progetto rimosso dalla tua lista')}
});
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon).replace('<span class="tc-icon">','').replace('</span>',''));
document.querySelector('.skip-link').addEventListener('click',e=>{e.preventDefault();main.focus();main.scrollIntoView({block:'start'})});
update();
})();
