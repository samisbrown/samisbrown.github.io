import { ctx } from "./main.js";
import { camera } from "./camera.js";
import { grid } from "./canvas.js";

export const TILE_SIZE = 32;

export class Tile
{
	constructor(type, x, y)
	{
		this.type = type;
		this.tile_x = x;
		this.tile_y = y;
		
		this.color = "#ff0000";
	}
	
	render()
	{
		ctx.fillStyle = this.color;
		const world_pos = grid.tile_to_world(this.tile_x, this.tile_y);
		ctx.fillRect(world_pos.x, world_pos.y, TILE_SIZE - grid.LINE_WIDTH, TILE_SIZE - grid.LINE_WIDTH);
	}
}

export const tile_types = ["NOT", "hi", "hey", "meow", "what"];

export const tiles = [new Tile("NOT", 120, 4), new Tile("NOT", 0, 0), new Tile("NOT", -2, -2), new Tile("NOT", 2, 2)];