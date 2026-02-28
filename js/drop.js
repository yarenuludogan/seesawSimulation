import { plank } from "./dom.js";
import { createFallingCircle, getSizeForWeight } from "./utils.js";

export const FALL_DURATION = 500;
export const SETTLE_DELAY = 50;
export const PIVOT = 200;

export function dropObjectFromArea(x, weight, clickY, currentAngle, dropArea) {
  const size = getSizeForWeight(weight);
  
 
  const circle = document.createElement("div");
  circle.className = "object";
  circle.dataset.weight = String(weight);
  circle.style.position = "absolute";
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.borderRadius = "50%";
  circle.style.display = "flex";
  circle.style.alignItems = "center";
  circle.style.justifyContent = "center";
  circle.style.fontSize = "10px";
  circle.style.left = `${x - size / 2}px`;
  circle.style.top = `${clickY}px`;
  circle.textContent = `${weight} kg`;
  
  dropArea.appendChild(circle);

 
  const baseDistance = dropArea.offsetHeight - clickY - size;
  const angleRad = (currentAngle * Math.PI) / 180;
  const distanceFromPivot = x - PIVOT;
  const angleAdjustment = Math.tan(angleRad) * distanceFromPivot;
  const dropDistance = baseDistance + angleAdjustment;

 
  circle.style.transition = `transform ${FALL_DURATION}ms ease-in`;
  circle.style.transform = "translateY(0px)";

  requestAnimationFrame(() => {
    circle.style.transform = `translateY(${dropDistance}px)`;
  });

  setTimeout(() => {
    dropArea.removeChild(circle);
    plank.appendChild(circle);
    circle.style.top = `${-size}px`;
    circle.style.left = `${x - size / 2}px`;
    circle.style.transition = "";
    circle.style.transform = "";
  }, FALL_DURATION + SETTLE_DELAY);

  return circle;
}

export function dropObject(x, weight, { animate = true, startTop = -150 } = {}) {
  const circle = createFallingCircle(x, weight);
  const size = getSizeForWeight(weight);

  if (!animate) {
    plank.appendChild(circle);
    circle.style.top = `${-size}px`;
    circle.style.left = `${x - size / 2}px`;
    return circle;
  }

  plank.appendChild(circle);

  const finalTop = -size;
  const startLeft = x - size / 2;
  const clampedStartTop = Math.min(startTop, finalTop);
  const dropDistance = finalTop - clampedStartTop; 

  circle.style.left = `${startLeft}px`;
  circle.style.top = `${clampedStartTop}px`;
  circle.style.transition = `transform ${FALL_DURATION}ms ease-in`;
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
  }, FALL_DURATION + SETTLE_DELAY);

  return circle;
}
