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

      // Social Links
      Object.entries(SOCIAL_LINKS).forEach(([key, url]) => {
        const lowerKey = key.toLowerCase();
        // Match if the object name includes the key OR its known alternatives
        const matchesKey = objName.includes(lowerKey);
        const matchesAlt = (key === "LeetCodeButton" && (objName.includes("makerworld") || objName.includes("leetcode"))) ||
          (key === "BootdevButton" && (objName.includes("insta") || objName.includes("bootdev")));

        if (matchesKey || matchesAlt) {
          console.log(`Opening social link for ${key}: ${url}`);
          window.open(url, "_blank", "noopener,noreferrer");
        }
      });

      // Modals
      if (objName.includes("shield_mywork")) {
        showModal(modals.work);
      } else if (objName.includes("shield_about")) {
        showModal(modals.about);
      } else if (objName.includes("shield_contact")) {
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

      // Handle special groups
      if (name.includes("h2c")) {
        if (state.animatedObjects.H2C) state.activeHoverObjects.add(state.animatedObjects.H2C);
        if (state.animatedObjects.H2C_Green) state.activeHoverObjects.add(state.animatedObjects.H2C_Green);
      } else if (name.includes("resinformlabs")) {
        if (state.animatedObjects.ResinFormlabs) state.activeHoverObjects.add(state.animatedObjects.ResinFormlabs);
        if (state.animatedObjects.ResinFormlabs_Orange) state.activeHoverObjects.add(state.animatedObjects.ResinFormlabs_Orange);
      } else if (name.includes("_hover")) {
        state.activeHoverObjects.add(obj);
      } else {
        // Social links and shields without _Hover in raycaster name
        Object.keys(SOCIAL_LINKS).forEach(key => {
          const lowerKey = key.toLowerCase();
          const matchesKey = name.includes(lowerKey);
          const matchesAlt = (key === "LeetCodeButton" && (name.includes("makerworld") || name.includes("leetcode"))) ||
            (key === "BootdevButton" && (name.includes("insta") || name.includes("bootdev")));

          if ((matchesKey || matchesAlt) && state.animatedObjects[key]) {
            state.activeHoverObjects.add(state.animatedObjects[key]);
          }
        });

        // Shields
        ["Shield_MyWork", "Shield_About", "Shield_Contact"].forEach(shieldKey => {
          const lowerShieldKey = shieldKey.toLowerCase();
          if (name.includes(lowerShieldKey) && state.animatedObjects[shieldKey]) {
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
      const isSocial = Object.keys(SOCIAL_LINKS).some(key => {
        const lowerKey = key.toLowerCase();
        return name.includes(lowerKey) ||
          (key === "LeetCodeButton" && (name.includes("makerworld") || name.includes("leetcode"))) ||
          (key === "BootdevButton" && (name.includes("insta") || name.includes("bootdev")));
      });
      const isShield = name.includes("shield_");
      return name.includes("_hover") || isSocial || isShield;
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
