import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Peixes2 {
    constructor() {
        this.peixes = null;
        this.mixer = null; // Controlador de animações
    }

    load(scene) {
        const loader = new GLTFLoader();
        loader.load('./Modelo/the_fish_particle/scene.gltf', (gltf) => {
            this.peixes = gltf.scene;

            // Adiciona animações ao mixer
            this.mixer = new THREE.AnimationMixer(this.peixes);
            gltf.animations.forEach((clip) => {
                this.mixer.clipAction(clip).play();
            });

            this.peixes.scale.set(2, 2, 2); // Ajuste da escala
            this.peixes.position.set(10, -1, 135); // Ajuste da posição
            this.peixes.rotation.set(0, -Math.PI / 45, 0); // Ajuste da rotação

            scene.add(this.peixes);
        }, undefined, (error) => {
            console.error('Erro ao carregar o modelo de peixes:', error);
        });
    }

    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
}
