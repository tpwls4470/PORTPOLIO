import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const out=path.resolve('design-exports/v07');
await mkdir(out,{recursive:true});
const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-sandbox','--disable-gpu-sandbox','--enable-unsafe-swiftshader','--remote-debugging-port=9225',`--user-data-dir=${path.resolve('.browser-verify')}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
let ws;
try {
  let targets;
  for(let n=0;n<80;n++){try{targets=await(await fetch('http://127.0.0.1:9225/json')).json();break;}catch{await new Promise(r=>setTimeout(r,250));}}
  if(!targets)throw Error('Chrome did not start');
  ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise(r=>ws.addEventListener('open',r,{once:true}));
  let id=0;const pending=new Map(),errors=[],missing=[];
  ws.addEventListener('message',e=>{const msg=JSON.parse(e.data);if(msg.id){const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);}else if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails);else if(msg.method==='Network.responseReceived'&&msg.params.response.status>=400)missing.push(msg.params.response.url);});
  const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
  await call('Page.enable');await call('Runtime.enable');await call('Network.enable');
  const evaluate=async expression=>(await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true})).result.value;
  const settle=()=>evaluate('new Promise(resolve=>setTimeout(resolve,650))');
  const shot=async(name,full=false)=>{const metrics=await call('Page.getLayoutMetrics');const view=metrics.cssVisualViewport;const opts={format:'png',captureBeyondViewport:true,clip:full?{x:0,y:0,width:metrics.cssContentSize.width,height:metrics.cssContentSize.height,scale:1}:{x:view.pageX,y:view.pageY,width:view.clientWidth,height:view.clientHeight,scale:1}};const image=await call('Page.captureScreenshot',opts);await writeFile(path.join(out,name),Buffer.from(image.data,'base64'));};
  for(const [name,width,height] of [['desktop',1920,1080],['mobile',390,844]]){
    await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<760});
    await call('Page.navigate',{url:'http://127.0.0.1:4173/?capture=1'});await settle();
    await evaluate('Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))');await settle();
    await shot(`${name}-full.png`,true);await shot(`${name}-surface.png`);
    await call('Page.navigate',{url:'http://127.0.0.1:4173/'});await settle();
    const states=[];
    for(const progress of [0,.18,.33,.48,.65,.9]){
      await evaluate(`window.scrollTo(0,(document.querySelector('.hero').offsetHeight-innerHeight)*${progress})`);await settle();
      states.push(await evaluate(`({y:scrollY,phase:document.querySelector('.hero-stage').dataset.divePhase,height:document.querySelector('.hero').offsetHeight,overflow:document.documentElement.scrollWidth>innerWidth,projectPointer:getComputedStyle(document.querySelector('.work-bubble')).pointerEvents})`));
      if([.33,.65,.9].includes(progress))await shot(`${name}-${progress===.33?'crossing':progress===.65?'submerged':'projects'}.png`);
    }
    console.log(name,JSON.stringify(states));
  }
  await call('Emulation.setDeviceMetricsOverride',{width:320,height:740,deviceScaleFactor:1,mobile:true});await settle();
  console.log('narrow overflow',await evaluate('document.documentElement.scrollWidth>innerWidth'));
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await call('Page.navigate',{url:'http://127.0.0.1:4173/'});await settle();
  console.log('reduced',await evaluate(`({height:document.querySelector('.hero').offsetHeight,viewport:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth})`));
  console.log('errors',JSON.stringify(errors),'missing',JSON.stringify(missing));
}finally{ws?.close();chrome.kill();}
