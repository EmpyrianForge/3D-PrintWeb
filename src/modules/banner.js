import * as THREE from "three";
import { ICON_NAMES } from "./config.js";
import { state } from "./state.js";

export const bannerCanvas = document.createElement("canvas");
bannerCanvas.width = 1024;
bannerCanvas.height = 576;
export const bannerCtx = bannerCanvas.getContext("2d");

export const bannerTexture = new THREE.CanvasTexture(bannerCanvas);
bannerTexture.minFilter = THREE.LinearFilter;

export const bannerMaterial = new THREE.MeshBasicMaterial({
  map: bannerTexture,
  transparent: true,
  alphaTest: 0.01,
  toneMapped: false,
});

const ICON_SIZE = 256;
const GAP = 40;
const TOTAL_WIDTH_PER_ICON = ICON_SIZE + GAP;

export const initBanner = () => {
  ICON_NAMES.forEach((lang) => {
    const img = new Image(240, 240);
    const index = state.iconImages.length;
    state.iconLoadStates.push(false);

    img.onload = () => {
      state.iconLoadStates[index] = true;
    };
    img.onerror = () => {
      state.iconLoadStates[index] = true; // Always loaded to prevent broken error
    };
    img.src = `./icons/${lang}.png`;
    state.iconImages.push(img);
  });
};

export const updateBanner = () => {
  state.bannerTime += 0.018;
  bannerCtx.clearRect(0, 0, bannerCanvas.width, bannerCanvas.height);

  const scrollSpeed = 1.5;
  state.marqueeOffset += scrollSpeed;

  const totalIcons = state.iconImages.length;
  const loopWidth = TOTAL_WIDTH_PER_ICON * totalIcons;
  state.marqueeOffset = state.marqueeOffset % loopWidth;

  for (let i = 0; i < totalIcons; i++) {
    const imgIndex = i;
    let x = i * TOTAL_WIDTH_PER_ICON - state.marqueeOffset;

    if (x < -ICON_SIZE) {
      x += loopWidth;
    }

    const y = bannerCanvas.height / 2 - ICON_SIZE / 2;

    if (
      state.iconLoadStates[imgIndex] &&
      state.iconImages[imgIndex].complete &&
      state.iconImages[imgIndex].naturalWidth > 0
    ) {
      bannerCtx.shadowColor = "#00ffff";
      bannerCtx.shadowBlur = 20;

      // Fade effect
      const fadeWidth = 150;
      let alpha = 1;

      if (x < fadeWidth) {
        alpha = x / fadeWidth;
      } else if (x > bannerCanvas.width - fadeWidth - ICON_SIZE) {
        alpha = (bannerCanvas.width - x - ICON_SIZE) / fadeWidth;
      }

      alpha = Math.max(0, Math.min(1, alpha));
      bannerCtx.globalAlpha = alpha;

      bannerCtx.save();
      bannerCtx.translate(x + ICON_SIZE / 2, y + ICON_SIZE / 2);
      bannerCtx.rotate(Math.PI);
      bannerCtx.drawImage(
        state.iconImages[imgIndex],
        -ICON_SIZE / 2,
        -ICON_SIZE / 2,
        ICON_SIZE,
        ICON_SIZE,
      );
      bannerCtx.restore();

      bannerCtx.globalAlpha = 1;
    }
  }

  bannerCtx.shadowBlur = 0;
  bannerTexture.needsUpdate = true;
};
