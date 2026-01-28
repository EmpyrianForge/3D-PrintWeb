import gsap from "gsap";
import { state } from "./state.js";
import { controls } from "./scene.js";

export const modals = {
  work: document.querySelector(".modal.work"),
  about: document.querySelector(".modal.about"),
  contact: document.querySelector(".modal.contact"),
};

export const disableBackgroundInteractions = () => {
  state.isModalOpen = true;
  if (controls) controls.enabled = false;
  state.raycasterNeedsUpdate = false;
  state.currentIntersects = [];
  document.body.style.cursor = "default";
};

export const enableBackgroundInteractions = () => {
  state.isModalOpen = false;
  if (controls) controls.enabled = true;
  state.raycasterNeedsUpdate = true;
};

export const showModal = (modal) => {
  modal.style.display = "block";
  disableBackgroundInteractions();

  gsap.set(modal, { opacity: 0 });
  gsap.to(modal, {
    opacity: 1,
    duration: 0.5,
  });
};

export const hideModal = (modal) => {
  gsap.to(modal, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      modal.style.display = "none";
      enableBackgroundInteractions();
    },
  });
};

export const initUI = () => {
  document.querySelectorAll(".modal-exit-button").forEach((button) => {
    button.addEventListener(
      "touchend",
      (e) => {
        state.touchHappend = true;
        e.preventDefault();
        const modal = e.target.closest(".modal");
        hideModal(modal);
      },
      { passive: false },
    );

    button.addEventListener("click", (e) => {
      if (state.touchHappend) return;
      e.preventDefault();
      const modal = e.target.closest(".modal");
      hideModal(modal);
    });
  });
};
