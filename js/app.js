import { plank, plankWrapper, plankRotation, leftWeightEl, rightWeightEl, nextWeightEl, tiltWeightEl } from "./dom.js";
import { computeWeights, computeTorques, computeAngle } from "./physics.js";
import { getRandomWeight, getSizeForWeight } from "./utils.js";
import { dropObject, FALL_DURATION_MS } from "./drop.js";

const dropArea = document.querySelector(".drop-area");
const historyListEl = document.getElementById("historyList");
const PIVOT = 200;

let objects = [];
let nextWeight = getRandomWeight();

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

  tiltWeightEl.textContent = angle.toFixed(2);
  plankRotation.style.transform = `rotate(${angle}deg)`;
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
  const rect = plank.getBoundingClientRect();


  const x = event.clientX - rect.left;
  const weight = nextWeight;
  const circle = dropObject(x, weight);
  const finalY = -getSizeForWeight(weight);
  nextWeight = getRandomWeight();
  nextWeightEl.textContent = nextWeight;

  setTimeout(() => {
    objects.push({ weight, x, y: finalY });
    addHistoryEntry(weight, x);
    updatePhysics();
    saveState();
  }, FALL_DURATION_MS + 50);
});

loadState();