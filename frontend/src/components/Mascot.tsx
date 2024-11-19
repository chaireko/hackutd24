import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';

const Mascot: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Scene Setup
    const SCENE_WIDTH = 350;
    const SCENE_HEIGHT = 350;
    const FOV = 50;
    const CAMERA_DISTANCE = 3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, SCENE_WIDTH / SCENE_HEIGHT, 0.1, 1000);
    camera.position.z = CAMERA_DISTANCE;

    // Add 3D Model
    const loader = new GLTFLoader();
    loader.load(
      'mascot.glb',
      (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.scale.set(1.8, 1.8, 1.8);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    // Add Lighting
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 3);
    pointLight2.position.set(0, 0.5, 5);
    scene.add(pointLight2);

    // Resize Handling
    const handleResize = () => {
      setIsAnimating(window.innerWidth > 1280);
    };
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize(SCENE_WIDTH, SCENE_HEIGHT);
    sceneRef.current?.appendChild(renderer.domElement);

    // Configure Outline Effect
    const outline_brightness_scalar = 0.5;
    const effect = new OutlineEffect(renderer, {
      defaultAlpha: 1.0,
      defaultThickness: 0.004,
      defaultColor: [
        (0 / 255) * outline_brightness_scalar,
        (0 / 255) * outline_brightness_scalar,
        (0 / 255) * outline_brightness_scalar,
      ],
    });

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.01;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = (5 * Math.PI) / 6;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (isAnimating) {
        controls.update();
        renderer.render(scene, camera);
        effect.render(scene, camera);
      }
    };
    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [isAnimating]);

  return (
    <div
      id="friend-zone-haha"
      className="hidden xl:block"
      ref={sceneRef}
      style={{
        filter: 'brightness(1.5) contrast(1.5) saturate(1.5)',
        cursor: 'grab',
      }}
    >
      {/* The 3D scene will be rendered inside this div */}
    </div>
  );
};

export default Mascot;
