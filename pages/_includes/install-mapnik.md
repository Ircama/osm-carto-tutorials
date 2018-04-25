## Install Mapnik library

We need to install the Mapnik library. Mapnik is used to render the OpenStreetMap data into the tiles managed by the Apache web server through *renderd* and *mod_tile*.

### FreeType dependency in Ubuntu 16.04 LTS

With Ubuntu 18.04 LTS, which installs FreeType 2.8.1, skip this paragraph and continue with [installing Mapnik](#install-mapnik-library-from-package).

Mapnik [depends](https://github.com/mapnik/mapnik/wiki/MapnikDependencies) on [FreeType](https://en.wikipedia.org/wiki/FreeType) for [TrueType](https://en.wikipedia.org/wiki/TrueType), [Type 1](https://en.wikipedia.org/wiki/PostScript_fonts#Type_1), and [OpenType](https://en.wikipedia.org/wiki/OpenType) font support. With Ubuntu 16.04 LTS, the [installed version of FreeType](https://launchpad.net/ubuntu/+source/freetype) is [2.6.1](https://launchpad.net/ubuntu/xenial/+source/freetype) which has the [stem darkening](https://www.freetype.org/freetype2/docs/text-rendering-general.html#experimental-stem-darkening-for-the-auto-hinter) turned on and this makes [Noto](https://en.wikipedia.org/wiki/Noto_fonts) [CJK](https://en.wikipedia.org/wiki/CJK_characters) fonts [bolder and over-emphasized](https://cloud.githubusercontent.com/assets/5209216/19252545/b640dd32-8f45-11e6-91be-8870350d6a3c.png). Installing a [newer version of FreeType from a separate PPA](https://github.com/achaphiv/ppa-fonts/tree/master/ppa), overriding the default one included in Ubuntu 16.04 LTS, solves this issue[^77]:

```shell
echo "Old freetype version:"
dpkg -l|grep freetype6

sudo add-apt-repository -y ppa:no1wantdthisname/ppa
sudo apt-get update 
sudo apt-get install -y libfreetype6 libfreetype6-dev
```

Check the updated freetype version:

```shell
echo "Updated freetype version:"
dpkg -l|grep freetype6
```

In case you need to downgrade the FreeType to the stock version in Ubuntu 16.04 repository, simply purge the PPA via *ppa-purge*:

```shell
sudo apt-get install ppa-purge && sudo ppa-purge ppa:no1wantdthisname/ppa
```

We report some alternative procedures to install Mapnik (in the consideration to run an updated version of Ubuntu).

### Install Mapnik library from package

Optionally, a specific PPA made by [talaj](https://github.com/talaj) offers packaged version 3.0.19 of Mapnik for Ubuntu 16.04 LTS Xenial.

```shell
sudo add-apt-repository -y ppa:talaj/osm-mapnik
sudo apt-get update
```

Command to install Mapnik from the standard Ubuntu repository:

```shell
sudo apt-get install -y git autoconf libtool libxml2-dev libbz2-dev \
  libgeos-dev libgeos++-dev libproj-dev gdal-bin libgdal-dev g++ \
  libmapnik-dev mapnik-utils python-mapnik
```

[Launchpad reports the Mapnik version](https://launchpad.net/mapnik/+packages) installed from package depending on the operating system; the newer the OS, the higher the Mapnik release.

GitHub reports the ordered list of available versions for:

- [Mapnik](https://github.com/mapnik/mapnik/releases),
- [node-mapnik](https://github.com/mapnik/node-mapnik/releases),
- [python-mapnik](https://github.com/mapnik/python-mapnik/releases).

Version 3.0.19 is the minimum one suggested at the moment.[^76] If using the above mentioned PPA, that version comes installed instead of the default one available with Ubuntu.

After installing Mapnik from package, go to [check Mapnik installation](#verify-that-mapnik-has-been-correctly-installed).

### Alternatively, install Mapnik from sources

To install the latest Mapnik version, you need to recompile it from sources.

Refer to [Mapnik Ubuntu Installation](https://github.com/mapnik/mapnik/wiki/UbuntuInstallation) to for specific documentation.

Refer to [Mapnik Releases](https://github.com/mapnik/mapnik/releases) for the latest version and changelog.

Remove any other old Mapnik packages:

```shell
sudo apt-get purge -y libmapnik* mapnik-* python-mapnik
sudo add-apt-repository --remove -y ppa:mapnik/nightly-trunk
sudo add-apt-repository --remove -y ppa:talaj/osm-mapnik
```

First create a directory to load the sources:

```shell
mkdir -p ~/src ; cd ~/src
```

Install prerequisites:

```shell
sudo apt-get install -y libxml2-dev libfreetype6-dev \
  libjpeg-dev libpng-dev libproj-dev libtiff-dev \
  libcairo2 libcairo2-dev python-cairo python-cairo-dev \
  libgdal-dev git

sudo apt-get install -y build-essential python-dev libbz2-dev libicu-dev
```

Notice that the [Mapnik installation document for Ubuntu 16.04](https://github.com/mapnik/mapnik/wiki/UbuntuInstallation#ubuntu-1604) suggests to first update the compiler (not to be done for Ubuntu 18.04):

```shell
sudo add-apt-repository -y ppa:ubuntu-toolchain-r/test
sudo apt-get update -y
sudo apt-get install -y gcc-6 g++-6 clang-3.8

export CXX="clang++-3.8" && export CC="clang-3.8"
```

Check `clang --version` and `g++-6 --version` before upgrading the compiler. As mentioned, installing *gcc-6* and *clang-3.8* should only be done with Ubuntu 16.04, which by default comes with older versions (not with Ubuntu 18.04).

We need to install [Boost](http://www.boost.org/) either from package or from source.

#### Install Boost from package

Do not install *boost* from package if you plan to compile *mapnik* with an updated compiler. Compile instead *boost* with the same updated compiler.

```shell
sudo apt-get install -y libboost-all-dev
```

#### Alternatively, install the latest version of Boost from source

Remove a previous installation of *boost* from package:

```shell
sudo apt-get purge -y libboost-all-dev # remove installation from package
```

Download *boost* from source:

```shell
cd ~/src
wget https://dl.bintray.com/boostorg/release/1.66.0/source/boost_1_66_0.tar.bz2
tar xjf boost_1_66_0.tar.bz2
rm boost_1_66_0.tar.bz2
cd boost_1_66_0
```

Notice that *boost* and *mapnik* shall be compiled with the same compiler. With Ubuntu 16.04 and gcc-6, g++-6, clang-3.8 you should use these commands:

```shell
./bootstrap.sh --with-toolset=clang
./b2 stage toolset=clang-3.8 define=_GLIBCXX_USE_CXX11_ABI=0 --with-thread --with-filesystem --with-python --with-regex -sHAVE_ICU=1 -sICU_PATH=/usr/ --with-program_options --with-system link=shared
sudo ./b2 install toolset=clang-3.8 define=_GLIBCXX_USE_CXX11_ABI=0 --with-thread --with-filesystem --with-python --with-regex -sHAVE_ICU=1 -sICU_PATH=/usr/ --with-program_options --with-system link=shared -d0
sudo ldconfig && cd ~/
```

With Ubuntu 18.04 or Ubuntu 16.04 using the default compiler, the compilation procedure is the following:

```shell
./bootstrap.sh
./b2 stage toolset=gcc --with-thread --with-filesystem --with-python --with-regex -sHAVE_ICU=1 -sICU_PATH=/usr/ --with-program_options --with-system link=shared
sudo ./b2 install toolset=gcc --with-thread --with-filesystem --with-python --with-regex -sHAVE_ICU=1 -sICU_PATH=/usr/ --with-program_options --with-system link=shared -d0
sudo ldconfig && cd ~/
```

Do not try compiling *mapnik* with an updated compiler if *boost* is installed from package.

#### Install HarfBuzz from package

[HarfBuzz](https://www.freedesktop.org/wiki/Software/HarfBuzz/) is an [OpenType](http://www.microsoft.com/typography/otspec/) text shaping engine.

It might be installed from package, but better is downloading a more updated source version, compiling it. To install from package:

```shell
sudo apt-get install -y libharfbuzz-dev
```

#### Install HarfBuzz from source

Check the lastest version [here](https://www.freedesktop.org/software/harfbuzz/release/). This example grubs harfbuzz-1.7.6:

```shell
cd ~/src
wget https://www.freedesktop.org/software/harfbuzz/release/harfbuzz-1.7.6.tar.bz2
tar xjf harfbuzz-1.7.6.tar.bz2
rm harfbuzz-1.7.6.tar.bz2
cd harfbuzz-1.7.6
./configure && make && sudo make install
sudo ldconfig && cd ~/
```

#### Build the Mapnik library from source

At the time of writing, Mapnik 3.0 is the current stable release and shall be used. The branch for the latest Mapnik from 3.0.x series is *v3.0.x*.[^78]

Download the latest sources of Mapnik:

```shell
cd ~/src
git clone -b v3.0.x https://github.com/mapnik/mapnik.git --depth 10
cd mapnik
git submodule update --init
```

Procedure to build Mapnik with Ubuntu 18.04 LTS or Ubuntu 16.04 with the default compiler:

```shell
./configure && make
```

The above reported commands are appropriate with *boost* installed from package (or compiled with the default compiler).

Wen using the upgraded compiler with Ubuntu 16.04 (suggested mode), ensure that you have set `export CXX="clang++-3.8" && export CC="clang-3.8"` before. Then do the following:

```shell
./configure CUSTOM_CXXFLAGS="-D_GLIBCXX_USE_CXX11_ABI=0" CXX=${CXX} CC=${CC}
make
```

After Mapnik is successfully compiled, use the following command to install it to your system:

```shell
sudo make install
cd ~/
```

[Python bindings](https://github.com/mapnik/python-mapnik/blob/master/docs/getting-started.md) are not included by default. You'll need to add those separately.

- Install prerequisites:

  ```shell
  sudo apt-get install -y python-setuptools python3-setuptools
  ```
  
  Only in case you installed *boost* from package, you also need:
  
  ```shell
  sudo apt-get install -y libboost-python-dev
  ```
  
  Do not peform the above *libboost-python-dev* installation with *boost* compiled from source.

  Set *BOOST* variables if you installed *boost* from sources:
  
  ```shell
  export BOOST_PYTHON_LIB=boost_python
  export BOOST_THREAD_LIB=boost_thread
  export BOOST_SYSTEM_LIB=boost_system
  ```
  
- Download and compile *python-mapnik*. We still use v3.0.x branch:

  ```shell
  cd ~/src
  git clone -b v3.0.x https://github.com/mapnik/python-mapnik.git
  cd python-mapnik
  sudo python setup.py develop
  sudo python setup.py install
  ```

You can then [verify that Mapnik has been correctly installed](#verify-that-mapnik-has-been-correctly-installed).

#### Mapnik 3.1.x (not tested)

Unsuggested build procedure which installs the *master* branch, that is going to be Mapnik 3.1.x, having incompatible changes at the time of writing[^79] and requiring c++14 compliant compiler:

```shell
cd ~/src
git clone https://github.com/mapnik/mapnik.git --depth 10
cd mapnik
git submodule update --init
bash
source bootstrap.sh
./configure && make

```

Notice that only purpose of running *bootstrap.sh* here is to make environment under which visual tests are passing. It is not needed to build Mapnik from sources and only useful for developers.[^78]

Test Mapnik (without needing to install):

```shell
make test # some test might not pass
```

Install Mapnik:

```shell
sudo make install
cd ~/
```

Build Python bindings:

```shell
sudo apt-get install -y python-setuptools python3-setuptools libboost-python-dev

cd ~/src
git clone https://github.com/mapnik/python-mapnik.git
cd python-mapnik
sudo python setup.py develop
sudo python setup.py install
```

## Verify that Mapnik has been correctly installed

Report Mapnik version number and provide the path of the input plugins directory[^75]:

```shell
mapnik-config -v
mapnik-config --input-plugins
```

Check then with Python:

```shell
python -c "import mapnik;print mapnik.__file__"
```

It should return the path to the python bindings (e.g., `/usr/lib/python2.7/dist-packages/mapnik/__init__.pyc`). If python replies without errors, then Mapnik library was found by Python.

[^75]: [Getting started with Python bindings](https://github.com/mapnik/python-mapnik/blob/master/docs/getting-started.md#step-1-check-installation)
[^76]: [Deploying new Mapnik version (3.0.19)](https://github.com/openstreetmap/chef/issues/155)
[^77]: [vholten comment on 11 Oct 2016, ref. FreeType <= 2.6.1 on OSM rendering server causes Noto CJK too much bold](https://github.com/gravitystorm/openstreetmap-carto/issues/2402#issuecomment-252758529)
[^78]: [talaj comment on 8 Feb](https://github.com/mapnik/mapnik-support/issues/104#issuecomment-364054698)
[^79]: [springmeyer comment on 8 Dec 2017](https://github.com/mapnik/mapnik-support/issues/100#issuecomment-350320307)