
'use strict';
const sky=document.querySelector('#sky'),light=document.querySelector('#light');
const storage={get(key,fallback){try{return JSON.parse(sessionStorage.getItem(key))??fallback}catch{return fallback}},set(key,value){try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}}};
function setNight(night){document.body.classList.toggle('night',night);document.querySelectorAll('img[data-brand-logo]').forEach(img=>img.src=night?'twiice-logo-hq-dark.svg':'twiice-logo-hq-day.svg');light.setAttribute('aria-pressed',String(night));document.querySelector('#light-label').textContent=night?'Accendi la luce':'Spegni la luce';storage.set('twiice-night',night);}
setNight(storage.get('twiice-night',false)===true);light.addEventListener('click',()=>setNight(!document.body.classList.contains('night')));
if(document.modelContext?.registerTool){const lifecycle=new AbortController();const tools=[{name:'read_twiice_sky',description:'Read TWIICE theme and collected stars across the site.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(){return {night:document.body.classList.contains('night'),logoVisible:true,collected:window.TwiiceStars?.read()??[]}}},{name:'set_twiice_light',description:'Set TWIICE to day or night.',inputSchema:{type:'object',properties:{night:{type:'boolean'}},required:['night'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(typeof input.night!=='boolean')throw Error('night must be boolean');setNight(input.night);return {night:input.night}}}];for(const tool of tools){try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}}addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
// Contact details are submitted only when the visitor sends the form.
document.querySelector('#year').textContent=String(new Date().getFullYear());
document.querySelectorAll('[data-interest]').forEach(link=>link.addEventListener('click',()=>{const choice=[...document.querySelectorAll('input[name="interest"]')].find(input=>input.value===link.dataset.interest);if(choice)choice.checked=true}));
const contactForm=document.querySelector('#brief-form'),attachmentList=document.querySelector('#attachment-list'),attachmentStatus=document.querySelector('#attachment-status'),addAttachment=document.querySelector('#add-attachment');
let attachmentSequence=1;
function validateAttachments(){
 const inputs=[...attachmentList.querySelectorAll('input[type="file"]')];let total=0,count=0,error='';
 inputs.forEach(input=>{input.setCustomValidity('');for(const file of input.files){count++;total+=file.size;if(!/\.(pdf|jpe?g|png|webp|gif|avif|heic|heif)$/i.test(file.name))error='Scegli un PDF o un’immagine JPG, PNG, WebP, GIF, AVIF o HEIC.'}});
 if(total>10000000)error='Gli allegati superano 10 MB complessivi. Riduci le dimensioni o rimuovi un file.';
 if(error)inputs[0]?.setCustomValidity(error);
 attachmentStatus.textContent=error||(count?`${count} ${count===1?'file selezionato':'file selezionati'} · ${(total/1000000).toLocaleString('it-IT',{maximumFractionDigits:2})} MB / 10 MB`:'');
 attachmentStatus.classList.toggle('has-error',Boolean(error));return !error;
}
attachmentList.addEventListener('change',validateAttachments);
attachmentList.addEventListener('click',event=>{const button=event.target.closest('.remove-attachment');if(!button)return;const slot=button.closest('.attachment-slot');if(attachmentList.children.length===1){slot.querySelector('input').value=''}else slot.remove();addAttachment.hidden=false;validateAttachments()});
addAttachment.addEventListener('click',()=>{attachmentSequence++;const slot=document.createElement('div');slot.className='attachment-slot';slot.innerHTML=`<label for="attachment-${attachmentSequence}" class="sr-only">Allegato ${attachmentSequence}</label><input id="attachment-${attachmentSequence}" type="file" name="attachment${attachmentSequence}" accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif" aria-describedby="attachment-hint attachment-status"><button class="remove-attachment" type="button" aria-label="Rimuovi allegato ${attachmentSequence}">×</button>`;attachmentList.append(slot);slot.querySelector('input').focus();if(attachmentList.children.length>=5)addAttachment.hidden=true});
contactForm.addEventListener('submit',event=>{if(!validateAttachments()){event.preventDefault();contactForm.reportValidity();return}const button=contactForm.querySelector('[type="submit"]');document.querySelector('#brief-status').textContent='Invio in corso…';button.disabled=true;button.firstChild.textContent='Invio in corso '});
addEventListener('pageshow',()=>{const button=contactForm.querySelector('[type="submit"]');button.disabled=false;button.firstChild.textContent='Invia la tua idea ';document.querySelector('#brief-status').textContent=''});

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

