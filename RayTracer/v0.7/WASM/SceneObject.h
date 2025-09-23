#pragma once
#include "Ray.h"
#include "Vector3D.h"
#include "Color.h"

class SceneObject
{
public:
	Color GetColor()
	{
		return ObjColor;
	}
	void SetColor(Color InColor)
	{
		ObjColor = InColor;
	}
	virtual float Intersect(const Ray& IntersectRay) const = 0;
	virtual Vector3D Normal(const Vector3D& PointVector) const = 0;

private:
	Color ObjColor;
};