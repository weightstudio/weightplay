import {CAMPAIGN_LOCALES,campaignCopy} from './campaign-copy.mjs';
import {mahjongMainCopy} from './campaign-main-copy.mjs';
const segments=['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar'];

// One copy source for first response and native language changes. No traffic,
// fabricated scores, or independent title aliases.
export function campaignMetadata(locale,title){
 const index=CAMPAIGN_LOCALES.indexOf(locale);
 if(index<0||!title)throw new Error('Complete locale metadata required');
 const pathname=`/${segments[index]}/games/mahjong-solitaire/`;
 const url=`https://weightplay.com${pathname}`;
 const description=`${campaignCopy(locale).goal} ${mahjongMainCopy(locale).progression}`;
 const image='https://weightplay.com/assets/mahjong-solitaire-cover-v1.webp';
 return {pathname,url,description,image,title:`${title} | WeightPlay`,structured:{
  '@context':'https://schema.org','@type':'VideoGame',name:title,description,url,image,
  inLanguage:locale,gamePlatform:'Web browser',applicationCategory:'Game',
  publisher:{'@type':'Organization',name:'WeightStudio',url:'https://weightplay.com'},
 }};
}

export function applyCampaignMetadata(document,locale,title){
 const metadata=campaignMetadata(locale,title);
 document.title=metadata.title;
 const meta=(attribute,key,value)=>{
  let node=document.head.querySelector(`meta[${attribute}="${key}"]`);
  if(!node){node=document.createElement('meta');node.setAttribute(attribute,key);document.head.append(node);}
  node.content=value;
 };
 meta('name','description',metadata.description);
 for(const [key,value] of Object.entries({title:metadata.title,description:metadata.description,url:metadata.url,image:metadata.image,type:'website',site_name:'WeightPlay'}))meta('property',`og:${key}`,value);
 for(const [key,value] of Object.entries({title:metadata.title,description:metadata.description,image:metadata.image,card:'summary_large_image'}))meta('name',`twitter:${key}`,value);
 let canonical=document.head.querySelector('link[rel="canonical"]');
 if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}
 canonical.href=metadata.url;
 let structured=document.head.querySelector('script[data-mjc-metadata]');
 if(!structured){structured=document.createElement('script');structured.type='application/ld+json';structured.dataset.mjcMetadata='';document.head.append(structured);}
 structured.textContent=JSON.stringify(metadata.structured);
 return metadata;
}
