var m=Object.defineProperty;var l=(a,n)=>m(a,"name",{value:n,configurable:!0});export function cutawayOccludes({x:a,y:n,depth:t,height:r,mask:c=1},e,g=-1e6){if(c<.5||r<g||!e.enabled)return!1;const o=e.bx-e.ax,i=e.by-e.ay,d=o*o+i*i,v=d?Math.max(0,Math.min(1,((a-e.ax)*o+(n-e.ay)*i)/d)):0;return Math.hypot(a-e.ax-v*o,n-e.ay-v*i)<e.radius&&t<e.az+(e.bz-e.az)*v-1e-5}l(cutawayOccludes,"cutawayOccludes");export function installCutaway(a,n,{hero:t=!1}={}){a.customProgramCacheKey=()=>t?"sunmane-weapon-aperture-v1":"sunmane-foreground-aperture-v1",a.onBeforeCompile=r=>{Object.assign(r.uniforms,n),r.vertexShader=(t?`attribute float coverPart;varying float vCoverPart;
`:`varying float vCoverHeight;
`)+r.vertexShader,r.vertexShader=r.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
${t?"vCoverPart=coverPart;":`vec4 coverWorld=vec4(transformed,1.0);
#ifdef USE_INSTANCING
coverWorld=instanceMatrix*coverWorld;
#endif
coverWorld=modelMatrix*coverWorld;vCoverHeight=coverWorld.y;`}`),r.fragmentShader=`uniform vec4 coverSegments[3];uniform vec4 coverDetails[3];uniform float coverGround;${t?"varying float vCoverPart;":"varying float vCoverHeight;"}
`+r.fragmentShader,r.fragmentShader=r.fragmentShader.replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
   if(${t?"vCoverPart>.5":"vCoverHeight>coverGround+.55"}){
    for(int i=0;i<3;i++){
     vec4 s=coverSegments[i],d=coverDetails[i];vec2 line=s.zw-s.xy;float t=clamp(dot(gl_FragCoord.xy-s.xy,line)/max(dot(line,line),.0001),0.,1.);
     if(d.w>.5&&distance(gl_FragCoord.xy,mix(s.xy,s.zw,t))<d.z&&gl_FragCoord.z<mix(d.x,d.y,t)-.00001){
      if(mod(floor(gl_FragCoord.x)+2.*floor(gl_FragCoord.y),4.)<3.)discard;
     }
    }
   }`)}}l(installCutaway,"installCutaway");
