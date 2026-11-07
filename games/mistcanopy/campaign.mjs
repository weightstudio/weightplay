const p=`W0|3|4|1|1|clear|W
H1 W3|4|4|1|2|clear|HW
M4 W6|4|4|2|2|clear|HW`,W={W:[1,0,!1],D:[2,0,!1],H:[0,1,!1],F:[0,2,!1],M:[1,1,!1],C:[1,0,!0]},b={clear:["sun"],shade:["sun","shade","normal","shade"],rain:["normal","rain","shade","sun"],frost:["sun","frost","normal","shade"],wind:["normal","wind","sun","rain"],storm:["wind","shade","frost","rain","sun"]};export const stages=p.split(`
`).map((e,t)=>{const[r,n,o,l,a,u,c]=e.split("|"),s=r.split(" ").map(([m,h])=>{const[i,f,d]=W[m];return{slot:Number(h),wet:i,heat:f,salt:d}});return{id:t+1,chapter:Math.floor(t/30)+1,checkpoint:(t+1)%5===0,turns:Number(n),stock:Number(o),sun:Number(l),goal:Number(a),tools:c,forecast:b[u],tiles:s,essential:Number(a)===s.length?[]:[s[0].slot,s.at(-1).slot]}});
