import { plank, plankWrapper } from "./dom.js";
import { createFallingCircle, getSizeForWeight } from "./utils.js";

export const FALL_DURATION_MS = 500;

export function dropObject(x, weight, { animate = true } = {}) {
  const circle = createFallingCircle(x, weight);
  const size = getSizeForWeight(weight);

  if (!animate) {
    plank.appendChild(circle);
    circle.style.top = `${-size}px`;
    circle.style.left = `${x - size / 2}px`;
    return circle;
  }
  plankWrapper.appendChild(circle);

  const finalTop = -size;

  requestAnimationFrame(() => {
    circle.style.top = `${finalTop}px`;
  });

  setTimeout(() => {
    plank.appendChild(circle);
    circle.style.top = `${-size}px`;
    circle.style.left = `${x - size / 2}px`;
  }, FALL_DURATION_MS + 50);

  return circle;
}
