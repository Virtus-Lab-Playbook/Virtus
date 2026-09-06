'use client';

import { useEffect, useRef } from 'react';
import type { MeshBasicMaterial } from 'three';

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canvas || prefersReduced) {
      return;
    }

    let cleanup: (() => void) | undefined;

    void (async () => {
      try {
        const THREE = await import('three');

        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          34,
          canvas.clientWidth / canvas.clientHeight,
          0.1,
          100,
        );
        camera.position.set(0, 0, 8.2);

        const group = new THREE.Group();
        group.position.set(2.35, 0.15, 0);
        scene.add(group);

        const geometry = new THREE.TorusKnotGeometry(1.58, 0.34, 220, 32, 2, 3);
        const material = new THREE.MeshStandardMaterial({
          color: 0x8e6d3f,
          metalness: 0.92,
          roughness: 0.26,
          emissive: 0x1a1207,
          emissiveIntensity: 0.18,
        });
        const knot = new THREE.Mesh(geometry, material);
        knot.rotation.set(0.35, -0.6, 0.05);
        group.add(knot);

        const wire = new THREE.Mesh(
          new THREE.TorusKnotGeometry(1.76, 0.006, 260, 10, 2, 3),
          new THREE.MeshBasicMaterial({ color: 0xc8a96b, transparent: true, opacity: 0.22 }),
        );
        wire.rotation.copy(knot.rotation);
        group.add(wire);

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(2.35, 0.006, 8, 160),
          new THREE.MeshBasicMaterial({ color: 0xc8a96b, transparent: true, opacity: 0.14 }),
        );
        ring.rotation.set(1.2, 0.1, -0.25);
        group.add(ring);

        scene.add(new THREE.AmbientLight(0x4f4637, 1.7));
        const key = new THREE.PointLight(0xf0d9a1, 90, 18, 2);
        key.position.set(3.8, 3.3, 4.2);
        scene.add(key);
        const rim = new THREE.PointLight(0x8e6d3f, 55, 15, 2);
        rim.position.set(-3, -1.5, 2);
        scene.add(rim);

        let mx = 0;
        let my = 0;
        const onPointerMove = (event: PointerEvent) => {
          mx = (event.clientX / window.innerWidth - 0.5) * 0.55;
          my = (event.clientY / window.innerHeight - 0.5) * 0.35;
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });

        const resize = () => {
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          group.position.x = window.innerWidth < 1024 ? 0 : 2.35;
          group.scale.setScalar(window.innerWidth < 768 ? 0.72 : 1);
        };
        window.addEventListener('resize', resize);
        resize();

        const clock = new THREE.Clock();
        let frame = 0;
        const frameLoop = () => {
          const time = clock.getElapsedTime();
          knot.rotation.y += 0.0024;
          wire.rotation.y = knot.rotation.y;
          ring.rotation.z = time * 0.08;
          group.rotation.y += (mx - group.rotation.y) * 0.025;
          group.rotation.x += (-my - group.rotation.x) * 0.025;
          group.position.y = 0.1 + Math.sin(time * 0.6) * 0.08;
          renderer.render(scene, camera);
          frame = window.requestAnimationFrame(frameLoop);
        };
        frameLoop();

        cleanup = () => {
          window.cancelAnimationFrame(frame);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('resize', resize);
          geometry.dispose();
          material.dispose();
          wire.geometry.dispose();
          (wire.material as MeshBasicMaterial).dispose();
          ring.geometry.dispose();
          (ring.material as MeshBasicMaterial).dispose();
          renderer.dispose();
        };
      } catch {
        console.warn('3D hero unavailable; static layout remains functional.');
      }
    })();

    return () => cleanup?.();
  }, []);

  return (
    <div className="canvas-wrap">
      <canvas id="hero-canvas" ref={canvasRef} />
    </div>
  );
}
