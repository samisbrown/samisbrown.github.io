#include "Vector3D.h"
#include <cmath>

Vector3D::Vector3D()
{
	X = 0.f;
	Y = 0.f;
	Z = 0.f;
	W = 1.f;
}

Vector3D::Vector3D(const Vector3D& CopyVector)
{
	X = CopyVector.X;
	Y = CopyVector.Y;
	Z = CopyVector.Z;
	W = CopyVector.W;
}

Vector3D::Vector3D(const float InX, const float InY, const float InZ, const float InW)
{
	X = InX;
	Y = InY;
	Z = InZ;
	W = InW;
}

Vector3D Vector3D::operator+(const Vector3D& OtherVector) const
{
	return Vector3D(X + OtherVector.X, Y + OtherVector.Y, Z + OtherVector.Z, W + OtherVector.W);
}

Vector3D Vector3D::operator+(const float Scalar) const
{
	return Vector3D(X + Scalar, Y + Scalar, Z + Scalar, W + Scalar);
}

Vector3D Vector3D::operator-(const Vector3D& OtherVector) const
{
	return Vector3D(X - OtherVector.X, Y - OtherVector.Y, Z - OtherVector.Z, W - OtherVector.W);
}

Vector3D Vector3D::operator-(const float Scalar) const
{
	return Vector3D(X - Scalar, Y - Scalar, Z - Scalar, W - Scalar);
}

float Vector3D::operator*(const Vector3D& OtherVector) const
{
	// This is the Dot Product
	return X * OtherVector.X + Y * OtherVector.Y + Z * OtherVector.Z + W * OtherVector.W;
}

Vector3D Vector3D::operator*(const float Scalar) const
{
	return Vector3D(X * Scalar, Y * Scalar, Z * Scalar, W * Scalar);
}

Vector3D Vector3D::operator/(const float Scalar) const
{
	return Vector3D(X / Scalar, Y / Scalar, Z / Scalar, W / Scalar);
}

Vector3D& Vector3D::operator+=(const Vector3D& OtherVector)
{
	X += OtherVector.X;
	Y += OtherVector.Y;
	Z += OtherVector.Z;
	W += OtherVector.W;
	return *this;
}

Vector3D& Vector3D::operator+=(const float Scalar)
{
	X += Scalar;
	Y += Scalar;
	Z += Scalar;
	W += Scalar;
	return *this;
}

Vector3D& Vector3D::operator-=(const Vector3D& OtherVector)
{
	X -= OtherVector.X;
	Y -= OtherVector.Y;
	Z -= OtherVector.Z;
	W -= OtherVector.W;
	return *this;
}

Vector3D& Vector3D::operator-=(const float Scalar)
{
	X -= Scalar;
	Y -= Scalar;
	Z -= Scalar;
	W -= Scalar;
	return *this;
}

Vector3D& Vector3D::operator*=(const float Scalar)
{
	X *= Scalar;
	Y *= Scalar;
	Z *= Scalar;
	W *= Scalar;
	return *this;
}

Vector3D& Vector3D::operator/=(const float Scalar)
{
	X /= Scalar;
	Y /= Scalar;
	Z /= Scalar;
	W /= Scalar;
	return *this;
}

Vector3D Vector3D::Cross(const Vector3D& OtherVector) const
{
	return Vector3D(
		Y * OtherVector.Z - Z * OtherVector.Y,
		X * OtherVector.Z - Z * OtherVector.X,
		X * OtherVector.Y - Y * OtherVector.X,
		0.f
	);
}

float Vector3D::Length() const
{
	return sqrtf(X * X + Y * Y + Z * Z);
}

float Vector3D::LengthSqr() const
{
	return X * X + Y * Y + Z * Z;
}

Vector3D& Vector3D::Normalize()
{
	this->operator/=(Length());
	return *this;
}

bool Vector3D::IsNormalized() const
{
	return LengthSqr() == 1.f;
}