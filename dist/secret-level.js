/* The final collectible opens the hidden sky. Kept separate from the public Wonder/R&D page. */
(()=>{'use strict';
 const key='twiice-little-star-unlocked-v1',game=new URL('little-star/',document.currentScript.src).href;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let unlocked=false,dialog=null,timers=[],previousFocus=null;
 for(const storage of ['localStorage','sessionStorage']){try{unlocked=unlocked||window[storage].getItem(key)==='true'}catch{}}
 const shortcut=document.createElement('a');shortcut.className='wonder-found';shortcut.href=game;shortcut.textContent='✦ WONDER FOUND';shortcut.setAttribute('aria-label','Wonder Found: gioca a Little Star');shortcut.hidden=!unlocked;document.body.append(shortcut);
 function remember(){unlocked=true;shortcut.hidden=false;for(const storage of ['localStorage','sessionStorage']){try{window[storage].setItem(key,'true')}catch{}}}
 function cancelTimers(){timers.forEach(clearTimeout);timers=[]}
 function later(fn,ms){timers.push(setTimeout(fn,ms))}
 function reveal(){if(dialog)return;previousFocus=document.activeElement;remember();dialog=document.createElement('dialog');dialog.className='secret-level-dialog';dialog.setAttribute('aria-labelledby','secret-heading');dialog.innerHTML=`<button type="button" class="secret-close" aria-label="Resta sul sito Twiice">✕</button><div class="secret-cosmos" aria-hidden="true"><svg viewBox="0 0 600 400"><path class="secret-lines" d="M80 230 130 120 220 160 265 70 320 150 420 100 500 190 430 260 350 230 290 330 220 260 140 300 80 230 M220 160 220 260 M320 150 350 230"/>${[[80,230],[130,120],[220,160],[265,70],[320,150],[420,100],[500,190],[430,260],[350,230],[290,330],[220,260],[140,300]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="4" style="--i:${i}"/>`).join('')}</svg><div class="secret-portal"></div>${Array.from({length:24},(_,i)=>`<i class="secret-speed" style="--angle:${i*15}deg;--delay:${(i%6)*.07}s"></i>`).join('')}</div><div class="secret-copy"><p class="secret-count">12 / 12 STARS FOUND</p><h2 id="secret-heading">Wonder <em>Found.</em></h2><p id="secret-description" aria-live="polite">Hai riunito tutte le stelle.<br>Ora formano un nuovo universo da esplorare.</p><a class="secret-enter" href="${game}">Entra in Little Star <span>↗</span></a><small>Every great thing starts small.</small></div>`;
 document.body.append(dialog);dialog.showModal();document.body.classList.add('secret-is-open');
 const enter=dialog.querySelector('.secret-enter'),close=dialog.querySelector('.secret-close');
 function cleanup(){cancelTimers();document.body.classList.remove('secret-is-open');dialog.remove();dialog=null;previousFocus?.focus?.()}
 close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',cleanup,{once:true});
 enter.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();cancelTimers();dialog.classList.add('secret-warp');enter.setAttribute('aria-disabled','true');dialog.querySelector('#secret-description').textContent='Il tuo viaggio comincia da una piccola stella.';later(()=>location.assign(game),reduced.matches?0:1100)});
 if(reduced.matches){dialog.classList.add('secret-ready')}else{later(()=>dialog?.classList.add('secret-joining'),80);later(()=>dialog?.classList.add('secret-ready'),2200)}
 }
 function progress(count){if(count===12&&!unlocked)reveal()}
 document.addEventListener('twiice:stars-progress',e=>progress(e.detail.count));
 // The shared collector may have completed before this deferred script ran.
 progress(window.TwiiceStars?.read().length??0);
 addEventListener('pageshow',()=>{if(!dialog){for(const storage of ['localStorage','sessionStorage']){try{if(window[storage].getItem(key)==='true')unlocked=true}catch{}}shortcut.hidden=!unlocked}});
 // Restore an idle page when returning through the browser's back/forward cache.
 addEventListener('pagehide',()=>{cancelTimers();if(dialog)dialog.close()});
})();
