## Install PostgreSQL and PostGIS

[PostgreSQL](https://www.postgresql.org/) is a relational database, and [PostGIS](http://postgis.net/) is its spatial extender, which allows you to store geographic objects like map data in it; it serves a similar function to ESRI’s SDE or Oracle’s Spatial extension. PostgreSQL + PostGIS are used for a wide variety of features such as rendering maps, geocoding, and analysis.

Currently the tested versions for OpenstreetMap Carto are PostgreSQL 10 and PostGIS 2.4:

Also older or [newer PostgreSQL version](https://www.postgresql.org/) should be suitable.

On Ubuntu there are pre-packaged versions of both postgis and postgresql, so these can simply be installed via the Ubuntu package manager.

```shell
sudo apt-get update
sudo apt-get install -y postgresql postgis
```

Optional installations:

```shell
sudo apt-get install -y postgresql-contrib postgresql-12-postgis-3 postgresql-12-postgis-3-scripts
```

You need to start the db:

```shell
sudo service postgresql start
```

Note: used PostgreSQL port is 5432 (default).


### Create the PostGIS instance

Now you need to create a PostGIS database. The defaults of various programs including openstreetmap-carto (ref. project.mml) assume the database is called *gis*. You need to create a PostgreSQL database and set up a PostGIS extension on it.

The character encoding scheme to be used in the database is *UTF8* and the adopted collation is *en_GB.utf8*. (The `U&"..."` escaped Unicode syntax used in *project.mml* should work [only when the server encoding is UTF8](https://www.postgresql.org/docs/9.5/static/sql-syntax-lexical.html). This is also in line with what reported in the [PostgreSQL Chef configuration code](https://github.com/openstreetmap/chef/blob/master/cookbooks/postgresql/resources/database.rb#L25-L27).)

```shell
sudo -u postgres createuser -s $USER
createdb gis --encoding="UTF8" --lc-collate="en_GB.UTF-8" --lc-ctype="en_GB.UTF-8" --template=template0
psql -d gis -c 'CREATE EXTENSION postgis; CREATE EXTENSION hstore;'
```

Note: `ERROR:  invalid locale name: "en_GB.UTF-8"` means that *en_GB.UTF-8* locale has not been installed. After installing locale, the database shall be restarted in order to be able to load the locale.

Go to [the next step](#add-a-user-and-grant-access-to-gis-db).

If in different host:

{% include_relative _includes/configuration-variables.md os='Ubuntu' %}

```shell
HOSTNAME=localhost # set it to the actual ip address or host name
createdb gis --host="$HOSTNAME" --encoding="UTF8" --lc-collate="en_GB.UTF-8" --lc-ctype="en_GB.UTF-8" --template=template0
```

If you get the following error:

    ERROR:  invalid locale name: "en_GB.utf8"

then you need to add *'en_GB.utf8'* locale using the following command:

```shell
sudo dpkg-reconfigure locales
```

And select "en_GB.UTF-8 UTF-8" in the first screen ("Locales to be generated"). Subsequently, restarting the db would be suggested:

```shell
sudo service postgresql restart
```

If you get the following error:

    ERROR:  new collation (en_GB.utf8) is incompatible with the collation of the template database (en_US.UTF-8)
    HINT:  Use the same collation as in the template database, or use template0 as template.

you need to use template0 for gis:

```shell
psql -U {{ pg_user }} -h $HOSTNAME -c "CREATE DATABASE gis ENCODING 'UTF-8' LC_COLLATE 'en_GB.utf8' LC_CTYPE 'en_GB.utf8' TEMPLATE template0"

# alternative command: createdb -E UTF8 -l en_GB.UTF8 -O {{ pg_user }}  -T template0 gis
```

If you get the following error:

    ERROR:  new encoding (UTF8) is incompatible with the encoding of the template database (SQL_ASCII)
    HINT:  Use the same encoding as in the template database, or use template0 as template.

(error generally happening with Ubuntu on Windows with [WSL](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux)), then add also `TEMPLATE template0`; e.g., use the following command:

```shell
psql -U {{ pg_user }} -h $HOSTNAME -c "CREATE DATABASE gis ENCODING 'UTF-8' LC_COLLATE 'en_GB.utf8' LC_CTYPE 'en_GB.utf8' TEMPLATE template0"
# alternative command: createdb -E UTF8 -l en_GB.utf8 -O {{ pg_user }} -T template0 gis
```

Check to create the DB within a disk partition where enough disk space is available[^96]. If you need to use a different tablespace than the default one, execute the following commands instead of the previous ones (example: the tablespace has location `/tmp/db`):

```shell
sudo mkdir /mnt/db # Suppose this is the tablespace location
sudo chown {{ pg_user }}:{{ pg_user }} /mnt/db
psql -U {{ pg_user }} -h $HOSTNAME -c "CREATE TABLESPACE gists LOCATION '/mnt/db'"
psql -U {{ pg_user }} -h $HOSTNAME -c "ALTER DATABASE gis SET TABLESPACE gists"
```

Create the *postgis* and *hstore* extensions:

```shell
psql -U {{ pg_user }} -h $HOSTNAME -c "\connect gis"
psql -U {{ pg_user }} -h $HOSTNAME -d gis -c "CREATE EXTENSION postgis"
psql -U {{ pg_user }} -h $HOSTNAME -d gis -c "CREATE EXTENSION hstore"
```

If you get the following error

`ERROR:  could not open extension control file "/usr/share/postgresql/9.3/extension/postgis.control": No such file or directory`

then you might be installing PostgreSQL 9.3 (instead of 9.5), for which you should also need:

```shell
sudo apt-get install postgis postgresql-9.3-postgis-scripts
```

Install it and repeat the create extension commands. Notice that PostgreSQL 9.3 is not currently supported by openstreetmap-carto.

### Add a user and grant access to gis DB

In order for the application to access the *gis* database, a DB user with the same name of your UNIX user is needed. Let's suppose your UNIX ue is *{{ pg_login }}*.

```shell
psql -d gis -c "create user tileserver;grant all privileges on database gis to {{ pg_user }};"
psql -d gis -c 'create user "www-data";grant all privileges on database gis to "www-data";'

psql -d gis -c 'ALTER TABLE geometry_columns OWNER TO {{ pg_user }};'
psql -d gis -c 'ALTER TABLE spatial_ref_sys OWNER TO  {{ pg_user }};'
```

### Enabling remote access to PostgreSQL

If in different host, to remotely access PostgreSQL, you need to edit *pg_hba.conf*:

```shell
sudo vi /etc/postgresql/*/main/pg_hba.conf
```

and add the following line:

    host    all             all             <your IP set>/<your netmask>             md5

`host all all 0.0.0.0/0 md5` is an access control rule that let anybody login in from any address if providing a valid password (md5 keyword).

Then edit *postgresql.conf*:

```shell
sudo vi /etc/postgresql/*/main/postgresql.conf
```

and set `listen_addresses = '*'`

Finally, the DB shall be restarted:

```shell
sudo /etc/init.d/postgresql restart
```

Check that the *gis* database is available. To list all databases defined in PostgreSQL, issue the following command:

```shell
psql -U {{ pg_user }} -h $HOSTNAME -c "\l+"
```

The obtained report should include the *gis* database, as in the following table:

   Name    |  Owner   | Encoding  |  Collate   |   Ctype    |    Access privileges
-----------|----------|-----------|------------|------------|-------------------------
 gis       | {{ pg_user }} | UTF8      | en_US.utf8 | en_US.utf8 | =Tc/{{ pg_user }}
           |          |           |            |            | {{ pg_user }}=CTc/{{ pg_user }}
           |          |           |            |            | {{ pg_login }}=CTc/{{ pg_user }}

### Tuning the database

The default PostgreSQL settings aren't great for very large databases like OSM databases. Proper tuning can just about double the performance.

#### Minimum tuning requirements

Set the *postgres* user to *trust*:

```shell
sudo vi /etc/postgresql/*/main/pg_hba.conf
# change: local   all             postgres                                peer
# to:     local   all             postgres                                trust
```

After performing the above change, restart the DB:

```shell
sudo service postgresql restart
```

Run *tune-postgis.sh*:

```shell
export POSTGRES_USER=postgres
export PG_MAINTENANCE_WORK_MEM=256MB
export PG_WORK_MEM=16MB
export psql=psql

cd ~/src
cd openstreetmap-carto
bash scripts/tune-postgis.sh
```

Whitout setting *postgres* to *trust*, the following error occurs: `psql: error: FATAL:  Peer authentication failed for user "postgres"` when running *tune-postgis.sh*.

To cleanup the *data* directory and redo again *tune-postgis.sh*: `rm -rf data`.

#### Optional further tuning requirements

The [PostgreSQL wiki](http://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server) has a page on database tuning.

[Paul Norman’s Blog](http://www.paulnorman.ca/blog/2011/11/loading-a-pgsnapshot-schema-with-a-planet-take-2/) has an interesting note on optimizing the database, which is used here below.

Default `maintenance_work_mem` and `work_mem` settings are far too low for rendering.[^98]: both parameters should be increased for faster data loading and faster queries (index scanning).

Conservative settings for a 4GB VM are `work_mem=32MB` and `maintenance_work_mem=256MB`. On a machine with enough memory you could set them as high as `work_mem=256MB` and `maintenance_work_mem=1GB`.

Besides, important settings are `shared_buffers` and the *write-ahead-log* (*wal*). There are also some other settings you might want to change specifically for the import.

To edit the PostgreSQL configuration file with *vi* editor:

```shell
sudo vi /etc/postgresql/*/main/postgresql.conf
```

and if you are running PostgreSQL 9.3 (not supported):

```shell
sudo vi /etc/postgresql/9.3/main/postgresql.conf
```

Suggested minimum settings:

```ini
shared_buffers = 128MB
min_wal_size = 1GB
max_wal_size = 2GB
work_mem = 32MB # check comments for better tuning
maintenance_work_mem = 256MB
autovacuum = off
fsync = off
```

The latter two ones allow a faster import: the first turns off auto-vacuum during the import and allows you to run a vacuum at the end; the second introduces data corruption in case of a power outage and is dangerous. If you have a power outage while importing the data, you will have to drop the data from the database and re-import, but it’s faster. Just remember to change these settings back after importing. fsync has no effect on query times once the data is loaded.

The PostgreSQL tuning adopted by OpenStreetMap can be found in the [PostgreSQL Chef Cookbook](https://github.com/openstreetmap/chef/blob/master/cookbooks/postgresql/attributes/default.rb): the specific PostgreSQL tuning for the OpenStreetMap tile servers is reported in the related [Tileserver Chef configuration](https://github.com/openstreetmap/chef/blob/master/roles/tile.rb#L38-L45).

For a dev&test installation on a system with 16GB of RAM, the suggested settings are the following[^97]:

```ini
shared_buffers = 2GB
work_mem = 256MB
maintenance_work_mem = 1GB
wal_level = minimal
synchronous_commit = off
min_wal_size = 1GB
max_wal_size = 2GB
checkpoint_segments = 60
checkpoint_timeout = 15min
checkpoint_completion_target = 0.9
default_statistics_target = 1000
autovacuum = off
fsync = off
```

*default_statistics_target* can be even increased to 10000.

If performing database updates, run ANALYZE periodically.

To stop and start the database:

```shell
sudo /etc/init.d/postgresql stop

sudo /etc/init.d/postgresql start
```

You may get an error and need to increase the shared memory size. Edit */etc/sysctl.d/30-postgresql-shm.conf* and run `sudo sysctl -p /etc/sysctl.d/30-postgresql-shm.conf`. A parameter like `kernel.shmmax=17179869184` and `kernel.shmall=4194304` could be appropriate for a 16GB segment size.[^99]

To manage and maintain the configuration of the servers run by OpenStreetMap, the [Chef](https://www.chef.io/) configuration management tool is used.

The configuration adopted for PostgreSQL is [postgresql/attributes/default.rb](https://github.com/openstreetmap/chef/blob/master/cookbooks/postgresql/attributes/default.rb).

## Install Osm2pgsql

[Osm2pgsql](https://wiki.openstreetmap.org/wiki/Osm2pgsql) is an OpenStreetMap specific software used to load the OSM data into the PostGIS database.

The [default packaged versions](https://launchpad.net/ubuntu/+source/osm2pgsql) of Osm2pgsql are 0.88.1-1 on Ubuntu 16.04 LTS and 0.96.0 on Ubuntu 18.04 LTS. Nevertheless, more recent versions are suggested, available at the [OpenStreetMap Osmadmins PPA](https://launchpad.net/~osmadmins/+archive/ubuntu/ppa) or [compiling the software from sources](https://github.com/openstreetmap/osm2pgsql).

To install osm2pgsql:

```shell
sudo apt install -y osm2pgsql
```

To install Osm2pgsql from Osmadmins PPA:

```shell
sudo add-apt-repository -y ppa:osmadmins/ppa
apt-key adv --keyserver keyserver.ubuntu.com --recv A438A16C88C6BE41CB1616B8D57F48750AC4F2CB
sudo apt-get update
sudo apt-get install -y osm2pgsql
```

Go to [Get an OpenStreetMap data extract](#get-an-openstreetmap-data-extract).

### Generate Osm2pgsql from sources

This alternative installation procedure generates the most updated executable by compiling the sources.

Install Needed dependencies:

```shell
sudo apt-get install -y make cmake g++ libboost-dev libboost-system-dev \
  libboost-filesystem-dev libexpat1-dev zlib1g-dev \
  libbz2-dev libpq-dev libgeos-dev libgeos++-dev libproj-dev lua5.2 \
  liblua5.2-dev
```

Download osm2pgsql:

```shell
mkdir -p ~/src ; cd ~/src
git clone git://github.com/openstreetmap/osm2pgsql.git
```

Prepare for compiling, compile and install:

```shell
cd osm2pgsql
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make
sudo make install
cd
```

{% include_relative _includes/download-osm-data.md %}

## Load data to PostGIS

The [osm2pgsql documentation](https://github.com/openstreetmap/osm2pgsql/tree/master/docs) reports all needed information to use this ETL tool, including related [command line options]({{ site.baseurl }}/manpage.html?url=https://raw.githubusercontent.com/openstreetmap/osm2pgsql/master/docs/osm2pgsql.1){:target="_blank"}.

*osm2pgsql* uses overcommit like many scientific and large data applications, which requires adjusting a kernel setting:

```shell
sudo sysctl -w vm.overcommit_memory=1
```

To load data from an *.osm* or *.pbf* file to PostGIS, issue the following:

```shell
cd {{ include.cdprogram }}
cd openstreetmap-carto

export OSM2PGSQL_CACHE=${OSM2PGSQL_CACHE:-512}
export OSM2PGSQL_NUMPROC=${OSM2PGSQL_NUMPROC:-1}
export OSM2PGSQL_DATAFILE=${OSM2PGSQL_DATAFILE:-data.osm.pbf}

osm2pgsql \
--cache $OSM2PGSQL_CACHE \
--number-processes $OSM2PGSQL_NUMPROC \
--hstore \
--multi-geometry \
--database gis \
--slim \
--drop \
--style openstreetmap-carto.style \
--tag-transform-script openstreetmap-carto.lua \
[.osm or .pbf file]
```

With available memory, set `export OSM2PGSQL_CACHE=2500`; it allocates 2.5 GB of memory to the import process.

Option `--create` loads data into an empty database rather than trying to append to an existing one.

Relaying to OSM2PGSQL_NUMPROC, if you have more cores available, you can set it accordingly.

The [osm2pgsql manual](https://osm2pgsql.org/doc/manual.html) describes usage and all options in detail.

Go to [the next step](#create-the-data-folder).

If using a different server:

```shell
cd {{ include.cdprogram }}
cd openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name
osm2pgsql -s -C 300 -c -G --hstore --style openstreetmap-carto.style --tag-transform-script openstreetmap-carto.lua -d gis -H $HOSTNAME -U {{ pg_user }} [.osm or .pbf file]
```

Notice that the suggested process adopts the `-s` (`--slim` option), which uses temporary tables, so running it takes more diskspace (and is very slow), while less RAM memory is used. You might add `--drop` option with `-s` (`--slim`), to also drop temporary tables after import, otherwise you will also find the temporary tables *nodes*, *ways*, and *rels* (these tables started out as pure
“helper” tables for memory-poor systems, but today they are widely used because they are also a prerequisite for updates).

If everything is ok, you can go to [the next step](#create-the-data-folder).

Notice that the following elements are used:

- hstore
- the *openstreetmap-carto.style*
- the *openstreetmap-carto.lua* LUA script
- *gis* DB name

Depending on the input file size, the *osm2pgsql* command might take very long. An interesting [page related to Osm2pgsql benchmarks](https://wiki.openstreetmap.org/wiki/Osm2pgsql/benchmarks) associates sizing of hw/sw systems with related figures to import OpenStreetMap data.

Note: if you get the following error:

    node_changed_mark failed: ERROR:  prepared statement "node_changed_mark" does not exist

do the following command on your *original.osm*:

```shell
sed "s/action='modify' //" < original.osm | > fixedfile.osm
```

Then process *fixedfile.osm*.

If you get errors like this one:

    Error reading style file line 79 (fields=4)
    flag 'phstore' is invalid in non-hstore mode
    Error occurred, cleaning up

or this one:

    Postgis Plugin: ERROR:  column "tags" does not exist
    LINE 8: ...ASE WHEN "natural" IN ('mud') THEN "natural" ELSE tags->'wet...

then you need to enable *hstore* extension to the db with `CREATE EXTENSION hstore;` and also add the *--hstore* flag to *osm2pgsql*.
Enabling *hstore* extension and using it with *osm2pgsql* will fix those errors.

## Create the *data* folder

At least 18 GB HD and appropriate RAM/swap is needed for this step (24 GB HD is better). 8 GB HD will not be enough. With 1 GB RAM, configuring a swap is mandatory.

```shell
python3 -m pip install psycopg2-binary

cd {{ include.cdprogram }}
cd openstreetmap-carto
scripts/get-external-data.py
```

To cleanup the *get-external-data.py* procedure and restart from scratch, remove the *data* directory (`rm -r data`).

Configure a [swap](#configure-a-swap) to prevent the following message:

```
INFO:root:Checking table water_polygons
Killed
```

The way shapefiles are loaded by the OpenStreetMap tile servers is reported in the related [Chef configuration](https://github.com/openstreetmap/chef/blob/master/roles/tile.rb).

Read [scripted download](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#scripted-download) for further information.

## Create indexes and grant users

Create partial indexes to speed up the queries included in *project.mml* and grant access to all *gis* tables to avoid *renderd* errors when accessing tables with user *{{ pg_login }}*.

- Add the partial geometry indexes indicated by *openstreetmap-carto*[^93] to provide effective improvement to the queries:

  ```shell
  cd {{ include.cdprogram }}
  cd openstreetmap-carto
  HOSTNAME=localhost # set it to the actual ip address or host name
  psql -d gis -f indexes.sql
  ```

  Alternative mode:

  ```shell
  cd {{ include.cdprogram }}
  cd openstreetmap-carto
  scripts/indexes.py | psql -d gis
  ```

  If using a different host:

  ```shell
  HOSTNAME=localhost # set it to the actual ip address or host name
  cd {{ include.cdprogram }}
  cd openstreetmap-carto
  scripts/indexes.py | psql -U {{ pg_user }} -h $HOSTNAME -d gis
  ```

  Alternative mode with a different host:

  ```shell
  HOSTNAME=localhost # set it to the actual ip address or host name
  psql -U {{ pg_user }} -h $HOSTNAME -d gis -f indexes.sql
  ```

- {% include_relative _includes/grant.md %}

To list all tables available in the *gis* database, issue the following command:

```shell
psql -d gis -c "\dt+"
```

or:

```shell
psql -U {{ pg_user }} -h $HOSTNAME -d gis -c "\dt+"
```

The database shall include the *rels*, *ways* and *nodes* tables (created with the `--slim` mode of *osm2pgsql*) in order to allow updates.

In the following example of output, the `--slim` mode of *osm2pgsql* was used:

 Schema |        Name        | Type  |  Owner
--------|--------------------|-------|----------
 public | planet_osm_line    | table | {{ pg_user }}
 public | planet_osm_nodes   | table | {{ pg_user }}
 public | planet_osm_point   | table | {{ pg_user }}
 public | planet_osm_polygon | table | {{ pg_user }}
 public | planet_osm_rels    | table | {{ pg_user }}
 public | planet_osm_roads   | table | {{ pg_user }}
 public | planet_osm_ways    | table | {{ pg_user }}
 public | spatial_ref_sys    | table | {{ pg_user }}

In fact, the tables *planet_osm_rels*, *planet_osm_ways*, *planet_osm_nodes* are available, as described in the [Database Layout of Pgsql](https://github.com/openstreetmap/osm2pgsql/blob/master/docs/pgsql.md#database-layout).

Check [The OpenStreetMap data model](https://www.mapbox.com/mapping/osm-data-model/) at Mapbox for further details.

Read [custom indexes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#custom-indexes) for further information.

[^93]: .travis.yml [applies](https://github.com/gravitystorm/openstreetmap-carto/blob/master/.travis.yml#L43) the custom indexes via `psql -1Xq -v ON_ERROR_STOP=1 -d gis -f indexes.sql`. Notice that *indexes.sql* shall be kept up to date with *indexes.py* and this is also [checked](https://github.com/gravitystorm/openstreetmap-carto/blob/master/.travis.yml#L37) by .travis.yml.
[^95]: [osm2pgsql import - disk space running out during index creation](https://help.openstreetmap.org/questions/52672/osm2pgsql-import-disk-space-running-out-during-index-creation)
[^96]: [Import error: could not extend file](https://help.openstreetmap.org/questions/26900/import-error-could-not-extend-file)
[^97]: [Most reliable way to import large dataset with osm2psql](https://gis.stackexchange.com/questions/104220/most-reliable-way-to-import-large-dataset-with-osm2psql)
[^98]: Information taken from [switch2osm](https://switch2osm.org/loading-osm-data).
[^99]: [Information from Paul Norman's Blog](http://www.paulnorman.ca/blog/2011/11/loading-a-pgsnapshot-schema-with-a-planet-take-2/).
