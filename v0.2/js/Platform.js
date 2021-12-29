class Platform {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.dx = x; //draw x and y
		this.dy = y;
		this.w = w;
		this.h = h;
		this.color = "#00FF00";
	}
	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.dx, this.dy, this.w, this.h);
	}
}
class LevelBorder {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.dx = x; //draw x and y
		this.dy = y;
		this.w = w;
		this.h = h;
		this.color = "#000000";
	}
	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.dx, this.dy, this.w, this.h);
	}
}