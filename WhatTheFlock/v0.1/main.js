import { Bird } from "./bird.js";
import { Vector } from "./util.js";

const canvas = document.getElementById('ray-tracer-canvas');
const ctx = canvas.getContext('2d');

const NUM_BIRDS = 100;

export const birds = Array.from({length: NUM_BIRDS}, (_, i) => new Bird(Vector.FromRandom([50, 950], [50, 950]), Math.random() * 2 * Math.PI));
console.log(birds);
birds.forEach((bird) => {bird.Draw(ctx)});

function tick()
{
	birds.forEach((bird) => {bird.SetAdjustment()});
	birds.forEach((bird) => {bird.Tick()});
}

function draw()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	birds.forEach((bird) => {bird.Draw(ctx)});	
}

function loop()
{
	tick();
	draw();
	
	requestAnimationFrame(loop);
}

loop();