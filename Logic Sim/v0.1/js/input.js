import { c } from "./main.js";
import { camera } from "./camera.js";
import { render } from "./canvas.js";


c.addEventListener("wheel", (event) => {
	event.preventDefault();

    const rect = c.getBoundingClientRect();
    const mouse = {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};

	if (event.deltaY < 0) {
		camera.zoom_in(mouse);
	} else {
		camera.zoom_out(mouse);
	}

}, { passive: false });

c.addEventListener("mousedown", (event) => {
	switch (event.button)
	{
		case 0:
			// Left Click
			break;
		case 1:
			// Middle Mouse button
			break;
		case 2:
			// Right Click
			event.preventDefault();
			break;
	}
});

window.addEventListener("mouseup", (event) => {
	switch (event.button)
	{
		case 0:
			// Left Click
			break;
		case 1:
			// Middle Mouse button
			break;
		case 2:
			// Right Click
			break;
	}
});

c.addEventListener("mousemove", (event) => {
	if (event.buttons & 0x4)
	{
		// If middle mouse button is down
		camera.x += event.movementX;
		camera.y += event.movementY;
		window.requestAnimationFrame(render);
	}
});