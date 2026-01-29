import gsap from "gsap";
import * as THREE from "three";
import { state } from "./state.js";

export const playReveal = () => {
  const loadingScreen = document.querySelector(".loading-screen");
  const tl = gsap.timeline({});
  tl.to(".loading-screen", {
    scale: 0.5,
    duration: 1.2,
    delay: 0.25,
    ease: "back.in(1.7)",
  }).to(
    ".loading-screen",
    {
      y: "200vh",
      transform: " perspective(1000px) rotateX(45deg) rotateY(-35deg)",
      duration: 1.5,
      ease: "back.in(1.7)",
      onComplete: () => {
        playIntroAnimation();
        loadingScreen.remove();
      },
    },
    "-=0.1",
  );
};

export const playIntroAnimation = () => {
  if (!state.animatedObjects.Shield_MyWork) {
    setTimeout(() => playIntroAnimation(), 100);
    return;
  }

  const t1 = gsap.timeline({
    defaults: { duration: 0.8, ease: "power2.out" },
  });

  const animateToOriginal = (obj, delay = "-=0.5", customTimeline = t1) => {
    if (Array.isArray(obj)) {
      obj.forEach((o) => animateToOriginal(o, delay, customTimeline));
      return;
    }
    if (obj && obj.userData.originalScale) {
      customTimeline.to(
        obj.scale,
        {
          x: obj.userData.originalScale.x,
          y: obj.userData.originalScale.y,
          z: obj.userData.originalScale.z,
        },
        delay,
      );
    } else if (obj) {
      // Fallback for objects without saved original scale
      customTimeline.to(obj.scale, { x: 1, y: 1, z: 1 }, delay);
    }
  };

  animateToOriginal(state.animatedObjects.Shield_MyWork, 0);
  animateToOriginal(state.animatedObjects.Shield_About);
  animateToOriginal(state.animatedObjects.Shield_Contact);
  animateToOriginal(state.animatedObjects.H2C);
  animateToOriginal(state.animatedObjects.H2C_Green);

  const t2 = gsap.timeline({
    defaults: { duration: 0.6, ease: "back.out(1.7)" },
  });

  animateToOriginal(state.animatedObjects.GitHubFront, 0, t2);
  animateToOriginal(state.animatedObjects.LeetCodeButton, "-=0.4", t2);
  animateToOriginal(state.animatedObjects.BootdevButton, "-=0.4", t2);
  animateToOriginal(state.animatedObjects.Dixiclock, "-=0.5", t2);
  animateToOriginal(state.animatedObjects.Gandalf, "-=0.3", t2);
  animateToOriginal(state.animatedObjects.ResinWash, "-=0.3", t2);
  animateToOriginal(state.animatedObjects.ResinWashCure, "-=0.3", t2);
  animateToOriginal(state.animatedObjects.GamingPC, "-=0.3", t2);
  animateToOriginal(state.animatedObjects.Ship, "-=0.3", t2);
  animateToOriginal(state.animatedObjects.Spachtel, "-=0.3", t2);
  animateToOriginal(state.animatedObjects.Bildschirm, "-=0.3", t2);
  animateToOriginal(state.animatedObjects.Monitor_Screen, "-=0.3", t2);

  // Name animation
  const names = [
    "Name_K", "Name_E", "Name_V", "Name_I", "Name_N1",
    "Name_B", "Name_A1", "Name_U", "Name_N2", "Name_A2",
    "Name_C", "Name_H",
  ];
  names.forEach((name) => {
    animateToOriginal(state.animatedObjects[name], "-=0.7", t2);
  });
};

export const updateAnimations = () => {
  // Fans
  state.zAxisFans.forEach((fan) => {
    fan.rotation.z -= 0.1;
  });
  state.yAxisFans.forEach((fan) => {
    fan.rotation.y -= 0.1;
  });

  // Hover animations
  state.activeHoverObjects.forEach((obj) => {
    const isHovered = state.currentIntersects.some((intersect) => {
      const intersectObj = intersect.object;
      const intersectName = intersectObj.name.toLowerCase();
      const intersectParentName = intersectObj.parent?.name?.toLowerCase() || "";
      const intersectCombined = `${intersectName} ${intersectParentName}`;

      const checkMatch = (targetKey) => {
        const target = state.animatedObjects[targetKey];
        if (!target) return false;
        if (Array.isArray(target)) return target.includes(obj);
        return obj === target;
      };

      if (intersectObj === obj) return true;
      if (
        intersectCombined.includes("h2c") &&
        (checkMatch("H2C") || checkMatch("H2C_Green"))
      )
        return true;
      if (
        intersectCombined.includes("resinformlabs") &&
        (checkMatch("ResinFormlabs") || checkMatch("ResinFormlabs_Orange"))
      )
        return true;
      if (
        intersectCombined.includes("resinwash") &&
        (checkMatch("ResinWash") || checkMatch("ResinWashCure"))
      )
        return true;
      if (
        (intersectCombined.includes("monitor_screen") || 
         intersectCombined.includes("bildschirm")) &&
        (checkMatch("Monitor_Screen") || checkMatch("Bildschirm"))
      )
        return true;
      if (intersectCombined.includes("boot") && checkMatch("BootdevButton"))
        return true;
      if (intersectCombined.includes("leet") && checkMatch("LeetCodeButton"))
        return true;
      if (intersectCombined.includes("git") && checkMatch("GitHubFront"))
        return true;
      return false;
    });

    if (obj.userData.initialScale) {
      const targetScale =
        isHovered && obj.userData.hoverScale
          ? obj.userData.hoverScale
          : obj.userData.initialScale;

      obj.scale.lerp(targetScale, 0.12);
      obj.position.lerp(obj.userData.initialPosition, 0.12);
      obj.rotation.x = THREE.MathUtils.lerp(
        obj.rotation.x,
        obj.userData.initialRotation.x,
        0.12,
      );
      obj.rotation.y = THREE.MathUtils.lerp(
        obj.rotation.y,
        obj.userData.initialRotation.y,
        0.12,
      );
      obj.rotation.z = THREE.MathUtils.lerp(
        obj.rotation.z,
        obj.userData.initialRotation.z,
        0.12,
      );

      if (
        !isHovered &&
        obj.scale.distanceTo(obj.userData.initialScale) < 0.01
      ) {
        state.activeHoverObjects.delete(obj);
      }
    }
  });
};
