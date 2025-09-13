const c = document.getElementById("game");
var ctx = c.getContext("2d");

//var _SIZE = [c.width, c.height];

//Load Images
const IMG_PATH = "./";
const IMG_FILE_TYPE = ".png";
const num_imgs = 12;
var imgs_loaded = 0;
var imgs = [];
for (let i = 1; i < num_imgs+1; i++) {
	let temp = new Image();
	temp.src = IMG_PATH+i+IMG_FILE_TYPE;
	temp.onload = function() {
		imgs_loaded++; //increment imgs_loaded, once same as num_imgs, we done!
		if (imgs_loaded === num_imgs) {
			init();
		}
	};
	imgs.push(temp);
}

//Colours
var tile_colours = ["#AFC555", "#9CB549"];
var revealed_tile_colours = ["#82502D", "#724829"];
var tile_border_colour = "#FF0000";


//Game variables
var num_mines = 50;
var size = 20;
//const line_width = 3;
var game_over = false;
var game_won = false;
var cell_size = {
	width: c.width/size,
	height: c.height/size
};
var mine_bitmap = [];
var flag_bitmap = []; 
var board = []; //used for all the numbers

//Timer Variables
const timer_element_s = document.getElementById("timer-s");
const timer_element_ms = document.getElementById("timer-ms");
var interval = -1;
var timer_start = 0;

//Flag Counting variables
var flag_element_num = document.getElementById("flagCount");
var num_flags = 0;

//Sliders
const window_size_slider = document.getElementById("window-slider");
const board_size_slider = document.getElementById("board-slider");
const mine_ratio_slider = document.getElementById("mine-ratio-slider");
const num_mines_slider = document.getElementById("num-mines-slider");
const window_size_text = document.getElementById("window-text");
const board_size_text = document.getElementById("board-text");
const mine_ratio_text = document.getElementById("mine-ratio-text");
const num_mines_text = document.getElementById("num-mines-text");
//Slider update functions
window_size_slider.oninput = function() {
	window_size_text.innerHTML = this.value;
	c.width = this.value;
	c.height = this.value;
	const info_element = document.getElementById("info");
	info_element.style.left = c.width+"px";
	init();
	reveal_all();
	draw_all_tile_borders();
}
board_size_slider.oninput = function() {
	board_size_text.innerHTML = this.value;
	size = parseInt(this.value);
	num_mines = parseInt(size*size*mine_ratio_slider.value);
	num_mines_slider.value = num_mines;
	num_mines_slider.max = mine_ratio_slider.max*size*size;
	num_mines_text.innerHTML = num_mines;
	reset();
	init();
}
mine_ratio_slider.oninput = function() {
	mine_ratio_text.innerHTML = this.value;
	num_mines = parseInt(size*size*this.value);
	num_mines_slider.value = num_mines;
	num_mines_slider.max = mine_ratio_slider.max*size*size;
	num_mines_text.innerHTML = num_mines;
	reset();
	init();
}
num_mines_slider.oninput = function() {
	num_mines_text.innerHTML = this.value;
	num_mines = parseInt(this.value);
	mine_ratio_slider.value = num_mines/(size*size);
	mine_ratio_text.innerHTML = num_mines/(size*size);
	reset();
	init();
}

function randint(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function reset()
{
	game_over = false;
	game_won = false;
	//Reset Timer
	clearInterval(interval);
	timer_element_ms.innerHTML = "000";
	timer_element_s.innerHTML = 0;
	//Reset Flags
	num_flags = 0;
	flag_element_num.innerHTML = 0;
	mine_bitmap = [];
	flag_bitmap = []; 
	board = []; 
}

function init()
{
	//console.log("ALL LOADED!");
	//num_mines = 50;
	//size = 20;
	
	cell_size = {
		width: c.width/size,
		height: c.height/size
	};
	draw_board();
}

function init_board(xy)
{	
	for (let i = 0; i < size; i++) {
		flag_bitmap.push(Array(size).fill(false));
		mine_bitmap.push(Array(size).fill(false));
		board.push(Array(size).fill(-1)); //-1 means not revealed
	}
	let mines_added = 0;
	while (mines_added < num_mines) {
		mine_x = randint(0, size-1);
		mine_y = randint(0, size-1);
		if (!mine_bitmap[mine_y][mine_x] && (mine_x < xy.x-1 || mine_x > xy.x+1 || mine_y < xy.y-1 || mine_y > xy.y+1)) {
			mine_bitmap[mine_y][mine_x] = true;
			mines_added++;
		}
	}
	num_flags = num_mines;
	flag_element_num.textContent = num_flags;
	timer_start = Date.now();
	interval = setInterval(() => {
		let time_passed = Date.now() - timer_start;
		let s = Math.floor(time_passed/1000);
		let ms = time_passed % 1000;
		timer_element_s.textContent = s;
		timer_element_ms.textContent = ms.toString().padStart(3, "0");
	}, 10);
		
}

function reveal_all()
{
	//This function is used to reveal the board given what is seen in the "board" variable
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			//for each tile
			let real_x = x*cell_size.width;
			let real_y = y*cell_size.height;
			ctx.fillStyle = revealed_tile_colours[(x+y)%2];
			if (board[y][x] == 0) {
				ctx.fillRect(real_x, real_y, cell_size.width, cell_size.height);
				continue;
			}	
			if (board[y][x] > 0) {
				ctx.fillRect(real_x, real_y, cell_size.width, cell_size.height);
				ctx.drawImage(imgs[board[y][x]-1], real_x, real_y, cell_size.width, cell_size.height);	
				continue;
			}
			if (flag_bitmap[y][x] && !game_over) {
				ctx.drawImage(imgs[9], real_x, real_y, cell_size.width, cell_size.height);
				continue;
			}
		}
	}
	if (game_over) {
		end_game(game_won);
	}
}
function recursive_reveal(x, y)
{
	let num = 0;
	for (let yo = y-1; yo < y+2; yo++) {
		if (yo < 0 || yo > size-1) continue;
		for (let xo = x-1; xo < x+2; xo++) {
			if (xo < 0 || xo > size-1) continue;
			if (mine_bitmap[yo][xo]) num++;
		}
	}
	board[y][x] = num;
	if (num == 0) {
		for (let yo = y-1; yo < y+2; yo++) {
			if (yo < 0 || yo > size-1) continue;
			for (let xo = x-1; xo < x+2; xo++) {
				if (xo < 0 || xo > size-1) continue;
				if (board[yo][xo] == -1) recursive_reveal(xo, yo);
			}
		}
	}
	flag_bitmap[y][x] ? board[y][x] = -1 : reveal(x, y);
}

/*function tile_border(x, y, side)
{
	//function to draw border at x, y on the side "side" (side indexes on the arrays below)
	const line_width = 4;
	const line_path = [[1, 0], [1, 1], [0, 1], [0, 0]];
	const corner_offsets = [[0, -line_width/2], [line_width/2, 0], [0, line_width/2], [-line_width/2, 0]];
	//corner_offsets is yo we can draw the corners of the border
	/*TR-BR:
	x y-w -> x y+w
	BR-BL:
	x+w y -> x-w y
	BL-TL:
	x y+w -> x y-w
	TL-TR:
	x-w y -> x+w y*//*
	if (x < 0 || x >= size || y < 0 || y >= size) return;
	//if (board[y][x] >= 0) return;
	let line_start = {
		x: line_path[side][0]*cell_size.width+corner_offsets[side][0], 
		y: line_path[side][1]*cell_size.height+corner_offsets[side][1]
	};
	let line_end = {
		x: line_path[(side+1)%4][0]*cell_size.width-corner_offsets[side][0], 
		y: line_path[(side+1)%4][1]*cell_size.height-corner_offsets[side][1]
	};
	
	ctx.strokeStyle = tile_border_colour;
	ctx.lineWidth = line_width;
	ctx.beginPath();
	ctx.moveTo(x*cell_size.width+line_start.x, y*cell_size.height+line_start.y);
	ctx.lineTo(x*cell_size.width+line_end.x, y*cell_size.height+line_end.y);
	ctx.stroke();	
}

function adjacent_tile_borders(x, y)
{
	const adjacents = [[-1, 0], [0, -1], [1, 0], [0, 1]];
	for (let i = 0; i < 4; i++) {
		let tile = {x: x+adjacents[i][0], y: y+adjacents[i][1]};
		if (tile.x < 0 || tile.x >= size || tile.y < 0 || tile.y >= size) continue;
		if (game_over && mine_bitmap[tile.y][tile.x]) continue;
		if (board[tile.y][tile.x] == -1) tile_border(tile.x, tile.y, i);
	}
}

function surrounding_tile_borders(x, y)
{
	//const offsets = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];
	for (let yo = -1; yo < 2; yo++) {
		for (let xo = -1; xo < 2; xo++) {
			let tile = {x: x+xo, y: y+yo};
			if (tile.x < 0 || tile.x >= size || tile.y < 0 || tile.y >= size) continue;
			if (board[tile.y][tile.x] >= 0) adjacent_tile_borders(tile.x, tile.y);
		}
	}
}

function draw_all_tile_borders() {
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if (board[y][x] >= 0) adjacent_tile_borders(x, y);
			//draw the tile borders around the mines if the game is over
			if (game_over && mine_bitmap[y][x]) {
				const adjacents = [[-1, 0], [0, -1], [1, 0], [0, 1]];
				for (let i = 0; i < 4; i++) {
					let tile = {x: x+adjacents[i][0], y: y+adjacents[i][1]};
					if (tile.x < 0 || tile.x >= size || tile.y < 0 || tile.y >= size) continue;
					if (board[tile.y][tile.x] == -1 && !mine_bitmap[tile.y][tile.x]) tile_border(x, y, (i+2)%4);
				}
			}
		}
	}
}

function clear_tile_borders(x, y)
{
	//Clears the tile borders in the 8 tiles around this one, by redrawing the 8 tiles around this one.
	for (let yo = -1; yo < 2; yo++) {
		for (let xo = -1; xo < 2; xo++) {
			if (yo == 0 && xo == 0) continue;
			let tile = {x: x+xo, y: y+yo};
			if (tile.x < 0 || tile.x >= size || tile.y < 0 || tile.y >= size) continue;
			if (board[tile.y][tile.x] >= 0) draw_tile(tile.x, tile.y);
		}
	}	
}*/

function iterative_reveal(x, y)
{
	let stack = [{x:x, y:y}];
	let revealed_tiles = [{x:x, y:y}];
	while (stack.length > 0) {
		let temp = stack.pop();
		let x = temp.x;
		let y = temp.y;
		
		let num = 0;
		for (let yo = y-1; yo < y+2; yo++) {
			if (yo < 0 || yo > size-1) continue;
			for (let xo = x-1; xo < x+2; xo++) {
				if (xo < 0 || xo > size-1) continue;
				if (mine_bitmap[yo][xo]) num++;
			}
		}
		board[y][x] = num;
		if (num == 0) {
			for (let yo = y-1; yo < y+2; yo++) {
				if (yo < 0 || yo > size-1) continue;
				for (let xo = x-1; xo < x+2; xo++) {
					if (xo < 0 || xo > size-1) continue;
					if (board[yo][xo] == -1) {
						stack.push({x:xo, y:yo});
						revealed_tiles.push({x:xo, y:yo});
					}
				}
			}
		}
		flag_bitmap[y][x] ? board[y][x] = -1 : reveal(x, y);
	}
	for (let i = 0; i < revealed_tiles.length; i++) {
		clear_tile_borders(revealed_tiles[i].x, revealed_tiles[i].y);
	}
	while (revealed_tiles.length > 0) {
		let tile = revealed_tiles.pop();
		//adjacent_tile_borders(tile.x, tile.y);
		surrounding_tile_borders(tile.x, tile.y);
	}
}

function draw_tile(x, y)
{
	ctx.fillStyle = revealed_tile_colours[(x+y)%2];
	let real_x = x*cell_size.width;
	let real_y = y*cell_size.height;
	ctx.fillRect(real_x, real_y, cell_size.width, cell_size.height);
	let num = board[y][x];
	if (num > 0) ctx.drawImage(imgs[num-1], real_x, real_y, cell_size.width, cell_size.height);	
}

function reveal(x, y)
{
	if (mine_bitmap[y][x]) {
		//Reveal a mine; Lose game
		//ctx.drawImage(imgs[8], real_x, real_y, cell_size.width, cell_size.height);
		end_game(false);
	} else {
		draw_tile(x, y);
	}
}

function flag(x, y)
{
	flag_bitmap[y][x] ? num_flags++ : num_flags--;
	if (num_flags == -1) {
		num_flags = 0;
		return;
	}
	flag_element_num.textContent = num_flags;
	flag_bitmap[y][x] = !flag_bitmap[y][x];
	let real_x = x*cell_size.width;
	let real_y = y*cell_size.height;
	ctx.fillStyle = tile_colours[(x+y)%2];
	ctx.fillRect(real_x, real_y, cell_size.width, cell_size.height);
	if (flag_bitmap[y][x]) ctx.drawImage(imgs[9], real_x, real_y, cell_size.width, cell_size.height);
	//redraw borders
	const adjacents = [[-1, 0], [0, -1], [1, 0], [0, 1]];
	for (let i = 0; i < 4; i++) {
		let tile = {x: x+adjacents[i][0], y: y+adjacents[i][1]};
		if (tile.x < 0 || tile.x >= size || tile.y < 0 || tile.y >= size) continue;
		if (board[tile.y][tile.x] >= 0) tile_border(x, y, (i+2)%4);
	}
}

function draw_board()
{
	//draw initial board
	//width
	ctx.fillStyle = tile_colours[0];
	ctx.fillRect(0, 0, c.width, c.height);
	ctx.fillStyle = tile_colours[1];
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if ((x+y)%2 == 1) ctx.fillRect(x*cell_size.width, y*cell_size.height, cell_size.width, cell_size.height);
		}
	}
}

function check_win()
{
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if (board[y][x] == -1 && !mine_bitmap[y][x]) return false;
		}
	}
	end_game(true);
}

function end_game(win)
{
	game_won = win;
	game_over = true;
	clearInterval(interval);
	//Reveal mines and check flags
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			let real_x = x*cell_size.width;
			let real_y = y*cell_size.height;
			if (mine_bitmap[y][x] && flag_bitmap[y][x]) {// && board[y][x] == -1) {
				//Flag good
				ctx.drawImage(imgs[10], real_x, real_y, cell_size.width, cell_size.height);
			} else if (!mine_bitmap[y][x] && flag_bitmap[y][x]) {
				//Flag bad
				ctx.drawImage(imgs[11], real_x, real_y, cell_size.width, cell_size.height);
			} else if (mine_bitmap[y][x]) {
				//reveal mine
				clear_tile_borders(x, y);
				ctx.fillStyle = revealed_tile_colours[x+y%2];
				ctx.fillRect(real_x, real_y, cell_size.width, cell_size.height);
				ctx.drawImage(imgs[8], real_x, real_y, cell_size.width, cell_size.height);
			}
		}
	}
	//Below is horrible code, but shut up? lmao
	/*game_over = false;
	reveal_all();
	game_over = true;*/
	draw_all_tile_borders();
	//Draw text
	ctx.font = c.width/10+"px Arial";
	ctx.textAlign = "center";
	if (win) {
		//Shadow
		ctx.fillStyle = "#008800";
		ctx.fillText("You Win!", c.width / 2 + c.width / 250, c.height / 2 + c.height / 250);
		//Front
		ctx.fillStyle = "#00CC00";
		ctx.fillText("You Win!", c.width / 2, c.height / 2);
	} else {
		//Shadow
		let msg = "You Lose!";
		if (randint(1, 100) <= 5) {
			let random_messages = ["Kill Yourself!", "You Suck!", "L Bozo!", "Mineshitter!", "Fuck You.", "Sweep Deez Nuts!", "Jeffery Epstein didn't kill himself."];
			msg = random_messages[randint(0, random_messages.length-1)];
			if (msg.length >= 25) {
				let space = msg.slice(0, 25).lastIndexOf(" ");
				let top_text = msg.slice(0, space);
				msg = msg.slice(space+1, msg.length);
				//Top text Shadow
				ctx.fillStyle = "#880000";
				ctx.fillText(top_text, c.width / 2 + c.width / 250, c.height / 2 + c.height / 250 - c.height / 10);
				//Top text Front
				ctx.fillStyle = "#CC0000";
				ctx.fillText(top_text, c.width / 2, c.height / 2 - c.height / 10);
			}
		}
		ctx.fillStyle = "#880000";
		ctx.fillText(msg, c.width / 2 + c.width / 250, c.height / 2 + c.height / 250);
		//Front
		ctx.fillStyle = "#CC0000";
		ctx.fillText(msg, c.width / 2, c.height / 2);
	}
	//Shadow
	ctx.fillStyle = "#888888";
	ctx.fillText("Click to play again.", c.width / 2 + c.width / 250, c.height / 2  + c.height / 250 + c.height / 10);
	//Front
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Click to play again.", c.width / 2, c.height / 2 + c.height / 10);
}

function real_to_array(click_xy)
{
	return {x: Math.floor(size*click_xy.x/c.width), y: Math.floor(size*click_xy.y/c.height)};
}

//Left Click
c.addEventListener("click", function(event){
	let rect = event.target.getBoundingClientRect();
	let mouse = {
		x: Math.floor(event.clientX-rect.left-event.target.clientLeft), 
		y: Math.floor(event.clientY-rect.top-event.target.clientTop)
	};
	//console.log("left", mouse, real_to_array(mouse), event);
	let pos = real_to_array(mouse);
	if (!game_over) {
		if (mine_bitmap.length === 0) {
			init_board(real_to_array(mouse));
			//recursive_reveal(pos.x, pos.y);
			iterative_reveal(pos.x, pos.y);
			check_win();
		} else {
			if (flag_bitmap[pos.y][pos.x] || board[pos.y][pos.x] >= 0) {
				return;
			}
			//update_board(real_to_array(mouse));
			//recursive_reveal(pos.x, pos.y);
			iterative_reveal(pos.x, pos.y);
			check_win();
		}
	} else { 
		reset();
		init();
	}
});

//Right Click
c.addEventListener("contextmenu", function(event){
	let rect = event.target.getBoundingClientRect();
	let mouse = {
		x: Math.floor(event.clientX-rect.left-event.target.clientLeft), 
		y: Math.floor(event.clientY-rect.top-event.target.clientTop)
	};
	//console.log("right", mouse, real_to_array(mouse), event);
	let pos = real_to_array(mouse);
	if (!game_over && board[pos.y][pos.x] == -1) {
		flag(pos.x, pos.y);
	}
});