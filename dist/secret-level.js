/* Eight collected stars merge into light, then enter the existing Little Star game. */
(()=>{
'use strict';
const scriptUrl=document.currentScript.src;
const key='twiice-little-star-unlocked-v1',game=new URL('wonder/',scriptUrl).href;
const previewGame=new URL('little-star/',scriptUrl).href;
const total=8,reduced=matchMedia('(prefers-reduced-motion: reduce)');
const previewPortal=new URLSearchParams(location.search).get('preview')==='portal';
const paths=["M46.33 4.0 L48.53 5.83 L51.83 17.2 L56.96 31.12 L59.9 30.76 L87.75 21.96 L89.59 21.96 L89.59 23.06 L63.93 51.28 L63.93 53.85 L67.59 65.58 L70.53 72.54 L73.09 80.97 L73.09 82.8 L69.43 82.07 L52.93 71.81 L47.8 69.61 L30.57 88.3 L30.57 89.04 L27.27 91.97 L27.27 92.7 L23.98 96.0 L23.24 96.0 L23.24 93.8 L31.67 59.71 L23.61 54.58 L18.11 52.02 L14.81 49.45 L11.88 48.35 L10.41 47.25 L10.41 46.15 L32.41 39.55 L37.54 37.35 L44.87 6.93 Z", "M61.17 7.41 L63.06 7.79 L61.55 33.15 L61.93 37.32 L93.73 40.35 L95.62 40.72 L96.0 41.86 L69.5 55.11 L68.36 55.11 L67.98 55.87 L66.85 55.87 L59.65 60.03 L58.52 70.63 L58.52 80.1 L57.0 92.59 L55.11 92.21 L53.6 90.7 L49.43 84.26 L46.02 80.86 L41.86 74.42 L38.45 70.63 L36.56 70.63 L8.54 84.64 L4.0 86.16 L6.65 81.23 L25.96 55.49 L25.2 52.84 L17.63 43.75 L16.87 41.86 L11.95 36.18 L10.81 33.91 L11.57 33.15 L13.84 33.15 L33.53 35.42 L40.72 35.42 Z"];
let unlocked=false,portalRunning=false,abortPortal=()=>{};
for(const storage of ['localStorage','sessionStorage']){try{unlocked=unlocked||window[storage].getItem(key)==='true'}catch{}}
const shortcut=document.createElement('a');shortcut.className='wonder-found';shortcut.href=game;shortcut.textContent='✦ WONDER FOUND';shortcut.setAttribute('aria-label','Wonder Found: gioca a Little Star');shortcut.hidden=!unlocked;document.body.append(shortcut);
function remember(){unlocked=true;shortcut.hidden=false;for(const storage of ['localStorage','sessionStorage']){try{window[storage].setItem(key,'true')}catch{}}}
async function openPortal(){
 if(portalRunning)return;
 portalRunning=true;
 const counter=document.querySelector('#counter');
 const source=counter.getBoundingClientRect();
 if(!previewPortal)remember();
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
 abortPortal=close;
 dialog.querySelector('button').addEventListener('click',close);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
 
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
  await pause(1800);if(!stopped){location.assign(previewPortal?previewGame:game)}return;
 }

 const center=dialog.querySelector('.portal-convergence');
 let charge=0;
 const arrivals=[];
 for(let i=0;i<total;i++){
  const star=document.createElement('span');star.className='portal-traveler';
  star.innerHTML='<svg viewBox="0 0 100 100"><path d="'+paths[i%paths.length]+'"/></svg>';
  dialog.append(star);
  star.style.left='50%';star.style.top='50%';
  const animation=star.animate([
   {transform:'translate('+(source.left+23-width/2)+'px,'+(source.top+20-height/2)+'px) scale(.4)',opacity:0},
   {offset:.08,opacity:1},
   {offset:.75,transform:'translate('+((source.left+23-width/2)*.13)+'px,'+((source.top+20-height/2)*.13)+'px) scale(.55)',opacity:1},
   {transform:'translate(0,0) scale(.18)',opacity:1}
  ],{duration:900,delay:i*230,easing:'cubic-bezier(.3,.1,.35,1)',fill:'both'});
  animations.push(animation);
  arrivals.push(animation.finished.then(()=>{
   if(stopped)return;
   charge++;
   center.style.setProperty('--charge',charge/total);
   center.style.opacity=String(.15+charge/total*.85);
   const pulse=center.animate([{scale:1},{scale:1.3},{scale:1}],{duration:220,easing:'ease-out'});
   animations.push(pulse);
  }).catch(()=>{}));
 }
 await Promise.all(arrivals);
 if(stopped)return;
 center.classList.add('is-charged');
 await pause(420);if(stopped)return;
 dialog.classList.add('portal-enter');
 const start=performance.now(),duration=3300;
 const rays=Array.from({length:190},(_,i)=>({
  angle:i*2.3999632297,depth:(i*.61803398875)%1,
  reach:.7+(i%11)/14,alpha:.65+(i%7)/20
 }));
 function tunnel(now){
  if(stopped)return;
  const t=Math.max(0,Math.min(1,(now-start)/duration));
  paint.fillStyle='#10205a';paint.fillRect(0,0,width,height);
  const cx=width/2,cy=height/2,limit=Math.hypot(width,height)*.72;
  const glow=paint.createRadialGradient(cx,cy,0,cx,cy,limit);
  glow.addColorStop(0,'#315cbc');glow.addColorStop(.2,'#1a3885');glow.addColorStop(1,'#10205a');
  paint.fillStyle=glow;paint.fillRect(0,0,width,height);
  const progress=t*.8+t*t*2.4;
  paint.lineCap='round';
  for(const ray of rays){
   const depth=(ray.depth+progress)%1;
   const near=Math.pow(depth,2.8);
   const radius=8+near*limit*ray.reach;
   const length=(12+near*limit*(.08+t*.23));
   const dx=Math.cos(ray.angle),dy=Math.sin(ray.angle);
   const tail=Math.max(1,radius-length);
   const x1=cx+dx*tail,y1=cy+dy*tail,x2=cx+dx*radius,y2=cy+dy*radius;
   const streak=paint.createLinearGradient(x1,y1,x2,y2);
   streak.addColorStop(0,'rgba(144,202,255,0)');
   streak.addColorStop(.65,'rgba(144,202,255,'+(depth*ray.alpha*.75)+')');
   streak.addColorStop(1,'rgba(237,248,255,'+(depth*ray.alpha)+')');
   paint.strokeStyle=streak;paint.lineWidth=.9+near*3.2;
   paint.beginPath();paint.moveTo(x1,y1);paint.lineTo(x2,y2);paint.stroke();
  }
  if(t<1)frame=requestAnimationFrame(tunnel);
  else{dialog.classList.add('portal-arrived');pause(300).then(()=>{if(!stopped){location.assign(previewPortal?previewGame:game)}})}
 }
 frame=requestAnimationFrame(tunnel);
}
function progress(count){if(count===total&&!unlocked&&!portalRunning)openPortal()}
document.addEventListener('twiice:stars-progress',event=>progress(event.detail.count));
progress(window.TwiiceStars?.read().length??0);
addEventListener('pageshow',()=>{
 for(const storage of ['localStorage','sessionStorage']){try{if(window[storage].getItem(key)==='true')unlocked=true}catch{}}
 shortcut.hidden=!unlocked;
});
addEventListener('pagehide',()=>abortPortal());
if(previewPortal){
 const preview=document.createElement('button');preview.type='button';preview.className='portal-preview';preview.textContent='Prova il finale ✦';
 preview.addEventListener('click',()=>{if(!document.body.classList.contains('night'))document.querySelector('#light,#portfolio-light')?.click();requestAnimationFrame(openPortal)});
 document.body.append(preview);
}
})();
