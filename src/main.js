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

      // Social Links
      Object.entries(SOCIAL_LINKS).forEach(([key, url]) => {
        if (object.name.includes(key)) {
          const newWindow = window.open();
          newWindow.opener = null;
          newWindow.location = url;
          newWindow.target = "_blank";
          newWindow.rel = "noopener noreferrer";
        }
      });

      // Modals
      if (object.name.includes("Shield_MyWork")) {
        showModal(modals.work);
      } else if (object.name.includes("Shield_About")) {
        showModal(modals.about);
      } else if (object.name.includes("Shield_Contact")) {
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
      if (obj.name.includes("_Hover")) {
        if (obj.name.includes("H2C")) {
          if (state.animatedObjects.H2C)
            state.activeHoverObjects.add(state.animatedObjects.H2C);
          if (state.animatedObjects.H2C_Green)
            state.activeHoverObjects.add(state.animatedObjects.H2C_Green);
        } else if (obj.name.includes("ResinFormlabs")) {
          if (state.animatedObjects.ResinFormlabs)
            state.activeHoverObjects.add(state.animatedObjects.ResinFormlabs);
          if (state.animatedObjects.ResinFormlabs_Orange)
            state.activeHoverObjects.add(
              state.animatedObjects.ResinFormlabs_Orange,
            );
        } else {
          state.activeHoverObjects.add(obj);
        }
      }
    });
  }

  // Update Cursor
  if (!state.isModalOpen) {
    const hasHover = state.currentIntersects.some((intersect) =>
      intersect.object.name.includes("_Hover"),
    );
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
