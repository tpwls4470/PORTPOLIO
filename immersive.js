'use strict';
(() => {
  const capture = document.body.classList.contains('capture-mode');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.hero-stage');
  const archive = document.querySelector('#archive');
  const gallery = document.querySelector('.archive-grid');
  const galleryWindow = document.querySelector('.archive-window');
  const horizontal = matchMedia('(min-width:1100px) and (min-height:780px)');
  const canvas = document.querySelector('#water-effects');
  const ctx = canvas.getContext('2d');
  let w = innerWidth, h = innerHeight, dive = 0, pending = false;
  let lastTime = 0, clock = 0, lastFrame = 0;
  const bursts = [];
  const seeds = Array.from({length:130}, (_,i) => ({x:((i*73.17+13)%100)/100,y:((i*41.73)%100)/100,r:5+(i*13.3%47),speed:.3+(i%11)/11,wave:(i*2.31)%6.28}));
  const smooth = (a,b,v) => {const p=Math.max(0,Math.min(1,(v-a)/(b-a)));return p*p*(3-2*p);};
  const enabled = () => !capture && !reduce.matches && !document.body.classList.contains('motion-paused');
  function resize(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);update();}
  function update(){
    pending=false;
    const rect=hero.getBoundingClientRect();
    dive=Math.max(0,-rect.top/Math.max(1,hero.offsetHeight-h));
    const p=enabled()?Math.min(1,dive):0;
    stage.style.setProperty('--dive',p.toFixed(4));
    stage.style.setProperty('--copy-alpha',(1-smooth(.2,.78,p)).toFixed(4));
    if(horizontal.matches&&!capture&&!reduce.matches){
      const travel=Math.max(1,archive.offsetHeight-h);
      const q=Math.max(0,Math.min(1,-archive.getBoundingClientRect().top/travel));
      const distance=Math.max(0,gallery.scrollWidth-galleryWindow.clientWidth);
      gallery.style.setProperty('--gallery-x',`${(-q*distance).toFixed(1)}px`);
    }else gallery.style.removeProperty('--gallery-x');
  }
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',resize);
  reduce.addEventListener('change',update);
  new MutationObserver(update).observe(document.body,{attributes:true,attributeFilter:['class']});
  function bubble(x,y,r,alpha){
    if(alpha<.015||y < -r||y>h+r)return;
    ctx.save();ctx.globalAlpha=alpha;
    const fill=ctx.createRadialGradient(x-r*.3,y-r*.35,1,x,y,r);
    fill.addColorStop(0,'rgba(255,255,255,.13)');fill.addColorStop(.68,'rgba(195,238,253,.035)');fill.addColorStop(.89,'rgba(243,254,255,.65)');fill.addColorStop(.95,'rgba(123,194,218,.25)');fill.addColorStop(1,'rgba(255,255,255,.9)');
    ctx.fillStyle=fill;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    ctx.lineWidth=Math.max(1,r*.035);ctx.strokeStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(x-r*.025,y-r*.025,r*.87,Math.PI*1.08,Math.PI*1.65);ctx.stroke();
    ctx.strokeStyle='rgba(205,233,254,.65)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r*.94,.05,1.5);ctx.stroke();ctx.restore();
  }
  function pop(x,y){
    if(!enabled())return;
    bursts.push({x,y,start:performance.now(),rays:Array.from({length:24},(_,i)=>({angle:i/24*Math.PI*2,speed:60+Math.random()*130,r:3+Math.random()*11}))});
  }
  function draw(time){
    requestAnimationFrame(draw);
    if(time-lastFrame<30)return;lastFrame=time;
    const run=enabled();
    if(!lastTime)lastTime=time;
    if(run&&document.visibilityState==='visible')clock+=(time-lastTime)/1000;
    lastTime=time;
    ctx.clearRect(0,0,w,h);
    if(capture||reduce.matches)return;
    const count=w<760?20:38;
    for(let i=0;i<count;i++){
      const s=seeds[i];const y=h+35-((s.y*(h+100)+clock*(12+s.speed*18))%(h+100));
      const edge=s.x<.5?s.x*.34:1-(1-s.x)*.34;
      bubble(edge*w+Math.sin(clock*.6+s.wave)*15,y,3+s.r*.24,.4);
    }
    const foam=run?smooth(.32,.85,dive)*(1-smooth(1.15,1.8,dive)):0;
    if(foam>.01){
      const n=w<760?70:130;
      for(let i=0;i<n;i++){
        const s=seeds[i];const y=h*1.18-((s.y*1.55+dive*.9+clock*.025)%1.7)*h;
        bubble(s.x*w+Math.sin(s.wave+dive*3)*30,y,(s.r+12)*(.65+foam*.9),foam*.95);
      }
      ctx.fillStyle=`rgba(233,250,255,${foam*.26})`;ctx.fillRect(0,0,w,h);
    }
    for(let i=bursts.length-1;i>=0;i--){
      const b=bursts[i],p=(time-b.start)/720;
      if(p>=1){bursts.splice(i,1);continue;}
      ctx.save();ctx.strokeStyle=`rgba(250,255,255,${(1-p)*.9})`;ctx.lineWidth=3*(1-p);ctx.beginPath();ctx.arc(b.x,b.y,12+p*120,0,Math.PI*2);ctx.stroke();ctx.restore();
      for(const ray of b.rays)bubble(b.x+Math.cos(ray.angle)*ray.speed*p,b.y+Math.sin(ray.angle)*ray.speed*p-p*p*55,ray.r*(1-p*.7),1-p);
    }
  }
  window.waterEffects={openProject(trigger,open){
    if(!enabled()){open();return;}
    if(trigger.dataset.opening==='true')return;
    trigger.dataset.opening='true';
    const r=trigger.getBoundingClientRect();pop(r.left+r.width/2,r.top+r.height/2);
    if(trigger.classList.contains('work-bubble'))trigger.classList.add('is-popping');
    setTimeout(()=>{trigger.classList.remove('is-popping');delete trigger.dataset.opening;open();},430);
  },pop};
  stage.addEventListener('pointerdown',event=>{if(!event.target.closest('a,button'))pop(event.clientX,event.clientY);});
  resize();requestAnimationFrame(draw);
})();

