---
layout: page
title: Installing Kosmtik and OpenStreetMap-Carto on Ubuntu
comments: true
permalink: /kosmtik-ubuntu-setup/
---

## Introduction

The following step-by-step procedure can be used to install a working development environment of *openstreetmap-carto* exploiting [Kosmtik](https://github.com/kosmtik) on an Ubuntu PC.

Notice that Kosmtik does not currently install on Windows (setup fails on *node-mapnik*). It can be installed by now on:

- a Unix server (e.g., Ubuntu)
- a local UNIX virtual machine
- a cloud based virtual machine

A PostGIS database is needed and can be installed locally (suggested) or remotely (might be slow, depending on the network).

The here described installation procedure drives you to set-up Kosmtik with Ubuntu. We consider using Ubuntu 16.04.1 LTS Xenial, Ubuntu 15.4 Vivid or Ubuntu 14.04.3 LTS Trusty (other versions should work).

## Update Ubuntu

    $ lsb_release -a # to get the Ubuntu version
    $ sudo apt-get update
    $ sudo apt-get upgrade

We suppose that `cd` defaults to your home directory, where the following subfolders will be created:

- kosmtik
- openstreetmap-carto

## Install [Git](https://git-scm.com/)

Git should be already installed on Ubuntu 16.04.

    $ git --version # to verify whether git is already installed
    $ sudo apt-get install git

## Install Node.js

To install [Node.js](https://nodejs.org/en/):

    $ nodejs --version # to verify whether nodejs is already installed
    $ sudo apt-get install nodejs npm # this package mught not work, see notes in this paragraph

Read [nodejs](https://nodejs.org/en/download/) for further information.

Notice that nodejs-legacy might be needed (at least required with Ubuntu 16.04 at the time of writing).

```
sudo apt-get install nodejs-legacy npm
```

The following error when running Kosmtik is related to compatibility issues with nodejs and should be fixed by installing nodejs-legacy.

```
npm ERR! Failed at the mapnik@3.5.13 install script 'node-pre-gyp install --fallback-to-build'.
npm ERR! Make sure you have the latest version of node.js and npm installed.
```

## Install Kosmtik

    $ git clone https://github.com/kosmtik/kosmtik.git
    $ cd kosmtik
    $ npm install

Read [kosmtik](https://github.com/kosmtik/kosmtik#install) for further information.

## Test Kosmtik

```
cd
cd kosmtik
npm test # you can also run Kosmtik to test: see "Start Kosmtik" below.
```
    
See [Start Kosmtik](#start-kosmtik).

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

## Check that [Python](https://www.python.org/) is installed:

    $ python -V
    $ python3 -V

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

    $ sudo apt-get install mapnik-utils

## Install *openstreetmap-carto*

    $ cd
    $ git clone https://github.com/gravitystorm/openstreetmap-carto.git
    $ cd openstreetmap-carto

Read [installation notes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md) for further information.

## Install the fonts needed by openstreetmap-carto

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

## Create *localconfig.json*

Using your favourite editor, create a file named *localconfig.json* in the *openstreetmap-carto* directory, including the following:

```
[
    {
        "where": "center",
        "then": [9.111, 45.111, 15]
    },
    {
        "where": "Layer",
        "if": {
            "Datasource.type": "postgis"
        },
        "then": {
            "Datasource.dbname": "gis",
            "Datasource.password": "postgres_007%",
            "Datasource.user": "postgres",
            "Datasource.host": "localhost"
        }
    },
    {
        "where": "Layer",
        "if": {
            "id": "hillshade"
        },
        "then": {
            "Datasource.file": "/home/ybon/Code/maps/hdm/DEM/data/hillshade.vrt"
        }
    }
]
```

Replace coordinates and zoom with your preferred ones within the following line:

```
        "then": [9.111, 45.111, 15]
```

In this example, the default center is (9.111, 45.111) and the default zoom is 15.

You can configure the other parameters (like the db ones: dbname, password, user, host). Replace localhost with a remote host name if the PostGIS instance is running remotely.

Read [local config](https://github.com/kosmtik/kosmtik#local-config) for further information.

## Configure the firewall

If you are preparing a remote virtual machine, configure the firewall to allow remote access to the local port 6789.

If you run a cloud based VM, also the VM itself shall be set to open this port.

## Install [PostgreSQL](https://www.postgresql.org/)

Install PostgreSQL 9.5 and PostGIS 2.2 (supposing they are at the lastest available versions)
Also older PostgreSQL version are suitable.

```
sudo apt-get update
sudo apt-get install postgresql postgis pgadmin3 postgresql-contrib
```

Note: used PostgeSQL port is 5432 (default).

## Set the password for the *postgress* user

```
sudo -u postgres psql postgres
\password postgres
```

Enter the following password twice: postgres_007%

## Create the PostGIS instance

```
export PGPASSWORD=postgres_007%
HOSTNAME=localhost # set it to the actual ip address or host name
psql -U postgres -h $HOSTNAME -c "create database gis"
psql -U postgres -h $HOSTNAME -c "\connect gis"
psql -U postgres -h $HOSTNAME -d gis -c "CREATE EXTENSION postgis"
psql -U postgres -h $HOSTNAME -d gis -c "CREATE EXTENSION hstore"
```

## Get an OpenStreetMap data extract

You need to download an appropriate .osm or .pbf file to be subsequently loaded into the previously created PostGIS instance via `osm2pgsql`.

Get data from [Geofabrik](http://download.geofabrik.de/) or Mapzen [Metro-Extracts](https://mapzen.com/data/metro-extracts/).

Check also instruction [here]({{ site.baseurl }}/tilemill-osm-carto/#download-openstreetmap-data).

## Install [osm2pgsql](https://wiki.openstreetmap.org/wiki/Osm2pgsql)

    $$ sudo apt-get install osm2pgsql

### Alternative installation procedure

This alternative installation procedure generates the most updated executable by compiling the sources.

```
# Needed dependencies
sudo apt-get install make cmake g++ libboost-dev libboost-system-dev \
  libboost-filesystem-dev libexpat1-dev zlib1g-dev \
  libbz2-dev libpq-dev libgeos-dev libgeos++-dev libproj-dev lua5.2 \
  liblua5.2-dev

# Download osm2pgsql
cd /tmp
git clone git://github.com/openstreetmap/osm2pgsql.git 

# Prepare for compiling
cd osm2pgsql
mkdir build && cd build
cmake ..

# Compile
make

# Install
sudo make install

# Clean-out temporary files
cd ../..
rm -rf osm2pgsql
```

## Load data to postgis

```
cd
cd openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name
osm2pgsql -s -C 300 -c -G -d gis --style openstreetmap-carto.style -H $HOSTNAME -U postgres [.osm or .pbf file]
```

Note: if you get the following error:

```
node_changed_mark failed: ERROR:  prepared statement "node_changed_mark" does not exist
```

do the following command on your *original.osm*:

```
sed "s/action='modify' //" < original.osm | > fixedfile.osm
```

Then process *fixedfile.osm*.

## Create indexes

openstreet-carto shall be installed first.

```
HOSTNAME=localhost # set it to the actual ip address or host name
cd
cd openstreet-carto
scripts/indexes.py | psql -U postgres -h $HOSTNAME -d gis
```

Read [custom indexes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#custom-indexes) for further information.

## Start Kosmtik

Run Kosmtik from the openstreetmap-carto directory, supposing that the Kosmtik installation is in ../kosmtik.

    $ cd
    $ cd openstreetmap-carto

    $ node ../kosmtik/index.js serve project.yaml --host 0.0.0.0

Read [Usage](https://github.com/kosmtik/kosmtik#usage) for further information.

Notice that `--host 0.0.0.0` is needed to access Kosmtik installed on a remote server (not necessary when doing http://localhost:6789).

## Access the map from your browser:

    http://localhost:6789

Notice that *Https* will not work (use http instead).

Note: the following Kosmtik warnings can be ignored:

```
Mapnik LOG> ...: warning: unable to find face-name 'Arundina Italic' in FontSet 'fontset-0'
Mapnik LOG> ...: warning: unable to find face-name 'Arundina Regular' in FontSet 'fontset-0'
Mapnik LOG> ...: warning: unable to find face-name 'unifont Medium' in FontSet 'fontset-0'
Mapnik LOG> ...: warning: unable to find face-name 'Arundina Regular' in FontSet 'fontset-1'
Mapnik LOG> ...: warning: unable to find face-name 'unifont Medium' in FontSet 'fontset-1'
Mapnik LOG> ...: warning: unable to find face-name 'Arundina Bold' in FontSet 'fontset-2'
Mapnik LOG> ...: warning: unable to find face-name 'Arundina Regular' in FontSet 'fontset-2'
Mapnik LOG> ...: warning: unable to find face-name 'unifont Medium' in FontSet 'fontset-2'
```

Accessing the database and rendering images is often a slow process (mainly depending on the amount of data to be managed, but also on the server performance and on the network), so give many seconds to Kosmtik to output or refresh the map.

## Edit the stylesheets

* Use your own text editor e.g. Atom, gedit, TextWrangler, Notepad++
* Change the *.mss files
* Kosmtik automatically updates rendering upon file change
* View the changes in Kosmtik
* If you change the layer definitions in *project.yaml*, you have to execute `scripts/yaml2mml.py`
