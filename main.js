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
const clock = new THREE.Clock();

// Adiciona o controle da câmera
const control = new OrbitControls(camera, renderer.domElement);
control.update();

// Velocidades de movimento e rotação do submarino
const velMov = 0.5;
const velRot = 0.5;
let submarino;

// Lista para armazenar as posições e rotações do submarino
const positionsLog = [];

// Adicionando iluminação ambiente
const ambientLight = new THREE.AmbientLight(0x191970, 5);
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
        case 'w': moveSubmarineForward(); break;  // Movimenta o submarino para frente com W
        case 's': moveSubmarineBackward(); break; // Movimenta o submarino para trás com S
    }

    // Atualiza a posição da câmera
    camera.position.set(submarino.position.x, submarino.position.y + 1, submarino.position.z - 6);

    // Armazena a posição e rotação atuais do submarino
    logSubmarinePosition();
}

// Funções de movimentação e rotação do submarino
function moveSubmarineForward() {
    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(submarino.quaternion); // Muda o vetor para frente
    submarino.position.add(direction.multiplyScalar(velMov));
}

function moveSubmarineBackward() {
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(submarino.quaternion); // Muda o vetor para trás
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

const fundo = new Fundo();

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

class Treasure {
    constructor() {
        this.model = null;
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

        const texturas = [
            textureLoader.load('./Modelo/treasure_chest/textures/Material.002_baseColor.png'),
            textureLoader.load('./Modelo/treasure_chest/textures/Material.007_baseColor.png'),
        ];

        loader.load('./Modelo/treasure_chest/scene.gltf', function (gltf) {
            object.model = gltf.scene;
            object.model.scale.set(3, 3, 3);
            object.model.position.set(10, -5, 285);
            object.model.rotation.set(0, Math.PI / 2, 0); // 90 graus

            scene.add(object.model);
        }, function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% carregado');
        }, function (error) {
            console.log('Erro ao carregar o modelo Atlantis:', error);
        });
    }
}

const treasure = new Treasure();

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

const peixes = new Peixes();

class PeixesR {
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
            object.model.position.set(10, -1, 135);
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

const peixesr = new PeixesR();

class Peixes2 {
    constructor() {
        this.model = null;
        this.mixer = null; // Adiciona um mixer para controlar animações
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

       
        const texturas = [
            textureLoader.load('./Modelo/fishs/textures/Material.001_baseColor.jpeg'),
         
        ];

        loader.load('./Modelo/fishs/scene.gltf', (gltf) => {
            object.model = gltf.scene;

            // Adiciona animações ao mixer
            object.mixer = new THREE.AnimationMixer(object.model);
            gltf.animations.forEach((clip) => {
                object.mixer.clipAction(clip).play();
            });

            object.model.scale.set(2, 2, 2);
            object.model.position.set(30, 10, 175);
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

const peixes2 = new Peixes2();

class Tartaruga {
    constructor() {
        this.model = null;
        this.mixer = null;
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

        // Carregar as texturas
        const texturas = [
            textureLoader.load('./Modelo/turtle_swim/textures/greenbody_baseColor.jpeg'),
            textureLoader.load('./Modelo/turtle_swim/textures/greenbody_normal.png'),
            textureLoader.load('./Modelo/turtle_swim/textures/greeneye_baseColor.png'),
            textureLoader.load('./Modelo/turtle_swim/textures/greeneye_normal.png'),
        ];

        loader.load('./Modelo/turtle_swim/scene.gltf', (gltf) => {
            object.model = gltf.scene;

            // Adiciona animações ao mixer
            object.mixer = new THREE.AnimationMixer(object.model);
            gltf.animations.forEach((clip) => {
                object.mixer.clipAction(clip).play();
            });

            object.model.scale.set(1, 1, 1); // Ajuste a escala
            object.model.position.set(-10, -9, 200); // Ajuste a posição

            // Aplicar texturas se necessário
            object.model.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texturas[0]; // Exemplo de aplicação
                }
            });

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

const tartaruga = new Tartaruga();

class Shark {
    constructor() {
        this.model = null;
        this.mixer = null;
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

        // Carregar as texturas
        const texturas = [
            textureLoader.load('./Modelo/animated_swimming_great_white_shark_loop (1)/textures/material_0_diffuse.png'),
            textureLoader.load('./Modelo/animated_swimming_great_white_shark_loop (1)/textures/material_0_normal.png'),
            textureLoader.load('./Modelo/animated_swimming_great_white_shark_loop (1)/textures/material_0_occlusion.png'),
            textureLoader.load('./Modelo/animated_swimming_great_white_shark_loop (1)/textures/material_0_specularGlossiness.png'),
        ];

        loader.load('./Modelo/animated_swimming_great_white_shark_loop (1)/scene.gltf', (gltf) => {
            object.model = gltf.scene;

            // Adiciona animações ao mixer
            object.mixer = new THREE.AnimationMixer(object.model);
            gltf.animations.forEach((clip) => {
                object.mixer.clipAction(clip).play();
            });

            object.model.scale.set(2, 2, 2); // Ajuste a escala
            object.model.position.set(10, 10, 400); // Ajuste a posição

            // Aplicar texturas se necessário
            object.model.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texturas[0]; // Exemplo de aplicação
                }
            });

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

const shark = new Shark();


// No seu loop de animação principal (geralmente a função render), adicione:
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta(); // O tempo que passou desde a última chamada
    peixes.update(delta); // Atualiza a animação dos peixes
    peixesr.update(delta);
    tartaruga.update(delta);
    peixes2.update(delta);
    shark.update(delta);
    renderer.render(scene, camera);
}

// Inicia a animação
animate();