import { plankRotation, leftWeightEl, rightWeightEl, nextWeightEl,tiltWeightEl,dropArea, historyListEl, pauseButton, restartButton} from "./dom.js";
import { computeWeights, computeTorques, computeAngle } from "./physics.js";
import { getRandomWeight, getSizeForWeight } from "./utils.js";
import { dropObject, dropObjectFromArea, FALL_DURATION, SETTLE_DELAY } from "./drop.js";

const STORAGE_KEY = "seesawState";
const PIVOT = 200;

let objects = [];
let nextWeight = getRandomWeight();
let isPaused = false;
let currentAngle = 0;

function getSide(x) {
  return x < PIVOT ? "left" : "right";
}

function addHistoryEntry(weight, x) {
  const side = getSide(x);
  const li = document.createElement("li");
  li.textContent = `${weight} kg object dropped on the ${side} side`;
  historyListEl.insertBefore(li, historyListEl.firstChild);
}

function renderHistory() {
  historyListEl.innerHTML = "";
  objects.forEach(obj => {
    addHistoryEntry(obj.weight, obj.x);
  });
}

function updatePhysics() {
  const { leftWeight, rightWeight } = computeWeights(objects, PIVOT);
  const { leftTorque, rightTorque } = computeTorques(objects, PIVOT);

  leftWeightEl.textContent = leftWeight;
  rightWeightEl.textContent = rightWeight;

  const angle = computeAngle(leftTorque, rightTorque);
  currentAngle = angle;

  tiltWeightEl.textContent = angle.toFixed(2);

  if (!isPaused) {
    plankRotation.style.transform = `rotate(${angle}deg)`;
  }
}

function saveState() {
  const state = {
    objects,
    nextWeight
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    nextWeightEl.textContent = nextWeight;
    return;
  }

  const state = JSON.parse(saved);

  objects = state.objects || [];
  nextWeight = state.nextWeight || getRandomWeight();

  nextWeightEl.textContent = nextWeight;

  
  objects.forEach(obj => {
    const circle = dropObject(obj.x, obj.weight, { animate: false });
    circle.style.top = `${obj.y}px`;
  });

  renderHistory();
  updatePhysics();
}

let previewCircle = null;

dropArea.addEventListener("mousemove", (event) => {
  const areaBox = dropArea.getBoundingClientRect();
  const x = event.clientX - areaBox.left;
  const clickY = event.clientY - areaBox.top;
  const weight = nextWeight;
  const size = getSizeForWeight(weight);

  if (previewCircle) {
    previewCircle.remove();
  }

  const oldLine = dropArea.querySelector(".preview-line");
  if (oldLine) oldLine.remove();
  const oldText = dropArea.querySelector(".distance-text");
  if (oldText) oldText.remove();


  previewCircle = document.createElement("div");
  previewCircle.className = "object";
  previewCircle.style.position = "absolute";
  previewCircle.style.width = `${size}px`;
  previewCircle.style.height = `${size}px`;
  previewCircle.style.borderRadius = "50%";
  previewCircle.style.left = `${x - size / 2}px`;
  previewCircle.style.top = `${clickY}px`;
  previewCircle.style.opacity = "0.5";
  previewCircle.style.pointerEvents = "none";
  previewCircle.textContent = `${weight} kg`;
  previewCircle.style.display = "flex";
  previewCircle.style.alignItems = "center";
  previewCircle.style.justifyContent = "center";
  previewCircle.style.fontSize = "10px";

  dropArea.appendChild(previewCircle);

  const plankCenter = PIVOT;
  const distanceToCenter = Math.abs(x - plankCenter);

  const line = document.createElement("div");
  line.className = "preview-line";
  line.style.position = "absolute";
  line.style.height = "2px";
  line.style.background = "#999";
  line.style.top = `${clickY + size / 2}px`;
  line.style.left = `${Math.min(x, plankCenter)}px`;
  line.style.width = `${distanceToCenter}px`;
  line.style.pointerEvents = "none";
  dropArea.appendChild(line);


  const distanceEl = document.createElement("div");
  distanceEl.className = "distance-text";
  distanceEl.style.position = "absolute";
  distanceEl.style.left = `${(x + plankCenter) / 2}px`;
  distanceEl.style.top = `${clickY + size / 2 - 20}px`;
  distanceEl.style.fontSize = "12px";
  distanceEl.style.fontWeight = "bold";
  distanceEl.style.color = "#666";
  distanceEl.style.transform = "translateX(-50%)";
  distanceEl.style.pointerEvents = "none";
  distanceEl.style.whiteSpace = "nowrap";
  distanceEl.textContent = `${distanceToCenter.toFixed(0)}px`;
  dropArea.appendChild(distanceEl);

  console.log(`Distance to plank center: ${distanceToCenter.toFixed(2)}px`);
});

dropArea.addEventListener("mouseleave", () => {
  if (previewCircle) {
    previewCircle.remove();
    previewCircle = null;
  }
  const oldLine = dropArea.querySelector(".preview-line");
  if (oldLine) oldLine.remove();
  const oldText = dropArea.querySelector(".distance-text");
  if (oldText) oldText.remove();
});

dropArea.addEventListener("click", (event) => {
  const areaBox = dropArea.getBoundingClientRect();
  const x = event.clientX - areaBox.left;
  const clickY = event.clientY - areaBox.top;
  const weight = nextWeight;

  dropObjectFromArea(x, weight, clickY, currentAngle, dropArea);

  nextWeight = getRandomWeight();
  nextWeightEl.textContent = nextWeight;

  setTimeout(() => {
    const finalY = -getSizeForWeight(weight);
    objects.push({ weight, x, y: finalY });
    addHistoryEntry(weight, x);
    updatePhysics();
    saveState();
  }, FALL_DURATION + SETTLE_DELAY);
});

function clearObjects() {
  document.querySelectorAll(".object").forEach(el => el.remove());
}

pauseButton.addEventListener("click", () => {
  if (!isPaused) {
    isPaused = true;
    pauseButton.textContent = "Start";
    plankRotation.style.transform = "rotate(0deg)";
  } else {
    isPaused = false;
    pauseButton.textContent = "Pause";
    plankRotation.style.transform = `rotate(${currentAngle}deg)`;
  }
});

restartButton.addEventListener("click", () => {
  objects = [];
  nextWeight = getRandomWeight();
  nextWeightEl.textContent = nextWeight;
  historyListEl.innerHTML = "";
  clearObjects();
  localStorage.removeItem(STORAGE_KEY);
  isPaused = false;
  currentAngle = 0;
  pauseButton.textContent = "Pause";
  plankRotation.style.transform = "rotate(0deg)";
  leftWeightEl.textContent = 0;
  rightWeightEl.textContent = 0;
  tiltWeightEl.textContent = "0.00";
});

loadState();