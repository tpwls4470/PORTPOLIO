'use strict';
(() => {
  const stage = document.querySelector('.hero-stage');
  const canvas = document.createElement('canvas');
  canvas.className = 'ocean-scene';
  canvas.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas);
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) return; // The photograph remains visible without WebGL.
  const vertex = `attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
  const fragment = `precision mediump float;
    varying vec2 uv; uniform sampler2D ocean; uniform sampler2D depth; uniform sampler2D overhead;
    uniform float time; uniform float progress; uniform float aspect;
    float ease(float a,float b,float v){return smoothstep(a,b,v);}
    vec3 photo(vec2 p){return texture2D(ocean,vec2(clamp(p.x,.002,.998),1.-clamp(p.y,.002,.998))).rgb;}
    void main(){
      vec2 p=vec2(uv.x,1.-uv.y);
      float sink=ease(.10,.59,progress);
      float line=mix(1.10,-.18,sink);
      float wave=(sin(p.x*11.+time*.8)*.012+sin(p.x*23.-time*.65)*.005+sin(p.x*5.+time*.4)*.008);
      float edge=line+wave;
      float below=step(edge,p.y);
      float dist=p.y-edge;
      float bend=exp(-abs(dist)*65.);
      float crop=min(1.,aspect/1.77778);
      float sx=(p.x-.5)*crop*mix(1.,.68,ease(.04,.58,progress))+.5;
      sx+=sin(p.y*31.+time*.6)*.0015+sin(p.x*21.+time)*bend*.009;
      float aboveY=.48*p.y/max(edge,.035);
      float belowY=.48+.52*(p.y-edge)/max(1.-edge,.15);
      float sy=mix(aboveY,belowY,below);
      sy+=sin(p.x*18.+time*.75)*.002*(.25+p.y)+bend*sin(p.x*36.+time)*.005;
      vec2 overheadUV=vec2((p.x-.5)*crop+.5,p.y);
      overheadUV+=vec2(sin(p.y*18.+time*.26)*.002,cos(p.x*17.-time*.22)*.002);
      vec3 overheadColor=texture2D(overhead,vec2(overheadUV.x,1.-overheadUV.y)).rgb;
      vec3 waterlineColor=photo(vec2(sx,sy));
      float leaveOverhead=ease(.09,.31,progress);
      vec3 color=mix(overheadColor,waterlineColor,leaveOverhead);
      float submerge=ease(.56,.79,progress);
      vec2 deepUV=vec2((p.x-.5)*min(1.,aspect/1.5)+.5,p.y);
      deepUV.x+=sin(p.y*12.+time*.3)*.002;
      vec3 deep=texture2D(depth,vec2(deepUV.x,1.-deepUV.y)).rgb;
      color=mix(color,deep,submerge);
      float rim=exp(-abs(dist)*260.);
      color=mix(color,vec3(.025,.19,.23),bend*.38*(1.-submerge));
      color+=vec3(.59,.88,.91)*rim*.44*(1.-submerge);
      float highlight=exp(-abs(dist+.009)*180.);
      color+=vec3(.4,.65,.7)*highlight*.15*(1.-submerge);
      color*=1.-.12*pow(abs(p.x-.5)*1.7,2.);
      gl_FragColor=vec4(color,1.);
    }`;
  function compile(type, source) {
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  try {
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(['time','progress','aspect'].map(name => [name, gl.getUniformLocation(program,name)]));
    let ready = 0, current = 0, elapsed = 0, previous = 0, lastDraw = 0;
    let visible = true;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const capture = new URLSearchParams(location.search).has('capture');
    function render() {
      if (ready !== 3 || gl.isContextLost()) return;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.round(stage.clientWidth * ratio), height = Math.round(stage.clientHeight * ratio);
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; gl.viewport(0,0,width,height); }
      gl.uniform1f(uniforms.time, elapsed); gl.uniform1f(uniforms.progress, reduce.matches ? 0 : current);
      gl.uniform1f(uniforms.aspect, width/height); gl.drawArrays(gl.TRIANGLES,0,6);
    }
    ['assets/ocean-crossing-v7.png','assets/water-reference.png','assets/ocean-overhead-v8.png'].forEach((src, i) => {
      const image = new Image(); image.onload = () => {
        const texture = gl.createTexture(); gl.activeTexture(gl.TEXTURE0+i); gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(program,['ocean','depth','overhead'][i]),i); ready++; render();
      }; image.src=src;
    });
    window.oceanScene = { update(progress) {current=progress;render();} };
    new IntersectionObserver(entries => { visible=entries[0].isIntersecting; }).observe(stage);
    function frame(now) {
      requestAnimationFrame(frame);
      const running = !capture && !reduce.matches && !document.body.classList.contains('motion-paused') && document.visibilityState==='visible' && visible;
      if (previous && running) elapsed += Math.min(now-previous,100)/1000;
      previous=now;
      if (running && now-lastDraw>32) {lastDraw=now;render();}
    }
    addEventListener('resize',render); reduce.addEventListener('change',render);
    requestAnimationFrame(frame);
  } catch(error) { console.warn('Ocean rendering uses the photograph fallback.',error); }
})();
