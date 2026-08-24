import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const BLUE = new THREE.Color('#4f7cff')
const LIME = new THREE.Color('#c8ff66')
const INK = new THREE.Color('#f2f0e9')

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.className = 'hero-scene-canvas'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    mount.appendChild(renderer.domElement)

    const researchCore = new THREE.Group()
    researchCore.rotation.set(-0.12, -0.42, 0.08)
    scene.add(researchCore)

    const shellGeometry = new THREE.IcosahedronGeometry(1.72, 2)
    const shell = new THREE.Mesh(shellGeometry, new THREE.MeshPhysicalMaterial({
      color: 0x0a1714,
      roughness: 0.22,
      metalness: 0.58,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
    }))
    researchCore.add(shell)

    const wireframe = new THREE.Mesh(shellGeometry.clone(), new THREE.MeshBasicMaterial({
      color: BLUE,
      wireframe: true,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
    }))
    wireframe.scale.setScalar(1.015)
    researchCore.add(wireframe)

    const chip = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.72, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0x7eabff,
        emissive: 0x173f9f,
        emissiveIntensity: 1.8,
        metalness: 0.76,
        roughness: 0.16,
        transparent: true,
        opacity: 0.88,
      }),
    )
    chip.rotation.set(0.45, 0, 0.8)
    researchCore.add(chip)

    const coreGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 24, 24),
      new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending }),
    )
    researchCore.add(coreGlow)

    const nodePositions: THREE.Vector3[] = []
    const nodeArray = new Float32Array(34 * 3)
    for (let index = 0; index < 34; index += 1) {
      const phi = Math.acos(1 - (2 * (index + 0.5)) / 34)
      const theta = Math.PI * (1 + Math.sqrt(5)) * index
      const radius = 1.8 + Math.sin(index * 4.17) * 0.08
      const point = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      )
      nodePositions.push(point)
      nodeArray.set([point.x, point.y, point.z], index * 3)
    }

    const nodeGeometry = new THREE.BufferGeometry()
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodeArray, 3))
    const nodes = new THREE.Points(nodeGeometry, new THREE.PointsMaterial({
      color: LIME,
      size: 0.09,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
    }))
    researchCore.add(nodes)

    const connections: number[] = []
    nodePositions.forEach((point, index) => {
      nodePositions.slice(index + 1).forEach((candidate) => {
        if (point.distanceTo(candidate) < 1.12) {
          connections.push(point.x, point.y, point.z, candidate.x, candidate.y, candidate.z)
        }
      })
    })
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3))
    const network = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({
      color: INK,
      transparent: true,
      opacity: 0.13,
      blending: THREE.AdditiveBlending,
    }))
    researchCore.add(network)

    const orbitGroups: THREE.Group[] = []
    const orbitSettings = [
      { radius: 2.18, x: 0.28, y: 0.14, color: BLUE },
      { radius: 2.48, x: 1.18, y: -0.12, color: LIME },
      { radius: 2.82, x: 0.68, y: 1.08, color: INK },
    ]
    orbitSettings.forEach((setting, index) => {
      const orbit = new THREE.Group()
      orbit.rotation.set(setting.x, setting.y, index * 0.72)
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(setting.radius, 0.008, 5, 160),
        new THREE.MeshBasicMaterial({ color: setting.color, transparent: true, opacity: index === 2 ? 0.13 : 0.3 }),
      )
      const signal = new THREE.Mesh(
        new THREE.SphereGeometry(index === 1 ? 0.075 : 0.052, 10, 10),
        new THREE.MeshBasicMaterial({ color: setting.color }),
      )
      signal.position.x = setting.radius
      orbit.add(ring, signal)
      orbitGroups.push(orbit)
      researchCore.add(orbit)
    })

    const particleCount = 620
    const particlesArray = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)
    for (let index = 0; index < particleCount; index += 1) {
      const angle = index * 2.399963
      const radius = 2.9 + ((index * 37) % 100) / 100 * 2.7
      const y = (((index * 53) % 100) / 100 - 0.5) * 5.2
      particlesArray.set([
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius * 0.52,
      ], index * 3)
      const color = index % 9 === 0 ? LIME : index % 3 === 0 ? BLUE : INK
      particleColors.set([color.r, color.g, color.b], index * 3)
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlesArray, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))
    const particleField = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
      size: 0.022,
      transparent: true,
      opacity: 0.48,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }))
    scene.add(particleField)

    scene.add(new THREE.AmbientLight(0xa9c7ff, 1.7))
    const keyLight = new THREE.PointLight(0x4f7cff, 38, 18)
    keyLight.position.set(3.2, 2.2, 4.2)
    scene.add(keyLight)
    const edgeLight = new THREE.PointLight(0xc8ff66, 24, 14)
    edgeLight.position.set(-3, -2, 2.5)
    scene.add(edgeLight)

    const pointer = new THREE.Vector2()
    let scrollAmount = window.scrollY
    let frameId = 0
    let sceneVisible = true
    const clock = new THREE.Clock()

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }

    const onPointerMove = (event: globalThis.PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    const onScroll = () => { scrollAmount = window.scrollY }

    const renderFrame = () => {
      frameId = 0
      if (!sceneVisible || document.hidden) return
      const elapsed = clock.getElapsedTime()
      const targetRotationX = -0.1 + pointer.y * 0.16
      const targetRotationY = -0.42 + pointer.x * 0.28 + scrollAmount * 0.00032
      researchCore.rotation.x += (targetRotationX - researchCore.rotation.x) * 0.035
      researchCore.rotation.y += (targetRotationY - researchCore.rotation.y) * 0.035
      researchCore.rotation.z = 0.08 + Math.sin(elapsed * 0.32) * 0.035
      wireframe.rotation.y = elapsed * 0.055
      chip.rotation.y = elapsed * 0.42
      chip.rotation.x = 0.45 + Math.sin(elapsed * 0.7) * 0.1
      coreGlow.scale.setScalar(1 + Math.sin(elapsed * 1.6) * 0.055)
      nodes.material.opacity = 0.74 + Math.sin(elapsed * 1.9) * 0.18
      orbitGroups.forEach((orbit, index) => {
        orbit.rotation.z += 0.0016 + index * 0.0008
        const signal = orbit.children[1]
        signal.position.set(
          Math.cos(elapsed * (0.55 + index * 0.18)) * orbitSettings[index].radius,
          Math.sin(elapsed * (0.55 + index * 0.18)) * orbitSettings[index].radius,
          0,
        )
      })
      particleField.rotation.y = elapsed * 0.012
      camera.position.x += (pointer.x * 0.24 - camera.position.x) * 0.025
      camera.position.y += (pointer.y * 0.16 - camera.position.y) * 0.025
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(renderFrame)
    }

    const startRendering = () => {
      if (!reducedMotion && sceneVisible && !document.hidden && !frameId) {
        frameId = window.requestAnimationFrame(renderFrame)
      }
    }

    const stopRendering = () => {
      window.cancelAnimationFrame(frameId)
      frameId = 0
    }

    const sceneObserver = new IntersectionObserver(([entry]) => {
      sceneVisible = entry.isIntersecting
      if (sceneVisible) startRendering()
      else stopRendering()
    }, { threshold: 0.01 })

    const onVisibilityChange = () => {
      if (document.hidden) stopRendering()
      else startRendering()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    sceneObserver.observe(mount)
    document.addEventListener('visibilitychange', onVisibilityChange)
    resize()

    if (!reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('scroll', onScroll, { passive: true })
      startRendering()
    }

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      resizeObserver.disconnect()
      sceneObserver.disconnect()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div className="hero-scene" ref={mountRef} aria-hidden="true">
      <div className="hero-scene-label">
        <span>RESEARCH CORE</span>
        <i>POINTER / SCROLL REACTIVE</i>
      </div>
    </div>
  )
}
