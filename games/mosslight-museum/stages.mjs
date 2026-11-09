const B=`
F C - 0 9
C F - 0 10
G F - 0 10
F G C - 0 17
F C F - 0 18
M F - 0 10
C M G - 0 17
M M C - 0 16
G M F M - 0 22
M C G M - 0 23
F F C R 1 19
C G C R 1 23
M G G R 1 18
F M C C R 2 25
G G M G R 1 29
L F R 1 11
F L C RT 1 22
L M G RT 1 23
C L L G RT 2 30
M L G M RT 1 31
F C C RB 2 23
G F F RB 2 24
C G L RBT 2 29
L C M C RBT 2 37
F L F M RBT 2 37
G C L M RBT 2 39
M G G L RBT 2 39
C F M L RBT 2 39
L G F L RBT 2 37
M C L C RBT 2 39
F M F RSW 1 18
C F L RSTW 1 22
L F M RSTW 1 23
F F G L RBSTW 2 41
M F F L RBSTW 2 42
C! F M RSTW 1 24
F! G L RSTW 1 23
L G! C RBSTW 2 29
F M F! G RBSTW 2 42
G! M C! L RBSTW 2 40
M C!~ L C RBT 2 38
L F! M~ F RBT 2 36
G!~ G M L RBT 2 38
C G! C!~ L RBSTW 2 39
L~ F! F M RBSTW 2 39
F! M~ L G RBSTW 1 36
M C L~ F! RBSTW 1 38
G L G!~ M RBSTW 1 38
L C!~ F! M RBSTW 1 37
F!~ L M F RBSTW 1 38
C! G!~ L C RBSTW 2 40
G! M~ L C! RBSTW 2 37
F! F!~ M L RBSTW 2 39
L~ M G! F! RBSTW 2 39
M F! C!~ G! RBSTW 2 41
L G!~ M G! RBSTW 2 39
G! F!~ L F! RBSTW 2 40
F!~ L C! C! RBSTW 2 40
L F! M~ C! RBSTW 2 38
F! L~ C! G! RBSTW 2 41
`.trim().split(`
`);export const STAGES=B.map((L,F)=>{const T=L.split(" "),[R,M,C]=T.splice(-3);return{id:F+1,chapter:Math.floor(F/30),guests:T,repairs:R.includes("R"),loans:R.includes("B"),triple:R.includes("T"),case:R.includes("S"),sealedBay:F<40?1:F%3,wet:R.includes("W"),supply:Number(M),target:Number(C),condition:F<2?[3,3,3]:[0,1,2].map(G=>1+(F+G)%3)}}),LESSON={...STAGES[0],id:0,guests:["F"],target:4,condition:[3,3,3],lesson:!0};
