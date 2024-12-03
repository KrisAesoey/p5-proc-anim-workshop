import P5 from "p5";
import { AngledChain } from "./AngledChain";

export class Snake {
  spine: AngledChain;
  jointSizes: number[];

  constructor(anchor: P5.Vector, jointSizes: number[], linkSize: number) {
    this.spine = new AngledChain(anchor, jointSizes.length, linkSize);
    this.jointSizes = jointSizes;
  }

  resolve(targetPos: P5.Vector) {
    this.spine.resolve(targetPos);
  }

  getPosX(p5: P5, i: number, angleOffset: number, lengthOffset: number = 0) {
    // TODO: implement a method that returns the x position of the i-th joint
  }

  getPosY(p5: P5, i: number, angleOffset: number, lengthOffset: number = 0) {
    // TODO: implement a method that returns the y position of the i-th joint
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
