varying float noise;
varying vec2 vUv;
uniform sampler2D map;
uniform float colorMag;

void main() {

  vec3 color = texture2D(map, vUv).rgb;
  color = mix(color, vec3(1.0, 0.0, vUv.x), step(.3, colorMag * noise + colorMag));
  gl_FragColor = vec4( color.rgb, 1.0 );

}
