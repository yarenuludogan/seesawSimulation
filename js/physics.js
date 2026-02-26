export function computeWeights(objects, pivot) {
  const leftWeight = objects.filter(o => o.x < pivot).reduce((sum, o) => sum + o.weight, 0);
  const rightWeight = objects.filter(o => o.x >= pivot).reduce((sum, o) => sum + o.weight, 0);
  return { leftWeight, rightWeight };
}

export function computeTorques(objects, pivot) {
  const leftTorque = objects.filter(o => o.x < pivot).reduce((sum, o) => sum + o.weight * (pivot - o.x), 0);
  const rightTorque = objects.filter(o => o.x >= pivot).reduce((sum, o) => sum + o.weight * (o.x - pivot), 0);
  return { leftTorque, rightTorque };
}

export function computeAngle(leftTorque, rightTorque) {
  return Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
}
