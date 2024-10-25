import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

export default class Fundo {
    constructor() {
        this.fundo = null;
        this.textureLoader = new TextureLoader();
    }

    load(scene) {
        const loader = new GLTFLoader();
        loader.load('./Modelo/Fundo/Fundo2.gltf', (gltf) => {
            this.fundo = gltf.scene;
            this.fundo.scale.set(60, 60, 60); // Ajuste da escala
            this.fundo.position.set(0, -10, -40); // Ajuste da posição
            this.fundo.rotation.set(0, Math.PI, 0); // Rotação

            // Aplica as texturas ao modelo
            this.applyTextures();

            scene.add(this.fundo);
        }, undefined, (error) => {
            console.error('Erro ao carregar o fundo:', error);
        });
    }

    applyTextures() {
        // Carregando textura específica para o fundo
        const texturaFundo = this.textureLoader.load('./Modelo/Fundo/textures/pexels-apasaric-1527934.jpg');

        // Aplicar as texturas aos materiais
        this.fundo.traverse((child) => {
            if (child.isMesh) {
                child.material.map = texturaFundo;
                child.material.needsUpdate = true;
            }
        });
    }
}
