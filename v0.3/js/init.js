var c = document.getElementById("game");
var ctx = c.getContext("2d");

var lastLoop = new Date(); //for fps
var _FPS = 0;

var _SIZE = [c.width, c.height];
var player = new Player([300, 1125, 50, 75], [0, 0, 2000, 1800]);
var platforms = [new Platform(600, 1040, 50, 360),
				new Platform(600, 400, 50, 560), 
				new Platform(900, 1040, 50, 360),
				new Platform(900, 400, 50, 560),
				new Platform(1500, 1100, 200, 50),
				new Platform(1400, 800, 400, 50),
				new Platform(1900, 1100, 5, 5),
				new Platform(200, 400, 1000, 50),
				new Platform(1200, 447, 3, 3),
				new MovingPlatform([200, 75], [400, 1400], [1100, 1400], 300, 0)];
var levelBounds = [new LevelBorder(0, 0, 200, 1600), //1401 for visual glitch; pixel missing
				new LevelBorder(0, 1400, 400, 200),
				new LevelBorder(0, 0, 2200, 200),
				new LevelBorder(2000, 0, 200, 1600)];
var camera = new Camera([0, 800], [0, 0, 0, 0], centerAroundPlayer=true); //[200, 100, 800, 600]

var _KEYS = {"KeyA": false, "KeyD": false, "KeyW": false, "Space": false};

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