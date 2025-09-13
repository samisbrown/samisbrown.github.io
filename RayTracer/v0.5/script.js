import * as math from './math.js';

/*console.log("math testing");

let v1 = new math.Vector(0, 1, 0);
console.log(v1 instanceof math.Vector);
let v2 = new math.Vector(2, 2, 1);
console.log(v1.add(v2));
console.log(v1.mult(v2));
let v3 = v2.mult(10);
console.log(v3);
console.log(v3.len());
console.log(v3.normalize());
let v4 = v2.mult(10);
v4.w = 0;
console.log(v4.normalize());

let rotMat = math.Matrix.rotate(Math.PI, v1);
console.log(rotMat);
console.log(math.Matrix.perspective_projection(Math.PI/2, 16/9, 20, 100));

console.log("testing complete");*/

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
	return new math.Color(
		parseInt(hex.replace(/^#/, '').substring(0, 2), 16),
		parseInt(hex.replace(/^#/, '').substring(2, 4), 16),
		parseInt(hex.replace(/^#/, '').substring(4, 6), 16)
	);
};
const RGBToHex = (color) => {
  const r = color.r.toString(16).padStart(2, '0');
  const g = color.g.toString(16).padStart(2, '0');
  const b = color.b.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};
const recv_from_worker = (event) => {
	//console.log(current_pixel);
	// If sent all pixels, no more sending, but still draw any received
	if (current_pixel == Math.ceil(CANVAS_SIZE.w / PIXEL_SIZE) * Math.ceil(CANVAS_SIZE.h / PIXEL_SIZE)) {
		renderButton.textContent = "Render";
		renderButton.classList.remove('rendering');		
		rendering = false;
	} else {
		//If not sent all pixels, send
		let {x: new_x, y: new_y} = counter_to_xy(current_pixel++);
		//console.log(`Pixel ${current_pixel-1}: Sending to worker ${new_x}, ${new_y}, ${PIXEL_SIZE}`);
		// event.target is the worker that triggered this event 
		// If we are not rendering (rendering gets cancelled) then dont post
		if (rendering) event.target.postMessage({x: new_x, y: new_y, size: PIXEL_SIZE});
	}
	//Draw received data
	let {pixel_x, pixel_y, pixel_color} = event.data;
	pixel_color = new math.Color(pixel_color);
	//console.log(pixel_color);
	//console.log(`${current_pixel} Main Received ${pixel_x}, ${pixel_y}, rgb(${pixel_color.r}, ${pixel_color.g}, ${pixel_color.b})`);
	ctx.fillStyle = `rgb(${pixel_color.r}, ${pixel_color.g}, ${pixel_color.b})`;
	ctx.fillRect(pixel_x, pixel_y, PIXEL_SIZE, PIXEL_SIZE);
	/*if (--pixels_done_semaphore == 0) {
		renderButton.textContent = "Render";
		renderButton.classList.toggle('rendering');		
		rendering = false;
	}*/
};

// Runtime
let rendering = false;
let current_pixel = 0;

//let objects = [];
//let selectedObject = null;

// Ray Tracer
let SceneObjects = {
	"testSphere1": new math.Sphere(new math.Vector(0, 0, -100), 10, new math.Color(255, 0, 0)),
	"testSphere2": new math.Sphere(new math.Vector(10, 10, -200), 20, new math.Color(0, 255, 0))
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

// Init workers
for (let i = 0; i < workerCount; i++) {
	const worker = new Worker("worker.js", {type:'module'});
	worker.onmessage = recv_from_worker;
	workers.push(worker);
}

// Init Threads Slider
numThreadsSlider.max = navigator.hardwareConcurrency || 4;
numThreadsSlider.value = navigator.hardwareConcurrency || 4;
document.getElementById('num-threads-value').textContent = navigator.hardwareConcurrency || 4;


function renderScene() {
	console.log(`render started, total pixels: ${Math.floor(CANVAS_SIZE.w / PIXEL_SIZE) * Math.floor(CANVAS_SIZE.h / PIXEL_SIZE)}`);
	current_pixel = 0;
	/*for (let y = 0; y < canvas.height; y += PIXEL_SIZE) {
		for (let x = 0; x < canvas.width; x += PIXEL_SIZE) {
			workers[workerIndex++].postMessage({x, y, PIXEL_SIZE});
			workerIndex %= workerCount;
			pixels_done_semaphore++;
		}
	}*/
	for (let i = 0; i < workerCount; i++) {
		// Send Settings
		workers[i].postMessage({
			canvas_width: CANVAS_SIZE.w,
			canvas_height: CANVAS_SIZE.h,
			pixel_size: PIXEL_SIZE,
			background_color: BACKGROUND_COLOR,
			camera_pos: new math.Vector(
				parseFloat(camXInput.value),
				parseFloat(camYInput.value),
				parseFloat(camZInput.value)
			),
			camera_dir: new math.Vector(
				parseFloat(camXDirInput.value),
				parseFloat(camYDirInput.value),
				parseFloat(camZDirInput.value),
				0
			),
			scene_objects: SceneObjects
		});
		
		if (i == 0) console.log(current_pixel);
		let {x, y} = counter_to_xy(current_pixel++);
		if (i == 0) console.log({x, y});
		//console.log(`Pixel ${current_pixel-1}: Sending to worker ${x}, ${y}, ${PIXEL_SIZE}`);
		workers[i].postMessage({x, y, size: PIXEL_SIZE});
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
	}
});

canvasWidthSlider.addEventListener('input', () => {
	const width = canvasWidthSlider.value;
	canvas.width = width;
	CANVAS_SIZE.w = width;
	//modify pixelSize accordingly
	/*const temp = Math.min(canvas.height, canvas.width);
	if (pixelSizeSlider.value > temp) {
		pixelSizeSlider.value = temp;
		PIXEL_SIZE = temp;
		document.getElementById('pixel-size-box').value = temp;
	}
	pixelSizeSlider.max = temp;*/
	
	document.getElementById('canvas-width-box').value = width;
});

canvasWidthBox.addEventListener('input', () => {
	const width = parseInt(canvasWidthBox.value);
	canvas.width = width;
	CANVAS_SIZE.w = width;
	// Modify pixelSize accordingly
	/*const temp = Math.min(canvas.height, canvas.width);
	if (pixelSizeSlider.value > temp) {
		pixelSizeSlider.value = temp;
		PIXEL_SIZE = temp;
		pixelSizeBox.value = temp;
	}
	pixelSizeSlider.max = temp;*/
	
	canvasWidthSlider.value = width;
});

canvasHeightSlider.addEventListener('input', () => {
	const height = canvasHeightSlider.value;
	canvas.height = height;
	CANVAS_SIZE.h = height;
	//modify pixelSize accordingly
	/*const temp = Math.min(canvas.height, canvas.width);
	if (pixelSizeSlider.value > temp) {
		pixelSizeSlider.value = temp;
		PIXEL_SIZE = temp;
		pixelSizeBox.value = temp;
	}
	pixelSizeSlider.max = temp;*/
	
	canvasHeightBox.value = height;
});

canvasHeightBox.addEventListener('input', () => {
	const height = canvasHeightBox.value;
	canvas.height = height;
	CANVAS_SIZE.h = height;
	// Modify pixelSize accordingly
	/*const temp = Math.min(canvas.height, canvas.width);
	if (pixelSizeSlider.value > temp) {
		pixelSizeSlider.value = temp;
		PIXEL_SIZE = temp;
		pixelSizeBox.value = temp;
	}
	pixelSizeSlider.max = temp;*/
	
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
			newObj = new math.Sphere(
				new math.Vector(
					parseFloat(xInput.value),
					parseFloat(yInput.value),
					parseFloat(zInput.value)
					),
				parseFloat(radiusInput.value),
				hexToRGB(colorInput.value)
			);
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
		radiusInput.value = selectedObject.radius;
	}
	//sizeInput.value = selectedObject.size;
	objectTypeDropdown.value = selectedObject.type;
	xInput.value = selectedObject.center.x;
	yInput.value = selectedObject.center.y;
	zInput.value = selectedObject.center.z;
	colorInput.value = RGBToHex(selectedObject.color);
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
		selectedObject.center.x = parseFloat(xInput.value);
		selectedObject.center.y = parseFloat(yInput.value);
		selectedObject.center.z = parseFloat(zInput.value);
		selectedObject.color = hexToRGB(colorInput.value);
		selectedObject.radius = parseFloat(radiusInput.value);
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