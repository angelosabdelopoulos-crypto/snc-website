import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Orb() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      host.classList.add("webgl-fallback");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, host.clientWidth / Math.max(host.clientHeight, 1), 0.1, 100);
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

    const ringGeometry = new THREE.TorusGeometry(1.85, 0.006, 8, 180);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xbdbdbd, transparent: true, opacity: 0.38,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.set(1.12, 0.25, -0.32);
    scene.add(ring);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let isVisible = false;
    let pageVisible = !document.hidden;
    let disposed = false;

    const draw = () => renderer.render(scene, camera);
    const animate = () => {
      if (disposed || reducedMotion || !isVisible || !pageVisible) return;
      sphere.rotation.y += 0.0018;
      sphere.rotation.x += 0.0006;
      ring.rotation.z += 0.00045;
      draw();
      frame = window.requestAnimationFrame(animate);
    };
    const start = () => {
      if (!reducedMotion && isVisible && pageVisible && !frame && !disposed) {
        frame = window.requestAnimationFrame(animate);
      }
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    draw();
    const intersectionObserver = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => {
          isVisible = Boolean(entry?.isIntersecting);
          if (isVisible) start();
          else stop();
        }, { threshold: 0.01 })
      : null;
    if (intersectionObserver) intersectionObserver.observe(host);
    else {
      isVisible = true;
      start();
    }

    const handleVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) start();
      else stop();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      draw();
    };
    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(resize)
      : null;
    resizeObserver?.observe(host);
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", resize);
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      geometry.dispose();
      material.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="orb" ref={hostRef} role="img" aria-label="Slowly rotating metallic SNC abstract object" />;
}
