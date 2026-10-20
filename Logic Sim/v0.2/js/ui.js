import { c, ctx } from "./main.js";
import { tile_types } from "./tiles.js";

export class UITile
{
	constructor(type, x, y)
	{
		this.type = type;
		this.x = x;
		this.y = y;
		
		this.color = "#00ff00";
	}
	
	is_hovered(mouse)
	{
		return mouse.x > this.x && mouse.x < this.x + ui.button_size &&
		       mouse.y > this.y && mouse.y < this.y + ui.button_size;
	}
	
	render()
	{
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, ui.button_size, ui.button_size);
		
		ctx.font = "15px Arial";
		ctx.fillStyle = "white";
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		ctx.fillText(this.type, this.x + ui.button_size / 2, this.y + ui.button_size);
	}
}

export const ui = {	
	holding: null,
	
	margin: 24,
	get x() {return this.margin;},
	get y() {return this.margin;},
	get width() {return (c.width / 10) - this.margin;},
	get height() {return c.height - this.margin * 2;},
	color: "rgba(100, 100, 100, 0.5)",

	tiles: [],
		
	get button_spacing() {return this.margin;},
	buttons_per_row: 3,
	get button_size() {return (this.width - (this.buttons_per_row + 1) * this.button_spacing) / this.buttons_per_row;},
	
	init: function()
	{
		for (let i = 0; i < tile_types.length; i++)
		{
			let ui_tile_x = this.button_spacing + i % this.buttons_per_row * (this.button_size + this.button_spacing);
			let ui_tile_y = this.button_spacing + Math.floor(i / this.buttons_per_row) * (this.button_size + this.button_spacing);
			this.tiles.push(new UITile(tile_types[i], this.x + ui_tile_x, this.y + ui_tile_y));
		}
	},
	
	is_hovered: function(mouse)
	{
		return mouse.x > this.x && mouse.x < this.x + this.width &&
		       mouse.y > this.y && mouse.y < this.y + this.height;
	},
	
	tile_hovered: function(mouse)
	{
		for (let i = 0; i < this.tiles.length; i++)
		{
			if (this.tiles[i].is_hovered(mouse))
			{
				return this.tiles[i].type;
			}
		}
		return null;
	},
	
	render: function()
	{
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		
		// Render UI side panel thing
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		
		// Render UI Tiles
		for (let i = 0; i < this.tiles.length; i++)
		{
			this.tiles[i].render();
		}
		
		ctx.restore();
	}
};