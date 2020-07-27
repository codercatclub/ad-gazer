@import ./PerlinNoise;

varying float noise;
varying vec2 vUv;
uniform float timeMsec;
uniform float force;
uniform float noiseMag;
uniform float pos;
uniform float offset;

float turbulence(vec3 p) {

  float w = 100.0;
  float t = -.5;

  for (float f = 1.0; f <= 10.0; f++) {
    float power = pow(2.0, f);
    t += abs(pnoise3(vec3(power * p), vec3(10.0, 10.0, 10.0)) / power);
  }

  return t;
}

void main() {
  vUv = uv;
  float time = timeMsec / 1000.0;
  noise = 5.0 * pnoise3((position) + vec3(time, offset, 0.0), vec3(100.0));
  vec3 newPosition = position + vec3(0.2 * sin(time), 0.0, 0.0) * noiseMag * noise;
  vec3 vForce = vec3(force, 0.0, 0.0);
  vec3 vForce2 = vec3(pos, 0.0, 0.0);
  newPosition += 0.5 * cos(3.14 * newPosition.y + time) * vForce - vForce2;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
