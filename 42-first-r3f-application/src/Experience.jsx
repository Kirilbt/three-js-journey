import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export default function Experience() {
  const groupRef = useRef()
  const cubeRef = useRef()

  useFrame((state, delta) => {
    groupRef.current.rotation.y += 0.01
    cubeRef.current.rotation.y += 0.02
  })

  return <>
    <group ref={ groupRef }>
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry />
        <meshBasicMaterial color="orange" wireframe />
      </mesh>
      <mesh ref={ cubeRef } position={[2, 0, 0]}  scale={1.5} rotation-y={Math.PI * 0.25}>
        <boxGeometry />
        <meshBasicMaterial color="mediumpurple" />
      </mesh>
    </group>
    <mesh position-y={-1} scale={10} rotation-x={- Math.PI * 0.5}>
      <planeGeometry />
      <meshBasicMaterial color="green" />
    </mesh>
  </>
}
