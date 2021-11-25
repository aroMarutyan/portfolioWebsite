// Hey, it's a good tutorial, fun to watch, and I like the project, but I have a couple of remarks regarding the 3D side of things.

// 1. MeshStandardMaterial is a very expensive material meant for objects with physical properties, like metalness, roughness. If you're not using them, then it's better to downgrade to MeshPhongMaterial, which is more performant.

// 2. Stars do not need physical properties, nor even react to light, as they would be emitting light themselves. Simple save is to switch from MeshPhysicalMaterial to perfect for this MeshBasicMaterial which you mentioned before.

// 3. The way of adding separate star spheres shown in the video is really suboptimal. Creating new big objects of geometry (which also sends new attribute data to the GPU memory) and materials scales very poorly with larger numbers. Each new renderable mesh also introduces new draw call instructions, which can quickly become a bottleneck, especially for lower end devices.
// This is a perfect scenario for particles. I understand why you went for the simple "naive" way instead of introducing Instancing or THREE.Points, as setting those up either of these would require a bit of effort, explaining and most importantly time. However you should have mentioned that this is suboptimal and can (and should) be optimized. 3D is not as simple as HTML, and having and unoptimized app may lead to excessive battery consumption in the best case scenario to your web page breaking or being 2 FPS non-interactive in the worst case scenario. Sure, it may work on your gaming PC, but do you really wanna risk it that on the job interview your mindblowing "guaranteed to get you a job" portfolio simply fails on the office laptops with an old integrated intel GPU? Because this might be the fate of some people following this video.

// Please be mindful of performance and optimizing. It's a crucial part in 3D graphics, especially in the web, where you want your page to work on a wide range of devices.

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});
const torus = new THREE.Mesh(geometry, material);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("space.jpg"); //can pass callback function to be notified when the image loads
scene.background = spaceTexture;

scene.add(torus);
scene.add(pointLight, ambientLight);
scene.add(lightHelper, gridHelper);

//Avatar

const faceTexture = new THREE.TextureLoader().load("jeff.png");

const jeffy = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: faceTexture })
);
scene.add(jeffy);
//Moon

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);
moon.position.z = 30;
moon.position.setX(-10); //setX and .x do the same thing

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeffy.rotation.y += 0.01;
  jeffy.rotation.z += 0.01;

  camera.position.z = t * -0.1;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

//Animation reset
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
