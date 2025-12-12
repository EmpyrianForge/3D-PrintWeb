import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { texture } from 'three/tsl';


const canvas = document.querySelector("#experience-canvas");
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



// Loaders
const textureLoader = new THREE.TextureLoader();

// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const textureMap = {
    First: {
        day:"/textures/1RoomBake.webp"
    },
    Second: {
        day:"/textures/2Shelfs.webp"
    },
    Third: {
        day:"/textures/3Machines.webp"
    },
    Fourth: {
        day:"/textures/4LittleShit.webp"
    },
};

const loadedTextures = {
    day: {},
};

Object.entries(textureMap).forEach(([key, paths]) => {
    const dayTexture = textureLoader.load(paths.day);
    dayTexture.flipY = false;
    dayTexture.colorSpace = THREE.SRGBColorSpace;
    loadedTextures.day[key] = dayTexture;
});

loader.load("/models/Roomgood-v1.glb", (glb) => { 
    glb.scene.traverse(child => {
        if (child.isMesh) {
            Object.keys(textureMap).forEach((key) => {
                if (child.name.includes(key)) {
                    const material = new THREE.MeshBasicMaterial({
                        map: loadedTextures.day[key],
                    });

                    child.material = material;
                }
            });
        }

        scene.add(glb.scene);
        glb.scene.scale.set(0.1, 0.1, 0.1);  // 50% Größe // oder
        glb.scene.scale.setScalar(0.1);      // Gleichmäßig auf 30%
        camera.position.z = 45;               // Kamera weiter weg

    });
});




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000 
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );


//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );


const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();


//Event Listener
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const render = () => {
    controls.update();

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    renderer.render( scene, camera );

    window.requestAnimationFrame( render );
}

render()