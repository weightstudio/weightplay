var x=Object.defineProperty;var d=(n,a)=>x(n,"name",{value:a,configurable:!0});export function cutawayOccludes({x:n,y:a,depth:i,height:r,mask:c=1},e,g=-1e6){if(c<.5||r<g||!e.enabled)return!1;const o=e.bx-e.ax,t=e.by-e.ay,v=o*o+t*t,l=v?Math.max(0,Math.min(1,((n-e.ax)*o+(a-e.ay)*t)/v)):0;return Math.hypot(n-e.ax-l*o,a-e.ay-l*t)<e.radius&&i<e.az+(e.bz-e.az)*l-1e-5}d(cutawayOccludes,"cutawayOccludes");export function installCutaway(n,a,{hero:i=!1}={}){if(i||n.userData?.sunmaneActor==="hero")return!1;n.customProgramCacheKey=()=>"sunmane-foreground-aperture-v1",n.onBeforeCompile=r=>{Object.assign(r.uniforms,a),r.vertexShader=`varying float vCoverHeight;
`+r.vertexShader,r.vertexShader=r.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
vec4 coverWorld=vec4(transformed,1.0);
#ifdef USE_INSTANCING
coverWorld=instanceMatrix*coverWorld;
#endif
coverWorld=modelMatrix*coverWorld;vCoverHeight=coverWorld.y;`),r.fragmentShader=`uniform vec4 coverSegments[3];uniform vec4 coverDetails[3];uniform float coverGround;varying float vCoverHeight;
`+r.fragmentShader,r.fragmentShader=r.fragmentShader.replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
   if(vCoverHeight>coverGround+.55){
    for(int i=0;i<3;i++){
     vec4 s=coverSegments[i],d=coverDetails[i];vec2 line=s.zw-s.xy;float t=clamp(dot(gl_FragCoord.xy-s.xy,line)/max(dot(line,line),.0001),0.,1.);
     if(d.w>.5&&distance(gl_FragCoord.xy,mix(s.xy,s.zw,t))<d.z&&gl_FragCoord.z<mix(d.x,d.y,t)-.00001){
      if(mod(floor(gl_FragCoord.x)+2.*floor(gl_FragCoord.y),4.)<3.)discard;
     }
    }
   }`)}}d(installCutaway,"installCutaway");
