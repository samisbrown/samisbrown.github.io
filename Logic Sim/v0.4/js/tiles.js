import { ctx } from "./main.js";
import { camera } from "./camera.js";
import { grid } from "./canvas.js";

export class Wire
{
	constructor(x1, y1, x2, y2, inputs, outputs)
	{
		this.value = false;
		
		this.world_x1 = x1;
		this.world_y1 = y1;
		this.world_x2 = x2;
		this.world_y2 = y2;
		
		this.outputs = outputs;
		this.inputs = inputs; 
	}
	
	cascade_value()
	{
		// enabled/disables a whole wire chain
		this.value = false;
		// Get value from inputs
		this.inputs.forEach((inp) => {
			if (inp.value)
			{
				this.value = true;
				break;
			}
		});
		// Cascade the value at to outputs
		this.outputs.forEach((out) => {
			out.cascade_value();
		});
	}
}

export class Port
{
	
}

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