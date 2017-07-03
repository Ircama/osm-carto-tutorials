---
layout: page
title: Updating OSM data
permalink: /updating-data/
comments: true
rendering-note: this page is best viewed with Jekyll rendering
sitemap: false # remove this once the page is completed
---

## Introduction

The following procedure explains how to keep the tile server and the PostgreSQL database up-to-date with the latest OSM data.

[Osmosis](http://wiki.openstreetmap.org/wiki/Osmosis) is a command line Java application for processing OSM data.

Command line syntax: http://wiki.openstreetmap.org/wiki/Osmosis/Detailed_Usage

Sources: https://github.com/openstreetmap/osmosis

[Osmconvert](http://wiki.openstreetmap.org/wiki/Osmconvert) is a command line tool to convert and process OpenStreetMap files.

Sources: http://m.m.i24.cc/osmconvert.c

## How to quickly load two distinct areas into postGIS without using --append flag?

Check this [Q&A](https://gis.stackexchange.com/questions/186754/how-to-quickly-load-two-distinct-areas-into-postgis-without-using-append-flag).

## Steps

This paragraph is currently in early stage, not yet tested and revised. Information at the moment is largely taken from the *Updating* paragraph of [Building a tile server from packages](https://switch2osm.org/serving-tiles/building-a-tile-server-from-packages) page within [switch2osm.org](https://switch2osm.org).

After importing the initial database with *osm2pgsql* as described in "[Get an OpenStreetMap data extract](../tile-server-ubuntu#get-an-openstreetmap-data-extract)" (you will need to have used the *-slim* option in the initial import to allow for updating), you need to do the following steps.

Install *osmosis*:

    sudo apt-get install osmosis

Grant rights to the update tables to user *www-data*:

    sudo /usr/bin/install-postgis-osm-user.sh gis www-data

Initialise the *osmosis* replication stack to the data of your data import. Choose the date of the planet data, as this is the date from which the diffs will start.

    sudo -u www-data /usr/bin/openstreetmap-tiles-update-expire 2012-04-21

As the packaged script currently uses an outdated service to determine the correct replication start-point, you will need to manually choose and download the correct *state.txt* from the *base_url* (see below) which corresponds to slightly before the age of the extract to make sure all modifications are included in your db. This needs to be copied to `/var/lib/mod_tile/.osmosis/state.txt`.

You will next need to update the default configuration of *osmosis*. In `/var/lib/mod_tile/.osmosis/configuration.txt` change the `base_url` to `http://planet.openstreetmap.org/replication/minute/`

Update your tileserver by up to an hour and expire the corresponding rendered tiles:

    sudo -u www-data /usr/bin/openstreetmap-tiles-update-expire

If your tile server is behind more than an hour you will need to call the *openstreetmap-tiles-expire* script multiple times. If you want to continuously 

keep your server up to data, you need to add the *openstreetmap-tiles-expire* script to your crontab.

Keeping the data up-to-date can be resource intense, in particular because after the import you may already be multiple days behind. Consider changing *maxInterval* in `/var/lib/mod_tile/.osmosis/configuration.txt` to 21600 (six hours) till you have caught up. Further, add *–number-processes 2* to the 

*osm2pgsql* command in `/usr/bin/openstreetmap-tiles-update-expire` or a higher number if this is appropriate for your hardware.

The initial install installed pre-processed coastlines, from time to time it may make sense to replace the files with new versions:

    wget http://tile.openstreetmap.org/processed_p.tar.bz2

and extract it to

    /etc/mapnik-osm-data/world_boundaries/

# Data license

OpenStreetMap is "open data". OSM’s licence is the [Open Database Licence](http://opendatacommons.org/licenses/odbl/summary/).

If you find data within OpenStreetMap that you believe is an infringement of someone else's copyright, then please make contact with the [OpenStreetMap Data Working Group](http://wiki.openstreetmap.org/wiki/Data_working_group).