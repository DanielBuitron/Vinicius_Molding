(()=>{
const WA='https://wa.me/573235835137',IG='https://instagram.com/viniciusmolding';
const A=f=>(window.IMGS&&IMGS[f])||'assets/'+f;
const pageRatio=1.28;
let layout;
const TIN='Keratina · Romero · Aloe vera',EXT='Romero · Keratina · Cebolla · Aloe vera · Zanahoria · Ácido hialurónico';
const TIN_EN='Keratin · Rosemary · Aloe vera',EXT_EN='Rosemary · Keratin · Onion · Aloe vera · Carrot · Hyaluronic acid';
const PR=[
{id:'cera',n:'Cera',studio:1,img:'assets/revista-productos/cera.webp',sub:'Moldeadora · brillo medio',cap:'Cera Moldeadora',c:'#E52C3B',v:'paper',d:'Define y moldea con brillo medio. Hecha con keratina, romero y aloe vera.',r:[['Contenido','150 g'],['Acabado','Brillo medio'],['Contiene',TIN]]},
{id:'pasta',n:'Pasta',sub:'Moldeadora · brillante',cap:'Pasta Moldeadora',c:'#00C8C2',tx:'#06100f',v:'color',studio:1,img:'assets/revista-productos/pasta.webp',d:'Fijación con acabado brillante para peinados definidos. Con keratina, romero y aloe vera.',r:[['Contenido','150 g'],['Acabado','Brillante'],['Contiene',TIN]]},
{id:'pomada',n:'Pomada',sub:'Moldeadora · mate',cap:'Pomada Moldeadora',c:'#A4D800',v:'dark',studio:1,img:'assets/revista-productos/pomada.webp',d:'Acabado mate y natural, con la fuerza que necesita un peinado de todos los días.',r:[['Contenido','150 g'],['Acabado','Mate'],['Contiene',TIN]]},
{id:'cera-fibra',n:'Cera & Fibra',sub:'Acabado húmedo',cap:'Cera & Fibra',c:'#7B5CB8',v:'paper',studio:1,img:'assets/revista-productos/cera-fibra.webp',d:'Cera y fibra en una sola fórmula para un acabado húmedo con textura.',r:[['Contenido','1200 g'],['Acabado','Húmedo'],['Contiene',TIN]]},
{id:'kids',n:'Cera & Fibra Kids',sub:'Línea Kids',cap:'Cera & Fibra Kids',c:'#FFD300',tx:'#14110a',v:'color',studio:1,img:'assets/revista-productos/kids.webp?v=2',d:'Versión para los más jóvenes, a base de cera de abeja.',r:[['Base','Cera de abeja'],['Uso','Pelo seco o semi seco'],['Contiene',TIN]]},
{id:'anticaida',n:'Shampoo',studio:1,img:'assets/revista-productos/anticaida.webp',sub:'Protección capilar · anticaída',cap:'Shampoo Protección Capilar',c:'#E52C3B',v:'dark',d:'Aporta apariencia de mayor volumen, brillo y suavidad, y cuida el cuero cabelludo.',r:[['Contenido','500 g'],['Contiene',EXT],['Fórmula','Sin sal']]},
{id:'carbon',n:'Shampoo',sub:'Carbón activo',cap:'Shampoo Carbón Activo',c:'#A4D800',v:'paper',studio:1,img:'assets/revista-productos/carbon.webp',d:'Adiós caspa y picazón. Limpia el cuero cabelludo y mantiene el cabello fuerte.',r:[['Contenido','500 ml'],['Contiene',EXT],['Fórmula','Sin sal']]},
{id:'serum',n:'Serum',sub:'Barba · bigote',cap:'Serum Barba · Bigote',c:'#A4D800',tx:'#0c1204',v:'color',studio:1,img:'assets/revista-productos/serum.webp',d:'Cuidado diario para barba y bigote, con aceites naturales.',r:[['Contenido','65 ml · 2.3 fl oz'],['Contiene','Argán · Jojoba · Aloe vera'],['Uso','Externo']]},
{id:'tonico',n:'Tónico',sub:'Orgánico · cuero cabelludo',cap:'Tónico Orgánico',c:'#FFD300',tx:'#14110a',v:'color',d:'Tónico de extractos para el cuero cabelludo. 19 activos.',r:[['Contenido','65 ml'],['Uso','Cuero cabelludo'],['Contiene','Romero · Biotina · Aloe vera']],studio:1,img:'assets/revista-productos/tonico.webp'},
{id:'cubre-canas',n:'Gel',sub:'Cubre canas',cap:'Gel Cubre Canas',c:'#E52C3B',v:'dark',d:'Cubre las canas con un acabado húmedo brillante.',r:[['Contenido','150 g'],['Acabado','Húmedo brillante'],['Contiene',TIN]],studio:1,img:'assets/revista-productos/cubre-canas.webp'},
{id:'tonico-minoxidil',n:'Tónico',sub:'Minoxidil 12.5%',cap:'Tónico Minoxidil 12.5%',c:'#00C8C2',v:'dark',d:'Nutre, fortalece y estimula el crecimiento en cabello, barba y cejas.',r:[['Contenido','65 ml'],['Uso','Cabello · barba · cejas'],['Contiene','Minoxidil 12.5%']],studio:1,img:'assets/revista-productos/tonico-minoxidil.webp'},
{id:'tonico-23',n:'Tónico',sub:'Minoxidil 23%',cap:'Tónico Minoxidil 23%',c:'#E52C3B',v:'dark',d:'Tónico capilar en presentación de 65 ml.',r:[['Contenido','65 ml'],['Contiene','Minoxidil 23%']],studio:1,img:'assets/revista-productos/tonico-23.webp'},
{id:'kit-capilar',n:'Kit Capilar',sub:'Anticaída',cap:'Kit Capilar',c:'#E52C3B',v:'paper',d:'Fortalece el cabello y ayuda a reducir la caída con una rutina completa.',r:[['Tipo','Combo'],['Uso','Rutina diaria'],['Incluye','Shampoo · Tónico']],studio:1,img:'assets/revista-productos/kit-capilar.webp'},
{id:'kit-capilar-completo',n:'Kit Completo',sub:'Con dermaroller',cap:'Kit Capilar Completo',c:'#FFD300',tx:'#14110a',v:'color',d:'Rutina completa con dermaroller de microagujas.',r:[['Tipo','Combo'],['Incluye','Rutina · Dermaroller'],['Enfoque','Crecimiento']],studio:1,img:'assets/revista-productos/kit-capilar-completo.webp'},
{id:'kit-capilar-avanzado',n:'Kit Avanzado',sub:'Cabello · barba · cejas',cap:'Kit Capilar Avanzado',c:'#00C8C2',v:'dark',d:'Kit avanzado para cabello, barba y cejas con dermaroller.',r:[['Tipo','Combo'],['Incluye','Tónico · Dermaroller'],['Enfoque','Avanzado']],studio:1,img:'assets/revista-productos/kit-capilar-avanzado.webp'},
{id:'kit-12-5',n:'Kit 12.5%',sub:'Tónico + rodillo',cap:'Kit Capilar 12.5%',c:'#A4D800',v:'paper',d:'Tónico 12.5% + rodillo para cabello, barba y cejas.',r:[['Tipo','Combo'],['Incluye','Tónico 12.5% · Rodillo'],['Enfoque','Crecimiento']],studio:1,img:'assets/revista-productos/kit-12-5.webp'},
{id:'kit-organico',n:'Kit Orgánico',sub:'Con dermaroller',cap:'Kit Orgánico',c:'#00C8C2',tx:'#06100f',v:'color',d:'Cabello, barba y cejas con dermaroller de microagujas.',r:[['Tipo','Combo'],['Incluye','Tónico orgánico · Dermaroller'],['Enfoque','Orgánico']],studio:1,img:'assets/revista-productos/kit-organico.webp'},
{id:'kit-organico-avanzado',n:'Kit Orgánico Avanzado',sub:'Con rodillo',cap:'Kit Orgánico Avanzado',c:'#FFD300',v:'dark',d:'Tratamiento de crecimiento para cabello, barba y cejas + rodillo.',r:[['Tipo','Combo'],['Incluye','Tónico · Rodillo'],['Enfoque','Avanzado']],studio:1,img:'assets/revista-productos/kit-organico-avanzado.webp'},
{id:'kit-restaurador',n:'Kit Restaurador',sub:'Shampoo + tónico',cap:'Kit Restaurador Capilar',c:'#585E65',v:'paper',d:'Shampoo + tónico orgánico para combatir la caída.',r:[['Tipo','Combo'],['Incluye','Shampoo · Tónico orgánico'],['Enfoque','Restauración']],studio:1,img:'assets/revista-productos/kit-restaurador.webp'},
{id:'kit-crecimiento-23',n:'Kit 23%',sub:'Shampoo + minoxidil 23%',cap:'Kit Crecimiento 23%',c:'#E52C3B',v:'dark',d:'Shampoo protección capilar + tónico minoxidil 23% para cabello y barba.',r:[['Tipo','Combo'],['Incluye','Shampoo · Minoxidil 23%'],['Enfoque','Crecimiento']],studio:1,img:'assets/revista-productos/kit-crecimiento-23.webp'},
{id:'shaving',n:'Shaving Gel',sub:'For men · aloe vera',cap:'Shaving Gel For Men',c:'#FF6A00',v:'paper',d:'Gel de afeitar for men. Contiene aloe vera.',r:[['Contenido','250 ml'],['Contiene','Aloe vera · Eucalipto · Mentol'],['Uso','Afeitado']],studio:1,img:'assets/revista-productos/shaving.webp'},
{id:'splash',n:'Body Splash',sub:'For men',cap:'Body Splash For Men',c:'#4BA3DC',tx:'#061018',v:'color',d:'Splash corporal. Eucalipto y mentol. Se aplica en la zona del cuerpo que se requiera.',r:[['Contenido','250 ml'],['Contiene','Eucalipto · Mentol'],['Uso','Cuerpo']],studio:1,img:'assets/revista-productos/splash.webp'},
{id:'ducha',n:'Ducha íntima',sub:'For men',cap:'Ducha Íntima For Men',c:'#A4D800',v:'dark',d:'Higiene masculina. Sin fragancia, sin colorantes y sin parabenos.',r:[['Contenido','180 g'],['Fórmula','Sin fragancia ni parabenos'],['Uso','Externo']],studio:1,img:'assets/revista-productos/ducha.webp'}];
const accessoryStart=PR.length;
for(const item of CATALOG_ACCESSORIES){
  const copy=Object.fromEntries(['es','en','zh'].map(lang=>{
    const text=lang==='es'?item:item[lang];
    return [lang,{n:text.title,sub:text.finish,cap:text.name,d:text.description,r:[]}];
  }));
  const fill=item.magazineFill;
  PR.push({...copy.es,id:item.id,copy,c:fill||item.accent,v:fill?'color':'dark',tx:'#101014',
    accessory:true,studio:1,img:item.image});
}
const TIN_ZH='角蛋白 · 迷迭香 · 芦荟',EXT_ZH='迷迭香 · 角蛋白 · 洋葱 · 芦荟 · 胡萝卜 · 透明质酸';
const PR_EN={
cera:{n:'Wax',sub:'Molding · medium shine',cap:'Molding Wax',d:'Shapes and defines with medium shine. Made with keratin, rosemary and aloe vera.',r:[['Size','150 g'],['Finish','Medium shine'],['Contains',TIN_EN]]},
pasta:{n:'Paste',sub:'Molding · shiny',cap:'Molding Paste',d:'Hold with a shiny finish for defined styles. With keratin, rosemary and aloe vera.',r:[['Size','150 g'],['Finish','Shiny'],['Contains',TIN_EN]]},
pomada:{n:'Pomade',sub:'Molding · matte',cap:'Molding Pomade',d:'Matte, natural finish with the strength everyday hair needs.',r:[['Size','150 g'],['Finish','Matte'],['Contains',TIN_EN]]},
'cera-fibra':{n:'Wax & Fiber',sub:'Wet look',cap:'Wax & Fiber',d:'Wax and fiber in one formula for a textured wet look.',r:[['Size','200 g'],['Finish','Wet'],['Contains',TIN_EN]]},
kids:{n:'Wax & Fiber Kids',sub:'Kids line',cap:'Wax & Fiber Kids',d:'A version for younger hair, on a beeswax base.',r:[['Base','Beeswax'],['Use','Dry or semi-dry hair'],['Contains',TIN_EN]]},
anticaida:{n:'Shampoo',sub:'Hair protection · anti-hair loss',cap:'Hair Protection Shampoo',d:'Helps hair look fuller, shinier and softer while caring for the scalp.',r:[['Size','500 g'],['Contains',EXT_EN],['Formula','Salt-free']]},
carbon:{n:'Shampoo',sub:'Activated charcoal',cap:'Activated Charcoal Shampoo',d:'Helps with dandruff and itch. Cleanses the scalp and keeps hair strong.',r:[['Size','500 ml'],['Contains',EXT_EN],['Formula','Salt-free']]},
serum:{n:'Serum',sub:'Beard · mustache',cap:'Beard · Mustache Serum',d:'Daily care for beard and mustache, with natural oils.',r:[['Size','65 ml · 2.3 fl oz'],['Contains','Argan · Jojoba · Aloe vera'],['Use','External']]},
tonico:{n:'Tonic',sub:'Organic · scalp',cap:'Organic Tonic',d:'Extract tonic for the scalp. 19 actives.',r:[['Size','65 ml'],['Use','Scalp'],['Contains','Rosemary · Biotin · Aloe vera']]},
'pasta-minoxidil':{n:'Paste',sub:'Minoxidil · beeswax',cap:'Minoxidil Paste',d:'Minoxidil, panthenol and rosemary on a beeswax base. Use on dry or semi-dry hair.',r:[['Size','150 g'],['Base','Beeswax'],['Contains','Minoxidil · Panthenol · Rosemary']]},
'cubre-canas':{n:'Gel',sub:'Gray cover',cap:'Gray Cover Gel',d:'Covers gray hair with a wet glossy finish.',r:[['Size','150 g'],['Finish','Wet glossy'],['Contains',TIN_EN]]},
'tonico-minoxidil':{n:'Tonic',sub:'Minoxidil 12.5%',cap:'Minoxidil Tonic 12.5%',d:'Nourishes, strengthens and boosts growth for hair, beard and brows.',r:[['Size','65 ml'],['Use','Hair · beard · brows'],['Contains','Minoxidil 12.5%']]},
'tonico-23':{n:'Tonic',sub:'Minoxidil 23%',cap:'Minoxidil Tonic 23%',d:'Hair tonic in a 65 ml bottle.',r:[['Size','65 ml'],['Contains','Minoxidil 23%']]},
'kit-capilar':{n:'Hair Kit',sub:'Anti-hair loss',cap:'Hair Kit',d:'Strengthens hair and helps reduce hair loss with a full routine.',r:[['Type','Combo'],['Use','Daily routine'],['Includes','Shampoo · Tonic']]},
'kit-capilar-completo':{n:'Complete Kit',sub:'With dermaroller',cap:'Complete Hair Kit',d:'Complete routine with a microneedle dermaroller.',r:[['Type','Combo'],['Includes','Routine · Dermaroller'],['Focus','Growth']]},
'kit-capilar-avanzado':{n:'Advanced Kit',sub:'Hair · beard · brows',cap:'Advanced Hair Kit',d:'Advanced kit for hair, beard and brows with dermaroller.',r:[['Type','Combo'],['Includes','Tonic · Dermaroller'],['Focus','Advanced']]},
'kit-12-5':{n:'Kit 12.5%',sub:'Tonic + roller',cap:'Hair Kit 12.5%',d:'12.5% tonic + roller for hair, beard and brows.',r:[['Type','Combo'],['Includes','Tonic 12.5% · Roller'],['Focus','Growth']]},
'kit-organico':{n:'Organic Kit',sub:'With dermaroller',cap:'Organic Kit',d:'Hair, beard and brows with a microneedle dermaroller.',r:[['Type','Combo'],['Includes','Organic tonic · Dermaroller'],['Focus','Organic']]},
'kit-organico-avanzado':{n:'Advanced Organic Kit',sub:'With roller',cap:'Advanced Organic Kit',d:'Growth treatment for hair, beard and brows + roller.',r:[['Type','Combo'],['Includes','Tonic · Roller'],['Focus','Advanced']]},
'kit-restaurador':{n:'Restoration Kit',sub:'Shampoo + tonic',cap:'Hair Restoration Kit',d:'Shampoo + organic tonic to help fight hair loss.',r:[['Type','Combo'],['Includes','Shampoo · Organic tonic'],['Focus','Restoration']]},
'kit-crecimiento-23':{n:'Growth Kit 23%',sub:'Shampoo + minoxidil 23%',cap:'Growth Kit 23%',d:'Hair protection shampoo + minoxidil 23% tonic for hair and beard.',r:[['Type','Combo'],['Includes','Shampoo · Minoxidil 23%'],['Focus','Growth']]},
shaving:{n:'Shaving Gel',sub:'For men · aloe vera',cap:'Shaving Gel For Men',d:'Shaving gel for men. Contains aloe vera.',r:[['Size','250 ml'],['Contains','Aloe vera · Eucalyptus · Menthol'],['Use','Shaving']]},
splash:{n:'Body Splash',sub:'For men',cap:'Body Splash For Men',d:'Body splash. Eucalyptus and menthol. Apply where needed.',r:[['Size','250 ml'],['Contains','Eucalyptus · Menthol'],['Use','Body']]},
ducha:{n:'Intimate wash',sub:'For men',cap:'Intimate Wash For Men',d:'Men’s hygiene. No fragrance, dyes or parabens.',r:[['Size','180 g'],['Formula','Fragrance-free, paraben-free'],['Use','External']]}
};
const PR_ZH={
cera:{n:'发蜡',sub:'造型 · 中亮泽',cap:'造型发蜡',d:'中亮泽塑形定型。含角蛋白、迷迭香与芦荟。',r:[['规格','150 g'],['效果','中亮泽'],['成分',TIN_ZH]]},
pasta:{n:'发泥',sub:'造型 · 亮泽',cap:'造型发泥',d:'亮泽定型，打造清晰发型。含角蛋白、迷迭香与芦荟。',r:[['规格','150 g'],['效果','亮泽'],['成分',TIN_ZH]]},
pomada:{n:'发油',sub:'造型 · 哑光',cap:'造型发油',d:'哑光自然效果，满足日常发型所需定型力。',r:[['规格','150 g'],['效果','哑光'],['成分',TIN_ZH]]},
'cera-fibra':{n:'纤维发蜡',sub:'湿润效果',cap:'纤维发蜡',d:'发蜡与纤维合一，打造有质感的湿润造型。',r:[['规格','200 g'],['效果','湿润'],['成分',TIN_ZH]]},
kids:{n:'儿童纤维发蜡',sub:'儿童系列',cap:'儿童纤维发蜡',d:'专为儿童设计的版本，以蜂蜡为基底。',r:[['基质','蜂蜡'],['用法','干发或半干发'],['成分',TIN_ZH]]},
anticaida:{n:'洗发水',sub:'护发 · 防脱',cap:'护发洗发水',d:'提升丰盈、光泽与柔顺感，同时呵护头皮。',r:[['规格','500 g'],['成分',EXT_ZH],['配方','无盐']]},
carbon:{n:'洗发水',sub:'活性炭',cap:'活性炭洗发水',d:'有助于改善头皮屑与瘙痒。清洁头皮，保持发丝强韧。',r:[['规格','500 ml'],['成分',EXT_ZH],['配方','无盐']]},
serum:{n:'精华',sub:'胡须 · 唇须',cap:'胡须 · 唇须精华',d:'胡须与唇须日常护理，含天然油脂。',r:[['规格','65 ml · 2.3 fl oz'],['成分','阿甘 · 荷荷巴 · 芦荟'],['用法','外用']]},
tonico:{n:'精华液',sub:'有机 · 头皮',cap:'有机头皮精华',d:'头皮植物精华。含 19 种活性成分。',r:[['规格','65 ml'],['用法','头皮'],['成分','迷迭香 · 生物素 · 芦荟']]},
'pasta-minoxidil':{n:'发泥',sub:'米诺地尔 · 蜂蜡',cap:'米诺地尔发泥',d:'以蜂蜡为基底，含米诺地尔、泛醇与迷迭香。用于干发或半干发。',r:[['规格','150 g'],['基质','蜂蜡'],['成分','米诺地尔 · 泛醇 · 迷迭香']]},
'cubre-canas':{n:'啫喱',sub:'遮盖白发',cap:'遮盖白发啫喱',d:'遮盖白发，呈现湿润亮泽效果。',r:[['规格','150 g'],['效果','湿润亮泽'],['成分',TIN_ZH]]},
'tonico-minoxidil':{n:'精华液',sub:'米诺地尔 12.5%',cap:'米诺地尔精华 12.5%',d:'滋养、强韧并促进头发、胡须与眉毛生长。',r:[['规格','65 ml'],['用法','头发 · 胡须 · 眉毛'],['成分','米诺地尔 12.5%']]},
'tonico-23':{n:'头皮护理液',sub:'米诺地尔 23%',cap:'23% 米诺地尔头皮护理液',d:'65 毫升瓶装头皮护理液。',r:[['规格','65 ml'],['成分','米诺地尔 23%']]},
'kit-capilar':{n:'护发套装',sub:'防脱',cap:'护发套装',d:'完整护理，强化发丝并帮助减少脱落。',r:[['类型','套装'],['用法','日常护理'],['包含','洗发水 · 精华']]},
'kit-capilar-completo':{n:'完整套装',sub:'含微针滚轮',cap:'完整护发套装',d:'完整护理，搭配微针滚轮。',r:[['类型','套装'],['包含','护理 · 滚轮'],['重点','生发']]},
'kit-capilar-avanzado':{n:'进阶套装',sub:'头发 · 胡须 · 眉毛',cap:'进阶护发套装',d:'头发、胡须与眉毛进阶护理，含微针滚轮。',r:[['类型','套装'],['包含','精华 · 滚轮'],['重点','进阶']]},
'kit-12-5':{n:'12.5% 套装',sub:'精华 + 滚轮',cap:'护发套装 12.5%',d:'12.5% 精华 + 滚轮，护理头发、胡须与眉毛。',r:[['类型','套装'],['包含','12.5% 精华 · 滚轮'],['重点','生发']]},
'kit-organico':{n:'有机套装',sub:'含微针滚轮',cap:'有机套装',d:'头发、胡须与眉毛护理，搭配微针滚轮。',r:[['类型','套装'],['包含','有机精华 · 滚轮'],['重点','有机']]},
'kit-organico-avanzado':{n:'有机进阶套装',sub:'含滚轮',cap:'有机进阶套装',d:'头发、胡须与眉毛生发护理 + 滚轮。',r:[['类型','套装'],['包含','精华 · 滚轮'],['重点','进阶']]},
'kit-restaurador':{n:'修护套装',sub:'洗发水 + 精华',cap:'护发修护套装',d:'洗发水 + 有机精华，帮助对抗脱发。',r:[['类型','套装'],['包含','洗发水 · 有机精华'],['重点','修护']]},
'kit-crecimiento-23':{n:'生发套装 23%',sub:'洗发水 + 米诺地尔 23%',cap:'生发套装 23%',d:'护发洗发水 + 23% 米诺地尔精华，护理头发与胡须。',r:[['类型','套装'],['包含','洗发水 · 米诺地尔 23%'],['重点','生发']]},
shaving:{n:'剃须啫喱',sub:'男士 · 芦荟',cap:'男士剃须啫喱',d:'男士剃须啫喱。含芦荟。',r:[['规格','250 ml'],['成分','芦荟 · 桉树 · 薄荷醇'],['用法','剃须']]},
splash:{n:'身体喷雾',sub:'男士专用',cap:'男士身体喷雾',d:'身体喷雾。桉树与薄荷醇。按需喷涂。',r:[['规格','250 ml'],['成分','桉树 · 薄荷醇'],['用法','身体']]},
ducha:{n:'私密洗护',sub:'男士专用',cap:'男士私密洗护',d:'男士卫生护理。无香精、无色素、无对羟基苯甲酸酯。',r:[['规格','180 g'],['配方','无香精无防腐剂'],['用法','外用']]}
};
const PES={cera:36000,pasta:36000,pomada:36000,'cera-fibra':36000,kids:36000,anticaida:49000,carbon:49000,serum:30000,tonico:67000,'pasta-minoxidil':36000,'cubre-canas':36000,'tonico-minoxidil':47000,'kit-capilar':156000,'kit-capilar-completo':101000,'kit-capilar-avanzado':189000,'kit-12-5':67000,'kit-organico':119000,'kit-organico-avanzado':189000,'kit-restaurador':205000,'kit-crecimiento-23':205000,shaving:29000,splash:29000,ducha:29000};
const cop=n=>typeof money==='function'?money(n):('$'+Number(n).toLocaleString('es-CO'));
const LINK={cera:'cera-brillo',pasta:'pasta',pomada:'pomada','cera-fibra':'cera-fibra',kids:'cera-kids',anticaida:'shampoo-proteccion',carbon:'shampoo-carbon',serum:'serum-barba',tonico:'tonico','pasta-minoxidil':'pasta-minoxidil','cubre-canas':'gel-cubre-canas','tonico-minoxidil':'tonico-minoxidil','kit-capilar':'kit-capilar','kit-capilar-completo':'kit-capilar-completo','kit-capilar-avanzado':'kit-capilar-avanzado','kit-12-5':'kit-12-5','kit-organico':'kit-organico','kit-organico-avanzado':'kit-organico-avanzado','kit-restaurador':'kit-restaurador','kit-crecimiento-23':'kit-crecimiento-23',shaving:'shaving-gel',splash:'splash',ducha:'ducha-intima'};
PR.forEach((p,j)=>{p.ref=String(j+1).padStart(2,'0');if(!p.accessory)p.price=PES[p.id]||0;p._es={n:p.n,sub:p.sub,cap:p.cap,d:p.d,r:p.r.map(row=>row.slice())}});
try{
 const saved=JSON.parse(localStorage.getItem('vm_catalog')||'{}');
 PR.forEach(p=>{
  const s=saved[LINK[p.id]||p.id];
  if(!s)return;
  if(s.name){p.n=s.name;p._es.n=s.name}
  if(s.finish){p.sub=s.finish;p._es.sub=s.finish}
  if(s.description){p.d=s.description;p._es.d=s.description}
  const stockTonicPhoto=p.id==='tonico-23'&&/^\/?assets\/products\/tonico-23\.(?:jpe?g|png)(?:[?#]|$)/i.test(s.image);
  if(s.image&&!p.id.startsWith('kit-')&&!stockTonicPhoto){p.img=s.image;p.bleed=1}
  if(s.price!=null)p.price=Number(s.price);
  if(s.size){
   const row=p._es.r.find(x=>x[0]==='Contenido');
   if(row)row[1]=s.size;
  }
  if(s.ingredients){
   const row=p._es.r.find(x=>x[0]==='Contiene');
   if(row)row[1]=Array.isArray(s.ingredients)?s.ingredients.join(' · '):s.ingredients;
  }
 });
}catch(e){}
const tt=(k,vars)=>typeof t==='function'?t(k,vars):k;
const priceOnRequest=p=>p.accessory||!(p.price>0);
const langNow=()=>typeof getLang==='function'?getLang():'es';
const labelMap=()=>({Precio:tt('mag.price'),Contenido:tt('mag.size'),Acabado:tt('mag.finishLabel'),Contiene:tt('mag.contains'),Base:tt('mag.base'),Uso:tt('mag.use'),Fórmula:tt('mag.formula'),Price:tt('mag.price'),Size:tt('mag.size'),Finish:tt('mag.finishLabel'),Contains:tt('mag.contains'),Use:tt('mag.use'),Formula:tt('mag.formula'),'价格':tt('mag.price'),'规格':tt('mag.size'),'效果':tt('mag.finishLabel'),'成分':tt('mag.contains'),'基质':tt('mag.base'),'用法':tt('mag.use'),'配方':tt('mag.formula')});
function localizePR(){
  const current=langNow(),map=labelMap();
  const pack=current==='zh'?PR_ZH:current==='en'?PR_EN:null;
  PR.forEach(p=>{
    const localized=p.copy?.[current]||pack?.[p.id];
    const src=localized||p._es;
    let n=src.n,sub=src.sub,cap=src.cap,d=src.d,rows=src.r.map(row=>row.slice());
    if((current==='en'||current==='zh')&&!localized&&typeof ensureTextTranslated==='function'){
      n=ensureTextTranslated(p._es.n,current);sub=ensureTextTranslated(p._es.sub,current);cap=ensureTextTranslated(p._es.cap,current);d=ensureTextTranslated(p._es.d,current);
      rows=p._es.r.map(([a,b])=>[a, /[A-Za-zÁÉÍÓÚáéíóúñÑ]/.test(b)&&!/^\d/.test(b)?ensureTextTranslated(b,current):b]);
    }
    p.n=n;p.sub=sub;p.cap=cap;p.d=d;
    p.r=rows.map(([a,b])=>[map[a]||a,b]);
    if(!priceOnRequest(p))p.r.unshift([map.Precio||tt('mag.price'),cop(p.price)]);
  });
}
const hd=n=>`<div class="hd"><img src="assets/isotipo-rojo.png" alt=""><span>${n}</span></div>`;
const rows=r=>r.map(x=>`<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('');
const shot=p=>p.img||A('p-'+p.id+'.jpg');
const askHref=p=>WA+'?text='+encodeURIComponent(tt('mag.waAsk',{name:p.cap,ref:p.ref}));
const magQty={};
const imgP=j=>{const p=PR[j],studio=p.studio?' studio':'',price=priceOnRequest(p)?'':`<b class="px">${cop(p.price)}</b>`;
  return `<div class="pg img${p.bleed?' bleed':''}${studio}" data-p="${j}"><img data-revista-src="${esc(shot(p))}" alt="${esc(p.cap)}" decoding="async"><div class="capline"><span>${p.cap}</span>${price}</div><b class="zm">+</b></div>`};
const infoP=(j,n)=>{const p=PR[j],cls=p.v==='color'?'pg col':p.v==='dark'?'pg dark':'pg',st=`--ac:${p.c}`+(p.v==='color'?`;--bg:${p.c};--fg:${p.tx}`:'');
 const action=priceOnRequest(p)
   ? `<a class="cta" href="${askHref(p)}" target="_blank" rel="noopener">${tt('mag.wa')}</a>`
   : `<div class="buy"><button type="button" class="q" data-mag="q" data-p="${j}" data-dir="-1" aria-label="${tt('mag.less')}">−</button><b data-mag-qty="${j}">${magQty[j]||1}</b><button type="button" class="q" data-mag="q" data-p="${j}" data-dir="1" aria-label="${tt('mag.more')}">+</button><button type="button" class="add" data-mag="add" data-p="${j}">${tt('mag.add')}</button></div>`;
 return `<div class="${cls}" style="${st}">${hd(n)}<div class="num">${p.ref}</div><h2 data-p="${j}">${p.n}<em>${p.sub}</em></h2><p>${p.d}</p><dl>${rows(p.r)}</dl>${action}</div>`};
const cover=`<div class="pg cover brand-cover face-cover"><img class="ph" src="assets/portada.jpg?v=290" alt="Vinicius Molding"></div>`;
const back=`<div class="pg dark cover bk"><img class="iso" src="assets/isotipo.png" alt=""><small>@viniciusmolding</small></div>`;
function buildFaces(){
  localizePR();
  const S=[
  [`<div class="pg dark">${hd(2)}<h2>${tt('mag.whoTitle')}</h2><p>${tt('mag.whoP1')}</p><p>${tt('mag.whoP2')}</p></div>`,
   `<div class="pg red">${hd(3)}<div class="big">${tt('mag.solution')}</div><p>${tt('mag.solutionP')}</p></div>`],
  [`<div class="pg dark">${hd(4)}<div class="lids">${['cera','pasta','pomada','fibra'].map(k=>`<img src="${A('lid-'+k+'.jpg')}" alt="">`).join('')}</div><h2>${tt('mag.collectionTitle')}</h2><p>${tt('mag.collectionP',{n:PR.length})}</p></div>`,
   `<div class="pg">${hd(5)}<h2>${tt('mag.contents')}</h2><button type="button" class="more" data-go="${3+accessoryStart}">${tt('cat.accesorios')}</button><ol class="idx">${PR.map((p,j)=>`<li data-go="${3+j}"><b>${p.n}</b><i>${p.sub}</i><span>${6+2*j}</span></li>`).join('')}</ol></div>`],
  ...PR.map((p,j)=>j%2? [imgP(j),infoP(j,7+2*j)] : [infoP(j,6+2*j),imgP(j)]),
  [`<div class="pg dark">${hd(6+PR.length*2)}<h2>${tt('mag.fullLine')}</h2><p>${tt('mag.fullLineP',{n:PR.length})}</p></div>`,
   `<div class="pg dark">${hd(7+PR.length*2)}<h2>${tt('mag.orderYours')}</h2><p>${tt('mag.orderP')}</p><a class="cta" data-ext="wa" href="${WA}" target="_blank" rel="noopener">WhatsApp</a><a class="cta w" data-ext="ig" href="${IG}" target="_blank" rel="noopener">@viniciusmolding</a></div>`]];
  const fr=[cover],bk=[S[0][0]];for(let i=1;i<=S.length-1;i++){fr.push(S[i-1][1]);bk.push(S[i][0])}fr.push(S[S.length-1][1]);bk.push(back);
  CAP=[tt('mag.cover'),tt('mag.about'),tt('mag.collection'),...PR.map(p=>p.cap),tt('mag.contact')];
  return {fr,bk};
}
let CAP=['Cubierta','Quiénes somos','Colección · Contenido',...PR.map(p=>p.cap),'Contacto'];
let faces;
// ---- hojas articuladas en tramos (se doblan de verdad)
const book=document.getElementById('book');
let leaves=[],segmentCount=0;
function mountBook(){
 const SG=layout.decorations?4:3;
 if(segmentCount===SG)return;
 segmentCount=SG;
 const {fr,bk}=faces;
 book.innerHTML='<i class="bsh"></i><i class="edge el"></i><i class="edge er"></i>';
 leaves=fr.map((f,i)=>{const l=document.createElement('div');l.className='leaf';let par=l;const segs=[];
 for(let k=0;k<SG;k++){const s=document.createElement('div');s.className='seg';s.style.cssText=`left:${k?`calc(var(--pw)/${SG})`:0};width:calc(var(--pw)/${SG})`;
  s.innerHTML=`<div class="sf${k?'':' g'}"><div class="cl" style="left:calc(var(--pw)/-${SG}*${k})">${f}</div></div><div class="sb${k?'':' g'}"><div class="cl" style="left:calc(var(--pw)/-${SG}*${SG-1-k})">${bk[i]}</div></div>`;
  par.appendChild(s);par=s;segs.push(s)}
 book.appendChild(l);return{l,segs,key:''}});
const glow=document.createElement('i');glow.className='book-light';glow.setAttribute('aria-hidden','true');book.appendChild(glow);
 loadSpreadPhotos(Math.max(0,state));
}
const N=PR.length+4,stage=document.getElementById('stage'),tilt=document.getElementById('tilt'),hero=document.getElementById('hero');
const vig=document.querySelector('.vig'),cap=document.getElementById('cap'),bar=document.getElementById('bar');
const magazine=document.getElementById('revista');
const prevButton=document.getElementById('prev'),nextButton=document.getElementById('next');
const contentsShortcut=document.getElementById('mag-contents');
const frame=stage.querySelector('.sticky');
const topBar=magazine.querySelector('.top');
const controls=magazine.querySelector('.ctl');

function measureBook(){
 const width=frame.clientWidth,height=frame.clientHeight;
 const phone=width<700;
 const compact=width<700||height<540;
 const decorations=width>=980&&!compact&&!matchMedia('(pointer: coarse)').matches;
 const root=document.documentElement;
 root.classList.toggle('phone',phone);
 const gap=compact?12:20;
 const inset=phone?8:gap;
 const top=topBar.getBoundingClientRect().bottom+gap;
 const bottom=height-controls.offsetHeight-parseFloat(getComputedStyle(controls).bottom)-gap;
 const available=Math.max(96,bottom-top);
 const pageWidth=Math.floor(Math.min((width-2*inset)/(phone?2.04:2.12),available/(pageRatio*1.03),650));
 const center=top+available/2;
 const coverScale=phone?Math.min(1.73,available/(pageWidth*pageRatio*1.04)):1;
 window.MAG_LAYOUT=layout={width,height,center,pageWidth,coverScale,compact,decorations};
 root.style.setProperty('--pw',pageWidth+'px');
 root.style.setProperty('--ph',pageWidth*pageRatio+'px');
 root.style.setProperty('--mag-book-top',center+'px');
 root.style.setProperty('--mag-controls-height',controls.offsetHeight+'px');
 stage.style.height=height+(N-1)*95+'px';
}

function onMagazine(){
  return !magazine.hidden && (!location.hash || /^#\/?inicio(?:[/?]|$)/.test(location.hash));
}

function loadSpreadPhotos(page){
  for(let i=Math.max(0,page-2);i<=Math.min(N-1,page+1);i++){
    leaves[i]?.l.querySelectorAll('img[data-revista-src]').forEach(img=>{
      img.src=img.dataset.revistaSrc;
      delete img.dataset.revistaSrc;
    });
  }
}

let deskLoading, decorationLoading;
function loadMagazineScript(src){
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.onload=resolve;
    script.onerror=()=>{script.remove();reject(new Error(src))};
    document.head.appendChild(script);
  });
}
function startMagazineLighting(){
  if(layout.decorations&&!decorationLoading){
    decorationLoading=loadMagazineScript('js/textures.js?v=274')
      .catch(()=>{decorationLoading=null});
  }
  if(!deskLoading){
    deskLoading=loadMagazineScript('js/revista-gl.js?v=286')
      .catch(()=>{deskLoading=null});
  }
  if(window.resumeRevistaDesk)window.resumeRevistaDesk();
}
const cl=x=>Math.max(0,Math.min(1,x)),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const STEP=.80/(N-2),DUR=Math.max(.008,STEP*.2);
const win=i=>i===0?[.03,.08]:[.1+(i-1)*STEP,.1+(i-1)*STEP+DUR];
const places=Array.from({length:N},(_,spread)=>{
 if(spread===0)return 0;
 const done=win(spread-1)[1],next=spread<N-1?win(spread)[0]:1;
 return done+Math.max(0,next-done)*.55;
});
function nearestIndex(list,value){
 let best=0;
 for(let i=1;i<list.length;i++)if(Math.abs(list[i]-value)<Math.abs(list[best]-value))best=i;
 return best;
}
let target=0,cur=0,state=-1;const sy=()=>stage.offsetHeight-frame.clientHeight;
const D=Math.PI/180;
function setLeaf(i,p){const [a,b]=win(i),t=i===N-1?0:cl((p-a)/(b-a)),e=ease(t),L=leaves[i],key=t.toFixed(4);if(L.key===key)return e>=.5;L.key=key;
 const sn=Math.sin(Math.PI*t),th=-180*e,bb=18*Math.pow(sn,.72);
 L.l.style.transform=`translateZ(${(e>=.5?i*.3:(N-i)*.3)+sn*42}px)`;
  L.segs.forEach((s,k)=>{s.style.transform=`rotateY(${k?bb:th}deg)`;const ang=(th+k*bb)*D,c=Math.cos(ang),sf=s.children[0],sb=s.children[1];
  sf.style.setProperty('--sh',c>0?((1-c)*.7).toFixed(3):1);sb.style.setProperty('--sh',c<0?((1+c)*.7).toFixed(3):1);
  sf.style.pointerEvents=c>0.05?'auto':'none';sb.style.pointerEvents=c<-0.05?'auto':'none'});
 return e>=.5}
function draw(p){
 if(!onMagazine()||!leaves.length)return;
 const w0=win(0),o=ease(cl((p-w0[0])/(w0[1]-w0[0])));
 const rx=layout.compact?8:28-8*o;
 window.CAMT={rx,s:1+(Math.max(1,layout.coverScale)-1)*(1-o),tx:0,ty:0,rz:0};
 if(!window.GLon)tilt.style.transform=`translate3d(${CAMT.tx}vw,${CAMT.ty}vh,0) rotateX(${CAMT.rx}deg) rotateZ(${CAMT.rz}deg) scale(${CAMT.s})`;
 book.style.setProperty('--o',o);window.BOOKO=o;book.style.transform=`translateX(calc(var(--pw)*${-.5*(1-o)}))`;
 if(!layout.decorations&&window.resumeRevistaDesk)window.resumeRevistaDesk();
 vig.style.opacity=1-.85*ease(cl((p-.04)/.2));hero.style.opacity=1-cl((p-.02)/.08);hero.style.transform=`translateY(${-cl(p/.12)*30}px)`;
 let fl=0;leaves.forEach((_,i)=>{if(setLeaf(i,p))fl++});
 const behind=fl>0&&p<win(fl-1)[1];
 const ahead=fl<N-1&&p>win(fl)[0];
 const first=Math.max(0,fl-(behind?2:1)),last=Math.min(N-1,fl+(ahead?1:0));
 leaves.forEach(({l},i)=>{const hidden=i<first||i>last;if(l.hidden!==hidden)l.hidden=hidden});
 book.style.setProperty('--tl',(2+fl*1.1)+'px');book.style.setProperty('--tr',(2+(N-1-fl)*1.1)+'px');
 bar.style.width=p*100+'%';if(fl!==state){state=fl;cap.textContent=CAP[fl];if(!lock)loadSpreadPhotos(fl)}}
let flipJob=0,lock=0,scrollFrame=0;
function loop(){
 scrollFrame=0;
 if(lock||!onMagazine())return;
 cur+=(target-cur)*.46;
 if(Math.abs(target-cur)<.0008)cur=target;
 draw(cur);
 if(cur!==target)scrollFrame=requestAnimationFrame(loop);
}
function playTo(p){const job=++flipJob,from=cur,t0=performance.now(),dur=400;lock=1;target=p;const step=now=>{if(job!==flipJob)return;const t=Math.min(1,(now-t0)/dur);cur=from+(p-from)*ease(t);draw(cur);if(t<1)requestAnimationFrame(step);else{cur=p;lock=0;loadSpreadPhotos(state)}};requestAnimationFrame(step)}
let idle=0;
function turnTo(p){
 if(Math.abs(p-cur)<.001)return;
 lock=1;
 scrollTo({top:p*sy(),behavior:'auto'});
 playTo(p);
}
const read=()=>{if(lock||!onMagazine()||!leaves.length)return;flipJob++;target=cl(scrollY/sy());if(!scrollFrame)scrollFrame=requestAnimationFrame(loop);clearTimeout(idle);idle=setTimeout(()=>{if(lock||!onMagazine())return;turnTo(places[nearestIndex(places,target)])},120)};
function go(s){
 if(!onMagazine())return;
 s=Math.max(0,Math.min(N-1,s));
 loadSpreadPhotos(s);
 turnTo(places[s]);
}
function nav(direction){
 if(!onMagazine())return;
 go(nearestIndex(places,lock?target:cur)+direction);
}
addEventListener('wheel',()=>{if(!lock)return;flipJob++;lock=0},{passive:true});
nextButton.onclick=()=>nav(1);prevButton.onclick=()=>nav(-1);
const accessoryShortcut=document.getElementById('mag-accessories');
accessoryShortcut.onclick=()=>go(3+accessoryStart);
contentsShortcut.onclick=()=>go(2);
// ---- detalle de producto
const Z=document.getElementById('zoom'),$=id=>document.getElementById(id);let zi=0;
function openZ(j){const p=PR[j];zi=j;$('zimg').src=shot(p);$('zimg').alt=p.cap;$('zref').textContent=tt('mag.ref',{ref:p.ref});$('zname').textContent=p.cap;$('zsub').textContent=p.sub;$('zdesc').textContent=p.d;$('zrows').innerHTML=rows(p.r);
 $('zrows').hidden=!p.r.length;$('zwa').href=askHref(p);zi_.classList.remove('z2');zi_.classList.toggle('studio',!!p.studio&&!p.bleed);Z.style.setProperty('--ac',p.c);Z.hidden=false;document.body.style.overflow='hidden';$('zx').focus()}
const closeZ=()=>{Z.hidden=true;document.body.style.overflow=''};
$('zx').onclick=closeZ;Z.addEventListener('click',e=>{if(e.target===Z)closeZ()});
$('zp').onclick=()=>openZ((zi+PR.length-1)%PR.length);$('zn').onclick=()=>openZ((zi+1)%PR.length);
const zi_=Z.querySelector('.zi');zi_.onclick=()=>zi_.classList.toggle('z2');
zi_.addEventListener('pointermove',e=>{const r=zi_.getBoundingClientRect();$('zimg').style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`});
addEventListener('keydown',e=>{if(!onMagazine())return;if(!Z.hidden){if(e.key==='Escape')closeZ();if(e.key==='ArrowRight')$('zn').click();if(e.key==='ArrowLeft')$('zp').click();return}
 if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();nav(1)}if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();nav(-1)}});
// ---- clic en el libro: abrir, pasar página, ampliar producto
function setMagQty(j,dir){magQty[j]=Math.max(1,Math.min(20,(magQty[j]||1)+dir));document.querySelectorAll('[data-mag-qty="'+j+'"]').forEach(el=>{el.textContent=magQty[j]})}
function runMagazineAction(button){
  const j=+button.dataset.p;
  if(button.dataset.mag==='q')setMagQty(j,+button.dataset.dir);
  else if(window.addToCart)window.addToCart(LINK[PR[j].id]||PR[j].id,magQty[j]||1);
}
function activateRevista(){
  if(!onMagazine()||typeof esc!=='function')return;
  if(!faces)faces=buildFaces();
  accessoryShortcut.textContent=tt('cat.accesorios');
  contentsShortcut.textContent=tt('mag.contents');
  const old=layout,spread=Math.max(0,state);
  measureBook();
  if(old&&(old.width!==layout.width||old.height!==layout.height)){
    flipJob++;lock=0;clearTimeout(idle);
    cur=target=places[spread];
    scrollTo(0,cur*sy());
  }
  mountBook();
  draw(cur);
  startMagazineLighting();
}
window.activateRevista=activateRevista;
function paintRevistaFaces(){
  if(!onMagazine()||!leaves.length)return;
  accessoryShortcut.textContent=tt('cat.accesorios');
  contentsShortcut.textContent=tt('mag.contents');
  faces=buildFaces();
  const {fr,bk}=faces;
  leaves.forEach((L,i)=>{
    L.segs.forEach((s)=>{
      const sf=s.children[0]&&s.children[0].querySelector('.cl');
      const sb=s.children[1]&&s.children[1].querySelector('.cl');
      if(sf)sf.innerHTML=fr[i];
      if(sb)sb.innerHTML=bk[i];
    });
    L.key='';
  });
  if(cap)cap.textContent=CAP[Math.max(0,state)]||CAP[0];
  loadSpreadPhotos(Math.max(0,state));
  if(!Z.hidden)openZ(zi);
  draw(cur);
}
function refreshRevistaLang(){
  paintRevistaFaces();
}
window.refreshRevistaLang=refreshRevistaLang;
function magAt(x,y){let best=null,bestI=null;document.querySelectorAll('#book>.leaf').forEach((leaf,i)=>{leaf.querySelectorAll(':scope>.seg, :scope .seg').forEach(seg=>{const sr=seg.getBoundingClientRect();if(x<sr.left||x>sr.right||y<sr.top||y>sr.bottom)return;[0,1].forEach(fi=>{const face=seg.children[fi];if(!face||face.style.pointerEvents==='none')return;const back=fi===1;face.querySelectorAll('[data-mag]').forEach(el=>{const r=el.getBoundingClientRect();if(x<r.left-2||x>r.right+2||y<r.top-2||y>r.bottom+2)return;if(bestI===null||(back?i>bestI:i<bestI)){bestI=i;best=el}})})})});return best}
function openExternal(href){if(!href)return;const tab=window.open(href,'_blank','noopener');if(!tab)location.href=href}
function linkAt(x,y){const stack=document.elementsFromPoint?document.elementsFromPoint(x,y):[];for(const el of stack){const a=el.closest&&el.closest('a[href]');if(a&&/^https?:/i.test(a.href))return a}let found=null;document.querySelectorAll('#book a[href]').forEach(a=>{const r=a.getBoundingClientRect();if(r.width<8||r.height<8)return;if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)found=a});return found}
function goAt(x,y){const stack=document.elementsFromPoint?document.elementsFromPoint(x,y):[];for(const el of stack){const g=el.closest&&el.closest('[data-go]');if(g)return g}let found=null;document.querySelectorAll('#book [data-go]').forEach(el=>{const r=el.getBoundingClientRect();if(r.width<8||r.height<8||x<r.left||x>r.right||y<r.top||y>r.bottom)return;const face=el.closest('.sf,.sb');if(face){const fr=face.getBoundingClientRect();if(x<fr.left||x>fr.right||y<fr.top||y>fr.bottom)return}found=el});return found}
book.addEventListener('scroll',event=>{
 const pane=event.target;
 if(!pane.matches('.pg,.idx'))return;
 const face=pane.closest('.sf,.sb');
 const side=face.classList.contains('sf')?'.sf':'.sb';
 const content=pane.classList.contains('idx')?'.idx':'.pg';
 face.closest('.leaf').querySelectorAll(side+' '+content).forEach(peer=>{
  if(peer!==pane&&peer.scrollTop!==pane.scrollTop)peer.scrollTop=pane.scrollTop;
 });
},true);
book.addEventListener('click',e=>{const g=(e.target.closest&&e.target.closest('[data-go]'))||goAt(e.clientX,e.clientY);if(g&&(!e.detail||(Math.abs(e.clientX-sx)<18&&Math.abs(e.clientY-sy0)<18))){e.preventDefault();e.stopPropagation();go(+g.dataset.go);return}
 const link=(e.target.closest&&e.target.closest('a[href]'))||linkAt(e.clientX,e.clientY);if(link&&/^https?:/i.test(link.href)){e.preventDefault();e.stopPropagation();openExternal(link.href);return}
 const mag=(e.target.closest&&e.target.closest('[data-mag]'))||magAt(e.clientX,e.clientY);if(mag){runMagazineAction(mag);return}
 if(e.target.closest('a'))return;if(state===0){nav(1);return}
 const z=e.target.closest('[data-p]');if(z&&z.matches('h2')){openZ(+z.dataset.p);return}
 const r=book.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;
 if(x>.94){nav(1);return}if(x<.06){nav(-1);return}
 if(z)openZ(+z.dataset.p)});
book.style.cursor='pointer';
let sx=0,sy0=0;stage.addEventListener('pointerdown',e=>{sx=e.clientX;sy0=e.clientY});
stage.addEventListener('pointerup',e=>{if((e.target.closest&&e.target.closest('a,button,[data-mag],[data-go]'))||goAt(e.clientX,e.clientY))return;const dx=e.clientX-sx,dy=e.clientY-sy0;if(Math.abs(dx)>70&&Math.abs(dy)<40)nav(dx<0?1:-1)});
addEventListener('scroll',read,{passive:true});
addEventListener('resize',activateRevista);
const bookResize=new ResizeObserver(activateRevista);
bookResize.observe(topBar);
bookResize.observe(controls);
bookResize.observe(frame);
})();
