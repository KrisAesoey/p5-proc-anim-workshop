import P5 from "p5";
import { AngledChain } from "./AngledChain";

export class Arm extends AngledChain {
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
