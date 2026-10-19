var c = document.getElementById("game");
var ctx = c.getContext("2d");

///////////////////////////////////////////
/////////////// VARIABLES
///////////////////////////////////////////
mousePos = {x: 0, y: 0};

/////////////////////////////////////////// 
/////////////// FUNCTIONS
///////////////////////////////////////////

function randint(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RainbowSegmentColor(index)
{
	const colors = ["#ff0000", "#ff8000", "#ffff00", "#00ff00", "#0000ff", "#8000ff"];
	return colors[index%6];
}

////////////////////////////////////////////
//////////////// CLASSES
////////////////////////////////////////////

class Vector2D
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
	static Zero()
	{
		return new Vector2D(0, 0);
	}
	
	Add(otherVec)
	{
		return new Vector2D(this.x + otherVec.x, this.y + otherVec.y);		
	}
	Subtract(otherVec)
	{
		return new Vector2D(this.x - otherVec.x, this.y - otherVec.y);
	}
	Mult(num)
	{
		return new Vector2D(this.x * num, this.y * num);
	}
	Divide(num)
	{
		return new Vector2D(this.x / num, this.y / num);
	}
	Dot(otherVec)
	{
		return this.x * otherVec.x + this.y * otherVec.y;
	}
	Length()
	{
		return Math.sqrt(this.LengthSqr());
	}
	LengthSqr()
	{
		return this.x*this.x + this.y*this.y;
	}	
}

class SnakeSegment
{
	static DISTANCE = 25;
	constructor(SnakeObj, index)
	{
		this.SnakeObj = SnakeObj;
		this.color = RainbowSegmentColor(index);
		this.radius = 10;
		this.position = new Vector2D(500, 500);
		this.velocity = Vector2D.Zero();
	}
	Update(deltaTime)
	{
		this.position = this.position.Add(this.velocity.Mult(deltaTime));
	}
	Render()
	{
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

class SnakeHead
{
	constructor(SnakeObj)
	{
		this.SnakeObj = SnakeObj;
		this.color = "#808080";
		this.radius = 15;
		this.position = new Vector2D(500, 500);
		this.velocity = Vector2D.Zero();
	}
	Update(deltaTime)
	{
		this.position = this.position.Add(this.velocity.Mult(deltaTime));
	}
	Render()
	{
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

class Snake
{
	constructor(length)
	{
		this.head = new SnakeHead(this);
		this.body = [];
		for (let i = 0; i < length; i++)
		{
			this.body.push(new SnakeSegment(this, i));
		}
		this.speed = 100;
	}
	FollowMouse()
	{
		// Head to mouse
		let differenceVector = mousePos.Subtract(this.head.position);
		this.head.velocity = differenceVector.Divide(differenceVector.Length() / this.speed);
		// Body to head
		differenceVector = this.head.position.Subtract(this.body[0].position);
		let segmentDistanceSqr = differenceVector.LengthSqr();
		if (segmentDistanceSqr > SnakeSegment.DISTANCE)
		{
			this.body[0].velocity = differenceVector.Divide(Math.sqrt(segmentDistanceSqr) / this.speed);
		}
		else
		{
			this.body[0].velocity = Vector2D.Zero();		
		}
		for (let i = 1; i < this.body.length; i++)
		{
		// Body to head
			differenceVector = this.body[i-1].position.Subtract(this.body[i].position);
			let segmentDistanceSqr = differenceVector.LengthSqr();
			if (segmentDistanceSqr > SnakeSegment.DISTANCE)
			{
				this.body[i].velocity = differenceVector.Divide(Math.sqrt(segmentDistanceSqr) / this.speed);
			}
			else
			{
				this.body[i].velocity = Vector2D.Zero();		
			}
		}
	}
	Update(deltaTime)
	{
		this.FollowMouse();
		this.head.Update(deltaTime);
		for (let i = 0; i < this.body.length; i++)
		{
			this.body[i].Update(deltaTime);
		}
	}
	Render()
	{
		this.head.Render();
		for (let i = 0; i < this.body.length; i++)
		{
			this.body[i].Render();
		}
	}
}

//////////////////////////////////////////////
//////////////////// EVENTS
//////////////////////////////////////////////
mousePos = Vector2D.Zero();
c.addEventListener('mousemove', (event) => {
    const rect = c.getBoundingClientRect();
    
    mousePos = new Vector2D(event.clientX - rect.left, event.clientY - rect.top);
});

//////////////////////////////////////////////
/////////////////// MAIN FUNCTIONS
//////////////////////////////////////////////
mySnake = new Snake(500);

function update(deltaTime)
{
	mySnake.Update(deltaTime);
}

function render()
{
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, c.width, c.height);
	mySnake.Render();
}

let lastLoop = 0;

function loop(timestamp) {
  let deltaTime = (timestamp - lastLoop) / 1000; // time in seconds
  lastLoop = timestamp;

  update(deltaTime);
  render();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);