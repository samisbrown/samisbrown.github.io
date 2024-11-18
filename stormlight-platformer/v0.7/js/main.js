/*var avrgFPS = 0;
var allFPS = [];*/
function gameLoop() {
	//getting fps
	if (!mainMenuVisible && !pauseMenuVisible) { //only runs game if not in main or pause menu
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
		//////	Update player and game positions
		if (!camera.panning) { //if the camera is panning freezes the player
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
		player.checkLimits(); //check if player is within the level bounds
		checkpoints.forEach(function(point) { //check collisions with checkpoints
			if (simpleCollide(player, point) && !point.checked) {
				point.check(); //get the checkpoint
			}
		});
		//	attempt to move camera and update xs and ys on screen
		camera.update();
		camera.reposition();
		//render
		ctx.clearRect(0, 0, _SIZE[0], _SIZE[1]);
		if (settings.rotateScreenWhenLash) {
			ctx.save();
			ctx.translate(player.dx+player.w/2, player.dy+player.h/2); //prolly wont work if player not centered
			switch (player.lashing.direction) {
				case "left":
					ctx.rotate(3*Math.PI/2);
					break;
				case "up":
					ctx.rotate(Math.PI);
					break;
				case "right":
					ctx.rotate(Math.PI/2);
					break;
			}
			ctx.translate(-player.dx-player.w/2, -player.dy-player.h/2);
		}
		platforms.forEach(function(plat) {plat.draw();});
		checkpoints.forEach(function(point) {point.draw();});
		levelBounds.forEach(function(bound) {bound.draw();});
		
		ctx.restore();
		player.draw();
		stormlight.draw();
	}
}
window.addEventListener('load', function() {
	setInterval(gameLoop, 17); //16.66667 makes no difference to fps
});
//on average 58.977 fps round to 59