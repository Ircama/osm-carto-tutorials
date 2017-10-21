## Python installation

Check that [Python](https://www.python.org/) is installed:

    python -V
    python3 -V

Otherwise Python needs to be installed.

## Install Yaml and Package Manager for Python

This is necessary in order to run OpenStreetMap-Carto scripts/indexes.

```shell
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

Currently Noto fonts are used.

To install them (except Noto Emoji Regular and Noto Sans Arabic UI Regular/Bold):

    sudo apt-get install -y fonts-noto-cjk fonts-noto-hinted fonts-noto-unhinted fonts-hanazono ttf-unifont

Installation of Noto Emoji Regular and Noto Sans Arabic UI Regular/Bold:

    cd ~/src
    git clone https://github.com/googlei18n/noto-emoji.git
    git clone https://github.com/googlei18n/noto-fonts.git
    sudo cp noto-emoji/fonts/NotoColorEmoji.ttf noto-emoji/fonts/NotoEmoji-Regular.ttf /usr/share/fonts/truetype/noto
    sudo cp noto-fonts/hinted/NotoSansArabicUI-Regular.ttf noto-fonts/hinted/NotoNaskhArabicUI-Regular.ttf noto-fonts/hinted/NotoSansArabicUI-Bold.ttf noto-fonts/hinted/NotoNaskhArabicUI-Bold.ttf /usr/share/fonts/truetype/noto
    sudo fc-cache -fv
    sudo apt install fontconfig
    fc-list
    fc-list | grep Emoji
    cd openstreetmap-carto

DejaVu Sans is used as an optional fallback font for systems without Noto Sans. If all the Noto fonts are installed, it should never be used.

    sudo apt-get install -y fonts-dejavu-core

Read [font notes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#fonts) for further information.

## Create the *data* folder

```shell
cd {{ include.cdprogram }}
cd openstreetmap-carto
scripts/get-shapefiles.py
```

The actual shapefiles loaded by the OpenStreetMap tile servers are reported in the related [Chef configuration](https://github.com/openstreetmap/chef/blob/master/roles/tile.rb#L65-L89).

Read [scripted download](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#scripted-download) for further information.
