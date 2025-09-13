const canvas = document.getElementById('ray-tracer-canvas');
const ctx = canvas.getContext('2d');

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
const radiusInput = document.getElementById('object-radius');
const updateObjectButton = document.getElementById('update-object');
const numThreadsSlider = document.getElementById('num-threads');

let objects = [];
let selectedObject = null;
let PIXEL_SIZE = parseInt(pixelSizeSlider.value);

let workerCount = navigator.hardwareConcurrency || 4;
let workers = [];
let workerIndex = 0;

// Init workers
for (let i = 0; i < workerCount; i++) {
	const worker = new Worker("worker.js");
	workers.push(worker);
}

// Init Threads Slider
numThreadsSlider.max = navigator.hardwareConcurrency || 4;
numThreadsSlider.value = navigator.hardwareConcurrency || 4;
document.getElementById('num-threads-value').textContent = navigator.hardwareConcurrency || 4;

workers.forEach((worker) => {
	worker.onmessage = function(event) {
		const {x, y, color} = event.data;
		ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
		ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
	};
});

function renderScene() {
	for (let y = 0; y < canvas.height; y += PIXEL_SIZE) {
		for (let x = 0; x < canvas.width; x += PIXEL_SIZE) {
			workers[workerIndex++].postMessage({x, y, PIXEL_SIZE});
			workerIndex %= workerCount;
		}
	}
}

canvasWidthSlider.addEventListener('input', () => {
	const width = canvasWidthSlider.value;
	canvas.width = width;
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
	// Update Thread gui
	document.getElementById('num-threads-value').textContent = numThreadsSlider.value;
	
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

renderScene();