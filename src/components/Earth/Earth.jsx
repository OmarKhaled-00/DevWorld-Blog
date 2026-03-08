import * as THREE from "three";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Nebula from "../ThreeDModel/Nebula/Nebula";
import Starfield from "../ThreeDModel/Starfield/StarField";
import EarthMaterial from "../ThreeDModel/EarthMaterial/EarthMaterial";
import AtmosphereMesh from "../ThreeDModel/AtmosphereMesh/AtmosphereMesh";

const sunDirection = new THREE.Vector3(-2, 0.5, 1.5);

function Earth() {
  const ref = React.useRef();

  useFrame(() => {
    ref.current.rotation.y += 0.001;
  });
  const axialTilt = (23.4 * Math.PI) / 180;
  return (
    <group rotation-z={axialTilt}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[2, 64]} />
        <EarthMaterial sunDirection={sunDirection} />
        <AtmosphereMesh />
      </mesh>
    </group>
  );
}

function EarthApp() {
  const { x, y, z } = sunDirection;
  return (
    <Canvas
      className="animate__animated animate__slideDown"
      camera={{ position: [0, 0.1, 5] }}
      gl={{ toneMapping: THREE.NoToneMapping }}
      style={{ width: "100%", height: "100%" }}
    >
      <Earth />
      <hemisphereLight args={[0xffffff, 0x000000, 3.0]} />
      <directionalLight position={[x, y, z]} />
      {/* <Nebula /> */}
      {/* <Starfield /> */}
      {/* <OrbitControls /> */}
    </Canvas>
  );
}

export default EarthApp;
