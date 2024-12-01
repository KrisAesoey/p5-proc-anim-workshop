import P5 from "p5";

class Chain {
  joints: Array<P5.Vector>;
  linkSize: number;

  constructor(origin: P5.Vector, jointCount: number, linkSize: number) {
    this.joints = [];
    this.linkSize = linkSize;

    this.joints.push(origin.copy());

    for (let i = 1; i < jointCount; i++) {
      const previousJoint = this.joints[i - 1];
      this.joints.push(previousJoint.copy().add(0, this.linkSize));
    }
  }

  constrainDistance(
    pos: P5.Vector,
    anchor: P5.Vector,
    distance: number
  ): P5.Vector {
    const diff = P5.Vector.sub(pos, anchor).setMag(distance);
    return P5.Vector.add(anchor, diff);
  }

  resolve(target: P5.Vector) {
    this.joints[0] = target.copy();

    for (let i = 1; i < this.joints.length; i++) {
      this.joints[i] = this.constrainDistance(
        this.joints[i],
        this.joints[i - 1],
        this.linkSize
      );
    }
  }

  resolveFabrik(target: P5.Vector, anchor: P5.Vector) {
    // forward pass
    this.joints[0] = target.copy();
    for (let i = 1; i < this.joints.length; i++) {
      this.joints[i] = this.constrainDistance(
        this.joints[i],
        this.joints[i - 1],
        this.linkSize
      );
    }

    // backward pass
    this.joints[this.joints.length - 1] = anchor.copy();
    for (let i = this.joints.length - 1; i > 0; i--) {
      this.joints[i - 1] = this.constrainDistance(
        this.joints[i - 1],
        this.joints[i],
        this.linkSize
      );
    }
  }

  draw(p5: P5) {
    const jointSize = 20;

    for (let i = 1; i < this.joints.length; i++) {
      p5.strokeWeight(4);
      p5.line(
        this.joints[i - 1].x,
        this.joints[i - 1].y,
        this.joints[i].x,
        this.joints[i].y
      );
    }

    for (let i = 0; i < this.joints.length; i++) {
      p5.fill(0);
      p5.ellipse(this.joints[i].x, this.joints[i].y, jointSize);
    }
  }
}

export const fasit3 = (p5: P5) => {
  const [width, height] = [600, 600];
  const centerX = width / 2;
  const centerY = height / 2;
  const jointCount = 5;
  const linkSize = 70;

  const anchor = p5.createVector(centerX, centerY);

  let chain = new Chain(anchor, jointCount, linkSize);

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    p5.background(200);

    const target = p5.createVector(p5.mouseX, p5.mouseY);

    chain.resolveFabrik(target, anchor);
    chain.draw(p5);
  };
};
