import * as math from './math.js';

let canvas_width, canvas_height, pixel_size, background_color, scene_objects;
const plane_dist = 500;

self.onmessage = function(event) {
	// If we received settings, do not reply
	if (event.data.hasOwnProperty("canvas_width")) {
		({canvas_width, canvas_height, pixel_size, background_color, scene_objects} = event.data);
		if (scene_objects.type == "Sphere") {
			scene_objects = new math.Sphere(new math.Vector(scene_objects.center), scene_objects.radius);
		}
		return;
	}
	const {x, y, size} = event.data;
	console.log(`Worker Received ${x}, ${y}, ${size}`);
	const ray = new math.Ray(
		new math.Vector(0, 0, 0), 
		(new math.Vector(x-canvas_width/2, y-canvas_height/2, -plane_dist, 0)).normalize()
	);
	console.log(`MEOWWOWOWOWOWOWOWOOWOW (${ray.p0.x},${ray.p0.y},${ray.p0.z}) -> (${ray.dir.x},${ray.dir.y},${ray.dir.z})`);
	// Placeholder for ray-tracing logic
	/*const color = {
		r: 255*x/canvas_width,
		g: 255*y/canvas_height,
		b: (255*x*y)/(canvas_width*canvas_height)
	};*/
	let color;
	const points = scene_objects.intersect(ray);
	if (points.length == 0) {
		color = {r: 255, g: 0, b: 0};
	} else {
		color = {r: 0, g: 255, b: 255};
	}

	// Send the computed color back to the main thread
	//console.log(`send ${JSON.stringify({x, y, color})}`);
	self.postMessage({ pixel_x: x, pixel_y: y, pixel_color: color });
};
