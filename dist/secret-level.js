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
 
 function enterGame(){
  if(stopped)return;
  try{sessionStorage.setItem('twiice-portal-entry-v1','true')}catch{}
  location.assign(previewPortal?previewGame:game);
 }
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
  await pause(1800);if(!stopped){enterGame()}return;
 }


 // Match the collector: 850 ms flights, quadratic horizontal travel and ten trail segments.
 dialog.classList.add('portal-gathering');
 const launchX=source.left+23,launchY=source.top+20;
 const flightTime=850,stagger=130;
 const style=getComputedStyle(document.body);
 const rgb=style.getPropertyValue('--brand-glow-rgb').trim()||'194,253,199';
 const color=style.getPropertyValue('--brand-accent').trim()||'#C2FDC7';
 const launchTime=performance.now();
 function point(t){return {x:launchX+(width/2-launchX)*t*t,y:launchY+(height/2-launchY)*t}}
 await new Promise(resolve=>{
  function gather(now){
   if(stopped)return;
   paint.clearRect(0,0,width,height);
   let arrived=0;
   for(let star=0;star<total;star++){
    const age=now-launchTime-star*stagger;
    if(age<0)continue;
    const t=Math.max(0,Math.min(1,age/flightTime));
    if(t===1){arrived++;continue}
    for(let i=10;i>0;i--){
     const a=point(Math.max(0,t-i*.009)),b=point(Math.max(0,t-(i-1)*.009));
     paint.beginPath();paint.moveTo(a.x,a.y);paint.lineTo(b.x,b.y);
     paint.lineWidth=1+(10-i)*.15;paint.lineCap='round';
     paint.strokeStyle='rgba('+rgb+','+((1-i/11)*.65)+')';paint.stroke();
    }
    const dot=point(t);
    paint.beginPath();paint.arc(dot.x,dot.y,2.5,0,Math.PI*2);paint.fillStyle=color;paint.fill();
   }
   // Particles overlap at one fixed point; only their brightness adds up.
   paint.save();paint.globalCompositeOperation='lighter';
   for(let i=0;i<arrived;i++){
    paint.beginPath();paint.arc(width/2,height/2,2.5,0,Math.PI*2);
    paint.fillStyle='rgba('+rgb+',.4)';paint.fill();
   }
   paint.restore();
   if(arrived===total){resolve();return}
   frame=requestAnimationFrame(gather);
  }
  frame=requestAnimationFrame(gather);
 });
 if(stopped)return;
 dialog.classList.remove('portal-gathering');
 dialog.classList.add('portal-enter');
 const start=performance.now(),duration=2000;
 const rays=Array.from({length:120},(_,i)=>({
  angle:(i/120)*Math.PI*2,depth:((Math.sin(i*127.1)*43758.5453)%1+1)%1,
  reach:.7+(i%11)/14,alpha:.65+(i%7)/20
 }));
 function tunnel(now){
  if(stopped)return;
  const t=Math.max(0,Math.min(1,(now-start)/duration));
  // Fade over the final 800 ms while continuing to draw moving rays.
  if(t>=.6)dialog.classList.add('portal-arrived');
  paint.fillStyle='#080f24';paint.fillRect(0,0,width,height);
  const cx=width/2,cy=height/2,limit=Math.hypot(width,height)*.72;
  const glow=paint.createRadialGradient(cx,cy,0,cx,cy,limit);
  glow.addColorStop(0,'#101e40');glow.addColorStop(.2,'#0b1630');glow.addColorStop(1,'#080f24');
  paint.fillStyle=glow;paint.fillRect(0,0,width,height);
  const progress=t*1.3+t*t*2.8;
  paint.lineCap='round';
  for(const ray of rays){
   const depth=(ray.depth+progress)%1;
   const near=Math.pow(depth,2.8);
   const radius=8+near*limit*ray.reach;
   const length=limit*(.36+near*.7);
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
  else enterGame();
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
