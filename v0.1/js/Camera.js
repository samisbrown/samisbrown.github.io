class Camera {
	constructor(bounds) { //bounds min x min y max x max y
		this.minx = bounds[0];
		this.miny = bounds[1];
		this.maxx = bounds[2];
		this.maxy = bounds[3];
	}
	center(plyr) {
		while (plyr.x+plyr.w/2<_SIZE[0]) {
			plyr.x++;
			plyr.respawn_point[0]++;
			platforms.forEach(function(obj) {obj.x++;}.bind(this));
		} while (plyr.x+plyr.w/2>_SIZE[0]) {
			plyr.x--;
			plyr.respawn_point[0]--;
			platforms.forEach(function(obj) {obj.x--;}.bind(this));
		} while (plyr.y+plyr.h/2<_SIZE[1]) {
			plyr.y++;
			plyr.respawn_point[1]++;
			platforms.forEach(function(obj) {obj.y++;}.bind(this));
		} while (plyr.y+plyr.h/2>_SIZE[1]) {
			plyr.y--;
			plyr.respawn_point[1]--;
			platforms.forEach(function(obj) {obj.y--;}.bind(this));
		}
	}
	reposition(plyr) {
		while (plyr.x<this.minx) {
			plyr.x++;
			plyr.respawn_point[0]++;
			platforms.forEach(function(obj) {obj.x++;}.bind(this));
		} while (plyr.y<this.miny) {
			plyr.y++;
			plyr.respawn_point[1]++;
			platforms.forEach(function(obj) {obj.y++;}.bind(this));
		} while (plyr.x+plyr.w>this.maxx) {
			plyr.x--;
			plyr.respawn_point[0]--;
			platforms.forEach(function(obj) {obj.x--;}.bind(this));
		} while (plyr.y+plyr.h>this.maxy) {
			plyr.y--;
			plyr.respawn_point[1]--;
			platforms.forEach(function(obj) {obj.y--;}.bind(this));
		}
	}
}