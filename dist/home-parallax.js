(()=>{
 'use strict';
 const sky=document.querySelector('#sky');if(!sky)return;
 const preference=matchMedia('(prefers-reduced-motion:reduce)'),pointer=matchMedia('(hover:hover) and (pointer:fine)');
 const entries=[...document.querySelectorAll('.intro h2,.intro-bottom,.project-heading,.people-layout>div:first-child,.contact-layout>div:first-child')];
 const artwork=document.querySelector('#project-highlight');
 let frame=0,active=false,pointerX=0,pointerY=0;
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 function render(){
  frame=0;if(!active)return;
  const rect=sky.getBoundingClientRect(),distance=clamp(-rect.top,0,rect.height);
  sky.style.setProperty('--px-scroll',distance.toFixed(2)+'px');
  sky.style.setProperty('--px-x',pointerX.toFixed(2)+'px');
  sky.style.setProperty('--px-y',pointerY.toFixed(2)+'px');
  sky.style.setProperty('--px-fade',String(clamp(1-distance/(rect.height*.85),.78,1)));
  for(const el of entries){
   const box=el.getBoundingClientRect();
   // translate is removed from the measurement so the value settles without feedback.
   const previous=parseFloat(el.style.getPropertyValue('--entry-y'))||0;
   const start=box.top-previous;
   const progress=clamp((innerHeight-start)/(innerHeight*.55),0,1);
   el.style.setProperty('--entry-y',((1-progress)*36).toFixed(2)+'px');
   el.style.setProperty('--entry-opacity',String(.72+progress*.28));
  }
  if(artwork){const box=artwork.getBoundingClientRect();const p=clamp((innerHeight-box.top)/(innerHeight+box.height),0,1);artwork.style.setProperty('--art-y',((p-.5)*30).toFixed(2)+'px')}
 }
 function schedule(){if(active&&!frame)frame=requestAnimationFrame(render)}
 function move(e){if(!pointer.matches||sky.getBoundingClientRect().bottom<=0)return;pointerX=(e.clientX/innerWidth-.5)*12;pointerY=(e.clientY/innerHeight-.5)*10;schedule()}
 function reset(){pointerX=pointerY=0;schedule()}
 function configure(){
  active=!preference.matches;document.body.classList.toggle('parallax-ready',active);
  entries.forEach(el=>el.classList.toggle('px-entry',active));
  if(active)schedule();else{cancelAnimationFrame(frame);frame=0}
 }
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule);
 addEventListener('pageshow',schedule);
 sky.addEventListener('pointermove',move,{passive:true});
 sky.addEventListener('pointerleave',reset);
 preference.addEventListener('change',configure);
 document.fonts?.ready.then(schedule);
 configure();
})();
