var c = document.getElementById("game");
var ctx = c.getContext("2d");

var lastLoop = new Date(); //for fps
var _FPS = 0;

var _SIZE = [c.width, c.height];
var player = new Player([300, 1125, 32, 32], [0, 0, 3800, 1600], 1);
var stormlight = new HUD.Stormlight("./Assets/stormlightspritesheet.png", "./Assets/stormlightborder.png", player.totalLashes);
var platforms = [new TextObject([400, 1200], "Use A and D to move\nleft and right", 30, "Calibri", "#000000"),
				new TextObject([1075, 1150], "Press W or Spacebar to jump", 30, "Calibri", "#000000"),
				new Platform(1000, 1250, 150, 150),
				new TextObject([1700, 1200], "Use the arrow keys to Lash yourself\nin different directions", 30, "Calibri", "#000000"),
				new TextObject([1900, 1100], String.fromCharCode(8593), 50, "Calibri", "#000000"),
				new Platform(2000, 700, 300, 700),
				new Platform(1700, 200, 100, 900),
				new TextObject([2100, 300], "You can still jump and\nmove left and right while\nLashed", 30, "Calibri", "#000000"),
				new Platform(2500, 400, 100, 25),
				new Platform(2800, 600, 100, 25),
				new TextObject([2850, 750], "The bar at the bottom shows how much\nstormlight you have left. When you\nmake a Lashing, you use up\na bit of stormlight", 30, "Calibri", "#000000"),
				new Platform(2450, 900, 100, 25),
				new Platform(2525, 1100, 100, 25),
				new MovingPlatform([100, 25], [2625, 1100], [3500, 1100], 180, 240),
				new TextObject([3200, 1300], "Looks like you've used up all\nyour stormlight. This means you\ncan't create anymore Lashings", 30, "Calibri", "#000000"),
				
				];
var levelBounds = [new LevelBorder(0, 0, 200, 1600), //1401 for visual glitch; pixel missing
				new LevelBorder(0, 1400, 3800, 200),
				new LevelBorder(0, 0, 3800, 200),
				new LevelBorder(3600, 0, 200, 1125)];
var camera = new Camera([0, 800], [0, 0, 0, 0], centerAroundPlayer=true); //[200, 100, 800, 600]

var _KEYS = {"KeyA": false, "KeyD": false, "KeyW": false, "Space": false,
			"ArrowLeft": false, "ArrowRight": false, "ArrowUp": false, "ArrowDown": false};

document.addEventListener('keydown', function(key) {
	_KEYS[key.code] = true;
});
document.addEventListener('keyup', function(key) {
	_KEYS[key.code] = false;	
});

function simpleCollide(obj1, obj2) {
	//top of obj 1 and bot of 2
	if (obj1.y<obj2.y+obj2.h && obj1.y+obj1.h>obj2.y && obj1.x<obj2.x+obj2.w && obj1.x+obj1.w>obj2.x) {
		console.log("collision occured");
	}
}
console.log("initialized");