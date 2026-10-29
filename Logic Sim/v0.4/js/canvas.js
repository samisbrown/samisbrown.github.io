import { c, ctx } from "./main.js";
import { Tile, main_tile } from "./tiles.js";
import { camera } from "./camera.js";
import { ui } from "./ui.js";
import { mouse } from "./input.js";

export const grid = {
	LINE_WIDTH: 1,
	LINE_COLOR: "#cccccc",
	
	world_to_tile: function(world_x, world_y)
	{
		return {
			x: Math.floor(
				(world_x - grid.LINE_WIDTH / 2) / Tile.SIZE
			),
			y: Math.floor(
				(world_y - grid.LINE_WIDTH / 2) / Tile.SIZE
			)
		};
	},
	
	tile_to_world: function(tile_x, tile_y)
	{
		return {
			x: tile_x * Tile.SIZE + grid.LINE_WIDTH / 2,
			y: tile_y * Tile.SIZE + grid.LINE_WIDTH / 2
		};
	},
	
	render: function()
	{
		// Visible area expressed in world coordinates.
        const left = -camera.x / camera.zoom;
        const top = -camera.y / camera.zoom;
        const right = left + c.width / camera.zoom;
        const bottom = top + c.height / camera.zoom;

        const startX = Math.floor(left / Tile.SIZE) * Tile.SIZE;
        const startY = Math.floor(top / Tile.SIZE) * Tile.SIZE;

        ctx.beginPath();
        ctx.strokeStyle = this.LINE_COLOR;

        // Keep the lines visually consistent when zooming.
        ctx.lineWidth = this.LINE_WIDTH;

        for (let x = startX; x <= right + Tile.SIZE; x += Tile.SIZE) {
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
        }

        for (let y = startY; y <= bottom + Tile.SIZE; y += Tile.SIZE) {
            ctx.moveTo(left, y);
            ctx.lineTo(right, y);
        }

        ctx.stroke();
	}
}

export function render()
{
	//Clear screen
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, c.width, c.height);
	
	// World space
	ctx.save();
	camera.apply();
	
	grid.render();
	
	Object.keys(main_tile.tiles).forEach((key) => 
	{
		main_tile.tiles[key].render();
	});
	
	// Screen space
	ctx.restore();
	
	ui.render();
	
	if (ui.holding.type != null) 
	{
		if (ui.is_hovered(mouse))
		{
			// mouse over ui, render holding ui
			ui.holding.ui_preview.render();
		}
		else
		{
			// Mouse not over ui, render real tile
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.save();
			camera.apply();
			
			ui.holding.tile_preview.render();
			
			ctx.restore();
		}
	}
}