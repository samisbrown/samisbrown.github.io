class Spritesheet {
	constructor(src_file, wh) {//the source file and the width height of one sprite
		this.img = new Image();
		this.img.onload = function() {
			//below makes a memory canvas
			var canvas = document.createElement('canvas');
			var cont = canvas.getContext('2d');
			canvas.width = this.w;
			canvas.height = this.h;
			
			this.spriteList = []; //for storing all x and y coords of each sprite
			for (var y=0; y<this.img.height; y+=this.h) {
				for (var x=0; x<this.img.width; x+=this.w) {
					this.spriteList.push([x, y]);
				}
			}
		}.bind(this);
		this.img.src = src_file;
		this.w = wh[0];
		this.h = wh[1];	
	}
	drawSprite(index, dx, dy) {//index is what the number of the sprite is dx dy is destination coords
		ctx.drawImage(this.img, this.spriteList[index][0], this.spriteList[index][1], this.w, this.h, dx, dy, this.w, this.h);
	}
}