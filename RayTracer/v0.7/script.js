//import * as math from './math.js';

// Get All Document elements
const canvas = document.getElementById('ray-tracer-canvas');
const ctx = canvas.getContext('2d');

const renderButton = document.getElementById('render');
const canvasWidthSlider = document.getElementById('canvas-width');
const canvasWidthBox = document.getElementById('canvas-width-box');
const canvasHeightSlider = document.getElementById('canvas-height');
const canvasHeightBox = document.getElementById('canvas-height-box');
const pixelSizeSlider = document.getElementById('pixel-size');
const pixelSizeBox = document.getElementById('pixel-size-box');
const addObjectButton = document.getElementById('add-object');
const objectDropdown = document.getElementById('object-dropdown');
const deleteObjectButton = document.getElementById('delete-object');
const objectTypeDropdown = document.getElementById('object-type-dropdown');
const sizeInput = document.getElementById('object-size');
const xInput = document.getElementById('object-pos-x');
const yInput = document.getElementById('object-pos-y');
const zInput = document.getElementById('object-pos-z');
const colorInput = document.getElementById('object-color');
const backgroundColorInput = document.getElementById('background-color');
const radiusInput = document.getElementById('object-radius');
const addLightButton = document.getElementById('add-light');
const lightDropdown = document.getElementById('light-dropdown');
const deleteLightButton = document.getElementById('delete-light');
const lightTypeDropdown = document.getElementById('light-type-dropdown');
const lightXInput = document.getElementById('light-pos-x');
const lightYInput = document.getElementById('light-pos-y');
const lightZInput = document.getElementById('light-pos-z');
const lightColorInput = document.getElementById('light-color');
const lightDirXInput = document.getElementById('light-spotlight-dir-x');
const lightDirYInput = document.getElementById('light-spotlight-dir-y');
const lightDirZInput = document.getElementById('light-spotlight-dir-z');
const lightAngleInput = document.getElementById('light-spotlight-angle');
const updateLightButton = document.getElementById('update-light');
const camXInput = document.getElementById('camera-pos-x');
const camYInput = document.getElementById('camera-pos-y');
const camZInput = document.getElementById('camera-pos-z');
const camXDirInput = document.getElementById('camera-dir-x');
const camYDirInput = document.getElementById('camera-dir-y');
const camZDirInput = document.getElementById('camera-dir-z');
const updateObjectButton = document.getElementById('update-object');
const numThreadsSlider = document.getElementById('num-threads');

// Miscellaneous Helper Functions
const counter_to_xy = (num) => {
	return {
	x: (num % Math.ceil(CANVAS_SIZE.w / PIXEL_SIZE)) * PIXEL_SIZE, 
	y: (Math.floor(num / Math.ceil(CANVAS_SIZE.w / PIXEL_SIZE)) * PIXEL_SIZE)
}};
const hexToRGB = (hex) => {
	return {
		'R': parseInt(hex.replace(/^#/, '').substring(0, 2), 16),
		'G': parseInt(hex.replace(/^#/, '').substring(2, 4), 16),
		'B': parseInt(hex.replace(/^#/, '').substring(4, 6), 16)
	};
};
const RGBToHex = (color) => {
  const r = color.R.toString(16).padStart(2, '0');
  const g = color.G.toString(16).padStart(2, '0');
  const b = color.B.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

// Runtime
let rendering = false;
let current_pixel = 0;
let workers_finished = 0;

//let objects = [];
//let selectedObject = null;

// Ray Tracer
let SceneObjects = {
	"testSphere1": {
		"Type": "Sphere",
		"Center": {
			"X": 0,
			"Y": 0,
			"Z": -100
		},
		"Radius": 10,
		"Color": {
			"R": 255,
			"G": 0,
			"B": 0
		}
	},
	"testSphere2":
	{
		"Type": "Sphere",
		"Center": {
			"X": 10,
			"Y": 10,
			"Z": -200
		},
		"Radius": 20,
		"Color": {
			"R": 0,
			"G": 255,
			"B": 0
		}
	}
};

let Lights = {
	"Main Light :)": {
		"Type": "PointLight",
		"Pos": {
			"X": 20,
			"Y": 50,
			"Z": -100
		},
		"Color": {
			"R": 255,
			"G": 255,
			"B": 255
		}
	}
};

// Settings
let CANVAS_SIZE = {w: parseInt(canvasWidthSlider.value), h: parseInt(canvasHeightSlider.value)};
let PIXEL_SIZE = parseInt(pixelSizeSlider.value);
let BACKGROUND_COLOR = hexToRGB(backgroundColorInput.value);

let workerCount = navigator.hardwareConcurrency || 4;
let workers = [];
let workerIndex = 0;

// Init Scene Objects GUI
Object.keys(SceneObjects).forEach((key) => {
	const option = document.createElement('option');
	option.value = key;
	option.textContent = key;
	objectDropdown.appendChild(option);
});

// Init Lights GUI
Object.keys(Lights).forEach((key) => {
	const option = document.createElement('option');
	option.value = key;
	option.textContent = key;
	lightDropdown.appendChild(option);
});

// Init Threads Slider
numThreadsSlider.max = navigator.hardwareConcurrency || 4;
numThreadsSlider.value = navigator.hardwareConcurrency || 4;
document.getElementById('num-threads-value').textContent = navigator.hardwareConcurrency || 4;

// Functions that use WASM Module need to wait
// For Module to be created
// Declare Module-dependent functions
recv_from_worker = null;
createModule().then((Module) => {
	// Receive from a web worker
	recv_from_worker = (event) => {
		//console.log(current_pixel);
		// If sent all pixels, no more sending, but still draw any received
		if (current_pixel == Math.ceil(CANVAS_SIZE.w / PIXEL_SIZE) * Math.ceil(CANVAS_SIZE.h / PIXEL_SIZE)) {
			workers_finished++;
			if (workers_finished == numThreadsSlider.value) {
				renderButton.textContent = "Render";
				renderButton.classList.remove('rendering');
				rendering = false;
				Module._CleanUp(); // Clean up all the rendering memory
			}
		} else {
			//If not sent all pixels, send
			let { x: new_x, y: new_y } = counter_to_xy(current_pixel++);
			//console.log(`Pixel ${current_pixel-1}: Sending to worker ${new_x}, ${new_y}, ${PIXEL_SIZE}`);
			// event.target is the worker that triggered this event 
			// If we are not rendering (rendering gets cancelled) then dont post
			if (rendering) event.target.postMessage({ x: new_x, y: new_y, size: PIXEL_SIZE });
		}
		//Draw received data
		let { pixel_x, pixel_y, pixel_color } = event.data;
		//console.log(pixel_color);
		//console.log(`${current_pixel} Main Received ${pixel_x}, ${pixel_y}, rgb(${pixel_color.r}, ${pixel_color.g}, ${pixel_color.b})`);
		ctx.fillStyle = `rgb(${pixel_color.R}, ${pixel_color.G}, ${pixel_color.B})`;
		ctx.fillRect(pixel_x, pixel_y, PIXEL_SIZE, PIXEL_SIZE);
		/*if (--pixels_done_semaphore == 0) {
			renderButton.textContent = "Render";
			renderButton.classList.toggle('rendering');		
			rendering = false;
		}*/
	};
	// Init workers
	for (let i = 0; i < workerCount; i++) {
		const worker = new Worker("worker.js");//, {type:'module'});
		worker.onmessage = recv_from_worker;
		workers.push(worker);
	}
});


// Begin the render (when Render button is pushed)
function renderScene() {
	console.log(`render started, total pixels: ${Math.floor(CANVAS_SIZE.w / PIXEL_SIZE) * Math.floor(CANVAS_SIZE.h / PIXEL_SIZE)}`);
	current_pixel = 0;
	workers_finished = 0;

	for (let i = 0; i < workerCount; i++) {
		// Send Settings to each worker
		workers[i].postMessage({
			CanvasWidth: CANVAS_SIZE.w,
			CanvasHeight: CANVAS_SIZE.h,
			PixelSize: PIXEL_SIZE,
			BackgroundColor: BACKGROUND_COLOR,
			CameraPos: {
				"X": parseFloat(camXInput.value),
				"Y": parseFloat(camYInput.value),
				"Z": parseFloat(camZInput.value)
			},
			CameraDir: {
				"X": parseFloat(camXDirInput.value),
				"Y": parseFloat(camYDirInput.value),
				"Z": parseFloat(camZDirInput.value)
			},
			SceneObjects: SceneObjects,
			Lights: Lights
		});

		// Send Pixel X and Y coords to ray trace
		if (i == 0) console.log(current_pixel);
		let { x, y } = counter_to_xy(current_pixel++);
		if (x >= CANVAS_SIZE.w || y >= CANVAS_SIZE.h) {
			console.log("less pixels than workers, breaking");
			break;
		}
		if (i == 0) console.log({ x, y });
		//console.log(`Pixel ${current_pixel-1}: Sending to worker ${x}, ${y}, ${PIXEL_SIZE}`);
		workers[i].postMessage({ x, y, size: PIXEL_SIZE });
	}
}

function lockSettings() {
	// Close all headers
	document.querySelectorAll('.collapsible-header').forEach(header => {
		const content = header.nextElementSibling;
		const symbol = header.querySelector('.collapsible-symbol');
		
		content.classList.remove('show');
		symbol.textContent = "+";
	});
}



/////////////// Event Listeners
document.querySelectorAll('.collapsible-header').forEach(header => {
	header.addEventListener('click', () => {
		const content = header.nextElementSibling;
		const symbol = header.querySelector('.collapsible-symbol');
		
		// Only allow looking at header content if not rendering
		if (!rendering) {
			content.classList.toggle('show');
			if (content.classList.contains('show')) {
				symbol.textContent = "-";
			} else {
				symbol.textContent = "+";	
			}
		}
	});
});

renderButton.addEventListener('click', () => {
	if (!renderButton.classList.contains('rendering')) {
		renderButton.textContent = "Cancel Render";
		renderButton.classList.add('rendering');
		rendering = true;
		lockSettings();
		requestAnimationFrame(() => renderScene());
	} else {
		renderButton.textContent = "Render";
		renderButton.classList.remove('rendering');
		rendering = false;
		for (let i = 0; i < workerCount; i++) {
			// Send Settings to each worker
			workers[i].postMessage("CancelRender");
		}
	}
});

canvasWidthSlider.addEventListener('input', () => {
	const width = canvasWidthSlider.value;
	canvas.width = width;
	CANVAS_SIZE.w = width;
	
	document.getElementById('canvas-width-box').value = width;
});

canvasWidthBox.addEventListener('input', () => {
	const width = parseInt(canvasWidthBox.value);
	canvas.width = width;
	CANVAS_SIZE.w = width;
	
	canvasWidthSlider.value = width;
});

canvasHeightSlider.addEventListener('input', () => {
	const height = canvasHeightSlider.value;
	canvas.height = height;
	CANVAS_SIZE.h = height;
	
	canvasHeightBox.value = height;
});

canvasHeightBox.addEventListener('input', () => {
	const height = canvasHeightBox.value;
	canvas.height = height;
	CANVAS_SIZE.h = height;
	
	canvasHeightSlider.value = height;
});

pixelSizeSlider.addEventListener('input', () => {
	const size = pixelSizeSlider.value;
	PIXEL_SIZE = size;
	pixelSizeBox.value = size;
});

pixelSizeBox.addEventListener('input', () => {
	const size = parseInt(pixelSizeBox.value);
	PIXEL_SIZE = size;
	pixelSizeSlider.value = size;
});

addObjectButton.addEventListener('click', () => {
	const newObjName = prompt("Enter a name for the object: ");
	let newObj;
	switch (objectTypeDropdown.value) {
		case "Sphere":
			let ObjColor = hexToRGB(colorInput.value);
			newObj = {
				"Type": "Sphere",
				"Center": {
					"X": parseFloat(xInput.value),
					"Y": parseFloat(yInput.value),
					"Z": parseFloat(zInput.value)
				},
				"Radius": parseFloat(radiusInput.value),
				"Color": {
					"R": ObjColor.R,
					"G": ObjColor.G,
					"B": ObjColor.B
				}
			}
			break;
		case "Cube":
			console.log("YOU CANT MAKE A CUBE LUV");
			break;
	}
	
	SceneObjects[newObjName] = newObj;
	const option = document.createElement('option');
	option.value = newObjName;
	option.textContent = newObjName;
	objectDropdown.appendChild(option);
	objectDropdown.value = newObjName;
});

objectDropdown.addEventListener('change', () => {
	const objectName = objectDropdown.value;
	const selectedObject = SceneObjects[objectName];
	
	if (selectedObject.radius) {
		radiusInput.value = selectedObject.Radius;
	}
	//sizeInput.value = selectedObject.size;
	objectTypeDropdown.value = selectedObject.Type;
	xInput.value = selectedObject.Center.X;
	yInput.value = selectedObject.Center.Y;
	zInput.value = selectedObject.Center.Z;
	colorInput.value = RGBToHex(selectedObject.Color);
	//radiusInput.value = selectedObject.radius;
});
// Init values (executes above event one time on startup)
objectDropdown.dispatchEvent(new Event("change"));

deleteObjectButton.addEventListener('click', () => {
	const objectName = objectDropdown.value;
	const selectedObject = SceneObjects[objectName];
	
	if (selectedObject) {
		delete SceneObjects[objectName];
		
		const options = Array.from(objectDropdown.options);
		const optionToDelete = options.find(opt => opt.value === objectName);
		if (optionToDelete) objectDropdown.removeChild(optionToDelete);
	}
});

objectTypeDropdown.addEventListener('change', () => {
	const objectType = objectTypeDropdown.value;
	
	// Get all controls
	const cubeControls = document.querySelector('.cube-controls');
	const sphereControls = document.querySelector('.sphere-controls');

	// Hide all controls first
	cubeControls.style.display = 'none';
	sphereControls.style.display = 'none';

	// Show controls based on the selected object type
	if (objectType === 'Cube') {
	cubeControls.style.display = 'block';
	} else if (objectType === 'Sphere') {
	sphereControls.style.display = 'block';
	}
});
// Init values (executes above event one time on startup)
objectTypeDropdown.dispatchEvent(new Event("change"));

updateObjectButton.addEventListener('click', () => {
	const objectName = objectDropdown.value;
	const selectedObject = SceneObjects[objectName];
	
	if (selectedObject) {
		//selectedObject.size = parseFloat(sizeInput.value);
		selectedObject.Center.X = parseFloat(xInput.value);
		selectedObject.Center.Y = parseFloat(yInput.value);
		selectedObject.Center.Z = parseFloat(zInput.value);
		selectedObject.Radius = parseFloat(radiusInput.value);
		selectedObject.Color = hexToRGB(colorInput.value);
	}
});

addLightButton.addEventListener('click', () => {
	const newLightName = prompt("Enter a name for the light: ");
	let LightColor = hexToRGB(lightColorInput.value);
	let newLight;
	switch (lightTypeDropdown.value) {
		case "PointLight":
			newLight = {
				"Type": "PointLight",
				"Pos": {
					"X": parseFloat(lightXInput.value),
					"Y": parseFloat(lightYInput.value),
					"Z": parseFloat(lightZInput.value)
				},
				"Color": {
					"R": LightColor.R,
					"G": LightColor.G,
					"B": LightColor.B
				}
			}
			break;
		case "SpotlightLight":
			console.log("Spotlight not implemented :(");
			newLight = {
				"Type": "SpotlightLight",
				"Pos": {
					"X": parseFloat(lightXInput.value),
					"Y": parseFloat(lightYInput.value),
					"Z": parseFloat(lightZInput.value)
				},
				"Color": {
					"R": LightColor.R,
					"G": LightColor.G,
					"B": LightColor.B
				},
				"Dir": {
					"X": parseFloat(lightDirXInput.value),
					"Y": parseFloat(lightDirYInput.value),
					"Z": parseFloat(lightDirZInput.value)
				},
				"Angle": parseFloat(lightAngleInput.value)
			}
			break;
	}

	Lights[newLightName] = newLight;
	const option = document.createElement('option');
	option.value = newLightName;
	option.textContent = newLightName;
	lightDropdown.appendChild(option);
	lightDropdown.value = newLightName;
});

lightDropdown.addEventListener('change', () => {
	const lightName = lightDropdown.value;
	const selectedLight = Lights[lightName];

	/** I think below will need to change to accommodate
	  * for spotlight bits (dir and angle)
	if (selectedLight.radius) {
		radiusInput.value = selectedObject.Radius;
	}*/
	//sizeInput.value = selectedObject.size;
	lightTypeDropdown.value = selectedLight.Type;
	// Update lightTypeDropdown with the new Light type
	lightTypeDropdown.dispatchEvent(new Event("change"));
	lightXInput.value = selectedLight.Pos.X;
	lightYInput.value = selectedLight.Pos.Y;
	lightZInput.value = selectedLight.Pos.Z;
	lightColorInput.value = RGBToHex(selectedLight.Color);
	//radiusInput.value = selectedObject.radius;
});
// Init values (executes above event one time on startup)
lightDropdown.dispatchEvent(new Event("change"));

deleteLightButton.addEventListener('click', () => {
	const lightName = lightDropdown.value;
	const selectedLight = Lights[lightName];

	if (selectedLight) {
		delete Lights[lightName];

		const options = Array.from(lightDropdown.options);
		const optionToDelete = options.find(opt => opt.value === lightName);
		if (optionToDelete) lightDropdown.removeChild(optionToDelete);
	}
});

lightTypeDropdown.addEventListener('change', () => {
	const lightType = lightTypeDropdown.value;

	// Get all controls
	const spotlightControls = document.querySelector('.light-spotlight-controls');
	
	// Hide all controls first
	spotlightControls.style.display = 'none';

	// Show controls based on the selected object type
	if (lightType === 'SpotlightLight') {
		console.log("reshowing spotlight ctrls");
		spotlightControls.style.display = 'block';
	}
});
// Init values (executes above event one time on startup)
lightTypeDropdown.dispatchEvent(new Event("change"));

updateLightButton.addEventListener('click', () => {
	const lightName = lightDropdown.value;
	const selectedLight = Lights[lightName];

	if (selectedLight) {
		//selectedObject.size = parseFloat(sizeInput.value);
		selectedLight.Type = lightTypeDropdown.value;
		selectedLight.Pos.X = parseFloat(lightXInput.value);
		selectedLight.Pos.Y = parseFloat(lightYInput.value);
		selectedLight.Pos.Z = parseFloat(lightZInput.value);
		selectedLight.Color = hexToRGB(lightColorInput.value);
		if (lightTypeDropdown.value == "SpotlightLight") {
			// If we updated a spotlight
			selectedLight.Dir = {
				"X": parseFloat(lightDirXInput.value),
				"Y": parseFloat(lightDirYInput.value),
				"Z": parseFloat(lightDirZInput.value)
			};
			selectedLight.Angle = parseFloat(lightAngleInput.value);
		}
	}
});

numThreadsSlider.addEventListener('input', () => {
	// If Rendering, cancel
	if (rendering) {
		numThreadsSlider.value = document.getElementById('num-threads-value').textContent;
		return;
	}
	
	// Update Thread gui
	document.getElementById('num-threads-value').textContent = numThreadsSlider.value;
	
	//Kill current workers
	for (let i = 0; i < workerCount; i++) {
		workers[i].terminate();
	}
	
	//Update workers
	workerCount = numThreadsSlider.value;
	workers = [];
	workerIndex = 0;

	// Reinit workers
	for (let i = 0; i < workerCount; i++) {
		const worker = new Worker("worker.js", {type:'module'});
		workers.push(worker);
	}
	
	// Reassign onmessage event function
	workers.forEach((worker) => {
		worker.onmessage = recv_from_worker;
	});
});

backgroundColorInput.addEventListener('change', () => {
	BACKGROUND_COLOR = hexToRGB(backgroundColorInput.value);
});