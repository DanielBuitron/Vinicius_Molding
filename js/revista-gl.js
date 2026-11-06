(()=>{
const cv=document.getElementById('gl');if(!cv)return;
const gl=cv.getContext('webgl2',{antialias:false,alpha:false});if(!gl)return;
window.GLon=true;document.body.classList.add('gl');
const VS=`#version 300 es
layout(location=0)in vec3 pos;layout(location=1)in vec3 nrm;layout(location=2)in vec2 uv;
uniform mat4 uModel;uniform vec2 uView,uT0,uPO,uT;uniform float uD,uS,uC,uSn,uCz,uSz;
out vec3 vW;out vec3 vN;out vec2 vUv;
void main(){vec4 w=uModel*vec4(pos,1.);vW=w.xyz;vN=mat3(uModel)*nrm;vUv=uv;
vec3 p=w.xyz*uS;p=vec3(p.x*uCz-p.y*uSz,p.x*uSz+p.y*uCz,p.z);
vec3 r=vec3(p.x,p.y*uC-p.z*uSn,p.y*uSn+p.z*uC)+vec3(uT,0.);
float k=(uD-r.z)/uD;vec2 s=uT0+r.xy-uPO;
gl_Position=vec4(((uPO.x-uView.x*.5)*k+s.x)/(uView.x*.5),-((uPO.y-uView.y*.5)*k+s.y)/(uView.y*.5),-r.z/4000.*k,k);}`;
const FS=`#version 300 es
precision highp float;
in vec3 vW;in vec3 vN;in vec2 vUv;
uniform sampler2D uTex,uNrm;uniform int uMode;uniform vec3 uLP,uAx,uLP2,uAx2,uEye,uCol;uniform vec2 uRep;uniform float uG,uA;
out vec4 o;
vec3 N,V,alb;float ks,sh,k2,ao,rg,f0,ek;
vec3 env(vec3 r,float w){
 vec3 e=mix(vec3(.012,.012,.014),vec3(.07,.072,.078),smoothstep(-.05,.9,r.z));
 e+=vec3(.55,.52,.46)*smoothstep(.9-w,.99,dot(r,normalize(vec3(-.15,-.55,.75))));
 return e;}
vec3 lit(vec3 LPv,vec3 ax,float I,vec3 lc,float c0,float c1){
 vec3 Lv=LPv-vW;float d=length(Lv);vec3 L=Lv/d;float spot=smoothstep(c0,c1,dot(-L,ax));float att=spot*I/(1.+pow(d/1800.,2.));
 vec3 H=normalize(L+V);float nh=max(dot(N,H),0.);float nl=dot(N,L);float df=uMode==3?max(nl*.7+.3,0.):max(nl,0.);
 float sp=pow(nh,sh)*ks+pow(nh,12.)*k2;
 vec3 r=(alb*df+vec3(sp))*lc*att*ao;if(uMode==3)r+=alb*vec3(.9,.55,.3)*.07*att*ao;return r;}
void main(){
N=normalize(vN);alb=uCol;ks=.2;sh=20.;k2=0.;ao=1.;rg=.3;f0=.045;ek=1.;
if(uMode==4){o=vec4(0.,0.,0.,texture(uTex,vUv).a*uCol.x);return;}
vec4 t=texture(uTex,uMode==5?vec2(vUv.x,1.-vUv.y):vUv*uRep);
if(uMode==0){alb=t.rgb;ks=.85;sh=170.;k2=.07;f0=.045;rg=.12;ek=.28;}
else if(uMode==2){alb=t.rgb;ks=.6;sh=90.;k2=.06;f0=.05;rg=.25;}
else if(uMode==5){alb=t.rgb;ks=.55;sh=45.;k2=.1;f0=.05;rg=.3;ao=mix(.55,1.,smoothstep(0.,.25,vUv.y));}
else if(uMode==3){alb=t.rgb*.68;vec3 n=texture(uNrm,vUv).rgb*2.-1.;n.xy+=(vUv-.5)*.45;float c=cos(uA),s=sin(uA);N=normalize(vec3(n.x*c-n.y*s,n.x*s+n.y*c,n.z));
 ks=1.4*uG;sh=55.;k2=.45*uG;f0=.04;rg=.18+(1.-uG)*.5;ek=.8*uG+.15;float rr=length(vUv-.5)*2.;ao=1.-.55*smoothstep(.84,1.,rr);}
else{ks=.8;sh=45.;k2=.14;f0=.045;rg=.35;}
V=normalize(uEye-vW);
float amb=uMode==0?.01:uMode==3?.9:.38;
vec3 col=alb*vec3(amb)*ao;
if(uMode!=0){float rim=pow(1.-max(dot(N,V),0.),2.4);col+=vec3(.42,.44,.48)*rim*.42*ao;}
col+=lit(uLP,uAx,9.5,vec3(1.,.98,.92),.84,.97);
col+=lit(uLP2,uAx2,6.4,vec3(1.,.97,.93),.93,.982);
float NV=max(dot(N,V),0.);float F=f0+(1.-f0)*pow(1.-NV,5.);float sm=smoothstep(.3,.9,dot(-normalize(uLP-vW),uAx));
col+=env(reflect(-V,N),rg)*F*(.3+.7*sm)*ao*ek;
col=col/(1.+col*.45);col=pow(col,vec3(.95));
o=vec4(col,1.);}`;
const PV=`#version 300 es
out vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
const PF=`#version 300 es
precision highp float;in vec2 uv;uniform sampler2D uScn;uniform vec2 uRes;uniform float uFy,uAmt,uT;out vec4 o;
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){float r=uAmt*smoothstep(.10,.60,abs(uv.y-uFy));vec3 acc=vec3(0.);float ws=0.;
for(int i=0;i<28;i++){float a=float(i)*2.39996;float rr=sqrt((float(i)+.5)/28.)*r;vec3 s=texture(uScn,uv+vec2(cos(a),sin(a))*rr/uRes).rgb;float w=1.+dot(s,vec3(.5))*2.;acc+=s*w;ws+=w;}
vec3 c=acc/ws;float l=dot(c,vec3(.3,.5,.2));c=mix(vec3(l),c,1.08);
vec2 q=uv-.5;c*=1.-.55*dot(q,q);c+=(h(uv*uRes+fract(uT))-.5)*.003;o=vec4(c,1.);}`;
const sh=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(x));return x};
const prog=(v,f)=>{const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);const U={};p.u=n=>U[n]||(U[n]=gl.getUniformLocation(p,n));return p};
const pr=prog(VS,FS),pp=prog(PV,PF);
const mesh=(P,Nn,UV,I)=>{const vao=gl.createVertexArray();gl.bindVertexArray(vao);
 [[P,0,3],[Nn,1,3],[UV,2,2]].forEach(([d,l,sz])=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(d),gl.STATIC_DRAW);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,sz,gl.FLOAT,false,0,0)});
 const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(I),gl.STATIC_DRAW);return{vao,n:I.length}};
const SEG=128;
// torno: perfil [r,z] -> malla de revolución (px reales)
function lathe(pts,vs){const P=[],Nn=[],T=[],I=[],sn=[];
 for(let j=0;j<pts.length-1;j++){const dr=pts[j+1][0]-pts[j][0],dz=pts[j+1][1]-pts[j][1],l=Math.hypot(dr,dz)||1;sn.push([dz/l,-dr/l])}
 const vn=(j,e)=>{const n=sn[j],m=e===0?sn[j-1]:sn[j+1];if(m&&n[0]*m[0]+n[1]*m[1]>.6){const x=n[0]+m[0],y=n[1]+m[1],l=Math.hypot(x,y);return[x/l,y/l]}return n};
 let base=0;
 for(let j=0;j<pts.length-1;j++){const n0=vn(j,0),n1=vn(j,1),a=pts[j],b=pts[j+1];
  for(let k=0;k<=SEG;k++){const th=k/SEG*Math.PI*2,c=Math.cos(th),s=Math.sin(th),u=1-k/SEG;
   P.push(a[0]*c,a[1]*0+a[0]*s,a[1],b[0]*c,b[0]*s,b[1]);Nn.push(n0[0]*c,n0[0]*s,n0[1],n1[0]*c,n1[0]*s,n1[1]);T.push(u,a[1]/vs,u,b[1]/vs)}
  for(let k=0;k<SEG;k++){const q=base+2*k;I.push(q,q+1,q+2,q+1,q+3,q+2)}base+=2*(SEG+1)}
 return mesh(P,Nn,T,I)}
const discR=r=>{const P=[0,0,0],N=[0,0,1],T=[.5,.5],I=[];for(let i=0;i<=SEG;i++){const a=i/SEG*Math.PI*2,c=Math.cos(a),s=Math.sin(a);P.push(r*c,r*s,0);N.push(0,0,1);T.push(.5+.5*c,.5+.5*s);if(i<SEG)I.push(0,i+1,i+2)}return mesh(P,N,T,I)};
const arc=(cr,cz,r,a0,a1,n=7)=>{const a=[];for(let i=0;i<=n;i++){const q=a0+(a1-a0)*i/n;a.push([cr+r*Math.cos(q),cz+r*Math.sin(q)])}return a};
const QUAD=mesh([-1,-1,0,1,-1,0,1,1,0,-1,1,0],[0,0,1,0,0,1,0,0,1,0,0,1],[0,0,1,0,1,1,0,1],[0,1,2,0,2,3]);
let M={},builtP=0;
function build(P){if(Math.round(P)===builtP)return;builtP=Math.round(P);
 const R=.165*P,Hb=.1*P,Hl=.045*P,fr=.008*P,st=.004*P,Ro=.19*P,Hh=.15*P,t=.014*P,lw=.02*P,rec=.004*P,H2=Math.PI/2;
 M.body=lathe([...arc(R-fr,fr,fr,-H2,0),[R,Hb]],Hb);
 M.lid=lathe([[R,Hb],[R+st,Hb],...arc(R+st-fr,Hb+Hl-fr,fr,0,H2),[R-lw,Hb+Hl],[R-lw,Hb+Hl-rec]],1);
 M.dl=discR(R-lw);M.lid0=lathe([[R+st,0],...arc(R+st-fr,Hl-fr,fr,0,H2),[R-lw,Hl],[R-lw,Hl-rec]],1);M.und=discR(R+st);
 M.ob=lathe([...arc(Ro-fr,fr,fr,-H2,0),...arc(Ro-fr,Hh-fr,fr,0,H2)],Hb);
 M.rim=lathe([[Ro-fr,Hh],[Ro-t+fr,Hh],...arc(Ro-t+fr,Hh-fr,fr,H2,Math.PI),[Ro-t,Hh-.055*P]],1);
 M.cr=discR(Ro-t);M.quad=QUAD}
const setT=(rep)=>{gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);const w=rep?gl.REPEAT:gl.CLAMP_TO_EDGE;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,w);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,w);const e=gl.getExtension('EXT_texture_filter_anisotropic');if(e)gl.texParameterf(gl.TEXTURE_2D,e.TEXTURE_MAX_ANISOTROPY_EXT,16)};
const tex=(src,rep)=>{const t=gl.createTexture(),i=new Image();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([20,20,20,255]));i.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,i);setT(rep)};i.src=src;return t};
const cvTex=c=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);setT();return t};
const mk=n=>{const c=document.createElement('canvas');c.width=c.height=n;return[c,c.getContext('2d')]};
function cream(base,seed,sw){let s=seed;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;const N=768,q=N/512;
 const[hc,g]=mk(N);g.fillStyle='#808080';g.fillRect(0,0,N,N);g.filter='blur('+3*q+'px)';g.lineCap='round';
 const cx=N*(.44+rnd()*.12),cy=N*(.44+rnd()*.12);
 for(let k=0;k<2;k++){g.strokeStyle=k?'#6a6a6a':'#b4b4b4';g.lineWidth=sw*q*(k?1.3:1);g.beginPath();for(let t=0;t<26;t+=.04){const r=(10+t*5.2)*q,a=t*1.15+(k?.05:0);const x=cx+Math.cos(a)*r*(1+.04*Math.sin(t*3)),y=cy+Math.sin(a)*r;t?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
 for(let i=0;i<4;i++){g.strokeStyle=`rgba(${i%2?60:210},${i%2?60:210},${i%2?60:210},.5)`;g.lineWidth=(18+rnd()*14)*q;g.beginPath();const y0=(120+rnd()*280)*q;g.moveTo(60*q,y0);g.bezierCurveTo(180*q,y0-(60-rnd()*40)*q,320*q,y0+(50-rnd()*40)*q,460*q,y0+rnd()*30*q);g.stroke()}
 const f=g.createRadialGradient(N*.66,N*.62,2,N*.66,N*.62,70*q);f.addColorStop(0,'rgba(30,30,30,.85)');f.addColorStop(.7,'rgba(70,70,70,.5)');f.addColorStop(.85,'rgba(220,220,220,.5)');f.addColorStop(1,'rgba(128,128,128,0)');g.filter='blur('+3*q+'px)';g.fillStyle=f;g.fillRect(0,0,N,N);
 const hd=g.getImageData(0,0,N,N).data,H=new Float32Array(N*N);for(let i=0;i<N*N;i++)H[i]=hd[i*4]/255;
 const[nc,ng]=mk(N),[ac,ag]=mk(N),ni=ng.createImageData(N,N),ai=ag.createImageData(N,N),K=5.5;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x,hx=H[y*N+Math.min(x+1,N-1)]-H[y*N+Math.max(x-1,0)],hy=H[Math.min(y+1,N-1)*N+x]-H[Math.max(y-1,0)*N+x];
  let nx=-hx*K,ny=-hy*K,nz=1,l=Math.hypot(nx,ny,nz);ni.data.set([(nx/l*.5+.5)*255,(ny/l*.5+.5)*255,(nz/l*.5+.5)*255,255],i*4);
  const m=.88+.22*H[i]+(rnd()-.5)*.012;ai.data.set([base[0]*m,base[1]*m,base[2]*m,255],i*4)}
 ng.putImageData(ni,0,0);ag.putImageData(ai,0,0);return{alb:cvTex(ac),nrm:cvTex(nc)}}
const[bc,bg]=mk(128);{const r=bg.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(0,0,0,1)');r.addColorStop(.4,'rgba(0,0,0,.6)');r.addColorStop(1,'rgba(0,0,0,0)');bg.fillStyle=r;bg.fillRect(0,0,128,128)}
function deskSurface(){
 const N=2048,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d');
 g.fillStyle='#5c6070';g.fillRect(0,0,N,N);
 const img=g.getImageData(0,0,N,N),d=img.data;
 for(let i=0;i<d.length;i+=4){const n=(Math.random()-.5)*5;d[i]+=n;d[i+1]+=n;d[i+2]+=n+0.4}
 g.putImageData(img,0,0);
 g.globalCompositeOperation='overlay';
 for(let i=0;i<420;i++){
  const y=Math.random()*N,a=.025+Math.random()*.05;
  g.strokeStyle=`rgba(255,255,255,${a})`;g.lineWidth=Math.random()<.85?1:0.6;
  g.beginPath();g.moveTo(0,y);g.lineTo(N,y+(Math.random()-.5)*6);g.stroke();
 }
 const t=cvTex(c);
 gl.bindTexture(gl.TEXTURE_2D,t);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
 return t;
}
const T={wood:deskSurface(),blob:cvTex(bc),cr1:cream([236,214,172],5,16),cr2:cream([224,220,208],11,13)};
['cera','pasta','pomada','fibra'].forEach(k=>{T['l_'+k]=tex(TEX['lid_'+k]);T['s_'+k]=tex(TEX['strip_'+k])});
// ---- framebuffer MSAA + resolve
let fbM,fbR,tR,rC,rD,fw=0,fh=0;
function resize(){const d=Math.min(Math.max(devicePixelRatio||1,2),2.5);cv.width=Math.round(innerWidth*d);cv.height=Math.round(innerHeight*d);cv.style.width='100%';cv.style.height='100%';
 if(fbM){gl.deleteFramebuffer(fbM);gl.deleteFramebuffer(fbR);gl.deleteTexture(tR);gl.deleteRenderbuffer(rC);gl.deleteRenderbuffer(rD)}
 fw=cv.width;fh=cv.height;rC=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,rC);gl.renderbufferStorageMultisample(gl.RENDERBUFFER,4,gl.RGBA8,fw,fh);
 rD=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,rD);gl.renderbufferStorageMultisample(gl.RENDERBUFFER,4,gl.DEPTH_COMPONENT24,fw,fh);
 fbM=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbM);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.RENDERBUFFER,rC);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,rD);
 tR=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tR);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,fw,fh,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 fbR=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbR);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tR,0)}
resize();addEventListener('resize',resize);
const emptyVao=gl.createVertexArray();
const model=(p,a,t,s)=>{t=t||0;s=s||[1,1,1];const ca=Math.cos(a),sa=Math.sin(a),c=Math.cos(t),n=Math.sin(t);return new Float32Array([ca*s[0],sa*s[0],0,0,-sa*c*s[1],ca*c*s[1],n*s[1],0,sa*n*s[2],-ca*n*s[2],c*s[2],0,p[0],p[1],p[2],1])};
function dr(m,o){gl.uniformMatrix4fv(pr.u('uModel'),false,model(o.p,o.a||0,o.t||0,o.s));gl.uniform1i(pr.u('uMode'),o.mode);gl.uniform3fv(pr.u('uCol'),o.col||[.06,.06,.065]);gl.uniform2fv(pr.u('uRep'),o.rep||[1,1]);gl.uniform1f(pr.u('uG'),o.g||1);gl.uniform1f(pr.u('uA'),o.a||0);
 gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,o.tex||T.blob);gl.uniform1i(pr.u('uTex'),0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,o.nrm||T.blob);gl.uniform1i(pr.u('uNrm'),1);gl.bindVertexArray(M[m].vao);gl.drawElements(gl.TRIANGLES,M[m].n,gl.UNSIGNED_SHORT,0)}
const ptr={x:0,y:0,tx:0,ty:0,on:0};addEventListener('pointermove',e=>{ptr.on=1;ptr.tx=e.clientX/innerWidth*2-1;ptr.ty=e.clientY/innerHeight*2-1});
const tilt=document.getElementById('tilt');
function frame(t){
 const sec=t/1000,k=window.CAMT||{rx:54,s:.86,tx:4,ty:-3,rz:-3},PORT=!!window.PORT;
 ptr.x+=(ptr.tx-ptr.x)*.45;ptr.y+=(ptr.ty-ptr.y)*.45;const pm=PORT?.35:1;
 const rxF=k.rx+Math.sin(sec*.35)*.1,rzF=k.rz,txF=k.tx,tyF=k.ty;
 tilt.style.transform=`translate3d(${txF}vw,${tyF}vh,0) rotateX(${rxF}deg) rotateZ(${rzF}deg) scale(${k.s})`;
 const P=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pwpx'))||480,W=innerWidth,H=innerHeight,rx=rxF*Math.PI/180,rz=rzF*Math.PI/180,c=Math.cos(rx),sn=Math.sin(rx);
 build(P);
 gl.bindFramebuffer(gl.FRAMEBUFFER,fbM);gl.viewport(0,0,fw,fh);gl.clearColor(.003,.003,.004,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(pr);
 const u=pr.u;gl.uniform2f(u('uView'),W,H);gl.uniform2f(u('uT0'),W/2,H*.54);gl.uniform2f(u('uPO'),W/2,H*.38);gl.uniform2f(u('uT'),txF*W/100,tyF*H/100);
 gl.uniform1f(u('uD'),1700);gl.uniform1f(u('uS'),k.s);gl.uniform1f(u('uC'),c);gl.uniform1f(u('uSn'),sn);gl.uniform1f(u('uCz'),Math.cos(rz));gl.uniform1f(u('uSz'),Math.sin(rz));
 const Dcam=1700,txPix=txF*W/100,tyPix=tyF*H/100,cz=Math.cos(rz),sz=Math.sin(rz);
 const ndcX=ptr.x,ndcY=-ptr.y;let kk=1,rY=0;
 for(let i=0;i<5;i++){rY=(.24*kk-.32-ndcY)*H/2;const py=(rY-tyPix)/Math.max(c,.2);kk=(Dcam-py*sn)/Dcam}
 const rX=ndcX*W/2,px=rX-txPix,py=(rY-tyPix)/Math.max(c,.2),qx=px/k.s,qy=py/k.s;
 let mx=Math.max(-1500,Math.min(1500,qx*cz+qy*sz)),my=Math.max(-1500,Math.min(1500,-qx*sz+qy*cz)); const hx=ptr.on?mx:4000,hy=ptr.on?my:4000,LP=[hx,hy,280],tg=[hx,hy,0],ax=[tg[0]-LP[0],tg[1]-LP[1],tg[2]-LP[2]],al=Math.hypot(...ax);
 const LP2=[0,.02*P,980],t2=[0,.02*P,0],a2=[t2[0]-LP2[0],t2[1]-LP2[1],t2[2]-LP2[2]],l2=Math.hypot(...a2);gl.uniform3fv(u('uLP2'),LP2);gl.uniform3f(u('uAx2'),a2[0]/l2,a2[1]/l2,a2[2]/l2);
 gl.uniform3fv(u('uLP'),LP);gl.uniform3f(u('uAx'),ax[0]/al,ax[1]/al,ax[2]/al);gl.uniform3f(u('uEye'),0,1700*Math.sin(rx),1700*Math.cos(rx));
 const R=.165*P,Hb=.1*P,Hl=.045*P,Ho=Hb+Hl,Ro=.19*P,Hh=.15*P,st=.004*P,rec=.004*P,lw=.02*P;
 dr('quad',{p:[0,0,-8],s:[3200,3200,1],mode:0,tex:T.wood,rep:[7,7]});
 const shd=(x,y,r,h,a)=>{const dx=x-LP[0],dy=y-LP[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,L=h*.9;[[0,1.08,.9],[.5,1.2,.5*a],[1,1.4,.28*a]].forEach(([f,s,al])=>dr('quad',{p:[x+ux*L*f,y+uy*L*f,-7],s:[r*s,r*s,1],mode:4,col:[al,0,0]}))};
 // disposición: nada invade el espacio de la revista (cerrada o abierta)
 const L=PORT?{open:[{x:-.62,y:1.12,c:'cr1',s:'cera',g:.5,a:.5}],lid:[{x:.02,y:1.2,a:.6,t:0,k:'cera'}],closed:[{x:.68,y:1.1,k:'pomada',sp:.28,ph:4}]}
  :{open:[{x:-1.32,y:.44,c:'cr1',s:'cera',g:.5,a:.5},{x:1.3,y:.74,c:'cr2',s:'fibra',g:.55,a:2.1}],lid:[{x:-1.74,y:.54,a:.6,t:0,k:'cera'},{x:1.3+.33,y:.74,a:Math.PI/2,t:.47,k:'fibra'}],closed:[{x:1.3,y:-.52,k:'pasta',sp:-.3,ph:2},{x:1.46,y:.1,k:'pomada',sp:.28,ph:4}]};
 L.closed.forEach(d=>shd(d.x*P,d.y*P,R,Ho,1));L.open.forEach(d=>shd(d.x*P,d.y*P,Ro,Hh,1));L.lid.forEach(d=>shd(d.x*P,d.y*P,R,d.t?Hl*3:Hl,1));
 L.closed.forEach(d=>{const a=sec*d.sp+d.ph,x=d.x*P,y=d.y*P;
  dr('body',{p:[x,y,0],a,mode:5,tex:T['s_'+d.k]});dr('lid',{p:[x,y,0],a,mode:1,col:[.045,.045,.05]});dr('dl',{p:[x,y,Ho-rec],a,mode:2,tex:T['l_'+d.k]})});
 L.open.forEach(d=>{const x=d.x*P,y=d.y*P,a=d.a+sec*.04;
  dr('ob',{p:[x,y,0],a,mode:5,tex:T['s_'+d.s]});dr('rim',{p:[x,y,0],a,mode:1,col:[.05,.05,.056]});
  dr('cr',{p:[x,y,Hh-.045*P],a,mode:3,tex:T[d.c].alb,nrm:T[d.c].nrm,g:d.g})});
 L.lid.forEach(d=>{const tl=d.t,z0=tl?(R+st)*Math.sin(tl):0,x=d.x*P,y=d.y*P,zl=Hl-rec;
  dr('lid0',{p:[x,y,z0],a:d.a,t:tl,mode:1,col:[.045,.045,.05]});dr('und',{p:[x,y,z0],a:d.a,t:tl,mode:1,col:[.03,.03,.034]});
  dr('dl',{p:[x+Math.sin(d.a)*Math.sin(tl)*zl,y-Math.cos(d.a)*Math.sin(tl)*zl,z0+Math.cos(tl)*zl],a:d.a,t:tl,mode:2,tex:T['l_'+d.k]})});
 gl.bindFramebuffer(gl.READ_FRAMEBUFFER,fbM);gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,fbR);gl.blitFramebuffer(0,0,fw,fh,0,0,fw,fh,gl.COLOR_BUFFER_BIT,gl.NEAREST);
 gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,fw,fh);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(pp);
 gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tR);gl.uniform1i(pp.u('uScn'),0);gl.uniform2f(pp.u('uRes'),fw,fh);gl.uniform1f(pp.u('uFy'),1-(.54+tyF/100));gl.uniform1f(pp.u('uAmt'),(PORT?1.1:1.6)*fw/innerWidth);gl.uniform1f(pp.u('uT'),sec%10);
 gl.bindVertexArray(emptyVao);gl.drawArrays(gl.TRIANGLES,0,3);
 requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();
