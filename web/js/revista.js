(()=>{
const WA='https://wa.me/573235835137',IG='https://instagram.com/viniciusmolding';
const A=f=>(window.IMGS&&IMGS[f])||'assets/'+f;
const PORTF=()=>innerWidth<innerHeight*.9;window.PORT=PORTF();
const PW=()=>window.PORT?Math.min(innerWidth*.8,innerHeight*.5):Math.min(innerWidth*.38,innerHeight*.46);
const sp=()=>{window.PORT=PORTF();const r=document.documentElement;r.classList.toggle('port',window.PORT);r.style.setProperty('--pwpx',PW());r.style.setProperty('--pw',PW()+'px');const st=document.getElementById('stage');if(st)st.style.height=window.PORT?'1100vh':'720vh'};sp();addEventListener('resize',sp);
const TIN='Keratina · Romero · Aloe vera',EXT='Romero · Keratina · Cebolla · Aloe vera · Zanahoria · Ácido hialurónico';
const PR=[
{id:'cera',n:'Cera',sub:'Moldeadora · brillo medio',cap:'Cera Moldeadora',c:'#E52C3B',v:'paper',d:'Define y moldea con brillo medio. Hecha con keratina, romero y aloe vera.',r:[['Contenido','150 g'],['Acabado','Brillo medio'],['Contiene',TIN]]},
{id:'pasta',n:'Pasta',sub:'Moldeadora · brillante',cap:'Pasta Moldeadora',c:'#00C8C2',tx:'#06100f',v:'color',d:'Fijación con acabado brillante para peinados definidos. Con keratina, romero y aloe vera.',r:[['Contenido','150 g'],['Acabado','Brillante'],['Contiene',TIN]]},
{id:'pomada',n:'Pomada',sub:'Moldeadora · mate',cap:'Pomada Moldeadora',c:'#A4D800',v:'dark',d:'Acabado mate y natural, con la fuerza que necesita un peinado de todos los días.',r:[['Contenido','150 g'],['Acabado','Mate'],['Contiene',TIN]]},
{id:'cera-fibra',n:'Cera & Fibra',sub:'Acabado húmedo',cap:'Cera & Fibra',c:'#7B5CB8',v:'paper',d:'Cera y fibra en una sola fórmula para un acabado húmedo con textura.',r:[['Contenido','200 g'],['Acabado','Húmedo'],['Contiene',TIN]]},
{id:'kids',n:'Cera & Fibra Kids',sub:'Línea Kids',cap:'Cera & Fibra Kids',c:'#FFD300',tx:'#14110a',v:'color',d:'Versión para los más jóvenes, a base de cera de abeja.',r:[['Base','Cera de abeja'],['Uso','Pelo seco o semi seco'],['Contiene',TIN]]},
{id:'anticaida',n:'Shampoo',sub:'Protección capilar · anticaída',cap:'Shampoo Protección Capilar',c:'#E52C3B',v:'dark',d:'Aporta apariencia de mayor volumen, brillo y suavidad, y cuida el cuero cabelludo.',r:[['Contenido','500 g'],['Contiene',EXT],['Fórmula','Sin sal']]},
{id:'carbon',n:'Shampoo',sub:'Carbón activo',cap:'Shampoo Carbón Activo',c:'#A4D800',v:'paper',d:'Adiós caspa y picazón. Limpia el cuero cabelludo y mantiene el cabello fuerte.',r:[['Contenido','500 ml'],['Contiene',EXT],['Fórmula','Sin sal']]},
{id:'serum',n:'Serum',sub:'Barba · bigote',cap:'Serum Barba · Bigote',c:'#A4D800',tx:'#0c1204',v:'color',d:'Cuidado diario para barba y bigote, con aceites naturales.',r:[['Contenido','65 ml · 2.3 fl oz'],['Contiene','Argán · Jojoba · Aloe vera'],['Uso','Externo']]},
{id:'tonico',n:'Tónico',sub:'Orgánico · cuero cabelludo',cap:'Tónico Orgánico',c:'#FFD300',tx:'#14110a',v:'color',d:'Tónico de extractos para el cuero cabelludo. 19 activos.',r:[['Contenido','65 ml'],['Uso','Cuero cabelludo'],['Contiene','Romero · Biotina · Aloe vera']],img:'assets/products/tonico.jpg'},
{id:'pasta-minoxidil',n:'Pasta',sub:'Minoxidil · cera de abeja',cap:'Pasta Minoxidil',c:'#00C8C2',v:'paper',d:'Minoxidil, pantenol y romero, a base de cera de abeja. Usar en pelo seco o semi seco.',r:[['Contenido','150 g'],['Base','Cera de abeja'],['Contiene','Minoxidil · Pantenol · Romero']],img:'assets/products/pasta-minoxidil.jpg'},
{id:'cubre-canas',n:'Gel',sub:'Cubre canas',cap:'Gel Cubre Canas',c:'#E52C3B',v:'dark',d:'Cubre las canas con un acabado húmedo brillante.',r:[['Contenido','150 g'],['Acabado','Húmedo brillante'],['Contiene',TIN]],img:'assets/products/gel-cubre-canas.jpg'},
{id:'shaving',n:'Shaving Gel',sub:'For men · aloe vera',cap:'Shaving Gel For Men',c:'#FF6A00',v:'paper',d:'Gel de afeitar for men. Contiene aloe vera.',r:[['Contenido','250 ml'],['Contiene','Aloe vera · Eucalipto · Mentol'],['Uso','Afeitado']],img:'assets/products/shaving-gel.jpg'},
{id:'splash',n:'Body Splash',sub:'For men',cap:'Body Splash For Men',c:'#4BA3DC',tx:'#061018',v:'color',d:'Splash corporal. Eucalipto y mentol. Se aplica en la zona del cuerpo que se requiera.',r:[['Contenido','250 ml'],['Contiene','Eucalipto · Mentol'],['Uso','Cuerpo']],img:'assets/products/splash.jpg'},
{id:'ducha',n:'Ducha íntima',sub:'For men',cap:'Ducha Íntima For Men',c:'#A4D800',v:'dark',d:'Higiene masculina. Sin fragancia, sin colorantes y sin parabenos.',r:[['Contenido','180 g'],['Fórmula','Sin fragancia ni parabenos'],['Uso','Externo']],img:'assets/products/ducha-intima.jpg'}];
const PES={cera:24000,pasta:24000,pomada:24000,'cera-fibra':24000,kids:24000,anticaida:34000,carbon:32000,serum:20000,tonico:52000,'pasta-minoxidil':24000,'cubre-canas':24000,shaving:29000,splash:29000,ducha:29000};
const cop=n=>'$'+Number(n).toLocaleString('es-CO');
PR.forEach((p,j)=>{p.ref=String(j+1).padStart(2,'0');p.price=PES[p.id]||0;p.r.unshift(['Precio',cop(p.price)])});
const hd=n=>`<div class="hd"><img src="assets/isotipo-rojo.png" alt=""><span>${n}</span></div>`;
const rows=r=>r.map(x=>`<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('');
const shot=p=>p.img||A('p-'+p.id+'.jpg');
const imgP=j=>{const p=PR[j];return `<div class="pg img" data-p="${j}"><img src="${shot(p)}" alt="${p.cap}"><div class="capline"><span>${p.cap}</span><b class="px">${cop(p.price)}</b></div><b class="zm">+</b></div>`};
const infoP=(j,n)=>{const p=PR[j],cls=p.v==='color'?'pg col':p.v==='dark'?'pg dark':'pg',st=`--ac:${p.c}`+(p.v==='color'?`;--bg:${p.c};--fg:${p.tx}`:'');
 return `<div class="${cls}" style="${st}">${hd(n)}<div class="num">${p.ref}</div><h2 data-p="${j}">${p.n}<em>${p.sub}</em></h2><p>${p.d}</p><dl>${rows(p.r)}</dl><button class="more" data-p="${j}">Ver detalle +</button></div>`};
const mini=a=>`<div class="mini">${a.map(r=>`<div><b>${r[0]}</b><span>${r[1]}</span></div>`).join('')}</div>`;
const cover=`<div class="pg cover brand-cover"><span class="rail" aria-hidden="true"></span><img class="lg" src="assets/logo.png" alt="Vinicius Molding"><span class="brand-bars" aria-hidden="true"></span></div>`;
const back=`<div class="pg dark cover bk"><img class="iso" src="assets/isotipo.png" alt=""><small>@viniciusmolding</small></div>`;
const S=[
[`<div class="pg dark">${hd(2)}<h2>Quiénes somos</h2><p>Somos una marca de cuidado capilar masculino creada para hombres que no improvisan, que cuidan cada detalle y saben que el éxito también se construye desde el cuero cabelludo.</p><p>No vendemos promesas, entregamos resultados.</p></div>`,
 `<div class="pg red">${hd(3)}<div class="big">Somos la solución, no el problema</div><p>Productos capilares que funcionan, sin rodeos ni falsas promesas.</p></div>`],
[`<div class="pg dark">${hd(4)}<div class="lids">${['cera','pasta','pomada','fibra'].map(k=>`<img src="${A('lid-'+k+'.jpg')}" alt="">`).join('')}</div><h2>Colección</h2><p>${PR.length} productos para moldear, limpiar y cuidar el cabello, la barba y el cuerpo.</p></div>`,
 `<div class="pg">${hd(5)}<h2>Contenido</h2><ol class="idx">${PR.map((p,j)=>`<li data-go="${3+j}"><b>${p.n}</b><i>${p.sub}</i><span>${6+2*j}</span></li>`).join('')}</ol></div>`],
...PR.map((p,j)=>j%2? [imgP(j),infoP(j,7+2*j)] : [infoP(j,6+2*j),imgP(j)]),
[`<div class="pg dark">${hd(6+PR.length*2)}<h2>La línea completa</h2><p>${PR.length} piezas en la revista: molding, limpieza, tratamiento y cuerpo.</p></div>`,
 `<div class="pg dark">${hd(7+PR.length*2)}<h2>Pide el tuyo</h2><p>Fabricado por Cosmypro Lab, Cali-Valle. Comercializado por Vinicius Molding.</p><a class="cta" href="${WA}" target="_blank" rel="noopener">WhatsApp Valle del Cauca</a><a class="cta w" href="https://wa.me/573235744284" target="_blank" rel="noopener">WhatsApp Risaralda</a><a class="cta w" href="${IG}" target="_blank" rel="noopener">@viniciusmolding</a></div>`]];
const CAP=['Cubierta','Quiénes somos','Colección · Contenido',...PR.map(p=>p.cap),'Contacto'];
const fr=[cover],bk=[S[0][0]];for(let i=1;i<=S.length-1;i++){fr.push(S[i-1][1]);bk.push(S[i][0])}fr.push(S[S.length-1][1]);bk.push(back);
// ---- hojas articuladas en tramos (se doblan de verdad)
const SG=6,book=document.getElementById('book');book.innerHTML='<i class="bsh"></i><i class="edge el"></i><i class="edge er"></i>';
const leaves=fr.map((f,i)=>{const l=document.createElement('div');l.className='leaf';let par=l;const segs=[];
 for(let k=0;k<SG;k++){const s=document.createElement('div');s.className='seg';s.style.cssText=`left:${k?'calc(var(--pw)/6)':0};width:calc(var(--pw)/6)`;
  s.innerHTML=`<div class="sf${k?'':' g'}"><div class="cl" style="left:calc(var(--pw)/-6*${k})">${f}</div></div><div class="sb${k?'':' g'}"><div class="cl" style="left:calc(var(--pw)/-6*${SG-1-k})">${bk[i]}</div></div>`;
  par.appendChild(s);par=s;segs.push(s)}
 book.appendChild(l);return{l,segs,key:''}});
const glow=document.createElement('i');glow.className='book-light';glow.setAttribute('aria-hidden','true');book.appendChild(glow);
const N=leaves.length,stage=document.getElementById('stage'),tilt=document.getElementById('tilt'),hero=document.getElementById('hero'),desk=document.getElementById('desk');
const vig=document.querySelector('.vig'),cap=document.getElementById('cap'),bar=document.getElementById('bar');
const cl=x=>Math.max(0,Math.min(1,x)),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const STEP=.78/(N-2),DUR=.03,KP=.84/(N-2);
const win=i=>window.PORT?[.02+i*KP,.02+i*KP+.02]:(i===0?[.03,.07]:[.1+(i-1)*STEP,.1+(i-1)*STEP+DUR]);
function pan(p){if(!window.PORT)return 0;if(p<win(0)[0])return 0;
 for(let i=0;i<N-1;i++){const[a,b]=win(i);if(p>=a&&p<=b){const t=ease((p-a)/(b-a));return i===0?-t:1-2*t}
  const nx=i<N-2?win(i+1)[0]:1;if(p>b&&p<nx){const u=(p-b)/(nx-b);return u<.28?-1:u<.58?-1+2*ease((u-.28)/.3):1}}return 1}
const steps=()=>{const a=[0];for(let s=1;s<N;s++){const b=win(s-1)[1],nx=s<N-1?win(s)[0]:1,pl=nx-b;a.push(b+pl*.14,b+pl*.8)}return a};
const endP=s=>s===0?0:win(s-1)[1]+.004;
let target=0,cur=0,state=-1;const sy=()=>stage.offsetHeight-innerHeight;
const D=Math.PI/180;
function setLeaf(i,p){const [a,b]=win(i),t=cl((p-a)/(b-a)),e=ease(t),L=leaves[i],key=i===N-1?'x':t.toFixed(4);if(L.key===key)return e>=.5;L.key=key;
 const sn=Math.sin(Math.PI*t),th=-180*e,bb=1.4*(1-2*e)+18*Math.pow(sn,.72);
 L.l.style.transform=`translateZ(${(e>=.5?i*.3:(N-i)*.3)+sn*42}px)`;
 L.segs.forEach((s,k)=>{s.style.transform=`rotateY(${k?bb:th}deg)`;const ang=(th+k*bb)*D,c=Math.cos(ang),sf=s.children[0],sb=s.children[1];
  sf.style.setProperty('--sh',c>0?((1-c)*.7).toFixed(3):1);sb.style.setProperty('--sh',c<0?((1+c)*.7).toFixed(3):1)});
 return e>=.5}
function draw(p){
 const c=ease(cl(p/.2)),w0=win(0),o=ease(cl((p-w0[0])/(w0[1]-w0[0])));
 const cP=window.PORT?ease(cl(p/.06)):c,sc=window.PORT?.78+.22*cP:.8+.36*c,pn=pan(p),px=-pn*PW()/2*sc/innerWidth*100;
 window.CAMT=window.PORT?{rx:52-24*cP,s:sc,tx:px,ty:-4*(1-cP)-9*cP,rz:-3+2.4*cP}:{rx:56-22*c,s:sc,tx:3*(1-c),ty:-3*(1-c)-2.5*c,rz:-3+2.4*c};
 if(!window.GLon)tilt.style.transform=`translate3d(${CAMT.tx}vw,${CAMT.ty}vh,0) rotateX(${CAMT.rx}deg) rotateZ(${CAMT.rz}deg) scale(${CAMT.s})`;
 book.style.setProperty('--o',o);book.style.transform=`translateX(calc(var(--pw)*${-.5*(1-o)}))`;
 vig.style.opacity=1-.85*ease(cl((p-.04)/.2));hero.style.opacity=1-cl((p-.02)/.08);hero.style.transform=`translateY(${-cl(p/.12)*30}px)`;
 let fl=0;leaves.forEach((_,i)=>{if(setLeaf(i,p))fl++});
 book.style.setProperty('--tl',(2+fl*1.1)+'px');book.style.setProperty('--tr',(2+(N-1-fl)*1.1)+'px');
 bar.style.width=p*100+'%';if(fl!==state){state=fl;cap.textContent=CAP[fl]}}
let flipJob=0,lock=0;
function loop(){if(lock)return;cur+=(target-cur)*.2;if(Math.abs(target-cur)<.0004)cur=target;draw(cur);if(cur!==target)requestAnimationFrame(loop)}
function playTo(p){const job=++flipJob,from=cur,t0=performance.now(),dur=920;lock=1;const step=now=>{if(job!==flipJob)return;const t=Math.min(1,(now-t0)/dur);cur=from+(p-from)*ease(t);draw(cur);if(t<1)requestAnimationFrame(step);else{cur=p;draw(p);lock=0}};requestAnimationFrame(step)}
const read=()=>{if(lock)return;flipJob++;target=cl(scrollY/sy());loop()};
const go=s=>{s=Math.max(0,Math.min(N-1,s));const p=window.PORT?steps()[s?2*s-1:0]:endP(s);if(Math.abs(p-cur)<.001)return;lock=1;scrollTo({top:p*sy(),behavior:'auto'});playTo(p)};
const nav=d=>{if(!window.PORT){go(state+d);return}const a=steps();let k=0;a.forEach((v,i)=>{if(Math.abs(v-cur)<Math.abs(a[k]-cur))k=i});k=Math.max(0,Math.min(a.length-1,k+d));const p=a[k];lock=1;scrollTo({top:p*sy(),behavior:'auto'});playTo(p)};
addEventListener('wheel',()=>{if(!lock)return;flipJob++;lock=0},{passive:true});
document.getElementById('next').onclick=()=>nav(1);document.getElementById('prev').onclick=()=>nav(-1);
// ---- detalle de producto
const Z=document.getElementById('zoom'),$=id=>document.getElementById(id);let zi=0;
function openZ(j){const p=PR[j];zi=j;$('zimg').src=shot(p);$('zimg').alt=p.cap;$('zref').textContent='N.º '+p.ref+' · Vinicius Molding';$('zname').textContent=p.cap;$('zsub').textContent=p.sub;$('zdesc').textContent=p.d;$('zrows').innerHTML=rows(p.r);
 $('zwa').href=WA+'?text='+encodeURIComponent(`Hola, quiero información de ${p.cap} (N.º ${p.ref})`);Z.querySelector('.zi').classList.remove('z2');Z.style.setProperty('--ac',p.c);Z.hidden=false;document.body.style.overflow='hidden';$('zx').focus()}
const closeZ=()=>{Z.hidden=true;document.body.style.overflow=''};
$('zx').onclick=closeZ;Z.addEventListener('click',e=>{if(e.target===Z)closeZ()});
$('zp').onclick=()=>openZ((zi+PR.length-1)%PR.length);$('zn').onclick=()=>openZ((zi+1)%PR.length);
const zi_=Z.querySelector('.zi');zi_.onclick=()=>zi_.classList.toggle('z2');
zi_.addEventListener('pointermove',e=>{const r=zi_.getBoundingClientRect();$('zimg').style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`});
addEventListener('keydown',e=>{if(!Z.hidden){if(e.key==='Escape')closeZ();if(e.key==='ArrowRight')$('zn').click();if(e.key==='ArrowLeft')$('zp').click();return}
 if(e.key==='ArrowRight'||e.key==='ArrowDown')nav(1);if(e.key==='ArrowLeft'||e.key==='ArrowUp')nav(-1)});
// ---- clic en el libro: abrir, pasar página, ampliar producto
book.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){go(+g.dataset.go);return}
 if(e.target.closest('a'))return;if(state===0){nav(1);return}
 const z=e.target.closest('[data-p]');if(z&&z.matches('button,h2')){openZ(+z.dataset.p);return}
 const r=book.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;
 if(!window.PORT){if(x>.94){nav(1);return}if(x<.06){nav(-1);return}}
 if(z)openZ(+z.dataset.p)});
book.style.cursor='pointer';
let sx=0,sy0=0;stage.addEventListener('pointerdown',e=>{sx=e.clientX;sy0=e.clientY});
stage.addEventListener('pointerup',e=>{const dx=e.clientX-sx,dy=e.clientY-sy0;if(Math.abs(dx)>60&&Math.abs(dy)<45)nav(dx<0?1:-1)});
addEventListener('scroll',read,{passive:true});addEventListener('resize',read);
read();draw(cur);
})();
