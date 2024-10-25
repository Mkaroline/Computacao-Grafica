import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

export default class Peixes {
    constructor() {
        this.peixes = null;
        this.mixer = null; // Controlador de animações
        this.textureLoader = new TextureLoader();
    }

    load(scene) {
        const loader = new GLTFLoader();
        loader.load('./Modelo/school_of_fish/scene.gltf', (gltf) => {
            this.peixes = gltf.scene;

            // Adiciona o mixer para controlar as animações
            this.mixer = new THREE.AnimationMixer(this.peixes);
            gltf.animations.forEach((clip) => {
                this.mixer.clipAction(clip).play();
            });

            this.peixes.scale.set(2, 2, 2); // Ajuste da escala
            this.peixes.position.set(30, 5, 135); // Ajuste da posição
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
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_0_diffuse.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_0_emissive.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_0_normal.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_0_occlusion.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_0_specularGlossiness.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_1_diffuse.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_1_normal.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_1_occlusion.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_1_specularGlossiness.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_3_diffuse.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_3_emissive.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_3_occlusion.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_3_normal.png'),
            this.textureLoader.load('./Modelo/school_of_fish/textures/material_3_specularGlossiness.png')
        ];

        // Aplicar as texturas aos materiais
        this.peixes.traverse((child) => {
            if (child.isMesh) {
                switch (child.name) {
                    case 'Material_0':
                        child.material.map = texturas[0];
                        child.material.emissiveMap = texturas[1];
                        child.material.normalMap = texturas[2];
                        child.material.aoMap = texturas[3];
                        child.material.specularMap = texturas[4];
                        break;
                    case 'Material_1':
                        child.material.map = texturas[5];
                        child.material.normalMap = texturas[6];
                        child.material.aoMap = texturas[7];
                        child.material.specularMap = texturas[8];
                        break;
                    case 'Material_3':
                        child.material.map = texturas[9];
                        child.material.emissiveMap = texturas[10];
                        child.material.aoMap = texturas[11];
                        child.material.normalMap = texturas[12];
                        child.material.specularMap = texturas[13];
                        break;
                    default:
                        console.log(`Parte do modelo ${child.name} não tem texturas especificadas.`);
                }

                child.material.needsUpdate = true;
            }
        });
    }

    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
}
