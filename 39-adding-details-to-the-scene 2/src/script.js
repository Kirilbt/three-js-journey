import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'

console.log(firefliesVertexShader);


/**
 * Base
 */
// Debug
const debugObject = {}
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked Material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// Lamp Light Material
const lampLightMaterial = new THREE.MeshBasicMaterial({ color: 0xfff1db })

// Portal Light Material
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xfff1db })

/**
 * Model
 */
gltfLoader.load(
  'portal.glb',
  (gltf) => {
    const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
    const lampLightAMesh = gltf.scene.children.find(child => child.name === 'lampLight')
    const lampLightBMesh = gltf.scene.children.find(child => child.name === 'lampLight001')
    const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')

    bakedMesh.material = bakedMaterial
    lampLightAMesh.material = lampLightMaterial
    lampLightBMesh.material = lampLightMaterial
    portalLightMesh.material = portalLightMaterial
    gltf.scene.rotation.y = Math.PI

    scene.add(gltf.scene)
  }
)

/**
 * Fireflies
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const firefliesPosition = new Float32Array(firefliesCount * 3)

for (let i = 0; i < firefliesCount; i++) {
  firefliesPosition[i * 3 + 0] = (Math.random() - 0.5) * 4
  firefliesPosition[i * 3 + 1] = Math.random() * 1.75
  firefliesPosition[i * 3 + 2] = (Math.random() - 0.5) * 4
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(firefliesPosition, 3))

// Material
const firefliesMaterial = new THREE.PointsMaterial({ size: 0.1, sizeAttenuation: true})

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

debugObject.clearColor = '#322d1a'
renderer.setClearColor(debugObject.clearColor)
gui
  .addColor(debugObject, 'clearColor')
  .onChange(() => {
    renderer.setClearColor(debugObject.clearColor)
  })

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
