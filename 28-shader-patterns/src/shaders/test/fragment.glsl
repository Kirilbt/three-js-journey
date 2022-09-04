varying vec2 vUv;

void main() {
  // // Pattern 3
  // float strength = vUv.x;

  // // Pattern 4
  // float strength = vUv.y;

  // Pattern 5
  float strength = 1.0 - vUv.y;

  gl_FragColor = vec4(strength, strength, strength, 1.0);
}
