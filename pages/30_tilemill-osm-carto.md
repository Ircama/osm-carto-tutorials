---
layout: page
title: Installing Tilemill and OpenStreetMap-Carto on Windows
comments: true
permalink: /tilemill-osm-carto/
---

## Introduction

The following step-by-step procedure can be used to install [Tilemill](https://tilemill-project.github.io/tilemill/) on a Windows PC. It has been tested on Windows 7 32-bit and Windows 7 64-bit.[^1]

Tilemill was the original tool for the development of the openstreetmap-carto style. It supports both Linux and Windows (win32 and win64). Anyway, TileMill for Windows is no longer in active development: it hosts a very old version of Mapnik/node-mapnik. At the moment, the suggested tool for the autohoring of OpenStreetMap stylesheets is [Kosmtik](https://github.com/kosmtik/kosmtik), which needs Mapnik 3 and recent versions of *node-mapnik* that at the moment cannot be installed on Windows [^3]; anyway, a [Docker installation of Kosmtik](https://ircama.github.io/osm-carto-tutorials/docker-kosmtik/) can be run with Windows 64-bit.

Even if you should accomplish its installation on Windows through this manual, consider that:

- you will not be able to exploit the latest features of Mapnik;
- you might even fail to load the openstreetmap-carto project if someone meanwhile added a new Mapnik feature which is not supported by Tilemill;
- you should not use Tilemill to perform openstreetmap-carto developments and testings.

## Installation

Prefer direct Internet connection for the installation, avoiding the need of a proxy. At the end of the installation procedure (and DB population), Tilemill can run openstreetmap-carto off-line.

### Check OS architecture

Before all, check whether your computer is running a 32-bit version or a 64-bit version of the Windows operating system: https://support.microsoft.com/en-us/kb/827218

When downloading the software reported in this procedure, always verify that you are selecting the appropriate Windows architecture: 32-bit (x86) or 64-bit (x64).

### Install Tilemill

Install Tilemill; the latest working version at the moment should be
<http://tilemill.s3.amazonaws.com/dev/TileMill-v0.10.1-291-g31027ed-Setup.exe>

Even if Tilemill has a [GitHub repository](https://github.com/tilemill-project/tilemill) including the most recent updates, with Windows it is suggested to proceed with the standard setup, which automatically installs and configures Mapnik/node-mapnik. A procedure to upgrade Tilemill and Mapnik over Windows without recompiling is not currently documented.

### Install PostgreSQL

Download PostgreSQL (avoid using beta versions as also PostGIS shall be needed (check first the PostGIS compatibility with the version you are going to download):

<http://www.enterprisedb.com/products-services-training/pgdownload#windows>

For instance: postgresql-9.5.3-1-windows-x64.exe (for a Windows 64 bit system)

### Configure PostgreSQL

Use the following configuration steps for PostgreSQL:

- Password: {{ pg_password }}
- Port: 5432 (default)
- Default locale
- Next (install)
- Launch StackBuilder at exit
- Select the server (PostgreSQL at port 5432)
- Expand Categories, Spatial Extensions; enable PostGIS (select the latest version for the appropriate architecture, 32 or 64 bit)

### Install PostGIS

Installation of PostGIS:

- Select Components to install: PostGIS (don't create spatial database)
- Would you like us to register the GDAL_DATA environment variable for you? No
- Raster drivers are disabled by default? ... No
- Enable out db rasters? No

Open pgAdmin and store the above mentioned password.

Open a CMD (Command Prompt). Change directory (cd) to `%programfiles%\PostgreSQL\*version*\bin` (e.g., `cd C:\Program Files\PostgreSQL\9.5\bin`) and run these commands:

{% include_relative _includes/configuration-variables.md os='Windows' %}

The above mentioned commands are needed by Tilemill to connect to the PostgreSQL db with the default settings of openstreetmap-carto.

Notice that 'setx' should be used to configure variables (defining variables with 'set' before invoking tilemill.exe will not work).

### Create the *gis* database, needed by openstreetmap-carto

```batchfile
psql --help (to verify that psql works)
psql -h localhost -U {{ pg_user }} -c "create database gis"
psql -h localhost -U {{ pg_user }} -c "\connect gis"
psql -h localhost -U {{ pg_user }} -d gis -c "CREATE EXTENSION postgis"
psql -h localhost -U {{ pg_user }} -d gis -c "CREATE EXTENSION hstore"
```

Notice that, in order to get compatibility with project.yaml, the dbname shall remain "gis" and cannot be changed via the variables.

NOTE: To drop the database, in case of full data refresh, you can perform:

`psql -h localhost -U {{ pg_user }} -c "drop database gis"`

Then all creation commands must be issued again.

#{% include_relative _includes/download-osm-data.md %}

### Install osm2pgsql

Download osm2pgsql for Windows (<http://wiki.openstreetmap.org/wiki/Osm2pgsql#Windows>):

<https://lists.openstreetmap.org/pipermail/dev/2013-February/026525.html>

<https://github.com/openstreetmap/osm2pgsql/issues/17>

Check the appropriate version running on your OS architecture.

Put it to the same directory of the saved .osm file

### Install Python

Install Python 2.7 from <https://www.python.org/downloads/>

Run the setup: when it comes to the point of adding environment variables, say Yes.

Python is needed to convert project.yaml (from openstreetmap-carto) to project.mml (that can be opened by Tilemill). It is also needed to download the shapefiles.

### Install openstreetmap-carto

Open <https://github.com/gravitystorm/openstreetmap-carto> and press "Download ZIP"

Save it to `%USERPROFILE%\Documents\MapBox\project\`
(this path should conform to Tilemill Settings: `~\Documents\MapBox`)

Unzip the downloaded file (e.g., to `project\openstreetmap-carto-master`)

### osm2pgsql

Tilemill/openstreetmap-carto will render data which are stored in the *gis* database.

Use osm2pgsql to upload the locally available OpenStreetMap data to PostgreSQL. Local data could be in .osm format or .pbf, which is a compressed version of .osm.

Open a CMD

Change directory to `%USERPROFILE%\Documents\MapBox\project\openstreetmap-carto-master`

Check that Python works with: `python -V` (otherwise: `set PATH=%PATH%;<python directory>`).

To create db tables, populate them and create some index run the following:

```batchfile
cd <directory where you saved the .osm file and osm2pgsql>
osm2pgsql.exe -H localhost -d gis -U postgres -s -c -G -k -C 800 -S %USERPROFILE%\Documents\MapBox\project\openstreetmap-carto-master\openstreetmap-carto.style <filename>.osm
```

If a script file named `openstreetmap-carto.lua` is available in the openstreetmap-carto folder, add the parameter `--tag-transform-script <lua script>`. The command would become the following:

```batchfile
osm2pgsql -H localhost -d gis -U postgres -s -c -G -k -C 800 -S %USERPROFILE%\Documents\MapBox\project\openstreetmap-carto-master\openstreetmap-carto.style --tag-transform-script %USERPROFILE%\Documents\MapBox\project\openstreetmap-carto-master\openstreetmap-carto.lua <filename>.osm (or <filename>.osm.pbf)
```

Notes:

- substitute `<filename>.osm` with the saved .osm file (e.g., produced through JOSM); also `<filename>.pbf` can be used;
- to refresh the data, simply relaunch the osm2pgsql command (as the default option is to recreate the tables); anyway Tilemill shall be closed before (as well as any other client accessing the db). You can also drop the database, recreate it with the psql commands shown before and do again osm2pgsql;
- try removing the –s option when managing big .osm files, if the import operation is too slow;
- try reducing -C 800 to a smaller cache size (MB) if you verify memory errors.

If still you fail to connect to the database, try editing `%programfiles%\PostgreSQL\*version*\data\pg_hba.conf` and changing all `md5` with `trust`

Note to create the indexes (which could slightly speed up db access):

```
%USERPROFILE%\Documents\MapBox\project\openstreetmap-carto-master\scripts\indexes.py | "C:\Program Files\PostgreSQL\<version>\bin\psql" -h localhost -U postgres -d gis
```

alternatively:

```
"c:\Program Files\PostgreSQL\<version>\bin\psql" -h localhost -U postgres -d gis -f indexes.sql
```

### Install Shapeindex

Create a folder to place shapeindex.exe.

Download the Win32 ZIP package of Mapnik from <http://mapnik.org/pages/downloads.html> (other [Shapeindex link](http://mapnik.s3.amazonaws.com/dist/archive/shapeindex-2.2.0-win-x86_32.zip)), open it with 7Zip (install it from http://www.7-zip.org) and extract `shapeindex.exe`; move this file and all related DLL files to the previously created folder. This is needed by `get-shapefiles.py` to speed-up the access to the shapefiles. Notice that the DLL files can be found in the lib directory of the ZIP file; all them have to be saved to the bin directory together with `shapeindex.exe`.

Set the PATH appropriately:

```
set PATH=%PATH;<shapeindex folder>
```

Verify that the shapeindex command works with `shapeindex –V`

Now run:

```
cd %USERPROFILE%\Documents\MapBox\project\openstreetmap-carto-master
scripts\get-shapefiles.py
```

Wait for the completion of the entire process (e.g., "done!")

### Usage of JSON format of project.mml
OpenStreetMap Carto uses a YAML file for defining layers, named *project.mml*. TileMill does not directly support YAML, so rename the YAML file *project.mml* to *project.yaml*, download the latest version of the conversion script [yaml2mml.py](https://raw.githubusercontent.com/jojo4u/openstreetmap-carto/yaml2mml-python3/scripts/yaml2mml.py) (which is no more inluded in the openstreetmap-carto maaster repository), move it to the *script* directory of your repository and run `scripts\yaml2mml.py` to create a JSON format that TileMill can process. To achieve this, follow these steps:

```cmd
python -m pip install --upgrade pip
```

Check that pip works with `pip –V`. (Check also `Scripts\pip` if pip is not found).

```
pip install pyyaml
```

```cmd
ren project.mml project.yaml
```

Download *yaml2mml.py* from [here](https://raw.githubusercontent.com/jojo4u/openstreetmap-carto/yaml2mml-python3/scripts/yaml2mml.py) or [here](https://raw.githubusercontent.com/gravitystorm/openstreetmap-carto/44e01890307417419cb667502317bb4d49e777be/scripts/yaml2mml.py) (open the link with your browser, then save the page/file with name *yaml2mml.py* inside the *script* directory of openstreetmap-carto.

Your source project file will became *project.yaml*.

After a modification to `project.yaml`, you need to run `scripts\yaml2mml.py` so that a `project.mml` in JSON format is created. This will allow TileMill to open the project.

```cmd
scripts\yaml2mml.py
```

Notice that you cannot contribute to openstreetmap-carto through this process[^2]:

- TileMill hosts an old verison of Mapnik and cannot appropriately render the style
- *project.mml* is not in YAML format, so not compatible with openstreetmap-carto; if you really want to manage *project.yaml* for openstreetmap-carto, rename it back to *project.mml* and perform again all tests with [Kosmtik](https://github.com/kosmtik).

### Final checks

Revise all points.

Check in detail the content of [INSTALL.md](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md).

## Start TileMill
{% include_relative _includes/start-tilemill.md os='Windows' script='scripts\yaml2mml.py' program='TileMill' %}

{% include_relative _includes/edit-the-stylesheets.md editor='Atom, gedit, TextWrangler, Notepad++' script='scripts\yaml2mml.py' program='Tilemill' %}
* After a modification to `project.yaml`, you need to run `scripts\yaml2mml.py` 

[^1]: Most of the documentation is taken from [Rendering of OSM data on Windows - Quickstart](https://sourceforge.net/p/topomapcreator/wiki/TileMill/).
[^2]: [Tilemill v0.10 is not supported](https://github.com/gravitystorm/openstreetmap-carto/pull/2473#issuecomment-265031690)
[^3]: Mapbox Studio Classic uses a different rendering technology, not compatible with OpenStreetMap Carto. (With Windows, there might be a possibility to use command line tools, that are not comfortable for autohoring.)