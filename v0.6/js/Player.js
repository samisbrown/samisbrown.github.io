class Player {
	constructor(xywh, limits, totalLashes) {
		this.x = xywh[0];
		this.y = xywh[1];
		this.wh = [xywh[2], xywh[3]]; //used to keep a copy of the original
		this.w = xywh[2];
		this.h = xywh[3];
		this.respawn_point = [xywh[0], xywh[1]];
		
		this.limits = limits; //min x min y max x max y
		
		this.totalLashes = totalLashes; //the total amount of times the player can lash themselves
		
		this.dx = 0; //draw x, the x on the screen, the rendered x
		this.dy = 0;
		
		this.xv = 0; //used for moving left and right
		this.yv = 0; //used for moving left and right when lashed
		
		this.facing = "right";
		
		this.lashing = new Lashing("down");
		
		this.spritesheet = new Spritesheet("./Assets/player.png", this.wh);
		
		this.rightRunAnim = new Animation(this.spritesheet, 0, 3, 3);
		this.leftRunAnim = new Animation(this.spritesheet, 4, 7, 3);
		this.rightIdleImg = new Animation(this.spritesheet, 8, 8, 0);
		this.rightJumpImg = new Animation(this.spritesheet, 9, 9, 0);
		this.rightIdleLongImg = new Animation(this.spritesheet, 10, 10, 0);
		this.leftIdleImg = new Animation(this.spritesheet, 12, 12, 0);
		this.leftJumpImg = new Animation(this.spritesheet, 13, 13, 0);
		this.leftIdleLongImg = new Animation(this.spritesheet, 14, 14, 0);
		this.deathImg = new Animation(this.spritesheet, 15, 15, 0);
		
		this.idleTime = 0; //increases when no keys are pressed
		//this.color = "#ff0000";
		this.airbourne = true;
	}
	handleInputs() {
		//idletime
		if (!_KEYS["KeyW"] && !_KEYS["KeyA"] && !_KEYS["KeyS"] && !_KEYS["KeyD"] && !_KEYS["Space"] && !_KEYS["ArrowUp"] && !_KEYS["ArrowLeft"] && !_KEYS["ArrowDown"] && !_KEYS["ArrowRight"]) {//no keys pressed
			this.idleTime++;
		} else {
			this.idleTime = 0;
		}
		//CHANGING LASHINGS
		if (stormlight.capacity>0) {
			if (_KEYS["ArrowLeft"]) {
				this.airbourne = true;
				this.w = this.wh[1]; //change the width to the heigh and vice versa
				this.h = this.wh[0];
				if (this.lashing.direction == "up" || this.lashing.direction == "down") { //if it was previously stand up instead of onside
					this.y = this.y+this.wh[1]/2-this.wh[0]/2; //move y to center the onside
					this.x = this.x+this.wh[0]/2-this.wh[1]/2;
				} if (this.lashing.direction != "left") { //if not already left minus stormlight
					stormlight.useLash()
					this.lashesLeft--;
				}
				this.lashing.change("left");
			} else if (_KEYS["ArrowRight"]) {
				this.airbourne = true;
				this.w = this.wh[1];
				this.h = this.wh[0];
				if (this.lashing.direction == "up" || this.lashing.direction == "down") { //if it was previously stand up instead of onside
					this.y = this.y+this.wh[1]/2-this.wh[0]/2; //move y to center the onside
					this.x = this.x+this.wh[0]/2-this.wh[1]/2;
				} if (this.lashing.direction != "right") { //if not already right minus stormlight
					stormlight.useLash()
					this.lashesLeft--;
				}
				this.lashing.change("right");
			} else if (_KEYS["ArrowUp"]) {
				this.airbourne = true;
				this.w = this.wh[0];
				this.h = this.wh[1];
				if (this.lashing.direction == "left" || this.lashing.direction == "right") { //if it was previously onside instead of standup
					this.y = this.y+this.wh[0]/2-this.wh[1]/2; //move y to center the onside
					this.x = this.x+this.wh[1]/2-this.wh[0]/2;
				} if (this.lashing.direction != "up") { //if not already up minus stormlight
					stormlight.useLash()
					this.lashesLeft--;
				}
				this.lashing.change("up");
			} else if (_KEYS["ArrowDown"]) {
				this.airbourne = true;
				this.w = this.wh[0];
				this.h = this.wh[1];
				if (this.lashing.direction == "left" || this.lashing.direction == "right") { //if it was previously onside instead of standup
					this.y = this.y+this.wh[0]/2-this.wh[1]/2; //move y to center the onside
					this.x = this.x+this.wh[1]/2-this.wh[0]/2;
				} if (this.lashing.direction != "down") { //if not already down minus stormlight
					stormlight.useLash()
					this.lashesLeft--;
				}
				this.lashing.change("down");
			}
		}
		//DEFAULT MOVEMENT
		//Key down
		if (_KEYS["KeyW"] || _KEYS["Space"]) {
			this.jump();
		}
		if (_KEYS["KeyA"]) {
			this.facing = "left";
			if (this.lashing.direction == "down") {
				player.xv = -4;
				player.yv = 0;
			} if (this.lashing.direction == "up") {
				player.xv = 4;
				player.yv = 0;				
			} if (this.lashing.direction == "left") {
				player.yv = -4;
				player.xv = 0;
			} if (this.lashing.direction == "right") {
				player.yv = 4;
				player.xv = 0;
			}
		} if (_KEYS["KeyD"]) {
			this.facing = "right";
			if (this.lashing.direction == "down") {
				player.xv = 4;
				player.yv = 0;
			} if (this.lashing.direction == "up") {
				player.xv = -4;
				player.yv = 0;
			} if (this.lashing.direction == "left") {
				player.yv = 4;
				player.xv = 0;
			} if (this.lashing.direction == "right") {
				player.yv = -4;
				player.xv = 0;
			}
		}
		//Key release
		if (!_KEYS["KeyA"] && !_KEYS["KeyD"]) {
			if (this.lashing.direction == "down" || this.lashing.direction == "up") {
				player.xv = 0;
			} if (this.lashing.direction == "left" || this.lashing.direction == "right") {
				player.yv = 0;
			}
		}
		
	}
	jump() { //this function makes the player jump
		if (!this.airbourne) {
			if (this.lashing.direction == "down") {
				this.lashing.yv = -15;
				this.airbourne = true;
			} if (this.lashing.direction == "up") {
				this.lashing.yv = 15;
				this.airbourne = true;
			} if (this.lashing.direction == "left") {
				this.lashing.xv = 15;
				this.airbourne = true;
			} if (this.lashing.direction == "right") {
				this.lashing.xv = -15;
				this.airbourne = true;
			}
		}
	}
	playerCollideY(obj) { //this test if the player is colliding with something and what edge it's colliding on // for y axis
		var cb = 25; //cb = collision buffer
		//top of player
		if (this.y<obj.y+obj.h && this.y>obj.y+obj.h-cb && this.x+this.w>obj.x && this.x<obj.x+obj.w) {//top
			this.y = obj.y+obj.h;
			this.lashing.yv = 0;
			if (this.lashing.direction == "up") {
				this.lashing.xv = 0;
				this.airbourne = false;
			}
			if (obj.constructor.name == "MovingPlatform" && obj.hasFriction) {
				obj.playerOnTop = true;
			}
		//bot of player
		} if (this.y+this.h>obj.y && this.y+this.h<obj.y+cb && this.x+this.w>obj.x && this.x<obj.x+obj.w) {//bottom
			this.y = obj.y-this.h
			this.lashing.yv = 0
			if (this.lashing.direction == "down") {
				this.lashing.xv = 0;
				this.airbourne = false;
			}
			if (obj.constructor.name == "MovingPlatform" && obj.hasFriction) {
				obj.playerOnTop = true;
			}
		}
	}
	playerCollideX(obj) {
		var cb = 25;
		//left of player
		if (this.x<obj.x+obj.w && this.x>obj.x+obj.w-cb && this.y+this.h>obj.y && this.y<obj.y+obj.h) {//left
			this.x = obj.x+obj.w;
			this.lashing.xv = 0;
			if (this.lashing.direction == "left") {
				this.lashing.yv = 0;
				this.airbourne = false;
			}
			if (obj.constructor.name == "MovingPlatform" && obj.hasFriction) {
				obj.playerOnTop = true;
			}
		//right of player
		} if (this.x+this.w>obj.x && this.x+this.w<obj.x+cb && this.y+this.h>obj.y && this.y<obj.y+obj.h) {//right
			this.x = obj.x-this.w;
			this.lashing.xv = 0;
			if (this.lashing.direction == "right") {
				this.lashing.yv = 0;
				this.airbourne = false;
			}
			if (obj.constructor.name == "MovingPlatform" && obj.hasFriction) {
				obj.playerOnTop = true;
			}
		}
	}
	updateY() {
		//
		//logic occurs here
		//gravity
		/*if (this.yv == 0) {
			this.yv = 1;
		}*/
		this.lashing.updateY();
		this.y += this.lashing.yv;
		this.y += this.yv; //yv for move left and right
		this.airbourne = true; //will get changed if on ground
				
		//collisions 
		//######THE COLLISIONS WITH THE SIDE OF THE CANVAS NOT NEEDED, CAMERA
	}
	updateX() {
		this.lashing.updateX();
		this.x += this.lashing.xv;
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
		this.w = this.wh[0];
		this.h = this.wh[1];
		this.yv = 0;
		this.xv = 0;
		this.lashing.reset();
		camera.panTo(this, 60);
	}
	draw() {
		/*ctx.fillStyle = this.color;
		ctx.fillRect(this.dx, this.dy, this.w, this.h);*/
		//ctx.drawImage(this.img, this.dx, this.dy);
		//below rotates the next image to be drawn
		ctx.save();
		switch (this.lashing.direction) {
			case "left":
				ctx.translate(this.dx+this.w/2, this.dy+this.h/2);
				ctx.rotate(Math.PI/2);
				ctx.translate(-this.dx-this.w/2, -this.dy-this.h/2);
				break;
			case "up":
				ctx.translate(this.dx+this.w/2, this.dy+this.h/2);
				ctx.rotate(180*Math.PI/180);
				ctx.translate(-this.dx-this.w/2, -this.dy-this.h/2);
				break;
			case "right":
				ctx.translate(this.dx+this.w/2, this.dy+this.h/2);
				ctx.rotate(270*Math.PI/180);
				ctx.translate(-this.dx-this.w/2, -this.dy-this.h/2);
				break;
		} //no rotation needed for down
		if (this.facing == "left") {
			if (this.airbourne) {
				this.leftJumpImg.draw(this.dx, this.dy);
			} else if (this.xv != 0 || this.yv != 0) {
				this.leftRunAnim.draw(this.dx, this.dy);
			} else if (this.idleTime > 900) {
				this.leftIdleLongImg.draw(this.dx, this.dy);
			} else {
				this.leftIdleImg.draw(this.dx, this.dy);
			}
		} else if (this.facing == "right") {
			if (this.airbourne) {
				this.rightJumpImg.draw(this.dx, this.dy);
			} else if (this.xv != 0 || this.yv != 0) {
				this.rightRunAnim.draw(this.dx, this.dy);
			} else if (this.idleTime > 900) {
				this.rightIdleLongImg.draw(this.dx, this.dy);
			} else {
				this.rightIdleImg.draw(this.dx, this.dy);
			}
		}
		ctx.restore(); //for rotating	
	}
}