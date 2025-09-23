#include "Ray.h"

Ray::Ray(const Vector3D& InStartPos, const Vector3D& InDirection)
{
	StartPos = InStartPos;
	Direction = InDirection;
}