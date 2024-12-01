import P5 from "p5";

export class SimpleChain {
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

  resolve(target: P5.Vector) {
    // TODO: implement a method that resolves the chain to a target position
    // by using a constrainDistance method that keeps the distance between
    // each joint and the previous joint at a fixed length
  }

  resolveFabrik(target: P5.Vector, anchor: P5.Vector) {
    // TODO: implement a method that resolves the chain to a target position
    // by using the FABRIK algorithm
  }

  draw(p5: P5) {
    // TODO: implement a method that draws the chain
  }
}
