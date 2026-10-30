import { ctx } from "./main.js";
import { camera } from "./camera.js";
import { grid } from "./canvas.js";

const TILE_SIZE = 32;

class LogicNode
{
	constructor(inputs, outputs)
	{
		this.value = false;
		
		this.inputs = inputs;
		this.outputs = outputs;
	}
	
	cascade_value()
	{
		// enabled/disables a whole wire chain
		this.value = false;
		// Get value from inputs
		this.value = this.inputs.some((inp) => inp.value);
		// Cascade the value at to outputs
		this.outputs.forEach((out) => {
			out.cascade_value();
		});
	}
}

export class Wire extends LogicNode
{
	constructor(x1, y1, x2, y2, inputs, outputs)
	{		
		super(inputs, outputs);
		
		this.world_x1 = x1;
		this.world_y1 = y1;
		this.world_x2 = x2;
		this.world_y2 = y2;
		
		
	}
}

export class Port extends LogicNode
{
	static SIZE = TILE_SIZE / 8;
	constructor(x, y)
	{
		super([], []);
		
		this.world_x = x;
		this.world_y = y;
	}
}

class TruthTable
{
	// Define privates
	#truthtable_bytearray;
	#input_names;
	#output_names;
	constructor(type, input_names, output_names)
	{
		this.type = type;
		this.#input_names = input_names;
		this.#output_names = output_names;
		const array_size = Math.ceil((output_names.length << input_names.length) / 8);
		this.#truthtable_bytearray = new Uint8Array(array_size);
	}
	
	debug_print()
	{
		console.log(this.#truthtable_bytearray);
	}
	
	#set_bit(bit_index, value)
	{
		this.#truthtable_bytearray[bit_index / 8] |= value << bit_index % 8;
	}
	
	#get_inputs_as_number(inputs)
	{
		let inputs_as_number = 0n;
		for (let i = this.#input_names.length - 1; i >= 0; i--)
		{
			inputs_as_number <<= 1n;
			inputs_as_number |= inputs[this.#input_names[i]];			
		}
		
		return inputs_as_number;
	}
	
	set_input(inputs, outputs)
	{
		inputs_as_number = this.#get_inputs_as_number(inputs);
		
		output_index = inputs_as_number * output_names.length;
		
		for (let i = 0; i < output_names.length; i++)
		{
			this.#set_bit(output_index + i, this.#output_names[i]);
		}
	}
	
	get_outputs(inputs)
	{
		inputs_as_number = this.#get_inputs_as_number(inputs);
		
		outputs_as_number = 0n;
		const bit_index_start = inputs_as_number * output_names.length;
		const bit_index_stop = inputs_as_number * output_names.length + output_names.length;
		const byte_index_start = bit_index_start / 8;
		const byte_index_stop = bit_index_stop / 8;
		for (let byte_index = byte_index_start; byte_index < byte_index_stop; byte_index++)
		{
			outputs_as_number <<= 8;
			outputs_as_number |= this.#truthtable_bytearray[byte_index];
		}
		
		outputs = {};
		for (let i = this.#output_names.length; i >= 0; i--)
		{
			outputs[this.#output_names[i]] = outputs_as_number & 0x1;
			outputs_as_number >>= 1;
		}
		return outputs.copy();
	}
}


class TileType
{
	constructor(name, input_names, output_names, truthtable)
	{
		this.name = name;
		this.input_names = input_names;
		this.output_names = output_names;
		this.truthtable = truthtable;
	}
}

export class Tile
{
	static SIZE = TILE_SIZE;
	constructor(type, x, y, input_count, output_count)
	{
		this.type = type;
		this.tile_x = x;
		this.tile_y = y;
		
		this.color = "#ff0000";
		
		this.tiles = {};
		
		this.inputs = {};
		this.outputs = {};
		// Fill out inputs and outputs with ports
		const world_pos = grid.tile_to_world(this.tile_x, this.tile_y);
		const input_port_gap = (Tile.SIZE - Port.SIZE * input_count) / (input_count + 1);
		const output_port_gap = (Tile.SIZE - Port.SIZE * output_count) / (output_count + 1);
		
		for (let inp = 0; inp < input_count; inp++)
		{
			this.inputs[`input${inp+1}`] = new Port(world_pos.x + Port.SIZE, world_pos.y + input_port_gap * (inp+1) + Port.SIZE * inp);
		}
		
		for (let out = 0; out < output_count; out++)
		{
			this.inputs[`output${out+1}`] = new Port(world_pos.x + Tile.SIZE - Port.SIZE, world_pos.y + output_port_gap * (out+1) + Port.SIZE * out);
		}
	}
	
	render()
	{
		ctx.fillStyle = this.color;
		const world_pos = grid.tile_to_world(this.tile_x, this.tile_y);
		ctx.fillRect(world_pos.x, world_pos.y, Tile.SIZE - grid.LINE_WIDTH, Tile.SIZE - grid.LINE_WIDTH);
		ctx.fillStyle = "#00ff00";
		Object.keys(this.inputs).forEach((key) => {
			ctx.fillRect(this.inputs[key].world_x, this.inputs[key].world_y, Port.SIZE, Port.SIZE);
		});
		Object.keys(this.outputs).forEach((key) => {
			ctx.fillRect(this.outputs[key].world_x, this.outputs[key].world_y, Port.SIZE, Port.SIZE);
		});
	}
}

export const main_tile = new Tile(null, 0, 0);
export const tile_types = {}