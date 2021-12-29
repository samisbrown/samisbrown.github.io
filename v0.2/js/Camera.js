class Camera {
	constructor(xy, bounds) { //bounds min x min y max x max y
		this.x = xy[0];
		this.y = xy[1];
		
		this.test = 0;
		
		this.minx = bounds[0];
		this.miny = bounds[1];
		this.maxx = bounds[2];
		this.maxy = bounds[3];
		
		this.panning = false; //if the camera is currently panning to something
		this.destx = 0; //destination coords to pan to
		this.desty = 0;
		this.panx = 0; //amount of pixels to pan per frame
		this.pany = 0;
		this.panobj = NaN; //obj being panned to
	}
	center(player) {
		this.x = player.x+player.w/2-_SIZE[0]/2;
		this.y = player.y+player.h/2-_SIZE[1]/2;
	}
	update() {
		if (this.panning) {
			this.test += 1;
			this.x += this.panx;
			this.y += this.pany;
			if ((this.panx>0 && this.x>this.destx) || (this.panx<0 && this.x<this.destx)) {// && this.y == this.desty
				this.panning = false;
				this.center(this.panobj);
			}
		}
		//update all dx and dy
		player.dx = player.x-this.x;
		player.dy = player.y-this.y;
		platforms.forEach(function(obj) {obj.dx = obj.x-this.x;}.bind(this));
		platforms.forEach(function(obj) {obj.dy = obj.y-this.y;}.bind(this));
		levelBounds.forEach(function(obj) {obj.dx = obj.x-this.x;}.bind(this));
		levelBounds.forEach(function(obj) {obj.dy = obj.y-this.y;}.bind(this));		
	}
	panTo(obj, framesToPan) {
		this.panobj = obj;
		this.panning = true;
		this.destx = obj.x+obj.w/2-_SIZE[0]/2;
		this.desty = obj.y+obj.h/2-_SIZE[1]/2;
		this.panx = (this.destx-this.x)/framesToPan;
		this.pany = (this.desty-this.y)/framesToPan;
	}
	reposition() {
		if (!this.panning) {
			while (player.dx<this.minx) {
				this.x--;
				this.update();
			} while (player.dy<this.miny) {
				this.y--;
				this.update();
			} while (player.dx+player.w>this.maxx) {
				this.x++;
				this.update();
			} while (player.dy+player.h>this.maxy) {
				this.y++;
				this.update()
			}
		}
	}
}