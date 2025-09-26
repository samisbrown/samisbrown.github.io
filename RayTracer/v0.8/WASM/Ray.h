#pragma once
#include "Vector3D.h"

class Ray
{
public:
	// Constructors
	Ray(const Vector3D& InStartPos, const Vector3D& InDirection);

	Vector3D StartPos;
	Vector3D Direction;
};