import P5 from "p5";

import { fasit1 } from "./Fasiter/oppgave1";
import { fasit2 } from "./Fasiter/oppgave2";
import { fasit3 } from "./Fasiter/oppgave3";
import { fasit4 } from "./Fasiter/oppgave4";
import { fasit5 } from "./Fasiter/oppgave5";
import { sketch } from "./sketch";

export type P5Closure = (p: P5) => void;

const root = document.getElementById("app")!;

let fasitSketch1: P5Closure | undefined = fasit1;
let fasitSketch2: P5Closure | undefined = fasit2;
let fasitSketch3: P5Closure | undefined = fasit3;
let fasitSketch4: P5Closure | undefined = fasit4;
let fasitSketch5: P5Closure | undefined = fasit5;
let userSketch: P5Closure | undefined = sketch;

let p5Instance: P5 | undefined = new P5(fasitSketch3, root);
