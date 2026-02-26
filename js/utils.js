export function getRandomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

// colors looked ugly, will be changed later
const WEIGHT_COLORS = {
  1: "#ffd1dc",   
  2: "#ffdfba",   
  3: "#fff4ba",   
  4: "#b5e8d8",   
  5: "#b8d4e8",   
  6: "#d4c4e8",  
  7: "#ffc9b4",   
  8: "#c5d9b8",   
  9: "#f0c8e0",   
  10: "#c9b8e8",  
};

export function getSizeForWeight(weight) {
  return 18 + weight * 2;
}

export function createFallingCircle(x, weight) {
  const size = getSizeForWeight(weight);
  const circle = document.createElement("div");
  circle.className = "object";

  circle.style.position = "absolute";
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.borderRadius = "50%";
  circle.style.backgroundColor = WEIGHT_COLORS[weight] || "#e0e0e0";
  circle.style.color = "#333";

  circle.style.display = "flex";
  circle.style.alignItems = "center";
  circle.style.justifyContent = "center";

  circle.style.fontSize = "10px";
  circle.style.left = `${x - size / 2}px`;
  circle.style.top = "-150px";
  circle.textContent = `${weight} kg`;

  return circle;
}