import { plank, plankWrapper } from "./dom.js";
import { createFallingCircle, getSizeForWeight } from "./utils.js";

export const FALL_DURATION_MS = 500;

export function dropObject(x, weight, { animate = true, startTop = -150 } = {}) {
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
  const startLeft = x - size / 2;
  const clampedStartTop = Math.min(startTop, finalTop);
  const dropDistance = finalTop - clampedStartTop; 

  circle.style.left = `${startLeft}px`;
  circle.style.top = `${clampedStartTop}px`;
  circle.style.transition = `transform ${FALL_DURATION_MS}ms ease-in`;
  circle.style.transform = "translateY(0px)";

  requestAnimationFrame(() => {
    circle.style.transform = `translateY(${dropDistance}px)`;
  });

  setTimeout(() => {
    plank.appendChild(circle);
    circle.style.top = `${-size}px`;
    circle.style.left = `${x - size / 2}px`;
    circle.style.transition = "";
    circle.style.transform = "";
  }, FALL_DURATION_MS + 50);

  return circle;
}
