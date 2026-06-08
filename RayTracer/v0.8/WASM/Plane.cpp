#include "Plane.h"

Plane::Plane(const Vector3D& InCenter, const Vector3D& InUp, const Vector3D& InRight)
{
	CenterPos = InCenter;
	UpVector = InUp;
	UpVector.Normalize();
	RightVector = InRight;
	RightVector.Normalize();
	NormalVector = UpVector.Cross(RightVector);
}

TArray<float> Plane::Intersect(const Ray& IntersectRay) const
{
	TArray<float> Result = TArray<float>();
	if (NormalVector * IntersectRay.Direction < 0.0001f)
	{
		// If dot product between ray direction and plane normal is 0, there is no intersection
		return Result;
	}
	// Otherwise, let's calculate t
	const float Numerator = (CenterPos - IntersectRay.StartPos) * NormalVector;
	const float Denominator = IntersectRay.Direction * NormalVector;
	const float T = Numerator / Denominator;

	// Now we want to check if the hit point is within the plane width and height bounds
	// First we'll check if there even is a width and height
	if (Width <= 0.f && Height <= 0.f)
	{
		Result.AddElement(T);
		return Result;
	}
	const Vector3D HitPoint = IntersectRay.StartPos + IntersectRay.Direction * T;
	const Vector3D CenterToHit = HitPoint - CenterPos;
	const float U = CenterToHit * RightVector;
	const float V = CenterToHit * UpVector;

	bool ValidHit = true;
	if (Width > 0.f && abs(U) > Width / 2.f) 
	{
		// If we have a defined width and the hitpoint is outside of that width
		ValidHit = false;
	}
	if (Height > 0.f && abs(V) > Height / 2.f)
	{
		// If we have a defined height and the hitpoint is outside of that height
		ValidHit = false;
	}

	if (ValidHit)
	{
		Result.AddElement(Numerator / Denominator);
	}
	
	return Result;
}

Vector3D Plane::Normal(const Vector3D& PointVector) const
{
	return NormalVector;
}
