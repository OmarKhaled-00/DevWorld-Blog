import * as THREE from "three";
import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";

const defaultSunDirection = new THREE.Vector3(-2, 0.5, 1.5).normalize();

function EarthMaterial({ sunDirection = defaultSunDirection }) {
  // Load textures
  const dayMap = useLoader(
    THREE.TextureLoader,
    "./textures/earth-daymap-4k.jpg",
  );
  const nightMap = useLoader(
    THREE.TextureLoader,
    "./textures/earth-nightmap-4k.jpg",
  );
  const cloudsMap = useLoader(
    THREE.TextureLoader,
    "./textures/earth-clouds-4k.jpg",
  );

  // Create ShaderMaterial once
  const material = useMemo(() => {
    const uniforms = {
      dayTexture: { value: dayMap },
      nightTexture: { value: nightMap },
      cloudsTexture: { value: cloudsMap },
      sunDirection: { value: sunDirection },
    };

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelPosition;

        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = modelPosition.xyz;
      }
    `;

    const fragmentShader = `
      uniform sampler2D dayTexture;
      uniform sampler2D nightTexture;
      uniform sampler2D cloudsTexture;
      uniform vec3 sunDirection;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 viewDir = normalize(vPosition - cameraPosition);
        vec3 normal = normalize(vNormal);

        // Sun lighting
        float sunOrientation = dot(sunDirection, normal);

        // Day/night
        float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
        vec3 dayColor = texture2D(dayTexture, vUv).rgb;
        vec3 nightColor = texture2D(nightTexture, vUv).rgb;
        vec3 color = mix(nightColor, dayColor, dayMix);

        // Clouds
        vec3 clouds = texture2D(cloudsTexture, vUv).rgb;
        float cloudsMix = clouds.g * dayMix;
        color = mix(color, vec3(1.0), cloudsMix);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
  }, [dayMap, nightMap, cloudsMap, sunDirection]);

  return <primitive object={material} attach="material" />;
}

export default EarthMaterial;
