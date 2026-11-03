(()=>{
 'use strict';
 const sky=document.querySelector('#sky');if(!sky)return;
 const preference=matchMedia('(prefers-reduced-motion:reduce)'),pointer=matchMedia('(hover:hover) and (pointer:fine)');
 let frame=0,active=false,pointerX=0,pointerY=0;
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 function render(){
  frame=0;if(!active)return;
  const rect=sky.getBoundingClientRect(),distance=clamp(-rect.top,0,rect.height);
  sky.style.setProperty('--px-scroll',distance.toFixed(2)+'px');
  sky.style.setProperty('--px-x',pointerX.toFixed(2)+'px');
  sky.style.setProperty('--px-y',pointerY.toFixed(2)+'px');
  sky.style.setProperty('--px-fade',String(clamp(1-distance/(rect.height*.85),.78,1)));

 }
 function schedule(){if(active&&!frame)frame=requestAnimationFrame(render)}
 function move(e){if(!pointer.matches||sky.getBoundingClientRect().bottom<=0)return;pointerX=(e.clientX/innerWidth-.5)*12;pointerY=(e.clientY/innerHeight-.5)*10;schedule()}
 function reset(){pointerX=pointerY=0;schedule()}
 function configure(){
  active=!preference.matches;document.body.classList.toggle('parallax-ready',active);
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
