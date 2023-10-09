import React, { useEffect } from 'react';
import * as THREE from 'three';

const CircularTrail = () => {
  useEffect(() => {

    console.log('useEffect triggered');

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
    const canvasContainer = document.getElementById('canvas-container');
    while (canvasContainer.firstChild) {
      canvasContainer.removeChild(canvasContainer.firstChild);
    }
    canvasContainer.appendChild(renderer.domElement);

    //Hnadle browser resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Create a trail of 100 points
    const trailLength = 100;
    const positions = new Float32Array(trailLength * 3);
    const sizes = new Float32Array(trailLength);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { 
          value: new THREE.Color('blue') //Trail color 
        },
      },
      vertexShader: `
        uniform vec3 color;
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float len = length(gl_PointCoord - vec2(0.5, 0.5));
          gl_FragColor = vec4(vColor, step(len, 0.5));
        }
      `,
      transparent: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let angle = 0;
    let angleIncrement = 0.02; //Adjust this value to change the trail speed
    const radius = 2;

    const animate = () => {
      angle += angleIncrement;
      const headPosition = {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        z: 0,
      };

      // Shift all positions and sizes one step forward in the trail
      for (let i = trailLength - 1; i > 0; i--) {
        positions[i * 3] = positions[(i - 1) * 3];
        positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
        positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
        sizes[i] = sizes[i - 1] * 0.99;  // Decrease size
      }

      // Set the head position and size
      positions[0] = headPosition.x;
      positions[1] = headPosition.y;
      positions[2] = headPosition.z;
      sizes[0] = 0.5;  // Set an initial size for the head of the trail

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;

      requestAnimationFrame(animate);
      renderer.clear();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Cleanup
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div id='canvas-container' style={{ width: '100%', height: '100%' }} />;
};

export default CircularTrail;
