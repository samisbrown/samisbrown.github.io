class HUD {}
HUD.Stormlight = class {
	constructor(src_spritesheet, border) {
		this.w = 512;
		this.h = 64;
		this.x = _SIZE[0]/2-this.w/2;
		this.y = _SIZE[1]-this.h-20;
		this.hb = 12; //horizontal and vertical buffer, for the empty bar
		this.vb = 12;
		this.borderImg = new Image();
		this.borderImg.src = border;
		this.empty = {
			x: this.x+this.w-this.hb,
			y: this.y+this.vb,
			w: 0,
			h: this.h-this.vb*2,
			wmax: 0,
			xmin: this.x+this.w-this.hb,
			color: "#666666"
		}
		this.spritesheet = new Spritesheet(src_spritesheet, [this.w, this.h]);//128 16 is the manual width and height of each img in sprtsht
		this.animation = new Animation(this.spritesheet, 0, 23, 3);
	}
	setLashCount(lashes) {
		this.totalCapacity = lashes; //total lashes allowed
		this.capacity = lashes; //how many times the player can lash left		
	}
	useLash() {
		if (this.capacity>0) {
			this.capacity -= 1
		}
		
		this.empty.wmax = (this.w-this.hb*2)/this.totalCapacity*(this.totalCapacity-this.capacity);
		this.empty.xmin = this.x+this.hb+(this.w-this.hb*2)/this.totalCapacity*this.capacity;
	}
	draw() {
		if (this.empty.w < this.empty.wmax) {
			this.empty.w++;
		} if (this.empty.x > this.empty.xmin) {
			this.empty.x--;
		}
		this.animation.draw(this.x, this.y);
		ctx.fillStyle = this.empty.color;
		ctx.fillRect(this.empty.x, this.empty.y, this.empty.w, this.empty.h);
		ctx.drawImage(this.borderImg, this.x, this.y);
	}
}
class GUI {}
GUI.Menu = class {}
GUI.Menu.changeTo = function (menuName) {
	switch (menuName) {
		case "mainmenu":
			menu.innerHTML = '<button onclick=\'GUI.Menu.changeTo("levelselect_tut");\'>Play</button><button onclick=\'GUI.Menu.changeTo("settings");\'>Settings</button><button onclick=\'alert("click the red x\nlazy fucker");\'>Quit</button>';
			break;
		//#######################Level Selection Below
		case "levelselect_tut":
			//document.getElementById("menu").style.visibility = "hidden"; mainMenuVisible = false;
			menu.innerHTML = '<div style="width: 700px; height: 500px; background-color: #e4e4e4; border-radius: 16px; box-shadow: 6px 6px #555555;"><h1 style="margin: 40px; margin-bottom: 20px; user-select: none;">Level Selector</h1><h1 style="margin: 40px; margin-top: 20px; text-align: center; text-decoration: underline; user-select: none;">Tutorial</h1><div style="border-style: solid; border-color: #bbbbbb; border-radius: 16px; width: 600px; height: 300px; top: 150px; left: 40px; position: absolute; border-width: 10px;"><button width="50" height="50" onclick=\'chap_tut.levels[0].play();\'>1</button></div><svg width="30" height="100" style="position: absolute; top: 50%; margin-left: 5px;"><polygon points="0,50 20,100 30,96 12,50 30,4 20,0" style="fill: #888888;"></polygon></svg><svg width="30" height="100" style="cursor: pointer; position: absolute; top: 50%; right: 0px; margin-right: 5px;" onclick=\'GUI.Menu.changeTo("levelselect_chap1")\'><polygon points="30,50 10,100 0,96 18,50 0,4 10,0" style="fill: #000000;"></polygon></svg></div>';
			break;
		case "levelselect_chap1":
			menu.innerHTML = '<div style="width: 700px; height: 500px; background-color: #e4e4e4; border-radius: 16px; box-shadow: 6px 6px #555555;"><h1 style="margin: 40px; margin-bottom: 20px; user-select: none;">Level Selector</h1><h1 style="margin: 40px; margin-top: 20px; text-align: center; text-decoration: underline; user-select: none;">Chapter 1</h1><div style="border-style: solid; border-color: #bbbbbb; border-radius: 16px; width: 600px; height: 300px; top: 150px; left: 40px; position: absolute; border-width: 10px;"></div><svg width="30" height="100" style="cursor: pointer; position: absolute; top: 50%; margin-left: 5px;" onclick=\'GUI.Menu.changeTo("levelselect_tut")\'><polygon points="0,50 20,100 30,96 12,50 30,4 20,0" style="fill: #000000;"></polygon></svg><svg width="30" height="100" style="cursor: pointer; position: absolute; top: 50%; right: 0px; margin-right: 5px;" onclick=\'GUI.Menu.changeTo("levelselect_chap2")\'><polygon points="30,50 10,100 0,96 18,50 0,4 10,0" style="fill: #000000;"></polygon></svg></div>';
			break;
		case "levelselect_chap2":
			menu.innerHTML = '<div style="width: 700px; height: 500px; background-color: #e4e4e4; border-radius: 16px; box-shadow: 6px 6px #555555;"><h1 style="margin: 40px; margin-bottom: 20px; user-select: none;">Level Selector</h1><h1 style="margin: 40px; margin-top: 20px; text-align: center; text-decoration: underline; user-select: none;">Chapter 2</h1><div style="border-style: solid; border-color: #bbbbbb; border-radius: 16px; width: 600px; height: 300px; top: 150px; left: 40px; position: absolute; border-width: 10px;"></div><svg width="30" height="100" style="cursor: pointer; position: absolute; top: 50%; margin-left: 5px;" onclick=\'GUI.Menu.changeTo("levelselect_chap1")\'><polygon points="0,50 20,100 30,96 12,50 30,4 20,0" style="fill: #000000;"></polygon></svg><svg width="30" height="100" style="cursor: pointer; position: absolute; top: 50%; right: 0px; margin-right: 5px;" onclick=\'GUI.Menu.changeTo("levelselect_chap3")\'><polygon points="30,50 10,100 0,96 18,50 0,4 10,0" style="fill: #000000;"></polygon></svg></div>';
			break;
		case "levelselect_chap3":
			menu.innerHTML = '<div style="width: 700px; height: 500px; background-color: #e4e4e4; border-radius: 16px; box-shadow: 6px 6px #555555;"><h1 style="margin: 40px; margin-bottom: 20px; user-select: none;">Level Selector</h1><h1 style="margin: 40px; margin-top: 20px; text-align: center; text-decoration: underline; user-select: none;">Chapter 3</h1><div style="border-style: solid; border-color: #bbbbbb; border-radius: 16px; width: 600px; height: 300px; top: 150px; left: 40px; position: absolute; border-width: 10px;"></div><svg width="30" height="100" style="cursor: pointer; position: absolute; top: 50%; margin-left: 5px;" onclick=\'GUI.Menu.changeTo("levelselect_chap2")\'><polygon points="0,50 20,100 30,96 12,50 30,4 20,0" style="fill: #000000;"></polygon></svg><svg width="30" height="100" style="position: absolute; top: 50%; right: 0px; margin-right: 5px;"><polygon points="30,50 10,100 0,96 18,50 0,4 10,0" style="fill: #888888;"></polygon></svg></div>';
			break;
		//########################
		case "settings":
			contModeText = null;
			switch (settings.controlsMode) { //get text for button for auto or perspective
				case "auto":
					contModeText = "Auto";
					break;
				case "perspective":
					contModeText = "Perspective";
					break;
				case "directional":
					contModeText = "Directional";
					break;
			}
			rotScrnChecked = "";
			if (settings.rotateScreenWhenLash) {//true
				rotScrnChecked = "checked";
			} //else it will be = "" so it wont add the checked
			menu.innerHTML = '<div id="dropdown"><div id="dropdown-button">Rotate Screen When Lash</div><div id="dropdown-content"><div style="display: flex; flex-direction: column; align-items: center;"><a>This setting when turned on will rotate the screen when you lash.</a><label class="switch" style="margin: 10px;"><input type="checkbox" onclick=\'if (settings.rotateScreenWhenLash) {settings.rotateScreenWhenLash = false;} else {settings.rotateScreenWhenLash = true;}\' '+rotScrnChecked+'><span class="slider round"></span></label></div></div></div><div id="dropdown"><a>Controls Mode: </a><button style="font-size: 22px;" onclick=\'if (settings.controlsMode == "auto") {settings.controlsMode = "perspective";this.innerText = "Perspective";} else if (settings.controlsMode == "perspective") {settings.controlsMode = "directional";this.innerText = "Directional";} else {settings.controlsMode = "auto";this.innerText = "Auto";}\'>'+contModeText+'</button><div id="dropdown-content"><div style="display: flex; flex-direction: column;"><a style="font-size: 14px;">Perspective: The movement keys be consistent no matter where the player is; from their perspective. e.g. pressing a will always move the player to their left, not always left on the screen.</a><a style="font-size: 14px;">Directional: The movement keys will adjust to where the player is lashed. e.g. if the player is on the ground w will make them jump and if they are on the left wall w will make them walk up it.</a><a style="font-size: 14px;">Auto: !!!Recommended!!! Automatically determines which control settings to use based on the rotate screen when lash setting. If turned on will use perspective and if turned off will use directional. </a></div></div></div><button onclick=\'GUI.Menu.changeTo("mainmenu");\'>Back to Main Menu</button>'
			/*might input the button function instead of it being in the menu.innerHTML = statement
			test = function() {
				if (settings.controlsMode == "auto") {
					settings.controlsMode = "perspective";
					contMode.Drop.But.innerText = "Perspective";
				} else if (settings.controlsMode == "perspective") {
					settings.controlsMode = "directional";
					contMode.Drop.But.innerText = "Directional";
				} else {//== directional
					settings.controlsMode = "auto";
					contMode.Drop.But.innerText = "Auto";				
				}
			};*/
			break;
	}
}
/*GUI.Menu = class {
	constructor(name, objects, visible=false) {
		this.name = name;
		this.objects = objects;
		this.visible = visible;
		this.color = "#f7de97"
	}
	checkHover() {
		if (this.visible) {
			this.objects.forEach(function (obj) {
				try {
					if (mouse.x > obj.x && mouse.x < obj.x+obj.w && mouse.y > obj.y && mouse.y < obj.y+obj.h) { //check if mouse within bounds of obj
						obj.hover();
					} else {
						obj.unhover();
					}
				} catch (e) {
					if (!(e instanceof ReferenceError)) {
						console.error("error in GUI.Menu.checkHover():");
						throw e;
					} //else obj doesnt have .hover()
				}
			});
		}
	}
	checkClick() {
		if (this.visible) {
			this.objects.forEach(function (obj) {
				try {
					if (mouse.x > obj.x && mouse.x < obj.x+obj.w && mouse.y > obj.y && mouse.y < obj.y+obj.h && mouse.clicked) { //check if mouse within bounds of obj and clicked
						obj.clickOn();
						mouse.clicked = false; //so you have to physically reclick
					}
				} catch (e) {
					if (!(e instanceof ReferenceError)) {
						console.error("error in GUI.Menu.checkClick():");
						throw e;
					} //else obj doesnt have .clickOn()
				}
			});
		}
	}
	draw() {
		if (this.visible) {
			ctx.fillStyle = this.color;
			ctx.fillRect(0, 0, _SIZE[0], _SIZE[1]);
			this.objects.forEach(function (obj) {
				obj.draw()
			});
		}
	}
}
GUI.Button = class {
	constructor(xywh, text, click, textBuffer=10) {//pos and what clicking the button does
		this.x = xywh[0];
		this.y = xywh[1];
		this.w = xywh[2];
		this.h = xywh[3]; //finish this
		this.text = text;
		this.click = click;
		this.textBuffer = textBuffer;
		
		this.textCenter = true;
		this.borderSize = 5;
		
		this.borderColor = "#aa992a"; //all the colors
		this.color = "#997717";
		this.textColor = "#000000";
		
		this.maxSizeDecrease = 10;
		this.currentSizeDecrease = 0;
		this.sizeDecreaseAmount = 1;
		
		//get the prefered text size
		this.fontSize = 0;
		var i = 0;
		while (true) {
			ctx.font = i+"px Calibri";
			if (ctx.measureText(this.text).width > this.w || ctx.measureText(this.text).height > this.h) { //if the text obj is bigger than button
				this.fontSize = i-this.textBuffer;
				console.log(this.fontSize);
				break;
			}
			i++;
		}
		console.log(this.fontSize);
	
	}
	hover() {
		this.currentSizeDecrease += this.sizeDecreaseAmount;
		if (this.currentSizeDecrease > this.maxSizeDecrease) {
			this.currentSizeDecrease = this.maxSizeDecrease;
		}
		console.log("hovering");
	}
	unhover() {
		this.currentSizeDecrease -= this.sizeDecreaseAmount;
		if (this.currentSizeDecrease < 0) {
			this.currentSizeDecrease = 0;
		}		
	}
	clickOn() {
		console.log("Clicked!");
		console.log(this.click);
		switch (this.click) {
			case "test":
				this.x -= 2;
				this.y += 2;
				break;
		}
	}
	draw() {
		ctx.fillStyle = this.borderColor;
		ctx.fillRect(this.x+this.currentSizeDecrease, this.y+this.currentSizeDecrease, this.w-this.currentSizeDecrease*2, this.h-this.currentSizeDecrease*2);
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x+this.currentSizeDecrease+this.borderSize, this.y+this.currentSizeDecrease+this.borderSize, this.w-this.currentSizeDecrease*2-this.borderSize*2, this.h-this.currentSizeDecrease*2-this.borderSize*2);
		ctx.fillStyle = this.textColor;
		ctx.font = this.fontSize-this.currentSizeDecrease*2+"px Calibri";;
		if (this.textCenter) {
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
		}
		ctx.fillText(this.text, this.x+this.currentSizeDecrease+(this.w-this.currentSizeDecrease*2)/2, this.y+this.currentSizeDecrease+(this.h-this.currentSizeDecrease)/2); //this.y for text is for the bottom of the text?
	}
}*/
class Settings {
	constructor(rotateScreenWhenLash, controlsMode) {
		this.rotateScreenWhenLash = rotateScreenWhenLash;
		this.controlsMode = controlsMode;
				
	}
}