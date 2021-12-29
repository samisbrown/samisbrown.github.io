class HUD {}
HUD.Stormlight = class {
	constructor(src_spritesheet, border, lashes) {
		this.w = 512;
		this.h = 64;
		this.x = _SIZE[0]/2-this.w/2;
		this.y = _SIZE[1]-this.h-20;
		this.hb = 12; //horizontal and vertical buffer, for the empty bar
		this.vb = 12;
		this.borderImg = new Image();
		this.borderImg.src = border;
		this.empty = {
			x: this.x+this.w-this.hb,
			y: this.y+this.vb,
			w: 0,
			h: this.h-this.vb*2,
			wmax: 0,
			xmin: this.x+this.w-this.hb,
			color: "#666666"
		}
		this.totalCapacity = lashes; //total lashes allowed
		this.capacity = lashes; //how many times the player can lash left
		this.spritesheet = new Spritesheet(src_spritesheet, [this.w, this.h]);//128 16 is the manual width and height of each img in sprtsht
		this.animation = new Animation(this.spritesheet, 0, 23, 3);
	}
	useLash() {
		if (this.capacity>0) {
			this.capacity -= 1
		}
		
		this.empty.wmax = (this.w-this.hb*2)/this.totalCapacity*(this.totalCapacity-this.capacity);
		this.empty.xmin = this.x+this.hb+(this.w-this.hb*2)/this.totalCapacity*this.capacity;
	}
	draw() {
		if (this.empty.w < this.empty.wmax) {
			this.empty.w++;
		} if (this.empty.x > this.empty.xmin) {
			this.empty.x--;
		}
		this.animation.draw(this.x, this.y);
		ctx.fillStyle = this.empty.color;
		ctx.fillRect(this.empty.x, this.empty.y, this.empty.w, this.empty.h);
		ctx.drawImage(this.borderImg, this.x, this.y);
	}
}