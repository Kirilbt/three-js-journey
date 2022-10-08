uniform float uSize;

attribute float aScale;

varying vec3 vColor;

void main() {
  /**
    * Position
    */
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  /**
    * Size
    */
  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / - viewPosition.z);

  /*
  * Color
  */
  vColor = color;
}
