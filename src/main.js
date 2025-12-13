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

const enviromentMap = new THREE.CubeTextureLoader()
    .setPath("/textures/skybox/")
    .load([
        "px.webp",
        "nx.webp",
        "py.webp",
        "ny.webp",
        "pz.webp",
        "nz.webp",
    ]);


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

const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.25,
    ior: 1.5,
    envMap: enviromentMap,
    transmission: 1,
    thickness: 0.1,
    depthWrite: false,
});
const whiteMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
});

const videoElement = document.createElement("video");
videoElement.src = "/textures/video";
videoElement.crossOrigin = "anonymous";
videoElement.loop = true;
videoElement.playsInline = true;
videoElement.muted = true;
videoElement.autoplay = true;
videoElement.play();

const videoTexture = new THREE.VideoTexture(videoElement);
videoTexture.colorSpace = THREE.SRGBColorSpace;
videoTexture.flipY = false;

loader.load("/models/Roomgood-v1.glb", (glb) => {
  glb.scene.traverse((child) => {
    if (child.isMesh) {
            if (child.name.includes("Water")) {
      child.material = new THREE.MeshPhysicalMaterial({
        color: 0x55B8C8,
        metalness: 0,
        roughness: 0,
        transparent: true,
        opacity: 0.6,
        ior: 1.33,
        depthWrite: false,
      });
    }else if (child.name.includes("Glass")) {
      child.material = glassMaterial;
    }else if (child.name.includes("White")) {
      child.material = whiteMaterial;
    }else if (child.name.includes("Screen")) {
      child.material = new THREE.MeshPhysicalMaterial({
        map: VideoTexture,
      });
    } else{
    Object.keys(textureMap).forEach((key) => {
        if (child.name.includes(key)) {
          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
          });

          child.material = material;

          if (child.material.map) {
            child.material.map.minFilter = THREE.LinearFilter;
          }
        }
      });
    }
    }
  });

  scene.add(glb.scene);
  glb.scene.scale.set(0.1, 0.1, 0.1);   // 50% Größe // oder
  glb.scene.scale.setScalar(0.1);        // Gleichmäßig auf 30%
  camera.position.z = 45;                // Kamera weiter weg
});





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    1000 
);

camera.position.set(98.35682075158908,46.704396522969226,86.44092573698502)

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
controls.target.set(-15.032524979835078,13.056863836526139,-11.60751480655244)


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

    console.log(camera.position);
    console.log("00000000000000");
    console.log(controls.target);
    
    renderer.render( scene, camera );

    window.requestAnimationFrame( render );
}

render()