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
const canvasHeightSlider = document.getElementById('canvas-height');
const pixelSizeSlider = document.getElementById('pixel-size');
const addObjectButton = document.getElementById('add-object');
const objectDropdown = document.getElementById('object-dropdown');
const deleteObjectButton = document.getElementById('delete-object');
const sizeInput = document.getElementById('object-size');
const xInput = document.getElementById('object-x');
const yInput = document.getElementById('object-y');
const colorInput = document.getElementById('object-color');
const backgroundColorInput = document.getElementById('background-color');
const radiusInput = document.getElementById('object-radius');
const updateObjectButton = document.getElementById('update-object');
const numThreadsSlider = document.getElementById('num-threads');

// Runtime
let rendering = false;
let current_pixel = 0;
const counter_to_xy = (num) => {
	return {
	x: (num % Math.ceil(CANVAS_SIZE.w / PIXEL_SIZE)) * PIXEL_SIZE, 
	y: (Math.floor(num / Math.ceil(CANVAS_SIZE.w / PIXEL_SIZE)) * PIXEL_SIZE)
}};

let objects = [];
let selectedObject = null;

// Ray Tracer
let SceneObjects = new math.Sphere(new math.Vector(0, 0, -100), 10);

// Settings
let CANVAS_SIZE = {w: parseInt(canvasWidthSlider.value), h: parseInt(canvasHeightSlider.value)};
let PIXEL_SIZE = parseInt(pixelSizeSlider.value);
let BACKGROUND_COLOR = backgroundColorInput.value;

let workerCount = navigator.hardwareConcurrency || 4;
let workers = [];
let workerIndex = 0;

// Init Collapsible Headers
document.querySelectorAll('.collapsible-header').forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
	const symbol = header.querySelector('.collapsible-symbol');
	
	content.classList.toggle('show');
	if (content.classList.contains('show')) {
		symbol.textContent = "-";
	} else {
		symbol.textContent = "+";	
	}
  });
});

// Init workers
for (let i = 0; i < workerCount; i++) {
	const worker = new Worker("worker.js", {type:'module'});
	workers.push(worker);
}

// Init Threads Slider
numThreadsSlider.max = navigator.hardwareConcurrency || 4;
numThreadsSlider.value = navigator.hardwareConcurrency || 4;
document.getElementById('num-threads-value').textContent = navigator.hardwareConcurrency || 4;

workers.forEach((worker) => {
	worker.onmessage = function(event) {
		//console.log(current_pixel);
		// If sent all pixels, no more sending, but still draw any received
		if (current_pixel == Math.ceil(CANVAS_SIZE.w / PIXEL_SIZE) * Math.ceil(CANVAS_SIZE.h / PIXEL_SIZE)) {
			renderButton.textContent = "Render";
			renderButton.classList.remove('rendering');		
			rendering = false;
		} else {
			//If not sent all pixels, send
			let {x: new_x, y: new_y} = counter_to_xy(current_pixel++);
			console.log(`Pixel ${current_pixel-1}: Sending to worker ${new_x}, ${new_y}, ${PIXEL_SIZE}`);
			this.postMessage({x: new_x, y: new_y, size: PIXEL_SIZE});
		}
		//Draw received data
		const {pixel_x, pixel_y, pixel_color} = event.data;
		console.log(`${current_pixel} Main Received ${pixel_x}, ${pixel_y}, rgb(${pixel_color.r}, ${pixel_color.g}, ${pixel_color.b})`);
		ctx.fillStyle = `rgb(${pixel_color.r}, ${pixel_color.g}, ${pixel_color.b})`;
		ctx.fillRect(pixel_x, pixel_y, PIXEL_SIZE, PIXEL_SIZE);
		/*if (--pixels_done_semaphore == 0) {
			renderButton.textContent = "Render";
			renderButton.classList.toggle('rendering');		
			rendering = false;
		}*/
	};
});

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
			scene_objects: SceneObjects
		});
		
		if (i == 0) console.log(current_pixel);
		let {x, y} = counter_to_xy(current_pixel++);
		if (i == 0) console.log({x, y});
		console.log(`Pixel ${current_pixel-1}: Sending to worker ${x}, ${y}, ${PIXEL_SIZE}`);
		workers[i].postMessage({x, y, size: PIXEL_SIZE});
	}
}

renderButton.addEventListener('click', () => {
	if (!renderButton.classList.contains('rendering')) {
		renderButton.textContent = "Rendering...";
		renderButton.classList.add('rendering');
		rendering = true;
		requestAnimationFrame(() => renderScene());
	}
});

canvasWidthSlider.addEventListener('input', () => {
	const width = canvasWidthSlider.value;
	canvas.width = width;
	CANVAS_SIZE.w = width;
	//modify pixelSize accordingly
	const temp = canvas.height < canvas.width ? canvas.height : canvas.width;
	if (pixelSizeSlider.value > temp) {
		pixelSizeSlider.value = temp;
		PIXEL_SIZE = parseInt(pixelSizeSlider.value);
		document.getElementById('pixel-size-value').textContent = temp;
	}
	pixelSizeSlider.max = temp;
	
	document.getElementById('canvas-width-value').textContent = width;
});

canvasHeightSlider.addEventListener('input', () => {
	const height = canvasHeightSlider.value;
	canvas.height = height;
	CANVAS_SIZE.h = height;
	//modify pixelSize accordingly
	const temp = canvas.height < canvas.width ? canvas.height : canvas.width;
	if (pixelSizeSlider.value > temp) {
		pixelSizeSlider.value = temp;
		PIXEL_SIZE = parseInt(pixelSizeSlider.value);
		document.getElementById('pixel-size-value').textContent = temp;
	}
	pixelSizeSlider.max = temp;
	
	document.getElementById('canvas-height-value').textContent = height;
});

pixelSizeSlider.addEventListener('input', () => {
	const size = pixelSizeSlider.value;
	PIXEL_SIZE = parseInt(pixelSizeSlider.value);
	document.getElementById('pixel-size-value').textContent = size;
});

addObjectButton.addEventListener('click', () => {
	const newObject = {
		id: prompt("Enter a name for the object: "),//`object${objects.length + 1}`,
		size: 10,
		x: 0,
		y: 0,
		color: '#ff0000',
		radius: 10
	};
	selectedObject = newObject.id;
	objects.push(newObject);
	const option = document.createElement('option');
	option.value = newObject.id;
	option.textContent = newObject.id;
	objectDropdown.appendChild(option);
});

objectDropdown.addEventListener('change', () => {
	const objectId = objectDropdown.value;
	selectedObject = objects.find(obj => obj.id === objectId);
	if (selectedObject) {
		sizeInput.value = selectedObject.size;
		xInput.value = selectedObject.x;
		yInput.value = selectedObject.y;
		colorInput.value = selectedObject.color;
		radiusInput.value = selectedObject.radius;
  }
});

deleteObjectButton.addEventListener('click', () => {
	if (selectedObject) {
		objects = objects.filter(obj => obj.id !== selectedObject.id);
		//selectedObject = null;
		const options = Array.from(objectDropdown.options);
		const selectedOption = options.find(opt => opt.value === objectDropdown.value);
		if (selectedOption) objectDropdown.removeChild(selectedOption);
	}
});

updateObjectButton.addEventListener('click', () => {
	if (selectedObject) {
		selectedObject.size = parseFloat(sizeInput.value);
		selectedObject.x = parseFloat(xInput.value);
		selectedObject.y = parseFloat(yInput.value);
		selectedObject.color = colorInput.value;
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
		const worker = new Worker("worker.js");
		workers.push(worker);
	}
	
	// Reassign onmessage event function
	workers.forEach((worker) => {
		worker.onmessage = function(event) {
			const {x, y, color} = event.data;
			ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
			ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
		};
	});
});

backgroundColorInput.addEventListener('change', () => {
	BACKGROUND_COLOR = backgroundColorInput.value;
});

//renderScene();