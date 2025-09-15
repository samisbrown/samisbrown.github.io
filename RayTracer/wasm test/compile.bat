call ../emsdk/emsdk_env.bat
em++ hello.cpp -s NO_EXIT_RUNTIME=1 -s "EXPORTED_RUNTIME_METHODS=['ccall']" -o hello.js