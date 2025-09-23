#include "Mat3D.h"

Mat3D::Mat3D()
{
	for (int RowIndex = 0; RowIndex < 4; ++RowIndex)
	{
		for (int ColIndex = 0; ColIndex < 4; ++ColIndex)
		{
			_InternalMatrix[RowIndex][ColIndex] = 0.f;
		}
	}
}

Mat3D::Mat3D(const float RowOne[4], const float RowTwo[4], const float RowThree[4], const float RowFour[4])
{
	for (int Index = 0; Index < 4; ++Index)
	{
		_InternalMatrix[0][Index] = RowOne[Index];
		_InternalMatrix[1][Index] = RowTwo[Index];
		_InternalMatrix[2][Index] = RowThree[Index];
		_InternalMatrix[3][Index] = RowFour[Index];
	}
}

Mat3D::Mat3D(const float WholeMatrix[16])
{
	for (int RowIndex = 0; RowIndex < 4; ++RowIndex)
	{
		for (int ColIndex = 0; ColIndex < 4; ++ColIndex)
		{
			_InternalMatrix[RowIndex][ColIndex] = WholeMatrix[4 * RowIndex + ColIndex];
		}
	}
}

Mat3D::Mat3D(const float a1, const float a2, const float a3, const float a4,
	const float b1, const float b2, const float b3, const float b4,
	const float c1, const float c2, const float c3, const float c4,
	const float d1, const float d2, const float d3, const float d4)
{
	_InternalMatrix[0][0] = a1;
	_InternalMatrix[0][1] = a2;
	_InternalMatrix[0][2] = a3;
	_InternalMatrix[0][3] = a4;
	_InternalMatrix[1][0] = b1;
	_InternalMatrix[1][1] = b2;
	_InternalMatrix[1][2] = b3;
	_InternalMatrix[1][3] = b4;
	_InternalMatrix[2][0] = c1;
	_InternalMatrix[2][1] = c2;
	_InternalMatrix[2][2] = c3;
	_InternalMatrix[2][3] = c4;
	_InternalMatrix[3][0] = d1;
	_InternalMatrix[3][1] = d2;
	_InternalMatrix[3][2] = d3;
	_InternalMatrix[3][3] = d4;
}

//static Mat3D& Mat3D::PerspectiveProjection(const float FOV, const float AspectRatio, const float Near, const float Far)


// Operator Overloads
Mat3D Mat3D::operator+(const Mat3D& OtherMat) const
{
	Mat3D Result = Mat3D();
	for (int RowIndex = 0; RowIndex < 4; ++RowIndex)
	{
		for (int ColIndex = 0; ColIndex < 4; ++ColIndex)
		{
			Result._InternalMatrix[RowIndex][ColIndex] = _InternalMatrix[RowIndex][ColIndex] + OtherMat._InternalMatrix[RowIndex][ColIndex];
		}
	}
	return Result;
}

Mat3D Mat3D::operator-(const Mat3D& OtherMat) const
{
	Mat3D Result = Mat3D();
	for (int RowIndex = 0; RowIndex < 4; ++RowIndex)
	{
		for (int ColIndex = 0; ColIndex < 4; ++ColIndex)
		{
			Result._InternalMatrix[RowIndex][ColIndex] = _InternalMatrix[RowIndex][ColIndex] - OtherMat._InternalMatrix[RowIndex][ColIndex];
		}
	}
	return Result;
}

Mat3D Mat3D::operator*(const Mat3D& OtherMat) const
{
	Mat3D Result = Mat3D();
	for (int RowIndex = 0; RowIndex < 4; ++RowIndex)
	{
		for (int ColIndex = 0; ColIndex < 4; ++ColIndex)
		{
			for (int K = 0; K < 4; ++K)
			{
				Result._InternalMatrix[RowIndex][ColIndex] += _InternalMatrix[RowIndex][K] * OtherMat._InternalMatrix[K][ColIndex];
			}
		}
	}
	return Result;
}

Vector3D Mat3D::operator*(const Vector3D& OtherVector) const
{
	Vector3D Result = Vector3D();
	for (int Index = 0; Index < 4; ++Index)
	{
		Result.XYZW[Index] = _InternalMatrix[Index][0] * OtherVector.X
			+ _InternalMatrix[Index][1] * OtherVector.Y
			+ _InternalMatrix[Index][2] * OtherVector.Z
			+ _InternalMatrix[Index][3] * OtherVector.W;
	}
	return Result;
}

// Class methods
Mat3D& Mat3D::Translate(const Vector3D& TranslateVector)
{
	return Translate(TranslateVector.X, TranslateVector.Y, TranslateVector.Z);
}

Mat3D& Mat3D::Translate(const float T_X, const float T_Y, const float T_Z)
{
	_InternalMatrix[0][3] += T_X;
	_InternalMatrix[1][3] += T_Y;
	_InternalMatrix[2][3] += T_Z;

	return *this;
}

Mat3D& Mat3D::Scale(const Vector3D& ScaleVector)
{
	return Scale(ScaleVector.X, ScaleVector.Y, ScaleVector.Z);
}

Mat3D& Mat3D::Scale(const float S_X, const float S_Y, const float S_Z)
{
	_InternalMatrix[0][0] *= S_X;
	_InternalMatrix[1][1] *= S_Y;
	_InternalMatrix[2][2] *= S_Z;

	return *this;
}

Mat3D& Mat3D::Rotate(const float Angle, const Vector3D& RotateVector)
{
	return Rotate(Angle, RotateVector.X, RotateVector.Y, RotateVector.Z);
}

Mat3D& Mat3D::Rotate(const float Angle, const float R_X, const float R_Y, const float R_Z)
{
	const float C = cosf(Angle);
	const float S = sinf(Angle);

	_InternalMatrix[0][0] += C + R_X * R_X - C * R_X * R_X;
	_InternalMatrix[0][1] += R_X * R_Y - C * R_X * R_Y - S * R_Z;
	_InternalMatrix[0][2] += R_X * R_Z - C * R_X * R_Z + S * R_Y;
	_InternalMatrix[1][0] += R_X * R_Y - C * R_X * R_Y + S * R_Z;
	_InternalMatrix[1][1] += C + R_Y * R_Y - C * R_Y * R_Y;
	_InternalMatrix[1][2] += R_Y * R_Z - C * R_Y * R_Z - S * R_X;
	_InternalMatrix[2][0] += R_X * R_Z - C * R_X * R_Z - S * R_Y;
	_InternalMatrix[2][1] += R_Y * R_Z - C * R_Y * R_Z + S * R_X;
	_InternalMatrix[2][2] += C + R_Z * R_Z - C * R_Z * R_Z;

	return *this;
}
