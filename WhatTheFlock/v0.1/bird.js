import { birds } from "./main.js"

const CANVAS_SIZE = 1000

class DetectionCircle
{
	constructor(owner, radius, callbackfn)
	{
		this.owner = owner;
		this.radius = radius;
		this.enabled = true;
		this.do_rendering = false;
		this.callbackfn = callbackfn;
		this.color = "red";
	}
	
	IsDetected(relative_position)
	{
		return relative_position.lengthSqr < this.radius * this.radius;
	}
	
	Tick()
	{
		let detected_birds = [];
		birds.forEach((bird) => {
			if (this.owner !== bird && this.IsDetected(this.owner.position.Subtract(bird.position)))
			{
				detected_birds.push(bird);
			}
		});
		if (detected_birds.length > 0)
		{
			this.color = "green";
			this.callbackfn(detected_birds);
		}
		else
		{
			this.color = "red";
		}
	}
	
	Draw(ctx)
	{
		// Draw Detection Radius
		if (this.do_rendering)
		{
			ctx.beginPath();
			ctx.arc(this.owner.position.x, this.owner.position.y, this.radius, 0, 2*Math.PI);
			ctx.strokeStyle = this.color;
			ctx.stroke();
		}
	}
}

export class Bird 
{
	#inner_detection;
	#size;
	constructor(position, angle) 
	{
		this.position = position
		this.#inner_detection = new DetectionCircle(this, 30, (birds) => {
			return;
		});
		this.#inner_detection.do_rendering = true;
		this.speed = 2;
		this.angle = angle; // 0 is straight up
		this.#size = 10;
	}
	
	SetAdjustment()
	{
		this.#inner_detection.Tick();
	}
	
	Tick()
	{
		this.position.x += this.speed * Math.sin(this.angle);
		if (this.position.x < 0) 
		{
			this.position.x = 0;
			this.angle += Math.PI;
		}
		if (this.position.x > CANVAS_SIZE) 
		{
			this.position.x = CANVAS_SIZE;
			this.angle += Math.PI;
		}
		this.position.y -= this.speed * Math.cos(this.angle);
		if (this.position.y < 0) 
		{
			this.position.y = 0;
			this.angle += Math.PI;
		}
		if (this.position.y > CANVAS_SIZE) 
		{
			this.position.y = CANVAS_SIZE;
			this.angle += Math.PI;
		}
	}
	
	Draw(ctx)
	{	
		// Draw bird
		ctx.save();
		
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.angle);
		
		ctx.beginPath()
		ctx.moveTo(0, -this.#size); //Tip of arrow
		ctx.lineTo(this.#size/2, this.#size); //Bottom Right of arrow
		ctx.lineTo(0, this.#size/2); //Bottom center of arrow
		ctx.lineTo(-this.#size/2, this.#size); //Bottom Left of arrow
		ctx.closePath();
		
		ctx.fillStyle = "black";
		ctx.fill();
		
		ctx.restore();
		
		// Draw Inner Detection Circle
		this.#inner_detection.Draw(ctx);
	}	
}