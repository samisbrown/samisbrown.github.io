import { ui } from "./ui.js";
import { render } from "./canvas.js";
import { init_events } from "./input.js";

export const c = document.getElementById("sim-canvas");
export const ctx = c.getContext("2d");

// Set the drawing resolution of canvas to be the whole window
c.width = window.innerWidth;
c.height = window.innerHeight;

ui.init();

init_events();

window.requestAnimationFrame(render);