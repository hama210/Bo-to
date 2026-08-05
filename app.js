const scenes=[...document.querySelectorAll('.scene')];
const progress=document.getElementById('progressBar');
const toast=document.getElementById('toast');
let current=0,noCount=0,heartTimer;

const vibrate=(pattern=25)=>navigator.vibrate?.(pattern);
const showToast=(text)=>{toast.textContent=text;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),1800)};
const go=(index)=>{scenes[current].classList.remove('active');current=index;scenes[current].classList.add('active');progress.style.width=`${((index+1)/scenes.length)*100}%`;vibrate(18)};

function makeStars(){
  const field=document.getElementById('stars');
  for(let i=0;i<95;i++){
    const s=document.createElement('i');s.className='star';
    const size=Math.random()*2.4+.6;
    Object.assign(s.style,{width:`${size}px`,height:`${size}px`,left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,'--d':`${2+Math.random()*5}s`,animationDelay:`-${Math.random()*5}s`});
    field.appendChild(s);
  }
}
function heartRain(duration=6500){
  clearInterval(heartTimer);
  const end=Date.now()+duration;
  heartTimer=setInterval(()=>{
    if(Date.now()>end){clearInterval(heartTimer);return}
    const h=document.createElement('span');h.className='heart-drop';h.textContent=['❤️','💗','💕','💖'][Math.floor(Math.random()*4)];
    h.style.left=`${Math.random()*100}vw`;h.style.fontSize=`${18+Math.random()*28}px`;h.style.animationDuration=`${3+Math.random()*3}s`;h.style.setProperty('--drift',`${-90+Math.random()*180}px`);
    document.body.appendChild(h);setTimeout(()=>h.remove(),6500);
  },120);
}

makeStars();
window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loading').classList.add('hide'),1900));

document.getElementById('openGift').addEventListener('click',()=>{
  const box=document.getElementById('giftBox');box.classList.add('open');heartRain(1800);vibrate([30,35,45]);setTimeout(()=>go(1),1150);
});

document.getElementById('openEnvelope').addEventListener('click',(e)=>{
  e.currentTarget.classList.add('open');vibrate([25,30,25]);setTimeout(()=>go(2),1200);
});

document.getElementById('answerForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const value=document.getElementById('answerInput').value.trim().toLowerCase();
  const card=document.getElementById('authCard'),error=document.getElementById('answerError');
  if(value==='shirin' || value==='شیرین'){
    error.textContent='';heartRain(2200);vibrate([35,30,60]);setTimeout(()=>go(3),450);
  }else{
    error.textContent='پێدەچێت تۆ ئەو کەسە نەبیت... تکایە دووبارە هەوڵ بدە 🥺';
    card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake');vibrate([70,40,70]);
  }
});

document.getElementById('toQuestion').addEventListener('click',()=>go(4));

const noMessages=['🥺 دڵنیایت؟','😔 دووبارە بیر بکەرەوە...','💔 دڵم مەشکێنە...','🥹 تکایە یەک جار تر بیر بکەرەوە...','دڵم هێندە بە ئاسانی وەڵامی نەخێر قبوڵ ناکات...'];
const noBtn=document.getElementById('noBtn'),yesBtn=document.getElementById('yesBtn'),area=document.getElementById('choiceArea');
function dodgeNo(){
  noCount++;
  document.getElementById('statusText').textContent=noMessages[Math.min(noCount-1,noMessages.length-1)];
  const maxX=Math.max(20,area.clientWidth-noBtn.offsetWidth),maxY=Math.max(30,area.clientHeight-noBtn.offsetHeight);
  noBtn.style.position='absolute';noBtn.style.left=`${Math.random()*maxX}px`;noBtn.style.top=`${Math.random()*maxY}px`;
  noBtn.style.transform=`scale(${Math.max(.42,1-noCount*.1)})`;
  yesBtn.style.transform=`scale(${Math.min(1.65,1+noCount*.1)})`;
  vibrate(22);showToast(noMessages[Math.min(noCount-1,noMessages.length-1)]);
}
['mouseenter','touchstart','click'].forEach(ev=>noBtn.addEventListener(ev,(e)=>{e.preventDefault();dodgeNo()},{passive:false}));

yesBtn.addEventListener('click',()=>{heartRain(7200);vibrate([40,25,80]);go(5)});
document.getElementById('openLetter').addEventListener('click',()=>go(6));
document.getElementById('finishBtn').addEventListener('click',()=>{heartRain(7000);go(7)});
document.getElementById('restartBtn').addEventListener('click',()=>location.reload());

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.isIntersecting&&entry.target.classList.add('visible')),{threshold:.35});
document.querySelectorAll('.letter p').forEach(p=>observer.observe(p));

window.addEventListener('pointermove',(e)=>{
  if(innerWidth<800)return;
  const x=(e.clientX/innerWidth-.5)*8,y=(e.clientY/innerHeight-.5)*8;
  document.querySelector('.aurora').style.transform=`translate(${x}px,${y}px)`;
});