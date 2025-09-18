//import * as math from './math.js';
importScripts("ray_tracer.js");

let canvas_width, canvas_height, pixel_size, background_color, camera_pos, camera_dir, scene_objects;
let camera_right, camera_up;
let viewport_width, viewport_height, viewport_center;
const plane_dist = 500;

createModule().then((Module) => {
	self.onmessage = function (event) {
		// If we received settings, do not reply
		/*if (event.data.hasOwnProperty("canvas_width")) {
			({canvas_width, canvas_height, pixel_size, background_color, camera_pos, camera_dir, scene_objects} = event.data);
			// Repackage/Restructure stuff (because when messages posted, objects lose prototypes and just
			// become arbitrary objects
			background_color = new math.Color(background_color);
			camera_pos = new math.Vector(camera_pos);
			camera_dir = new math.Vector(camera_dir);
			// Calculate Camera Basis
			let up = new math.Vector(0, 1, 0);
			camera_right = camera_dir.cross(up);
			camera_up = camera_right.cross(camera_dir);
			// Calculate Viewport 
			let fov = 60 * Math.PI/180;
			let near_dist = 5.0;
			let aspect_ratio = canvas_width / canvas_height;
			viewport_height = 2 * near_dist * Math.tan(fov/2);
			viewport_width = viewport_height * aspect_ratio;
			viewport_center = camera_pos.add(camera_dir.mult(near_dist));
			// Repackage Scene Objects
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
		}*/

		// If we don't receive settings, we received a pixel to draw
		const { x, y, size } = event.data;
		//console.log(`Worker Received ${x}, ${y}, ${size}`);
		/*let u = (x + pixel_size) / (2 * canvas_width);
		let v = (y + pixel_size) / (2 * canvas_height);
		let ray_dest = viewport_center.add(camera_right.mult((u - 0.5) * viewport_width).add(camera_up.mult((v - 0.5) * viewport_height))); 
	
		const ray = new math.Ray(
			camera_pos, 
			(ray_dest.sub(camera_pos)).normalize()
		);*/
		const ColorPtr = Module._malloc(3);
		Module._TraceRay(x, y, ColorPtr);
		const OutColor = {
			'R': Module.HEAPU8[ColorPtr],
			'G': Module.HEAPU8[ColorPtr + 1],
			'B': Module.HEAPU8[ColorPtr + 2]
		}
		Module._free(ColorPtr);

		// Send the computed color back to the main thread
		//console.log(`send ${JSON.stringify({x, y, color})}`);
		self.postMessage({ pixel_x: x, pixel_y: y, pixel_color: OutColor });
	};
});

/*function trace_ray(ray) {
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
}*/