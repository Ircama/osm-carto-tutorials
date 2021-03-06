---
layout: page
title: Installing Kosmtik and OpenStreetMap-Carto on Ubuntu
comments: true
permalink: /kosmtik-ubuntu-setup/
---

## Introduction

[Kosmtik](https://github.com/kosmtik/kosmtik) is an open source modular mapping framework for managing [CartoCSS](https://wiki.openstreetmap.org/wiki/CartoCSS) rendering of [OpenStreetMap stylesheets](https://wiki.openstreetmap.org/wiki/Stylesheets) and creating [Mapnik](https://github.com/mapnik/mapnik/blob/master/docs/design.md) ready [raster tile maps](https://en.wikipedia.org/wiki/Tiled_web_map). It consists of a JavaScript [node](https://en.wikipedia.org/wiki/Node.js) module and needs a list of prerequisite software like PostgreSQL, PostGIS, Python, osm2pgsql and Node.js itself. Kosmtik also includes node versions of further software like Mapnik and Carto. It is written by [Yohan Boniface](https://github.com/yohanboniface) and other [contributors](https://github.com/kosmtik/kosmtik/graphs/contributors).

The recommended method to install Kosmtik is via the [Docker image and related scripts](../docker-kosmtik) provided with OpenStreetMap Carto. Alternatively to the Docker installation method, the following procedure can be used to install a Kosmtik development environment of *openstreetmap-carto* by performing one by one all the required steps on an Ubuntu PC.

Notice that Kosmtik does not currently install on Windows (setup fails on *node-mapnik*). It can be installed by now on:

- a Unix server (e.g., Ubuntu)
- a local UNIX virtual machine
- a cloud based virtual machine

A PostGIS database is needed and can be installed locally (suggested) or remotely (might be slow, depending on the network).

{% include_relative _includes/update-ubuntu.md %}

The following subfolders will be created:

- kosmtik
- openstreetmap-carto

{% include_relative _includes/install-git.md program='Kosmtik' %}

{% include_relative _includes/install-nodejs.md program='Kosmtik' %}

## Install Kosmtik

Note: with Ubuntu 20.04 LTS, go to the [Kosmtik installation from its GitHub repository](#install-kosmtik-from-its-github-repository).

```shell
sudo npm install --unsafe-perm -g kosmtik
```

Go to [next installation steps](#python-installation).

### Install Kosmtik from its GitHub repository

As alternative installation method, install Kosmtik from its GitHub repository:

```shell
sudo npm install --unsafe-perm -g git+https://github.com/kosmtik/kosmtik
```

In case the installation fails, this is possibly due to some incompatibility with npm/Node.js; to fix this, try downgrading the Node.js version.

Read [Kosmtik Install or Update](https://github.com/kosmtik/kosmtik#install-or-update) for further information.

{% include_relative _includes/inst-osm-carto.md cdprogram='~/src' %}

## Create *localconfig.json*

Using your favourite editor, create a file named *localconfig.json* in the *openstreetmap-carto* directory, including the following:


```json
cd ~/src
cd openstreetmap-carto
cat > localconfig.json <<\eof
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
            "Datasource.dbname": "gis"
        }
    }
]
eof
```

If accessing a remote server, also set *Datasource.password*, *Datasource.user* and *Datasource.host*:

```json
cd ~/src
cd openstreetmap-carto
cat > localconfig.json <<\eof
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
            "Datasource.password": "{{ pg_password }}",
            "Datasource.user": "{{ pg_user }}",
            "Datasource.host": "localhost"
        }
    }
]
eof
```

Notice the datasource parameters, including user and password, that you might need to change.

Replace coordinates and zoom with your preferred ones within the following line:

```json
        "then": [9.111, 45.111, 15]
```

For instance, for Liechtenstein you would use:

```json
        "then": [9.5634, 47.1237, 15]
```

In this example, the default center is (9.111, 45.111) and the default zoom is 15. You can configure the other parameters (like the db ones: dbname, password, user, host). Replace localhost with a remote host name if the PostGIS instance is running remotely. Read [local config](https://github.com/kosmtik/kosmtik#local-config) for further information.

{% include_relative _includes/firewall.md port=6789 cdprogram='~/src' %}

{% include_relative _includes/postgis-inst.md port=6789 cdprogram='~/src' %}

## Install Kosmtik plugins

Openstreetmap-carto suggests [installing some Kosmtik plugins](https://github.com/gravitystorm/openstreetmap-carto/blob/master/Dockerfile#L13-L22):

Case of global installation ([plugins management through kosmtik is deprecated, one should install the normal way](https://github.com/kosmtik/kosmtik/issues/302#issuecomment-775112456)):

```shell

sudo npm install -g leaflet
sudo npm install -g leaflet-editinosm
sudo npm install -g leaflet.photon
sudo npm install -g osmtogeojson

# Plugins that should work:
sudo npm install -g git+https://github.com/kosmtik/kosmtik-overpass-layer # Add overpass layers to your Kosmtik project
sudo npm install -g git+https://github.com/kosmtik/kosmtik-fetch-remote # Kosmtik plugin to fetch remote layer data
sudo npm install -g git+https://github.com/kosmtik/kosmtik-overlay # Add an overlay in Kosmtik
sudo npm install -g git+https://github.com/kosmtik/kosmtik-map-compare # Add a map to compare side-by-side with your work in Kosmtik
sudo npm install -g git+https://github.com/kosmtik/kosmtik-osm-data-overlay # Display OSM data on top of your map in Kosmtik.
sudo npm install -g git+https://github.com/kosmtik/kosmtik-tiles-export # Export tiles tree of your Kosmtik map
sudo npm install -g git+https://github.com/kosmtik/kosmtik-deploy # Deploy your Kosmtik project on a remote server
sudo npm install -g git+https://github.com/kosmtik/kosmtik-mapnik-reference # Browse Mapnik and CartoCSS reference in Kosmtik; needs  --mapnik-version 3.0.20
sudo npm install -g git+https://github.com/kosmtik/kosmtik-open-in-josm # Add a control in Kosmtik to open your favorite OSM editor with the current
sudo npm install -g git+https://github.com/kosmtik/kosmtik-geojson-overlay # Show a geojson overlay on top of your Kosmtik map
sudo npm install -g git+https://github.com/kosmtik/kosmtik-place-search # Search control for Kosmtik

# Plugins that might not work:
sudo npm install -g git+https://github.com/kosmtik/kosmtik-magnacarto # Magnacarto renderer support for Kosmtik
sudo npm install -g git+https://github.com/kosmtik/kosmtik-mbtiles-export # Export your Kosmtik project in MBTiles
sudo npm install -g git+https://github.com/kosmtik/kosmtik-mbtiles-source # Use an MBTiles file as a source for a vector tile based probject in kosmtik
sudo npm install -g git+https://github.com/kosmtik/kosmtik-places # Bookmark places in Kosmtik

```

Case of local installation:

```shell
cd ~/src/kosmtik

npm install leaflet
npm install leaflet-editinosm
npm install leaflet.photon
npm install osmtogeojson

# Plugins that should work:
npm install git+https://github.com/kosmtik/kosmtik-overpass-layer # Add overpass layers to your Kosmtik project
npm install git+https://github.com/kosmtik/kosmtik-fetch-remote # Kosmtik plugin to fetch remote layer data
npm install git+https://github.com/kosmtik/kosmtik-overlay # Add an overlay in Kosmtik
npm install git+https://github.com/kosmtik/kosmtik-map-compare # Add a map to compare side-by-side with your work in Kosmtik
npm install git+https://github.com/kosmtik/kosmtik-osm-data-overlay # Display OSM data on top of your map in Kosmtik.
npm install git+https://github.com/kosmtik/kosmtik-tiles-export # Export tiles tree of your Kosmtik map
npm install git+https://github.com/kosmtik/kosmtik-deploy # Deploy your Kosmtik project on a remote server
npm install git+https://github.com/kosmtik/kosmtik-mapnik-reference # Browse Mapnik and CartoCSS reference in Kosmtik; needs  --mapnik-version 3.0.20
npm install git+https://github.com/kosmtik/kosmtik-open-in-josm # Add a control in Kosmtik to open your favorite OSM editor with the current
npm install git+https://github.com/kosmtik/kosmtik-geojson-overlay # Show a geojson overlay on top of your Kosmtik map
npm install git+https://github.com/kosmtik/kosmtik-place-search # Search control for Kosmtik

# Plugins that might not work:
npm install git+https://github.com/kosmtik/kosmtik-mbtiles-export # Export your Kosmtik project in MBTiles
npm install git+https://github.com/kosmtik/kosmtik-magnacarto # Magnacarto renderer support for Kosmtik
npm install git+https://github.com/kosmtik/kosmtik-mbtiles-source # Use an MBTiles file as a source for a vector tile based probject in kosmtik
npm install git+https://github.com/kosmtik/kosmtik-places # Bookmark places in Kosmtik

cd ~/src
```

Activate plugins:

```shell
mkdir -p /home/$USER/.config
cat > /home/$USER/.config/kosmtik.yml <<\eof
plugins:
  # Plugins that should work:
  - kosmtik-fetch-remote
  - kosmtik-geojson-overlay
  - kosmtik-map-compare
  - kosmtik-overlay
  - kosmtik-overpass-layer
  - kosmtik-tiles-export
  - kosmtik-deploy
  - kosmtik-mapnik-reference # this needs --mapnik-version 3.0.20
  - kosmtik-open-in-josm # this only works locally
  - kosmtik-osm-data-overlay
  - kosmtik-place-search
  # Plugins that might not work:
  #- kosmtik-magnacarto
  #- kosmtik-mbtiles-export
  #- kosmtik-places
  #- kosmtik-mbtiles-source
eof
```

To show plaugins and kosmtik version:

```shell
kosmtik version
```

Full list of plugins can be found within the [Kosmtik GitHub repository](https://github.com/kosmtik).

## Start Kosmtik

Run Kosmtik:

in case of installation with the `-g` option:

```shell
cd ~/src
cd openstreetmap-carto
kosmtik serve project.mml --host 0.0.0.0 --mapnik-version 3.0.20
```

or also, in case of local installation:

```shell
~/src/kosmtik/index.js serve ~/src/openstreetmap-carto/project.mml --localconfig ~/src/openstreetmap-carto/localconfig.json --host 0.0.0.0
```

Read [Usage](https://github.com/kosmtik/kosmtik#usage) for further information.

Notice that `--host 0.0.0.0` is needed to access Kosmtik installed on a remote server (not necessary when doing http://localhost:6789).

## Access the map from your browser

With your browser, access the map through <http://localhost:6789>

Notice that *Https* will not work (use http instead).

Note: the following Kosmtik warnings can be ignored:

```
Mapnik LOG> ...: warning: unable to find face-name 'unifont Medium' in FontSet 'fontset-0'
Mapnik LOG> ...: warning: unable to find face-name 'unifont Medium' in FontSet 'fontset-1'
Mapnik LOG> ...: warning: unable to find face-name 'unifont Medium' in FontSet 'fontset-2'
```

To cosmetically remove these warinings, install the [Old unifont Medium font](#old-unifont-medium-font).

Accessing the database and rendering images is often a slow process (mainly depending on the amount of data to be managed, but also on the server performance and on the network), so give many seconds to Kosmtik to output or refresh the map.

{% include_relative _includes/edit-the-stylesheets.md editor='*vi*' program='Kosmtik' %}

