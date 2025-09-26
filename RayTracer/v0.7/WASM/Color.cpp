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

Color Color::operator+(const Color& OtherColor) const
{
	const uint16_t Red = R + OtherColor.R;
	const uint16_t Green = G + OtherColor.G;
	const uint16_t Blue = B + OtherColor.B;

	return Color(
		Red > 255 ? 255 : static_cast<uint8_t>(Red),
		Green > 255 ? 255 : static_cast<uint8_t>(Green),
		Blue > 255 ? 255 : static_cast<uint8_t>(Blue)
	);
}

Color Color::operator-(const Color& OtherColor) const
{
	const int16_t Red = R - OtherColor.R;
	const int16_t Green = G - OtherColor.G;
	const int16_t Blue = B - OtherColor.B;

	return Color(
		Red < 0 ? 0 : static_cast<uint8_t>(Red),
		Green < 0 ? 0 : static_cast<uint8_t>(Green),
		Blue < 0 ? 0 : static_cast<uint8_t>(Blue)
	);
}

Color Color::operator*(const float Scalar) const
{
	const uint16_t Red = R * Scalar;
	const uint16_t Green = G * Scalar;
	const uint16_t Blue = B * Scalar;

	return Color(
		Red > 255 ? 255 : static_cast<uint8_t>(Red),
		Green > 255 ? 255 : static_cast<uint8_t>(Green),
		Blue > 255 ? 255 : static_cast<uint8_t>(Blue)
	);
}

Color Color::operator*(const Color& OtherColor) const
{
	const float Red = (R / 255.f) * (OtherColor.R / 255.f);
	const float Green = (G / 255.f) * (OtherColor.G / 255.f);
	const float Blue = (B / 255.f) * (OtherColor.B / 255.f);

	return Color(
		static_cast<uint8_t>(255 * Red),
		static_cast<uint8_t>(255 * Green),
		static_cast<uint8_t>(255 * Blue)
	);
}

Color& Color::operator+=(const Color& OtherColor)
{
	const uint16_t Red = R + OtherColor.R;
	const uint16_t Green = G + OtherColor.G;
	const uint16_t Blue = B + OtherColor.B;

	R = Red > 255 ? 255 : static_cast<uint8_t>(Red);
	G = Green > 255 ? 255 : static_cast<uint8_t>(Green);
	B = Blue > 255 ? 255 : static_cast<uint8_t>(Blue);
	
	return *this;
}

Color& Color::operator-=(const Color& OtherColor)
{
	const int16_t Red = R - OtherColor.R;
	const int16_t Green = G - OtherColor.G;
	const int16_t Blue = B - OtherColor.B;

	R = Red < 0 ? 0 : static_cast<uint8_t>(Red);
	G = Green < 0 ? 0 : static_cast<uint8_t>(Green);
	B = Blue < 0 ? 0 : static_cast<uint8_t>(Blue);

	return *this;
}

Color& Color::operator*=(const float Scalar)
{
	const uint16_t Red = R * Scalar;
	const uint16_t Green = G * Scalar;
	const uint16_t Blue = B * Scalar;

	R = Red > 255 ? 255 : static_cast<uint8_t>(Red);
	G = Green > 255 ? 255 : static_cast<uint8_t>(Green);
	B = Blue > 255 ? 255 : static_cast<uint8_t>(Blue);
	
	return *this;
}

Color& Color::operator*=(const Color& OtherColor)
{
	const float Red = (R / 255.f) * (OtherColor.R / 255.f);
	const float Green = (G / 255.f) * (OtherColor.G / 255.f);
	const float Blue = (B / 255.f) * (OtherColor.B / 255.f);

	R = static_cast<uint8_t>(255 * Red);
	G = static_cast<uint8_t>(255 * Green);
	B = static_cast<uint8_t>(255 * Blue);

	return *this;
}