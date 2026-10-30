// Shared civil calendar for the two scheduled activities; no game or wallet state.
const formatters=new Map(),midnights=new Map(),zones=new Map();
export function validTimeZone(zone){if(typeof zone!=='string'||zone.length>100)return false;if(zones.has(zone))return zones.get(zone);let valid=false;try{valid=!!new Intl.DateTimeFormat('en',{timeZone:zone}).resolvedOptions().timeZone;}catch{}if(zones.size>128)zones.clear();zones.set(zone,valid);return valid;}
export function deviceTimeZone(){try{const zone=Intl.DateTimeFormat().resolvedOptions().timeZone;return validTimeZone(zone)?zone:'UTC';}catch{return 'UTC';}}
export function dayKey(now,zone=deviceTimeZone()){
 if(!validTimeZone(zone)||!Number.isFinite(now))throw Error('CLOCK_INVALID');
 let formatter=formatters.get(zone);if(!formatter){formatter=new Intl.DateTimeFormat('en-US-u-ca-gregory-nu-latn',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'});formatters.set(zone,formatter);}
 const parts=Object.fromEntries(formatter.formatToParts(now).map(p=>[p.type,p.value]));return `${parts.year}-${parts.month}-${parts.day}`;
}
// Search the first instant of the next civil date. This follows IANA DST rules,
// including 23/25-hour days and zones whose midnight is skipped by a transition.
export function nextMidnight(now,zone=deviceTimeZone()){
 return firstDateAfter(dayKey(now,zone),zone);
}
export function firstDateAfter(today,zone){
 const key=zone+':'+today;if(midnights.has(key))return midnights.get(key);
 const seed=Date.parse(today+'T00:00:00Z');if(!Number.isFinite(seed))throw Error('CLOCK_INVALID');
 let lo=seed-36*3600000,hi=seed+60*3600000;
 while(hi-lo>1){const middle=Math.floor((lo+hi)/2);if(dayKey(middle,zone)<=today)lo=middle;else hi=middle;}
 if(midnights.size>64)midnights.clear();midnights.set(key,hi);return hi;
}

export const ACTIVITY_DAYS=Object.freeze({'demon-assault':Object.freeze([1,3,5,0]),'meteor-barrage':Object.freeze([2,4,6,0])});
export function isOpenDay(activity,date){
 const days=ACTIVITY_DAYS[activity];if(!days)throw Error('UNKNOWN_ACTIVITY');
 return days.includes(new Date(date+'T12:00:00Z').getUTCDay());
}
export function isActivityOpen(activity,now=Date.now(),zone=deviceTimeZone()){return isOpenDay(activity,dayKey(now,zone));}
// Return an eligible instant at/after a durable daily fence, without a fixed 24h assumption.
export function openingAtOrAfter(activity,stamp,zone=deviceTimeZone()){
 let at=stamp;for(let i=0;i<8;i++){if(isActivityOpen(activity,at,zone))return at;at=nextMidnight(at,zone);}throw Error('CALENDAR_UNAVAILABLE');
}
export function nextOpening(activity,now=Date.now(),zone=deviceTimeZone()){return openingAtOrAfter(activity,nextMidnight(now,zone),zone);}
