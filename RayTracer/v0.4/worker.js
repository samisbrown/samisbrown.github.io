import * as math from './math.js';

let canvas_width, canvas_height, pixel_size, background_color, scene_objects;
const plane_dist = 500;

self.onmessage = function(event) {
	// If we received settings, do not reply
	if (event.data.hasOwnProperty("canvas_width")) {
		({canvas_width, canvas_height, pixel_size, background_color, scene_objects} = event.data);
		// Repackage/Restructure stuff (because when messages posted, objects lose prototypes and just
		// become arbitrary objects
		background_color = new math.Color(background_color);
		Object.keys(scene_objects).forEach((key) => {
			switch (scene_objects[key].type) {
				case "Sphere":
					scene_objects[key] = new math.Sphere(
						new math.Vector(scene_objects[key].center),
						scene_objects[key].radius,
						new math.Color(scene_objects[key].color)
					);
					break;
			};
		});
		return;
	}
	const {x, y, size} = event.data;
	//console.log(`Worker Received ${x}, ${y}, ${size}`);
	const ray = new math.Ray(
		new math.Vector(0, 0, 0), 
		(new math.Vector(x+pixel_size/2-canvas_width/2, y+pixel_size/2-canvas_height/2, -plane_dist, 0)).normalize()
	);
	//console.log(`MEOWWOWOWOWOWOWOWOOWOW (${ray.p0.x},${ray.p0.y},${ray.p0.z}) -> (${ray.dir.x},${ray.dir.y},${ray.dir.z})`);
	// Placeholder for ray-tracing logic
	/*const color = {
		r: 255*x/canvas_width,
		g: 255*y/canvas_height,
		b: (255*x*y)/(canvas_width*canvas_height)
	};*/
	const color = trace_ray(ray);

	// Send the computed color back to the main thread
	//console.log(`send ${JSON.stringify({x, y, color})}`);
	self.postMessage({ pixel_x: x, pixel_y: y, pixel_color: color });
};

function trace_ray(ray) {
	let closest_point = Infinity;
	let hit_obj = null;
	Object.keys(scene_objects).forEach((key) => {
		let obj_hit_point = Math.min(...scene_objects[key].intersect(ray));
		if (obj_hit_point < closest_point) {
			closest_point = obj_hit_point;
			hit_obj = scene_objects[key];
		}
	});
	return hit_obj == null ? background_color : hit_obj.color;
}