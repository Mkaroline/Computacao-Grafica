

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Water } from './threejs/Water.js';

// Cena e câmera
const scene = new THREE.Scene();
// Definindo a cor de fundo do oceano
scene.background = new THREE.Color(0x031f4d); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Luz ambiente e luz direcional
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00aaff, 1);
directionalLight.position.set(0, 10, 10).normalize();
scene.add(directionalLight);

// Classe Submarino
// Classe Submarino
class Submarino {
    constructor() {
        this.model = null;
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        loader.load(
            './Modelo/Submarine/scene.gltf',
            function (gltf) {
                scene.add(gltf.scene);
                object.model = gltf.scene.children[0];
                object.model.scale.set(0.1, 0.1, 0.1); 
                object.model.position.set(5, 10, 0); 
                console.log('Submarino carregado:', object.model);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('Erro ao carregar o modelo');
            }
        );
    }
}


const submarino = new Submarino();

class Fundo {
    constructor() {
        this.model = null;
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

        // Carregar a textura que será aplicada ao fundo
        const texturaFundo = textureLoader.load('./Modelo/Fundo/textures/arreia.jpg');

        loader.load(
            './Modelo/Fundo/Fundo.gltf',
            function (gltf) {
                object.model = gltf.scene;
                object.model.scale.set(100, 100, 100); // Aumenta o fundo
                object.model.position.set(0, -10, -50); // Posiciona o fundo
                scene.add(object.model);

                // Aplicar a textura em todos os meshes do fundo
                object.model.traverse((child) => {
                    if (child.isMesh) {
                        child.material.map = texturaFundo;  // Aplica a textura no material
                        child.material.needsUpdate = true;  // Atualiza o material
                    }
                });

                console.log('Fundo carregado com textura:', object.model);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('Erro ao carregar o fundo');
            }
        );
    }
}

const fundo = new Fundo();

// Classe que define as bolhas (ou Gotas)
class Gota {
    constructor() {
        this.x = Math.random() * 4 - 2;
        this.y = -5;
        this.z = Math.random() * 4 - 2;

        this.vx = 0.01 * (Math.random() - 0.5);
        this.vy = 0.05 * Math.random() + 0.01;
        this.vz = 0.01 * (Math.random() - 0.5);

        const geometry = new THREE.SphereGeometry(0.05);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6, shininess: 100 });
        this.cube = new THREE.Mesh(geometry, material);
        scene.add(this.cube);

        this.cube.position.set(this.x, this.y, this.z);
    }

    update() {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.cube.position.x += this.vx;
        this.cube.position.y += this.vy;
        this.cube.position.z += this.vz;

        if (this.cube.position.y > 5) {
            this.cube.position.x = Math.random() * 4 - 2;
            this.cube.position.y = -100;
            this.cube.position.z = Math.random() * 4 - 2;
            this.vy = 0.05 * Math.random() + 0.01;
            this.vx = 0.01 * (Math.random() - 0.5);
            this.vz = 0.01 * (Math.random() - 0.5);
        }
    }
}

// Array de gotas
let gotas = [];
for (let i = 0; i < 100; i++) {
    let gota = new Gota();
    gotas.push(gota);
}



// Criação do plano de água
const waterGeometry = new THREE.PlaneGeometry(500, 500);
const water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        waterColor: 0x031f4d,
        distortionScale: 3.7,
    }
);
water.rotation.x = -Math.PI / 2;
water.position.y = 210;
scene.add(water);

// Variáveis de controle de movimento
let arrowUp = false;
let arrowDown = false;
let arrowRight = false;
let arrowLeft = false;
let wKey = false;
let sKey = false;


// Função de animação
function animate() {
    renderer.render(scene, camera);
    for (let gota of gotas) {
        gota.update();
    }

     // Movimentar câmera
     if (arrowUp) {
        camera.position.y -= 0.1;
    }
    if (arrowDown) {
        camera.position.y += 0.1;
    }
    if (arrowRight) {
        camera.position.x -= 0.1;
    }
    if (arrowLeft) {
        camera.position.x += 0.1;
    }

    // Movimentar submarino e câmera juntos
    if (wKey && submarino.model) {
        submarino.model.position.z -= 0.1;
        camera.position.z -= 0.1;
    }
    if (sKey && submarino.model) {
        submarino.model.position.z += 0.1;
        camera.position.z += 0.1;
    }


    controls.update();
}

// Inicia o loop de animação
renderer.setAnimationLoop(animate);

// Iniciar a animação
animate();

// Eventos de teclado
document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);

function onDocumentKeyDown(event) {
    switch (event.key) {
        case "ArrowUp":
            arrowUp = true;
            break;
        case "ArrowDown":
            arrowDown = true;
            break;
        case "ArrowRight":
            arrowRight = true;
            break;
        case "ArrowLeft":
            arrowLeft = true;
            break;
        case "w":
            wKey = true;
            break;
        case "s":
            sKey = true;
            break;
    }
}

function onDocumentKeyUp(event) {
    switch (event.key) {
        case "ArrowUp":
            arrowUp = false;
            break;
        case "ArrowDown":
            arrowDown = false;
            break;
        case "ArrowRight":
            arrowRight = false;
            break;
        case "ArrowLeft":
            arrowLeft = false;
            break;
        case "w":
            wKey = false;
            break;
        case "s":
            sKey = false;
            break;
    }
}