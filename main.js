import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Water } from './threejs/Water.js';

// Cena e câmera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x031f4d);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 5, -275);

// Renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Velocidades de movimento e rotação do submarino
const velMov = 0.5;
const velRot = 0.5;
let submarino;

// Lista para armazenar as posições e rotações do submarino
const positionsLog = [];

// Adicionando iluminação ambiente
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// Adicionando iluminação direcional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 200, 300);
scene.add(directionalLight);

// Carrega o modelo do submarino
const loader = new GLTFLoader();
loader.load('./Modelo/Submarine/scene.gltf', function (gltf) {
    submarino = gltf.scene;
    submarino.scale.set(0.0050, 0.0050, 0.0050);
    submarino.position.set(35, -7, -400);
    scene.add(gltf.scene);

    // Move o submarino
    document.addEventListener('keydown', function (event) {
        handleSubmarineMovement(event);
    });
}, undefined, function (error) {
    console.error(error);
});

// Função de movimentação do submarino
function handleSubmarineMovement(event) {
    if (!submarino) return; // Verifica se o submarino foi carregado

    switch (event.key) {
        case 'ArrowUp': moveSubmarineUp(); break;
        case 'ArrowDown': moveSubmarineDown(); break;
        case 'ArrowLeft': rotateSubmarineLeft(); break;
        case 'ArrowRight': rotateSubmarineRight(); break;
        case 'w': moveSubmarineForward(); break;
        case 's': moveSubmarineBackward(); break;
    }

    // Atualiza a posição da câmera
    camera.position.set(submarino.position.x, submarino.position.y + 1, submarino.position.z - 6);

    // Armazena a posição e rotação atuais do submarino
    logSubmarinePosition();
}

// Funções de movimentação e rotação do submarino
function moveSubmarineForward() {
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(submarino.quaternion);
    submarino.position.add(direction.multiplyScalar(velMov));
}

function moveSubmarineBackward() {
    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(submarino.quaternion);
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
    if (submarino.position.y >= 208) submarino.position.y = 208;
}

function moveSubmarineDown() {
    submarino.position.y -= velMov;
    if (submarino.position.y <= -50) submarino.position.y = -50;
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

// Classe Fundo
class Fundo {
    constructor() {
        this.model = null;
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();
        const texturaFundo = textureLoader.load('./Modelo/Fundo/textures/pexels-apasaric-1527934.jpg');

        loader.load('./Modelo/Fundo/Fundo2.gltf', function (gltf) {
            object.model = gltf.scene;
            object.model.scale.set(60, 60, 60);
            object.model.position.set(0, -10, -40);
            scene.add(object.model);

            object.model.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texturaFundo;
                    child.material.needsUpdate = true;
                }
            });
        }, function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% carregado');
        }, function (error) {
            console.log('Erro ao carregar o fundo:', error);
        });
    }
}

const submarino = new Submarino();

// Classe Caverna
class Caverna {
    constructor() {
        this.model = null;
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

        const texturas = [
            textureLoader.load('./Modelo/ruins_cave/textures/rock_baseColor.jpeg'),
            textureLoader.load('./Modelo/ruins_cave/textures/cave_metallicRoughness.png'),
            textureLoader.load('./Modelo/ruins_cave/textures/cave_normal.jpeg'),
            textureLoader.load('./Modelo/ruins_cave/textures/concrete1_baseColor.jpeg'),
            textureLoader.load('./Modelo/ruins_cave/textures/concrete1_metallicRoughness.png'),
            textureLoader.load('./Modelo/ruins_cave/textures/concrete1_normal.jpeg'),
            textureLoader.load('./Modelo/ruins_cave/textures/concrete2_baseColor.jpeg'),
            textureLoader.load('./Modelo/ruins_cave/textures/concrete2_metallicRoughness.png'),
            textureLoader.load('./Modelo/ruins_cave/textures/ground_normal.jpeg'),
            textureLoader.load('./Modelo/ruins_cave/textures/rock_baseColor.jpeg'),
            textureLoader.load('./Modelo/ruins_cave/textures/steel_metallicRoughness.png'),
            textureLoader.load('./Modelo/ruins_cave/textures/steel_normal.png'),
            textureLoader.load('./Modelo/ruins_cave/textures/stone1_baseColor.jpeg'),
            textureLoader.load('./Modelo/ruins_cave/textures/stone1_metallicRoughness.png'),
            textureLoader.load('./Modelo/ruins_cave/textures/stone1_normal.jpeg'),
            textureLoader.load('./Modelo/ruins_cave/textures/stone2_baseColor.jpeg'),
            textureLoader.load('./Modelo/ruins_cave/textures/stone2_metallicRoughness.png'),
        ];

        loader.load(
            './Modelo/ruins_cave/scene.gltf',
            (gltf) => {
                object.model = gltf.scene;
                object.model.scale.set(3, 3, 3); // Aumenta o fundo
                object.model.position.set(30, -8, -200); // Posiciona o fundo
                object.model.rotation.set(0, Math.PI, 0); // Rotação em radianos
                scene.add(object.model);

            }, function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% carregado');
            }, function (error) {
                console.log('Erro ao carregar o modelo Atlantis:', error);
            });
        }
    }

const caverna = new Caverna();

class Atlantis {
    constructor() {
        this.model = null;
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

        const texturas = [
            textureLoader.load('./Modelo/atlantis/textures/Buildings_2_baseColor.png'),
            textureLoader.load('./Modelo/atlantis/textures/Buildings_baseColor.png'),
            textureLoader.load('./Modelo/atlantis/textures/Corridor_baseColor.png'),
            textureLoader.load('./Modelo/atlantis/textures/Rocks_baseColor.png'),
            textureLoader.load('./Modelo/atlantis/textures/Rocks_normal.png'),
            textureLoader.load('./Modelo/atlantis/textures/Sand_baseColor.png'),
            textureLoader.load('./Modelo/atlantis/textures/Sea_Plants_baseColor.png'),
            textureLoader.load('./Modelo/atlantis/textures/Trim_Sheet_baseColor.png'),
        ];

        loader.load('./Modelo/atlantis/scene.gltf', function (gltf) {
            object.model = gltf.scene;
            object.model.scale.set(3000, 3000, 3000);
            object.model.position.set(50, -9, 135);
            object.model.rotation.set(0, -Math.PI / 45, 0);
            scene.add(object.model);
        }, function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% carregado');
        }, function (error) {
            console.log('Erro ao carregar o modelo Atlantis:', error);
        });
    }
}

const atlantis = new Atlantis();

class Peixes {
    constructor() {
        this.model = null;
        this.mixer = null; // Adiciona um mixer para controlar animações
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

        const texturas = [
            textureLoader.load('./Modelo/school_of_fish/textures/material_0_diffuse.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_0_emissive.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_0_normal.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_0_occlusion.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_0_specularGlossiness.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_1_diffuse.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_1_normal.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_1_occlusion.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_1_specularGlossiness.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_3_diffuse.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_3_emissive.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_3_occlusion.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_3_normal.png'),
            textureLoader.load('./Modelo/school_of_fish/textures/material_3_specularGlossiness.png'),
        ];

        loader.load('./Modelo/school_of_fish/scene.gltf', (gltf) => {
            object.model = gltf.scene;

            // Adiciona animações ao mixer
            object.mixer = new THREE.AnimationMixer(object.model);
            gltf.animations.forEach((clip) => {
                object.mixer.clipAction(clip).play();
            });

            object.model.scale.set(2, 2, 2);
            object.model.position.set(30, 5, 135);
            object.model.rotation.set(0, -Math.PI / 45, 0);
            scene.add(object.model);
        }, (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% carregado');
        }, (error) => {
            console.log('Erro ao carregar o modelo Atlantis:', error);
        });
    }

    // Método para atualizar a animação
    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
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