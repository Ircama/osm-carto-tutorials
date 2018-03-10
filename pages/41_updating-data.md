---
layout: page
title: Keeping the local database in sync with OSM
permalink: /updating-data/
comments: true
rendering-note: this page is best viewed with Jekyll rendering
sitemap: false # remove this once the page is completed
---

{% include_relative _includes/configuration-variables.md notitle='yes' %}

## Introduction

This page describes how to keep the local PostgreSQL/PostGIS database in sync with OpenStreetMap as data is progressively updated to OSM. The information here provided is general and not necessarily comprehensive, also in the consideration that the main scope of this site is to provide tutorials to set-up a development environment of *OpenStreetMap Carto* and offer recommendations to edit the style.

After the initial load of a [PBF extract](https://wiki.openstreetmap.org/wiki/PBF_Format) (or of the whole "planet") into the PostgreSQL/PostGIS database, in order to keep data up to date, OpenStreetMap offers minutely, hourly and daily change files in compressed xml format, also called [diff files, or replication diffs, or osmChange files](https://wiki.openstreetmap.org/wiki/Planet.osm/diffs), periodically collecting uploaded and closed [changesets](https://wiki.openstreetmap.org/wiki/Changeset) (where each changeset groups single edits like additions, updates, changes, deletions of features).

A number of tools have been developed to get, analyze and process incremental OpenStreetMap update files into a PostGIS database. Among them, some notable ones are:

- [Osmosis](https://wiki.openstreetmap.org/wiki/Osmosis), a command line Java application with pluggable components for downloading and processing OSM data, generate dumps and apply change sets to a database;
- [Osmconvert](https://wiki.openstreetmap.org/wiki/Osmconvert), a command line tool written in C allowing fast conversion and processing of different OpenStreetMap data formats;
- [Osmupdate](https://wiki.openstreetmap.org/wiki/Osmupdate), a small and fast a command line tool written in C to download and assemble OSM Changefiles;
- [Osmfilter](https://wiki.openstreetmap.org/wiki/Osmfilter), a command line tool used to filter OpenStreetMap data files for specific tags;
- [Osmium](http://osmcode.org/), a multipurpose command line tool to work with OpenStreetMap data files, convert OSM files formats, merge and apply change files;
- [Imposm](https://imposm.org/), a full-featured importer for PBF OpenStreetMap data to PostgreSQL/PostGIS written in GO which can also automatically update the database with the latest changes from OSM.

For the replication process, we assume that the database is created and that an initial import has already been made through [Osm2pgsql](https://wiki.openstreetmap.org/wiki/Osm2pgsql), as described in "[Get an OpenStreetMap data extract](../tile-server-ubuntu#get-an-openstreetmap-data-extract)". (Notice that `-s` or `--slim` option is needed for the initial import to allow subsequent updates through `-a` or `--append`.)

## Keeping the PostgreSQL database up to date with Osmosis

The following procedure explains how to setup *Osmosis* in order to keep the tile server and the PostgreSQL/PostGIS database up-to-date with the latest OSM data.

[Osmosis](https://wiki.openstreetmap.org/wiki/Osmosis) is a general-purpose command-line Java-based OSM data tool which provides many capabilities including the function to [replicate](https://wiki.openstreetmap.org/wiki/Osmosis/Replication) OpenStreetMap data in [OSC (Open Street Map Change) change file format](https://wiki.openstreetmap.org/wiki/OsmChange) via periodic syncs. The replication tasks are described in a [specific section](https://wiki.openstreetmap.org/wiki/Osmosis/Detailed_Usage_0.45#Replication_Tasks) of the related [usage page](https://wiki.openstreetmap.org/wiki/Osmosis/Detailed_Usage).

This software is maintained in its [GitHub repository](https://github.com/openstreetmap/osmosis).

To automate the process of downloading the replication diffs and importing the changes into the PostgreSQL/PostGIS database, a scheduled script is needed; generally this script links the *Osmosis* output to the *osm2pgsql* input through a [pipe](https://en.wikipedia.org/wiki/Pipeline_(Unix)) and can be scheduled via [cron](https://en.wikipedia.org/wiki/Cron).

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

    sudo apt-get -y install gradle

Clone 'osmosis' repository:

    cd ~/src
	git clone https://github.com/openstreetmap/osmosis

Compile Osmosis:

     cd osmosis
	./gradlew assemble

Test Osmosis following [wiki](https://wiki.openstreetmap.org/wiki/Osmosis) examples:

```shell
curl https://download.geofabrik.de/europe/liechtenstein-latest.osm.pbf --output data.osm.pbf
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

    osmosis --read-replication-interval-init workingDirectory=$WORKOSM_DIR

A default *configuration.txt* file and another one named *download.lock* will be created. *download.lock* can be ignored (as used by Osmosis to ensure that only one copy is running at a time).

A current [issue](https://trac.openstreetmap.org/ticket/5483) with Osmosis is that it creates a default configuration with a *http* url instead of using *https*. Fortunately, it can be fixed by manually adjusting the *configuration.txt* file, by substituting *http* with *https*; then all updates will use the new url.

You might also need to edit *configuration.txt* and change the replication period. By default, this points to minutely diffs (`baseUrl=https://planet.openstreetmap.org/replication/minute`). If you want hourly or daily you should edit the file so that it references the related replication diffs URLs: `https://planet.openstreetmap.org/replication/hour/`, or `https://planet.openstreetmap.org/replication/day/`.

Notice that the URL shall use https and not http.

*configuration.txt* shall at least include *baseUrl* and *maxInterval*. A Java exception occurs in case one of these two is missing (e.g., `SEVERE: Thread for task 1-read-replication-interval failed`).

Keeping the data up-to-date can be resource intensive. *maxInterval* controls how much data Osmosis will download in a single invocation and by default is set to 3600, meaning one hour of changes a time (even if you are using minutely updates). After the download, Osm2pgsql applies them to the database. Depending on the size of the area, on the number of changes and on how complex they are, one run can be immediate, take many seconds, a few minutes, or more than one hour. For testing, it is worthwhile to change the maxInterval value to something lower (e.g., 60 seconds to just download one minute at a time which should only take a few seconds to apply). If you have instead lot of changes to catch up, you can tune it to a higher value (e.g., changing it to maxInterval = 21600, meaning six hours, 86400 for one day, 604800 for one week). Setting to 0 disables this feature.[^2]

The *state.txt* file contains information about the version (*sequenceNumber*) and the timestamp of the osm/pbf file and you need to get the state.txt file that corresponds to the file you downloaded.

Once the process finishes you can check the *state.txt* file. The timestamp and sequence number should have changed to reflect the update that was applied.

Example of command to get the *state.txt* file:

    wget https://planet.openstreetmap.org/replication/hour/000/003/000.state.txt -O "$WORKOSM_DIR/state.txt"

To find the appropriate sequence number by timestamp you can either look through the diff files, or use the [Peter Körner's website tool](https://replicate-sequences.osm.mazdermind.de/). You can change the url of the above command with the one returned by this utility or simply create a *state.txt* file including the whole output.

Alternative command:

    wget "https://replicate-sequences.osm.mazdermind.de/?"`date -u +"%Y-%m-%d"`"T00:00:00Z" -O $WORKOSM_DIR/state.txt

Resetting the sequenceNumber to an earlier state can always be done by changing the sequenceNumber entry.

Each call to *osmosis* will compare the local *state.txt* with the current one on the service.

It is no problem to specify a date and time earlier than the actual timestamp of your initial data import. Applying a change twice is fine. It just updates the data to the same values it had before. This is why it is safe to go back an hour from your time stamp. However if you miss an update, all the objects affected by that update will be out of sync with the master database until (if ever) they are updated again.[^2]

### Implementing the update procedure

Once *configuration.txt* and *state.txt* are correctly created, a sequence of commands including a processing pipeline can be tested to keep the DB updated with *osmosis* and *osm2pgsql*:

```shell
export PGPORT=5432
export PGPASSWORD={{ pg_password }}
cd ~/src/openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name

osmosis --read-replication-interval workingDirectory="${WORKOSM_DIR}" --simplify-change --write-xml-change - | \
osm2pgsql --append -s -C 300 -G --hstore --style openstreetmap-carto.style --tag-transform-script openstreetmap-carto.lua -d gis -H $HOSTNAME -U $PG_USER -
```

Its related execution diagram is the following:

|configuration.txt ![txt][txt]| |Openstreetmap Changes ![xml][xml]|
|                             |&#x2B68;|&#x2B63;|
|state.txt ![txt][txt]|&#x2B62;|*Osmosis* ![prg][prg]|&#x2B62;|*Osm2pgsql* ![prg][prg]|
|                     |&#x2B69;|                   | |&#x2B63;|
|state.txt ![txt][txt]| |                   | |PostgreSQL PostGIS ![db][db]|
{: .drawing}

### Packaging a scheduled script

To schedule the update procedure, the *osmosis* pipeline can be packaged in a script and put into a minutely or hourly cron job. It is safe to call osmosis every minute, as it puts a lock on the *download.lock* file and if the previous run is still executing, the next one will exit immediately without doing anything. You might want to redirect stdout and stderr to either a log file or /dev/null to avoid cron sending out emails every time the script runs.

Create a file named *osmosis-update.sh*

```shell
cd /home/{{ pg_login }}/osmosisworkingdir
vi osmosis-update.sh
```

Include the following content:

```shell
#!/usr/bin/env bash

test "$1" || exec 2>/dev/null
set -euf -o pipefail

WORKOSM_DIR=/home/{{ pg_login }}/osmosisworkingdir
export PGPORT=5432
export PG_USER={{ pg_user }}
export PGPASSWORD={{ pg_password }}
cd ~/src/openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name
osmosis --read-replication-interval workingDirectory=${WORKOSM_DIR} --simplify-change --write-xml-change - | \
osm2pgsql --append -s -C 300 -G --hstore --style openstreetmap-carto.style --tag-transform-script openstreetmap-carto.lua -d gis -H $HOSTNAME -U $PG_USER -
```

Save and test it:

```shell
chmod +x /home/{{ pg_login }}/osmosisworkingdir/osmosis-update.sh
/home/{{ pg_login }}/osmosisworkingdir/osmosis-update.sh display
```

A sample of *cron* job is the following:

    * * * * * /home/{{ pg_login }}/osmosisworkingdir/osmosis-update.sh >> /home/{{ pg_login }}/osmosisworkingdir/osmosis.log 2>&1

### Trimming downloaded data to a bounding box or polygon

Processing the whole planet needs CPU, RAM and disk capacity; the PostgreSQL database grows significantly as updates are applied to it.

A Python script named [trim_osc.py](https://github.com/Zverik/regional/blob/master/trim_osc.py) and developed by [Zverik](https://github.com/Zverik) within his repository of [Tools for OSM regional extract support](https://github.com/Zverik/regional) allows to trim the osmChange files to a bounding box or a polygon related to just the area that we are interested in. The [Github README](https://github.com/Zverik/regional#trim_oscpy) describes its usage. It is recommended to increase update interval to 5-10 minutes, so changes accumulate and ways could be filtered more effectively.

To install it:

```shell
cd ~/src
git clone https://github.com/zverik/regional
chmod u+x ~/src/regional/trim_osc.py
sudo apt-get install -y python-psycopg2 python-shapely python-lxml
```

The toolchain to process a trimmed download is the following:

|configuration.txt ![txt][txt]| |Openstreetmap Changes ![xml][xml]|
|                             |&#x2B68;|&#x2B6;|
|state.txt ![txt][txt]|&#x2B62;|*Osmosis* ![prg][prg]|&#x2B62;|*trim_osc.py* ![prg][prg]|&#x2B62;|*Osm2pgsql* ![prg][prg]|
|                     |&#x2B69;|                   | |                           | |&#x2B63;|
|state.txt ![txt][txt]| |                   | |                           | |PostgreSQL PostGIS ![db][db]|
{: .drawing}

Usage of the script:

```
trim_osc.py [-h] [-d DBNAME] [--host HOST] [--port PORT] [--user USER]
                   [--password] [-p POLY] [-b Xmin Ymin Xmax Ymax] [-z] [-v]
                   osc output

Trim osmChange file to a polygon and a database data

positional arguments:
  osc                   input osc file, "-" for stdin
  output                output osc file, "-" for stdout

optional arguments:
  -h, --help            show this help message and exit
  -d DBNAME             database name
  --host HOST           database host
  --port PORT           database port
  --user USER           user name for db
  --password            ask for password
  -p POLY, --poly POLY  osmosis polygon file
  -b Xmin Ymin Xmax Ymax, --bbox Xmin Ymin Xmax Ymax
                        Bounding box
  -z, --gzip            source and output files are gzipped
  -v                    display debug information
```

Sample:

    ~/src/regional/trim_osc.py -d gis -p /path/to/region.poly -z input output


trim_osc.py accept a two-dimensional bounding box with `-b` option and a polygon file with `-p` option. The [Geofabrik downloads server](https://download.geofabrik.de/) gives the .poly files they use to generate their country/region extracts. For instance, the .poly file for Liechtenstein that describes the extent of this region can be downloaded with the following command:

```shell
cd $WORKOSM_DIR
wget https://download.geofabrik.de/europe/liechtenstein.poly
```

Then, the related argument to add to osmosis is the following: `-p "${WORKOSM_DIR}/liechtenstein.poly"`

Sequence of commands implementing the whole toolchain (we use *osmChange* as temporary file):

```shell
export PGPORT=5432
export PGPASSWORD={{ pg_password }}
cd ~/src/openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name

osmosis --read-replication-interval workingDirectory="${WORKOSM_DIR}" --simplify-change --write-xml-change osmChange

~/src/regional/trim_osc.py -d gis --user $PG_USER --host $PGHOST --port $PGPORT --password -p "${WORKOSM_DIR}/liechtenstein.poly" osmChange osmChange

osm2pgsql --append -s -C 300 -G --hstore --style openstreetmap-carto.style --tag-transform-script openstreetmap-carto.lua -d gis -H $HOSTNAME -U $PG_USER osmChange

rm osmChange
```

### Managing expired tiles

When updating the db, we also need to inform the portal that the tails impacted by changes shall be marked as expired and so re-rendered. The process of identifying which tiles have to be scheduled for re-rendering is complex. Even if tools are available since long time, related [methods](https://wiki.openstreetmap.org/wiki/Tile_expire_methods) and algorithms are still under discussions for [optimizations](https://github.com/openstreetmap/osm2pgsql/pull/747) and bug fixing (at least at the moment of writing this tutorial). One possibility is to use *osm2pgsql* with `-e` (or `--expire-tiles`) and `-o` (or `--expire-output`) options to generate a list of changed tiles, that so need to be set as expired on the portal. The list can then be passed to [render_expired]({{ site.baseurl }}/manpage.html?url=https://rawgit.com/openstreetmap/mod_tile/master/docs/render_expired.1) program (from the [mod_tile](https://github.com/openstreetmap/mod_tile/) project), the same tool [we already mentioned](../tile-server-ubuntu) to update tiles after a change in the stylesheet. *render_expired* consumes the tile list produced by *osm2pgsql*. Nevertheless, the OSMF servers don't use *osm2pgsql* expiry, but instead exploit [expire.rb](https://github.com/openstreetmap/chef/blob/743225d946/cookbooks/tile/files/default/ruby/expire.rb).[^3]. The [German tile server](https://tile.openstreetmap.de) uses [expiremeta.pl](https://github.com/openstreetmap/tirex/blob/master/utils/expiremeta.pl), which is part of [Tirex Tile Rendering System](https://github.com/geofabrik/tirex).[^4]


Updating the previously listed sequence of commands in order to also manage the tile expiration process, we can add the `-e$EXPIRY_METAZOOM:$EXPIRY_METAZOOM` and `-o "$EXPIRY_FILE.$$"` options to *osm2pgsql* and include *render_expired* at the end of the toolchain:

```shell
export PGPORT=5432
export PGPASSWORD={{ pg_password }}
EXPIRY_MINZOOM=10
EXPIRY_MAXZOOM=18
EXPIRY_FILE=dirty_tiles
cd ~/src/openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name

osmosis --read-replication-interval workingDirectory="${WORKOSM_DIR}" --simplify-change --write-xml-change osmChange

~/src/regional/trim_osc.py -d gis --user $PG_USER --host $PGHOST --port $PGPORT --password -p "${WORKOSM_DIR}/liechtenstein.poly" osmChange osmChange

osm2pgsql --append -s -e$EXPIRY_METAZOOM:$EXPIRY_METAZOOM -o "$EXPIRY_FILE.$$" -C 300 -G --hstore --style openstreetmap-carto.style --tag-transform-script openstreetmap-carto.lua -d gis -H $HOSTNAME -U $PG_USER osmChange

render_expired --min-zoom=$EXPIRY_MINZOOM --max-zoom=$EXPIRY_MAXZOOM --touch-from=$EXPIRY_MINZOOM -s /var/run/renderd.sock < "$EXPIRY_FILE.$$"

rm osmChange
```

The revised toolchain is the following:

|configuration.txt ![txt][txt]| |osmChange ![xml][xml]|
|                             |&#x2B68;|&#x2B63;|
|state.txt ![txt][txt]|&#x2B62;|*Osmosis* ![prg][prg]|&#x2B62;|*trim_osc.py* ![prg][prg]|&#x2B62;|*Osm2pgsql* ![prg][prg]|&#x2B62;|*render_expired* ![prg][prg]|
|                     |&#x2B69;|                   | |                           | |&#x2B63;|
|state.txt ![txt][txt]| |                   | |                           | |PostgreSQL ![db][db]|
{: .drawing}

### Exploiting available scripts

Scripts are available to support the update process. [mod_tile](https://github.com/openstreetmap/mod_tile/) includes a helper script named [openstreetmap-tiles-update-expire](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire), which performs the following steps:

- [calling Osmosis](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L99) to download a diff stream from OpenStreetMap
- [applying changes](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L105) to the PostgreSQL/PostGIS database using osm2pgsql.
- [expiring tiles](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L112) based on those updates, keeping the tile server up to date
- [avoiding concurrent execution](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L82-L85) through a [lock file](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L16)
- tracing execution notes to a [log file](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L24)

The script, which for normal operation is invoked without arguments, also provides [an initialization option](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L74-L78) of the replication system when executed with the single argument YYYY-MM-DD.
The date of the planet file obtained through a previously performed *osm2pgsql* import can be used as argument (the command to get the date of today would be: `date -u +"%Y-%m-%dT%H:%M:%SZ"`). The initialization includes the following steps:

- [initializing osmosis](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L77)
- [downloading the state.txt file](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L78) related to the beginning of the YYYY-MM-DD date indicated as first argument of the command

Its [man Page]({{ site.baseurl }}/manpage.html?url=https://raw.githubusercontent.com/openstreetmap/mod_tile/master/docs/openstreetmap-tiles-update-expire.1){:target="_blank"} describes the usage.

The script must be edited to modify the following configuration settings:

- [OSM2PGSQL_OPTIONS](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L9) has to be set to `-C 300 -c -G --hstore --style openstreetmap-carto.style --tag-transform-script openstreetmap-carto.lua -d gis -H $HOSTNAME -U $PG_USER`. Check also the full pathname of each file.
- [BASE_DIR](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L12) has to be set to the *mod_tile* directory
- [LOG_DIR](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L13) has to be set to the log directory
- [WORKOSM_DIR](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L14) has to be set to the osmosis temporary folder
- [EXPIRY_MINZOOM and EXPIRY_MAXZOOM](https://github.com/openstreetmap/mod_tile/blob/master/openstreetmap-tiles-update-expire#L26-L27) are used by osm2pgsql (`-e` option to create a tile expiry list) and by *render_expired*.

Notice that the script invokes `http://osm.personalwerk.de/replicate-sequences/?"$1"T00:00:00Z` to download *state.txt* and *http://osm.personalwerk.de/replicate-sequences* redirects to *https://replicate-sequences.osm.mazdermind.de*, already mentioned before.

To prepare the script for the first execution[^5]:

- Grant rights to the update tables for "*{{ pg_login }}*" user:

  ```shell
  wget https://github.com/openstreetmap/osm2pgsql/blob/master/install-postgis-osm-user.sh
  chmod a+x install-postgis-osm-user.sh
  sudo /usr/bin/install-postgis-osm-user.sh gis {{ pg_login }}
  ```
  
- Initialise the *osmosis* replication stack to the data of your data import. Choose the date of the planet data, as this is the date from which the diffs will start.

      sudo -u {{ pg_login }} /usr/bin/openstreetmap-tiles-update-expire `date -u +"%Y-%m-%d"`

- You will next need to update the default configuration of *osmosis*. In *configuration.txt*, change the `base_url` to `https://planet.openstreetmap.org/replication/minute/`

- Update your tileserver by up to an hour and expire the corresponding rendered tiles:

      sudo -u {{ pg_login }} /usr/bin/openstreetmap-tiles-update-expire

- If your tile server is behind more than an hour you will need to call the *openstreetmap-tiles-expire* script multiple times.

- If you want to continuously keep your server up to data, you need to add the *openstreetmap-tiles-expire* script to your crontab.

- From time to time it may make sense to replace the preprocessed shapefiles with new versions:

  ```shell
  cd ~/src
  cd openstreetmap-carto
  scripts/get-shapefiles.py
  ```

The previously mentioned *trim_osc.py* Python script can be added to *install-postgis-osm-user.sh* in order to trim the input to a bounding box or a polygon so that the postgres database doesn't grow significantly as updates are applied to it. The [openstreetmap-tiles-update-expire script by junichim](https://github.com/junichim/mod_tile/blob/master/openstreetmap-tiles-update-expire) is a modification to the original one by including *trim_osc.py* from Zverik's "regional" scripts.

In his blog, SomeoneElse [reports the modifications](https://wiki.openstreetmap.org/wiki/User:SomeoneElse/Ubuntu_1604_tileserver_load#Updating_your_database_as_people_edit_OpenStreetMap) and includes the appropriated *cron* scheduling. [TRIM_REGION_OPTIONS](https://github.com/junichim/mod_tile/blob/master/openstreetmap-tiles-update-expire#L27) shall be updated to reflect the actual region boundaries.

## Exploiting Osmosis with an extract from Geofabrik

[Geofabrik](https://www.geofabrik.de/) provides an [updated version of the planet dataset](https://download.geofabrik.de/technical.html) from the latest OpenStreetMap data, already splitted into a number of [pre-defined regions](https://download.geofabrik.de/).

When using Geofabrik to download the initial dataset to the local database, data can be kept updated by applying diff update files (differences between the new extract and the previous one) that Geofabrik also computes each time a new exctract is produced for a region. Using diff files of the same region of the initial download, users can continuously update their own regional extract instead of having to download the full file. Applying updates from Geofabrik rather than the whole planet minimises the size of the database and the amount of data fetched from the remote server.

By default, the *baseUrl* parameter in *configuration.txt* points to the whole planet. If you are using an extract downloaded from [Geofabrik](https://download.geofabrik.de/), you should change the url basing on the metadata of the related PBF file; *osmium* is a tool which among other things allows the analisys of a PBF file; it can be installed from package through:

    sudo apt-get -y install osmium-tool

You can alternatively install the latest version from sources:

```shell
sudo apt-get remove -y osmium-tool
sudo apt-get install -y cmake pandoc cppcheck iwyu clang-tidy
cd ~/src
git clone https://github.com/mapbox/protozero
git clone https://github.com/osmcode/libosmium
git clone https://github.com/osmcode/osmium-tool
mkdir build
cd build
cmake ..
make
sudo make install
sudo ln /usr/local/bin/osmium /usr/bin
```

Once installed, the command to analyze a PBF file is `osmium fileinfo`:

    PBF_FILE=liechtenstein-latest.osm.pbf
	osmium fileinfo -e $PBF_FILE

The "osmosis_replication_*" properties returned by this command can be used to configure *osmosis*. Values have to be transformed and this can be automatically done through a simple parser that generates a working *configuration.txt*[^1]:

```shell
PBF_FILE=liechtenstein-latest.osm.pbf
REPLICATION_BASE_URL="$(osmium fileinfo -g 'header.option.osmosis_replication_base_url' "${PBF_FILE}")"
echo -e "baseUrl=${REPLICATION_BASE_URL}\nmaxInterval=3600" > "${WORKOSM_DIR}/configuration.txt"
```

So, the above command can be used to produce *configuration.txt* from a PBF file downloaded by *Geofabrik.de*.

Subsequently, the command to generate *state.txt* is the following[^1]:

```shell
REPLICATION_SEQUENCE_NUMBER="$( printf "%09d" "$(osmium fileinfo -g 'header.option.osmosis_replication_sequence_number' "${PBF_FILE}")" | sed ':a;s@\B[0-9]\{3\}\>@/&@;ta' )"
curl -s -L -o "${WORKOSM_DIR}/state.txt" "${REPLICATION_BASE_URL}/${REPLICATION_SEQUENCE_NUMBER}.state.txt"
```

The *osmosis*/*osm2pgsql* pipeline to keep the DB updated with Geofabrik is the following:

```shell
WORKOSM_DIR=/home/{{ pg_login }}/osmosisworkingdir
export PGPORT=5432
export PGPASSWORD={{ pg_password }}
cd ~/src/openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name
osmosis --read-replication-interval workingDirectory=${WORKOSM_DIR} --simplify-change --write-xml-change - | \
osm2pgsql --append -s -C 300 -G --hstore --style openstreetmap-carto.style --tag-transform-script openstreetmap-carto.lua -d gis -H $HOSTNAME -U $PG_USER -
```

## Using tools different from osmosis and osm2pgsql

Osmosis and Osm2pgsql are the oldest tools to retrieve osmChange data and update the local DB in order to keep it in sync with OSM. Even if Osmosis can perform all steps including db import, to get a totally compatible data model with the one needed by openstreetmap-carto and to ensure that *lua* processing is correctly executed, the Osm2pgsql chain is recommended (with the options mentioned before).

Other tools are available, capable to gain better performance, additional integration and perform more advanced processing, transformation and filtering.

Anyway, we need to verify that they do not introduce downsides and that the result is exactly the same of the osmosis/osm2pgsql toolchain and this is beyond the scope of this tutorial.

Jochen Topf in his [blog](https://blog.jochentopf.com/) reports that [Osmium](https://github.com/osmcode/osmium-tool/) can [provide expedicious and exact extracts](https://blog.jochentopf.com/2017-02-06-expedicious-and-exact-extracts-with-osmium.html).

A [note](https://github.com/gravitystorm/openstreetmap-carto/issues/2884) within the openstreetmap-carto repository mentions websites providing direct extracts as well as other tools that can be possibly used.








{% comment %}
# DA FARE


https://blog.jochentopf.com/2017-02-06-expedicious-and-exact-extracts-with-osmium.html
http://ksmapper.blogspot.it/2011/04/keeping-database-up-to-date-with.html
https://gis.stackexchange.com/questions/94352/update-database-via-osmosis-and-osm2pgsql-too-slow
https://www.geofabrik.de/media/2012-09-08-osm2pgsql-performance.pdf
file:///C:/Users/alberto/Downloads/OSM%20tiles%20server.pdf




## Note to be processed

https://github.com/geometalab/osmaxx/wiki/Updating-the-planet---extracting-data
https://mygisnotes.wordpress.com/tag/osm/


https://github.com/posm/posm/issues/17

https://blog.jochentopf.com/2017-02-06-expedicious-and-exact-extracts-with-osmium.html

https://manned.org/osmosis.1
https://manned.org/osmconvert.1
https://manned.org/osmfilter.1
Osmosis and osmupdate.



{% endcomment %}

--------------------------

{% include pages/images.md %}

[^1]: [Paul’s Blog - It Starts With the Planet](http://www.paulnorman.ca/blog/2018/01/it-starts-with-the-planet/)
[^2]: [Toby's Blog of open/mappy things](http://ksmapper.blogspot.it/2011/04/keeping-database-up-to-date-with.html)
[^3]: [pnorman comment on 15 Mar 2017](https://github.com/openstreetmap/osm2pgsql/issues/709#issuecomment-286895927)
[^4]: [Nakaner comment on 15 Mar 2017](https://github.com/openstreetmap/osm2pgsql/issues/709#issuecomment-286899135])
[^5]: [Building a tile server from packages - Updating chapter](https://switch2osm.org/serving-tiles/building-a-tile-server-from-packages/)