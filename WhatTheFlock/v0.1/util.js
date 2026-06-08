export class Vector
{
	#components;
	
	static FromRandom(...component_ranges)
	{
		// component_ranges of the form [x_min, x_max], [y_min, y_max], ... etc
		// 
		let random_components = [];
		for (let i = 0; i < component_ranges.length; ++i)
		{
			let min = component_ranges[i][0];
			let max = component_ranges[i][1];
			random_components.push(Math.random() * (max - min) + min);
		}
		return new Vector(...random_components);
	}
	
	constructor(...components) 
	{
		this.#components = components;
	}
	
	get dimension()
	{
		return this.#components.length;
	}
	
	get lengthSqr()
	{
		//Sums all the components squared
		return this.#components.reduce((accum, curr) => accum + curr * curr, 0);
	}
	
	get x() {return this.#components[0];}
	set x(val) {this.#components[0] = val;}
	get y() {return this.#components[1];}
	set y(val) {this.#components[1] = val;}
	get z() {return this.#components[2];}
	set z(val) {this.#components[2] = val;}
	get w() {return this.#components[3];}
	set w(val) {this.#components[3] = val;}
	
	Get() {return this.#components;}
	
	Add(otherVector)
	{
		return otherVector instanceof Vector && otherVector.dimension == this.dimension ?
			new Vector(...this.#components.map((x, i) => x + otherVector.#components[i])) :
			null;
	}
	
	Subtract(otherVector)
	{
		return otherVector instanceof Vector && otherVector.dimension == this.dimension ?
			new Vector(...this.#components.map((x, i) => x - otherVector.#components[i])) :
			null;
	}
	
	Dot(otherVector)
	{
		return otherVector instanceof Vector && otherVector.dimension == this.dimension ?
			this.#components.reduce((accum, curr, i) => accum + curr*otherVector.#components[i], 0) :
			null;
	}
}