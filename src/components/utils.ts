import P5 from "p5";

export function constrainDistance(
  pos: P5.Vector,
  anchor: P5.Vector,
  distance: number
): P5.Vector {
  // TODO: set the position of the dot to the anchor to the desired distance
  return pos;
}

export function constrainMaxDistance(
  pos: P5.Vector,
  anchor: P5.Vector,
  maxDistance: number
): P5.Vector {
  // TODO: set the position of the dot to the anchor if the distance
  // between the dot and the anchor is greater than the given distance
  return pos;
}

export function constrainAngle(
  angle: number,
  anchor: number,
  constraint: number
) {
  const relDiff = relativeAngleDiff(angle, anchor);

  if (Math.abs(relDiff) <= constraint) {
    return simplifyAngle(angle);
  }
  if (relDiff > constraint) {
    return simplifyAngle(anchor - constraint);
  }

  return simplifyAngle(anchor + constraint);
}

function relativeAngleDiff(angle: number, anchor: number): number {
  angle = simplifyAngle(angle + Math.PI - anchor);
  anchor = Math.PI;
  return anchor - angle;
}

function simplifyAngle(angle: number): number {
  while (angle >= Math.PI * 2) {
    angle -= Math.PI * 2;
  }
  while (angle < 0) {
    angle += Math.PI * 2;
  }
  return angle;
}
