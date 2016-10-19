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

The here described installation procedure drives you to set-up Kosmtik with Ubuntu.

{% include_relative _includes/update-ubuntu.md %}

The following subfolders will be created:

- kosmtik
- openstreetmap-carto

{% include_relative _includes/install-git.md program='Kosmtik' %}

{% include_relative _includes/install-nodejs.md program='Kosmtik' %}

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

{% include_relative _includes/test-app.md cdprogram='' %}

{% include_relative _includes/inst-osm-carto.md cdprogram='' %}

{% include_relative _includes/configuration-variables.md os='Ubuntu' %}

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
            "Datasource.password": "{{ pg_password }}",
            "Datasource.user": "{{ pg_user }}",
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

{% include_relative _includes/firewall-postgis-inst.md port=6789 cdprogram='' %}

## Start Kosmtik

Run Kosmtik from the openstreetmap-carto directory, supposing that the Kosmtik installation is in ../kosmtik.

    $ cd
    $ cd openstreetmap-carto

    $ node ../kosmtik/index.js serve project.yaml --host 0.0.0.0

Read [Usage](https://github.com/kosmtik/kosmtik#usage) for further information.

Notice that `--host 0.0.0.0` is needed to access Kosmtik installed on a remote server (not necessary when doing http://localhost:6789).

## Access the map from your browser

With your browser, access the map through <http://localhost:6789>

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

{% include_relative _includes/edit-the-stylesheets.md editor='*vi*' script='scripts/yaml2mml.py' program='Kosmtik' %}