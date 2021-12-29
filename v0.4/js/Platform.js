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
class MovingPlatform {
	constructor(wh, dest1, dest2, framesToMove, waitTime, friction=true) {
		this.w = wh[0];
		this.h = wh[1];
		this.dest1 = dest1; //the start of the path
		this.dest2 = dest2; //the end of the path
		this.x = dest1[0];
		this.y = dest1[1];
		this.dx = this.x;
		this.dy = this.y;
		
		this.framesToMove = framesToMove; //how many frames it takes to move from dest1 to dest2
		this.xPerFrame = (this.dest2[0]-this.dest1[0])/this.framesToMove;
		this.yPerFrame = (this.dest2[1]-this.dest1[1])/this.framesToMove;
		
		this.waitTime = waitTime; //the amount of frames the platform waits at the end
		this.currWait = waitTime; //the current frame of waiting
		this.hasFriction = friction;
		
		this.playerOnTop = false;
		
		this.color = "#FFFF00";
	}
	move() {
		if (this.currWait == 0) {
			this.x += this.xPerFrame;
			this.y += this.yPerFrame;
			
			if (this.playerOnTop) {
				player.x += this.xPerFrame;
				player.y += this.yPerFrame;
				this.playerOnTop = false;
			}
		}
		if (this.currWait > 0) {
			this.currWait -= 1;
		}
		
		if (this.xPerFrame>0 && this.x>=this.dest1[0] && this.x>=this.dest2[0]) {
			//if moving in pos direction and is more than both dest
			if (this.dest1[0]>this.dest2[0]) { //if dest1 is bigger then dest1 has just been passed
				this.x = this.dest1[0];
			} else {
				this.x = this.dest2[0];
			}
			this.currWait = this.waitTime;
			this.xPerFrame *= -1;
			this.yPerFrame *= -1;
		}
		if (this.xPerFrame<0 && this.x<=this.dest1[0] && this.x<=this.dest2[0]) {
			//if moving in neg direction and is less than both dest
			if (this.dest1[0]<this.dest2[0]) {
				this.x = this.dest1[0];
			} else {
				this.x = this.dest2[0];
			}
			this.currWait = this.waitTime;
			this.xPerFrame *= -1;
			this.yPerFrame *= -1;
		}
		//below is not needed
		
		/*if (this.yPerFrame>0 && this.y>=this.dest1[1] && this.y>=this.dest2[1]) {
			if (this.dest1[1]>this.dest2[1]) {
				this.y = this.dest1[1];
			} else {
				this.y = this.dest2[1];
			}
			this.xPerFrame *= -1;
			this.yPerFrame *= -1;
			console.log("y just switched");
			console.log(this.x+", "+this.y);
		}
		if (this.yPerFrame<0 && this.y<=this.dest1[1] && this.y<=this.dest2[1]) {
			if (this.dest1[1]<this.dest2[1]) {
				this.y = this.dest1[1];
			} else {
				this.y = this.dest2[1];
			}
			this.xPerFrame *= -1;
			this.yPerFrame *= -1;
			console.log("y just switched");
			console.log(this.x+", "+this.y);
		}*/
	}
	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.dx, this.dy, this.w, this.h);
	}
}