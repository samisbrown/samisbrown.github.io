import { c } from "./main.js";
import { camera } from "./camera.js";
import { render, grid } from "./canvas.js";
import { ui, UITile } from "./ui.js";
import { Tile, TILE_SIZE } from "./tiles.js";

export const mouse = {x: 0, y: 0};

export function init_events() // so c is defined and we avoid circular dependency from main.js
{

	c.addEventListener("wheel", (event) => {
		event.preventDefault();

		const rect = c.getBoundingClientRect();
		mouse.x = event.clientX - rect.left;
		mouse.y = event.clientY - rect.top;
		
		if (ui.is_hovered(mouse))
		{
			// If we scroll while hovered over the ui, scroll the ui
		}
		else 
		{
			// Else, we are scrolling over the grid, so zoom in/out
			if (event.deltaY < 0) {
				camera.zoom_in(mouse);
			} else {
				camera.zoom_out(mouse);
			}
		}
	}, { passive: false });

	c.addEventListener("mousedown", (event) => {
		const rect = c.getBoundingClientRect();
		mouse.x = event.clientX - rect.left;
		mouse.y = event.clientY - rect.top;
		
		switch (event.button)
		{
			case 0:
				// Left Click
				if (ui.is_hovered(mouse))
				{
					// If the mouse has clicked over the ui
					// Check if its clicked on a ui tile specifically
					let hovered_tile = ui.tile_hovered(mouse);
					if (hovered_tile != null)
					{
						// If a specific tile has been clicked on
						ui.holding = {
							"ui": new UITile(hovered_tile, mouse.x - ui.button_size / 2, mouse.y - ui.button_size / 2),
							"real": new Tile()
						};
						window.requestAnimationFrame(render);
					}
					else
					{
						// The UI in general has been clicked on
						ui.holding = null;
						window.requestAnimationFrame(render);
					}
				}
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
		const rect = c.getBoundingClientRect();
		mouse.x = event.clientX - rect.left;
		mouse.y = event.clientY - rect.top;
	
		if (event.buttons & 0x4 && !ui.is_hovered(mouse))
		{
			// If middle mouse button is down and we are not dragging over the ui
			camera.x += event.movementX;
			camera.y += event.movementY;
			window.requestAnimationFrame(render);
		}
		if (ui.holding != null)
		{
			// If the mouse is holding a tile, update its pos
			ui.holding.ui.x = mouse.x - ui.button_size / 2;
			ui.holding.ui.y = mouse.y - ui.button_size / 2;
			ui.holding.real.tile_x = Math.floor((mouse.x - grid.LINE_WIDTH / 2) / TILE_SIZE);
			ui.holding.real.tile_y = Math.floor((mouse.y - grid.LINE_WIDTH / 2) / TILE_SIZE);
			//let world_x = this.tile_x * TILE_SIZE + grid.LINE_WIDTH / 2;
			//let world_y = this.tile_y * TILE_SIZE + grid.LINE_WIDTH / 2;
			console.log(ui.holding.real.x, ui.holding.real.y);
			window.requestAnimationFrame(render);
		}
	});
	
}