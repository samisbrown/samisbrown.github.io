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

//Game variables
var num_mines = 50;
var size = 20;
const line_width = 3;
var game_over = false;
var game_won = false;
var cell_size = {
	width: (c.width-(size+1)*line_width)/size,
	height: (c.height-(size+1)*line_width)/size
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
		width: (c.width-(size+1)*line_width)/size,
		height: (c.height-(size+1)*line_width)/size
	};
	draw_grid();
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
			let real_x = x*cell_size.width+(x+1)*line_width;
			let real_y = y*cell_size.height+(y+1)*line_width;
			ctx.fillStyle = "#9C9C9C";
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
	for (let sy = y-1; sy < y+2; sy++) {
		if (sy < 0 || sy > size-1) continue;
		for (let sx = x-1; sx < x+2; sx++) {
			if (sx < 0 || sx > size-1) continue;
			if (mine_bitmap[sy][sx]) num++;
		}
	}
	board[y][x] = num;
	if (num == 0) {
		for (let sy = y-1; sy < y+2; sy++) {
			if (sy < 0 || sy > size-1) continue;
			for (let sx = x-1; sx < x+2; sx++) {
				if (sx < 0 || sx > size-1) continue;
				if (board[sy][sx] == -1) recursive_reveal(sx, sy);
			}
		}
	}
	flag_bitmap[y][x] ? board[y][x] = -1 : reveal(x, y);
}

function reveal(x, y)
{
	ctx.fillStyle = "#9C9C9C";
	let real_x = x*cell_size.width+(x+1)*line_width;
	let real_y = y*cell_size.height+(y+1)*line_width;
	ctx.fillRect(real_x, real_y, cell_size.width, cell_size.height);
	let num = board[y][x];
	if (mine_bitmap[y][x]) {
		//Reveal a mine; Lose game
		ctx.drawImage(imgs[8], real_x, real_y, cell_size.width, cell_size.height);
		end_game(false);
	}
	else if (num > 0) ctx.drawImage(imgs[num-1], real_x, real_y, cell_size.width, cell_size.height);
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
	let real_x = x*cell_size.width+(x+1)*line_width;
	let real_y = y*cell_size.height+(y+1)*line_width;
	ctx.fillStyle = "#DCDCDC";
	ctx.fillRect(real_x, real_y, cell_size.width, cell_size.height);
	if (flag_bitmap[y][x]) ctx.drawImage(imgs[9], real_x, real_y, cell_size.width, cell_size.height);
}

function draw_grid()
{
	//drawing with lines on the outside aswell (like a border)
	//width
	ctx.fillStyle = "#DCDCDC";
	ctx.fillRect(0, 0, c.width, c.height);
	ctx.strokeStyle = "#BCBCBC";
	ctx.lineWidth = line_width;
	ctx.beginPath();
	for (let i = 0; i < size + 1; i++) {
		//Horizontal
		ctx.moveTo(0, i*cell_size.height+line_width*i+line_width/2);
		ctx.lineTo(c.width, i*cell_size.height+line_width*i+line_width/2);
		//Vertical
		ctx.moveTo(i*cell_size.width+line_width*i+line_width/2, 0);
		ctx.lineTo(i*cell_size.width+line_width*i+line_width/2, c.height);
	}
	ctx.stroke();
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
			let real_x = x*cell_size.width+(x+1)*line_width;
			let real_y = y*cell_size.height+(y+1)*line_width;
			if (mine_bitmap[y][x] && flag_bitmap[y][x]) {// && board[y][x] == -1) {
				//Flag good
				ctx.drawImage(imgs[10], real_x, real_y, cell_size.width, cell_size.height);
			} else if (!mine_bitmap[y][x] && flag_bitmap[y][x]) {
				//Flag bad
				ctx.drawImage(imgs[11], real_x, real_y, cell_size.width, cell_size.height);
			} else if (mine_bitmap[y][x]) {
				//reveal mine
				ctx.fillStyle = "#9C9C9C";
				ctx.fillRect(real_x, real_y, cell_size.width, cell_size.height);
				ctx.drawImage(imgs[8], real_x, real_y, cell_size.width, cell_size.height);
			}
		}
	}
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
			recursive_reveal(pos.x, pos.y);
			check_win();
		} else {
			if (flag_bitmap[pos.y][pos.x]) {
				return;
			}
			//update_board(real_to_array(mouse));
			recursive_reveal(pos.x, pos.y);
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