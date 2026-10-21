(() => {
 'use strict';
 const section = document.querySelector('#mondi');
 const stage = section.querySelector('.worlds-stage');
 const cards = [...section.querySelectorAll('.motion-world')];
 const wide = matchMedia('(min-width:901px)');
 const reduced = matchMedia('(prefers-reduced-motion:reduce)');
 let pending = 0, keyboardFocus = false;
 addEventListener('keydown', event => { if (event.key === 'Tab') keyboardFocus = true; });
 addEventListener('pointerdown', () => { keyboardFocus = false; }, {passive:true});
 const clamp = v => Math.max(0, Math.min(1, v));
 function render() {
  pending = 0;
  if (reduced.matches) { section.classList.remove('is-scroll-ready'); cards.forEach(c => {c.style.transform='';c.style.visibility=''}); return; }
  section.classList.add('is-scroll-ready');
  if (!wide.matches) {
   const rect=section.getBoundingClientRect();
   const p=clamp(-rect.top/Math.max(1,section.offsetHeight-innerHeight));
   section.style.setProperty('--world-progress',p);
   cards.forEach((c,i)=>{
    const exit=i===cards.length-1?0:clamp((p-i*.43)/.4);
    const ease=exit*exit*(3-2*exit);
    const x=-stage.clientWidth*1.35*ease;
    const turn=[-4,4,-2][i]-18*ease;
    c.style.transform=`translate3d(${x}px,${i*5-35*ease}px,0) rotate(${turn}deg) scale(${1-i*.025})`;
    c.style.zIndex=String(3-i);
    c.style.visibility=exit>=1?'hidden':'visible';
   });
   return;
  }
  cards.forEach(c=>c.style.visibility='');
  const rect = section.getBoundingClientRect();
  const p = clamp(-rect.top / Math.max(1,section.offsetHeight-innerHeight));
  const t = clamp(p / .82), ease = t*t*(3-2*t);
  const w = stage.clientWidth, gap = Math.min(24,w*.025), cardWidth = (w-gap*2)/3;
  section.style.setProperty('--world-card-width', `${cardWidth}px`);
  section.style.setProperty('--world-progress', p);
  cards.forEach((c,i) => {
   const side=i-1, angle=[-13,5,15][i]*(1-ease);
   const x=side*(cardWidth+gap)*ease;
   const y=(1-ease)*[12,-8,19][i];
   c.style.transform=`translate3d(${x}px,${y}px,0) rotate(${angle}deg) scale(${.88+.12*ease})`;
   c.style.zIndex=String(3-i);
  });
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(render)}
 addEventListener('scroll',schedule,{passive:true}); addEventListener('resize',schedule);
 wide.addEventListener('change',schedule); reduced.addEventListener('change',schedule);
 document.fonts?.ready.then(schedule); addEventListener('pageshow',schedule);
 // Bring a focused link into the composed state, so keyboard navigation stays legible.
 section.addEventListener('focusin',event=>{
  if(keyboardFocus&&!reduced.matches&&event.target.closest('.motion-world')) {
   const rect=section.getBoundingClientRect();
   const index=cards.indexOf(event.target.closest('.motion-world'));
   const target=scrollY+rect.top+(section.offsetHeight-innerHeight)*(wide.matches?.84:index*.43);
   scrollTo({top:target,behavior:'instant'}); render();
  }
 });
 render();
})();
