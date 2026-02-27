import { plankRotation, leftWeightEl, rightWeightEl, nextWeightEl, tiltWeightEl } from "./dom.js";
import { computeWeights, computeTorques, computeAngle } from "./physics.js";
import { getRandomWeight, getSizeForWeight } from "./utils.js";
import { dropObject, FALL_DURATION_MS } from "./drop.js";

const dropArea = document.querySelector(".drop-area");
const historyListEl = document.getElementById("historyList");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
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


function saveState() {
  const state = {
    objects,
    nextWeight
  };
  localStorage.setItem("seesawState", JSON.stringify(state));
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


function loadState() {
  const saved = localStorage.getItem("seesawState");

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

dropArea.addEventListener("click", (event) => {
  const areaRect = dropArea.getBoundingClientRect();

  const x = event.clientX - areaRect.left;
  const weight = nextWeight;
  const size = getSizeForWeight(weight);
  const dropAreaHeight = event.clientY - areaRect.top; 
  const startTop = -dropArea.offsetHeight + dropAreaHeight - size;
  dropObject(x, weight, { startTop });
  const finalY = -size;
  nextWeight = getRandomWeight();
  nextWeightEl.textContent = nextWeight;

  setTimeout(() => {
    objects.push({ weight, x, y: finalY });
    addHistoryEntry(weight, x);
    updatePhysics();
    saveState();
  }, FALL_DURATION_MS + 50);
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
  localStorage.removeItem("seesawState");

  isPaused = false;
  currentAngle = 0;
  pauseButton.textContent = "Pause";
  plankRotation.style.transform = "rotate(0deg)";
  leftWeightEl.textContent = 0;
  rightWeightEl.textContent = 0;
  tiltWeightEl.textContent = "0.00";
});

loadState();