import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import '../css/WormHole.css'
import { Link } from 'react-router-dom'

function WormHole() {
  const canvasRef = useRef();
  const [initialized, setInitialized] = useState(false);

  const handleWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  useEffect(() => {
    let scene, camera, renderer, controls, tubeVerts, colors, noise;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0.5, 0.5, 15);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      scene.fog = new THREE.FogExp2(0x000000, 0.025);
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasRef.current.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.update();

      const radius = 3;
      const tubeLength = 200;
      const tubeGeo = new THREE.CylinderGeometry(radius, radius, tubeLength, 128, 4096, true);
      tubeVerts = tubeGeo.attributes.position;
      colors = [];
      noise = new ImprovedNoise();
      let p = new THREE.Vector3();
      let v3 = new THREE.Vector3();
      const noisefreq = 0.1;
      const noiseAmp = 0.5;
      const color = new THREE.Color();
      const hueNoiseFreq = 0.005;
      for (let i = 0; i < tubeVerts.count; i += 1) {
        p.fromBufferAttribute(tubeVerts, i);
        v3.copy(p);
        let vertexNoise = noise.noise(v3.x * noisefreq, v3.y * noisefreq, v3.z);
        v3.addScaledVector(p, vertexNoise * noiseAmp);
        tubeVerts.setXYZ(i, v3.x, p.y, v3.z);

        let colorNoise = noise.noise(v3.x * hueNoiseFreq, v3.y * hueNoiseFreq, i * 0.001 * hueNoiseFreq);
        color.setHSL(0.5 - colorNoise, 1, 0.5);
        colors.push(color.r, color.g, color.b);
      }
      const mat = new THREE.PointsMaterial({ size: 0.03, vertexColors: true });

      function getTube(index) {
        const startPosZ = -tubeLength * index;
        const endPosZ = tubeLength;
        const resetPosZ = -tubeLength;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', tubeVerts);
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const points = new THREE.Points(geo, mat);
        points.rotation.x = Math.PI * 0.5;
        points.position.z = startPosZ;
        const speed = 0.2;
        function update() {
          points.rotation.y += 0.001;
          points.position.z += speed;
          if (points.position.z > endPosZ) {
            points.position.z = resetPosZ;
          }
        }
        return { points, update };
      }

      const tubeA = getTube(0);
      const tubeB = getTube(1);
      const tubes = [tubeA, tubeB];
      scene.add(tubeA.points, tubeB.points);

      function animate(t) {
        requestAnimationFrame(animate);
        tubes.forEach((tb) => tb.update());
        camera.position.x = Math.cos(t * 0.001) * 1.5;
        camera.position.y = Math.sin(t * 0.001) * 1.5;
        renderer.render(scene, camera);
      }

      animate(0);

      window.addEventListener('resize', handleWindowResize);

      setInitialized(true);
    };

    if (!initialized) {
      init();
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [initialized]);

  return (
    <>
    <div id='container'>
 <div ref={canvasRef} />
 <div id='enter'>
 <Link to='/homepage'><h1>Welcome! To learn more about me press  Enter</h1></Link>
 </div>
 </div>
 </>
  )
}

export default WormHole;
