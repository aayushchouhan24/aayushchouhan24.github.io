import './styles.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import gsap from 'gsap'
import { Power4 } from 'gsap/all'

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

let isAnimating = false, count = 0

const mouse = new THREE.Vector2()
let gyroValue = 0

const scene = new THREE.Scene()
// scene.fog = new THREE.Fog(new THREE.Color('#FFFFFF'), 1, 400)

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(7, sizes.width / sizes.height, 0.01, 1000)
camera.position.set(0, 2.5, 55)
scene.add(camera)

const ambientLight = new THREE.AmbientLight(0x404040)
scene.add(ambientLight)

const loader = new GLTFLoader()
const draco = new DRACOLoader()
draco.setDecoderConfig({ type: 'js' })
draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
loader.setDRACOLoader(draco)

const urls = ['/elephant.glb', '/giraf.glb', '/gorilla.glb'], colors = [0xac519c, 0x86573c, 0x474981]
let groupPose = true, models = [], modelPose = urls.map(() => true)

const Group = new THREE.Group()

const geometry = new THREE.PlaneGeometry(300, 100)
const matcap = new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/nidorx/matcaps@master/1024/2A2D21_555742_898974_6C745B.png')
const mat0 = new THREE.MeshMatcapMaterial({
  color: colors[0],
})
const mat1 = new THREE.MeshMatcapMaterial({ color: colors[1], })
const mat2 = new THREE.MeshMatcapMaterial({ color: colors[0], matcap, })
const mat3 = new THREE.MeshMatcapMaterial({  color: colors[1], matcap,})

const floorA = new THREE.Mesh(geometry, mat0)
const floorB = new THREE.Mesh(geometry, mat1)
floorA.rotation.x = -Math.PI / 2
floorB.rotation.x = Math.PI / 2
floorA.position.z = -10
floorB.position.z = -10

const wallA = new THREE.Mesh(geometry, mat2)
const wallB = new THREE.Mesh(geometry, mat3)
wallA.position.set(0, 50, -50)
wallB.position.set(0, -50, -50)

Group.add(wallA, wallB, floorA, floorB)

urls.map((element, i) => loadMod(i, element))

document.querySelector('.go').addEventListener('click', () => animate(false))
document.querySelector('.back').addEventListener('click', () => count > 0 && animate(true))

function animate(back = false) {
  if (!isAnimating) {
    console.log(groupPose ? 'flipped' : 'unflipped')
    const model = getModel(count)
    const model2 = getModel(count + 1)
    const model3 = getModel(count - 1)

    setColor(count, back)

    gsap.to(model.rotation, {
      y: Math.PI * 2,
      ease: Power4.easeInOut,
      duration: 4,
      onComplete: () => {
        model.rotation.y = 0
      },
    })

    if (back && count > 0) {
      gsap.to(Group.rotation, {
        z: Group.rotation.z - Math.PI,
        ease: Power4.easeInOut,
        duration: 4,
        onStart: () => {
          isAnimating = true
          model3.visible = true
          groupPose ? flipModel(model3) : flipModel(model3, true)
        },
        onComplete: () => {
          isAnimating = false
          model.visible = false
          groupPose = !groupPose
          count--
        },
      })

    } else {
      gsap.to(Group.rotation, {
        z: Group.rotation.z + Math.PI,
        ease: Power4.easeInOut,
        duration: 4,
        onStart: () => {
          isAnimating = true
          model2.visible = true
          groupPose ? flipModel(model2) : flipModel(model2, true)
        },
        onComplete: () => {
          isAnimating = false
          model.visible = false
          groupPose = !groupPose
          count++
        },
      })
    }

  }

}
scene.add(Group)

addEventListener('mousemove', (e) => {
  mouse.set(e.clientX / innerWidth, e.clientY / innerHeight)
})

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
document.body.append(renderer.domElement)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', fit)


function fit() {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height

  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

fit()

function getModel(i) {
  if (models.length === 0) return undefined
  return models[Math.floor(i) % models.length]
}

function setColor(i, back) {
  const color = back ? colors[Math.floor(i - 1) % models.length] : colors[Math.floor(i + 1) % models.length]
  groupPose ? mat1.color.setHex(color) && mat3.color.setHex(color) : mat0.color.setHex(color) && mat2.color.setHex(color)
}

function flipModel(model, unflip = false) {
  model.rotation.z = unflip ? 0 : Math.PI
  model.position.y = unflip ? 0.01 : -0.01
}

async function loadMod(i, url) {
  loader.load(url, (obj) => {
    models[i] = obj.scene
    Group.add(obj.scene)
    obj.scene.visible = i === 0
  })
}

const loop = () => {
  Group.rotation.x = THREE.MathUtils.lerp(Group.rotation.x, mouse.y / 20, .02)
  Group.rotation.y = THREE.MathUtils.lerp(Group.rotation.y, mouse.x / 2, .02)
  Group.position.z = THREE.MathUtils.lerp(Group.rotation.x, (mouse.x - .5) * 10, .02)
  camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, gyroValue, .02)


  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}

loop()
