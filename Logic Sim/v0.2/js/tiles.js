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
		let world_x = this.tile_x * TILE_SIZE + grid.LINE_WIDTH / 2;
		let world_y = this.tile_y * TILE_SIZE + grid.LINE_WIDTH / 2;
		ctx.fillRect(world_x, world_y, TILE_SIZE - grid.LINE_WIDTH, TILE_SIZE - grid.LINE_WIDTH);
	}
}

export const tile_types = ["NOT", "hi", "hey", "meow", "what"];

export const tiles = [new Tile("NOT", 120, 4), new Tile("NOT", 0, 0), new Tile("NOT", -2, -2), new Tile("NOT", 2, 2)];