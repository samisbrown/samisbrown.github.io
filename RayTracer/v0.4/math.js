export class Vector {
    constructor(x = 0, y = 0, z = 0, w = 1) {
		if (x instanceof Object) {
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
			this.w = x.w;
		} else {
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
		}
    }
	
    add(o) {
		if (!(o instanceof Vector) && typeof o !== "number") {
			throw new Error("Expected Vector or Number");
		}
		if (o instanceof Vector) {
			// this.w + v.w could be fucking weird, idk (this.w + v.w > 1 ? 1 : this.w + v.w)
			return new Vector(this.x + o.x, this.y + o.y, this.z + o.z, this.w + o.w);
		}
		if (typeof o === "number") {
			return new Vector(this.x + o, this.y + o, this.z + o, this.w + o);
		}
    }
	
	sub(o) {
		if (!(o instanceof Vector) && typeof o !== "number") {
			throw new Error("Expected Vector or Number");
		}
		if (o instanceof Vector) {
			// this.w + v.w could be fucking weird, idk (this.w + v.w > 1 ? 1 : this.w + v.w)
			return new Vector(this.x - o.x, this.y - o.y, this.z - o.z, this.w - o.w);
		}
		if (typeof o === "number") {
			return new Vector(this.x - o, this.y - o, this.z - o, this.w - o);
		}
    }
	
	mult(s) {
		if (typeof s !== "number") {
			throw new Error("Expected Number");
		}
		return new Vector(this.x * s, this.y * s, this.z * s, this.w * s);
		
	}
	
	dot(v) {
		if (!(v instanceof Vector)) {
			throw new Error("Expected Vector");
		}
		return this.x*v.x + this.y*v.y + this.z*v.z + this.w*v.w;
	}
	
	len() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	
	normalize() {
		if (this.w == 0) {
			return new Vector(this.x / this.len(), this.y / this.len(), this.z / this.len(), this.w);
		} else {
			return new Vector(this.x / this.w, this.y / this.w, this.z / this.w, 1);
		}
	}
	
	copy() {
		return new Vector(this.x, this.y, this.z, this.w);
	}
}

const copy_mat = (mat) => mat.map(row => row.map(num => num));
const ZERO_MAT = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const IDENTITY_MAT = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

export class Matrix {
	constructor(rows = null) {
		if (rows == null || rows == 0) {
			this.rows = copy_mat(ZERO_MAT);
		} else if (rows == 1) {
			this.rows = copy_mat(IDENTITY_MAT);
		} else {
			this.rows = copy_mat(rows);
		}
	}

	add(m) {
		if (!(m instanceof Matrix)) {
			throw new Error("Expected Matrix");
		}
		const result = copy_mat(ZERO_MAT);
		
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				result[y][x] = this.rows[y][x] + m.rows[y][x];
			}
		}
		
		return new Matrix(result);
	}

	mult(o) {
		if (!(o instanceof Vector) && !(o instanceof Matrix)) {
			throw new Error("Expected Vector or Matrix");
		}
		if (o instanceof Vector) {
			//We are multiplying a matrix by a vector
			return new Vector(
				this.rows[0][0] * o.x + this.rows[0][1] * o.y + this.rows[0][2] * o.z + this.rows[0][3] * o.w,
				this.rows[1][0] * o.x + this.rows[1][1] * o.y + this.rows[1][2] * o.z + this.rows[1][3] * o.w,
				this.rows[2][0] * o.x + this.rows[2][1] * o.y + this.rows[2][2] * o.z + this.rows[2][3] * o.w,
				this.rows[3][0] * o.x + this.rows[3][1] * o.y + this.rows[3][2] * o.z + this.rows[3][3] * o.w
			);
		}
		if (o instanceof Matrix) {
			const result = copy_mat(ZERO_MAT);
			
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					for (let k = 0; k < 4; k++) {
						result[i][j] += this.rows[i][k] * o.rows[k][j];
					}
				}
			}

			return new Matrix(result);
		}
	}
	
	static translate(tx, ty = null, tz = null) {
		const result = copy_mat(IDENTITY_MAT);
		let x, y, z;
		if (sx instanceof Vector && sy == null && sz == null) {
			({x, y, z} = {x: tx.x, y: tx.y, z: tx.z});
		} else {
			({x, y, z} = {x: tx, y: ty, z: tz});
		}
		
		result[0][3] = x;
		result[1][3] = y;
		result[2][3] = z;
		
		
		return new Matrix(result);
	}
	
	static scale(sx, sy = null, sz = null) {
		const result = copy_mat(IDENTITY_MAT);
		let x, y, z;
		if (sx instanceof Vector && sy == null && sz == null) {
			({x, y, z} = {x: sx.x, y: sx.y, z: sx.z});
		} else {
			({x, y, z} = {x: sx, y: sy, z: sz});
		}
		
		result[0][0] = x;
		result[1][1] = y;
		result[2][2] = z;
		
		return new Matrix(result);
	}
	
	static rotate(angle, rx, ry, rz) {
		const result = copy_mat(IDENTITY_MAT);
		let x, y, z;
		if (rx instanceof Vector && ry == null && rz == null) {
			({x, y, z} = {x: rx.x, y: rx.y, z: rx.z});
		} else {
			({x, y, z} = {x: rx, y: ry, z: rz});
		}
		
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		
		result[0][0] = c + x*x - c*x*x;
		result[0][1] = x*y - c*x*y - s*z;
		result[0][2] = x*z - c*x*z + s*y;
		result[1][0] = x*y - c*x*y + s*z;
		result[1][1] = c + y*y - c*y*y;
		result[1][2] = y*z - c*y*z - s*x;
		result[2][0] = x*z - c*x*z - s*y;
		result[2][1] = y*z - c*y*z + s*x;
		result[2][2] = c + z*z - c*z*z;
		
		return new Matrix(result);
	}
	
	static perspective_projection(fov, aspectRatio, near, far) {
		const result = copy_mat(ZERO_MAT);
		const t = Math.tan(fov/2);
		
		result[0][0] = 1/(t*aspectRatio);
		result[1][1] = 1/t;
		result[2][2] = far/(far - near);
		result[2][3] = (-near*far)/(far-near);
		result[3][2] = 1;
		
		return new Matrix(result);
	}
}

export class Color {
	constructor(r, g, b) {
		if (r instanceof Object) {
			this.r = r.r;
			this.g = r.g;
			this.b = r.b;
		} else {
			this.r = r;
			this.g = g;
			this.b = b;
		}
	}
}

export class Ray {
	constructor(p0, dir) {
		this.p0 = p0;
		this.dir = dir;
	}
}

export class SceneObject {
	constructor() {
	}
	
	intersect(ray) {
		throw new Error("intersect() not implemented");
	}
	
	normal(point) {
		throw new Error("intersect() not implemented");
	}
}

export class Sphere extends SceneObject {
	constructor(center, radius, color) {
		super();
		this.type = "Sphere";
		this.center = center;
		this.radius = radius;
		this.color = color;
	}
	
	intersect(ray) {
		const p0_sub_c = ray.p0.sub(this.center);
		const A = ray.dir.dot(ray.dir);
		const B = 2*ray.dir.dot(p0_sub_c);
		const C = p0_sub_c.dot(p0_sub_c) - this.radius*this.radius;
		//Discriminant
		const discrim = B*B - 4*A*C;
		if (discrim < 0) return [];
		if (discrim == 0) {
			return [-B/(2*A)];
		}
		return [
			(-B - Math.sqrt(discrim))/(2*A),
			(-B + Math.sqrt(discrim))/(2*A)
		];
	}

	normal(point) {
		return new Vector(
			(point.x - this.center.x) / this.radius,
			(point.y - this.center.y) / this.radius,
			(point.z - this.center.z) / this.radius
		);
	}
}