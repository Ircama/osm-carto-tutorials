---
layout: page
title: Installing Tilemill and OpenStreetMap-Carto on Ubuntu
comments: true
permalink: /tilemill-ubuntu/
sitemap: false
---

## Introduction

TileMill moved out of the Mapbox profile and shifted to an open source community-driven organization, with its own organization and contributor model: [tilemill-project](https://github.com/tilemill-project/tilemill).

Additional information:

* <https://www.mapbox.com/blog/fall-cleaning/>
* <https://github.com/tilemill-project/tilemill>

## Introduction

The following step-by-step procedure can be used to install a working development environment of *openstreetmap-carto* exploiting TileMill on an Ubuntu PC.

A PostGIS database is needed and can be installed locally (suggested) or remotely (might be slow, depending on the network).

We consider using Ubuntu 16.04.1 LTS Xenial, Ubuntu 15.4 Vivid or Ubuntu 14.04.3 LTS Trusty (other versions should work).

{% include_relative _includes/update-ubuntu.md %}

{% include_relative _includes/install-git-nodejs.md program='TileMill' %}

## Install TileMill

Optional elements (needed for the client user interface, not needed if TileMill will only be run in server mode):

    sudo apt-get install libgtk2.0-dev
    sudo apt-get install libwebkit-dev

Installation:

    git clone https://github.com/tilemill-project/tilemill.git
    cd tilemill
    npm install

## Test TileMill

```
cd
cd tilemill
npm test # you can also run TileMill to test: see "Start TileMill" below.
```
    
See [Start TileMill](#start-tilemill).

{% include_relative _includes/complete-inst-osm-carto.md cdprogram='/home/ubuntu/Documents/MapBox/project # if this directory is missing, start TileMill to create it' %}

## Set the environment variables

```
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=postgres_007%
```

{% include_relative _includes/firewall-postgis-inst.md %}

## Start TileMill

    cd
    cd tilemill
    ./index.js --server=true --listenHost=0.0.0.0

Notice that `--server=true` is only needed in case of server based startup, to avoid the local user interface. Besides, `--listenHost=0.0.0.0` is needed to access TileMill installed on a remote server (not necessary when doing http://localhost:20009).

## Access the map from your browser

With your browser, access the map through <http://localhost:20009>

Notice that *Https* will not work (use http instead).

Accessing the database and rendering images is often a slow process (mainly depending on the amount of data to be managed, but also on the server performance and on the network), so give many seconds to TileMill to output or refresh the map.

{% include_relative _includes/edit-the-stylesheets.md editor='*vi*' script='scripts/yaml2mml.py' program='TileMill' %}
