import { c, ctx } from "./main.js";
import { render, grid } from "./canvas.js";

export const camera = {
	x: 0,
	y: 0,
	zoom: 1,
	
	zoom_in: function()
	{
		const rect = c.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		
		const worldX = (mouseX - this.x) / this.zoom;
		const worldY = (mouseY - this.y) / this.zoom;

		this.zoom *= 1.1;
		this.x = mouseX - worldX * this.zoom;
		this.y = mouseY - worldY * this.zoom;
		
		window.requestAnimationFrame(render);
		console.log(this.zoom);
	},
	
	zoom_out: function()
	{
		const rect = c.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		
		const worldX = (mouseX - this.x) / this.zoom;
		const worldY = (mouseY - this.y) / this.zoom;
		
		this.zoom = Math.max(0.1, this.zoom / 1.1);
		this.x = mouseX - worldX * this.zoom;
		this.y = mouseY - worldY * this.zoom;
		
		window.requestAnimationFrame(render);
		console.log(this.zoom);
	},

	apply: function()
	{
		ctx.setTransform(
			this.zoom, 0,
			0, this.zoom,
			this.x, this.y
		);
	},
	
	screen_to_world: function(screen_x, screen_y)
    {
        return {
            x: (screen_x - this.x) / this.zoom,
            y: (screen_y - this.y) / this.zoom
        };
    },

    world_to_screen: function(world_x, world_y)
    {
        return {
            x: world_x * this.zoom + this.x,
            y: world_y * this.zoom + this.y
        };
    }
};