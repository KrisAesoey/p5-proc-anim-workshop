import P5 from "p5";

import { AngledChain } from "./AngledChain";
import { Arm } from "./Arm";

export class Lizard {
  spine: AngledChain;
  jointSizes: number[];
  arms: Arm[];
  armsDesiredPos: Array<P5.Vector>;

  constructor(
    anchor: P5.Vector,
    jointSizes: number[],
    linkSize: number,
    angleConstraint: number
  ) {
    this.spine = new AngledChain(
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

      // TODO: use each arm's fabrikResolve method to move the arm towards the desired position
      // by using lerp to calculate the target to move the arm towards
      // and use the getPosX and getPosY methods to calculate the anchor position of the arm
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
