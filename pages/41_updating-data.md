---
layout: page
title: Keeping PostGIS in sync with OSM
permalink: /updating-data/
comments: true
rendering-note: this page is best viewed with Jekyll rendering
sitemap: false # remove this once the page is completed
---

## Introduction

This page describes how to keep the PostgreSQL/PostGIS database in sync with OpenStreetMap as data is progressively updated. The information here provided is general and not necessarily comprehensive, also in the consideration that the main scope of this site is to provide tutorials to set-up a development environment of *OpenStreetMap Carto* and offer recommendations to edit the style.

After the initial load of a [PBF extract](https://wiki.openstreetmap.org/wiki/PBF_Format) (or of the whole "planet") into the PostgreSQL/PostGIS database, in order to keep data up to date, OpenStreetMap offers minutely, hourly and daily change files in compressed xml format, also called [diff files or replication diffs](http://wiki.openstreetmap.org/wiki/Planet.osm/diffs), periodically collecting uploaded and closed [changesets](https://wiki.openstreetmap.org/wiki/Changeset) (where each changeset groups single edits like additions, updates, changes, deletions of features).

A number of tools have been developed to get, analyze and process incremental OpenStreetMap update files into a PostGIS database. Among them, some notable ones are:

- [Osmosis](http://wiki.openstreetmap.org/wiki/Osmosis), a command line Java application with pluggable components for downloading and processing OSM data, generate dumps and apply change sets to a database;
- [Osmconvert](http://wiki.openstreetmap.org/wiki/Osmconvert), a command line tool written in C allowing fast conversion and processing of different OpenStreetMap data formats;
- [Osmupdate](http://wiki.openstreetmap.org/wiki/Osmupdate), a small and fast a command line tool written in C to download and assemble OSM Changefiles;
- [Osmfilter](https://wiki.openstreetmap.org/wiki/Osmfilter), a command line tool used to filter OpenStreetMap data files for specific tags;
- [Osmium](http://osmcode.org/), a multipurpose command line tool to convert OSM files formats, merge and apply change files;
- [Imposm](https://imposm.org/), a full-featured importer for PBF OpenStreetMap data to PostgreSQL/PostGIS written in GO which can also automatically update the database with the latest changes from OSM.

For the replication process, we assume that the database is created and that an initial import has already been made through [Osm2pgsql](http://wiki.openstreetmap.org/wiki/Osm2pgsql), as described in "[Get an OpenStreetMap data extract](../tile-server-ubuntu#get-an-openstreetmap-data-extract)". (Notice that `-s` or `--slim` option is needed for the initial import to allow subsequent updates through `-a` or `--append`.)

## Keeping the PostgreSQL database up to date with Osmosis

The following procedure explains how to setup *Osmosis* to keep the tile server and the PostgreSQL/PostGIS database up-to-date with the latest OSM data.

[Osmosis](http://wiki.openstreetmap.org/wiki/Osmosis) is a general-purpose command-line Java-based OSM data tool which provides many capabilities including the function to [replicate](http://wiki.openstreetmap.org/wiki/Osmosis/Replication) OpenStreetMap data in [OSC (Open Street Map Change) change file format](http://wiki.openstreetmap.org/wiki/OsmChange) via periodic syncs. The replication tasks are described in a [specific section](http://wiki.openstreetmap.org/wiki/Osmosis/Detailed_Usage_0.45#Replication_Tasks) of the related [usage page](http://wiki.openstreetmap.org/wiki/Osmosis/Detailed_Usage).

This software is maintained in its [GitHub repository](https://github.com/openstreetmap/osmosis)).

To automate the process of downloading the replication diffs and importing the changes into the PostgreSQL/PostGIS database, a scheduled script is needed; generally this script links the *Osmosis* output to the *osm2pgsql* input through a [pipe](https://en.wikipedia.org/wiki/Pipeline_(Unix)) and is scheduled via [cron](https://en.wikipedia.org/wiki/Cron).

### Installing Osmosis

The following command installs Osmosis from package:

    sudo apt-get -y install osmosis

After completing the installation, you can [go on with other setup steps](#continue-set-up).

### Compiling Osmosis from sources

Alternatively to installing software from package, the following procedure allows compiling Osmosis from sources.

Update Ubuntu and install essential tools:

```shell
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get -y install curl unzip gdal-bin tar wget bzip2 build-essential clang
```

Install Java JRE and JDK:

```shell
sudo apt-get -y install default-jre
sudo apt-get -y install default-jdk
```

Install Gradle:

    sudo apt -y install gradle

Clone 'osmosis' repository:

    cd ~/src
	git clone https://github.com/openstreetmap/osmosis

Compile Osmosis:

     cd osmosis
	./gradlew assemble

Test Osmosis following [wiki](http://wiki.openstreetmap.org/wiki/Osmosis) examples:

```shell
curl http://download.geofabrik.de/europe/liechtenstein-latest.osm.pbf --output data.osm.pbf
package/bin/osmosis --read-pbf data.osm.pbf --node-key-value keyValueList="highway.speed_camera" --write-xml radar.osm    
package/bin/osmosis --read-pbf data.osm.pbf --tf accept-ways highway=* --used-node --write-xml highways.osm
```

Current version of Osmosis when compiled from sources at the time of writing:

    package/bin/osmosis --version 2>&1 | grep "Osmosis Version"
    INFO: Osmosis Version 0.46-SNAPSHOT

Link the *osmosis* command to */usr/bin*:

    sudo ln -s "$PWD"/package/bin/osmosis /usr/bin/osmosis

Final check:

    cd
	osmosis --version 2>&1 | grep "Osmosis Version"

### Continue set-up

As Osmosis is a java program, you may need to specify appropriate options to the JVM like memory usage (e.g., increasing it with the `-Xmx` option)  or temporary directory (e.g, something other than */tmp/*). You can set for instance the *JAVACMD_OPTIONS* environment variable like in the following example:

    export JAVACMD_OPTIONS="-Xmx2G -Djava.io.tmpdir=/some/other/path/than/tmp/"

You can also add the above command to the *.osmosis* file in your home directory (or *C:\Users\<user name>\osmosis.bat* with Windows, replacing `export` with `set`).

    WORKOSM_DIR=/home/{{ pg_login }}/osmosisworkingdir
    mkdir -p $WORKOSM_DIR ; cd $WORKOSM_DIR

### Configuring Osmosis

Two configuration files are needed: *state.txt* and *configuration.txt*.

To create a default configuration file for osmosis, first remove any previous exixting configuration file:

    rm -f configuration.txt

then run the following (e.g., `--rrii` option):

    osmosis --read-replication-interval-init

A default *configuration.txt* file and another one named *download.lock* will be created. *download.lock* can be ignored (as used by Osmosis to ensure that only one copy is running at a time). You might need to manually edit *configuration.txt* and change the url to the one of minute or hourly replicate. By default, this points to minutely diffs (`baseUrl=http://planet.openstreetmap.org/replication/minute`). If you want hourly or daily you should edit the file so that it references the related replication diffs URLs: `https://planet.openstreetmap.org/replication/hour/`, or `https://planet.openstreetmap.org/replication/day/`.

*configuration.txt* shall at least include *baseUrl* and *maxInterval*. A Java exception occurs in case one of these two is missing (e.g., `SEVERE: Thread for task 1-read-replication-interval failed`).

Keeping the data up-to-date can be resource intensive. *maxInterval* controls how much data Osmosis will download in a single invocation and by default is set to 3600, meaning one hour of changes a time (even if you are using minutely updates). After the download, Osm2pgsql applies them to the database. Depening on the size of the area, on the number of changes and on how complex they are, one run can be immediate, take many seconds, a few minutes or more than one hour. For a quicker feedback it is worthwhile to change the maxInterval value to something lower (e.g., 60 seconds to just download one minute at a time which should only take a few seconds to apply). If you have instead lot of changes to catch up, you can tune it to a higher value (e.g., changing it to maxInterval = 21600, meaning six hours, 86400 for one day, 604800 for one week). Setting to 0 disables this feature.[^2]

Once the process finishes you can check the state.txt file. The time stamp and sequence number should have changed to reflect the update that was applied.

The *state.txt* file contains information about the version (*sequenceNumber*) and the timestamp of the osm/pbf file and you need to get the state.txt file that corresponds to the file you downloaded.

Example of command to get the *state.txt file:

```shell
WORKOSM_DIR=/home/{{ pg_login }}/osmosisworkingdir
wget https://planet.openstreetmap.org/replication/hour/000/003/000.state.txt -O "$WORKOSM_DIR/state.txt"
```

To find the appropriate sequence number by timestamp you can either look through the diff files, or use [Peter Körner's website tool](https://replicate-sequences.osm.mazdermind.de/). You can change the url of the above command with the one returned by this utility or simply create a *state.txt* file including the whole output.

Resetting the sequenceNumber to an earlier state can always be done by changing the sequenceNumber entry.

Each call to *osmosis* check for new updates will compare the local *state.txt* with the current one on the service.

### Implementing the update procedure

Once configuration.txt and state.txt are correctly created, a simple procedure to keep the DB updated is through the following pipeline, which exploits *osmosis* and *osm2pgsql*:

```shell
export PGPORT=5432
export PGPASSWORD={{ pg_password }}
cd ~/src/openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name
osmosis --read-replication-interval workingDirectory="${WORKOSM_DIR}" --simplify-change --write-xml-change - | \
osm2pgsql --append -s -C 300 -G --hstore --style openstreetmap-carto.style --tag-transform-script openstreetmap-carto.lua -d gis -H $HOSTNAME -U postgres -
```

Its related diagram is the following:

|configuration.txt ![txt][txt]| |Openstreetmap Changes ![xml][xml]|
|                             |↘|↓                  |
|state.txt ![txt][txt]|→|*Osmosis* ![prg][prg]|→|*Osm2pgsql* ![prg][prg]|
|                     |↙|                   | |↓|
|state.txt ![txt][txt]| |                   | |PostgreSQL PostGIS ![db][db]|
{: .drawing}




{% comment %}



TUTTO QUESTO DI SEGUITO NON FUNZIONA!!!!!!
To limit the downloaded data to a specific bounding box, add the related `--bounding-box` option to the osmosis command; example: `--bounding-box top=$maxlat left=$minlon bottom=$minlat right=$maxlon`. Alternatively, you can define a polygon and use the `--bounding-polygon` option. The [Geofabrik downloads server](https://download.geofabrik.de/) gives the .poly files they use to generate their country/region extracts. For instance, the .poly file for Liechtenstein that describes the extent of this region can be downloaded with the following command:

    cd $WORKOSM_DIR
	wget https://download.geofabrik.de/europe/liechtenstein.poly

Then, the related argument to add to osmosis is the following: `--bounding-polygon "${WORKOSM_DIR}/liechtenstein.poly"`


<





http://ksmapper.blogspot.it/2011/04/keeping-database-up-to-date-with.html








## Using Osmosis with an extract downloaded from Geofabrik

By default, the *baseUrl* parameter in *configuration.txt* points to the whole planet. If you are using an extract, for instance downloaded from [Geofabrik](http://download.geofabrik.de/), you should  change the url basing on the metadata of the PBF file; *osmium* is a tool which among other things allows the analisys of a PBF file; it can be installed through:

    sudo apt -y install osmium-tool

The command to analyze a PBF file is the following:

    PBF_FILE=liechtenstein-latest.osm.pbf
	osmium fileinfo $PBF_FILE

The osmosis properties returned by this command can be used to configure *osmosis*. Values have to be transformed and this can be automatically done through a simple parser that generates a working *configuration.txt*[^1]:

```shell
PBF_FILE=liechtenstein-latest.osm.pbf
REPLICATION_BASE_URL="$(osmium fileinfo -g 'header.option.osmosis_replication_base_url' "${PBF_FILE}")"
echo -e "baseUrl=${REPLICATION_BASE_URL}\nmaxInterval=3600" > "${WORKOSM_DIR}/configuration.txt"
```

So, the above command can be used to produce *configuration.txt* from a PBF file downloaded by *Geofabrik.de*.

Subsequently, the command to generate *state.txt* is the following[^1]:

    REPLICATION_SEQUENCE_NUMBER="$( printf "%09d" "$(osmium fileinfo -g 'header.option.osmosis_replication_sequence_number' "${PBF_FILE}")" | sed ':a;s@\B[0-9]\{3\}\>@/&@;ta' )"
    curl -s -L -o "${WORKOSM_DIR}/state.txt" "${REPLICATION_BASE_URL}/${REPLICATION_SEQUENCE_NUMBER}.state.txt"

A simple procedure to keep the DB updated is through the following pipeline which exploits *osmosis* and *osm2pgsql*:

```shell
WORKOSM_DIR=/home/{{ pg_login }}/osmosisworkingdir
export PGPORT=5432
export PGPASSWORD={{ pg_password }}
cd ~/src/openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name
osmosis --read-replication-interval workingDirectory=${WORKOSM_DIR} --simplify-change --write-xml-change - | \
osm2pgsql --append -s -C 300 -G --hstore --style openstreetmap-carto.style --tag-transform-script openstreetmap-carto.lua -d gis -H $HOSTNAME -U postgres -
```

Its related diagram is the following:

|configuration.txt ![txt][txt]| |Openstreetmap Changes ![xml][xml]|
|                             |↘|↓                  |
|state.txt ![txt][txt]|→|*Osmosis* ![prg][prg]|→|*Osm2pgsql* ![prg][prg]|
|                     |↙|                   | |↓|
|state.txt ![txt][txt]| |                   | |PostgreSQL PostGIS ![db][db]|
{: .drawing}

https://gis.stackexchange.com/questions/94352/update-database-via-osmosis-and-osm2pgsql-too-slow
http://www.geofabrik.de/media/2012-09-08-osm2pgsql-performance.pdf
file:///C:/Users/alberto/Downloads/OSM%20tiles%20server.pdf


NOTA!!!!: Spiegare che se si tiene aggiornato tutto il pianeta occorrono molte risorse


I use minutely updates together with trim_osc.py from Zverik's "regional": 

https://github.com/Zverik/regional

to add a "filtering diff" section between "downloading diff" and 
"importing diff" in openstreetmap-tiles-update-expire .  I find it works 
very well at keeping a small area updated; I use it with a bounding box 
but it should work with a polygon too, I believe. 


A Python script named [trim_osc.py](https://github.com/Zverik/regional/blob/master/trim_osc.py) and developed by [Zverik](https://github.com/Zverik) within his repository of [Tools for OSM regional extract support](https://github.com/Zverik/regional) allows to trim down the updates from OpenStreetMap to a bounding box or a polygon related to just the area that we are interested in. The [Github README](https://github.com/Zverik/regional#trim_oscpy) describes its usage. We do this in order to be able to maintain the OSM tile service with a server of limited RAM and disk capacity, so that the PostgreSQL database doesn't grow significantly as updates are applied to it.

To install it:

```shell
cd ~/src
git clone https://github.com/zverik/regional
chmod u+x ~/src/regional/trim_osc.py
sudo apt-get install -y python-psycopg2 python-shapely python-lxml
```

[mod_tile](https://github.com/openstreetmap/mod_tile/) includes a helper script named [openstreetmap-tiles-update-expire](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire), which calls Osmosis to download a diff stream from OpenStreetMap and also expires tiles based on those updates, keeping the tile server up to date by applying changes to the PostgreSQL/PostGIS database using osm2pgsql. Its [man Page]({{ site.baseurl }}/manpage.html?url=https://raw.githubusercontent.com/openstreetmap/mod_tile/master/docs/openstreetmap-tiles-update-expire.1){:target="_blank"} describes the usage. This script will either initialize a replication system (when executed with the single argument YYYY-MM-DD) or run a replication to sync the OSM master database to a local database. In the former case (with argument), the date of the planet file obtained through a previously performed *osm2pgsql* import can be used as argument (the command to get the date of today would be: `date -u +"%Y-%m-%dT%H:%M:%SZ"`). In the latter case (when executed with *no* arguments), the script automatically determines the previous sync timestamp and downloads an update from OSM for a certain interval, as defined in `$WORKOSM_DIR/configuration.txt`.



AFQ
{: .red}

occorre editare lo script

notare che http://osm.personalwerk.de punta a:
https://github.com/MaZderMind/replicate-sequences

OSM2PGSQL_OPTIONS="-E 4326 --number-processes 2 --style /usr/local/share/osm2pgsql/default.style --hstore -G -v --username import --database osm -C 500"
mi sa che manca il LUA!!!!
manca anche --slim e --drop 

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

The initial install installed pre-processed coastlines, from time to time it may make sense to replace the files with new versions:

    wget http://tile.openstreetmap.org/processed_p.tar.bz2

and extract it to

    /etc/mapnik-osm-data/world_boundaries/



It is no problem to specify a date and time earlier than the actual timestamp of your initial data import. Applying a change twice is fine. It just updates the data to the same values it had before. This is why it is safe to go back an hour from your time stamp. However if you miss an update, all the objects affected by that update will be out of sync with the master database until (if ever) they are updated again.[^2]
	
	
	
	
	
	
	
To schedule the update procedure, the *osmosis* pipeline can be packaged in a script and put into a minutely or hourly cron job. It is safe to call osmosis every minute, as it puts a lock on the *download.lock* file and if the previous run is still executing, the next one will exit immediately without doing anything. You might want to redirect stdout and stderr to either a log file or /dev/null to avoid cron sending out emails every time the script runs.

Create a file named *osmosis-update.sh*

    cd /home/{{ pg_login }}/osmosisworkingdir
    vi osmosis-update.sh

Include the following content:

```shell
#!/usr/bin/env bash

test "$1" || exec 2>/dev/null
set -euf -o pipefail

WORKOSM_DIR=/home/{{ pg_login }}/osmosisworkingdir
export PGPORT=5432
export PGPASSWORD={{ pg_password }}
cd ~/src/openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name
osmosis --read-replication-interval workingDirectory=${WORKOSM_DIR} --simplify-change --write-xml-change - | \
osm2pgsql --append -s -C 300 -G --hstore --style openstreetmap-carto.style --tag-transform-script openstreetmap-carto.lua -d gis -H $HOSTNAME -U postgres -
```

Save and test it:

    chmod +x /home/{{ pg_login }}/osmosisworkingdir/osmosis-update.sh
    /home/{{ pg_login }}/osmosisworkingdir/osmosis-update.sh display

A sample of *cron* job is the following:

    * * * * * /home/{{ pg_login }}/osmosisworkingdir/osmosis-update.sh >> /home/{{ pg_login }}/osmosisworkingdir/osmosis.log 2>&1

	
	



## Note to be processed

https://github.com/geometalab/osmaxx/wiki/Updating-the-planet---extracting-data
https://mygisnotes.wordpress.com/tag/osm/

Using Geofabrik
[Geofabrik](http://www.geofabrik.de/) provides an [updated version of the planet dataset](https://download.geofabrik.de/technical.html) from the latest OpenStreetMap data, already splitted into a number of [pre-defined regions](https://download.geofabrik.de/). When using Geofabrik to download the initial dataset to the local database, data can be kept updated by applying diff update files (differences between the new extract and the previous one) that Geofabrik also computes each time a new exctract is produced for a region. Using diff files of the same region of the initial download, users can continuously update their own regional extract instead of having to download the full file.


https://github.com/posm/posm/issues/17

https://blog.jochentopf.com/2017-02-06-expedicious-and-exact-extracts-with-osmium.html

https://manned.org/osmosis.1
https://manned.org/osmconvert.1
https://manned.org/osmfilter.1
Osmosis and osmupdate.







## Manually merging distinct areas into PostgreSQL

After the initial import of OpenStreetMap data (e.g., a PBF file) into your PostgreSQL database via Osm2pgsql, it might be needed to manually merge other distinct / non-overlapping areas (e.g., included in separate PBF files).

Check this [Q&A](https://gis.stackexchange.com/questions/186754/how-to-quickly-load-two-distinct-areas-into-postgis-without-using-append-flag).
{: .red}

[Osmconvert](http://wiki.openstreetmap.org/wiki/Osmconvert) is a command line tool to convert and process OpenStreetMap files.
{: .red}

Sources: http://m.m.i24.cc/osmconvert.c
{: .red}




This paragraph is currently in early stage, not yet tested and revised. Information at the moment is largely taken from the *Updating* paragraph of [Building a tile server from packages](https://switch2osm.org/serving-tiles/building-a-tile-server-from-packages) page within [switch2osm.org](https://switch2osm.org). Another used font is [Ubuntu 1604 tileserver load](https://wiki.openstreetmap.org/wiki/User:SomeoneElse/Ubuntu_1604_tileserver_load) by SomeoneElse.
{: .red}






{% endcomment %}

--------------------------

{% include pages/images.md %}

[^1]: [Paul’s Blog - It Starts With the Planet](http://www.paulnorman.ca/blog/2018/01/it-starts-with-the-planet/)
[^2]: [Toby's Blog of open/mappy things](http://ksmapper.blogspot.it/2011/04/keeping-database-up-to-date-with.html)