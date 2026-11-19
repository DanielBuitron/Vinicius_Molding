const accessoryGroups=[
  {name:['Dermaroller','Dermaroller','微针滚轮'],c:'#7B5CB8',
    description:['Rodillo de microagujas con mango curvo.','Microneedle roller with a curved handle.','带弧形手柄的微针滚轮。'],
    models:[['dermaroller','Rodillo de microagujas','Microneedle roller','微针滚轮']]},
  {name:['Lápiz para barba','Beard pencil','胡须笔'],c:'#585E65',
    description:['Lápiz con cepillo para definir el contorno de la barba.','Pencil and brush for defining the beard outline.','配有刷子，可勾勒胡须轮廓。'],
    models:[['lapiz-para-barba','Con cepillo','With brush','配刷子']]},
  {name:['Patillera','Hair trimmer','修边器'],c:'#A4D800',
    description:['Recortadora de uso personal para delinear patillas y contornos.','Personal trimmer for sideburns and edges.','用于修整鬓角和边缘的个人修边器。'],
    models:[['patillera-amarilla','Amarilla','Yellow','黄色'],['patillera-azul','Azul','Blue','蓝色'],['patillera-plateada','Plateada','Silver','银色']]},
  {name:['Soplador','Air blower','吹风机'],c:'#FF6A00',
    description:['Soplador con boquillas y estuche.','Air blower with nozzles and a carrying case.','配有喷嘴和收纳盒。'],
    models:[['soplador-200w','200 W','200 W','200 瓦']]},
  {name:['Tapete magnético','Magnetic mat','磁性垫'],c:'#00C8C2',
    description:['Tapete de 30 × 45 cm con compartimentos para organizar herramientas.','30 × 45 cm mat with compartments for organizing tools.','30 × 45 厘米，带工具收纳分区。'],
    models:[['tapete-con-iman-tijeras','Diseño Tijeras','Scissors design','剪刀图案'],['tapete-con-iman-barber','Diseño Barber','Barber design','理发师图案']]},
  {name:['Tapete sin imán','Non-magnetic mat','非磁性垫'],c:'#E52C3B',
    description:['Tapete estriado de 30 × 45 cm para la mesa de trabajo.','30 × 45 cm ribbed mat for the workstation.','30 × 45 厘米的带纹工作台垫。'],
    models:[['tapete-sin-iman-barbershop','Diseño Barbershop','Barbershop design','理发店图案']]},
  {name:['Porta cuallero','Neck strip dispenser','围颈纸分配器'],c:'#585E65',
    description:['Dispensador para rollo de papel de cuello de barbería.','Dispenser for barber neck strip rolls.','适用于理发用围颈纸卷。'],
    models:[['porta-cuallero','Dispensador','Dispenser','分配器']]},
  {name:['Cuadro redondo','Round sign','圆形挂饰'],c:'#E52C3B',
    description:['Cuadro de 30 cm con cordón para colgar.','30 cm sign with a hanging cord.','直径 30 厘米，附挂绳。'],
    models:[['cuadro-redondo-barbershop','Diseño Barbershop','Barbershop design','理发店图案'],['cuadro-redondo-closed','Diseño Closed','Closed design','打烊图案']]}
];
const accessoryPageColors = {
  "patillera-amarilla": "#FFD300",
  "patillera-azul": "#00C8C2",
  "tapete-con-iman-tijeras": "#A4D800",
  "tapete-con-iman-barber": "#00C8C2",
  "soplador-200w": "#FFD300",
};

const CATALOG_ACCESSORIES = accessoryGroups.flatMap((group) => group.models.map(([id, ...finishes]) => {
  const copy = Object.fromEntries(["es", "en", "zh"].map((lang, i) => [
    lang,
    {
      title: group.name[i],
      name: group.name[i] + " · " + finishes[i],
      finish: finishes[i],
      summary: group.description[i],
      description: group.description[i],
    },
  ]));
  return {
    ...copy.es,
    id,
    en: copy.en,
    zh: copy.zh,
    category: "accesorios",
    accent: group.c,
    magazineFill: accessoryPageColors[id],
    image: "assets/revista-productos/" + id + ".webp",
    consultationOnly: true,
  };
}));
