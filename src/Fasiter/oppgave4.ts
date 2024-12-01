import P5 from "p5";

class Chain {
  joints: Array<P5.Vector>;
  angles: Array<number>;
  linkSize: number;

  constructor(origin: P5.Vector, jointCount: number, linkSize: number) {
    this.joints = [];
    this.angles = [];
    this.linkSize = linkSize;

    this.joints.push(origin.copy());

    for (let i = 1; i < jointCount; i++) {
      const previousJoint = this.joints[i - 1];
      this.joints.push(previousJoint.copy().add(0, this.linkSize));
      this.angles.push(0);
    }
  }

  simplifyAngle(angle: number): number {
    while (angle >= Math.PI * 2) {
      angle -= Math.PI * 2;
    }
    while (angle < 0) {
      angle += Math.PI * 2;
    }
    return angle;
  }

  relativeAngleDiff(angle: number, anchor: number): number {
    angle = this.simplifyAngle(angle + Math.PI - anchor);
    anchor = Math.PI;
    return anchor - angle;
  }

  constrainAngle(
    angle: number,
    anchor: number,
    constraint: number = Math.PI * 2
  ) {
    const relDiff = this.relativeAngleDiff(angle, anchor);

    if (Math.abs(relDiff) <= constraint) {
      return this.simplifyAngle(angle);
    }
    if (relDiff > constraint) {
      return this.simplifyAngle(anchor - constraint);
    }

    return this.simplifyAngle(anchor + constraint);
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
    const targetDistance = P5.Vector.sub(target.copy(), this.joints[0]);

    if (targetDistance.mag() > 50) {
      this.joints[0] = P5.Vector.add(this.joints[0], targetDistance.setMag(8));
    }

    const targetPos = P5.Vector.add(
      this.joints[0],
      P5.Vector.sub(target.copy(), this.joints[0]).setMag(8)
    );

    this.angles[0] = P5.Vector.sub(targetPos, this.joints[0]).heading();

    for (let i = 1; i < this.joints.length; i++) {
      this.joints[i] = this.constrainDistance(
        this.joints[i],
        this.joints[i - 1],
        this.linkSize
      );
      const curAngle = P5.Vector.sub(
        this.joints[i - 1],
        this.joints[i]
      ).heading();
      this.angles[i] = this.constrainAngle(
        curAngle,
        this.angles[i - 1],
        Math.PI / 2
      );
      this.joints[i] = P5.Vector.sub(
        this.joints[i - 1],
        P5.Vector.fromAngle(this.angles[i]).setMag(this.linkSize)
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

class Snake {
  spine: Chain;
  jointSizes: number[];

  constructor(anchor: P5.Vector, jointSizes: number[], linkSize: number) {
    this.spine = new Chain(anchor, jointSizes.length, linkSize);
    this.jointSizes = jointSizes;
  }

  resolve(targetPos: P5.Vector) {
    this.spine.resolve(targetPos);
  }

  getPosX(p5: P5, i: number, angleOffset: number, lengthOffset: number = 0) {
    return (
      this.spine.joints[i].x +
      p5.cos(this.spine.angles[i] + angleOffset) *
        (this.jointSizes[i] / 2 + lengthOffset)
    );
  }
  getPosY(p5: P5, i: number, angleOffset: number, lengthOffset: number = 0) {
    return (
      this.spine.joints[i].y +
      p5.sin(this.spine.angles[i] + angleOffset) *
        (this.jointSizes[i] / 2 + lengthOffset)
    );
  }

  drawLeftSide(p5: P5) {
    for (let i = this.spine.joints.length - 1; i >= 0; i--) {
      p5.curveVertex(
        this.getPosX(p5, i, -Math.PI / 2),
        this.getPosY(p5, i, -Math.PI / 2)
      );
    }
  }
  drawRightSide(p5: P5) {
    for (let i = 0; i < this.spine.joints.length; i++) {
      p5.curveVertex(
        this.getPosX(p5, i, Math.PI / 2),
        this.getPosY(p5, i, Math.PI / 2)
      );
    }
  }

  draw(p5: P5) {
    p5.stroke(255);
    p5.strokeWeight(4);
    p5.fill(172, 57, 102);

    p5.beginShape();

    this.drawRightSide(p5);

    this.drawLeftSide(p5);

    // head
    p5.curveVertex(
      this.getPosX(p5, 0, -Math.PI / 6),
      this.getPosY(p5, 0, -Math.PI / 6)
    );
    p5.curveVertex(this.getPosX(p5, 0, 0), this.getPosY(p5, 0, 0));
    p5.curveVertex(
      this.getPosX(p5, 0, Math.PI / 6),
      this.getPosY(p5, 0, Math.PI / 6)
    );

    // some overlap to be more smooth ;)
    p5.curveVertex(
      this.getPosX(p5, 0, Math.PI / 2),
      this.getPosY(p5, 0, Math.PI / 2)
    );
    p5.curveVertex(
      this.getPosX(p5, 1, Math.PI / 2),
      this.getPosY(p5, 1, Math.PI / 2)
    );

    p5.endShape(p5.CLOSE);

    // eyes
    p5.fill(255);
    p5.ellipse(
      this.getPosX(p5, 0, Math.PI / 2, -12),
      this.getPosY(p5, 0, Math.PI / 2, -12),
      8,
      8
    );
    p5.ellipse(
      this.getPosX(p5, 0, -Math.PI / 2, -12),
      this.getPosY(p5, 0, -Math.PI / 2, -12),
      8,
      8
    );
  }
}

export const fasit4 = (p5: P5) => {
  const [width, height] = [600, 600];
  const centerX = width / 2;
  const centerY = height / 2;
  const linkSize = 50;
  const jointSizes = [50, 45, 40, 35, 30, 25, 20, 15];

  const anchor = p5.createVector(centerX, centerY);

  let snake = new Snake(anchor, jointSizes, linkSize);

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    p5.background(200);

    const target = p5.createVector(p5.mouseX, p5.mouseY);

    snake.resolve(target);
    snake.draw(p5);
  };
};
