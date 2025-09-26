#include "Sphere.h"
#include <cmath>

Sphere::Sphere(const Vector3D& InCenter, const float InRadius, const Color& InObjColor)
{
	CenterPos = InCenter;
	Radius = InRadius;
	SetColor(InObjColor);
}

float Sphere::Intersect(const Ray& IntersectRay) const
{
	const Vector3D StartMinusCenter = IntersectRay.StartPos - CenterPos;
	const float A = IntersectRay.Direction.LengthSqr();
	const float B = 2.f * (IntersectRay.Direction * StartMinusCenter);
	const float C = StartMinusCenter.LengthSqr() - Radius * Radius;
	// Calculate Discriminant
	const float Discrim = B * B - 4 * A * C;
	if (Discrim < 0.f)
	{
		return -1.f; // No Intersection
	}
	if (Discrim == 0.f)
	{
		return -B / (2 * A); // One point of intersection, tangent
	}
	// Otherwise two points of intersection
	const float FirstResult = (-B - sqrtf(Discrim)) / (2 * A);
	const float SecondResult = (-B + sqrtf(Discrim)) / (2 * A);
	
	if (FirstResult > 0.f)
	{
		return FirstResult;
	}
	if (SecondResult > 0.f)
	{
		return SecondResult;
	}
	return -1.f;
}

Vector3D Sphere::Normal(const Vector3D& PointVector) const
{
	return Vector3D(
		(PointVector.X - CenterPos.X) / Radius,
		(PointVector.Y - CenterPos.Y) / Radius,
		(PointVector.Z - CenterPos.Z) / Radius,
		0.f
	);
}