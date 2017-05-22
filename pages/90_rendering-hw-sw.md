---
layout: page
title: Hw and sw configuration of OSM production tile servers
permalink: /rendering-hw-sw/
comments: true
---

A merged contribution to openstreetmap-carto is not automatically published. The maintainers periodically [tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) the latest set of updates and [publish](https://git-scm.com/book/en/v2/Git-Basics-Tagging#Sharing-Tags) it into a GitHub release.

To verify the current version of openstreetmap-carto, check the [Releases](https://github.com/gravitystorm/openstreetmap-carto/releases) section of the GitHub repository. Besides, the main changes are included in the [CHANGELOG](https://github.com/gravitystorm/openstreetmap-carto/blob/master/CHANGELOG.md) document. The latest release is published to the tile servers. The OSM server administrators can control which version to install[^1] by manually updating the related [Chef role](https://github.com/openstreetmap/chef/commits/master/roles/tile.rb), where the selected version number of Openstreetmap Carto is reported.

The update process foresees the re-rendering of z0-12; then any tile older than the style file is treated as dirty so that it will be re-rendered (if possible) when it is next requested[^2].

There are the following [three](http://munin.openstreetmap.org/) tile servers at the time of writing, with link to the related hw configuration:

* [vial.openstreetmap.org](https://hardware.openstreetmap.org/servers/vial.openstreetmap.org/)
* [orm.openstreetmap](https://hardware.openstreetmap.org/servers/orm.openstreetmap.org/)
* [yevaud.openstreetmap](https://hardware.openstreetmap.org/servers/yevaud.openstreetmap.org/)

Summary of the software configuration of the tile servers as found in some GitHub posts and sites:[^3] [^4]

* O.S. version: Ubuntu 16.04.1 LTS (old outdated ref. [here](https://github.com/openstreetmap/operations/issues/104))
* Mapnik version: 3.0.9 (Mapnik 3 is now required); for the most updated information on required version, see [INSTALL](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md).
* PostgreSQL version: 9.5
* PostGIS version: 2.2
* Carto version: 0.18.0 (it is installed from npm and can be easily upgraded when necessary); for the most updated information on required version, see [INSTALL](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md).
* osm2pgsql version: [0.88.1 for Ubuntu 16.04 (and 0.90.1 for yakkety)](https://github.com/gravitystorm/openstreetmap-carto/issues/657#issuecomment-247884068)
* openstreetmap-carto version: check [Configuration of the production Tile Servers](https://github.com/openstreetmap/chef/blob/master/roles/tile.rb#L93), section *:styles*, item *:revision*.

The [Operations Working Group log](https://gravitystorm.github.io/owg-log/) reports updated information regarding versions.

Other information (from [Munin](http://munin.openstreetmap.org/)):

* tile servers are also running [*mod_tile*](https://github.com/openstreetmap/mod_tile) and *renderd*.
* *Tile cache servers* (separate systems from the *tile servers*) are running [squid](https://en.wikipedia.org/wiki/Squid_(software)) [ref. [Chef service-specific tile role](https://github.com/openstreetmap/chef/blob/master/roles/tilecache.rb) and [Server Monitoring](http://munin.openstreetmap.org/)]

Other useful references:

* [Configuration of the production Tile Servers](https://github.com/openstreetmap/chef/blob/master/roles/tile.rb) and related [issues](https://github.com/openstreetmap/chef/issues). [tile cookbook](https://github.com/openstreetmap/chef/tree/master/cookbooks/tile) that installs and configures the mod_tile+renderd based tileservers that power tile.openstreetmap.org.
* List of servers, specifications and issues: [OSMF Server Info](https://hardware.openstreetmap.org/), [OpenStreetMap Operations](https://github.com/openstreetmap/operations)
* [PostgreSQL indexes(https://github.com/openstreetmap/operations/issues/104)
* [updates processed by osm2pgsql](https://github.com/openstreetmap/chef/blob/master/cookbooks/tile/templates/default/replicate.erb)

[^1]: [math1985](https://github.com/math1985)'s [comment on issue 243](https://github.com/gravitystorm/openstreetmap-carto/pull/2473#issuecomment-264490751)
[^2]: [tomhughes](https://github.com/tomhughes)'s [comment on Chef issue 103](https://github.com/openstreetmap/chef/issues/103#issuecomment-264657532)
[^3]: [Upgrade tileservers to mapnik3 - chef issue log](https://github.com/openstreetmap/chef/issues/39)
[^4]: [kocio-pl](https://github.com/kocio-pl)'s [comment on issue 2080](https://github.com/gravitystorm/openstreetmap-carto/issues/2080#issuecomment-249390120)
