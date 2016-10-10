---
layout: page
title: Description of the OSM rendering process
permalink: /osm-rendering-process/
comments: true
---

## OSM architecture

The following high level description will help to basically understand the OSM [rendering](http://wiki.openstreetmap.org/wiki/Rendering) process. Even if possibly imprecise or outdated in some part, it should allow to rationalize the implemented design.

A map image shown in a browser is built up of many [tiles](https://en.wikipedia.org/wiki/Tiled_web_map), which are little square images all rendered with a variant of the [Mercator projection](https://en.wikipedia.org/wiki/Mercator_projection) called [Web Mercator](https://en.wikipedia.org/wiki/Web_Mercator), identified as [EPSG:3857](http://wiki.openstreetmap.org/wiki/EPSG:3857) or [EPSG:900913](http://docs.openlayers.org/library/spherical_mercator.html). This produces a fast approximation to the truer, but heavier elliptical projection.

A general definition of tiled web map (or slippy map in OpenStreetMap terminology) is reported [here](https://en.wikipedia.org/wiki/Tiled_web_map).

This [link](https://www.mapbox.com/help/how-web-maps-work/) provides an overview of how web maps work.

The following diagram from the [OSM Component overview](http://wiki.openstreetmap.org/wiki/Component_overview "Click here for a description of all components") represents all main elements of the OpenStreetMap architecture.

The relevant blocks for the rendering process are the ones represented in `yellow`{:.highlight-yellow}.

![OSM Components](http://wiki.openstreetmap.org/w/images/1/15/OSM_Components.png)

## Structure of openstreetmap-carto

openstreetmap-carto includes the following files and folders:

* one project/layer description file in *yaml* format ([project.yaml](https://github.com/gravitystorm/openstreetmap-carto/blob/master/project.yaml))
* the same project/layer description file converted into the *json* format ([project.mml](https://github.com/gravitystorm/openstreetmap-carto/blob/master/project.mml))
* one or more CartoCSS stylesheets (e.g., style.mss and all the others)
* a *symbols* subdirectory for storing *svg* and *png* files
* a *scripts* subdirectory including all scripts
* *openstreetmap-carto.style*/*openstreetmap-carto.lua*: osm2pgsql configuration files
* description files: README.md/preview.png/LICENSE.txt/CARTOGRAPHY.md/CONTRIBUTING.md/RELEASES.md/CODE_OF_CONDUCT.md/CHANGELOG.md/INSTALL.md
* support files for the scripts: indexes.yml/road-colors.yaml/indexes.sql/get-shapefiles.sh/.travis.yml

## Description of the rendering process

The rendering process takes its data from a [PostgreSQL](https://www.postgresql.org/) geodatabase with [spatial extension](https://en.wikipedia.org/wiki/Spatial_database) implemented through [PostGIS](http://postgis.net/) (yellow cylinder in the previous drawing). This DB instance holds a constantly updated planet table space in a different format to the database used on the core OSM database server (represented in green in the previous drawing) and is populated by running an [osm2pgsql](https://wiki.openstreetmap.org/wiki/Osm2pgsql) script on minutely [diffs](http://wiki.openstreetmap.org/wiki/Planet.osm/diffs). Osm2pgsql acts as [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load), converting OpenStreetMap incremental data to PostGIS-enabled PostgreSQL DB and is able to manage incremental updates of the database as well as to perform an initial load when needed, keeping the PostGIS instance updated or fully refreshing it (in case of periodic database re-import or following a possible major change in openstreetmap-carto that requires reloading the database).

### Populating the PostGIS instance

The following diagram represents the process to populate the PostGIS instance with OSM data though osm2pgsql.

|                                     | |OSM data extract ![xml][xml]|
|                                     | |↓|
|openstreetmap-carto.style ![txt][txt]|→|osm2pgsql program ![prg][prg]|→|PostgreSQL PostGIS ![db][db]|
|                                     | |↑|
|                                     | |openstreetmap-carto.lua ![lua][lua]|
{: .drawing}
.

*OSM data extract* is a `.osm` file in XML format ([JOSM file format](http://wiki.openstreetmap.org/wiki/JOSM_file_format)) created with [JOSM](https://josm.openstreetmap.de/) or [downloaded from OSM]((http://wiki.openstreetmap.org/wiki/Downloading_data)); alternatively it can be a `.pbf` file in compressed binary format ([Protocolbuffer Binary Format](http://wiki.openstreetmap.org/wiki/PBF_Format)), downloaded from sites like [Geofabrik](http://download.geofabrik.de/).

*openstreetmap-carto.lua* is a [Lua](https://www.lua.org/) script used by *osm2pgsql* for data transformation and aggregation. While some standard data management is hardcoded in *osm2pgsql*, most of the transformations are scripted in *openstreetmap-carto.lua*.

*openstreetmap-carto.style* is a text configuration file of *osm2pgsql*. It describes all the columns which are available in the PostGIS DB tables, to be used by the openstreetmap-carto rendering process. Specifically, any DB field used in *project.yaml* shall match a description in *openstreetmap-carto.style*. *openstreetmap-carto.style* is the *.style* file for OpenStreetMap Carto.

Notice that whenever *openstreetmap-carto.lua* or *openstreetmap-carto.style* need to be changed (e.g., to address some requirement of newly introduced DB columns within openstreetmap-carto), a full database re-import process has to be accomplished (very infrequent operation currently).

Transformations hardcoded in osm2pgsql might be rather invasive, like the one mentioned [here](https://github.com/gravitystorm/openstreetmap-carto/issues/2297) where tags from inner members are dropped if the outer has the "same" tags.

### Obtaining an indexed image of the shapefiles

Some features in OSM need a specific preprocessing because of their complexity or even to try fixing sparse issues which are currently present in the available data, like unclosed polygons for complex and relevant features or imprecisions of coastlines; also, assembling different parts into a usable whole is needed to simplify rendering. So, features like land polygons, [Antarctic ice sheet](https://en.wikipedia.org/wiki/Antarctic_ice_sheet) outlines, world boundaries, country boundaries and offshore land lines are periodically processed offline and converted into shapefiles, which need to be separately rendered instead of managing related data directly into PostgreSQL.

For this, all periodically preprocessed shapefiles data derived from OSM shall be downloaded into a specific folder to be locally accessed by the rendering engine and also indexed for improved search performance.

Shapefiles currently used by OSM for rendering the standard map can be found in [OpenStreetMapData](http://openstreetmapdata.com/), [Natural Earth](http://www.naturalearthdata.com) and [Planet OSM](http://planet.openstreetmap.org/).

Additional information available [here](http://wiki.openstreetmap.org/wiki/Planet.osm), [here](http://wiki.openstreetmap.org/wiki/OSMCoastline) and [here](http://wiki.openstreetmap.org/wiki/Coastline_error_checker).

The process adopted to download and index the needed shapefiles is the following:

|shapefiles ![dl][dl]|→|**get-shapefiles.py** ![prg][prg]|→|shapefiles *data* directory ![shape][shape]|
{: .drawing}

Alternatively to the Python script `get-shapefiles.py`, also the shell script `get-shapefiles.sh` might be available.

### Mapnik rendering

The core rendering software currently used by OpenStreetMap is [Mapnik](https://wiki.openstreetmap.org/wiki/Mapnik), which reads the available data fonts, including the PostGIS database and the shapefiles included in the data directory and then generates the tile raster images ([tiles](https://wiki.openstreetmap.org/wiki/Tiles)) basing on a proprietary XML [stylesheet](https://github.com/mapnik/mapnik/wiki/XMLConfigReference).

Exploiting a PostGIS database as the backend provides efficient and flexible retrieval from a large amounts of data, allowing optimizations relate to the interaction of PostGIS SQL spatial queries and Mapnik's layers, rules, and filters.

Produced tiles are then delivered through a custom Apache module named [mod_tile](http://wiki.openstreetmap.org/wiki/Mod_tile), which is responsible for serving tiles and for requesting the rendering of tiles if they aren't already available in cache or if they have changed since.

[Apache](https://en.wikipedia.org/wiki/Apache_HTTP_Server) provides the front end web server that handles requests from your web browser and passes the request to *mod_tile*, which in turn checks if the tile has already been created and is ready for use or whether it needs to be updated due to not being in the cache already. If it is already available and does not need to be rendered, then it immediately sends the tile back to the client. If it does need to be rendered, then it will add it to a *render request* queue, and when it gets to the top of the queue, a tile renderer will render it and send the tile back to the client.

In order to efficiently serve tiles over Internet, OSM exploits [more renderers](http://dns.openstreetmap.org/render.openstreetmap.org.html){:target="_blank"} and a [CDN](http://wiki.openstreetmap.org/wiki/Platform_Status) (Content Delivery Network) implemented through multiple frontend web caching proxies running [Squid](https://en.wikipedia.org/wiki/Squid_(software)) and/or [TileCache](http://wiki.openstreetmap.org/wiki/TileCache).

[![OSM CDN](https://blog.openstreetmap.org/wp-content/uploads/2015/03/osm-cdn-2015-03.png "Click to open the GeoDNS chart")](http://dns.openstreetmap.org/tile.openstreetmap.org.html){:target="_blank"}

The web interface for browsing the rendered OpenStreetMap data is named [Slippy Map](http://wiki.openstreetmap.org/wiki/Slippy_Map#OpenStreetMap_.22Standard.22_tile_server). The slippy map is an [Ajax](https://en.wikipedia.org/wiki/Ajax_(programming)) JavaScript component running in the browser, which dynamically requests maps from the tile server in the background (without reloading the whole HTML page) to give a smooth slippy zoomy map browsing experience.

### Process to convert the project/layer description file 

OpenStreetMap Carto adopts file formats that are [much easier to maintain](https://github.com/gravitystorm/openstreetmap-carto/issues/711) than the target XML file processed by Mapnik. These files can be directly edited by contributors and a code review can be performed via [GitHub](https://en.wikipedia.org/wiki/GitHub). OpenStreetMap Carto styles are in CartoCSS format. Besides, a *project definition file* contains the core metadata to the project as well as a reference to its sources (vector tiles, shapefiles, PostGIS, etc.) and the CartoCSS stylesheets it uses; it dscribes the layers and includes the PostGIS queries for each layer; this file is in [YAML](https://en.wikipedia.org/wiki/YAML) format and named *project.yaml*. The conversion of the OpenStreetMap Carto source files into the XML Mapnik file is made by a tool named [Carto](https://github.com/mapbox/carto). The old versions of Carto were able to process a project definition file in JSON format (and not YAML), so a preprocessing of *project.yaml* (YAML format, more readable) into *project.mml* was needed and the tool named [yaml2mml.py](https://github.com/gravitystorm/openstreetmap-carto/blob/master/scripts/yaml2mml.py) does this. The newer versions of Carto are directly capable of processing *project.yaml*. The output of Carto is the Mapnik XML file, merging the definitions in *project.mml* together with all referenced styles in *.mms* files and all shapefile links; the obtained XML file is in final format, to be directly processed by Mapnik.

|project.yaml ![yml][yml]              | |                             | ||
|                ↓                     | |                             | ||
|**yaml2mml.py** ![prg][prg]           |→|project.mml ![json][json]    | ||
|                                      | |         ↓                   | ||
|osm-carto CartoCSS styles (.mml) ![css][css]|→|**carto** ![prg][prg]        |→|Mapnik XML ![xml][xml]|
{: .drawing}
.

### Process to render data

Mapnik reads the following sources to render the tiles:

* Mapnik XML, generated by compiling the OpenStreetMap Carto files and including all rendering definitions
* PostGIS data, via queries and configuration included in Mapnik XML
* Shapefiles data, via configuration included in Mapnik XML

The process to generate the Mapnik XML file from the OpenStreetMap Carto sources is the following:

|                             | |Mapnik XML ![xml][xml]|
|                             | |↓|
|PostgreSQL PostGIS ![db][db] |→|**Mapnik**  ![prg][prg]|→|images ![png][png]|
|                             | |↑|
|                             | |shapefiles *data* directory ![shape][shape]|
{: .drawing}
.

Some description of the rendering with the standard tile layer is described [here]http://wiki.openstreetmap.org/wiki/Standard_tile_layer) and [here](http://wiki.openstreetmap.org/wiki/Coastline#Rendering_in_Standard_tile_layer_on_openstreetmap.org).

Notice that OpenStreetData uses the Web Mercator projection (defined in project.yaml and then compiled into the Mapnik XML file). It has the effect to distort the size of objects as the latitude increases from the Equator to the poles, where the scale becomes infinite. Therefore, for example, landmasses such as Greenland and Antarctica appear much larger than they actually are relative to landmasses near the equator, such as Central Africa.

## Development and testing environment

The development environment based on [Kosmtik](https://github.com/kosmtik) reflects the OSM architecture through a local toolchain.

|project.yaml ![yml][yml]       | |osm-carto CartoCSS styles (.mml) ![css][css]|
|                               |↘|↓|
|PostgreSQL PostGIS ![db][db]   |→|**Kosmtik**  ![prg][prg]|→|Web images ![web][web]|
|                               |↗|↑|
|localconfig.json ![json][json] | |shapefiles *data* directory ![shape][shape]|
{: .drawing}
.

Kosmtik includes Carto, [node-mapnik](https://github.com/mapnik/node-mapnik) and an internal node-js tileset web service.

Refer to [Installing Kosmtik and OpenStreetMap-Carto on Ubuntu](../kosmtik-ubuntu-setup) for further information on the Kosmtik configuration needed for OpenStreetMap Carto.

{% include pages/images.md %}
