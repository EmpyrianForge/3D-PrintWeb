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
    defaults: { duration: 1, ease: "power2.out" },
  });

  t1.to(state.animatedObjects.Shield_MyWork.scale, { x: 1, z: 1, y: 1 })
    .to(state.animatedObjects.Shield_About.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(
      state.animatedObjects.Shield_Contact.scale,
      { x: 1, y: 1, z: 1 },
      "-=0.7",
    )
    .to(state.animatedObjects.H2C.scale, { x: 0.3, y: 0.4, z: 0.4 }, "-=0.7")
    .to(state.animatedObjects.H2C_Green.scale, { x: 1, y: 1, z: 1 }, "-=0.7");

  const t2 = gsap.timeline({
    defaults: { duration: 0.8, ease: "back.out(1.7)" },
  });

  t2.to(state.animatedObjects.GitHubFront.scale, { x: 1, y: 1, z: 1 })
    .to(state.animatedObjects.InstaButton.scale, { x: 1, y: 1, z: 1 }, "-=0.5")
    .to(
      state.animatedObjects.MakerWorldButton.scale,
      { x: 0.3, y: 0.3, z: 0.3 },
      "-=0.5",
    )
    .to(state.animatedObjects.Dixiclock.scale, { x: 1, y: 1, z: 1 }, "-=0.5")
    .to(state.animatedObjects.Gandalf.scale, { x: 1, y: 1, z: 1 }, "-=0.3")
    .to(state.animatedObjects.Name_K.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(state.animatedObjects.Name_E.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(state.animatedObjects.Name_V.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(state.animatedObjects.Name_I.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(state.animatedObjects.Name_N1.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(state.animatedObjects.Name_B.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(state.animatedObjects.Name_A1.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(state.animatedObjects.Name_U.scale, { x: 1, y: 1, z: 1 }, "-=0.3")
    .to(state.animatedObjects.Name_N2.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(state.animatedObjects.Name_A2.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(state.animatedObjects.Name_C.scale, { x: 1, y: 1, z: 1 }, "-=0.7")
    .to(state.animatedObjects.Name_H.scale, { x: 1, y: 1, z: 1 }, "-=0.7");
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
      if (intersectObj === obj) return true;
      if (
        intersectObj.name.includes("H2C") &&
        (obj === state.animatedObjects.H2C ||
          obj === state.animatedObjects.H2C_Green)
      )
        return true;
      if (
        intersectObj.name.includes("ResinFormlabs") &&
        (obj === state.animatedObjects.ResinFormlabs ||
          obj === state.animatedObjects.ResinFormlabs_Orange)
      )
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
