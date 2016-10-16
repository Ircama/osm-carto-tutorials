## Install Mapnik library

We need to install the Mapnik library. Mapnik is used to render the OpenStreetMap data into the tiles managed by the Apache web server through *renderd* and *mod_tile*.

We report some alternative procedures to install Mapnik (in the consideration to run an updated version of Ubuntu).

### Install Mapnik library from package

Tested with Ubuntu 16.04 and Ubuntu 14.04; suggested as the preferred option to install Mapnik.

    sudo apt-get install -y git autoconf libtool libxml2-dev libbz2-dev \
      libgeos-dev libgeos++-dev libproj-dev gdal-bin libgdal1-dev g++ \
      libmapnik-dev mapnik-utils python-mapnik

This will most probably install Mapnik 2.2 on Ubuntu 14.04.3 LTS and Mapnik 3.0.9 on Ubuntu 16.04.1 LTS.

Go to [check Mapnik installation](#verify-that-mapnik-has-been-correctly-installed).

### Alternatively, install Mapnik from sources

Refer to [Mapnik Ubuntu Installation](https://github.com/mapnik/mapnik/wiki/UbuntuInstallation) to for specific documentation.

Refer to [Mapnik Releases](https://github.com/mapnik/mapnik/releases) for the latest version and changelog.

This procedure to install Mapnik from sources has been tested with Ubuntu 16.4 only. Refer to the above links for other O.S. versions.

Remove any other old Mapnik packages:

    sudo apt-get purge -y libmapnik* mapnik-* python-mapnik
    sudo add-apt-repository --remove -y ppa:mapnik/nightly-trunk

Install prerequisites; first create a directory to load the sources:

    test -d ~/src || mkdir  ~/src ; cd ~/src

    sudo apt-get install -y libxml2-dev libfreetype6-dev \
      libjpeg-dev libpng-dev libproj-dev libtiff-dev \
      libcairo2 libcairo2-dev python-cairo python-cairo-dev \
      libgdal1-dev git

    sudo apt-get install -y build-essential python-dev libbz2-dev libicu-dev

We need to install [Boost](http://www.boost.org/) either from package or from source.

#### Install Boost from package

    sudo apt-get install libboost-all-dev

#### Alternatively, install the latest version of Boost from source

    sudo apt-get purge -y libboost-all-dev # remove installation from package
    cd ~/src
    wget -O boost.tar.bz2 https://sourceforge.net/projects/boost/files/latest/download?source=files
    tar xjf boost.tar.bz2
    rm boost.tar.bz2
    cd boost_*
    ./bootstrap.sh
    ./b2 stage toolset=gcc --with-thread --with-filesystem --with-python --with-regex -sHAVE_ICU=1 -sICU_PATH=/usr/ --with-program_options --with-system link=shared
    sudo ./b2 install toolset=gcc --with-thread --with-filesystem --with-python --with-regex -sHAVE_ICU=1 -sICU_PATH=/usr/ --with-program_options --with-system link=shared -d0
    sudo ldconfig && cd ~/

#### Install HarfBuzz from source

[HarfBuzz](https://www.freedesktop.org/wiki/Software/HarfBuzz/) is an [OpenType](http://www.microsoft.com/typography/otspec/) text shaping engine.

Check the lastest version [here](https://www.freedesktop.org/software/harfbuzz/release/)

    cd ~/src
    wget https://www.freedesktop.org/software/harfbuzz/release/harfbuzz-1.3.2.tar.bz2
    tar xf harfbuzz-1.3.2.tar.bz2
    rm harfbuzz-1.3.2.tar.bz2
    cd harfbuzz-1.3.2
    ./configure && make && sudo make install
    sudo ldconfig
    cd ~/

#### Build the Mapnik library from source

    cd ~/src
    git clone https://github.com/mapnik/mapnik.git --depth 10
    cd mapnik
    git submodule update --init
    bash
    source bootstrap.sh
    ./configure && make

Test Mapnik (without needing to install):

    make test # some test might not pass
    
Install Mapnik:

    sudo make install
    cd ~/

Python bindings are not included by default. You'll need to add those separately.

    cd ~/src
    git clone https://github.com/mapnik/python-mapnik.git
    cd python-mapnik
    sudo apt-get install python-setuptools
    sudo apt-get install python3-setuptools
    sudo apt-get install libboost-python-dev
    sudo python setup.py develop
    sudo python setup.py install

## Verify that Mapnik has been correctly installed

Report Mapnik version number:

    mapnik-config -v

Check then with Python:

    python -c "import mapnik;print mapnik.__file__"

It should return the path to the python bindings. If python replies without errors, then Mapnik library was found by Python.
