// Meshes live in the combat scene and share its depth buffer. Each burst is one
// draw call: curved tubes for trails, tapered solids for fragments and a faceted core.
const styles = {
  fire:  { id: 0, rim: 0xe34316, body: 0xff912a, hot: 0xfff1a8 },
  wind:  { id: 1, rim: 0x238f91, body: 0x65dec3, hot: 0xebfff1 },
  water: { id: 2, rim: 0x2166be, body: 0x45c8f1, hot: 0xddffff },
  light: { id: 3, rim: 0xf29232, body: 0xffcf59, hot: 0xfff9e1 },
  dark:  { id: 4, rim: 0x211435, body: 0x8b49d5, hot: 0xf0a3ff },
};

function burstGeometry(T) {
  const points = [], rays = [], pieces = [], indices = [];
  // Directions sample both hemispheres. No part of the geometry faces the camera.
  function piece(kind, i, count, rings, sides) {
    const start = points.length / 3;
    const seed = (i * .61803399 + kind * .173) % 1;
    const y = (i + .5) * 2 / count - 1;
    const xz = Math.sqrt(1 - y * y), angle = i * 2.399963 + kind * .72;
    for (let j = 0; j <= rings; j++) {
      for (let k = 0; k < sides; k++) {
        const a = k * Math.PI * 2 / sides;
        points.push(j / rings, Math.cos(a), Math.sin(a));
        rays.push(Math.cos(angle) * xz, y, Math.sin(angle) * xz);
        pieces.push(kind, seed);
        if (j === rings) continue;
        const a0 = start + j * sides + k, a1 = start + j * sides + (k + 1) % sides;
        indices.push(a0, a1, a0 + sides, a1, a1 + sides, a0 + sides);
      }
    }
  }
  for (let i = 0; i < 12; i++) piece(0, i, 12, 8, 5);
  for (let i = 0; i < 23; i++) piece(1, i, 23, 4, 5);
  piece(2, 0, 1, 10, 14);
  for (let i = 0; i < 6; i++) piece(3, i, 6, 13, 6);
  piece(4, 0, 1, 10, 16);
  const geo = new T.BufferGeometry();
  geo.setAttribute('position', new T.Float32BufferAttribute(points, 3));
  geo.setAttribute('ray', new T.Float32BufferAttribute(rays, 3));
  geo.setAttribute('piece', new T.Float32BufferAttribute(pieces, 2));
  geo.setIndex(indices);
  geo.boundingSphere = new T.Sphere(new T.Vector3(), 2.4);
  return geo;
}

const vertexShader = `
uniform float age, still;
attribute vec3 ray;
attribute vec2 piece;
varying float heat, alpha, family;
varying vec3 viewPos;
const float pi = 3.14159265;

vec3 flight(vec3 d, float t, float seed) {
  float spread = 1.0 - exp(-4.8 * t);
  vec3 p = d * spread * (.58 + .57 * seed);
#if ELEMENT == 0
  p.y += (.42 + .30 * seed) * t - 1.45 * t*t * step(.5, piece.x);
  p.xz += vec2(-d.z, d.x) * sin(t*5.0) * (.07 + seed*.09);
#elif ELEMENT == 1
  float a = (2.9 + seed) * t;
  p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
  p.x += t*.55;
  p.y = p.y*.55 + sin(t*pi)*.18;
#elif ELEMENT == 2
  p.y = d.y * spread*.65 + (1.0 + seed*.7)*t - 2.0*t*t;
#elif ELEMENT == 3
  p = d * spread * (seed > .58 ? 1.45 : .68);
#elif ELEMENT == 4
  float a = 3.8*t;
  p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
  p *= 1.0 - smoothstep(.32, 1.0, t)*.97;
#endif
  return p;
}

void main() {
  float kind = piece.x, seed = piece.y, u = position.x;
  float t = mix(age, .16, still);
  family = kind;
  vec3 p;
  if (kind > 3.5) {
    float r = (.30 + .31*sin(pi*t))*(1.-.34*t);
    p = r * vec3(sin(pi*u)*position.y,cos(pi*u),sin(pi*u)*position.z);
    heat = .65;
    alpha = .38*(1.-smoothstep(.08,.62,t));
  } else if (kind > 2.5) {
    // Silhouettes unique to each element: rising flame, a helical gust,
    // splash crown, long rays or an inward-curling violet corona.
    float a = seed * 2.0*pi;
    float swell = 1.0-exp(-7.0*t);
    float reach = .20 + .72 * swell;
    float w = sin(pi*u)*(.030+.045*seed);
#if ELEMENT == 0
    a += u*2.5 + t*2.0;
    float r = reach*(.22+u*.28)*(1.0-.42*u);
    p = vec3(r*cos(a), (-.20 + u*(.76+.25*seed))*swell + .45*t, r*sin(a));
#elif ELEMENT == 1
    a += u*3.4+t*3.0;
    float r = reach*(.38+.46*u);
    p = vec3(r*cos(a)+.42*t, (.8*u-.32)*swell, r*sin(a));
    w *= .60;
#elif ELEMENT == 2
    float r = reach*(.25 + u*.58);
    p = vec3(r*cos(a), (.54*sin(u*pi*.83)+u*.16)*swell-.55*t*t, r*sin(a));
    w *= .80;
#elif ELEMENT == 3
    vec3 d = normalize(ray + vec3(.16,0.,0.));
    p = d * (.1+u*1.4)*swell;
    w *= (1.-u)*.64;
#elif ELEMENT == 4
    a -= 4.0*u + 2.8*t;
    float r = reach*(.65+.25*u)*(1.-.87*t);
    p = vec3(r*cos(a), (.74*u-.34)*(1.-t), r*sin(a));
#endif
    p += w*(vec3(cos(a),0,sin(a))*position.y + vec3(-sin(a),.35,cos(a))*position.z);
    heat = .94-.72*u;
    alpha = smoothstep(.0,.04,t)*(1.-smoothstep(.40+.15*seed,.94,t));
  } else if (kind > 1.5) {
    // A small solid flash provides an immediate contact even on the first frame.
    float r = .175*(1.0-smoothstep(.08,.46,t));
#if ELEMENT == 4
    r = .20 + sin(pi*t)*.06;
#endif
    p = r * vec3(sin(pi*u)*position.y, cos(pi*u), sin(pi*u)*position.z);
    heat = .96;
#if ELEMENT == 4
    heat = .05 + .2 * abs(position.y);
#endif
    alpha = 1.0-smoothstep(.22,.79,t);
  } else {
    float trail = kind < .5 ? .17 + seed*.18 : .036 + seed*.04;
    float phase = max(.001, t - (1.0-u)*trail);
    vec3 center = flight(ray, phase, seed);
    vec3 axis = normalize(flight(ray, phase+.004, seed)-center + vec3(.00001));
    vec3 ref = abs(axis.y) < .92 ? vec3(0,1,0) : vec3(1,0,0);
    vec3 across = normalize(cross(axis,ref)), up = cross(axis,across);
    float width = kind < .5 ? .027 : .022;
#if ELEMENT == 0
    width *= kind < .5 ? 1.35 : .75;
#elif ELEMENT == 2
    width *= kind < .5 ? .80 : 1.50;
#elif ELEMENT == 3
    width *= kind < .5 ? .62 : .8;
#endif
    width *= (.6+seed*.7)*pow(max(0.0,sin(pi*u)),.68)*(1.0-t*.71)*smoothstep(.0,.055,t);
    p = center + width*(across*position.y + up*position.z);
    heat = clamp(.25+.65*u+.20*(1.0-t)-.22*seed,0.0,1.0);
    alpha = (1.0-smoothstep(.50+seed*.18,1.0,t)) * smoothstep(0.0,.018,t);
  }
  alpha *= mix(1.0, .85*(1.0-age), still);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  viewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const fragmentShader = `
uniform vec3 rim, body, hot;
varying float heat, alpha, family;
varying vec3 viewPos;
void main(){
  if (alpha < .012) discard;
  vec3 n = normalize(cross(dFdx(viewPos), dFdy(viewPos)));
  float facet = .82 + .18 * abs(dot(n, normalize(vec3(.3,.7,.6))));
  float facing = abs(dot(n,normalize(-viewPos)));
  float edge = pow(1.-min(facing,1.0),2.0);
  float shading = clamp(heat - .24 + .28*facet*facing,0.0,1.0);
  vec3 c = mix(rim, body, smoothstep(.06,.69,shading));
  c = mix(c,hot,smoothstep(.57,1.0,heat));
  float opacity = alpha;
  if (family > 3.5) {
    // Translucent spherical afterglow with a soft outer silhouette.
    c = mix(body,hot,.48);
    opacity *= pow(facing,2.4);
  } else {
    c *= .70 + .35*facet;
    c += hot * (.18*edge + .23*pow(facing,6.0))*heat;
    opacity *= .53+.47*facing;
  }
  gl_FragColor = vec4(c, opacity);
  #include <colorspace_fragment>
}`;

export function createEnemyImpactLayer(T, scene, element, limit = 10) {
  const style = styles[element];
  if (!style) throw new RangeError('Unknown enemy impact element: ' + element);
  let geometry, used = 0, disposed = false;
  const slots = [];

  function makeSlot() {
    geometry ??= burstGeometry(T);
    const material = new T.ShaderMaterial({
      defines: { ELEMENT: style.id }, vertexShader, fragmentShader,
      uniforms: {
        age: { value: 0 }, still: { value: 0 }, rim: { value: new T.Color(style.rim) },
        body: { value: new T.Color(style.body) }, hot: { value: new T.Color(style.hot) },
      },
      transparent: true, depthTest: true, depthWrite: false, side: T.DoubleSide,
      forceSinglePass: true, toneMapped: false,
    });
    const mesh = new T.Mesh(geometry, material);
    mesh.name = 'enemy-impact-' + element;
    mesh.userData.enemyImpact = true;
    scene.add(mesh);
    slots.push(mesh);
    return mesh;
  }
  return {
    get ready() { return !disposed; },
    begin() { for (let i = 0; i < used; i++) slots[i].visible = false; used = 0; },
    draw(_camera, { x, y, z, radius, elapsed, directionX = 1, directionZ = 0, strong = false, reducedMotion = false }) {
      const duration = reducedMotion ? .20 : strong ? .94 : .8;
      if (disposed || used >= limit || ![x,y,z,radius,elapsed].every(Number.isFinite) ||
          radius <= 0 || elapsed < 0 || elapsed >= duration) return false;
      const mesh = slots[used] ?? makeSlot();
      used++;
      mesh.position.set(x,y,z);
      mesh.rotation.y = -Math.atan2(directionZ, directionX);
      mesh.scale.setScalar(radius * (strong ? 1.17 : 1));
      mesh.material.uniforms.age.value = elapsed / duration;
      mesh.material.uniforms.still.value = reducedMotion ? 1 : 0;
      mesh.visible = true;
      return true;
    },
    dispose() {
      disposed = true;
      for (const mesh of slots) { scene.remove(mesh); mesh.material.dispose(); }
      slots.length = used = 0;
      geometry?.dispose();
    },
  };
}
