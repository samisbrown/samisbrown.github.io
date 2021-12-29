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