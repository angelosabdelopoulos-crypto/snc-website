import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Orb() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      host.classList.add("webgl-fallback");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const geometry = new THREE.IcosahedronGeometry(1.28, 5);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x777777,
      metalness: 0.72,
      roughness: 0.24,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const key = new THREE.PointLight(0xffffff, 95, 12);
    key.position.set(2.4, 2.6, 3.4);
    scene.add(key);
    const rim = new THREE.PointLight(0x8b9bb0, 45, 10);
    rim.position.set(-3, -1, -2);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.006, 8, 180),
      new THREE.MeshBasicMaterial({ color: 0xbdbdbd, transparent: true, opacity: 0.38 }),
    );
    ring.rotation.set(1.12, 0.25, -0.32);
    scene.add(ring);

    let frame = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const render = () => {
      if (!reduced) {
        sphere.rotation.y += 0.0018;
        sphere.rotation.x += 0.0006;
        ring.rotation.z += 0.00045;
      }
      renderer.render(scene, camera);
      if (!reduced) frame = window.requestAnimationFrame(render);
    };
    render();

    const resize = () => {
      if (!host) return;
      const width = host.clientWidth;
      const height = host.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="orb" ref={hostRef} role="img" aria-label="Slowly rotating metallic SNC abstract object" />;
}