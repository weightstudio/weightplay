var x=Object.defineProperty;var l=(t,n)=>x(t,"name",{value:n,configurable:!0});export function cutawayOccludes({x:t,y:n,depth:a,height:r,mask:g=1},e,c=-1e6){if(g<.5||r<c||!e.enabled)return!1;const o=e.bx-e.ax,i=e.by-e.ay,d=o*o+i*i,v=d?Math.max(0,Math.min(1,((t-e.ax)*o+(n-e.ay)*i)/d)):0;return Math.hypot(t-e.ax-v*o,n-e.ay-v*i)<e.radius&&a<e.az+(e.bz-e.az)*v-1e-5}l(cutawayOccludes,"cutawayOccludes");export function installCutaway(t,n,{hero:a=!1}={}){t.customProgramCacheKey=()=>a?"sunmane-weapon-aperture-v2":"sunmane-foreground-aperture-v1",t.onBeforeCompile=r=>{Object.assign(r.uniforms,n),r.vertexShader=(a?`attribute float coverPart;varying float vCoverPart;
`:`varying float vCoverHeight;
`)+r.vertexShader,r.vertexShader=r.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
${a?"vCoverPart=coverPart;":`vec4 coverWorld=vec4(transformed,1.0);
#ifdef USE_INSTANCING
coverWorld=instanceMatrix*coverWorld;
#endif
coverWorld=modelMatrix*coverWorld;vCoverHeight=coverWorld.y;`}`),r.fragmentShader=`uniform vec4 coverSegments[3];uniform vec4 coverDetails[3];uniform float coverGround;${a?"varying float vCoverPart;":"varying float vCoverHeight;"}
`+r.fragmentShader,r.fragmentShader=r.fragmentShader.replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
   if(${a?"vCoverPart>.5":"vCoverHeight>coverGround+.55"}){
    for(int i=0;i<3;i++){
     vec4 s=coverSegments[i],d=coverDetails[i];vec2 line=s.zw-s.xy;float t=clamp(dot(gl_FragCoord.xy-s.xy,line)/max(dot(line,line),.0001),0.,1.);
     if(d.w>.5&&distance(gl_FragCoord.xy,mix(s.xy,s.zw,t))<d.z&&gl_FragCoord.z<mix(d.x,d.y,t)-.00001){
      if(${a?"distance(gl_FragCoord.xy,mix(s.xy,s.zw,t))<d.z*.68||":""}mod(floor(gl_FragCoord.x)+2.*floor(gl_FragCoord.y),4.)<3.)discard;
     }
    }
   }`)}}l(installCutaway,"installCutaway");
