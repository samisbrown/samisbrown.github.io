var c = document.getElementById("game");
var ctx = c.getContext("2d");

var lastLoop = new Date(); //for fps
var _FPS = 0;

var _SIZE = [c.width, c.height];
var player = new Player([400, 1125, 50, 75], [0, 0, 1700, 1800]);
var platforms = [new Platform(200, 1200, 150, 50), 
				new Platform(210, 1080, 140, 200),
				new Platform(211, 800, 150, 50),
				new Platform(500, 1350, 150, 50)];
var levelBounds = [new LevelBorder(0, 0, 200, 1401), //1401 for visual glitch; pixel missing
				new LevelBorder(0, 1400, 1600, 200)];
var camera = new Camera([0, 800], [200, 100, 800, 600]);

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