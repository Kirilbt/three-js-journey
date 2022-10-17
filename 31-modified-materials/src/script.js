import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

// scene.background = environmentMap
scene.environment = environmentMap

/**
 * Material
 */

// Textures
const mapTexture = textureLoader.load('/models/me/textures/color.jpg')
mapTexture.encoding = THREE.sRGBEncoding
mapTexture.flipY = false;

const normalTexture = textureLoader.load('/models/me/textures/normal.jpg')

// Material
const material = new THREE.MeshStandardMaterial( {
    map: mapTexture,
    // normalMap: normalTexture
})

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking
})

const customUniforms = {
  uTime: { value: 0 }
}

material.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime

  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform float uTime;

      mat2 get2dRotateMatrix(float _angle) {
        return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
      }
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
      #include <beginnormal_vertex>

      float angle = sin(position.y + uTime) * 1.5;
      mat2 rotateMatrix = get2dRotateMatrix(angle);

      objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex>

      transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime

  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform float uTime;

      mat2 get2dRotateMatrix(float _angle) {
        return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
      }
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex>

      float angle = sin(position.y + uTime) * 1.5;
      mat2 rotateMatrix = get2dRotateMatrix(angle);

      transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}

/**
 * Models
 */
gltfLoader.load(
    '/models/me/me.gltf',
    (gltf) =>
    {
        // Model
        const mesh = gltf.scene.children[0]
        mesh.scale.set(9, 9, 9)
        mesh.rotation.y = Math.PI
        mesh.material = material
        mesh.customDepthMaterial = depthMaterial
        scene.add(mesh)

        // Update materials
        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update Effect Composer
    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Post-Processing
 */
// Render Target
const renderTarget = new THREE.WebGLRenderTarget(
  800,
  600,
  {
    samples: renderer.getPixelRatio() === 1 ? 2 : 0
  }
)

// Effect Composer
const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

// Render Pass
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// Dot Screen Pass
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
dotScreenPass.uniforms[ 'scale' ].value = 1;
effectComposer.addPass(dotScreenPass)

const dotScreenPassFolder = gui.addFolder( 'Dot Screen Pass' );
dotScreenPassFolder.add(dotScreenPass, 'enabled')
dotScreenPassFolder.add(dotScreenPass.uniforms[ 'scale' ], 'value', 0, 1, 0.001)

// Glitch Pass
const glitchPass = new GlitchPass()
glitchPass.goWild = false
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

const glitchPassFolder = gui.addFolder( 'Glitch Pass' );
glitchPassFolder.add(glitchPass, 'enabled')
glitchPassFolder.add(glitchPass, 'goWild')

// Unreal Bloom Pass
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled = false
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6
effectComposer.addPass(unrealBloomPass)

const unrealBloomPassFolder = gui.addFolder( 'Unreal Bloom Pass' );
unrealBloomPassFolder.add(unrealBloomPass, 'enabled')
unrealBloomPassFolder.add(unrealBloomPass, 'strength', 0, 2, 0.001)
unrealBloomPassFolder.add(unrealBloomPass, 'radius', 0, 2, 0.001)
unrealBloomPassFolder.add(unrealBloomPass, 'threshold', 0, 1, 0.001)

// RGB Shift Pass
const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
rgbShiftPass.uniforms[ 'amount' ].value = 0.0015;
effectComposer.addPass(rgbShiftPass)

const rgbShiftPassFolder = gui.addFolder( 'RGB Shift Pass' );
rgbShiftPassFolder.add(rgbShiftPass, 'enabled')
rgbShiftPassFolder.add(rgbShiftPass.uniforms[ 'amount' ], 'value', 0, 1, 0.001)

// Tint Pass - Custom Shader
const TintShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTint: { value: null }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uTint;

    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      color.rgb += uTint;
      gl_FragColor = color;
    }
  `
}

const tintPass = new ShaderPass(TintShader)
tintPass.enabled = false
tintPass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintPass)

const tintPassFolder = gui.addFolder( 'Tint Pass' );
tintPassFolder.add(tintPass, 'enabled')
tintPassFolder.add(tintPass.material.uniforms.uTint.value, 'x', -1, 1, 0.001).name('r')
tintPassFolder.add(tintPass.material.uniforms.uTint.value, 'y', -1, 1, 0.001).name('g')
tintPassFolder.add(tintPass.material.uniforms.uTint.value, 'z', -1, 1, 0.001).name('b')

// Displacement Pass - Custom Shader
const DisplacementShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: null },
    uUvModifier: { value: 10.0 },
    uSinModifier: { value: 0.1}
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uUvModifier;
    uniform float uSinModifier;

    varying vec2 vUv;

    void main() {
      vec2 newUv = vec2(
        vUv.x,
        vUv.y + sin(vUv.x * uUvModifier + uTime) * uSinModifier
      );
      vec4 color = texture2D(tDiffuse, newUv);
      gl_FragColor = color;
    }
  `
}

const displacementPass = new ShaderPass(DisplacementShader)
displacementPass.enabled = false
displacementPass.material.uniforms.uTime.value = 0
effectComposer.addPass(displacementPass)

const displacementPassFolder = gui.addFolder( 'Diplacement Pass' );
displacementPassFolder.add(displacementPass, 'enabled')
displacementPassFolder.add(displacementPass.material.uniforms.uUvModifier, 'value', -25, 25, 0.01).name('uv modifier')
displacementPassFolder.add(displacementPass.material.uniforms.uSinModifier, 'value', -1, 1, 0.001).name('sin modifier')

// Gamma Correction Pass
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammaCorrectionPass)

// Antialias Pass
if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
  const smaaPass = new SMAAPass()
  effectComposer.addPass(smaaPass)

  console.log('using SMAA');
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Material
    customUniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
