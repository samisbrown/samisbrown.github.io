class Animation {
	constructor(spritesheet, startSprite, endSprite, framesPerSprite, loop=true) {
		this.spritesheet = spritesheet;
		this.start = startSprite; //the start frame of the animation
		this.end = endSprite; //the end frame of the animation
		this.framesPerSprite = framesPerSprite; //the amount of frames each sprite in the animation are on-screen for
		this.loop = loop; //if the animation is infinite or not
		
		this.changeFrame = framesPerSprite; //once this reaches 0 sprite changes to next
		this.currentSprite = startSprite;
	}
	draw(x, y) {
		if (this.changeFrame == 0) {
			this.changeFrame = this.framesPerSprite+1; //+1 because it gets minused at the bottom
			this.currentSprite += 1;
			if (this.currentSprite > this.end && this.loop) {
				this.currentSprite = this.start;
			}
		}
		this.spritesheet.drawSprite(this.currentSprite, x, y);
		this.changeFrame--;
	}
}