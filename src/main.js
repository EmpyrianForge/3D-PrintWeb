import "./style.scss";
import * as THREE from "three";
import { state } from "./modules/state.js";
import { SIZES, SOCIAL_LINKS } from "./modules/config.js";
import { scene, camera, renderer, controls } from "./modules/scene.js";
import { initUI, showModal, modals } from "./modules/ui.js";
import { initBanner, updateBanner } from "./modules/banner.js";
import { initLoaders } from "./modules/loaders.js";
import { updateAnimations } from "./modules/animations.js";

const raycaster = new THREE.Raycaster();

const init = () => {
  initUI();
  initBanner();
  initLoaders();

  setupEventListeners();
  tick();
};

const setupEventListeners = () => {
  window.addEventListener("mousemove", (e) => {
    state.touchHappend = false;
    const newPointerX = (e.clientX / window.innerWidth) * 2 - 1;
    const newPointerY = -(e.clientY / window.innerHeight) * 2 + 1;

    if (
      !state.isModalOpen &&
      (Math.abs(newPointerX - state.pointer.x) > 0.001 ||
        Math.abs(newPointerY - state.pointer.y) > 0.001)
    ) {
      state.pointer.x = newPointerX;
      state.pointer.y = newPointerY;
      state.raycasterNeedsUpdate = true;
    }
  });

  window.addEventListener(
    "touchstart",
    (e) => {
      if (!state.isModalOpen && e.touches.length > 0) {
        state.pointer.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        state.pointer.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    },
    { passive: true },
  );

  window.addEventListener("click", () => {
    if (!state.isModalOpen && state.currentIntersects.length > 0) {
      const object = state.currentIntersects[0].object;

      // Social Links & Modals
      const objName = object.name.toLowerCase();
      const parentName = object.parent?.name?.toLowerCase() || "";
      const combined = `${objName} ${parentName}`;

      // Social Links
      Object.entries(SOCIAL_LINKS).forEach(([key, url]) => {
        const lowerKey = key.toLowerCase();
        
        // Ultra-permissive matching across object and parent names
        const matches = combined.includes(lowerKey) || 
                        (key === "LeetCodeButton" && combined.includes("leet")) ||
                        (key === "BootdevButton" && combined.includes("boot")) ||
                        (key === "GitHubFront" && combined.includes("git"));

        if (matches) {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      });

      // Modals
      if (combined.includes("shield_mywork")) {
        showModal(modals.work);
      } else if (combined.includes("shield_about")) {
        showModal(modals.about);
      } else if (combined.includes("shield_contact")) {
        showModal(modals.contact);
      }
    }
  });
};

const updateRaycaster = () => {
  if (!state.isDragging && !state.isModalOpen && state.raycasterNeedsUpdate) {
    raycaster.setFromCamera(state.pointer, camera);
    state.currentIntersects = raycaster.intersectObjects(
      state.raycasterObjects,
      false,
    );
    state.raycasterNeedsUpdate = false;
  }

  // Update Hover State
  if (!state.isDragging && !state.isModalOpen) {
    state.currentIntersects.forEach((intersect) => {
      const obj = intersect.object;
      const name = obj.name.toLowerCase();
      const pName = obj.parent?.name?.toLowerCase() || "";
      const combined = `${name} ${pName}`;

      const addToActive = (target) => {
        if (!target) return;
        if (Array.isArray(target)) {
          target.forEach((t) => state.activeHoverObjects.add(t));
        } else {
          state.activeHoverObjects.add(target);
        }
      };

      // Handle special groups
      if (combined.includes("h2c")) {
        addToActive(state.animatedObjects.H2C);
        addToActive(state.animatedObjects.H2C_Green);
      } else if (combined.includes("resinformlabs")) {
        addToActive(state.animatedObjects.ResinFormlabs);
        addToActive(state.animatedObjects.ResinFormlabs_Orange);
      } else if (combined.includes("resinwash")) {
        addToActive(state.animatedObjects.ResinWash);
        addToActive(state.animatedObjects.ResinWashCure);
      } else if (combined.includes("monitor_screen") || combined.includes("bildschirm")) {
        addToActive(state.animatedObjects.Monitor_Screen);
        addToActive(state.animatedObjects.Bildschirm);
      } else if (combined.includes("boot")) {
        addToActive(state.animatedObjects.BootdevButton);
      } else if (combined.includes("leet")) {
        addToActive(state.animatedObjects.LeetCodeButton);
      } else if (combined.includes("git")) {
        addToActive(state.animatedObjects.GitHubFront);
      } else if (combined.includes("_hover")) {
        state.activeHoverObjects.add(obj);
      } else {
        // Social links and shields without _Hover in raycaster name
        Object.keys(SOCIAL_LINKS).forEach(key => {
          const lowerKey = key.toLowerCase();
          const matches = combined.includes(lowerKey) ||
            (key === "LeetCodeButton" && combined.includes("leet")) ||
            (key === "BootdevButton" && combined.includes("boot")) ||
            (key === "GitHubFront" && combined.includes("git"));

          if (matches && state.animatedObjects[key]) {
            addToActive(state.animatedObjects[key]);
          }
        });

        // Shields
        ["Shield_MyWork", "Shield_About", "Shield_Contact"].forEach(shieldKey => {
          const lowerShieldKey = shieldKey.toLowerCase();
          if (combined.includes(lowerShieldKey) && state.animatedObjects[shieldKey]) {
            state.activeHoverObjects.add(state.animatedObjects[shieldKey]);
          }
        });
      }
    });
  }

  // Update Cursor
  if (!state.isModalOpen) {
    const hasHover = state.currentIntersects.some((intersect) => {
      const name = intersect.object.name.toLowerCase();
      const pName = intersect.object.parent?.name?.toLowerCase() || "";
      const combined = `${name} ${pName}`;

      const isSocial = Object.keys(SOCIAL_LINKS).some(key => {
        const lowerKey = key.toLowerCase();
        return combined.includes(lowerKey) ||
          (key === "LeetCodeButton" && combined.includes("leet")) ||
          (key === "BootdevButton" && combined.includes("boot")) ||
          (key === "GitHubFront" && combined.includes("git"));
      });
      const isShield = combined.includes("shield_");
      const isResin = combined.includes("resin");
      return combined.includes("_hover") || isSocial || isShield || isResin;
    });
    document.body.style.cursor = hasHover ? "pointer" : "default";
  }
};

const tick = () => {
  controls.update();

  updateBanner();
  updateRaycaster();
  updateAnimations();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

init();
