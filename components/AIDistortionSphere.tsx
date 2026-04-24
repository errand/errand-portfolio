'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const SIZE = 400;

const AIDistortionSphere = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    let isDisposed = false;
    let cleanupScene: (() => void) | null = null;

    const start = () => {
      if (!mountRef.current || isDisposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000);
      camera.position.z = 13;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

      renderer.setSize(SIZE, SIZE);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.backgroundColor = 'transparent';
      renderer.domElement.style.display = 'block';
      mountRef.current.appendChild(renderer.domElement);

      const outerParams = {
        color: '#3a3a8a',
        wireframe: true,
        distortion: 0.55,
        speed: 1.2,
        radius: 7,
        detail: 20,
      };

      const middleParams = {
        color: '#6a6ac8',
        wireframe: true,
        distortion: 0.65,
        speed: 1.5,
        radius: 5,
        detail: 18,
      };

      const innerParams = {
        color: '#9a9aff',
        wireframe: true,
        distortion: 0.75,
        speed: 1.8,
        radius: 3,
        detail: 16,
      };

      const bloomComposer = new EffectComposer(renderer);
      bloomComposer.setSize(SIZE, SIZE);
      bloomComposer.addPass(new RenderPass(scene, camera));

      const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 1.0, 0.35, 0.45);
      bloomComposer.addPass(bloomPass);
      bloomComposer.addPass(new OutputPass());

      const createShaderMaterial = (params: typeof outerParams) =>
        new THREE.ShaderMaterial({
          uniforms: {
            u_time: { value: 0 },
            u_distortion: { value: params.distortion },
            u_speed: { value: params.speed },
            u_color: { value: new THREE.Color(params.color) },
          },
          vertexShader: `
            uniform float u_time;
            uniform float u_distortion;
            uniform float u_speed;

            float noise(vec3 p) {
              vec3 i = floor(p);
              vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
              vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
              a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
              a.xy = mix(a.xz, a.yw, f.y);
              return mix(a.x, a.y, f.z);
            }

            void main() {
              vec3 pos = position;
              float displacement =
                noise(vec3(pos.x * 0.4 + u_time * u_speed, pos.y * 0.4, pos.z * 0.4)) * 0.8 +
                noise(vec3(pos.x * 0.8 + u_time * u_speed * 1.3, pos.y * 0.8 + u_time * 0.5, pos.z * 0.8)) * 0.4 +
                noise(vec3(pos.x * 1.6 + u_time * u_speed * 0.7, pos.y * 1.6, pos.z * 1.6 + u_time * 0.3)) * 0.2;

              pos += normal * displacement * u_distortion;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 u_color;
            void main() {
              vec3 glow = u_color * 1.5;
              gl_FragColor = vec4(mix(u_color, glow, 0.3), 0.85);
            }
          `,
          wireframe: params.wireframe,
          transparent: true,
        });

      const outerMaterial = createShaderMaterial(outerParams);
      const outerGeometry = new THREE.IcosahedronGeometry(outerParams.radius, outerParams.detail);
      const outerSphere = new THREE.Mesh(outerGeometry, outerMaterial);
      scene.add(outerSphere);

      const middleMaterial = createShaderMaterial(middleParams);
      const middleGeometry = new THREE.IcosahedronGeometry(middleParams.radius, middleParams.detail);
      const middleSphere = new THREE.Mesh(middleGeometry, middleMaterial);
      scene.add(middleSphere);

      const innerMaterial = createShaderMaterial(innerParams);
      const innerGeometry = new THREE.IcosahedronGeometry(innerParams.radius, innerParams.detail);
      const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
      scene.add(innerSphere);

      const clock = new THREE.Clock();
      const animate = () => {
        if (isDisposed) return;
        animationRef.current = requestAnimationFrame(animate);

        const time = clock.getElapsedTime();
        outerMaterial.uniforms.u_time.value = time;
        middleMaterial.uniforms.u_time.value = time * 1.2;
        innerMaterial.uniforms.u_time.value = time * 1.4;

        outerSphere.rotation.x = time * 0.05;
        outerSphere.rotation.y = time * 0.08;
        middleSphere.rotation.x = -time * 0.06;
        middleSphere.rotation.y = -time * 0.09;
        innerSphere.rotation.x = time * 0.07;
        innerSphere.rotation.y = time * 0.1;

        bloomComposer.render();
      };

      animate();
      setIsVisible(true);

      cleanupScene = () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        if (mountRef.current?.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
        outerGeometry.dispose();
        middleGeometry.dispose();
        innerGeometry.dispose();
        outerMaterial.dispose();
        middleMaterial.dispose();
        innerMaterial.dispose();
        renderer.dispose();
      };
    };

    const win = globalThis as Window & typeof globalThis;
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if ('requestIdleCallback' in win) {
      idleId = win.requestIdleCallback(start, { timeout: 1200 });
    } else {
      timeoutId = globalThis.setTimeout(start, 250);
    }

    return () => {
      isDisposed = true;
      if ('cancelIdleCallback' in win && idleId !== null) {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
      }
      cleanupScene?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        display: 'inline-block',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'transparent',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 800ms ease',
      }}
    />
  );
};

export default AIDistortionSphere;
