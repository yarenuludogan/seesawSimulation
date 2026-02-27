export function getRandomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

export function getSizeForWeight(weight) {
  return 18 + weight * 2;
}

export function createFallingCircle(x, weight) {
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
  circle.style.top = "-150px";
  circle.textContent = `${weight} kg`;

  return circle;
}