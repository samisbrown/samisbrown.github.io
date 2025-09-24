#include "Vector3D.h"
#include "Color.h"

class Light
{
public:
	Light();
	Light(Vector3D InPos, Color InColor);

	Vector3D Position = Vector3D(0.f, 0.f, 0.f, 1.f);
	Color LightColor = Color(255, 255, 255);
};