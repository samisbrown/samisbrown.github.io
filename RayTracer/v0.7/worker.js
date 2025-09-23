//import * as math from './math.js';
importScripts("ray_tracer.js");

let canvas_width, canvas_height, pixel_size, background_color, camera_pos, camera_dir, scene_objects;
let camera_right, camera_up;
let viewport_width, viewport_height, viewport_center;
const plane_dist = 500;

createModule().then((Module) => {
	self.onmessage = function (event) {
		// If we received settings, do not reply
		if (event.data.hasOwnProperty("CanvasWidth")) {
			console.log("Web Worker received settings, setting up...");
			({CanvasWidth, CanvasHeight, PixelSize, BackgroundColor, CameraPos, CameraDir, SceneObjects} = event.data);
			
			// Init the WASM Module
			Module._SetCanvasSize(CanvasWidth, CanvasHeight);
			Module._SetPixelSize(PixelSize);
			Module._SetBackgroundColor(BackgroundColor.R, BackgroundColor.G, BackgroundColor.B);
			Module._SetCameraPos(CameraPos.X, CameraPos.Y, CameraPos.Z);
			Module._SetCameraDir(CameraDir.X, CameraDir.Y, CameraDir.Z);
			// Add All Scene Objects
			Object.keys(SceneObjects).forEach((Key) => {
				let CurrObj = SceneObjects[Key];
				switch (CurrObj.Type) {
					case "Sphere":
						console.log(CurrObj);
						console.log(Module);
						Module._AddSphere(
							CurrObj.Center.X,
							CurrObj.Center.Y,
							CurrObj.Center.Z,
							CurrObj.Radius,
							CurrObj.Color.R,
							CurrObj.Color.G,
							CurrObj.Color.B
						);
						break;
				}
			});
			// Finish Init
			Module._SetUp();
		}

		// If we received "CancelRender", Clean up
		if (event.data == "CancelRender")
		{
			Module._CleanUp();
		}

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