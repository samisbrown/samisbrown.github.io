/*var avrgFPS = 0;
var allFPS = [];*/
function gameLoop() {
	//getting fps
	var thisLoop = new Date();
	_FPS = 1000/(thisLoop-lastLoop);
	lastLoop = thisLoop;
	/*allFPS.push(_FPS);
	allFPS.forEach(function(i) {
		avrgFPS += i;
	});
	avrgFPS = avrgFPS/allFPS.length;*/
	
	//Input handling
	player.handleInputs();
	//logic
	//	Update player positions
	if (!camera.panning) { //if the camera is panning, freezes the player
		platforms.forEach(function(plat) { //move all moving platforms
			if (plat.constructor.name == "MovingPlatform") {
				plat.move();
			};
		});
		
		player.updateY(); //levelBounds first and last so its prioritized
		levelBounds.forEach(function(bound) {player.playerCollideY(bound);});
		platforms.forEach(function(plat) {player.playerCollideY(plat);});
		levelBounds.forEach(function(bound) {player.playerCollideY(bound);});
		player.updateX();
		levelBounds.forEach(function(bound) {player.playerCollideX(bound);});
		platforms.forEach(function(plat) {player.playerCollideX(plat);});
		levelBounds.forEach(function(bound) {player.playerCollideX(bound);});
	}
	
	player.checkLimits();
	//	attempt to move camera and update xs and ys on screen
	camera.update();
	camera.reposition();
	//render
	ctx.clearRect(0, 0, _SIZE[0], _SIZE[1]);
	platforms.forEach(function(plat) {plat.draw();});
	levelBounds.forEach(function(bound) {bound.draw();});
	player.draw();
}
setInterval(gameLoop, 17); //16.66667 makes no difference to fps
//on average 58.977 fps round to 59