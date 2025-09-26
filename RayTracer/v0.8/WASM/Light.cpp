#include "Light.h"

Light::Light()
{
}

Light::Light(Vector3D InPos, Color InColor)
{
	Position = InPos;
	LightColor = InColor;
}