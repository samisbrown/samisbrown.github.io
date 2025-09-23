#pragma once

class Vector3D
{
public:
	// Static const class instances
	//static constexpr Vector3D ZERO_VEC = Vector3D();
	// Constructors
	Vector3D();
	Vector3D(const Vector3D& CopyVector);
	Vector3D(const float InX, const float InY, const float InZ, const float InW);

	// Operator Overloads
	Vector3D operator+(const Vector3D& OtherVector) const;
	Vector3D operator+(const float Scalar) const;
	Vector3D operator-(const Vector3D& OtherVector) const;
	Vector3D operator-(const float Scalar) const;
	float operator*(const Vector3D& OtherVector) const; // Dot Product
	Vector3D operator*(const float Scalar) const;
	Vector3D operator/(const float Scalar) const;
	Vector3D& operator+=(const Vector3D& OtherVector);
	Vector3D& operator+=(const float Scalar);
	Vector3D& operator-=(const Vector3D& OtherVector);
	Vector3D& operator-=(const float Scalar);
	Vector3D& operator*=(const float Scalar);
	Vector3D& operator/=(const float Scalar);

	// Other Class Methods
	Vector3D Cross(const Vector3D& OtherVector) const;
	float Length() const;
	float LengthSqr() const;
	Vector3D& Normalize();
	bool IsNormalized() const;

	union
	{
		struct
		{
			float X;
			float Y;
			float Z;
			float W;
		};
		float XYZW[4];
	};
};