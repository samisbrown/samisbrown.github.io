var c = document.getElementById("game");
var ctx = c.getContext("2d");

var _SIZE = [c.width, c.height];
var player = new Player(350, 350, 50, 75);
var platforms = [new Platform(200, 500, 150, 50), 
				new Platform(210, 380, 140, 200),
				new Platform(211, 100, 150, 50),
				new Platform(500, 650, 150, 50)];
var levelBounds = [new LevelBorder(-200, -700, 200, 1400),
				new LevelBorder(-200, 700, 1600, 200)]
var camera = new Camera([200, 100, 500, 600]);

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