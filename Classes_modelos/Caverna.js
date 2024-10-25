import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

// Classe Caverna
export default class Caverna {
    constructor() {
        this.caverna = null;
        this.textureLoader = new TextureLoader();
    }

    load(scene) {
        const loader = new GLTFLoader();
        loader.load('./Modelo/ruins_cave/scene.gltf', (gltf) => {
            this.caverna = gltf.scene;
            this.caverna.scale.set(3, 3, 3);
            this.caverna.position.set(30, -8, -200); // Ajuste a posição conforme necessário
            this.caverna.rotation.set(0, Math.PI, 0); // Rotação em radianos
            // Aplica as texturas ao modelo
            this.applyTextures();

            scene.add(this.caverna);
        }, undefined, (error) => {
            console.error('Erro ao carregar a caverna:', error);
        });
    }

    applyTextures() {
        // Carregando texturas
        const texturas = [
            this.textureLoader.load('./Modelo/ruins_cave/textures/rock_baseColor.jpeg'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/cave_metallicRoughness.png'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/cave_normal.jpeg'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/concrete1_baseColor.jpeg'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/concrete1_metallicRoughness.png'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/concrete1_normal.jpeg'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/concrete2_baseColor.jpeg'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/concrete2_metallicRoughness.png'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/ground_normal.jpeg'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/rock_baseColor.jpeg'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/steel_metallicRoughness.png'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/steel_normal.png'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/stone1_baseColor.jpeg'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/stone1_metallicRoughness.png'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/stone1_normal.jpeg'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/stone2_baseColor.jpeg'),
            this.textureLoader.load('./Modelo/ruins_cave/textures/stone2_metallicRoughness.png')
        ];

        // Aplicar as texturas aos materiais
        this.caverna.traverse((child) => {
            if (child.isMesh) {
                switch (child.name) {
                    case 'Rock':
                        child.material.map = texturas[0];
                        child.material.metalnessMap = texturas[1];
                        child.material.normalMap = texturas[2];
                        break;
                    case 'Concrete1':
                        child.material.map = texturas[3];
                        child.material.metalnessMap = texturas[4];
                        child.material.normalMap = texturas[5];
                        break;
                    case 'Concrete2':
                        child.material.map = texturas[6];
                        child.material.metalnessMap = texturas[7];
                        break;
                    case 'Ground':
                        child.material.normalMap = texturas[8];
                        break;
                    case 'Steel':
                        child.material.metalnessMap = texturas[10];
                        child.material.normalMap = texturas[11];
                        break;
                    case 'Stone1':
                        child.material.map = texturas[12];
                        child.material.metalnessMap = texturas[13];
                        child.material.normalMap = texturas[14];
                        break;
                    case 'Stone2':
                        child.material.map = texturas[15];
                        child.material.metalnessMap = texturas[16];
                        break;
                    default:
                        console.log(`Parte do modelo ${child.name} não tem texturas especificadas.`);
                }

                child.material.needsUpdate = true;
            }
        });
    }
}
