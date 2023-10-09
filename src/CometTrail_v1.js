// src/CometTrail.js

import React, { useEffect } from 'react';
import * as THREE from 'three';
import ParticleSystem, {
  Alpha,
  Color,
  Emitter,
  Life,
  Mass,
  PointZone,
  Position,
  RadialVelocity,
  Radius,
  Rate,
  Scale,
  Span,
  SpriteRenderer,
  Vector3D,
} from 'three-nebula';

const updateColors = (color1, color2, hcolor = 0) => {
    color1.setHSL(hcolor - (hcolor >> 0) , 1, 0.5);
    color2.setHSL(hcolor - (hcolor >> 0) + 0.3, 1, 0.5);
};

const updateEmitter = (emitter, coordinate) => {
    emitter.position.x = coordinate.x;
    emitter.position.y = coordinate.y;
    emitter.position.z = coordinate.z;
};

const updateCamera = (camera, scene, ctha = 0) => {
    const radius = 300;

    camera.lookAt(scene.position);
    camera.position.x = Math.sin(ctha) * radius;
    camera.position.z = Math.cos(ctha) * radius;
    camera.position.y = Math.sin(ctha) * radius;
    camera.lookAt(scene.position);
};

const createEmitter = (color1, color2) => {
    const emitter = new Emitter();

    return emitter
        .setRate(new Rate(new Span(4, 16), new Span(0.01)))
        .addInitializers([
            new Position(new PointZone(0, 0)),
            new Mass(1),
            new Radius(6, 12),
            new Life(3),
            new RadialVelocity(45, new Vector3D(0, 1, 0), 180),
        ])
        .addBehaviours([                
            new Alpha(1, 0),
            new Scale(0.3, 0.6),
            new Color(color1, color2),
        ])
        .emit();
};

const CometTrail = () => {
  useEffect(() => {
    const container = document.getElementById('canvas-container');
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    let hcolor = 0;
    let ctha = 0;
    let i = 0;

    //Generate coordinates for a rough circular path 
    const coordinates = Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * 2 *  Math.PI;
        const variation = Math.random() * 20 - 10;
        const radius = 150 + variation;
        const x = 250 + radius * Math.cos(angle);
        const y = 250 + radius * Math.sin(angle);
        return { x, y, z: 0 };
    });

    const system = new ParticleSystem();
    const color1 = new THREE.Color();
    const color2 = new THREE.Color();
    const emitter = createEmitter(color1, color2);

    system.addEmitter(emitter).addRenderer(new SpriteRenderer(scene, THREE));
    
    const animate = () => {
        hcolor += 0.01;
        ctha += 0.016;
        
        i = (i + 1) % coordinates.length;

        updateColors(color1, color2, hcolor);
        updateEmitter(emitter, coordinates[i]);
        
        console.log(coordinates[i], emitter.position);

        
        updateCamera(camera, scene, ctha);

        requestAnimationFrame(animate);
        system.update();
        renderer.render(scene, camera);

        console.log(system);
    };
            
    animate(); // Start the animation loop.

    // Cleanup    
    return () => {
      system.destroy();
      renderer.dispose();
    };

  }, []);

  return <div id="canvas-container" style={{ width: '100%', height: '100%' }} />;
};

export default CometTrail;