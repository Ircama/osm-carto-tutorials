Some test might not pass (this does not mean that the installation is necessarily failed)
    
Notice that, when running `npm test`, an error like the following indicates that your system does not have a modern enough libstdc++/gcc-base toolchain:
    
    `Error: /usr/lib/x86_64-linux-gnu/libstdc++.so.6: version GLIBCXX_3.4.20 not found (required by /node_modules/osrm/lib/binding/osrm.node)`
    
If you are running Ubuntu older than 16.04 you can easily upgrade your libstdc++ version like:
    
```
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update -y
sudo apt-get install -y libstdc++-5-dev
```
    
Read [node-mapnik](https://github.com/mapnik/node-mapnik#depends) for further information.

## Python installation

Check that [Python](https://www.python.org/) is installed:

    python -V
    python3 -V

Otherwise Python needs to be installed.

## Install Yaml and Package Manager for Python

This is necessary in order to run OpenStreetMap-Carto scripts/indexes.

```
sudo apt-get install python-yaml

pip -V # to verify whether pip is already installed
sudo apt-get install python-pip
```

## Install Mapnik Utilities

The *Mapnik Utilities* package includes shapeindex.

    sudo apt-get install mapnik-utils

## Install *openstreetmap-carto*

    cd {{ include.cdprogram }}
    git clone https://github.com/gravitystorm/openstreetmap-carto.git
    cd openstreetmap-carto

Read [installation notes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md) for further information.

## Install the fonts needed by openstreetmap-carto

Currently Noto Sans font is used and DejaVu Sans is used as an optional fallback:

```
sudo apt-get install fonts-noto ttf-unifont fonts-dejavu-core fonts-noto-cjk
```

Old fonts:

```
sudo apt-get install fonts-dejavu-core fonts-droid-fallback ttf-unifont \
  fonts-sipa-arundina fonts-sil-padauk fonts-khmeros \
  fonts-beng-extra fonts-gargi fonts-taml-tscu fonts-tibetan-machine
```

If *fonts-droid-fallback* fails installing, replace it with *with fonts-droid*.

Read [font notes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#fonts) for further information.

## Create the *data* folder

```
sudo apt install unzip
cd
cd openstreetmap-carto
scripts/get-shapefiles.py # or ./get-shapefiles.sh (if get-shapefiles.py is not available)
```

Read [scripted download](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#scripted-download) for further information.