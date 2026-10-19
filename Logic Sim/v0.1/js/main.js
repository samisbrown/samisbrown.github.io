export const c = document.getElementById("sim-canvas");
export const ctx = c.getContext("2d");

// Set the drawing resolution of canvas to be the whole window
c.width = window.innerWidth;
c.height = window.innerHeight;

import { render } from "./canvas.js";

window.requestAnimationFrame(render);