import { c } from "./main.js";
import { camera } from "./camera.js";
import { render, grid } from "./canvas.js";
import { ui, UITile } from "./ui.js";
import { main_tile, Tile } from "./tiles.js";

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
	
	c.addEventListener("contextmenu", (e) => {
		// Remove default right click functionality
		e.preventDefault();
	});

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
						ui.holding.type = hovered_tile;
						
						ui.holding.ui_preview.type = hovered_tile;
						ui.holding.ui_preview.x = mouse.x - ui.button_size / 2;
						ui.holding.ui_preview.y = mouse.y - ui.button_size / 2;
						
						const world = camera.screen_to_world(mouse.x, mouse.y);
						const tile = grid.world_to_tile(world.x, world.y);
						ui.holding.tile_preview.tile_x = tile.x;
						ui.holding.tile_preview.tile_y = tile.y;
						
						window.requestAnimationFrame(render);
					}
					else
					{
						// The UI in general has been clicked on
						ui.holding.type = null;
						window.requestAnimationFrame(render);
					}
				}
				else
				{
					// Else the ui is not hovered, are we holding a tile?
					if (ui.holding.type == null) {break;}
					// If so, place it
					const world_pos = camera.screen_to_world(mouse.x, mouse.y);
					const tile_pos = grid.world_to_tile(world_pos.x, world_pos.y);
					main_tile.tiles[`${tile_pos.x},${tile_pos.y}`] = new Tile(ui.holding.type, tile_pos.x, tile_pos.y);
					console.log(main_tile);
					window.requestAnimationFrame(render);
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
		if (ui.holding.type != null)
		{
			// If the mouse is holding a tile, update its pos
			ui.holding.ui_preview.x = mouse.x - ui.BUTTON_SIZE / 2;
			ui.holding.ui_preview.y = mouse.y - ui.BUTTON_SIZE / 2;
						
			const world = camera.screen_to_world(mouse.x, mouse.y);
			const tile = grid.world_to_tile(world.x, world.y);
			ui.holding.tile_preview.tile_x = tile.x;
			ui.holding.tile_preview.tile_y = tile.y;
			
			window.requestAnimationFrame(render);
		}
	});
	
}