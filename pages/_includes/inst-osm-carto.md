## Python installation

Check that [Python](https://www.python.org/) is installed:

```shell
sudo apt-get install -y python3 python3-distutils

# Verify Python installation:
python -V
python3 -V
```

## Install Yaml and Package Manager for Python

This is necessary in order to run OpenStreetMap-Carto scripts/indexes.

```shell
sudo apt-get install -y python-yaml

pip -V # to verify whether pip is already installed
sudo apt-get install -y python3-pip
python3 -m pip install --upgrade pip
```

## Install Mapnik Utilities

The *Mapnik Utilities* package includes shapeindex.

```shell
sudo apt-get install -y mapnik-utils
```

## Install *openstreetmap-carto*

```shell
mkdir -p {{ include.cdprogram }}
cd {{ include.cdprogram }}
git clone https://github.com/gravitystorm/openstreetmap-carto.git
cd openstreetmap-carto
```

Read [installation notes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md) for further information.

## Install the fonts needed by openstreetmap-carto

Currently Noto fonts are used.

To install them (except Noto Emoji Regular and Noto Sans Arabic UI Regular/Bold):

```shell
sudo apt-get install -y fonts-noto-cjk fonts-noto-hinted fonts-noto-unhinted fonts-hanazono ttf-unifont
```

Installation of Noto fonts (hinted ones should be used if available[^71]):

```shell
cd ~/src
git clone https://github.com/googlefonts/noto-emoji.git
git clone https://github.com/googlefonts/noto-fonts.git

sudo cp noto-emoji/fonts/NotoColorEmoji.ttf /usr/share/fonts/truetype/noto
sudo cp noto-emoji/fonts/NotoEmoji-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansArabicUI-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoNaskhArabicUI-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansArabicUI-Bold.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoNaskhArabicUI-Bold.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansAdlam-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansAdlamUnjoined-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansChakma-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansOsage-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansSinhalaUI-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansArabicUI-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansCherokee-Bold.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansSinhalaUI-Bold.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansSymbols-Bold.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/NotoSansArabicUI-Bold.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/unhinted/NotoSansSymbols2-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/hinted/ttf/NotoSansBalinese/NotoSansBalinese-Regular.ttf /usr/share/fonts/truetype/noto
sudo cp noto-fonts/archive/hinted/NotoSansSyriac/NotoSansSyriac-Regular.ttf /usr/share/fonts/truetype/noto

mkdir NotoSansSyriacEastern-unhinted
cd NotoSansSyriacEastern-unhinted
wget https://noto-website-2.storage.googleapis.com/pkgs/NotoSansSyriacEastern-unhinted.zip
unzip NotoSansSyriacEastern-unhinted.zip
sudo cp NotoSansSyriacEastern-Regular.ttf /usr/share/fonts/truetype/noto
cd ..

sudo apt install fontconfig
```

At the end:

```shell
sudo fc-cache -fv
fc-list
fc-list | grep Emoji
```

DejaVu Sans is used as an optional fallback font for systems without Noto Sans. If all the Noto fonts are installed, it should never be used.

```shell
sudo apt-get install -y fonts-dejavu-core
```

Read [font notes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#fonts) for further information.

### Old unifont Medium font

The *unifont Medium* font (lowercase label), which was included in past OS versions, now is no more available and substituted by *Unifont Medium* (uppercase). Warnings related to the unavailability of *unifont Medium* are not relevant[^72] and are due to the old decision of OpenStreetMap maintainers to support [both the past Ubuntu 12.04 font and the newer version](https://github.com/gravitystorm/openstreetmap-carto/pull/429) (uppercase).

One way to avoid the warning is removing the reference to "unifont Medium" in *openstreetmap-carto/style.xml*.

Another alternative way to remove the lowercase *unifont Medium* warning is installing the old "unifont Medium" font (used by Ubuntu 12.10):

```shell
mkdir -p ~/src ; cd ~/src
mkdir OldUnifont
cd OldUnifont
wget http://http.debian.net/debian/pool/main/u/unifont/unifont_5.1.20080914.orig.tar.gz
tar xvfz unifont_5.1.20080914.orig.tar.gz unifont-5.1.20080914/font/precompiled/unifont.ttf
sudo cp unifont-5.1.20080914/font/precompiled/unifont.ttf /usr/share/fonts/truetype/unifont/OldUnifont.ttf
sudo fc-cache -fv
fc-list | grep -i unifont # both uppercase and lowercase fonts will be listed
```

Notice that above installation operation is useless, just removes the warning.

[^71]: [pnorman comment on hinted fonts](https://github.com/gravitystorm/openstreetmap-carto/issues/2402#issuecomment-252496456)
[^72]: [Is lowercase "unifont" needed?](https://github.com/gravitystorm/openstreetmap-carto/issues/2924)
