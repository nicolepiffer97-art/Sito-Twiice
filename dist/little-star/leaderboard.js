const phaseNames=['Protostella','Sequenza principale','Gigante rossa','Nana bianca'];
function phaseName(entry){
 if(Number.isInteger(entry.level)&&entry.level>=0&&entry.level<phaseNames.length)return phaseNames[entry.level];
 const legacy=['nana rossa','nana arancione','stella solare','stella blu'];
 const index=legacy.findIndex(name=>String(entry.phase||'').toLocaleLowerCase('it').includes(name));
 return index>=0?phaseNames[index]:entry.phase||'';
}
const API='https://twiice-hall-of-stars.fbshfc785g.chatgpt.site/api';
async function request(path,body){const response=await fetch(API+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});const data=await response.json();if(!response.ok)throw Error(data.error||'Classifica non disponibile. Riprova.');return data}
export const beginRun=()=>request('/runs',{}).then(data=>data.token);
export const saveScore=data=>request('/scores',data).then(data=>data.items);
export async function showRanking(list,items){list.replaceChildren();if(!items){const loading=document.createElement('li');loading.textContent='Caricamento classifica…';list.append(loading);try{items=(await request('/scores')).items}catch{loading.textContent='Classifica momentaneamente non disponibile.';return}}
list.replaceChildren();if(!items.length){const empty=document.createElement('li');empty.textContent='La prima stella potrebbe essere la tua.';list.append(empty);return}
for(const [i,entry] of items.entries()){const li=document.createElement('li'),name=document.createElement('span'),phase=document.createElement('small'),points=document.createElement('b');li.append(document.createTextNode(String(i+1).padStart(2,'0')));name.textContent=entry.name;phase.textContent=phaseName(entry);name.append(phase);points.textContent=entry.score.toLocaleString('it-IT');li.append(name,points);list.append(li)}}
