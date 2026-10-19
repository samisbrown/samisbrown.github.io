import { c } from "./main.js";
import { render, grid } from "./canvas.js";
import { TILE_SIZE } from "./tiles.js";

export const camera = {
	x: 0,
	y: 0,
	zoom: 1,
	
	zoom_in: function()
	{
		const rect = c.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		
		const worldX = (mouseX - this.x) / grid.ZOOMED_TILE_SIZE;
		const worldY = (mouseY - this.y) / grid.ZOOMED_TILE_SIZE;

		this.zoom += 0.1;
		this.x = mouseX - worldX * grid.ZOOMED_TILE_SIZE;
		this.y = mouseY - worldY * grid.ZOOMED_TILE_SIZE;
		
		window.requestAnimationFrame(render);
		console.log(this.zoom);
	},
	
	zoom_out: function()
	{
		const rect = c.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		
		const worldX = (mouseX - this.x) / grid.ZOOMED_TILE_SIZE;
		const worldY = (mouseY - this.y) / grid.ZOOMED_TILE_SIZE;
		
		this.zoom = Math.max(0.1, this.zoom - 0.1);
		this.x = mouseX - worldX * grid.ZOOMED_TILE_SIZE;
		this.y = mouseY - worldY * grid.ZOOMED_TILE_SIZE;
		
		window.requestAnimationFrame(render);
		console.log(this.zoom);
	},
	
	screen_to_tile_space: function(screen_x, screen_y)
	{
		let world = this.screen_to_world_space(screen_x, screen_y);
		return this.world_to_tile_space(world.x, world.y);
	},
	
	screen_to_world_space: function(screen_x, screen_y)
	{
		return {
			x: (screen_x - camera.x) / camera.zoom,
			y: (screen_y - camera.y) / camera.zoom,
		};		
	},
	
	tile_to_screen_space: function(tile_x, tile_y)
	{
		let world = this.tile_to_world_space(tile_x, tile_y);
		return this.world_to_screen_space(world.x, world.y);
	},
	
	tile_to_world_space: function(tile_x, tile_y)
	{
		return {
			x: tile_x * (TILE_SIZE + grid.BASE_LINE_WIDTH) + grid.BASE_LINE_WIDTH / 2,
			y: tile_y * (TILE_SIZE + grid.BASE_LINE_WIDTH) + grid.BASE_LINE_WIDTH / 2
		};
	},
	
	world_to_screen_space: function(world_x, world_y)
	{
		return {
			x: world_x * camera.zoom + camera.x,
			y: world_y * camera.zoom + camera.y,
		};
	},
	
	world_to_tile_space: function(world_x, world_y)
	{
		return {
			x: (world_x - grid.BASE_LINE_WIDTH / 2) / (TILE_SIZE + grid.BASE_LINE_WIDTH),
			y: (world_y - grid.BASE_LINE_WIDTH / 2) / (TILE_SIZE + grid.BASE_LINE_WIDTH)
		};		
	}
	
	
};