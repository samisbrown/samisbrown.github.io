class Lashing {
	constructor(start_dir) {
		this.start_dir = start_dir;
		this.direction = start_dir;
		this.xv = 0;
		this.yv = 0;		
	}
	reset() {
		this.direction = this.start_dir;
		this.xv = 0;
		this.yv = 0;
	}
	change(new_dir) {
		this.direction = new_dir;
	}
	updateY() {
		if (this.direction == "up") {
			this.yv -= 0.3;
			if (this.yv < -20) {
				this.yv = -20;
			}
		} if (this.direction == "down") {
			this.yv += 0.3;
			if (this.yv > 20) {
				this.yv = 20;
			}
		} 
	}
	updateX() {
		if (this.direction == "left") {
			this.xv -= 0.3;
			if (this.xv < -20) {
				this.xv = -20;
			}
		} if (this.direction == "right") {
			this.xv += 0.3;
			if (this.xv > 20) {
				this.xv = 20;
			}
		}
	}
}