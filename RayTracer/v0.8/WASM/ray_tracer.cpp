#include <emscripten.h>
#include "TArray.h"
#include "SceneObject.h"
#include "Color.h"
#include "Sphere.h"
#include "Light.h"
#include <stdint.h>

// Constants
const float PI = 3.14159f;
const int PLANE_DIST = 500;
const float FOV = 60.f * PI / 180.f;
const float NEAR_DIST = 5.f;

TArray<SceneObject*> AllObjs = TArray<SceneObject*>();
TArray<Light*> AllLights = TArray<Light*>();
int CanvasWidth = 0;
int CanvasHeight = 0;
float AspectRatio = 0.f;
int PixelSize = 0;
float ViewportHeight = 0.f;
float ViewportWidth = 0.f;
Vector3D ViewportCenter;
Color Background;
Vector3D CameraPos;
Vector3D CameraRight;
Vector3D CameraUp;
Vector3D CameraDir;

// Init Render Functions
extern "C"
{
	EMSCRIPTEN_KEEPALIVE
	void SetCanvasSize(const int InCanvasWidth, const int InCanvasHeight)
	{
		CanvasWidth = InCanvasWidth;
		CanvasHeight = InCanvasHeight;
		AspectRatio = static_cast<float>(CanvasWidth) / static_cast<float>(CanvasHeight);
	}

	EMSCRIPTEN_KEEPALIVE
	void SetPixelSize(const int InPixelSize)
	{
		PixelSize = InPixelSize;
	}

	EMSCRIPTEN_KEEPALIVE
	void SetBackgroundColor(const uint8_t InRed, const uint8_t InGreen, const uint8_t InBlue)
	{
		Background = Color(InRed, InGreen, InBlue);
	}

	EMSCRIPTEN_KEEPALIVE
	void SetCameraPos(const float InX, const float InY, const float InZ)
	{
		CameraPos = Vector3D(InX, InY, InZ, 1.f);
	}

	EMSCRIPTEN_KEEPALIVE
	void SetCameraDir(const float InX, const float InY, const float InZ)
	{
		CameraDir = Vector3D(InX, InY, InZ, 0.f).Normalize();
	}

	EMSCRIPTEN_KEEPALIVE
	void SetUp()
	{
		ViewportHeight = 2.f * NEAR_DIST * tanf(FOV / 2.f);
		ViewportWidth = ViewportHeight * AspectRatio;
		ViewportCenter = CameraPos + CameraDir * NEAR_DIST;
	
		CameraRight = CameraDir.Cross(Vector3D(0.f, 1.f, 0.f, 0.f));
		CameraUp = CameraRight.Cross(CameraDir);
	}
}

// Add SceneObjects
extern "C"
{
	EMSCRIPTEN_KEEPALIVE
	void AddSphere(const float InCenterX, const float InCenterY, const float InCenterZ, const float InRadius, const uint8_t InRed, const uint8_t InGreen, const uint8_t InBlue)
	{
		AllObjs.AddElement(new Sphere(Vector3D(InCenterX, InCenterY, InCenterZ, 1.f), InRadius, Color(InRed, InGreen, InBlue)));
	}
}

// Add Lights
extern "C"
{
	EMSCRIPTEN_KEEPALIVE
	void AddLight(const float InX, const float InY, const float InZ, const uint8_t InRed, const uint8_t InGreen, const uint8_t InBlue)
	{
		AllLights.AddElement(new Light(Vector3D(InX, InY, InZ, 1.f), Color(InRed, InGreen, InBlue)));
	}
}

// The infamous ray trace function
extern "C"
{
	EMSCRIPTEN_KEEPALIVE
	void TraceRay(const int PixelX, const int PixelY, uint8_t* WriteColorToPtr)
	{
		// Calculate the Ray based on PixelXY and viewport
		const float U = (PixelX + (PixelSize / 2.f)) / CanvasWidth;
		const float V = (PixelY + (PixelSize / 2.f)) / CanvasHeight;
		const Vector3D RayDest = ViewportCenter + (CameraRight * (U - 0.5f) * ViewportWidth) + (CameraUp * (V - 0.5f) * ViewportHeight);
		
		const Ray RayToTrace = Ray(CameraPos, (RayDest - CameraPos).Normalize());
		
		// Now the math for Tracing the Ray
		Color ResultColor = Background;
		float ClosestPoint = 0.f;
		SceneObject* HitObj = nullptr;
		for (int ObjIndex = 0; ObjIndex < AllObjs.Num(); ++ObjIndex)
		{
			float ObjHitPoint = AllObjs.GetElement(ObjIndex)->Intersect(RayToTrace);
			if (ObjHitPoint > 0.f)
			{
				// We did hit an object
				if (HitObj == nullptr)
				{
					// If its the first obj we've hit
					ClosestPoint = ObjHitPoint;
					HitObj = AllObjs.GetElement(ObjIndex);
				}
				else if (ObjHitPoint < ClosestPoint)
				{
					// Otherwise we check if this object is closer than the current closest
					ClosestPoint = ObjHitPoint;
					HitObj = AllObjs.GetElement(ObjIndex);
				}
			}
		}
		if (HitObj != nullptr)
		{
			const Vector3D HitPoint = RayToTrace.StartPos + (RayToTrace.Direction * ClosestPoint);
			const Vector3D Normal = HitObj->Normal(HitPoint);
			// If we did end up hitting an object, change the result color from background
			//ResultColor = HitObj->GetColor();
			// This is where we do Phong-Blinn >:)
			const Color AmbientLight = Color(102, 102, 102);
			const Color DiffuseLight = Color(255, 255, 255);
			const Color SpecularLight = Color(255, 255, 255);
			const float Shininess = 10.f;
			ResultColor = AmbientLight * HitObj->GetColor();
			for (int LightIndex = 0; LightIndex < AllLights.Num(); ++LightIndex)
			{
				// For every single light
				const Vector3D DirToLightFromHit = (AllLights.GetElement(LightIndex)->Position - HitPoint).Normalize();
				// Add Diffuse
				const float DiffuseDotProduct = Normal * DirToLightFromHit;
				ResultColor += AllLights.GetElement(LightIndex)->LightColor * HitObj->GetColor() * (DiffuseDotProduct < 0.f ? 0.f : DiffuseDotProduct);
				// Add Specular
				// First must calculate halfway vector
				const Vector3D HalfwayVector = (DirToLightFromHit - RayToTrace.Direction).Normalize();
				const float SpecularDotProduct = Normal * HalfwayVector;
				ResultColor += AllLights.GetElement(LightIndex)->LightColor * powf((SpecularDotProduct < 0.f ? 0.f : SpecularDotProduct), Shininess);
			}
		}

		// Now return the Color into the ColorPointer
		*WriteColorToPtr = ResultColor.R;
		*(WriteColorToPtr + 1) = ResultColor.G;
		*(WriteColorToPtr + 2) = ResultColor.B;
	}
}

// Clean up memory
extern "C"
{
	EMSCRIPTEN_KEEPALIVE
	void CleanUp()
	{
		for (int ObjIndex = AllObjs.Num() - 1; ObjIndex >= 0; --ObjIndex)
		{
			delete AllObjs.GetElement(ObjIndex);
			AllObjs.RemoveElement(ObjIndex);
		}
		for (int LightIndex = AllLights.Num() - 1; LightIndex >= 0; --LightIndex)
		{
			delete AllLights.GetElement(LightIndex);
			AllLights.RemoveElement(LightIndex);
		}
	}
}