import p5 from "p5";

// Function to constrain a vector's distance from an anchor point
export function constrainDistance(
  pos: p5.Vector,
  anchor: p5.Vector,
  constraint: number
): p5.Vector {
  const diff = p5.Vector.sub(pos, anchor).setMag(constraint);
  return p5.Vector.add(anchor, diff);
}

// Function to constrain an angle within a certain range from the anchor angle
export function constrainAngle(
  angle: number,
  anchor: number,
  constraint: number
): number {
  if (Math.abs(relativeAngleDiff(angle, anchor)) <= constraint) {
    return simplifyAngle(angle);
  }

  if (relativeAngleDiff(angle, anchor) > constraint) {
    return simplifyAngle(anchor - constraint);
  }

  return simplifyAngle(anchor + constraint);
}

// Calculate the relative angle difference between two angles
export function relativeAngleDiff(angle: number, anchor: number): number {
  // Adjust the angle space so that `PI` aligns with the anchor
  angle = simplifyAngle(angle + Math.PI - anchor);
  anchor = Math.PI;

  return anchor - angle;
}

// Simplify an angle to be in the range [0, TWO_PI)
export function simplifyAngle(angle: number): number {
  while (angle >= TWO_PI) {
    angle -= TWO_PI;
  }

  while (angle < 0) {
    angle += TWO_PI;
  }

  return angle;
}

// Constant for TWO_PI
export const TWO_PI = Math.PI * 2;
