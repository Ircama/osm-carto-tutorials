---
layout: page
title: Installing TileMill and OpenStreetMap-Carto on Ubuntu
comments: true
permalink: /tilemill-ubuntu/
---

## Introduction

The following step-by-step procedure can be used to install a working development environment of *openstreetmap-carto* exploiting [TileMill](http://wiki.openstreetmap.org/wiki/TileMill) on an Ubuntu PC.[^1]

TileMill moved out of the [Mapbox profile](https://www.mapbox.com/help/osm-and-mapbox/) and shifted to an open source community-driven organization, with its own organization and contributor model: [tilemill-project](https://github.com/tilemill-project/tilemill).

Additional information:

* [Official TileMill project](https://github.com/tilemill-project/tilemill)
* [Official TileMill documentation](http://tilemill-project.github.io/tilemill/docs/manual/)
* [Documentation to install TileMill](http://tilemill-project.github.io/tilemill/docs/source/)
* [Documentation to build TileMill from source](http://tilemill-project.github.io/tilemill/docs/source/)

A PostGIS database is needed and can be installed locally (suggested) or remotely (might be slow, depending on the network).

{% include_relative _includes/update-ubuntu.md %}

{% include_relative _includes/install-git.md program='TileMill' %}

{% include_relative _includes/install-nodejs.md program='TileMill' %}

## Install TileMill

Optional elements (needed for the topcube module related to the client user interface, not needed if TileMill will only be run in server mode):

    # Install the topcube module, UI prerequisite to TileMill:
    sudo apt-get install -y libgtk2.0-dev libwebkit-dev libwebkitgtk-dev

Installation of TileMill:

    cd
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

{% include_relative _includes/test-app.md cdprogram='/home/ubuntu/Documents/MapBox/project # if this directory is missing, start TileMill to create it' %}

{% include_relative _includes/inst-osm-carto.md cdprogram='/home/ubuntu/Documents/MapBox/project # if this directory is missing, start TileMill to create it' %}

{% include_relative _includes/configuration-variables.md os='Ubuntu' %}

{% include_relative _includes/firewall.md port=20009 cdprogram='/home/ubuntu/Documents/MapBox/project # if this directory is missing, start TileMill to create it' %}

{% include_relative _includes/postgis-inst.md port=20009 cdprogram='/home/ubuntu/Documents/MapBox/project # if this directory is missing, start TileMill to create it' %}

## Start TileMill

    cd
    cd tilemill
    ./index.js --server=true --listenHost=0.0.0.0

Notice that `--server=true` is only needed in case of server based startup, to avoid the local user interface. Besides, `--listenHost=0.0.0.0` is needed to access TileMill installed on a remote server (not necessary when doing http://localhost:20009).

An error message like *role ... does not exist...* might be possibly related to missing environment variables PGUSER, PGPASSWORD, etc. Set these variables and restart TileMill.

{% include_relative _includes/start-tilemill.md os='Ubuntu' script='scripts\yaml2mml.py' program='TileMill' %}

{% include_relative _includes/edit-the-stylesheets.md editor='*vi*' script='scripts/yaml2mml.py' program='TileMill' %}

[^1]: Part of the documentation is taken from [Openstreetmap-carto Provide installation script #657](https://github.com/gravitystorm/openstreetmap-carto/issues/657) and from [TileMill](https://hackpad.com/TileMill-I6rxRVszKMv).
