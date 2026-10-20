import { c, ctx } from "./main.js";
import { TILE_SIZE, tiles } from "./tiles.js";
import { camera } from "./camera.js";
import { ui } from "./ui.js";
import { mouse } from "./input.js";

export const grid = {
	LINE_WIDTH: 1,
	LINE_COLOR: "#cccccc",
	
	render: function()
	{
		// Visible area expressed in world coordinates.
        const left = -camera.x / camera.zoom;
        const top = -camera.y / camera.zoom;
        const right = left + c.width / camera.zoom;
        const bottom = top + c.height / camera.zoom;

        const startX = Math.floor(left / TILE_SIZE) * TILE_SIZE;
        const startY = Math.floor(top / TILE_SIZE) * TILE_SIZE;

        ctx.beginPath();
        ctx.strokeStyle = this.LINE_COLOR;

        // Keep the lines visually consistent when zooming.
        ctx.lineWidth = this.LINE_WIDTH;

        for (let x = startX; x <= right + TILE_SIZE; x += TILE_SIZE) {
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
        }

        for (let y = startY; y <= bottom + TILE_SIZE; y += TILE_SIZE) {
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
	
	for (let i = 0; i < tiles.length; i++)
	{
		tiles[i].render();
	}
	
	// Screen space
	ctx.restore();
	
	ui.render();
	
	if (ui.holding != null) 
	{
		if (ui.is_hovered(mouse))
		{
			// mouse over ui, render holding ui
			ui.holding.ui.render();
		}
		else
		{
			// Mouse not over ui, render real tile
			ctx.save();
			camera.apply();
			
			ui.holding.real.render();
			console.log(ui.holding.real);
			
			ctx.restore();
		}
	}
}