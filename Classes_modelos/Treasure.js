import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

// Classe Treasure
export default class Treasure {
    constructor() {
        this.treasure = null;
        this.textureLoader = new TextureLoader();
    }

    load(scene) {
        const loader = new GLTFLoader();
        loader.load('./Modelo/treasure_chest/scene.gltf', (gltf) => {
            this.treasure = gltf.scene;
            this.treasure.scale.set(3, 3, 3);
            this.treasure.position.set(10, -5, 285);
            this.treasure.rotation.set(0, Math.PI / 2, 0); // 90 graus

            // Aplica as texturas ao modelo
            this.applyTextures();

            scene.add(this.treasure);
        }, undefined, (error) => {
            console.error('Erro ao carregar o modelo do tesouro:', error);
        });
    }

    applyTextures() {
        // Carregando texturas
        const texturas = [
            this.textureLoader.load('./Modelo/treasure_chest/textures/Material.002_baseColor.png'),
            this.textureLoader.load('./Modelo/treasure_chest/textures/Material.007_baseColor.png'),
        ];

        // Aplicar as texturas aos materiais
        this.treasure.traverse((child) => {
            if (child.isMesh) {
                // Ajuste os nomes das partes do modelo conforme necessário
                switch (child.name) {
                    case 'TreasureChestBody': // Exemplo de nome, ajuste conforme necessário
                        child.material.map = texturas[0];
                        break;
                    case 'TreasureChestLid': // Exemplo de nome, ajuste conforme necessário
                        child.material.map = texturas[1];
                        break;
                    default:
                        console.log(`Parte do modelo ${child.name} não tem texturas especificadas.`);
                }

                child.material.needsUpdate = true;
            }
        });
    }
}
