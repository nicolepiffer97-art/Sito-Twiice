import {beginRun,saveScore,showRanking} from './leaderboard.js?v=20261106-online';
// Little Star: self-contained WebGL ray/sphere renderer; no runtime CDN dependencies.
const $=id=>document.getElementById(id), canvas=$('sky');
const gl=canvas.getContext('webgl',{alpha:false,antialias:false});
let playerName='',runId=0;
let state='intro',mass=1,score=0,elapsed=0,level=0,player={x:0,z:0,vx:0,vz:0},dust=[],hazards=[],keys=new Set(),pointer=null,last=0,saved=false;
const stages=['Nana rossa · M','Nana arancione · K','Stella solare · G','Stella blu · B'];
// Representative effective temperatures, not core temperatures or a universal life cycle.
const temperatures=[3000,4500,5800,16000];
const stellarColors=[[1,.035,.015],[1,.28,.015],[1,.86,.48],[.16,.40,1]];
let nextEncounter=0,lastSide=1;
let distance=0,sparks=[],visualMass=1,deathAge=0,deathReason='',touchOrigin=null,stick={x:0,z:0};
const joystick=$('joystick'),knob=$('joystick-knob');
function releaseTouch(){touchId=null;touchOrigin=null;stick={x:0,z:0};joystick.hidden=true}
function smoothGrowth(dt){visualMass+=(mass-visualMass)*(1-Math.exp(-dt*2.2))}
function stellarColor(m){const bounds=[1,10,30,70];let i=0;while(i<2&&m>=bounds[i+1])i++;const t=Math.max(0,Math.min(1,(m-bounds[i])/(bounds[i+1]-bounds[i])));const blend=Math.max(0,Math.min(1,(t-.7)/.3)),smooth=blend*blend*(3-2*blend);return stellarColors[i].map((v,k)=>v+(stellarColors[i+1][k]-v)*smooth)}
function stellarTemperature(m){const bounds=[1,10,30,70];let i=0;while(i<2&&m>=bounds[i+1])i++;const t=Math.max(0,Math.min(1,(m-bounds[i])/(bounds[i+1]-bounds[i])));return Math.round(temperatures[i]+(temperatures[i+1]-temperatures[i])*t)}
function explode(reason){state='dying';deathAge=0;deathReason=reason;releaseTouch();pointer=null;keys.clear();$('pause').disabled=true}

const fx=document.createElement('canvas');fx.className='collect-fx';fx.setAttribute('aria-hidden','true');canvas.after(fx);const ctx=fx.getContext('2d');
function collectSpark(x,z){sparks.push({x,z,age:0,seed:Math.random()*6.28});if(sparks.length>24)sparks.shift()}
function drawSparkles(){const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio,1.4);if(fx.width!==Math.floor(w*dpr)||fx.height!==Math.floor(h*dpr)){fx.width=Math.floor(w*dpr);fx.height=Math.floor(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';for(const s of sparks){const depth=42*.777+(34-s.z)*.629,up=-42*.629+(34-s.z)*.777;const x=w/2+s.x/depth/.62*h/2,y=h/2-up/depth/.62*h/2,k=s.age/.65,spread=5+k*30;ctx.globalAlpha=(1-k)**2;ctx.strokeStyle='#c2fdc7';ctx.shadowColor='#c2fdc7';ctx.shadowBlur=10;ctx.lineWidth=1.5;for(let i=0;i<6;i++){const a=i*Math.PI/3+s.seed,px=x+Math.cos(a)*spread,py=y+Math.sin(a)*spread;ctx.beginPath();ctx.moveTo(px-3,py);ctx.lineTo(px+3,py);ctx.moveTo(px,py-3);ctx.lineTo(px,py+3);ctx.stroke()}ctx.strokeStyle='#fff6dc';ctx.beginPath();ctx.arc(x,y,4+k*16,0,Math.PI*2);ctx.stroke()}ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.globalCompositeOperation='source-over'}

const massRadius=m=>Math.min(6.4,.70*Math.pow(m,.43));
const radius=()=>Math.min(massRadius(visualMass),xBound()*.32);
const xBound=()=>Math.min(32,Math.max(8,canvas.clientWidth/canvas.clientHeight*22));
const reach=()=>2.4+Math.sqrt(mass)*.9;
const rnd=(a,b)=>a+Math.random()*(b-a);
let runPromise=Promise.resolve(null);
function openHall(){if(state==='playing')pause();showRanking($('ranking'));$('hall').showModal()}
$('hallBtn').onclick=openHall;$('closeHall').onclick=$('back').onclick=()=>$('hall').close();
// Objects are already offscreen before they reach the camera.
const entryZ=()=>-112;
function recycle(h){h.vx=0;h.vz=0;h.seed=rnd(1,90);if(h.star){h.mass=Math.random()<.65?rnd(.35,Math.max(.7,mass*.55)):rnd(Math.max(4,mass*1.3),Math.max(14,mass*1.8));h.r=massRadius(h.mass)}else{h.mass=rnd(Math.max(1.8,mass*.65),Math.max(4,mass*1.5));h.r=massRadius(h.mass)*1.1}
 h.r=Math.min(h.r,xBound()*.19);const side=lastSide=-lastSide;h.r=Math.min(h.r,xBound()*.16);h.x=side*rnd(xBound()*.32+h.r+1,Math.max(xBound()*.32+h.r+1,xBound()-h.r-.6));h.z=entryZ()-h.r*4;const last=hazards.filter(other=>other!==h).reduce((z,other)=>Math.min(z,other.z-other.r-h.r-10-radius()*2),h.z);h.z=Math.min(h.z,last);}
// Queue each recycled particle behind the incoming stream, never in a batch.
function recycleDust(p){p.x=rnd(-xBound()*.82,xBound()*.82);const tail=dust.filter(other=>other!==p&&other.z<-86).reduce((z,other)=>Math.min(z,other.z),-86);p.z=Math.min(-91,tail-rnd(5.5,8));p.vx=0;p.vz=0;for(const h of hazards){if(Math.abs(p.x-h.x)<h.r+1&&Math.abs(p.z-h.z)<h.r+2)p.x=-Math.sign(h.x||1)*rnd(1,xBound()*.7)}}
function grow(amount,points){mass+=amount;score+=points;const next=mass>=70?3:mass>=30?2:mass>=10?1:0;if(next!==level){level=next;$('message').textContent='✦ '+stages[level].toUpperCase()+' · LA TUA STELLA CRESCE';}}
function reset(){releaseTouch();mass=visualMass=1;score=0;elapsed=0;level=0;player={x:0,z:5,vx:0,vz:0};saved=false;distance=0;nextEncounter=20;sparks=[];hazards=[];dust=[];for(let i=0;i<18;i++){const p={y:rnd(-.2,.2),vx:0,vz:0};if(i<6){p.x=[-.35,.4,-.15,.25,-.4,.2][i]*xBound();p.z=[-78,-59,-40,-21,-2,17][i]}else recycleDust(p);dust.push(p)};hud()}
function populate(){if(elapsed<nextEncounter||mass<3)return;const cap=canvas.clientWidth<650?2:3;if(hazards.length>=cap)return;const star=elapsed>=60&&mass>=10&&hazards.every(h=>!h.star);const h={star};recycle(h);hazards.push(h);nextEncounter=elapsed+14;}
function start(event){event?.preventDefault();const nameInput=$('player-name');if(nameInput){const name=nameInput.value.trim();nameInput.setCustomValidity(name.length<2?'Inserisci un nome di almeno 2 caratteri.':'');if(!nameInput.reportValidity())return;playerName=name;}if(!playerName)return;runId++;runPromise=beginRun().catch(()=>null);reset();state='playing';document.body.dataset.state='playing';$('overlay').hidden=true;$('pause').disabled=false;$('pause-panel').hidden=true;$('pause').textContent='Ⅱ';keys.clear();pointer=null;canvas.focus();$('message').textContent='';}
function pause(){if(!['playing','paused'].includes(state))return;releaseTouch();state=state==='playing'?'paused':'playing';$('pause-panel').hidden=state!=='paused';$('pause').textContent=state==='paused'?'▶':'Ⅱ';$('pause').setAttribute('aria-label',state==='paused'?'Riprendi':'Pausa');$('message').textContent=state==='paused'?'PAUSA · P / SPAZIO PER RIPRENDERE':'';keys.clear();pointer=null}
$('start-form').onsubmit=start;$('player-name').addEventListener('input',()=> $('player-name').setCustomValidity(''));$('pause').onclick=$('resume').onclick=pause;
function end(reason){
 state='over';document.body.dataset.state='over';releaseTouch();$('pause-panel').hidden=true;$('pause').disabled=true;pointer=null;keys.clear();
 const endedRun=runId,tokenPromise=runPromise;
 const submission={name:playerName,score:Math.floor(score),level,elapsed};
 const overlay=$('overlay');overlay.hidden=false;
 overlay.innerHTML='<h2 class="game-over-title">Game over</h2><p class="game-over-subtitle">Every star has a story.</p><p id="reason"></p><div class="result"></div><small id="saveNote" role="status">Invio del punteggio in classifica…</small><ol class="result-ranking" hidden></ol><button id="retry-save" type="button" hidden>Riprova invio</button><button id="retry" class="primary">Nasci di nuovo <svg class="site-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button>';
 $('reason').textContent=stages[level];
 overlay.querySelector('.result').textContent=submission.score.toLocaleString('it-IT')+' pt';
 const note=$('saveNote'),list=overlay.querySelector('.result-ranking'),retrySave=$('retry-save');
 let sending=false;
 async function publishScore(){
  if(sending||saved)return;
  sending=true;retrySave.hidden=true;note.textContent='Invio del punteggio in classifica…';
  try{
   const token=await tokenPromise;
   if(!token)throw Error('Partita offline: inizia una nuova partita per entrare in classifica.');
   const items=await saveScore({...submission,token});
   if(runId!==endedRun||state!=='over')return;
   saved=true;list.hidden=false;note.textContent='Il tuo punteggio è in classifica.';
   showRanking(list,items);
  }catch(error){
   if(runId!==endedRun||state!=='over')return;
   note.textContent=error.message||'Invio non disponibile. Riprova.';
   retrySave.hidden=false;
  }finally{sending=false}
 }
 retrySave.onclick=publishScore;
 $('retry').onclick=start;
 publishScore();
}
function hud(){$('nextLevel').textContent=level<3?'VERSO '+stages[level+1].toUpperCase():'STELLA MASSICCIA · CONTINUA A CRESCERE';$('temperature').textContent=stellarTemperature(visualMass).toLocaleString('it-IT')+' K';$('distance').textContent=Math.floor(distance)+' u';$('score').textContent=String(Math.floor(score)).padStart(6,'0');$('mass').textContent=mass.toFixed(1);$('gravity').textContent=(reach()/3.3).toFixed(1)+'×';$('stage').textContent='0'+(level+1)+' / '+stages[level].toUpperCase();$('time').textContent=String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(Math.floor(elapsed%60)).padStart(2,'0');const bounds=[1,10,30,70,140];$('progress').style.width=Math.min(100,(mass-bounds[level])/(bounds[level+1]-bounds[level])*100)+'%'}
function update(dt){elapsed+=dt;score+=dt*.25;smoothGrowth(dt);populate();const cruise=2.3+Math.min(elapsed/90,1.6);distance+=cruise*dt;sparks=sparks.filter(s=>{s.age+=dt;s.z+=cruise*dt;return s.age<.65});let ax=0,az=0;const speed=11/(1+mass*.003);if(keys.has('arrowleft')||keys.has('a'))ax--;if(keys.has('arrowright')||keys.has('d'))ax++;if(keys.has('arrowup')||keys.has('w'))az--;if(keys.has('arrowdown')||keys.has('s'))az++;if(touchOrigin){ax=stick.x;az=stick.z}else if(pointer){ax=Math.max(-1,Math.min(1,(pointer.x-player.x)*.5));az=Math.max(-1,Math.min(1,(pointer.z-player.z)*.5))}const len=Math.hypot(ax,az);if(len>1){ax/=len;az/=len}player.vx+=(ax*speed-player.vx)*Math.min(1,dt*5);player.vz+=(az*speed-player.vz)*Math.min(1,dt*5);
for(const h of hazards){h.z+=cruise*dt;if(h.z>45+h.r){recycle(h);continue}const dx=h.x-player.x,dz=h.z-player.z,d=Math.hypot(dx,dz),edible=h.star&&mass>h.mass*1.15;if(d<h.r+radius()*.8){if(edible){const bonus=Math.round(12+h.mass*3);collectSpark(h.x,h.z);grow(h.mass*.85,bonus);$('message').textContent='✦ STELLA ASSORBITA · +'+bonus+' PUNTI';recycle(h)}else if(!h.star&&mass>h.mass*1.15){collectSpark(h.x,h.z);grow(h.mass*.12,8);recycle(h)}else{explode(h.star?'Catturata da una stella più massiccia':'Collisione con un asteroide');return}}}
player.x=Math.max(-xBound(),Math.min(xBound(),player.x+player.vx*dt));player.z=Math.max(-24,Math.min(24,player.z+player.vz*dt));
const dustSpeed=6+Math.min(elapsed/120,1.8);for(const p of dust){p.z+=dustSpeed*dt;if(p.z>40){recycleDust(p)}const dx=player.x-p.x,dz=player.z-p.z,d=Math.hypot(dx,dz);if(d<reach()){const acc=(12+mass*1.2)/(d*d+1);p.vx+=dx/Math.max(d,.1)*acc*dt;p.vz+=dz/Math.max(d,.1)*acc*dt}p.vx*=Math.exp(-dt*.8);p.vz*=Math.exp(-dt*.8);p.x+=p.vx*dt;p.z+=p.vz*dt;for(const h of hazards){const dx=p.x-h.x,dz=p.z-h.z,distance=Math.hypot(dx,dz),clearance=h.r+.4;if(distance<clearance){p.x=h.x+(dx||1)/Math.max(distance,.01)*clearance;p.z=h.z+dz/Math.max(distance,.01)*clearance}}if(d<radius()+.28){collectSpark(p.x,p.z);grow(.18,3+level);recycleDust(p);}}
for(let i=0;i<dust.length;i++)for(let j=i+1;j<dust.length;j++){const a=dust[i],b=dust[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);if(d<.4){const shift=(.4-d)/2;a.x-=(dx||.1)/Math.max(d,.1)*shift;b.x+=(dx||.1)/Math.max(d,.1)*shift;a.z-=dz/Math.max(d,.1)*shift;b.z+=dz/Math.max(d,.1)*shift}}
hud()}
addEventListener('keydown',e=>{if(['INPUT','BUTTON'].includes(document.activeElement?.tagName)&&e.key===' ')return;if(document.activeElement?.tagName==='INPUT'||$('hall').open)return;const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();if((k==='p'||k===' ')&&!e.repeat)pause();else keys.add(k)});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>{if(state==='playing')pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')pause()});
// Camera is at (0,42,34), looking toward the origin. Unproject pointers onto y=0.
function point(e){const r=canvas.getBoundingClientRect(),a=r.width/r.height,u=((e.clientX-r.left)/r.width*2-1)*a*.62,v=(1-(e.clientY-r.top-(e.pointerType==='touch'?40:0))/r.height*2)*.62;const dy=-.777+v*.629,dz=-.629-v*.777,t=-42/dy;return{x:Math.max(-xBound(),Math.min(xBound(),u*t)),z:Math.max(-25,Math.min(25,34+dz*t))}}
let touchId=null;
canvas.onpointerdown=e=>{if(state!=='playing')return;if(e.pointerType!=='mouse'){if(touchId!==null)return;touchId=e.pointerId;touchOrigin={x:e.clientX,y:e.clientY};stick={x:0,z:0};pointer=null;canvas.setPointerCapture(e.pointerId);joystick.style.left=e.clientX+'px';joystick.style.top=e.clientY+'px';knob.style.transform='translate(-50%,-50%)';joystick.hidden=false}else pointer=point(e)};
canvas.onpointermove=e=>{if(state!=='playing')return;if(e.pointerType==='mouse')pointer=point(e);else if(e.pointerId===touchId&&touchOrigin){const dx=e.clientX-touchOrigin.x,dy=e.clientY-touchOrigin.y,length=Math.hypot(dx,dy),scale=length>48?48/length:1;stick={x:Math.abs(dx)<4?0:dx*scale/48,z:Math.abs(dy)<4?0:dy*scale/48};knob.style.transform=`translate(calc(-50% + ${dx*scale}px),calc(-50% + ${dy*scale}px))`}};
canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=e=>{if(e.pointerId===touchId){releaseTouch();pointer=null}};canvas.onpointerleave=e=>{if(e.pointerType==='mouse')pointer=null};
addEventListener('resize',()=>{player.x=Math.max(-xBound(),Math.min(xBound(),player.x));pointer=null;releaseTouch();for(const p of dust)p.x=Math.max(-xBound(),Math.min(xBound(),p.x));for(const h of hazards){h.r=Math.min(h.r,xBound()*.16);h.x=(Math.sign(h.x)||1)*Math.max(xBound()*.32+h.r+1,Math.min(xBound()-h.r-.6,Math.abs(h.x)))}});
const vertex='attribute vec2 a; varying vec2 uv; void main(){uv=a;gl_Position=vec4(a,0.,1.);}';
const fragment=`precision highp float;
varying vec2 uv;uniform vec2 size;uniform float clock;uniform float travel;uniform vec4 obj[51];uniform vec3 colors[51];uniform vec2 pos;uniform float field;uniform vec2 props[51];
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){return .56*noise(p)+.28*noise(p*2.03)+.12*noise(p*4.1)+.04*noise(p*8.3);}
vec3 turn(vec3 p,float seed){float a=clock*.09+seed;float c=cos(a),s=sin(a);return vec3(c*p.x-s*p.z,p.y,s*p.x+c*p.z);}
float rock(vec3 p,float r,float seed){vec3 q=turn(p/r,seed);vec3 scale=vec3(.68+.17*sin(seed),.64+.16*cos(seed*2.),.72+.13*sin(seed*3.));return (length(q/scale)-(.86+.16*noise(q*4.+seed)))*r*.55;}
void main(){vec2 q=uv*vec2(size.x/size.y,1.);vec3 ro=vec3(0.,42.,34.),rd=normalize(vec3(q.x*.62,-.777+q.y*.62*.629,-.629-q.y*.62*.777));vec3 col=vec3(.014,.025,.062);float neb=exp(-length(q-vec2(-.4,-.1))*1.7);col+=vec3(.015,.045,.065)*neb;vec2 st=(uv+vec2(0.,travel*.0015))*vec2(size.x/3.,size.y/3.);vec2 cell=floor(st);float star=step(.996,hash(vec3(cell,0.)))*pow(max(0.,1.-length(fract(st)-.5)*2.),4.);col+=star*vec3(.5,.65,.8);float closest=1000.;vec3 surface=col,glow=vec3(0.);
for(int i=0;i<51;i++){vec3 oc=ro-obj[i].xyz;float r=obj[i].w,kind=props[i].x,seed=props[i].y;if(r>0.){float b=dot(oc,rd),h=b*b-dot(oc,oc)+r*r;float distanceRay=length(oc+rd*max(0.,-b));if(kind<2.5){float halo=exp(-max(0.,distanceRay-r)*2.4/max(.3,r));glow+=colors[i]*halo*(kind<.5?.27:.13);}if(h>0.){float t=-b-sqrt(h);bool hit=true;vec3 normal;if(kind>2.5){hit=false;float far=-b+sqrt(h);for(int k=0;k<22;k++){vec3 rp=ro+rd*t-obj[i].xyz;float d=rock(rp,r,seed);if(d<.008*r){hit=true;break;}t+=max(d,.012*r);if(t>far)break;}vec3 rp=ro+rd*t-obj[i].xyz;float e=.015*r;normal=normalize(vec3(rock(rp+vec3(e,0,0),r,seed)-rock(rp-vec3(e,0,0),r,seed),rock(rp+vec3(0,e,0),r,seed)-rock(rp-vec3(0,e,0),r,seed),rock(rp+vec3(0,0,e),r,seed)-rock(rp-vec3(0,0,e),r,seed)));}else{normal=normalize(ro+rd*t-obj[i].xyz);}if(hit&&t>0.&&t<closest){closest=t;vec3 p=turn((ro+rd*t-obj[i].xyz)/r,seed);if(kind>2.5){float grain=fbm(p*17.+seed),veins=fbm(p*5.+seed);float pits=smoothstep(.35,.62,noise(p*28.+seed));float light=.13+.87*max(0.,dot(normal,normalize(vec3(-1.,2.,2.))));surface=mix(vec3(.18,.15,.12),vec3(.53,.48,.40),grain)*light*(.62+pits*.38);surface*=.65+.55*veins;}else if(kind>1.5||kind<.5){vec3 flowing=p*11.+vec3(clock*.16,clock*.1,0.);float cells=fbm(flowing+fbm(p*4.+clock*.06)*2.);float granules=smoothstep(.28,.76,cells);float filaments=pow(1.-abs(noise(p*23.+clock*.15)*2.-1.),5.);float limb=.60+.40*max(0.,dot(normal,-rd));surface=colors[i]*(.55+granules*.65+filaments*.2)*limb;float spot=smoothstep(.67,.79,fbm(p*5.+seed));surface*=1.-spot*.6;}else surface=colors[i];}}}}
if(closest<999.)col=surface;col+=glow;float plane=-ro.y/rd.y;vec3 floorp=ro+rd*plane;float ring=abs(length(floorp.xz-pos)-field);col+=colors[0]*exp(-ring*12.)*.2;col=vec3(1.)-exp(-col*1.35);gl_FragColor=vec4(pow(col,vec3(.85)),1.);}`;
let program,loc;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
function initGL(){program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);loc=Object.fromEntries(['size','clock','travel','obj','colors','pos','field','props'].map(n=>[n,gl.getUniformLocation(program,n)]))}
function render(t){const dpr=Math.min(devicePixelRatio,1.35),w=Math.floor(canvas.clientWidth*dpr),h=Math.floor(canvas.clientHeight*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}const objects=new Float32Array(51*4),colors=new Float32Array(51*3),props=new Float32Array(51*2);function put(i,x,y,z,r,c,kind,seed=0){objects.set([x,y,z,r],i*4);colors.set(c,i*3);props.set([kind,seed],i*2)}put(0,player.x,0,player.z,state==='dying'?radius()*Math.max(0,1-deathAge/.45):radius(),stellarColor(visualMass),0);dust.forEach((p,i)=>put(i+1,p.x,p.y+Math.sin(t*.001+i)*.15,p.z,.15,[.5,.9,.65],1));hazards.forEach((h,i)=>put(32+i,h.x,0,h.z,h.r,h.star?stellarColor(h.mass):[.3,.25,.2],h.star?2:3,h.seed));gl.uniform2f(loc.size,w,h);gl.uniform1f(loc.clock,elapsed);gl.uniform1f(loc.travel,distance);gl.uniform4fv(loc.obj,objects);gl.uniform3fv(loc.colors,colors);gl.uniform2fv(loc.props,props);gl.uniform2f(loc.pos,player.x,player.z);gl.uniform1f(loc.field,reach());gl.drawArrays(gl.TRIANGLES,0,6)}
function frame(t){const dt=Math.min((t-last)/1000,.04);last=t;if(state==='playing')update(dt);if(state==='dying'){deathAge+=dt;if(deathAge>=1.05)end(deathReason)}render(t);drawSparkles();drawExplosion();requestAnimationFrame(frame)}
try{if(!gl)throw Error('WebGL non disponibile');initGL();reset();requestAnimationFrame(frame)}catch(e){$('overlay').innerHTML='<h2>Serve un cielo 3D.</h2><p>WebGL non disponibile. Prova un browser con accelerazione grafica attiva.</p>';$('pause').disabled=true;console.error(e)}
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(state==='playing')pause();$('message').textContent='CONTESTO GRAFICO PERSO · RICARICA LA PAGINA'});


function drawExplosion(){if(state!=='dying')return;const w=canvas.clientWidth,h=canvas.clientHeight,depth=42*.777+(34-player.z)*.629,up=-42*.629+(34-player.z)*.777,x=w/2+player.x/depth/.62*h/2,y=h/2-up/depth/.62*h/2,t=deathAge;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.max(0,1-t/1.05);ctx.strokeStyle='#ffbb78';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,10+t*150,0,Math.PI*2);ctx.stroke();for(let i=0;i<36;i++){const a=i*2.39996,r=t*(65+(i%7)*21),px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;ctx.fillStyle=i%3?'#ffdca4':'#c2fdc7';ctx.beginPath();ctx.arc(px,py,Math.max(.5,4*(1-t)),0,Math.PI*2);ctx.fill()}ctx.restore()}

// Reveal the game only once its first rendered frame is ready.
requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.add('portal-entry-ready')));
