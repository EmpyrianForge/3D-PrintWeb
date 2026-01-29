import * as THREE from "three";

export const state = {
  isModalOpen: false,
  isDragging: false,
  raycasterNeedsUpdate: true,
  touchHappend: false,

  // Objects
  animatedObjects: {
    Shield_MyWork: null,
    Shield_About: null,
    Shield_Contact: null,
    H2C: null,
    H2C_Green: null,
    GitHubFront: null,
    LeetCodeButton: null,
    BootdevButton: null,
    ResinFormlabs_Orange: null,
    ResinFormlabs: null,
    Dixiclock: null,
    Gandalf: null,
    Name_A1: null,
    Name_A2: null,
    Name_B: null,
    Name_C: null,
    Name_E: null,
    Name_H: null,
    Name_I: null,
    Name_K: null,
    Name_N1: null,
    Name_N2: null,
    Name_U: null,
    Name_V: null,
    ResinWash: null,
    ResinWashCure: null,
    GamingPC: null,
    Ship: null,
    Spachtel: null,
    Bildschirm: null,
    Monitor_Screen: null,
  },

  zAxisFans: [],
  yAxisFans: [],
  raycasterObjects: [],

  // Interaction
  currentIntersects: [],
  activeHoverObjects: new Set(),
  pointer: new THREE.Vector2(),

  // Banner
  bannerTime: 0,
  marqueeOffset: 0,
  iconImages: [],
  iconLoadStates: [],
};
