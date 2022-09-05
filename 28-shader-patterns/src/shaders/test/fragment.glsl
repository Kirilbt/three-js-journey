varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  // // Pattern 3
  // float strength = vUv.x;

  // // Pattern 4
  // float strength = vUv.y;

  // // Pattern 5
  // float strength = 1.0 - vUv.y;

  // // Pattern 6
  // float strength = vUv.y * 10.0;

  // // Pattern 7
  // float strength = mod(vUv.y * 10.0, 1.0);

  // // Pattern 8
  // float strength = mod(vUv.y * 10.0, 1.0);
  // strength = step(0.5, strength);

  // // Pattern 9
  // float strength = mod(vUv.y * 10.0, 1.0);
  // strength = step(0.8, strength);

  // // Pattern 10
  // float strength = mod(vUv.x * 10.0, 1.0);
  // strength = step(0.8, strength);

  // // Pattern 11
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

  // // Pattern 12
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

  // // Pattern 13
  // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

  // // Pattern 14
  // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

  // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
  // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

  // float strength = barX + barY;

  // // Pattern 15
  // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

  // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
  // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

  // float strength = barX + barY;

  // // Pattern 16
  // float strength = abs(vUv.x - 0.5);

  // // Pattern 17
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  // // Pattern 18
  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  // // Pattern 19
  // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

  // // Pattern 20
  // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // float strength = square1 * square2;

  // // Pattern 21
  // float strength = floor(vUv.x * 10.0) / 10.0;

  // // Pattern 22
  // float strength = floor(vUv.x * 10.0) / 10.0;
  // strength *= floor(vUv.y * 10.0) / 10.0;

  // // Pattern 23
  // float strength = random(vUv);

  // // Pattern 24
  // vec2 gridUv = vec2(
  //   floor(vUv.x * 10.0) / 10.0,
  //   floor(vUv.y * 10.0) / 10.0
  // );
  // float strength = random(gridUv);

  // // Pattern 25
  // vec2 gridUv = vec2(
  //   floor(vUv.x * 10.0) / 10.0,
  //   floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0
  // );
  // float strength = random(gridUv);

  // // Pattern 26
  // float strength = length(vUv);

  // // Pattern 27
  // // float strength = length(vUv - 0.5);
  // float strength = distance(vUv, vec2(0.5, 0.5));

  // // Pattern 28
  // float strength = 1.0 - distance(vUv, vec2(0.5, 0.5));

  // Pattern 29
  float strength = 0.015 / distance(vUv, vec2(0.5, 0.5));


  gl_FragColor = vec4(strength, strength, strength, 1.0);
}
