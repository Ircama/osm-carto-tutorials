The following scripts are provided to support coding. They are necessary and useful solely during making changes to the map style and are unnecessary for map rendering.

### scripts/get-external-data.py

This script generates and populates the *data* directory with all needed shapefiles, including indexing them through *shapeindex*. Check [INSTALL](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md) for further documentation.

```shell
usage: get-external-data.py [-h] [-f] [-c CONFIG] [-D DATA] [-d DATABASE] [-H HOST] [-p PORT] [-U USERNAME] [-v] [-q] [-w PASSWORD] [-R RENDERUSER]

Load external data into a database

optional arguments:
  -h, --help            show this help message and exit
  -f, --force           Download new data, even if not required
  -c CONFIG, --config CONFIG
                        Name of configuration file (default external-data.yml)
  -D DATA, --data DATA  Override data download directory
  -d DATABASE, --database DATABASE
                        Override database name to connect to
  -H HOST, --host HOST  Override database server host or socket directory
  -p PORT, --port PORT  Override database server port
  -U USERNAME, --username USERNAME
                        Override database user name
  -v, --verbose         Be more verbose. Overrides -q
  -q, --quiet           Only report serious problems
  -w PASSWORD, --password PASSWORD
                        Override database password
  -R RENDERUSER, --renderuser RENDERUSER
                        User to grant access for rendering
```

*get-external-data.py* can be run from the *scripts* directory of *openstreetmap-carto*, or from its base folder.

Typical usage:

```shell
scripts/get-external-data.py
```

### scripts/generate_road_colours.py

For any modification on the road classes colours, do not modify *road-colors-generated.mss* directly. Check instead *road-colors.yaml* and related internal description. Then run `scripts/generate_road_colours.py > road-colors-generated.mss`.

```shell
usage: generate_road_colours.py [-h] [-v]

Generates road colours

optional arguments:
  -h, --help     show this help message and exit
  -v, --verbose  Generates information about colour differences
```

Typical usage:

```shell
$ pip install colormath # (or "sudo pip install colormath" to install the needed Python prerequisite)

$ scripts/generate_road_colours.py > road-colors-generated.mss
```

Not all values are possible; *generate_road_colours.py* will throw an error if you pick values that cannot be converted to RGB.
Usage of [HUSL](http://www.husl-colors.org) is recommended.

### scripts/generate_shields.py

This script generates all SVG files inside the symbols/shields folder related to highway shields. It uses *road-colors.yaml* to configure the shield colors.

The generated files are then used by *roads.mss* (specifically, by *roads-text-ref-low-zoom* and *roads-text-ref* styles).

Files are named *symbols/shields/[highway]_[width]x[height].svg*, *symbols/shields/[highway]_[width]x[height]_z16.svg* and *symbols/shields/[highway]_[width]x[height]_z18.svg* where *width* = 1 to 10 and *height* = 1 to 4.

Related configuration is internal. The script exploits *generate_road_colours.py* to read *road-colors.yaml* configuration file.

The currently produced files are related to *motorway*, *trunk*, *primary*, *secondary* and *tertiary* highway tags (while *track* and *path* are not managed at the moment).

**Installation**

+ Installation of prerequisite components with Windows:
  
  Download the LXML WHL library from https://pypi.python.org/pypi/lxml
  
  Example using Python 2.7:
  
  ```shell
      > pip install lxml-3.6.4-cp27-cp27m-win32.whl
      > pip install colormath
  ```
  
  Example using Python 3.5:

  ```shell
      > pip install lxml-3.6.4-cp35-cp35m-win32.whl
      > pip install colormath
  ```
  
  Running the script:

  ```shell
      > scripts/generate_road_colours.py > road-colors-generated.mss
      > scripts/generate_shields.py
  ```

+ Installation of prerequisite components with Ubuntu:

  ```shell
  sudo apt-get install -y python-pip python3-pip libxml2-dev libxslt1-dev python-dev python-lxml python-colormath
  sudo pip install colormath
  sudo pip install lxml
  ```
  
    Running the script:

  ```shell
    $ scripts/generate_road_colours.py > road-colors-generated.mss
    $ scripts/generate_shields.py
  ```

### scripts/shop_values.rb

This Ruby script generates a list of popular shop values with more than MIN_COUNT occurences in OpenStreetMap database according to taginfo.
it is useful during creating/updating list of shops displayed with generic dot icon.

### scripts/indexes.py

A new SQL query defined in project.mml might need the definition of SQL indexes that shall be coded in *indexes.yml*, which is the related dictionary adopted by OpenStreetMap Carto.

Do not modify *indexes.sql* directly: use this script instead, which reads *indexes.yml* and creates SQL statements to the standard output, to be redirected to *indexes.sql*. There are a number of options for concurrent index creation, recreating the osm2pgsql-built indexes, fillfactors, and other settings to give full control of the resulting statements.

```shell
usage: indexes.py [-h] [--concurrent] [--fillfactor FILLFACTOR] [--notexist]
                  [--osm2pgsql] [--reindex]

Generates custom index statements

optional arguments:
  -h, --help            show this help message and exit
  --concurrent          Generate indexes CONCURRENTLY
  --fillfactor FILLFACTOR
                        Custom fillfactor to use
  --notexist            Use IF NOT EXISTS (requires 9.5)
  --osm2pgsql           Include indexes normally built by osm2pgsql
  --reindex             Rebuild existing indexes
```

Typical usage:

```shell
$ scripts/index.py > index.sql
```

A goal with the indexes is to have them general-purpose enough to not need frequent changing with stylesheet changes, but to be usable with many versions, and potentially other styles.
