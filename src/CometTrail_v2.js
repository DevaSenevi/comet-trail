import React, { useEffect } from 'react';
import * as THREE from 'three';

const CircularTrail = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 1 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let angle = 0;
    const radius = 2;
    const trailLength = 100;
    const positions = new Float32Array(trailLength * 3);

    const animate = () => {
      angle += 0.02;
      const headPosition = {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        z: 0,
      };

      // Shift all positions one step forward in the trail
      for (let i = trailLength - 1; i > 0; i--) {
        positions[i * 3] = positions[(i - 1) * 3];
        positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
        positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
      }

      // Set the head position
      positions[0] = headPosition.x;
      positions[1] = headPosition.y;
      positions[2] = headPosition.z;

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Cleanup
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div id='canvas-container' style={{ width: '100%', height: '100%' }} />;
};

export default CircularTrail;
