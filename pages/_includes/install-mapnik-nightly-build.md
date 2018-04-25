### Alternatively, install the lastest version of Mapnik from the GitHub nightly build

Note: no more maintained.

First, remove any other old Mapnik packages:

    sudo apt-get purge -y libmapnik* mapnik-* python-mapnik

The [nightly build from master](https://launchpad.net/~mapnik/+archive/ubuntu/nightly-trunk) is directly from the [GitHub repository]https://github.com/mapnik/mapnik/commits/master):

    sudo add-apt-repository ppa:mapnik/nightly-trunk
    sudo apt-get update
    sudo apt-get install -y git autoconf libtool libxml2-dev libbz2-dev \
      libgeos-dev libgeos++-dev libproj-dev gdal-bin libgdal-dev g++ \
      libmapnik-dev mapnik-utils python-mapnik

