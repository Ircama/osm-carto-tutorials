---
layout: page
title: Hw configuration and sw versions
permalink: /rendering-hw-sw/
sitemap: false
comments: true
---

vial.openstreetmap.org
Tile server

https://hardware.openstreetmap.org/servers/vial.openstreetmap.org/

vial is running Ubuntu 16.04.1 LTS
All three tile servers are now running mapnik 3.0.9 with postgres 9.5 and postgis 2.2.
I updated carto to the latest release when doing the upgrades so it is 0.16.3 currently. That is installed from npm anyway so is easily upgraded when necessary.



* osm2pgsql: [0.88.1 for Ubuntu 16.04 (and 0.90.1 for yakkety)](https://github.com/gravitystorm/openstreetmap-carto/issues/657#issuecomment-247884068)

List of servers
https://github.com/openstreetmap/operations
