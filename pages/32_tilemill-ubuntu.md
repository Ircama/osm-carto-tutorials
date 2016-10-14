---
layout: page
title: Installing TileMill and OpenStreetMap-Carto on Ubuntu
comments: true
permalink: /tilemill-ubuntu/
---

## Introduction

The following step-by-step procedure can be used to install a working development environment of *openstreetmap-carto* exploiting [TileMill](http://wiki.openstreetmap.org/wiki/TileMill) on an Ubuntu PC.

TileMill moved out of the Mapbox profile and shifted to an open source community-driven organization, with its own organization and contributor model: [tilemill-project](https://github.com/tilemill-project/tilemill).

Additional information:

* [TileMill moved to a community-driven organization](https://www.mapbox.com/blog/fall-cleaning/)
* [Official TileMill project](https://github.com/tilemill-project/tilemill)
* [Official TileMill documentation](http://tilemill-project.github.io/tilemill/docs/manual/)
* [Documentation to build TileMill from source](http://tilemill-project.github.io/tilemill/docs/source/)

A PostGIS database is needed and can be installed locally (suggested) or remotely (might be slow, depending on the network).

{% include_relative _includes/update-ubuntu.md %}

{% include_relative _includes/install-git-nodejs.md program='TileMill' %}

## Install TileMill

Optional elements (needed for the topcube module related to the client user interface, not needed if TileMill will only be run in server mode):

    # steps to install the topcube module, UI prerequisite to TileMill:
    sudo apt-get install libgtk2.0-dev
    sudo apt-get install libwebkit-dev
    sudo apt-get install libwebkitgtk-dev

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

{% include_relative _includes/complete-inst-osm-carto.md cdprogram='/home/ubuntu/Documents/MapBox/project # if this directory is missing, start TileMill to create it' %}

{% include_relative _includes/configuration-variables.md os='Ubuntu' %}

{% include_relative _includes/firewall-postgis-inst.md port=20009 %}

## Start TileMill

    cd
    cd tilemill
    ./index.js --server=true --listenHost=0.0.0.0

Notice that `--server=true` is only needed in case of server based startup, to avoid the local user interface. Besides, `--listenHost=0.0.0.0` is needed to access TileMill installed on a remote server (not necessary when doing http://localhost:20009).

An error message like *role ... does not exist...* might be possibly related to missing environment variables PGUSER, PGPASSWORD, etc. Set these variables and restart TileMill.

{% include_relative _includes/start-tilemill.md os='Ubuntu' script='scripts\yaml2mml.py' program='TileMill' %}

{% include_relative _includes/edit-the-stylesheets.md editor='*vi*' script='scripts/yaml2mml.py' program='TileMill' %}
