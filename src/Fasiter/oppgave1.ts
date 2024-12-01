import P5 from "p5";

function constrainDistance(
  pos: P5.Vector,
  anchor: P5.Vector,
  distance: number
): P5.Vector {
  const diff = pos.copy().sub(anchor); // Calculate the difference
  const diffLength = diff.mag(); // Get the magnitude of the difference

  if (diffLength > distance) {
    return diff.setMag(distance).add(anchor); // Constrain position
  }
  return pos; // If within distance, return the original position
}

export const fasit1 = (p5: P5) => {
  const [width, height] = [600, 600];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 50;

  // initialize the dot
  let dotPos = p5.createVector(centerX, centerY);
  const dotSize = 20;

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    p5.background(200);

    // Get the mouse position as anchor
    const anchor = p5.createVector(p5.mouseX, p5.mouseY);

    // Apply constrainDistance to get the constrained position
    dotPos = constrainDistance(dotPos, anchor, radius);

    // Draw the circle around the mouse position
    p5.noFill();
    p5.stroke(0);
    p5.ellipse(anchor.x, anchor.y, radius * 2, radius * 2);

    // Draw a dot at the constrained position
    p5.fill(0);
    p5.noStroke();
    p5.ellipse(dotPos.x, dotPos.y, dotSize);
  };
};
