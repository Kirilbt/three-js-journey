import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */

// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 50000

const positions = new Float32Array( count * 3 ) // X, Y, Z
const colors = new Float32Array( count * 3 ) // R, G, B

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(colors, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  color: 'white',
  transparent: true,
  alphaMap: particlesTexture,
  // alphaTest: 0.001 // edges are not transparent
  // depthTest: false // only works when there are no other objects and if the particle are always of the same color
  depthWrite: false, // often the good option
  blending: THREE.AdditiveBlending, // great for sparkles for example, but impacts the performances
  vertexColors: true
})

// Points / Particles
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// // Cube
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1,1,1),
//   new THREE.MeshBasicMaterial({ color: 'red' })
// )
// scene.add(cube)

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // particles.rotation.y = elapsedTime * 0.25

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = particlesGeometry.attributes.position.array[i3 + 0]
      particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
