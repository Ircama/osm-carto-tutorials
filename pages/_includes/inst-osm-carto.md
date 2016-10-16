## Python installation

Check that [Python](https://www.python.org/) is installed:

    python -V
    python3 -V

Otherwise Python needs to be installed.

## Install Yaml and Package Manager for Python

This is necessary in order to run OpenStreetMap-Carto scripts/indexes.

```
sudo apt-get install -y python-yaml

pip -V # to verify whether pip is already installed
sudo apt-get install -y python-pip
```

## Install Mapnik Utilities

The *Mapnik Utilities* package includes shapeindex.

    sudo apt-get install -y mapnik-utils

## Install *openstreetmap-carto*

    cd {{ include.cdprogram }}
    git clone https://github.com/gravitystorm/openstreetmap-carto.git
    cd openstreetmap-carto

Read [installation notes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md) for further information.

## Install the fonts needed by openstreetmap-carto

Currently Noto Sans font is used and DejaVu Sans is used as an optional fallback:

```
sudo apt-get install -y fonts-noto-cjk fonts-noto-hinted fonts-noto-unhinted ttf-unifont
```

DejaVu is packaged as fonts-dejavu-core.

Old fonts:

```
sudo apt-get install -y fonts-dejavu-core fonts-droid-fallback ttf-unifont \
  fonts-sipa-arundina fonts-sil-padauk fonts-khmeros \
  fonts-beng-extra fonts-gargi fonts-taml-tscu fonts-tibetan-machine
```

If *fonts-droid-fallback* fails installing, replace it with *with fonts-droid*.

Read [font notes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#fonts) for further information.

## Create the *data* folder

```
cd {{ include.cdprogram }}
cd openstreetmap-carto
scripts/get-shapefiles.py # or ./get-shapefiles.sh (if get-shapefiles.py is not available)
```

Read [scripted download](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#scripted-download) for further information.