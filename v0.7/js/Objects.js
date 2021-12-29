class TextObject {
	constructor(xy, text, font_size, font, color, center=true) {
		this.x = xy[0];
		this.y = xy[1];
		this.dx = this.x;
		this.dy = this.y;
		this.text = text.split("\n");
		this.buffer = 5;
		this.font_size = font_size;
		this.font = font;
		this.color = color;
		if (center==true) {
			this.textAlign = "center";
		}
	}
	draw() {
		ctx.font = this.font_size+"px "+this.font;
		ctx.textAlign = this.textAlign;
		ctx.fillStyle = this.color;
		var curr_txt = 0;
		this.text.forEach(function(txt) {
			ctx.fillText(txt, this.dx, this.dy+curr_txt*(this.font_size+this.buffer));
			curr_txt += 1;
		}.bind(this));
	}
}
class Checkpoint {
	constructor(xy) {
		this.x = xy[0];
		this.y = xy[1];
		this.dx = this.x;
		this.dy = this.y;
		
		this.w = 120; //width and height of object (one sprite in spritesheet)
		this.h = 124;
		
		this.checked = false; //whether the checkpoint has been reached or not
		
		this.spritesheet = new Spritesheet("./Assets/checkpoint.png", [this.w, this.h]);
		this.uncheckedAnim = new Animation(this.spritesheet, 0, 5, 3);
		this.checkedAnim = new Animation(this.spritesheet, 6, 11, 3);
	}
	check() { //if the player gets the checkpoint
		player.respawn_point = [
			this.x+this.w/2-player.w/2,
			this.y+this.h/2-player.h/2
		];
		this.checked = true;
	}
	draw() {
		if (!this.checked) {
			this.uncheckedAnim.draw(this.dx, this.dy);
		} else { //this.checked
			this.checkedAnim.draw(this.dx, this.dy);
		}
	}
}