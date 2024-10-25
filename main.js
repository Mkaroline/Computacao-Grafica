import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Caverna from './Classes_modelos/Caverna.js';
import Atlantis from './Classes_modelos/Atlantis.js';
import Fundo from './Classes_modelos/Fundo.js';
import Peixes from './Classes_modelos/Peixes.js';
import Peixes3 from './Classes_modelos/Peixes3.js';
import Tartaruga from './Classes_modelos/Tartaruga.js';
import Treasure from './Classes_modelos/Treasure.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x031f4d);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(42, -7, -405);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const clock = new THREE.Clock();

const control = new OrbitControls(camera, renderer.domElement);
control.update();

const velMov = 0.5;
const velRot = 0.5;
let submarino = null; 


const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2) ; 
directionalLight.position.set(0, 1000, 0); 
scene.add(directionalLight);

const spotlight = new THREE.SpotLight(0xffffff); 
spotlight.position.set(35, -7, -350); 
spotlight.angle = Math.PI /20; 
spotlight.penumbra = 0; 
spotlight.decay = 0.5; 
spotlight.distance = 150; 
spotlight.castShadow = true; 
spotlight.intensity = 50; 
scene.add(spotlight);
scene.add(spotlight.target);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 500;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.6,
    transparent: true,
    opacity: 0.7,
    color: 0x88ccee
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

scene.fog = new THREE.FogExp2(0x031f4d, 0.010); 
renderer.setClearColor(scene.fog.color);

const loader = new GLTFLoader();
loader.load('./Modelo/Submarine/scene.gltf', function (gltf) {
    submarino = gltf.scene;
    submarino.scale.set(0.005, 0.005, 0.005);
    submarino.position.set(42, -7, -400);
    scene.add(submarino);

    document.addEventListener('keydown', handleSubmarineMovement);
}, undefined, function (error) {
    console.error(error);
});

function handleSubmarineMovement(event) {
    if (!submarino) return;

    switch (event.key) {
        case 'ArrowUp': moveSubmarineUp(); break;
        case 'ArrowDown': moveSubmarineDown(); break;
        case 'ArrowLeft': rotateSubmarineLeft(); break;
        case 'ArrowRight': rotateSubmarineRight(); break;
        case 'w': moveSubmarineForward(); break;
        case 's': moveSubmarineBackward(); break;
    }

    camera.position.set(submarino.position.x, submarino.position.y + 1, submarino.position.z - 6);


    logSubmarinePosition();
}


function moveSubmarineForward() {
    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(submarino.quaternion);
    submarino.position.add(direction.multiplyScalar(velMov));
}

function moveSubmarineBackward() {
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(submarino.quaternion);
    submarino.position.add(direction.multiplyScalar(velMov));
}

function rotateSubmarineLeft() {
    submarino.rotation.y += velRot;
}

function rotateSubmarineRight() {
    submarino.rotation.y -= velRot;
}

function moveSubmarineUp() {
    submarino.position.y += velMov;
    submarino.position.y = Math.min(submarino.position.y, 100);
}

function moveSubmarineDown() {
    submarino.position.y -= velMov;
    submarino.position.y = Math.max(submarino.position.y, -8);
}

function logSubmarinePosition() {
    const position = {
        x: submarino.position.x.toFixed(2),
        y: submarino.position.y.toFixed(2),
        z: submarino.position.z.toFixed(2),
        rotationY: submarino.rotation.y.toFixed(2),
    };
    positionsLog.push(position);
    console.log('Posição e rotação do submarino:', position);
}

const caverna = new Caverna();
caverna.load(scene);

const atlantis = new Atlantis();
atlantis.load(scene); 

const fundo = new Fundo();
fundo.load(scene); 

const peixes = new Peixes();
peixes.load(scene);

const peixes3 = new Peixes3();
peixes3.load(scene);

const tartaruga = new Tartaruga();
tartaruga.load(scene);

const treasure = new Treasure();
treasure.load(scene);

const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
const sound = new THREE.Audio(listener)
const context = new AudioContext()
listener.context = context

audioLoader.load('./sounds/submarine-33709.mp3', function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.play();
});

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    peixes.update(delta); 
    peixes3.update(delta);
    tartaruga.update(delta);

    const direction = new THREE.Vector3(0, 0, -0.10).applyQuaternion(submarino.quaternion);

    spotlight.position.copy(submarino.position).add(direction.clone().multiplyScalar(2)); 

    spotlight.target.position.copy(submarino.position).add(direction);

    spotlight.target.updateMatrixWorld();

   
    for (let i = 0; i < particlesCount; i++) {
        let y = particlesGeometry.attributes.position.getY(i);
        y += 0.1; 

        if (y > 250) {
            y = -250;
        }
        particlesGeometry.attributes.position.setY(i, y);
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();
