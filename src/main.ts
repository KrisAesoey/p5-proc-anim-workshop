import P5 from "p5";

import { sketch } from "./sketch";

export type P5Closure = (p: P5) => void;

const root = document.getElementById("app")!;

let userSketch: P5Closure | undefined = sketch;

let p5Instance: P5 | undefined = new P5(userSketch, root);
