
'use strict';
const sky=document.querySelector('#sky'),light=document.querySelector('#light');
const storage={get(key,fallback){try{return JSON.parse(sessionStorage.getItem(key))??fallback}catch{return fallback}},set(key,value){try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}}};
function setNight(night){document.body.classList.toggle('night',night);document.querySelectorAll('img[data-brand-logo]').forEach(img=>img.src=night?'twiice-logo-hq-dark.svg':'twiice-logo-hq-day.svg');light.setAttribute('aria-pressed',String(night));document.querySelector('#light-label').textContent=night?'Accendi la luce':'Spegni la luce';storage.set('twiice-night',night);}
setNight(storage.get('twiice-night',false)===true);light.addEventListener('click',()=>setNight(!document.body.classList.contains('night')));
if(document.modelContext?.registerTool){const lifecycle=new AbortController();const tools=[{name:'read_twiice_sky',description:'Read TWIICE theme and collected stars across the site.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(){return {night:document.body.classList.contains('night'),logoVisible:true,collected:window.TwiiceStars?.read()??[]}}},{name:'set_twiice_light',description:'Set TWIICE to day or night.',inputSchema:{type:'object',properties:{night:{type:'boolean'}},required:['night'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(typeof input.night!=='boolean')throw Error('night must be boolean');setNight(input.night);return {night:input.night}}}];for(const tool of tools){try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}}addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
// Editorial navigation and a local-only brief composer.
document.querySelector('#year').textContent=String(new Date().getFullYear());
document.querySelectorAll('[data-interest]').forEach(link=>link.addEventListener('click',()=>{const choice=[...document.querySelectorAll('input[name="interest"]')].find(input=>input.value===link.dataset.interest);if(choice)choice.checked=true}));
const briefText=document.querySelector('#brief');
briefText.value=storage.get('twiice-brief','');
briefText.addEventListener('input',()=>storage.set('twiice-brief',briefText.value));
document.querySelector('#brief-form').addEventListener('submit',async event=>{event.preventDefault();const idea=briefText.value.trim();if(!idea){briefText.setCustomValidity('Scrivi qualche parola sulla tua idea.');briefText.reportValidity();return}briefText.setCustomValidity('');const interest=document.querySelector('input[name="interest"]:checked').value;const text=`Ciao TWIICE!\n\nVorrei esplorare: ${interest}.\n\nLa mia idea:\n${idea}`;const status=document.querySelector('#brief-status');try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(text);status.textContent='Mini brief copiato. Puoi conservarlo o condividerlo.'}catch{status.textContent='Copia automatica non disponibile. Seleziona e copia il testo della tua idea.';briefText.focus();briefText.select()}});
briefText.addEventListener('input',()=>briefText.setCustomValidity(''));

// Reveal the compact wordmark only after the central artwork has left the viewport.
const compactWordmark=document.querySelector('header .edition');
const centralWordmark=document.querySelector('#reveal h1 img');
function syncCompactWordmark(){
  const box=centralWordmark.getBoundingClientRect();
  compactWordmark.hidden=box.bottom>0;
  document.querySelector(".home-header-nav").hidden=box.bottom>0;
}
if('IntersectionObserver' in window){
  const wordmarkObserver=new IntersectionObserver(()=>syncCompactWordmark(),{threshold:0});
  wordmarkObserver.observe(centralWordmark);
}else{
  addEventListener('scroll',syncCompactWordmark,{passive:true});
}
addEventListener('resize',syncCompactWordmark);
addEventListener('pageshow',syncCompactWordmark);
centralWordmark.addEventListener('load',syncCompactWordmark);
syncCompactWordmark();

// Fade content beneath the fixed header as it reaches the navigation controls.
const siteHeader=document.querySelector('#sky > header');
function syncHeaderSurface(){
  const skyBottom=sky.getBoundingClientRect().bottom;
  const controlsBottom=light.getBoundingClientRect().bottom;
  siteHeader.classList.toggle('header-over-content',skyBottom<=controlsBottom+20);
}
let headerFrame=0;
addEventListener('scroll',()=>{
  if(headerFrame)return;
  headerFrame=requestAnimationFrame(()=>{headerFrame=0;syncHeaderSurface()});
},{passive:true});
addEventListener('resize',syncHeaderSurface);
addEventListener('pageshow',syncHeaderSurface);
syncHeaderSurface();
