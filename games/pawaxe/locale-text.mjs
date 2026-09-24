// Native Pawaxe UI units and assistive labels; all supported locales own their copy.
const rows={
  en:['HP','s','Companion energy','Back to Main'],
  'zh-Hant':['生命','秒','夥伴能量','返回主畫面'],
  'zh-Hans':['生命','秒','伙伴能量','返回主画面'],
  ja:['体力','秒','仲間のエネルギー','メインに戻る'],
  ko:['체력','초','동료 에너지','메인으로 돌아가기'],
  es:['PV','s','Energía del compañero','Volver al inicio'],
  'pt-BR':['PV','s','Energia do companheiro','Voltar ao início'],
  fr:['PV','s','Énergie du compagnon','Retour à l’accueil du jeu'],
  de:['LP','Sek.','Gefährtenenergie','Zur Hauptansicht'],
  it:['PV','s','Energia del compagno','Torna alla schermata iniziale'],
  ru:['ОЗ','с','Энергия спутника','На главный экран'],
  hi:['स्वास्थ्य','से.','साथी की ऊर्जा','मुख्य स्क्रीन पर लौटें'],
  ar:['الصحة','ث','طاقة الرفيق','العودة إلى الشاشة الرئيسية']
};
const keys=['healthShort','secondsShort','allyEnergy','returnMain'];
export const localeText=Object.fromEntries(Object.entries(rows).map(([locale,row])=>[locale,Object.freeze(Object.fromEntries(keys.map((key,i)=>[key,row[i]])))]));
const segments={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
const formats=new Map();
export function formatSeconds(value,locale){
  if(!Object.hasOwn(localeText,locale))throw new RangeError('Unknown Pawaxe locale');
  if(!Number.isFinite(value))throw new TypeError('Pawaxe seconds must be finite');
  if(!formats.has(locale))formats.set(locale,new Intl.NumberFormat(locale,{minimumFractionDigits:1,maximumFractionDigits:1}));
  return `${formats.get(locale).format(Math.max(0,value))} ${localeText[locale].secondsShort}`;
}
export function localePath(locale,search='',hash=''){
  if(!Object.hasOwn(segments,locale))throw new RangeError('Unknown Pawaxe locale');
  const query=new URLSearchParams(search);query.delete('lang');
  return `/${segments[locale]}/games/pawaxe/${query.size?'?'+query.toString():''}${hash}`;
}
