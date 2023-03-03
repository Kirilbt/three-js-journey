export default function Experience() {


  return <>
    <mesh position={[2, 0, 0]}  scale={1.5} rotation-y={Math.PI * 0.25}>
      <boxGeometry />
      <meshBasicMaterial color="mediumpurple" wireframe />
    </mesh>
  </>
}
