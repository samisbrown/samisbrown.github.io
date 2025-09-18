#pragma once
#include <stdint.h>

class Color
{
public:
	// Constructors
	Color();
	Color(const uint8_t Red, const uint8_t Green, const uint8_t Blue);

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