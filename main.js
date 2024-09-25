import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

class Submarino {
    constructor() {
        this.model = null;
        this.load(this);
    }

    load(object) {
        const loader = new GLTFLoader();
        loader.load(
            './modelo/submarine.gltf',
            function (gltf) {
                scene.add(gltf.scene);
                object.model = gltf.scene.children[0];
                object.model.scale.set(0.5, 0.5, 0.5); 
                object.model.position.set(0, 0, 0); 
                console.log('Modelo carregado:', object.model);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('An error happened');
            }
        );
    }
}

const submarino = new Submarino();

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

camera.position.z = 15; 

let arrowUp = false;
let arrowDown = false;
let arrowRight = false;
let arrowLeft = false;
let wKey = false; 
let sKey = false; 

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

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

  
    if (wKey) {
        submarino.model.position.z -= 0.1;  
        camera.position.z -= 0.1; 
    }
    if (sKey) {
        submarino.model.position.z += 0.1; 
        camera.position.z += 0.1; 
    }
    
}

animate();

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
