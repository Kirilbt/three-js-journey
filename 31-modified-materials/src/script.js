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

gui.add(dotScreenPass, 'enabled').name('dotScreenPass')
gui.add(dotScreenPass.uniforms[ 'scale' ], 'value').min(0).max(1).step(0.001).name('dotScreenPass_scale')

// Glitch Pass
const glitchPass = new GlitchPass()
glitchPass.goWild = false
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

gui.add(glitchPass, 'enabled').name('glitchPass')
gui.add(glitchPass, 'goWild').name('glitchPass_goWild')

// Unreal Bloom Pass
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled = false
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6
effectComposer.addPass(unrealBloomPass)

gui.add(unrealBloomPass, 'enabled').name('unrealBloomPass')
gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001).name('unrealBloomPass_strength')
gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001).name('unrealBloomPass_radius')
gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001).name('unrealBloomPass_threshold')

// RGB Shift Pass
const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

gui.add(rgbShiftPass, 'enabled').name('rgbShiftPass')

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
