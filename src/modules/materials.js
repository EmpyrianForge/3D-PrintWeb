import * as THREE from "three";

export const environmentMap = new THREE.CubeTextureLoader()
  .setPath("/textures/skybox/")
  .load(["px.webp", "nx.webp", "py.webp", "ny.webp", "pz.webp", "nz.webp"]);

export const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transparent: true,
  opacity: 0.25,
  ior: 1.5,
  envMap: environmentMap,
  transmission: 1,
  thickness: 0.1,
  depthWrite: false,
});

export const blueMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x000080,
  metalness: 0,
  roughness: 0,
  transparent: true,
  opacity: 0.3,
  ior: 1.5,
  envMap: environmentMap,
  transmission: 0.8,
  thickness: 0.1,
  depthWrite: false,
});

export const orangeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff8c00,
  metalness: 0,
  roughness: 0,
  transparent: true,
  opacity: 0.5,
  ior: 1.5,
  envMap: environmentMap,
  transmission: 0.8,
  thickness: 0.1,
  depthWrite: false,
});

export const glassGreenMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x2d9114,
  metalness: 0,
  roughness: 0,
  transparent: true,
  opacity: 0.8,
  ior: 1.5,
  envMap: environmentMap,
  transmission: 1,
  thickness: 0.1,
  depthWrite: false,
});

export const whiteMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
});
