import ENV from './environment-data.mjs';
export {ENV};

// These sources support the setting, not the invented person's exact experience.
export const LOCAL_SOURCES={
 IND:'https://metnet.imd.gov.in/docs/mausamdocs/17634.pdf',
 CHN:'https://english.www.gov.cn/statecouncil/ministries/202302/17/content_WS63eeeb37c6d0a757729e6d85.html',
 USA:'https://www.nhtsa.gov/road-safety/school-bus-safety',
 JPN:'https://www.us.emb-japan.go.jp/itpr_en/education-system-in-japan.html',
 IDN:'https://ich.unesco.org/en/RL/indonesian-batik-00170',
 PAK:'https://www.worldbank.org/en/news/feature/2021/03/25/managing-groundwater-resources-in-pakistan-indus-basin',
 BGD:'https://www.worldbank.org/en/news/feature/2021/10/07/climate-change-in-bangladesh-impact-on-infectious-diseases-and-mental-health',
 NGA:'https://nimet.gov.ng/downloader?file=admin%2Fuploads%2Fpublications%2F69b81a926afbd_AEROMET+Q2+2025+%281%29.pdf',
 PHL:'https://bagong.pagasa.dost.gov.ph/climate/tropical-cyclone-information',
 TWN:'https://climate.cwa.gov.tw/SeasonalClimate',
 DEU:'https://www.make-it-in-germany.com/en/study-vocational-training/training-in-germany',
 KOR:'https://ich.unesco.org/en/RL/kimjang-making-and-sharing-kimchi-in-the-republic-of-korea-00881',
 FRA:'https://ich.unesco.org/en/RL/artisanal-know-how-and-culture-of-baguette-bread-01883'
};
export const ENV_KEYS=new Set([
 'cityChild','ruralChild','placeChild','cookClean','cookSolid','cookUnknown',
 'waterNear','waterFar','waterUnknown','schoolBroad','schoolMixed','schoolLimited','schoolUnknown',
 'online','offline','internetUnknown','sanitationYes','sanitationNo','sanitationUnknown',
 'farmStart0','farmStart1','industryStart0','industryStart1','serviceStart0','serviceStart1','workStart0','workStart1',
 'cityAdult','ruralAdult','placeAdult','cityNeighbour','ruralNeighbour','placeNeighbour','powerYes','powerNo','powerUnknown',
 'farmMid','industryMid','serviceMid','workMid','careWide','careMixed','careLimited','careUnknown',
 'cityLater','ruralLater','placeLater','farmLate','industryLate','serviceLate','workLate',
 'careWideLate','careMixedLate','careLimitedLate','careUnknownLate',
 'onlineMemory','offlineMemory','unknownMemory','memory0','memory1','local0','local1'
]);
const sectors=['agriculture','industry','services'];
const workNames=['farm','industry','service'];
const band=(value,high,low,keys)=>!Number.isFinite(value)?keys[3]:value>=high?keys[0]:value>=low?keys[1]:keys[2];
const selectWork=(facts,u)=>{
 if(!sectors.every(k=>facts[k]))return 'work';
 const total=sectors.reduce((n,k)=>n+facts[k].value,0);let cumulative=0;
 for(let i=0;i<sectors.length;i++){cumulative+=facts[sectors[i]].value/total;if(u<cumulative)return workNames[i];}
 return 'service';
};
export function newEnvironment(country,sample){
 const f=ENV.countries[country.iso3]||{};
 const draw=(key,n)=>f[key]?sample(n)<f[key].value/100:null;
 return {version:1,cooking:draw('cooking',6001),connected:draw('internet',6002),
  work:selectWork(f,sample(6003)),
  school:band(f.education?.value,85,60,['Broad','Mixed','Limited','Unknown']),
  care:band(f.health?.value,75,55,['Wide','Mixed','Limited','Unknown'])};
}
export function validEnvironment(p){
 return p?.version===1&&[true,false,null].includes(p.cooking)&&[true,false,null].includes(p.connected)
  &&['farm','industry','service','work'].includes(p.work)
  &&['Broad','Mixed','Limited','Unknown'].includes(p.school)&&['Wide','Mixed','Limited','Unknown'].includes(p.care);
}
const tri=(value,yes,no,unknown)=>value===true?yes:value===false?no:unknown;
export function environmentEvent(run,age,sample){
 const p=run.environment,h=run.home;
 const local=Object.hasOwn(LOCAL_SOURCES,run.country);
 const plan=[
  [1,tri(h.urban,'cityChild','ruralChild','placeChild')],
  [3,tri(p.cooking,'cookClean','cookSolid','cookUnknown')],
  [5,tri(h.water,'waterNear','waterFar','waterUnknown')],
  [7,local?'local0':tri(h.urban,'cityAdult','ruralAdult','placeAdult')],
  [10,'school'+p.school],
  [14,tri(p.connected,'online','offline','internetUnknown')],
  [17,tri(h.sanitation,'sanitationYes','sanitationNo','sanitationUnknown')],
  [21,p.work+'Start'+Math.floor(sample(6010)*2)],
  [28,local?'local1':tri(h.urban,'cityNeighbour','ruralNeighbour','placeNeighbour')],
  [35,tri(h.electricity,'powerYes','powerNo','powerUnknown')],
  [43,p.work+'Mid'],[51,'care'+p.care],
  [60,tri(h.urban,'cityLater','ruralLater','placeLater')],
  [69,p.work+'Late'],[78,'care'+p.care+'Late'],
  [87,tri(p.connected,'onlineMemory','offlineMemory','unknownMemory')],
  [97,'memory'+Math.floor(sample(6011)*2)]
 ];
 const item=plan.find(([base],i)=>age===base+(base>17?Math.floor(sample(6100+i)*3):0));
 if(!item)return null;
 return {age,key:item[1],kind:'environment'};
}
export function eventMetric(event,run){
 const k=String(event.key);
 if(k.startsWith('cook'))return 'cooking';
 if(k.startsWith('water'))return 'water';
 if(k.startsWith('school'))return 'education';
 if(/^(online|offline|internet|unknownMemory)/.test(k))return 'internet';
 if(k.startsWith('sanitation'))return 'sanitation';
 if(k.startsWith('power'))return 'electricity';
 if(k.startsWith('care'))return 'health';
 if(/^(farm|industry|service|work)/.test(k))return {farm:'agriculture',industry:'industry',service:'services'}[run.environment.work]||null;
 if(/^(city|rural|place)/.test(k))return 'urban';
 return null;
}
export function environmentFacts(country){
 return {...Object.fromEntries(Object.entries(country.facts).map(([key,value])=>[key,{value,year:2023}])),...ENV.countries[country.iso3]};
}
