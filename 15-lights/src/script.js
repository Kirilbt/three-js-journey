import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { HemisphereLight, PointLight } from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const ambientLightFolder = gui.addFolder( 'Ambient Light').close()
ambientLightFolder.add(ambientLight, 'visible').name('Visible')
ambientLightFolder.addColor(ambientLight, 'color').name('Color')
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

const directionalLightFolder = gui.addFolder( 'Directional Light').close()
directionalLightFolder.add(directionalLight, 'visible').name('Visible')
directionalLightFolder.addColor(directionalLight, 'color').name('Color')
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

const hemispherelLightFolder = gui.addFolder( 'Hemisphere Light').close()
hemispherelLightFolder.add(hemisphereLight, 'visible').name('Visible')
hemispherelLightFolder.addColor(hemisphereLight, 'color').name('Sky color')
hemispherelLightFolder.addColor(hemisphereLight, 'groundColor').name('Ground color')
hemispherelLightFolder.add(hemisphereLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')

const pointLight = new THREE.PointLight(0xff9900, 0.5, 10, 2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

const pointLightFolder = gui.addFolder( 'Point Light').close()
pointLightFolder.add(pointLight, 'visible').name('Visible')
pointLightFolder.addColor(pointLight, 'color').name('Color')
pointLightFolder.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')
pointLightFolder.add(pointLight, 'distance').min(0).max(20).step(0.01).name('Distance')
pointLightFolder.add(pointLight, 'decay').min(0).max(30).step(0.01).name('Decay')

const rectAreaLight = new THREE.RectAreaLight(0x4c00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

const rectAreaLightFolder = gui.addFolder( 'Rect Area Light').close()
rectAreaLightFolder.add(rectAreaLight, 'visible').name('Visible')
rectAreaLightFolder.addColor(rectAreaLight, 'color').name('Color')
rectAreaLightFolder.add(rectAreaLight, 'intensity').min(0).max(5).step(0.001).name('Intensity')
rectAreaLightFolder.add(rectAreaLight, 'width').min(0.2).max(10).step(0.01).name('Width')
rectAreaLightFolder.add(rectAreaLight, 'height').min(0.2).max(10).step(0.01).name('Height')

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 6, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
spotLight.target.position.x = -0.75
scene.add(spotLight.target)

const spotLightFolder = gui.addFolder( 'Spot Light').close()
spotLightFolder.add(spotLight, 'visible').name('Visible')
spotLightFolder.addColor(spotLight, 'color').name('Color')
spotLightFolder.add(spotLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')
spotLightFolder.add(spotLight, 'distance').min(0).max(15).step(0.001).name('Distance').onChange( value => {
	spotLightHelper.update();
})
spotLightFolder.add(spotLight, 'angle').min(Math.PI * 0.01).max(Math.PI * 1).step(0.001).name('Angle').onChange( value => {
	spotLightHelper.update();
})
spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.001).name('Penumbra')

// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)
hemispherelLightFolder.add(hemisphereLightHelper, 'visible').name('Helper')

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)
directionalLightFolder.add(directionalLightHelper, 'visible').name('Helper')

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)
pointLightFolder.add(pointLightHelper, 'visible').name('Helper')

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
window.requestAnimationFrame(() => {
  spotLightHelper.update()
})
spotLightFolder.add(spotLightHelper, 'visible').name('Helper')

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
rectAreaLightFolder.add(rectAreaLightHelper, 'visible').name('Helper')

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
