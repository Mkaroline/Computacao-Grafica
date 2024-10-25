import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

// Classe Tartaruga
export default class Tartaruga {
    constructor() {
        this.tartaruga = null;
        this.mixer = null;
        this.textureLoader = new TextureLoader();
    }

    load(scene) {
        const loader = new GLTFLoader();
        loader.load('./Modelo/turtle_swim/scene.gltf', (gltf) => {
            this.tartaruga = gltf.scene;

            // Adiciona animações ao mixer
            this.mixer = new THREE.AnimationMixer(this.tartaruga);
            gltf.animations.forEach((clip) => {
                this.mixer.clipAction(clip).play();
            });

            this.tartaruga.scale.set(1, 1, 1); // Ajuste a escala
            this.tartaruga.position.set(-10, -9, 200); // Ajuste a posição

            // Aplica as texturas ao modelo
            this.applyTextures();

            scene.add(this.tartaruga);
        }, undefined, (error) => {
            console.error('Erro ao carregar o modelo da tartaruga:', error);
        });
    }

    applyTextures() {
        // Carregando texturas
        const texturas = [
            this.textureLoader.load('./Modelo/turtle_swim/textures/greenbody_baseColor.jpeg'),
            this.textureLoader.load('./Modelo/turtle_swim/textures/greenbody_normal.png'),
            this.textureLoader.load('./Modelo/turtle_swim/textures/greeneye_baseColor.png'),
            this.textureLoader.load('./Modelo/turtle_swim/textures/greeneye_normal.png'),
        ];

        // Aplicar as texturas aos materiais
        this.tartaruga.traverse((child) => {
            if (child.isMesh) {
                switch (child.name) {
                    case 'GreenBody': // Exemplo de nome, ajuste conforme necessário
                        child.material.map = texturas[0];
                        child.material.normalMap = texturas[1];
                        break;
                    case 'GreenEye': // Exemplo de nome, ajuste conforme necessário
                        child.material.map = texturas[2];
                        child.material.normalMap = texturas[3];
                        break;
                    default:
                        console.log(`Parte do modelo ${child.name} não tem texturas especificadas.`);
                }

                child.material.needsUpdate = true;
            }
        });
    }

    // Método para atualizar a animação
    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
}
