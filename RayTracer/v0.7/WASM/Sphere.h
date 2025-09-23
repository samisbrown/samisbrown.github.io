#pragma once
#include "SceneObject.h"
#include "Vector3D.h"
#include "Color.h"
#include "Ray.h"

class Sphere : public SceneObject
{
public:
	// Constructors
	Sphere(const Vector3D& InCenter, const float InRadius, const Color& InObjColor);
	
	// Function Overrides
	virtual float Intersect(const Ray& IntersectRay) const override;
	virtual Vector3D Normal(const Vector3D& PointVector) const override;

private:
	Vector3D CenterPos;
	float Radius;
};