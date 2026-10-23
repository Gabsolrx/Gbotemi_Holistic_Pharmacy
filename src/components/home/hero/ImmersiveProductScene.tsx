import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RefreshCw } from 'lucide-react';

interface ImmersiveProductSceneProps {
  className?: string;
  onInteractiveTrigger?: () => void;
}

export function ImmersiveProductScene({ className = '', onInteractiveTrigger }: ImmersiveProductSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeRotationMode, setActiveRotationMode] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.3, 7.2);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("Could not create WebGLRenderer:", e);
      setHasWebGL(false);
      return;
    }

    // Master Group for spatial parallax
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Lighting Setup (Editorial Pharmacy Lighting)
    const ambientLight = new THREE.AmbientLight(0xFAF8F0, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const emeraldRimLight = new THREE.PointLight(0x087F5B, 4.5, 12);
    emeraldRimLight.position.set(-4, -1, 3);
    scene.add(emeraldRimLight);

    const limeAccentLight = new THREE.PointLight(0xC5E86C, 2.5, 10);
    limeAccentLight.position.set(3, -3, -2);
    scene.add(limeAccentLight);

    const softFillLight = new THREE.DirectionalLight(0xE6F4EC, 1.0);
    softFillLight.position.set(-4, 4, 3);
    scene.add(softFillLight);

    // 2. Centerpiece Object 1: Luxury Dual-Tone Capsule
    const capsuleGroup = new THREE.Group();
    capsuleGroup.position.set(0.1, 0.2, 0.2);
    capsuleGroup.rotation.z = Math.PI * 0.18;
    capsuleGroup.rotation.x = Math.PI * 0.12;
    masterGroup.add(capsuleGroup);

    // Capsule Top (Translucent Emerald Green Glass)
    const topGeometry = new THREE.CylinderGeometry(0.72, 0.72, 1.25, 36, 1, false);
    const topHemisphere = new THREE.SphereGeometry(0.72, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.5);
    topHemisphere.translate(0, 0.625, 0);

    const emeraldGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x087F5B,
      emissive: 0x033D2E,
      emissiveIntensity: 0.15,
      roughness: 0.12,
      metalness: 0.08,
      transmission: 0.88,
      ior: 1.48,
      thickness: 1.2,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const capsuleTopCylinder = new THREE.Mesh(topGeometry, emeraldGlassMaterial);
    const capsuleTopDome = new THREE.Mesh(topHemisphere, emeraldGlassMaterial);
    capsuleTopCylinder.position.y = 0.625;
    capsuleGroup.add(capsuleTopCylinder);
    capsuleGroup.add(capsuleTopDome);

    // Gold / Lime Metallic Band
    const goldBandGeo = new THREE.TorusGeometry(0.74, 0.04, 16, 48);
    goldBandGeo.rotateX(Math.PI / 2);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.9,
      roughness: 0.2
    });
    const goldBand = new THREE.Mesh(goldBandGeo, goldMaterial);
    goldBand.position.y = 0;
    capsuleGroup.add(goldBand);

    // Capsule Bottom (Warm Ivory Ceramic/Matte Cap)
    const bottomGeometry = new THREE.CylinderGeometry(0.72, 0.72, 1.25, 36, 1, false);
    const bottomHemisphere = new THREE.SphereGeometry(0.72, 36, 18, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5);
    bottomHemisphere.translate(0, -0.625, 0);

    const ivoryMatteMaterial = new THREE.MeshStandardMaterial({
      color: 0xFAF8F0,
      roughness: 0.35,
      metalness: 0.05
    });

    const capsuleBottomCylinder = new THREE.Mesh(bottomGeometry, ivoryMatteMaterial);
    const capsuleBottomDome = new THREE.Mesh(bottomHemisphere, ivoryMatteMaterial);
    capsuleBottomCylinder.position.y = -0.625;
    capsuleGroup.add(capsuleBottomCylinder);
    capsuleGroup.add(capsuleBottomDome);

    // Glowing Micro-Beads inside the emerald glass half
    const beadsCount = 18;
    const beadsGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const beadsMat = new THREE.MeshStandardMaterial({
      color: 0xC5E86C,
      emissive: 0xC5E86C,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });

    const beadsGroup = new THREE.Group();
    for (let i = 0; i < beadsCount; i++) {
      const bead = new THREE.Mesh(beadsGeo, beadsMat);
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.45;
      const y = 0.2 + Math.random() * 0.8;
      bead.position.set(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
      beadsGroup.add(bead);
    }
    capsuleGroup.add(beadsGroup);

    // 3. Centerpiece Object 2: Luxury Minimalist Glass Apothecary Dropper Bottle (Left foreground)
    const bottleGroup = new THREE.Group();
    bottleGroup.position.set(-1.8, -0.8, -0.5);
    bottleGroup.scale.set(0.75, 0.75, 0.75);
    bottleGroup.rotation.y = Math.PI * 0.2;
    masterGroup.add(bottleGroup);

    // Bottle Body
    const bottleBodyGeo = new THREE.CylinderGeometry(0.7, 0.75, 1.8, 32);
    const darkAmberGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x064E3B,
      transmission: 0.78,
      roughness: 0.18,
      metalness: 0.1,
      ior: 1.5,
      thickness: 0.8
    });
    const bottleBody = new THREE.Mesh(bottleBodyGeo, darkAmberGlassMat);
    bottleGroup.add(bottleBody);

    // Bottle Serum liquid inside
    const liquidGeo = new THREE.CylinderGeometry(0.62, 0.66, 1.3, 24);
    liquidGeo.translate(0, -0.2, 0);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x087F5B,
      emissive: 0x087F5B,
      emissiveIntensity: 0.35,
      roughness: 0.2
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    bottleGroup.add(liquidMesh);

    // Bottle Cap / Pipette
    const capGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.6, 24);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x17372C,
      roughness: 0.4,
      metalness: 0.2
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 1.15;
    bottleGroup.add(capMesh);

    const rubberTipGeo = new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const rubberTip = new THREE.Mesh(rubberTipGeo, capMat);
    rubberTip.position.y = 1.5;
    bottleGroup.add(rubberTip);

    // 4. Centerpiece Object 3: Floating Translucent Orbital Rings (Cellular Aura)
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.03, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x087F5B,
      emissive: 0x087F5B,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.7
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.4;
    ring1.rotation.y = Math.PI * 0.15;
    masterGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xC5E86C,
      emissive: 0xC5E86C,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.6
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI * 0.3;
    ring2.rotation.y = Math.PI * 0.45;
    masterGroup.add(ring2);

    // 5. Contact Shadow Disk (Soft Ground Shadow)
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 5, 64, 64, 60);
      gradient.addColorStop(0, 'rgba(6, 78, 59, 0.4)');
      gradient.addColorStop(0.5, 'rgba(6, 78, 59, 0.15)');
      gradient.addColorStop(1, 'rgba(6, 78, 59, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.1;
    masterGroup.add(shadowMesh);

    // Pointer Interaction Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.45;
      targetY = y * 0.35;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth || 400;
      const newH = container.clientHeight || 450;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let isVisible = true;

    // Intersection Observer to pause rendering when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth pointer parallax interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      masterGroup.rotation.y = mouseX * 0.6;
      masterGroup.rotation.x = -mouseY * 0.5;

      // Restrained Harmonic Floating
      capsuleGroup.position.y = 0.2 + Math.sin(elapsed * 1.2) * 0.12;
      capsuleGroup.rotation.y = Math.sin(elapsed * 0.7) * 0.15;
      capsuleGroup.rotation.z = Math.PI * 0.18 + Math.cos(elapsed * 0.9) * 0.05;

      bottleGroup.position.y = -0.8 + Math.sin(elapsed * 1.1 + 1.2) * 0.08;
      bottleGroup.rotation.y = Math.PI * 0.2 + Math.sin(elapsed * 0.5) * 0.1;

      // Micro-beads gentle swirl
      beadsGroup.rotation.y = elapsed * 0.4;

      // Slow orbital ring rotations
      ring1.rotation.z = elapsed * 0.25;
      ring2.rotation.z = -elapsed * 0.35;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      // Clean dispose geometries & materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      className={`relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center justify-center select-none overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle Spatial Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-tr from-[#087F5B]/15 via-[#C5E86C]/10 to-transparent blur-3xl opacity-80" />
      </div>

      {/* 3D Canvas Mounting Point */}
      {hasWebGL ? (
        <div 
          ref={mountRef} 
          className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative z-10"
          title="Interactive 3D Pharmacy Showcase (Move cursor to explore depth)"
        />
      ) : (
        /* Accessible High-Fidelity CSS 3D Fallback if WebGL is unavailable */
        <div className="relative w-full h-full flex items-center justify-center p-8 z-10">
          <div className="relative w-64 h-80 rounded-3xl bg-gradient-to-b from-white/90 to-[#E6F4EC]/60 backdrop-blur-md p-6 shadow-2xl border border-emerald-100 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#087F5B] to-[#064E3B] text-white flex items-center justify-center shadow-lg shadow-emerald-950/20 mb-4 animate-pulse">
              <Sparkles size={40} className="text-[#C5E86C]" />
            </div>
            <h4 className="font-bold text-[#17372C] text-lg">Verified Pharmacy Essentials</h4>
            <p className="text-xs text-[#65776D] mt-2">
              Authentic medications, holistic remedies, and certified practitioner care.
            </p>
          </div>
        </div>
      )}

      {/* Subtle Floating 3D Badge Indicator */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none sm:pointer-events-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-emerald-900/10 text-[11px] font-medium text-[#17372C] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#087F5B] animate-pulse" />
          <span>Interactive 3D Visual</span>
        </div>
      </div>

      {/* Touch/Mouse hint */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-300 pointer-events-none text-center ${
        isHovered ? 'opacity-90' : 'opacity-40'
      }`}>
        <p className="text-[11px] tracking-wide uppercase font-semibold text-[#65776D]">
          Tilt to explore dimensional depth
        </p>
      </div>
    </div>
  );
}
