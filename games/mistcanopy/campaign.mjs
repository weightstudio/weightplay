const i=`W0|3|4|1|1|clear|W
H1 W3|4|4|1|2|clear|HW
M4 W6|4|4|2|2|clear|HW
D3 H5 W7|5|5|2|3|clear|HW
M0 H4 D8|5|5|2|3|clear|HW
W2 F4 W6|5|4|2|3|shade|HW
M1 D4 H7|5|5|2|3|rain|HW
H0 H2 D7 M8|6|5|2|4|shade|HW
F1 W3 D5 H7|6|4|2|4|frost|HW
D0 F4 M8 H6|7|5|2|4|frost|HW
F0 D2 M4 W8|6|4|2|4|shade|HWB
D1 F3 M5 H7|6|4|2|4|rain|HWB
M0 M2 D4 H8|6|5|2|4|shade|HWB
F2 D3 H4 M6 W8|7|5|2|4|frost|HWB
D0 F2 M3 M7 H8|7|4|2|5|shade|HWB
F0 D2 W4 M6 F8|7|5|2|4|wind|HWB
D1 H2 F3 M4 D7|7|5|2|4|rain|HWB
M0 F1 W4 F6 D8|7|5|2|4|frost|HWB
D2 F3 W5 M6 M7 H8|8|5|2|5|wind|HWB
D0 M1 F2 D4 F6 H8|8|5|2|6|frost|HWB
M0 F1 D2 H3 D7 W8|7|5|2|5|rain|HWB
D0 H2 M4 F5 F6 D8|8|5|2|5|shade|HWB
F0 M1 D3 H5 M7 W8|7|5|2|5|wind|HWB
D0 F1 M2 F4 D6 H7 W8|8|5|2|6|frost|HWB
M0 D1 F2 W3 H5 F7 D8|8|5|2|7|wind|HWB
F0 W1 M2 F3 D5 H6 D8|8|6|2|6|frost|HWB
D0 F1 H2 M4 D5 M6 F8|8|5|2|6|shade|HWB
M0 W1 F2 D3 M5 F6 D7 H8|9|6|2|7|wind|HWB
D0 F2 M3 F4 W5 M6 D7 H8|9|6|2|7|rain|HWB
F0 D1 M2 W3 F4 M5 D6 H7 F8|10|7|2|9|frost|HWB
D0 D1 H4 W7|5|4|2|4|clear|HWBL
F1 F4 W5 M8|6|4|2|4|shade|HWBL
D2 H3 H4 D6 W8|6|5|2|5|rain|HWBL
M0 D1 F2 M4 F5 H8|7|5|2|5|frost|HWBL
F0 F1 D2 M3 D4 W6 D8|7|5|2|7|wind|HWBL
C0 D1 F4 M8|6|5|2|4|clear|HWBLP
C1 H2 D3 D4 F7|7|5|2|5|shade|HWBLP
D0 C2 M3 F4 F5 W8|7|5|2|5|frost|HWBLP
C0 D1 F3 C4 W7 M8|8|6|2|6|rain|HWBLP
C0 D1 C2 F3 M4 F5 D6 H8|8|6|2|8|wind|HWBLP
C0 C1 H2 D4 F6 M8|8|5|2|5|shade|HWBLP
F0 D1 M2 C3 C6 H7 D8|8|6|2|6|frost|HWBLP
D0 D1 C2 F4 C5 M7 F8|8|6|2|6|rain|HWBLP
M0 F1 C3 D4 F5 H6 D7 C8|9|6|2|7|wind|HWBLP
C0 M1 C2 D3 F4 H5 F6 D7 M8|10|7|2|9|frost|HWBLP
D0 F1 D2 C3 M4 C5 H7 F8|9|6|2|7|storm|HWBLP
C0 D1 F3 M4 D5 C6 F7 H8|9|6|2|7|storm|HWBLP
D0 C1 D2 F3 C4 H5 F6 M7|9|6|2|7|storm|HWBLP
C0 F1 C2 D3 F4 D5 M6 W7 F8|10|7|2|8|storm|HWBLP
F0 C1 D2 C3 M4 C5 D6 F7 H8|10|7|2|9|storm|HWBLP
D0 F1 M2 C3 D4 F5 C6 D7 F8|9|7|2|8|shade|HWBLP
C0 D1 F2 C3 H4 C5 M6 D7 F8|10|7|2|8|wind|HWBLP
F0 M1 C2 D3 C4 F5 D6 H7 C8|10|7|2|8|frost|HWBLP
C0 F1 D2 F3 C4 D5 C6 M7 F8|10|7|2|8|rain|HWBLP
F0 C1 F2 D3 C4 D5 F6 D7 C8|11|7|2|9|storm|HWBLP
C0 M1 D2 D3 F4 C5 F6 C7 D8|10|7|2|8|storm|HWBLP
D0 C1 F2 F3 D4 C5 C6 F7 M8|10|7|2|8|storm|HWBLP
C0 F1 C2 F3 M4 F5 D6 C7 D8|11|7|2|9|storm|HWBLP
F0 C1 D2 C3 F4 C5 D6 D7 F8|11|7|2|9|storm|HWBLP
C0 F1 C2 D3 C4 D5 F6 D7 F8|12|7|2|9|storm|HWBLP`,L={W:[1,0,!1],D:[2,0,!1],H:[0,1,!1],F:[0,2,!1],M:[1,1,!1],C:[1,0,!0]},d={clear:["sun"],shade:["sun","shade","normal","shade"],rain:["normal","rain","shade","sun"],frost:["sun","frost","normal","shade"],wind:["normal","wind","sun","rain"],storm:["wind","shade","frost","rain","sun"]};export const stages=i.split(`
`).map((W,D)=>{const[s,r,t,a,F,M,C]=W.split("|"),H=s.split(" ").map(([o,e])=>{const[n,B,l]=L[o];return{slot:Number(e),wet:n,heat:B,salt:l}});return{id:D+1,chapter:Math.floor(D/30)+1,checkpoint:(D+1)%5===0,turns:Number(r),stock:Number(t),sun:Number(a),goal:Number(F),tools:C,forecast:d[M],tiles:H,essential:Number(F)===H.length?[]:[H[0].slot,H.at(-1).slot]}});
