import { ctx } from "./main.js";
import { camera } from "./camera.js";
import { grid } from "./canvas.js";

export class Tile
{
	static SIZE = 32;
	static TYPES = ["NOT"];
	constructor(type, x, y)
	{
		this.type = type;
		this.tile_x = x;
		this.tile_y = y;
		
		this.color = "#ff0000";
		
		this.tiles = {};
	}
	
	render()
	{
		ctx.fillStyle = this.color;
		const world_pos = grid.tile_to_world(this.tile_x, this.tile_y);
		ctx.fillRect(world_pos.x, world_pos.y, Tile.SIZE - grid.LINE_WIDTH, Tile.SIZE - grid.LINE_WIDTH);
	}
}

export const main_tile = new Tile(null, 0, 0);