class Player {
	constructor(x, y, w, h) {
		this.respawn_point = [x, y]
		this.x = x;
		this.y = y;
		this.xv = 0;
		this.yv = 0;
		this.w = w;
		this.h = h;
		this.color = "#ff0000"
		this.airbourne = true;
	}
	handleInputs() {
		//Key down
		if (_KEYS["KeyW"] || _KEYS["Space"]) {
			this.jump();
		}
		if (_KEYS["KeyA"]) {
			player.xv = -4;
		} if (_KEYS["KeyD"]) {
			player.xv = 4;
		}
		//Key release
		if (!_KEYS["KeyA"] && !_KEYS["KeyD"]) {
			player.xv = 0;
		}
		
	}
	jump() { //this function makes the player jump
		if (!this.airbourne) {
			this.yv = -15;
			this.airbourne = true;
		}
	}
	playerCollideY(obj) { //this test if the player is colliding with something and what edge it's colliding on // for y axis
		var cb = 25; //cb = collision buffer
		//top of player
		if (this.y<obj.y+obj.h && this.y>obj.y+obj.h-cb && this.x+this.w>obj.x && this.x<obj.x+obj.w) {//top
			this.y = obj.y+obj.h;
			this.yv = 0;
		//bot of player
		} if (this.y+this.h>obj.y && this.y+this.h<obj.y+cb && this.x+this.w>obj.x && this.x<obj.x+obj.w) {//bottom
			this.y = obj.y-this.h
			this.yv = 0
			this.airbourne = false;
		}
	}
	playerCollideX(obj) {
		var cb = 10;
		//left of player
		if (this.x<obj.x+obj.w && this.x>obj.x+obj.w-cb && this.y+this.h>obj.y && this.y<obj.y+obj.h) {//left
			this.x = obj.x+obj.w;
			this.xv = 0;
		//right of player
		} if (this.x+this.w>obj.x && this.x+this.w<obj.x+cb && this.y+this.h>obj.y && this.y<obj.y+obj.h) {//right
			this.x = obj.x-this.w;
			this.xv = 0;
		}
	}
	updateY() {
		//
		//logic occurs here
		//gravity
		/*if (this.yv == 0) {
			this.yv = 1;
		}*/
		this.yv += 0.3;
		if (this.yv > 20) {
			this.yv = 20;
		}
		this.y += this.yv;
		this.airbourne = true; //will get changed if on ground
				
		//collisions
		//	down collide
		if (this.y+this.h>_SIZE[1]) {
			this.y = _SIZE[1]-this.h;
			this.airbourne = false;
		}
		//move left and right
		//console.log(this.xv);
	}
	updateX() {
		this.x += this.xv;
		//collision below arent needed due to Camera.js
		//	left collide
		/*if (this.x<0) {
			this.x = 0;
		}
		//	right collide
		if (this.x+this.w>_SIZE[0]) {
			this.x = _SIZE[0]-this.w;
		}*/
	}
	respawn() {
		this.x = this.respawn_point[0];
		this.y = this.respawn_point[1];
	}
	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}