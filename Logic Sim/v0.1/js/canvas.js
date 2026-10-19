import { c, ctx } from "./main.js";
import { TILE_SIZE, tiles } from "./tiles.js";
import { camera } from "./camera.js";

export const grid = {
	BASE_LINE_WIDTH: Math.floor(TILE_SIZE * camera.zoom / 20),
	get LINE_WIDTH() {return this.BASE_LINE_WIDTH * camera.zoom;},
	get ZOOMED_TILE_SIZE() {return TILE_SIZE * camera.zoom + this.LINE_WIDTH;},
	LINE_COLOR: "#cccccc",
	
	render: function()
	{
		ctx.lineWidth = this.LINE_WIDTH;
		ctx.strokeStyle = this.LINE_COLOR;
		
		for (let  y = 0; y < c.height + this.ZOOMED_TILE_SIZE; y += this.ZOOMED_TILE_SIZE)
		{
			ctx.beginPath();
			ctx.moveTo(0, camera.y % this.ZOOMED_TILE_SIZE + y);
			ctx.lineTo(c.width, camera.y % this.ZOOMED_TILE_SIZE + y);
			ctx.stroke();
		}
		for (let x = 0; x < c.width + this.ZOOMED_TILE_SIZE; x += this.ZOOMED_TILE_SIZE)
		{
			ctx.beginPath();
			ctx.moveTo(camera.x % this.ZOOMED_TILE_SIZE + x, 0);
			ctx.lineTo(camera.x % this.ZOOMED_TILE_SIZE + x, c.height);
			ctx.stroke();
		}
	}
}

export function render()
{
	ctx.clearRect(0, 0, c.width, c.height);
	grid.render();
	
	// Draw the rest of the shit
	tiles[0].render();
}