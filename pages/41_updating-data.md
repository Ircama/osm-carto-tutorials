---
layout: page
title: Keeping PostGIS in sync with OSM
permalink: /updating-data/
comments: true
rendering-note: this page is best viewed with Jekyll rendering
sitemap: false # remove this once the page is completed
---

{% include_relative _includes/configuration-variables.md notitle='yes' os='none' %}

## Introduction

Even if the general scope of this site is to provide tutorials to set-up a development environment of *OpenStreetMap Carto* and offer recommendations to edit the style, this page describes how to keep the PostgreSQL/PostGIS database in sync with OpenStreetMap as people edit data.

After the initial load of a PBF extract (or of the whole "planet") into the PostgreSQL/PostGIS database, there might be a need to keep data up to date. OpenStreetMap provides [minutely, hourly and daily change files](http://wiki.openstreetmap.org/wiki/Planet.osm/diffs) that can be applied to a replicated database so that it can be kept in sync with the master OSM db: each time a user uploads a modification to OSM (addition, update, change, deletion of features), the change can be replicated to a database synched with the master data within the selected timeframe.

NOTA!!!!: spiegaare che ci sono diversi approcci: [Osmosis](http://wiki.openstreetmap.org/wiki/Osmosis), oppure [Osmconvert](http://wiki.openstreetmap.org/wiki/Osmconvert) and [Osmupdate](http://wiki.openstreetmap.org/wiki/Osmupdate)

Using Osmosis, osm-history-splitter, or osmconvert
Using Geofabrik
[Geofabrik](http://www.geofabrik.de/) provides an [updated version of the planet dataset](https://download.geofabrik.de/technical.html) from the latest OpenStreetMap data, already splitted into a number of [pre-defined regions](https://download.geofabrik.de/). When using Geofabrik to download the initial dataset to the local database, data can be kept updated by applying diff update files (differences between the new extract and the previous one) that Geofabrik also computes each time a new exctract is produced for a region. Using diff files of the same region of the initial download, users can continuously update their own regional extract instead of having to download the full file.


https://github.com/posm/posm/issues/17

https://blog.jochentopf.com/2017-02-06-expedicious-and-exact-extracts-with-osmium.html

https://manned.org/osmosis.1
https://manned.org/osmconvert.1
https://manned.org/osmfilter.1
Osmosis and osmupdate.






OpenStreetMap allows this by exploiting the [replication feature](http://wiki.openstreetmap.org/wiki/Osmosis/Replication) through a tool named [Osmosis](http://wiki.openstreetmap.org/wiki/Osmosis), which is a general-purpose command line Java OSM data utility for processing OSM data, described in the [Replication Tasks](http://wiki.openstreetmap.org/wiki/Osmosis/Detailed_Usage_0.45#Replication_Tasks) section of the related [usage page](http://wiki.openstreetmap.org/wiki/Osmosis/Detailed_Usage); one of the features that Osmosis can do is to update a database with recent changes from OSM.

Osmosis can be downloaded (e.g., from its [GitHub repository](https://github.com/openstreetmap/osmosis)) and installed as part of a tile server to enable the function of data replication via periodic syncs. More specifically, it allows automating the process of downloading the proper "replication files" which are produced by OpenStreetMap in [OSC (Open Street Map Change) change file format](http://wiki.openstreetmap.org/wiki/OsmChange). Then generally [Osm2pgsql](http://wiki.openstreetmap.org/wiki/Osm2pgsql) is used to import the downloaded changes into the PostgreSQL/PostGIS database (through the `--append` option).

## Manually merging distinct areas into PostgreSQL

After the initial import of OpenStreetMap data (e.g., a PBF file) into your PostgreSQL database via Osm2pgsql, it might be needed to manually merge other distinct / non-overlapping areas (e.g., included in separate PBF files).

Check this [Q&A](https://gis.stackexchange.com/questions/186754/how-to-quickly-load-two-distinct-areas-into-postgis-without-using-append-flag).
{: .red}

[Osmconvert](http://wiki.openstreetmap.org/wiki/Osmconvert) is a command line tool to convert and process OpenStreetMap files.
{: .red}

Sources: http://m.m.i24.cc/osmconvert.c
{: .red}

## Keeping the PostgreSQL database up to date

The following procedure explains how to setup *Osmosis* to keep the tile server and the PostgreSQL database up-to-date with the latest OSM data.

This paragraph is currently in early stage, not yet tested and revised. Information at the moment is largely taken from the *Updating* paragraph of [Building a tile server from packages](https://switch2osm.org/serving-tiles/building-a-tile-server-from-packages) page within [switch2osm.org](https://switch2osm.org). Another used font is [Ubuntu 1604 tileserver load](https://wiki.openstreetmap.org/wiki/User:SomeoneElse/Ubuntu_1604_tileserver_load) by SomeoneElse.
{: .red}

After importing the initial database with *osm2pgsql* as described in "[Get an OpenStreetMap data extract](../tile-server-ubuntu#get-an-openstreetmap-data-extract)" (you will need to have used the *-slim* option in the initial import to allow for updating), you need to do the following steps.

Install *Osmosis*:

    sudo apt-get install osmosis

After installing Osmosis, you can [go on with setup](#continue-set-up).

### Compile Osmosis from source

The following procedure allows compiling Osmosis from source.

Update Ubuntu and Install essential tools:

    sudo apt-get update
    sudo apt-get -y upgrade
    sudo apt-get -y install curl unzip gdal-bin tar wget bzip2 build-essential clang

Install Java JRE and JDK:

    sudo apt-get -y install default-jre
    sudo apt-get -y install default-jdk

Install Gradle:

    sudo apt -y install gradle

Download a data extract:

    curl http://download.geofabrik.de/europe/liechtenstein-latest.osm.pbf --output data.osm.pbf

Clone 'osmosis' repository:

    git clone https://github.com/openstreetmap/osmosis

Compile Osmosis:

    ./gradlew assemble

Test Osmosis following [wiki](http://wiki.openstreetmap.org/wiki/Osmosis) examples:

    package/bin/osmosis --read-pbf ../../../data.osm.pbf --node-key-value keyValueList="highway.speed_camera" --write-xml radar.osm
    
    package/bin/osmosis --read-pbf ../../../data.osm.pbf --tf accept-ways highway=* --used-node --write-xml highways.osm

Current version of Osmosis when compiled from sources at the time of writing: 0.45-52-gd4e52fd-SNAPSHOT

## Continue set-up


NOTA!!!!: Spiegare che se si tiene aggiornato tutto il pianeta occorrono molte risorse


I use minutely updates together with trim_osc.py from Zverik's "regional": 

https://github.com/Zverik/regional

to add a "filtering diff" section between "downloading diff" and 
"importing diff" in openstreetmap-tiles-update-expire .  I find it works 
very well at keeping a small area updated; I use it with a bounding box 
but it should work with a polygon too, I believe. 


A Python script named [trim_osc.py](https://github.com/Zverik/regional/blob/master/trim_osc.py) and developed by [Zverik](https://github.com/Zverik) within his repository of [Tools for OSM regional extract support](https://github.com/Zverik/regional) allows to trim down the updates from OpenStreetMap to a bounding box or a polygon related to just the area that we are interested in. The [Github README](https://github.com/Zverik/regional#trim_oscpy) describes its usage. We do this in order to be able to maintain the OSM tile service with a server of limited RAM and disk capacity, so that the PostgreSQL database doesn't grow significantly as updates are applied to it.

To install it:

    cd ~/src
    git clone https://github.com/zverik/regional
    chmod u+x ~/src/regional/trim_osc.py
    sudo apt-get install -y python-psycopg2 python-shapely python-lxml

[mod_tile](https://github.com/openstreetmap/mod_tile/) includes a helper script named [openstreetmap-tiles-update-expire](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire), which calls Osmosis to download a diff stream from OpenStreetMap and also expires tiles based on those updates, keeping the tile server up to date by applying changes to the PostgreSQL/PostGIS database using osm2pgsql. Its [man Page]({{ site.baseurl }}/manpage.html?url=https://raw.githubusercontent.com/openstreetmap/mod_tile/master/docs/openstreetmap-tiles-update-expire.1){:target="_blank"} describes the usage. This script will either initialize a replication system (when executed with the single argument YYYY-MM-DD) or run a replication to sync the OSM master database to a local database. In the former case (with argument), the date of the planet file obtained through a previously performed *osm2pgsql* import can be used as argument (the command to get the date of today would be: `date -u +"%Y-%m-%dT%H:%M:%SZ"`). In the latter case (when executed with *no* arguments), the script automatically determines the previous sync timestamp and downloads an update from OSM for a certain interval, as defined in `$WORKOSM_DIR/configuration.txt`.



AFQ
{: .red}

occorre editare lo script

notare che http://osm.personalwerk.de punta a:
https://github.com/MaZderMind/replicate-sequences

OSM2PGSQL_OPTIONS="-E 4326 --number-processes 2 --style /usr/local/share/osm2pgsql/default.style --hstore -G -v --username import --database osm -C 500"
mi sa che manca il LUA!!!!
 

You'll need to have a look at that to see what needs to be changed so that it expires tiles based on your own changes. The one that comes with mod_tile initialises replication to look here by default (the file /var/lib/mod_tile/.osmosis/configuration.txt is created when you initialise replication).



Grant rights to the update tables to user *{{ pg_login }}*:

    sudo /usr/bin/install-postgis-osm-user.sh gis {{ pg_login }}

Initialise the *osmosis* replication stack to the data of your data import. Choose the date of the planet data, as this is the date from which the diffs will start.

    sudo -u {{ pg_login }} /usr/bin/openstreetmap-tiles-update-expire `date -u +"%Y-%m-%dT%H:%M:%SZ"`

As the packaged script currently uses an outdated service to determine the correct replication start-point, you will need to manually choose and download the correct *state.txt* from the *base_url* (see below) which corresponds to slightly before the age of the extract to make sure all modifications are included in your db. This needs to be copied to `/var/lib/mod_tile/.osmosis/state.txt`.

You will next need to update the default configuration of *osmosis*. In `/var/lib/mod_tile/.osmosis/configuration.txt` change the `base_url` to `http://planet.openstreetmap.org/replication/minute/`

Update your tileserver by up to an hour and expire the corresponding rendered tiles:

    sudo -u {{ pg_login }} /usr/bin/openstreetmap-tiles-update-expire

If your tile server is behind more than an hour you will need to call the *openstreetmap-tiles-expire* script multiple times. If you want to continuously keep your server up to data, you need to add the *openstreetmap-tiles-expire* script to your crontab.

Keeping the data up-to-date can be resource intense, in particular because after the import you may already be multiple days behind. Consider changing *maxInterval* in `/var/lib/mod_tile/.osmosis/configuration.txt` to 21600 (six hours) till you have caught up. Further, add *–number-processes 2* to the 

*osm2pgsql* command in `/usr/bin/openstreetmap-tiles-update-expire` or a higher number if this is appropriate for your hardware.

The initial install installed pre-processed coastlines, from time to time it may make sense to replace the files with new versions:

    wget http://tile.openstreetmap.org/processed_p.tar.bz2

and extract it to

    /etc/mapnik-osm-data/world_boundaries/


--------------------------

We use osmconvert (and osmupdate) instead of osmosis. In my experience 
that is faster. An hourly update of our extract, including calculating 
the diff and generating the new pbf, takes about 1 minute. 

So you shouldn't do this minutely, but depending on the speed of your 
machine you can have quite frequent updates. We still consume minutely 
diffs, the aggregation is handled by osmupdate. 

You can have a look at our extract and diffs on planet.osm.ch. We also 
render maps based on these diffs at osm.ch 
