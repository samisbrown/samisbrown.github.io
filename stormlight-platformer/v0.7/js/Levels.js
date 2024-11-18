class Chapter {
	constructor(levels) {
		this.levels = levels;
	}
}
class Level {
	constructor(player, platforms, levelBounds, checkpoints) {
		this.player = player;
		this.platforms = platforms;
		this.levelBounds = levelBounds;
		this.checkpoints = checkpoints;
	}
	play() {
		mainMenuVisible = false;
		menu.style.visibility = "hidden";
		player = this.player;
		platforms = this.platforms;
		levelBounds = this.levelBounds;
		checkpoints = this.checkpoints;
		stormlight.setLashCount(player.totalLashes);
	}
}