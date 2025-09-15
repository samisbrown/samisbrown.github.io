#include <iostream>
#include <emscripten.h>

int main()
{
	std::cout << "Hello World!" << std::endl;
	return 0;
}

extern "C"
{
	EMSCRIPTEN_KEEPALIVE
	int add(int a, int b)
	{
		return a + b;
	}
}