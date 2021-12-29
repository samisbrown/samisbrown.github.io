class Player {
	constructor(xywh, limits) {
		this.x = xywh[0];
		this.y = xywh[1];
		this.w = xywh[2];
		this.h = xywh[3];
		this.respawn_point = [xywh[0], xywh[1]];
		
		this.limits = limits; //min x min y max x max y
		
		this.dx = 0; //draw x, the x on the screen, the rendered x
		this.dy = 0;
		this.xv = 0;
		this.yv = 0;
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
			if (obj.constructor.name == "MovingPlatform" && obj.hasFriction) {
				obj.playerOnTop = true;
			}
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
		//######THE COLLISIONS WITH THE SIDE OF THE CANVAS NOT NEEDED, CAMERA
	}
	updateX() {
		this.x += this.xv;
	}
	checkLimits() {
		if (this.x+this.w<this.limits[0] ||
			this.y+this.h<this.limits[1] ||
			this.x>this.limits[2] ||
			this.y>this.limits[3]) {
			player.respawn();
			//camera.center(player);
			//camera.panTo(player);
		}
	}
	respawn() {
		this.x = this.respawn_point[0];
		this.y = this.respawn_point[1];
		this.yv = 0;
		camera.panTo(this, 60);
	}
	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.dx, this.dy, this.w, this.h);
	}
}