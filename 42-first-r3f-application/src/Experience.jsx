export default function Experience() {


  return <>
    <mesh position={[-2, 0, 0]}>
      <sphereGeometry />
      <meshBasicMaterial color="orange" wireframe />
    </mesh>
    <mesh position={[2, 0, 0]}  scale={1.5} rotation-y={Math.PI * 0.25}>
      <boxGeometry />
      <meshBasicMaterial color="mediumpurple" />
    </mesh>
    <mesh position-y={-1} scale={10} rotation-x={- Math.PI * 0.5}>
      <planeGeometry />
      <meshBasicMaterial color="green" />
    </mesh>
  </>
}
