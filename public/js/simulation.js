import * as THREE from '/js/three.module.min.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('simulation.js loaded');
  console.log('Three.js is loaded');
  const canvas = document.getElementById('signalCanvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  console.log('Canvas found:', canvas);
  const modulationSelect = document.getElementById('modulationType');
  if (!modulationSelect) {
    console.error('Modulation select element not found');
    return;
  }
  console.log('Modulation select found:', modulationSelect);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas });

  camera.position.z = 5;
  renderer.setSize(canvas.width, canvas.height);

  const points = [];
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  const updateSimulation = (modulationType) => {
    console.log('Updating simulation for:', modulationType);
    points.length = 0;
    const t = Date.now() / 1000;
    for (let x = -10; x <= 10; x += 0.1) {
      let y;
      if (modulationType === 'am') {
        y = (1 + 0.5 * Math.sin(2 * Math.PI * 0.5 * t)) * Math.sin(2 * Math.PI * 2 * t + x);
      } else if (modulationType === 'fm') {
        y = Math.sin(2 * Math.PI * (2 * t + 0.5 * Math.sin(2 * Math.PI * 0.5 * t)) + x);
      } else if (modulationType === 'psk') {
        const message = Math.sin(2 * Math.PI * 0.5 * t) > 0 ? 0 : Math.PI;
        y = Math.sin(2 * Math.PI * 2 * t + x + message);
      }
      points.push(new THREE.Vector3(x / 2, y, 0));
    }
    lineGeometry.setFromPoints(points);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    updateSimulation(modulationSelect.value);
    renderer.render(scene, camera);
  };

  modulationSelect.addEventListener('change', () => updateSimulation(modulationSelect.value));
  animate();
});