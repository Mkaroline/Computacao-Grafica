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

// Cena e câmera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x031f4d);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 5, -275);

// Renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const clock = new THREE.Clock();

// Adiciona o controle da câmera
const control = new OrbitControls(camera, renderer.domElement);
control.update();

// Velocidades de movimento e rotação do submarino
const velMov = 0.5;
const velRot = 0.5;
let submarino = null; // Inicializa como nulo para garantir que o modelo seja carregado corretamente

// Lista para armazenar as posições e rotações do submarino
const positionsLog = [];

// Adicionando iluminação ambiente
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2); // Luz branca
directionalLight.position.set(0, 1000, 0);
scene.add(directionalLight);

// Spotlight
const spotlight = new THREE.SpotLight(0xffffff, 50); // Luz branca intensa
spotlight.position.set(35, -7, -350);
spotlight.angle = Math.PI / 20;
spotlight.penumbra = 0;
spotlight.decay = 0.5;
spotlight.distance = 150;
spotlight.castShadow = true;
scene.add(spotlight);
scene.add(spotlight.target);

// Sistema de partículas (bolhas)
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

scene.fog = new THREE.FogExp2(0x031f4d, 0.010); // Névoa para imitar o ambiente subaquático
renderer.setClearColor(scene.fog.color);

// Carrega o modelo do submarino
const loader = new GLTFLoader();
loader.load('./Modelo/Submarine/scene.gltf', function (gltf) {
    submarino = gltf.scene;
    submarino.scale.set(0.005, 0.005, 0.005);
    submarino.position.set(35, -7, -400);
    scene.add(submarino);

    // Movimentação do submarino via teclado
    document.addEventListener('keydown', handleSubmarineMovement);
}, undefined, function (error) {
    console.error(error);
});

// Função de movimentação do submarino
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

    // Atualiza a posição da câmera para seguir o submarino
    camera.position.set(submarino.position.x, submarino.position.y + 1, submarino.position.z - 6);

    // Armazena a posição e rotação do submarino
    logSubmarinePosition();
}

// Funções de movimentação e rotação do submarino
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
    submarino.position.y = Math.min(submarino.position.y, 208);
}

function moveSubmarineDown() {
    submarino.position.y -= velMov;
    submarino.position.y = Math.max(submarino.position.y, -50);
}

// Função para registrar a posição e rotação do submarino
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

// Carrega a classe Caverna e adiciona à cena
const caverna = new Caverna();
caverna.load(scene);

const atlantis = new Atlantis();
atlantis.load(scene); // Carrega Atlantis na cena com as texturas

const fundo = new Fundo();
fundo.load(scene); // Carrega o modelo de fundo na cena

const peixes = new Peixes();
peixes.load(scene);

const peixes3 = new Peixes3();
peixes3.load(scene);

const tartaruga = new Tartaruga();
tartaruga.load(scene);

const treasure = new Treasure();
treasure.load(scene);

// Função de animação principal
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    peixes.update(delta); // Atualiza a animação dos peixes
    peixes3.update(delta);
    tartaruga.update(delta);

    if (submarino) {
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(submarino.quaternion);
        spotlight.position.copy(submarino.position).add(direction.multiplyScalar(2));
        spotlight.target.position.copy(submarino.position).add(direction);
        spotlight.target.updateMatrixWorld();
    }

    // Atualiza as partículas (bolhas)
    for (let i = 0; i < particlesCount; i++) {
        let y = particlesGeometry.attributes.position.getY(i);
        y += 0.1; // Move as bolhas para cima

        if (y > 250) {
            y = -250;
        }
        particlesGeometry.attributes.position.setY(i, y);
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// Inicia a animação
animate();
