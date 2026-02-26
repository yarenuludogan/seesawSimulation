import { plank, plankRotation, leftWeightEl, rightWeightEl, nextWeightEl, tiltWeightEl } from "./dom.js";
import { computeWeights, computeTorques, computeAngle } from "./physics.js";
import { getRandomWeight, getSizeForWeight } from "./utils.js";


const dropArea = document.querySelector(".drop-area");

const PIVOT = 200;
let objects = [];
let nextWeight = getRandomWeight();


function updatePhysics() {
  const { leftWeight, rightWeight } = computeWeights(objects, PIVOT);
  const { leftTorque, rightTorque } = computeTorques(objects, PIVOT);

  leftWeightEl.textContent = leftWeight;
  rightWeightEl.textContent = rightWeight;

  const angle = computeAngle(leftTorque, rightTorque);

  tiltWeightEl.textContent = angle.toFixed(2);
  plankRotation.style.transform = `rotate(${angle}deg)`;
}


dropArea.addEventListener("click", (event) => {
  const position = plank.getBoundingClientRect();


  const x = event.clientX - position.left;
  const weight = nextWeight;

  const finalY = -getSizeForWeight(weight);
  nextWeight = getRandomWeight();
  nextWeightEl.textContent = nextWeight;

  
});

