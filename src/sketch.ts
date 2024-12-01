import P5 from "p5";

export const sketch = (p5: P5) => {
  const [width, height] = [600, 600];

  let dot: P5.Vector;
  let mousePosition: P5.Vector;

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    p5.background(200);

    // TODO: Create a vector for the mouse position

    // TODO: Update the position of dot relative to the mouse position

    // Draw the circle around the mouse position
    p5.noFill();
    p5.stroke(0);
    p5.ellipse(mousePosition.x, mousePosition.y, 100, 100);

    // Draw a dot
    p5.fill(0);
    p5.noStroke();
    p5.ellipse(dot.x, dot.y, 20); // Draw the dot
  };
};
