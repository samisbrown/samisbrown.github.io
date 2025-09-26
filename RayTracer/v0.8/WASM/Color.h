#pragma once
#include <stdint.h>

class Color
{
public:
	// Constructors
	Color();
	Color(const uint8_t Red, const uint8_t Green, const uint8_t Blue);

	// Operator Overloads
	Color operator+(const Color& OtherColor) const;
	Color operator-(const Color& OtherColor) const;
	Color operator*(const float Scalar) const;
	Color operator*(const Color& OtherColor) const;
	Color& operator+=(const Color& OtherColor);
	Color& operator-=(const Color& OtherColor);
	Color& operator*=(const float Scalar);
	Color& operator*=(const Color& OtherColor);

	union
	{
		struct
		{
			uint8_t R;
			uint8_t G;
			uint8_t B;
		};
		uint8_t RGB[3];
	};
};