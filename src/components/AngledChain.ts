import P5 from "p5";
import { constrainDistance } from "./utils";

export class AngledChain {
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
      // TODO: figure out the current angle of the joint
      // and constrain it to the previous joint's angle

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
      this.joints[i] = constrainDistance(
        this.joints[i],
        this.joints[i - 1],
        this.linkSize
      );
    }

    // backward pass
    this.joints[this.joints.length - 1] = anchor.copy();
    for (let i = this.joints.length - 1; i > 0; i--) {
      this.joints[i - 1] = constrainDistance(
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
