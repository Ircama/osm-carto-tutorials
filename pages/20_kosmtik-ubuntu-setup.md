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
# Plugins that should work:
sudo npm install -g kosmtik-overpass-layer
sudo npm install -g kosmtik-fetch-remote
sudo npm install -g kosmtik-overlay
sudo npm install -g kosmtik-map-compare
sudo npm install -g kosmtik-osm-data-overlay
sudo npm install -g kosmtik-tiles-export
sudo npm install -g kosmtik-magnacarto

# Plugins that might not work:
sudo npm install -g kosmtik-mapnik-reference
sudo npm install -g kosmtik-mbtiles-export
sudo npm install -g kosmtik-open-in-josm
sudo npm install -g kosmtik-geojson-overlay
sudo npm install -g kosmtik-place-search
```

Case of local installation:

## Install Kosmtik plugins

```shell
cd ~/src/kosmtik

# Plugins that should work:
npm install kosmtik-overpass-layer
npm install kosmtik-fetch-remote
npm install kosmtik-overlay
npm install kosmtik-map-compare
npm install kosmtik-osm-data-overlay
npm install kosmtik-tiles-export
npm install kosmtik-magnacarto

# Plugins that might not work:
npm install kosmtik-mapnik-reference
npm install kosmtik-mbtiles-export
npm install kosmtik-open-in-josm
npm install kosmtik-geojson-overlay
npm install kosmtik-place-search

cd ~/src
```

Activate plugins:

```shell
cat > /home/$USER/.config/kosmtik.yml <<\eof
plugins:
  # Plugins that should work:
  - kosmtik-fetch-remote
  - kosmtik-geojson-overlay
  - kosmtik-magnacarto
  - kosmtik-map-compare
  - kosmtik-overlay
  - kosmtik-overpass-layer
  - kosmtik-tiles-export
  # Plugins that might not work:
  #- kosmtik-mapnik-reference
  #- kosmtik-mbtiles-export
  #- kosmtik-open-in-josm
  #- kosmtik-osm-data-overlay
  #- kosmtik-place-search
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
kosmtik serve project.mml --host 0.0.0.0
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

