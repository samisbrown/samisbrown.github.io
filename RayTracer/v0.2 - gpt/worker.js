self.onmessage = function(event) {
	const { x, y, size } = event.data;
	// Placeholder for ray-tracing logic
	const color = {
		r: x-y/2,
		g: y-x/2,
		b: (x+y)/4
	};

	// Send the computed color back to the main thread
	//console.log(`send ${JSON.stringify({x, y, color})}`);
	self.postMessage({ x, y, color });
};
