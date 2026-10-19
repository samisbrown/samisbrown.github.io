import { ctx } from "./main.js";
import { camera } from "./camera.js";
import { grid } from "./canvas.js";

export const TILE_SIZE = 32;

export class Tile
{
	constructor(x, y)
	{
		this.tile_x = x;
		this.tile_y = y;
	}
	
	render()
	{
		ctx.fillStyle = "#ff0000";
		let draw_pos = camera.tile_to_screen_space(this.tile_x, this.tile_y);
		console.log(draw_pos);
		ctx.fillRect(draw_pos.x, draw_pos.y, TILE_SIZE * camera.zoom, TILE_SIZE * camera.zoom);
	}
}

export const tiles = [new Tile(120, 4)];