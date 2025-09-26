#pragma once
#include "Vector3D.h"
#include <cmath>

class Mat3D
{
public:
	// Static const class instances
	/*static constexpr Mat3D ZERO_MATRIX = Mat3D();
	static constexpr Mat3D IDENTITY_MATRIX = Mat3D(
		{ 1.f, 0.f, 0.f, 0.f },
		{ 0.f, 1.f, 0.f, 0.f },
		{ 0.f, 0.f, 1.f, 0.f },
		{ 0.f, 0.f, 0.f, 1.f }
	);*/
	// Constructors
	Mat3D();
	Mat3D(const float RowOne[4], const float RowTwo[4], const float RowThree[4], const float RowFour[4]);
	Mat3D(const float WholeMatrix[16]);
	Mat3D(const float a1, const float a2, const float a3, const float a4,
		const float b1, const float b2, const float b3, const float b4,
		const float c1, const float c2, const float c3, const float c4,
		const float d1, const float d2, const float d3, const float d4);
	static Mat3D PerspectiveProjection(const float FOV, const float AspectRatio, const float Near, const float Far)
	{
		Mat3D Result = Mat3D();
		const float T = tanf(FOV / 2);

		Result._InternalMatrix[0][0] = 1.f / (T * AspectRatio);
		Result._InternalMatrix[1][1] = 1.f / T;
		Result._InternalMatrix[2][2] = Far / (Far - Near);
		Result._InternalMatrix[2][3] = (-Near * Far) / (Far - Near);
		Result._InternalMatrix[3][2] = 1.f;

		return Result;
	}

	// Operator Overloads
	Mat3D operator+(const Mat3D& OtherMat) const;
	Mat3D operator-(const Mat3D& OtherMat) const;
	Mat3D operator*(const Mat3D& OtherMat) const;
	Vector3D operator*(const Vector3D& OtherVector) const;

	// Class methods
	Mat3D& Translate(const Vector3D& TranslateVector);
	Mat3D& Translate(const float T_X, const float T_Y, const float T_Z);
	Mat3D& Scale(const Vector3D& ScaleVector);
	Mat3D& Scale(const float S_X, const float S_Y, const float S_Z);
	Mat3D& Rotate(const float Angle, const Vector3D& RotateVector);
	Mat3D& Rotate(const float Angle, const float R_X, const float R_Y, const float R_Z);

private:
	float _InternalMatrix[4][4] = { {0.f} };
};