(()=>{'use strict';
const total=12,key='twiice-site-stars-v2',reduced=matchMedia('(prefers-reduced-motion:reduce)');
let saved=[];try{saved=JSON.parse(sessionStorage.getItem(key))??[]}catch{}
const collected=new Set(Array.isArray(saved)?saved.filter(n=>Number.isInteger(n)&&n>=0&&n<total):[]);
const paths=["M46.33 4.0 L48.53 5.83 L51.83 17.2 L56.96 31.12 L59.9 30.76 L87.75 21.96 L89.59 21.96 L89.59 23.06 L63.93 51.28 L63.93 53.85 L67.59 65.58 L70.53 72.54 L73.09 80.97 L73.09 82.8 L69.43 82.07 L52.93 71.81 L47.8 69.61 L30.57 88.3 L30.57 89.04 L27.27 91.97 L27.27 92.7 L23.98 96.0 L23.24 96.0 L23.24 93.8 L31.67 59.71 L23.61 54.58 L18.11 52.02 L14.81 49.45 L11.88 48.35 L10.41 47.25 L10.41 46.15 L32.41 39.55 L37.54 37.35 L44.87 6.93 Z", "M61.17 7.41 L63.06 7.79 L61.55 33.15 L61.93 37.32 L93.73 40.35 L95.62 40.72 L96.0 41.86 L69.5 55.11 L68.36 55.11 L67.98 55.87 L66.85 55.87 L59.65 60.03 L58.52 70.63 L58.52 80.1 L57.0 92.59 L55.11 92.21 L53.6 90.7 L49.43 84.26 L46.02 80.86 L41.86 74.42 L38.45 70.63 L36.56 70.63 L8.54 84.64 L4.0 86.16 L6.65 81.23 L25.96 55.49 L25.2 52.84 L17.63 43.75 L16.87 41.86 L11.95 36.18 L10.81 33.91 L11.57 33.15 L13.84 33.15 L33.53 35.42 L40.72 35.42 Z"];
const counter=document.createElement('div');counter.id='counter';counter.setAttribute('role','status');counter.setAttribute('aria-live','polite');counter.setAttribute('aria-atomic','true');counter.innerHTML=`<svg class="counter-star" viewBox="0 0 100 100" aria-hidden="true"><path d="${paths[0]}"/></svg><span id="count">0</span><span class="slash">/</span><span>${total}</span><span class="counter-caption">STELLE TROVATE</span>`;document.body.append(counter);
const canvas=document.createElement('canvas');canvas.id='trails';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);const ctx=canvas.getContext('2d');
let flights=[],raf=0,displayed=collected.size;
function update(){counter.querySelector('#count').textContent=displayed;counter.setAttribute('aria-label',`${displayed} ${displayed===1?'stella raccolta':'stelle raccolte'} su ${total}${displayed===total?'. Hai esplorato tutto il nostro universo!':''}`);counter.classList.remove('pulse');void counter.offsetWidth;counter.classList.add('pulse')}
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
resize();addEventListener('resize',resize);
function finish(){displayed++;update();checkCompletion()}
function position(f,t){const box=counter.getBoundingClientRect();return {x:f.x+(box.left+23-f.x)*t*t,y:f.y+(box.top+20-f.y)*t}}
function draw(now){ctx.clearRect(0,0,innerWidth,innerHeight);const style=getComputedStyle(document.body),rgb=style.getPropertyValue('--brand-glow-rgb').trim()||'194,253,199',color=style.getPropertyValue('--brand-accent').trim()||'#C2FDC7';flights=flights.filter(f=>{const t=Math.min(1,(now-f.start)/850);if(t===1){finish();return false}for(let i=10;i>0;i--){const a=position(f,Math.max(0,t-i*.009)),b=position(f,Math.max(0,t-(i-1)*.009));ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineWidth=1+(10-i)*.15;ctx.strokeStyle=`rgba(${rgb},${(1-i/11)*.65})`;ctx.lineCap='round';ctx.stroke()}const dot=position(f,t);ctx.beginPath();ctx.arc(dot.x,dot.y,2.5,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();return true});raf=flights.length?requestAnimationFrame(draw):0}
function collect(id,button){if(!document.body.classList.contains('night')||collected.has(id))return;const box=button.getBoundingClientRect();collected.add(id);try{sessionStorage.setItem(key,JSON.stringify([...collected]))}catch{}button.disabled=true;button.classList.add('collected');if(reduced.matches){finish();return}flights.push({x:box.left+box.width/2,y:box.top+box.height/2,start:performance.now()});if(!raf)raf=requestAnimationFrame(draw)}
const projectId=new URLSearchParams(location.search).get('id');const projectIds=['astrocane','engineering-2k','coreve','twiice'];const placements=[];
if(document.querySelector('#sky'))placements.push(
{id:0,host:'#persone',x:'94%',y:'16%',angle:-12},
{id:6,host:'#universo',x:'92%',y:'70%',angle:18},
{id:7,host:'#progetti',x:'96%',y:'15%',angle:-18},
{id:8,host:'#contatto',x:'4%',y:'76%',angle:10});
else if(document.querySelector('#catalog-rows'))placements.push(
{id:1,host:'.catalog-content',x:'95%',y:'23%',angle:14},
{id:9,host:'.catalog-content',x:'3%',y:'72%',angle:-16});
else if(document.querySelector('.detail-story')&&projectIds.includes(projectId)){
placements.push({id:2+projectIds.indexOf(projectId),host:'.detail-story',x:'95%',y:'32%',angle:-9});
if(projectId==='astrocane')placements.push({id:10,host:'.detail-gallery',x:'4%',y:'64%',angle:15});
if(projectId==='coreve')placements.push({id:11,host:'.detail-gallery',x:'96%',y:'65%',angle:-14});
}
for(const placement of placements){const host=document.querySelector(placement.host);if(!host)continue;host.classList.add('site-star-host');const b=document.createElement('button');b.type='button';b.dataset.starId=String(placement.id);b.className='star site-star';b.style.cssText=`left:clamp(30px,${placement.x},calc(100% - 30px));top:${placement.y};--angle:${placement.angle}deg`;b.setAttribute('aria-label',`Raccogli la stella ${placement.id+1} di ${total}`);b.innerHTML=`<svg viewBox="0 0 100 100" aria-hidden="true"><path class="fill" d="${paths[placement.id%paths.length]}"/></svg>`;if(collected.has(placement.id)){b.disabled=true;b.classList.add('collected')}b.addEventListener('click',()=>collect(placement.id,b));host.append(b)}
function syncTheme(){const night=document.body.classList.contains('night');counter.hidden=!night;counter.setAttribute('aria-hidden',String(!night));document.querySelectorAll('.site-star').forEach(b=>{b.hidden=!night});if(!night&&flights.length){displayed+=flights.length;flights=[];cancelAnimationFrame(raf);raf=0;ctx.clearRect(0,0,innerWidth,innerHeight);update()}}
new MutationObserver(syncTheme).observe(document.body,{attributes:true,attributeFilter:['class']});reduced.addEventListener('change',()=>{if(reduced.matches&&flights.length){displayed+=flights.length;flights=[];cancelAnimationFrame(raf);raf=0;ctx.clearRect(0,0,innerWidth,innerHeight);update()}});
addEventListener('pageshow',()=>{try{const current=JSON.parse(sessionStorage.getItem(key))??[];if(Array.isArray(current)){collected.clear();current.filter(n=>Number.isInteger(n)&&n>=0&&n<total).forEach(n=>collected.add(n))}}catch{}flights=[];cancelAnimationFrame(raf);raf=0;displayed=collected.size;document.querySelectorAll('.site-star').forEach(b=>{const found=collected.has(Number(b.dataset.starId));b.disabled=found;b.classList.toggle('collected',found)});update();syncTheme();checkCompletion()});

/* Finale: collected stars leave the counter, converge, then open a tunnel. */
const finaleKey='twiice-portal-seen-v1';
let portalRunning=false;
function checkCompletion(){
 let seen=false;try{seen=sessionStorage.getItem(finaleKey)==='true'}catch{}
 if(displayed===total&&!seen&&document.body.classList.contains('night'))openPortal();
}
async function openPortal(){
 if(portalRunning)return;
 portalRunning=true;
 const source=counter.getBoundingClientRect();
 const dialog=document.createElement('dialog');
 dialog.className='dimension-portal';
 dialog.setAttribute('aria-label','Portale dimensionale: hai raccolto tutte le stelle');
 dialog.innerHTML='<canvas aria-hidden="true"></canvas><div class="portal-convergence" aria-hidden="true"></div><div class="portal-flash" aria-hidden="true"></div><button class="portal-close" type="button" aria-label="Chiudi il portale">×</button><span class="sr-only" role="status">Tutte le stelle si riuniscono. Entriamo in un nuovo universo.</span>';
 document.body.append(dialog);
 const previousOverflow=document.body.style.overflow;
 document.body.style.overflow='hidden';
 dialog.showModal();
 let stopped=false,frame=0;
 const animations=[],timers=new Set();
 function pause(ms){return new Promise(resolve=>{const id=setTimeout(()=>{timers.delete(id);resolve()},ms);timers.add(id)})}
 function close(){
  if(stopped)return;stopped=true;
  cancelAnimationFrame(frame);
  animations.forEach(animation=>animation.cancel());
  for(const timer of timers)clearTimeout(timer);
  document.body.style.overflow=previousOverflow;
  if(dialog.open)dialog.close();
  dialog.remove();portalRunning=false;
 }
 dialog.querySelector('button').addEventListener('click',close);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
 try{sessionStorage.setItem(finaleKey,'true')}catch{}
 const surface=dialog.querySelector('canvas'),paint=surface.getContext('2d');
 let width=innerWidth,height=innerHeight;
 function fit(){
  width=innerWidth;height=innerHeight;
  const dpr=Math.min(devicePixelRatio||1,2);
  surface.width=width*dpr;surface.height=height*dpr;
  surface.style.width=width+'px';surface.style.height=height+'px';
  paint.setTransform(dpr,0,0,dpr,0,0);
 }
 fit();
 const onResize=()=>fit();addEventListener('resize',onResize);
 dialog.addEventListener('close',()=>removeEventListener('resize',onResize),{once:true});
 if(reduced.matches){
  dialog.classList.add('portal-still');
  await pause(2200);if(!stopped)close();return;
 }
 const center=dialog.querySelector('.portal-convergence');
 for(let i=0;i<total;i++){
  const star=document.createElement('span');star.className='portal-traveler';
  star.innerHTML='<svg viewBox="0 0 100 100"><path d="'+paths[i%paths.length]+'"/></svg>';
  dialog.append(star);
  const angle=i/total*Math.PI*2,radius=Math.min(width,height)*.11;
  const x=Math.cos(angle)*radius,y=Math.sin(angle)*radius;
  star.style.left=width/2+'px';star.style.top=height/2+'px';
  const animation=star.animate([
   {transform:'translate('+ (source.left+23-width/2)+'px,'+(source.top+20-height/2)+'px) scale(.35) rotate(-35deg)',opacity:0},
   {offset:.12,opacity:1},
   {transform:'translate('+x+'px,'+y+'px) scale(1) rotate('+i*30+'deg)',opacity:1}
  ],{duration:1050,delay:i*145,easing:'cubic-bezier(.18,.7,.25,1)',fill:'both'});
  animations.push(animation);
 }
 await pause(total*145+1050);
 if(stopped)return;
 center.classList.add('is-charged');
 for(const star of dialog.querySelectorAll('.portal-traveler')){
  animations.push(star.animate([{transform:getComputedStyle(star).transform,opacity:1},{transform:'translate(0,0) scale(.08) rotate(540deg)',opacity:0}],{duration:650,easing:'cubic-bezier(.7,0,1,1)',fill:'forwards'}));
 }
 await pause(580);if(stopped)return;
 dialog.classList.add('portal-enter');
 const start=performance.now(),duration=3900;
 const motes=Array.from({length:130},(_,i)=>({angle:i*2.399963,depth:(i*.618034)%1,radius:.25+(i%13)/17}));
 function tunnel(now){
  if(stopped)return;
  const elapsed=now-start,t=Math.min(1,elapsed/duration),speed=.14+t*.68;
  paint.fillStyle='#070c24';paint.fillRect(0,0,width,height);
  paint.save();paint.translate(width/2,height/2);paint.rotate(t*t*1.9);
  const size=Math.hypot(width,height)*.65;
  const glow=paint.createRadialGradient(0,0,0,0,0,size);
  glow.addColorStop(0,'#eefefb');glow.addColorStop(.035,'#c2fdc7');glow.addColorStop(.16,'#4666b8');glow.addColorStop(.5,'#152357');glow.addColorStop(1,'#070c24');
  paint.fillStyle=glow;paint.fillRect(-size,-size,size*2,size*2);
  for(let i=0;i<26;i++){
   const z=((i/26+elapsed*.00022*speed)%1),r=9/(1.03-z);
   const radius=r*size*.037;
   paint.beginPath();
   for(let j=0;j<=100;j++){
    const angle=j/100*Math.PI*2;
    const ripple=1+.07*Math.sin(angle*5+i*.5+elapsed*.001);
    const x=Math.cos(angle)*radius*ripple,y=Math.sin(angle)*radius*ripple*.74;
    if(j===0)paint.moveTo(x,y);else paint.lineTo(x,y);
   }
   paint.closePath();paint.strokeStyle='rgba('+(i%3?'194,253,199':'144,202,240')+','+(Math.sin(z*Math.PI)*.7)+')';
   paint.lineWidth=1+z*3;paint.shadowColor='#c2fdc7';paint.shadowBlur=12;paint.stroke();
  }
  paint.shadowBlur=0;
  for(const mote of motes){
   const z=(mote.depth+elapsed*.00022*speed)%1;
   const r=(1/(1.04-z)-.96)*size*.09*mote.radius;
   const a=mote.angle+t*.35;
   paint.beginPath();paint.moveTo(Math.cos(a)*r,Math.sin(a)*r);
   paint.lineTo(Math.cos(a)*r*(1.03+t*.2),Math.sin(a)*r*(1.03+t*.2));
   paint.strokeStyle='rgba(234,255,244,'+z+')';paint.lineWidth=.5+z;paint.stroke();
  }
  paint.restore();
  if(t<1)frame=requestAnimationFrame(tunnel);
  else{dialog.classList.add('portal-exit');pause(800).then(()=>{if(!stopped)close()})}
 }
 frame=requestAnimationFrame(tunnel);
}
const previewPortal=new URLSearchParams(location.search).get('preview')==='portal';
if(previewPortal){
 const preview=document.createElement('button');preview.type='button';preview.className='portal-preview';
 preview.textContent='Prova il finale ✦';
 preview.addEventListener('click',openPortal);document.body.append(preview);
}

window.TwiiceStars={read:()=>[...collected]};update();syncTheme();

/* Keep the fixed counter above the footer, including when page height changes. */
const footer=document.querySelector('.site-footer,.portfolio-footer,footer');
if(footer){
 counter.style.translate='0 calc(-1px * var(--footer-overlap, 0))';
 let footerFrame=0;
 function clearFooter(){footerFrame=0;counter.style.setProperty('--footer-overlap',String(Math.max(0,innerHeight-footer.getBoundingClientRect().top)))}
 function scheduleFooter(){if(!footerFrame)footerFrame=requestAnimationFrame(clearFooter)}
 addEventListener('scroll',scheduleFooter,{passive:true});
 addEventListener('resize',scheduleFooter);
 addEventListener('pageshow',scheduleFooter);
 if(typeof ResizeObserver!=='undefined'){const footerResize=new ResizeObserver(scheduleFooter);footerResize.observe(document.body);footerResize.observe(footer)}
 clearFooter();
}

/* Find empty background space; never place collectibles over content or controls. */
let placementFrame=0;
function placeOnBackground(){
 placementFrame=0;
 for(const placement of placements){
  const host=document.querySelector(placement.host),button=host?.querySelector('[data-star-id="'+placement.id+'"]');
  if(!button)continue;
  const area=host.getBoundingClientRect(),half=22,pad=8;
  const obstacles=[...host.querySelectorAll('img,video,iframe,button,a,input,textarea,select,summary,h1,h2,h3,p,label,legend,.tc-poster,.tc-slide,.motion-world,.original-badge')]
   .filter(el=>!el.closest('.site-star,.backdrop')&&el.getClientRects().length)
   .map(el=>el.getBoundingClientRect()).filter(r=>r.width&&r.height);
  const preferredX=area.width*parseFloat(placement.x)/100,preferredY=area.height*parseFloat(placement.y)/100;
  const xs=[preferredX,30,area.width-30,area.width*.04,area.width*.96];
  let found=null;
  for(let distance=0;distance<=area.height&&!found;distance+=56){
   for(const y of distance?[preferredY-distance,preferredY+distance]:[preferredY]){
    if(y<half+pad||y>area.height-half-pad)continue;
    for(const x of xs){
     if(x<half||x>area.width-half)continue;
     const box={left:area.left+x-half-pad,right:area.left+x+half+pad,top:area.top+y-half-pad,bottom:area.top+y+half+pad};
     if(obstacles.every(r=>box.right<=r.left||box.left>=r.right||box.bottom<=r.top||box.top>=r.bottom)){found={x,y};break}
    }
    if(found)break;
   }
  }
  button.style.visibility=found?'':'hidden';
  if(found){button.style.left=found.x+'px';button.style.top=found.y+'px'}
 }
}
function schedulePlacement(){if(!placementFrame)placementFrame=requestAnimationFrame(placeOnBackground)}
addEventListener('resize',schedulePlacement);
addEventListener('pageshow',schedulePlacement);
document.addEventListener('load',schedulePlacement,true);
new MutationObserver(schedulePlacement).observe(document.querySelector('main')||document.body,{childList:true,subtree:true});
if(typeof ResizeObserver!=='undefined'){const layoutObserver=new ResizeObserver(schedulePlacement);for(const p of placements){const host=document.querySelector(p.host);if(host)layoutObserver.observe(host)}}
document.fonts?.ready.then(schedulePlacement);
schedulePlacement();
})();