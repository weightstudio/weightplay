// Each expedition has an authored seam layout/objective; no random reroll on retry.
const rows = [
 ['初探礦井','First Descent','depth','SCG',0], ['銅脈岔路','Copper Fork','copper','CSC',3],
 ['黃金支線','Golden Detour','gold','GSC',2], ['滿載而歸','Full Hold','cargo','CGS',15],
 ['礦脈之門','Vein Gate','balanced','CGC',2],
 ['冷泉入口','Coolant Spring','depth','WCG',0], ['冰水迴路','Cold Circuit','coolant','CWS',3],
 ['冷熱交替','Thermal Rhythm','gold','GWG',4], ['金脈速採','Golden Circuit','gold','WCG',3],
 ['泉眼封層','Spring Seal','balanced','CWG',4],
 ['熔岩前緣','Magma Edge','depth','LCS',0], ['危險金脈','Risky Gold','gold','GLS',5],
 ['避火通道','Safe Passage','safe','LSC',0], ['熱流分岔','Thermal Fork','copper','CLG',7],
 ['熔岩閘門','Magma Gate','depth','LWG',0],
 ['水晶回聲','Crystal Echo','crystal','XCS',3], ['輕觸晶簇','Gentle Touch','quality','XWX',4],
 ['晶金取捨','Crystal or Gold','gold','XGL',6], ['冷凝晶洞','Condensed Cavern','coolant','XWL',5],
 ['稜鏡封印','Prism Seal','quality','XWX',7],
 ['高壓岩層','Pressure Stratum','depth','CSG',0], ['洩壓節奏','Venting Rhythm','vent','CWX',4],
 ['壓力金庫','Pressure Vault','gold','GLW',8], ['高壓晶脈','Pressured Crystal','crystal','XLW',7],
 ['深層氣閘','Pressure Lock','vent','XWG',6],
 ['地心裂隙','Core Fissure','balanced','CGX',6], ['移動礦脈','Shifting Seams','quality','XLG',8],
 ['熔金迴廊','Molten Gallery','gold','GLX',10], ['最後冷泉','Last Spring','coolant','WLX',7],
 ['地心之鑰','Heart of the Earth','mastery','XWL',8],
];
export const STAGES = rows.map(([zh,en,goal,pattern,quota],i)=>({id:i+1,zh,en,goal,pattern,quota,
 target:100, arc:Math.floor(i/5), checkpoint:i%5===4, pressure:i>=20, shift:i>=25,
 decision:['路線與收益','水道與鑽力','熔岩與機殼','短按與完整度','洩壓與補給','多規則地心遠征'][Math.floor(i/5)]}));
export const ROCKS = Object.freeze({
 S:{zh:'岩石',en:'Stone',color:0x647182,value:3,hard:1,weight:1},
 C:{zh:'銅礦',en:'Copper',color:0xd88a51,value:9,hard:1.15,weight:1},
 G:{zh:'金礦',en:'Gold',color:0xffd565,value:18,hard:1.5,weight:2},
 W:{zh:'冷卻泉',en:'Coolant',color:0x4cdbd4,value:2,hard:.7,weight:0},
 L:{zh:'熔岩',en:'Magma',color:0xff623d,value:28,hard:1.8,weight:2},
 X:{zh:'水晶',en:'Crystal',color:0x75bfff,value:30,hard:1.7,weight:2},
 I:{zh:'永凍冰礦',en:'Frost',color:0xc1e5ff,value:12,hard:1.65,weight:1},
 B:{zh:'玄武岩',en:'Basalt',color:0x686887,value:14,hard:2.1,weight:1},
 D:{zh:'瓦斯礦',en:'Gas Ore',color:0xa4d87d,value:24,hard:1.2,weight:1},
 E:{zh:'能量礦',en:'Energy',color:0xffa9da,value:22,hard:1.4,weight:1},
});
export function seams(stage,row){
 const out=[...stage.pattern];
 if(row%4===3)out[(row+stage.id)%3]='W';
 if(stage.arc===0&&row%5===4)out[(row+1)%3]='G';
 if(stage.arc>=1&&row%6===2)out[(row+2)%3]='W';
 if(stage.arc===1&&row%5===1)out[(row+1)%3]='I';
 if(stage.arc===2&&row%5===1)out[(row+1)%3]='B';
 if(stage.arc>=3&&row%6===4)out[(row+1)%3]='E';
 if(stage.arc>=4&&row%5===1)out[(row+1)%3]='D';
 // Rotate the authored route every second layer; all choices stay visible.
 const n=(Math.floor(row/(stage.shift?1:2))+stage.id)%3;
 return out.slice(n).concat(out.slice(0,n));
}
