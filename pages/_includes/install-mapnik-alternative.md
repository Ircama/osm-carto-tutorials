If you get the error "`C++ compiler does not support C++11 standard (-std=c++11), which is required. Please upgrade your compiler`", check the following (it might happen on Ubuntu 14.4):

    ./configure CXX=g++-4.8 CC=gcc-4.8 && make

Alternative procedure (only if problems in the previous one):

    cd ~/src
    git clone https://github.com/mapnik/mapnik.git --depth 10
    cd mapnik
    git submodule update --init
    ./configure
    make
