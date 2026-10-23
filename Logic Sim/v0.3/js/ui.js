import { c, ctx } from "./main.js";
import { Tile } from "./tiles.js";

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
		return mouse.x > this.x && mouse.x < this.x + ui.BUTTON_SIZE &&
		       mouse.y > this.y && mouse.y < this.y + ui.BUTTON_SIZE;
	}
	
	render()
	{
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, ui.BUTTON_SIZE, ui.BUTTON_SIZE);
		
		ctx.font = "15px Arial";
		ctx.fillStyle = "white";
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		ctx.fillText(this.type, this.x + ui.BUTTON_SIZE / 2, this.y + ui.BUTTON_SIZE);
	}
}

export const ui = {	
	holding: {
		type: null,
		ui_preview: new UITile(),
		tile_preview: new Tile()
	},
	
	MARGIN: 24,
	get x() {return this.MARGIN;},
	get y() {return this.MARGIN;},
	get width() {return (c.width / 10) - this.MARGIN;},
	get height() {return c.height - this.MARGIN * 2;},
	color: "rgba(100, 100, 100, 0.5)",

	tiles: [],
		
	get BUTTON_SPACING() {return this.MARGIN;},
	BUTTONS_PER_ROW: 3,
	get BUTTON_SIZE() {return (this.width - (this.BUTTONS_PER_ROW + 1) * this.BUTTON_SPACING) / this.BUTTONS_PER_ROW;},
	
	init: function()
	{
		for (let i = 0; i < Tile.TYPES.length; i++)
		{
			let ui_tile_x = this.BUTTON_SPACING + i % this.BUTTONS_PER_ROW * (this.BUTTON_SIZE + this.BUTTON_SPACING);
			let ui_tile_y = this.BUTTON_SPACING + Math.floor(i / this.BUTTONS_PER_ROW) * (this.BUTTON_SIZE + this.BUTTON_SPACING);
			this.tiles.push(new UITile(Tile.TYPES[i], this.x + ui_tile_x, this.y + ui_tile_y));
		}
		console.log(this.tiles);
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