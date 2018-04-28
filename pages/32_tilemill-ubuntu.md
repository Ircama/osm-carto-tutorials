---
layout: page
title: Installing TileMill and OpenStreetMap-Carto on Ubuntu
comments: true
permalink: /tilemill-ubuntu/
rendering-note: this page is best viewed with Jekyll rendering
---

## Introduction

The following step-by-step procedure can be used to install a development environment of *openstreetmap-carto* exploiting [TileMill](https://wiki.openstreetmap.org/wiki/TileMill) on an Ubuntu PC.[^1]

Tilemill was the original tool for the development of the openstreetmap-carto style. It moved out of the [Mapbox profile](https://www.mapbox.com/help/osm-and-mapbox/) and shifted to an open source community-driven organization, with its own organization and contributor model: [tilemill-project](https://github.com/tilemill-project/tilemill). At the moment, the suggested tool for the autohoring of OpenStreetMap stylesheets is [Kosmtik](https://github.com/kosmtik/kosmtik). TileMill is not officially supported.

Additional information:

* [Official TileMill project](https://github.com/tilemill-project/tilemill)
* [Official TileMill documentation](https://tilemill-project.github.io/tilemill/docs/manual/)
* [Documentation to install TileMill](https://tilemill-project.github.io/tilemill/docs/source/)
* [Documentation to build TileMill from source](https://tilemill-project.github.io/tilemill/docs/source/)

A PostGIS database is needed and can be installed locally (suggested) or remotely (might be slow, depending on the network).

This site also logs a [procedure to install Tilemill on Windows](../tilemill-osm-carto){:target="_blank"}, exploiting an old Windows package that has not been updated since years. Even if it was valid in the past, its version limitations produce incompatibility with the current release of *openstreetmap-carto*. The process to install Tilemill is using Ubuntu, as described in this page.

{% include_relative _includes/update-ubuntu.md %}

{% include_relative _includes/install-git.md program='TileMill' %}

{% include_relative _includes/install-nodejs.md program='TileMill' %}

## Install a previous version of node-js

TileMill needs an old node version to successfully install:

```shell
sudo n 6.14.1
```

## Install TileMill

Optional elements (needed for the topcube module related to the client user interface, not needed if TileMill will only be run in server mode):

```shell
# Install the topcube module, UI prerequisite to TileMill:
sudo apt-get install -y libgtk2.0-dev libwebkit-dev libwebkitgtk-dev
```

Installation of TileMill:

```shell
mkdir -p ~/src ; cd ~/src
git clone https://github.com/tilemill-project/tilemill.git
cd ~/src/tilemill
npm install
```

## Test TileMill

To perform a preliminary test of the application, see [Start TileMill](#start-tilemill): a simple run without *openstreetmap-carto* will work; then you need to go back to this point to proceed with the installation of *openstreetmap-carto* and PostGIS, including data load.

The application also provides some unit tests:

```
cd ~/src/tilemill
npm test # you can also run TileMill to test: see "Start TileMill" below.
```
    
{% include_relative _includes/test-app.md cdprogram='/home/$USER/Documents/MapBox/project # if this directory is missing, start TileMill to create it' %}

{% include_relative _includes/inst-osm-carto.md cdprogram='/home/$USER/Documents/MapBox/project # if this directory is missing, start TileMill to create it' %}

{% include_relative _includes/configuration-variables.md os='Ubuntu' %}

{% include_relative _includes/firewall.md port=20009 cdprogram='/home/$USER/Documents/MapBox/project # if this directory is missing, start TileMill to create it' %}

{% include_relative _includes/postgis-inst.md port=20009 cdprogram='/home/$USER/Documents/MapBox/project # if this directory is missing, start TileMill to create it' %}

## Link openstreetmap-carto to the TileMill project directory

TileMill can open projects found in its *project* folder, which can be configured within its *Settings* (check the *Documents* box of the *Application settings*, showing the local file path to TileMill projects & exports). By default this directory is created in */home/$USER/Documents/MapBox/project*, where *$USER* is the actual user that installed the application. The previously described installation procedure already uses that directory to set-up *openstreetmap-carto*.

In case *openstreetmap-carto* is installed in another directory (e.g., *~/src/openstreetmap-carto*), the easiest way to allow TileMill to show and open the openstreetmap-carto project is to perform a symbolic link between openstreetmap-carto and the TileMill projects folder. Run the following:

```shell
cd /home/$USER/Documents/MapBox/project
ln -s ~/src/openstreetmap-carto .
```

## Start TileMill

TileMill can be run from the local Ubuntu desktop (including creation of the client window) or as Ubuntu service for remote access.

To start TileMill from the local UI:

```shell
cd ~/src/tilemill
./index.js
```

To run TileMill as an Ubuntu service and [configure it to listen for public traffic](https://tilemill-project.github.io/tilemill/docs/guides/ubuntu-service/#configuring-to-listen-for-public-traffic), you need to find you IP or hostname and use `--server=true --listenHost=0.0.0.0 --coreUrl=<IP address>:<server port> --tileUrl=<IP address>:<tile port>`.

Generally *<server port>* is 20009 and *<tile port>* is 20008. Example:

```shell
cd ~/src/tilemill
TILEMILL_HOST=`ifconfig eth0 | grep 'inet addr:'| cut -d: -f2 | awk '{ print $1}'` # get my local ethernet IP address
./index.js --server=true --listenHost=0.0.0.0 --coreUrl=${TILEMILL_HOST}:20009 --tileUrl=${TILEMILL_HOST}:20008
```

You can then access TileMill from a remote browser pointing to *http://<IP address>:<server port>*. Example: *http://192.168.1.150:20009*.

An error message like *role ... does not exist...* might be possibly related to missing environment variables PGUSER, PGPASSWORD, etc. Set these variables and restart TileMill.

{% include_relative _includes/start-tilemill.md os='Ubuntu' program='TileMill' %}

{% include_relative _includes/edit-the-stylesheets.md editor='*vi*' program='TileMill' %}

[^1]: Part of the documentation is taken from [Openstreetmap-carto Provide installation script #657](https://github.com/gravitystorm/openstreetmap-carto/issues/657) and from [TileMill](https://hackpad.com/TileMill-I6rxRVszKMv).
