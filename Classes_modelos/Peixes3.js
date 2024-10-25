import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

// Classe Peixes
export default class Peixes3 {
    constructor() {
        this.peixes = null;
        this.mixer = null; // Controlador de animações
        this.textureLoader = new TextureLoader();
    }

    load(scene) {
        const loader = new GLTFLoader();
        loader.load('./Modelo/fishs/scene.gltf', (gltf) => {
            this.peixes = gltf.scene;

            // Adiciona animações ao mixer
            this.mixer = new THREE.AnimationMixer(this.peixes);
            gltf.animations.forEach((clip) => {
                this.mixer.clipAction(clip).play();
            });

            this.peixes.scale.set(2, 2, 2); // Ajuste da escala
            this.peixes.position.set(30, 10, 175); // Ajuste da posição
            this.peixes.rotation.set(0, -Math.PI / 45, 0); // Ajuste da rotação

            // Aplica as texturas ao modelo
            this.applyTextures();

            scene.add(this.peixes);
        }, undefined, (error) => {
            console.error('Erro ao carregar o modelo de peixes:', error);
        });
    }

    applyTextures() {
        // Carregando texturas
        const texturas = [
            this.textureLoader.load('./Modelo/fishs/textures/Material.001_baseColor.jpeg'),
            // Adicione mais texturas conforme necessário
        ];

        // Aplicar as texturas aos materiais
        this.peixes.traverse((child) => {
            if (child.isMesh) {
                switch (child.name) {
                    case 'Material.001':
                        child.material.map = texturas[0];
                        // Adicione mais mapeamentos de texturas conforme necessário
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
