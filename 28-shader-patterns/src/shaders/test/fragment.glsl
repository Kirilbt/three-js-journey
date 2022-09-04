varying vec2 vUv;

void main() {
  // Pattern 3
  float strength = vUv.x;

  gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);
}
