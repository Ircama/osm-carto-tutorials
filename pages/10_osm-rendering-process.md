---
layout: page
title: Description of the OSM rendering process
permalink: /osm-rendering-process/
sitemap: false
---
comments: true

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

* one project/layer description file in yaml format (project.yaml)
* the same project/layer description file in json format (project.mml)
* one or more CartoCSS stylesheets (style.mss and aall the others)
* a *symbols* subdirectory for storing svg and png files
* a *scripts* subdirectory including all scripts
* openstreetmap-carto.style/openstreetmap-carto.lua: osm2pgsql configuration files
* description files: README.md/preview.png/LICENSE.txt/CARTOGRAPHY.md/CONTRIBUTING.md/RELEASES.md/CODE_OF_CONDUCT.md/CHANGELOG.md/INSTALL.md
* support files for the scripts: indexes.yml/road-colors.yaml/indexes.sql/get-shapefiles.sh/.travis.yml

## Description of the rendering process

The rendering process takes its data from a [PostgreSQL](https://www.postgresql.org/) geodatabase with [spatial extension](https://en.wikipedia.org/wiki/Spatial_database) implemented through [PostGIS](http://postgis.net/) (yellow cylinder). This DB instance holds a constantly updated planet table space in a different format to the database used on the core OSM database server (represented in green) and is populated by running an [osm2pgsql](https://wiki.openstreetmap.org/wiki/Osm2pgsql) script on minutely [diffs](http://wiki.openstreetmap.org/wiki/Planet.osm/diffs). Osm2pgsql acts as [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load), converting OpenStreetMap incremental data to PostGIS-enabled PostgreSQL DB and is able to manage incremental updates of the database as well as to perform an initial load when needed, keeping the PostGIS instance updated or fully refreshing it (in case of periodic database re-import or following a possible major change in openstreetmap-carto that requires reloading the database).

### Populating the PostGIS instance

The following diagram represents the process to populate the PostGIS instance with OSM data though osm2pgsql.

|                                     | |OSM data extract ![xml][xml]|
|                                     | |↓|
|openstreetmap-carto.style ![txt][txt]|→|**osm2pgsql** ![prg][prg]|→|PostgreSQL PostGIS ![db][db]|
|                                     | |↑|
|                                     | |openstreetmap-carto.lua ![lua][lua]|
{: .drawing}
.

*openstreetmap-carto.lua* is a [Lua](https://www.lua.org/) script used by *osm2pgsql* for data transformation or aggregation. While some standard data management is hardcoded in *osm2pgsql*, most of the transformations are scripted in *openstreetmap-carto.lua*.

*openstreetmap-carto.style* is a text configuration file of *osm2pgsql*. It describes all the columns which are available in the PostGIS db tables, to be used by the openstreetmap-carto rendering process. Specifically, any db field used in *project.yaml* shall be also mentioned in *openstreetmap-carto.style*.

Notice that whenever *openstreetmap-carto.lua* or *openstreetmap-carto.style* need to be changed (e.g., to address some requirement of newly introduced db columns within openstreetmap-carto), a full database re-import process has to be accomplished (very unfrequent operation currently).

### Mapnik rendering

The core rendering software is [Mapnik](https://wiki.openstreetmap.org/wiki/Mapnik), which reads the PostGIS database and generates the tile raster images ([tiles](https://wiki.openstreetmap.org/wiki/Tiles)) basing on a proprietary XML [stylesheet](https://github.com/mapnik/mapnik/wiki/XMLConfigReference).

Exploiting PostGIS allows efficient and flexible online retrieval from a large amounts of data, including the possibility to implement spatial queries.

Tiles are then delivered through a custom Apache module named [mod_tile](http://wiki.openstreetmap.org/wiki/Mod_tile), which is responsible for serving tiles and for requesting the rendering of tiles if they aren't already available in cache or if they have changed since.

[Apache](https://en.wikipedia.org/wiki/Apache_HTTP_Server) provides the front end web server that handles requests from your web browser and passes the request to *mod_tile*, which in turn checks if the tile has already been created and is ready for use or whether it needs to be updated due to not being in the cache already. If it is already available and doesn’t need to be rendered, then it immediately sends the tile back to the client. If it does need to be rendered, then it will add it to a *render request* queue, and when it gets to the top of the queue, a tile renderer will render it and send the tile back to the client.

In order to efficiently serve tiles over Internet, OSM exploits a [CDN](http://wiki.openstreetmap.org/wiki/Platform_Status) (Content Delivery Network) implemented through multiple frontend web caching proxies running [Squid](https://en.wikipedia.org/wiki/Squid_(software)) and/or [TileCache](http://wiki.openstreetmap.org/wiki/TileCache).

![OSM CDN](https://blog.openstreetmap.org/wp-content/uploads/2015/03/osm-cdn-2015-03.png)

The web interface for browsing rendered OpenStreetMap data is named [Slippy Map](http://wiki.openstreetmap.org/wiki/Slippy_Map#OpenStreetMap_.22Standard.22_tile_server). The slippy map is an [Ajax](https://en.wikipedia.org/wiki/Ajax_(programming)) JavaScript component running in the browser, which dynamically requests maps from the tile server in the background (without reloading the whole HTML page) to give a smooth slippy zoomy map browsing experience.

Citare:

openstreetmap-carto.style
LUA
project.yaml
project.mml
carto
XML



## Process to create the data shapefiles

|shapefiles ![dl][dl]|→|**get-shapefiles.py** ![prg][prg]|→|shapefiles *data* directory ![shape][shape]|
{: .drawing}
.

## Process to convert the project/layer description file 

|project.yaml ![yml][yml]              | |                             | ||
|                ↓                     | |                             | ||
|**yaml2mml.py** ![prg][prg]           |→|project.mml ![json][json]    | ||
|                                      | |         ↓                   | ||
|osm-carto CartoCSS styles (.mml) ![css][css]|→|**carto** ![prg][prg]        |→|Mapnik XML ![xml][xml]|
{: .drawing}
.

## Process to render data

|                             | |Mapnik XML ![xml][xml]|
|                             | |↓|
|PostgreSQL PostGIS ![db][db] |→|**Mapnik**  ![prg][prg]|→|images ![png][png]|
|                             | |↑|
|                             | |shapefiles *data* directory ![shape][shape]|
{: .drawing}
.

the Mercator projection distorts the size of objects as the latitude increases from the Equator to the poles, where the scale becomes infinite. So, for example, landmasses such as Greenland and Antarctica appear much larger than they actually are relative to land masses near the equator, such as Central Africa.

## Development and testing environment

The development environment reflects the OSM architecture reproducing the process through a local toolchain.

|project.yaml ![yml][yml]       | |osm-carto CartoCSS styles (.mml) ![css][css]|
|                               |↘|↓|
|PostgreSQL PostGIS ![db][db]   |→|**Kosmtik**  ![prg][prg]|→|Web images ![web][web]|
|                               |↗|↑|
|localconfig.json ![json][json] | |shapefiles *data* directory ![shape][shape]|
{: .drawing}
.


Kosmtik uses [Carto](https://github.com/mapbox/carto)

carto reads the MML file it generates valid Mapnik XML

Instead of an impossible to edit JSON file, osm-carto switched to a YAML file which is easier to read and perform code review on.

yaml2mml.py if you make changes to the .yaml file, and want these to be reflected in the .mml file.

Integra /get-shapefiles.sh 


vial.openstreetmap.org
Tile server

https://hardware.openstreetmap.org/servers/vial.openstreetmap.org/

vial is running Ubuntu 16.04.1 LTS
All three tile servers are now running mapnik 3.0.9 with postgres 9.5 and postgis 2.2.
I updated carto to the latest release when doing the upgrades so it is 0.16.3 currently. That is installed from npm anyway so is easily upgraded when necessary.


List of servers
https://github.com/openstreetmap/operations





## Development architecture





[db]: https://openclipart.org/image/2400px/svg_to_png/94723/db.png =25x25
[xml]: http://image.flaticon.com/icons/png/128/55/55860.png
[css]: http://image.flaticon.com/icons/png/512/55/55570.png
[yml]: http://image.flaticon.com/icons/png/512/55/55699.png
[txt]: http://image.flaticon.com/icons/png/512/55/55643.png
[lua]: http://image.flaticon.com/icons/png/512/29/29488.png
[app]: http://image.flaticon.com/icons/png/512/32/32230.png
[prg]: http://image.flaticon.com/icons/png/512/33/33672.png
[png]: http://image.flaticon.com/icons/png/512/29/29072.png
[run]: http://image.flaticon.com/icons/png/128/149/149294.png
[shape]: http://image.flaticon.com/icons/png/128/149/149229.png
[files]: http://image.flaticon.com/icons/png/512/149/149344.png
[dl]: http://image.flaticon.com/icons/png/512/51/51536.png
[json]: http://image.flaticon.com/icons/png/512/136/136443.png
[web]: http://image.flaticon.com/icons/png/512/186/186274.png
