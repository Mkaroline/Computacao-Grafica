import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

export default class Atlantis {
    constructor() {
        this.atlantis = null;
        this.textureLoader = new TextureLoader();
    }

    load(scene) {
        const loader = new GLTFLoader();
        loader.load('./Modelo/atlantis/scene.gltf', (gltf) => {
            this.atlantis = gltf.scene;
            this.atlantis.scale.set(3000, 3000, 3000); // Ajuste de escala
            this.atlantis.position.set(50, -9, 135); // Ajuste de posição
            this.atlantis.rotation.set(0, -Math.PI / 45, 0); // Rotação

            // Aplica as texturas ao modelo
            this.applyTextures();

            scene.add(this.atlantis);
        }, undefined, (error) => {
            console.error('Erro ao carregar o modelo Atlantis:', error);
        });
    }

    applyTextures() {
        // Carregando texturas
        const texturas = [
            this.textureLoader.load('./Modelo/atlantis/textures/Buildings_2_baseColor.png'),
            this.textureLoader.load('./Modelo/atlantis/textures/Buildings_baseColor.png'),
            this.textureLoader.load('./Modelo/atlantis/textures/Corridor_baseColor.png'),
            this.textureLoader.load('./Modelo/atlantis/textures/Rocks_baseColor.png'),
            this.textureLoader.load('./Modelo/atlantis/textures/Rocks_normal.png'),
            this.textureLoader.load('./Modelo/atlantis/textures/Sand_baseColor.png'),
            this.textureLoader.load('./Modelo/atlantis/textures/Sea_Plants_baseColor.png'),
            this.textureLoader.load('./Modelo/atlantis/textures/Trim_Sheet_baseColor.png'),
        ];

        // Aplicar as texturas aos materiais
        this.atlantis.traverse((child) => {
            if (child.isMesh) {
                switch (child.name) {
                    case 'Buildings_2':
                        child.material.map = texturas[0];
                        break;
                    case 'Buildings':
                        child.material.map = texturas[1];
                        break;
                    case 'Corridor':
                        child.material.map = texturas[2];
                        break;
                    case 'Rocks':
                        child.material.map = texturas[3];
                        child.material.normalMap = texturas[4];
                        break;
                    case 'Sand':
                        child.material.map = texturas[5];
                        break;
                    case 'Sea_Plants':
                        child.material.map = texturas[6];
                        break;
                    case 'Trim_Sheet':
                        child.material.map = texturas[7];
                        break;
                    default:
                        console.log(`Parte do modelo ${child.name} não tem texturas especificadas.`);
                }

                child.material.needsUpdate = true;
            }
        });
    }
}
