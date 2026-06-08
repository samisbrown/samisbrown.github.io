#pragma once
#include "SceneObject.h"

class Plane : public SceneObject
{
public:
	// Constructors
	Plane(const Vector3D& InCenter, const Vector3D& InUp, const Vector3D& InRight);

	// Function Overrides
	virtual TArray<float> Intersect(const Ray& IntersectRay) const override;
	virtual Vector3D Normal(const Vector3D& PointVector) const override;

private:
	Vector3D CenterPos = Vector3D(0.f, 0.f, 0.f, 1.f);
	Vector3D UpVector = Vector3D(0.f, 0.f, 0.f, 0.f);
	Vector3D RightVector = Vector3D(0.f, 0.f, 0.f, 0.f);
	Vector3D NormalVector = Vector3D(0.f, 0.f, 0.f, 0.f); // store the normal because it is constant for whole object
	float Width = 0.f;
	float Height = 0.f;
};