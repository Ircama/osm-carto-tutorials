---
layout: page
title: Hw and sw configuration of OSM production tile servers
permalink: /rendering-hw-sw/
sitemap: false
comments: true
---

Tile servers:

* There are [three](http://munin.openstreetmap.org/) tile servers at the time of writing:

  * [vial.openstreetmap.org](https://hardware.openstreetmap.org/servers/vial.openstreetmap.org/)
  * [orm.openstreetmap](https://hardware.openstreetmap.org/servers/orm.openstreetmap.org/)
  * [yevaud.openstreetmap](https://hardware.openstreetmap.org/servers/yevaud.openstreetmap.org/)

* Main sw configuration of the tile servers (information from [Upgrade tileservers to mapnik3 - chef issue log](https://github.com/openstreetmap/chef/issues/39)):

  * O.S. version: Ubuntu 16.04.1 LTS (old outdated ref. [here](https://github.com/openstreetmap/operations/issues/104))
  * Mapnik version: 3.0.9 in 2.1 compatibility ([reason](https://github.com/gravitystorm/openstreetmap-carto/pull/2383))
  * PostgreSQL version: 9.5
  * PostGIS version: 2.2
  * Carto version: 0.16.3 (it is installed from npm and can be easily upgraded when necessary)
  * osm2pgsql version: [0.88.1 for Ubuntu 16.04 (and 0.90.1 for yakkety)](https://github.com/gravitystorm/openstreetmap-carto/issues/657#issuecomment-247884068)
  * openstreetmap-carto version at the time of writing: v2.44.0 (check [Configuration of the production Tile Servers](https://github.com/openstreetmap/chef/blob/master/roles/tile.rb), section *:styles* for the actual version).

Other information (from [Munin](http://munin.openstreetmap.org/)):

* tile servers are also running mod_tile and renderd
* Tile cache servers are running squid [ref. [Chef service-specific tile role](https://github.com/openstreetmap/chef/blob/master/roles/tilecache.rb) and [Server Monitoring](http://munin.openstreetmap.org/)]

Other useful references:

* [Configuration of the production Tile Servers](https://github.com/openstreetmap/chef/blob/master/roles/tile.rb) and related [issues](https://github.com/openstreetmap/chef/issues)
* List of servers, specifications and issues: [OSMF Server Info](https://hardware.openstreetmap.org/), [OpenStreetMap Operations](https://github.com/openstreetmap/operations)
* [PostgreSQL indexes(https://github.com/openstreetmap/operations/issues/104)
* [updates processed by osm2pgsql](https://github.com/openstreetmap/chef/blob/master/cookbooks/tile/templates/default/replicate.erb)