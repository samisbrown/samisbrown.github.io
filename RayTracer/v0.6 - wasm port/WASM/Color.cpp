#include "Color.h"

Color::Color()
{
	R = 0;
	G = 0;
	B = 0;
}

Color::Color(const uint8_t InRed, const uint8_t InGreen, const uint8_t InBlue)
{
	R = InRed;
	G = InGreen;
	B = InBlue;
}