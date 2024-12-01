import P5 from "p5";

class Chain {
  joints: Array<P5.Vector>;
  linkSize: number;

  angles: Array<number>;
  angleConstraint: number;

  constructor(
    origin: P5.Vector,
    jointCount: number,
    linkSize: number,
    angleConstraint: number = 2 * Math.PI
  ) {
    this.joints = [];
    this.linkSize = linkSize;

    this.angles = [];
    this.angleConstraint = angleConstraint;

    this.joints.push(origin.copy());

    for (let i = 1; i < jointCount; i++) {
      this.joints.push(this.joints[i - 1].add(0, this.linkSize));
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

  constrainAngle(angle: number, anchor: number, constraint: number) {
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
    const targetDistance = P5.Vector.sub(target, this.joints[0]);

    if (targetDistance.mag() > 50) {
      this.joints[0] = P5.Vector.add(this.joints[0], targetDistance.setMag(8));
    }

    const targetPos = P5.Vector.add(
      this.joints[0],
      P5.Vector.sub(target.copy(), this.joints[0]).setMag(8)
    );

    this.angles[0] = P5.Vector.sub(targetPos, this.joints[0]).heading();

    for (let i = 1; i < this.joints.length; i++) {
      const curAngle = P5.Vector.sub(
        this.joints[i - 1],
        this.joints[i]
      ).heading();
      this.angles[i] = this.constrainAngle(
        curAngle,
        this.angles[i - 1],
        this.angleConstraint
      );
      this.joints[i] = P5.Vector.sub(
        this.joints[i - 1],
        P5.Vector.fromAngle(this.angles[i]).setMag(this.linkSize)
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

class Arm extends Chain {
  side: "left" | "right";
  hind: boolean;
  constructor(
    origin: P5.Vector,
    jointCount: number,
    linkSize: number,
    angleContraint: number,
    side: "left" | "right" = "right",
    hind: boolean = false
  ) {
    super(origin, jointCount, linkSize, angleContraint);
    this.side = side;
    this.hind = hind;
  }

  draw(p5: P5) {
    p5.noFill();
    const foot = this.joints[0];
    let elbow = this.joints[Math.floor(this.joints.length / 2)];
    const shoulder = this.joints[this.joints.length - 1];

    const para = P5.Vector.sub(foot, shoulder);
    const perp = new P5.Vector(-para.y, para.x).setMag(30);

    if (this.hind && this.side === "right") {
      elbow = P5.Vector.sub(elbow, perp);
    }
    if (this.hind && this.side === "left") {
      elbow = P5.Vector.add(elbow, perp);
    }

    p5.strokeWeight(24);
    p5.stroke(255);

    p5.bezier(
      shoulder.x,
      shoulder.y,
      elbow.x,
      elbow.y,
      elbow.x,
      elbow.y,
      foot.x,
      foot.y
    );

    p5.strokeWeight(18);
    p5.stroke(56, 200, 102);

    p5.bezier(
      shoulder.x,
      shoulder.y,
      elbow.x,
      elbow.y,
      elbow.x,
      elbow.y,
      foot.x,
      foot.y
    );
  }
}

class Lizard {
  spine: Chain;
  jointSizes: number[];
  arms: Arm[];
  armsDesiredPos: Array<P5.Vector>;

  constructor(
    anchor: P5.Vector,
    jointSizes: number[],
    linkSize: number,
    angleConstraint: number
  ) {
    this.spine = new Chain(
      anchor,
      jointSizes.length,
      linkSize,
      angleConstraint
    );
    this.jointSizes = jointSizes;

    this.arms = [];
    this.armsDesiredPos = [];
    for (let i = 0; i < 4; i++) {
      this.arms.push(
        new Arm(
          anchor,
          3,
          i < 2 ? 24 : 18,
          Math.PI * 2,
          i % 2 === 0 ? "right" : "left",
          i >= 2
        )
      );
      this.armsDesiredPos.push(anchor.copy());
    }
  }

  resolve(p5: P5, targetPos: P5.Vector) {
    this.spine.resolve(targetPos);

    for (let i = 0; i < this.arms.length; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const bodyJoint = i < 2 ? 3 : 7;
      const angle = i < 2 ? Math.PI / 4 : Math.PI / 3;
      const desiredPos = new P5.Vector(
        this.getPosX(p5, bodyJoint, angle * side, 40),
        this.getPosY(p5, bodyJoint, angle * side, 40)
      );
      if (P5.Vector.dist(desiredPos, this.armsDesiredPos[i]) > 100) {
        this.armsDesiredPos[i] = desiredPos;
      }

      this.arms[i].resolveFabrik(
        P5.Vector.lerp(this.arms[i].joints[0], this.armsDesiredPos[i], 0.4),
        new P5.Vector(
          this.getPosX(p5, bodyJoint, (Math.PI / 2) * side, -10),
          this.getPosY(p5, bodyJoint, (Math.PI / 2) * side, -10)
        )
      );
    }
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

  draw(p5: P5) {
    // arms
    for (let i = 0; i < this.arms.length; i++) {
      this.arms[i].draw(p5);
    }

    p5.stroke(255);
    p5.strokeWeight(4);
    p5.fill(56, 200, 102);

    p5.beginShape();

    // right side
    for (let i = 0; i < this.spine.joints.length; i++) {
      p5.curveVertex(
        this.getPosX(p5, i, Math.PI / 2),
        this.getPosY(p5, i, Math.PI / 2)
      );
    }

    // left side
    for (let i = this.spine.joints.length - 1; i >= 0; i--) {
      p5.curveVertex(
        this.getPosX(p5, i, -Math.PI / 2),
        this.getPosY(p5, i, -Math.PI / 2)
      );
    }

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

export const fasit5 = (p5: P5) => {
  const [width, height] = [600, 600];
  const centerX = width / 2;
  const centerY = height / 2;
  const linkSize = 24;
  const jointSizes = [52, 58, 40, 60, 68, 71, 65, 50, 28, 15, 11, 9, 7, 7];
  const angleConstraint = Math.PI / 8;

  const anchor = p5.createVector(centerX, centerY);

  let lizard = new Lizard(anchor, jointSizes, linkSize, angleConstraint);

  const anchor2 = p5.createVector(
    lizard.spine.joints[lizard.spine.joints.length - 1].x,
    lizard.spine.joints[lizard.spine.joints.length - 1].y
  );

  let lizard2 = new Lizard(anchor2, jointSizes, linkSize, angleConstraint);

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    p5.background(200);

    const target = p5.createVector(p5.mouseX, p5.mouseY);

    lizard.resolve(p5, target);
    lizard.draw(p5);

    const target2 = p5.createVector(
      lizard.spine.joints[lizard.spine.joints.length - 1].x,
      lizard.spine.joints[lizard.spine.joints.length - 1].y
    );
    lizard2.resolve(p5, target2);
    lizard2.draw(p5);
  };
};
