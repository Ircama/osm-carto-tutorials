---
layout: page
title: Hw and sw configuration of OSM production tile servers
permalink: /rendering-hw-sw/
comments: true
---

A merged contribution to openstreetmap-carto is not automatically published. The maintainers periodically [tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) the latest set of updates and [publish](https://git-scm.com/book/en/v2/Git-Basics-Tagging#Sharing-Tags) it into a [GitHub release](https://github.com/gravitystorm/openstreetmap-carto/blob/master/RELEASES.md).

To verify the current version of openstreetmap-carto, check the [Releases](https://github.com/gravitystorm/openstreetmap-carto/releases) section of the GitHub repository. Besides, the main changes are included in the [CHANGELOG](https://github.com/gravitystorm/openstreetmap-carto/blob/master/CHANGELOG.md) document. The latest release is published to the tile servers. The OSM server administrators can control which version to install[^1] by manually updating the related [Chef role](https://github.com/openstreetmap/chef/commits/master/roles/tile.rb), where the selected version number of Openstreetmap Carto is reported.

The update process foresees the re-rendering of z0-12; then any tile older than the style file is treated as dirty so that it will be re-rendered (if possible) when it is next requested[^2].

There are the following [three](https://munin.openstreetmap.org/) tile servers at the time of writing, with link to the related hw configuration:

* [vial.openstreetmap.org](https://hardware.openstreetmap.org/servers/vial.openstreetmap.org/)
* [orm.openstreetmap](https://hardware.openstreetmap.org/servers/orm.openstreetmap.org/)
* [yevaud.openstreetmap](https://hardware.openstreetmap.org/servers/yevaud.openstreetmap.org/)

Openstreetmap uses [Munin](http://munin-monitoring.org/) for server monitoring,

[Tile server munin graphs](https://munin.openstreetmap.org/openstreetmap/render.openstreetmap/index.html) are available to tell what's happening on the systems; there is also a [description](https://help.openstreetmap.org/questions/527/how-can-i-make-sense-of-muninopenstreetmaporg) on how to interpret them.

Summary of the software configuration of the tile servers as found in some GitHub posts and sites:[^3] [^4] [^5]

* O.S. version: Ubuntu 18.04
* Mapnik version: 3.0.19 (Mapnik 3 is required; see [INSTALL](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md).
* PostgreSQL version: 10
* PostGIS version: 2.4
* Carto version: 1.1.0 (see [INSTALL](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md).
* osm2pgsql version: 0.96.1
* openstreetmap-carto version: check [Configuration of the production Tile Servers](https://github.com/openstreetmap/chef/blob/master/roles/tile.rb#L93), section *:styles*, item *:revision*.
* [Currently used carto command line argument](https://github.com/openstreetmap/chef/blob/master/cookbooks/tile/recipes/default.rb#L350)
* [Usage of nodejs-legacy no more needed](https://github.com/openstreetmap/chef/blob/master/cookbooks/nodejs/recipes/default.rb#L27-L29)

The [Operations Working Group log](https://gravitystorm.github.io/owg-log/) reports updated information regarding versions.

Other information (from [Munin](https://munin.openstreetmap.org/)):

* tile servers are also running [*mod_tile*](https://github.com/openstreetmap/mod_tile) and *renderd*.
* [Tile server configuration](https://github.com/openstreetmap/chef/blob/master/cookbooks/tile/recipes/default.rb)
* *Tile cache servers* (separate systems from the *tile servers*) are running [squid](https://en.wikipedia.org/wiki/Squid_(software)) [ref. [Chef service-specific tile role](https://github.com/openstreetmap/chef/blob/master/roles/tilecache.rb) and [Server Monitoring](https://munin.openstreetmap.org/)]

Other useful references:

* List of [software of the production Tile Servers](https://github.com/openstreetmap/chef/blob/master/cookbooks/supybot/templates/default/git.conf.erb). 
* [Chef cookbooks of the production Tile Servers](https://github.com/openstreetmap/chef/tree/master/cookbooks/tile/templates/default) and [root of the Chef Tile Cookbook](https://github.com/openstreetmap/chef/tree/master/cookbooks/tile).
* [Configuration of the production Tile Servers](https://github.com/openstreetmap/chef/blob/master/roles/tile.rb) and related [issues](https://github.com/openstreetmap/chef/issues). [tile cookbook](https://github.com/openstreetmap/chef/tree/master/cookbooks/tile) that installs and configures the mod_tile+renderd based tileservers that power tile.openstreetmap.org.
* List of servers, specifications and issues: [OSMF Server Info](https://hardware.openstreetmap.org/), [OpenStreetMap Operations](https://github.com/openstreetmap/operations)
* [PostgreSQL indexes(https://github.com/openstreetmap/operations/issues/104)
* [updates processed by osm2pgsql](https://github.com/openstreetmap/chef/blob/master/cookbooks/tile/templates/default/replicate.erb)
* [Current Tile CDN geographical setup](https://dns.openstreetmap.org/tile.openstreetmap.org.html)
* [Tile delivery CDN monitoring](https://munin.openstreetmap.org/openstreetmap/tile.openstreetmap/index.html)

[^1]: [math1985](https://github.com/math1985)'s [comment on OpenStreetMap Carto issue 243](https://github.com/gravitystorm/openstreetmap-carto/pull/2473#issuecomment-264490751)
[^2]: [tomhughes](https://github.com/tomhughes)'s [comment on Chef issue 103](https://github.com/openstreetmap/chef/issues/103#issuecomment-264657532)
[^3]: [Upgrade tileservers to mapnik3 - Chef issue log](https://github.com/openstreetmap/chef/issues/39)
[^4]: [kocio-pl](https://github.com/kocio-pl)'s [comment on OpenStreetMap Carto issue 2080](https://github.com/gravitystorm/openstreetmap-carto/issues/2080#issuecomment-249390120)
[^5]: [tomhughes](https://github.com/tomhughes)'s [comment on Chef issue 155](https://github.com/openstreetmap/chef/issues/155#issuecomment-413818970)
