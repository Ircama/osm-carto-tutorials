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

```shell
mkdir -p ~/src ; cd ~/src
git clone https://github.com/kosmtik/kosmtik.git
cd ~/src/kosmtik
npm install
```

If you wish to use *kosmtik* everywhere, you need to install it globally (rather than locally, ie. in a node_modules folder inside your current folder); for the global installation, you need the `-g` parameter:

```shell
sudo npm install -g
```

Read [Kosmtik Install or Update](https://github.com/kosmtik/kosmtik#install-or-update) for further information.

## Test Kosmtik

```shell
cd ~/src/kosmtik
npm test # you can also run Kosmtik to test: see "Start Kosmtik" below.
```
    
See [Start Kosmtik](#start-kosmtik).

{% include_relative _includes/test-app.md cdprogram='~/src' %}

{% include_relative _includes/inst-osm-carto.md cdprogram='~/src' %}

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
    }
]
```

Notice the datasource parameters, including user and password, that you might need to change.

Replace coordinates and zoom with your preferred ones within the following line:

```
        "then": [9.111, 45.111, 15]
```

For instance, for Liechtenstein you would use:

```
        "then": [9.5634, 47.1237, 15]
```

In this example, the default center is (9.111, 45.111) and the default zoom is 15. You can configure the other parameters (like the db ones: dbname, password, user, host). Replace localhost with a remote host name if the PostGIS instance is running remotely. Read [local config](https://github.com/kosmtik/kosmtik#local-config) for further information.

{% include_relative _includes/firewall.md port=6789 cdprogram='~/src' %}

{% include_relative _includes/postgis-inst.md port=6789 cdprogram='~/src' %}

## Start Kosmtik

Run Kosmtik:

```shell
~/src/kosmtik/index.js serve ~/src/openstreetmap-carto/project.mml --localconfig ~/src/openstreetmap-carto/localconfig.json --host 0.0.0.0
```

or also, in case of installation with the `-g` option:

```shell
kosmtik serve ~/src/openstreetmap-carto/project.mml --localconfig ~/src/openstreetmap-carto/localconfig.json --host 0.0.0.0
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
