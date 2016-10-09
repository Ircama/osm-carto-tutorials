---
layout: page
title: Editing Guidelines for OpenStreetMap Carto
permalink: /editing-guidelines/
sitemap: false
comments: true
---

This document includes the description of the development process and some best practices for managing the OpenStreetMap Carto style.

## Development process to add a feature or to improve it

The process to add a new feature or to improve an existing one is described in the following chart.

|Find the DB columns related to the new feature within the PostGIS instance|
|↓|
|Also verify that all needed columns are included in *openstreetmap-carto.style*.<br/>Notice that if a column is not in this file, it should also not be present in the DB and the new feature cannot be added (as *openstreetmap-carto.style* shall not be modified).|
|↓|
|Check whether the selected columns are already managed within the appropriate layers of *project.yaml*.<br/>If everything is already appropriately defined in *project.yaml*, all modifications can be directly implemented within the CartoCSS *.mss* files.<br/>Conversely, if layers are available but the feature is not present, *project.yaml* has to be edited by adding the feature to the layer in all related references.<br/>For complex development, a new layer might be needed and in this case a new section has to be added to *project.yaml*.|
|↓|
|The *.mss* files can then be modified to define the rendering attributes of the new feature within its related layer.<br/>If a new layer is added, possibly a new *.mss* file needs to be created.|
|↓|
|All modifications must be tested with Kosmtik on different regions and using all zooms; regions shall be selected in the planet for places with high concentration of the feature and zones with low concentration|
{: .drawing .djustify}

## Description of *project.yaml*

Header:

```
scale: 1
metatile: 2
name: "OpenStreetMap Carto"
description: "A general-purpose OpenStreetMap mapnik style, in CartoCSS"
bounds: &world
  - -180
  - -85.05112877980659
  - 180
  - 85.05112877980659
center:
  - 0
  - 0
  - 4
format: "png"
interactivity: false
minzoom: 0
maxzoom: 22
srs: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over"
```

These lines define the rendering settings for Mapnik. Notice that latitude bounds exlude the poles, where the scale becomes infinite with Mercator projection.
The *center* tag defines the starting centre point (0, 0) and zoom (4); these correspond to the default map image shown by Kosmtik.
*srs* is the adopted spatial reference system.

The following code defines the macros for the projection and for the datasource:

```
# Various parts to be included later on
_parts:
  # Extents are used for tilemill, and don't actually make it to the generated XML
  extents: &extents
    extent: *world
    srs-name: "900913"
    srs: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over"
  extents84: &extents84
    extent: *world
    srs-name: "WGS84"
    srs: "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
  osm2pgsql: &osm2pgsql
    type: "postgis"
    dbname: "gis"
    key_field: ""
    geometry_field: "way"
    extent: "-20037508,-20037508,20037508,20037508"
```

Description:

* *extents*: PostGIS data and shapefiles in EPSG:900913 Web Mercator projection
* *extents84*: Shapefiles in WGS84 projection
* *osm2pgsql*: PostGIS plugin accessing the "gis" database with default parameters (host, user, password, etc.)

Refereces to all used *.mss* stylesheets to be integrated in the compiled Mapnik XML input file:

```
Stylesheet:
  - "style.mss"
  - "shapefiles.mss"
  - "landcover.mss"
  - "water.mss"
  - "water-features.mss"
  - "road-colors-generated.mss"
  - "roads.mss"
  - "power.mss"
  - "placenames.mss"
  - "buildings.mss"
  - "stations.mss"
  - "amenity-points.mss"
  - "ferry-routes.mss"
  - "aerialways.mss"
  - "admin.mss"
  - "addressing.mss"
```

Subsequently to the stylesheets, all layers are defined.

```
Layer:
  - id: ...
...
```


## Zoom definition in stylesheets

Keep in mind that because Mercator is a variable scale projection there is no direct relationship between zoom level and scale. At a typical resolution computer screen z13 for example can be somewhere between about 1:70000 (Equator) and 1:8000 (northern Greenland).

## Some suggestions

When thinking about mapping and tagging it is usually best to completely 
ignore the question of how something can be possibly rendered in a map 
at first and simply consider how it can be represented in the database 
in a way that allows following mappers visiting the area to objectively 
verify if the mapping is accurate or not.

On the other side, when rendering a feature it is essential to evaluate....

First create an issue to present the idea and discuss

Avoid comments

Keep the same format

Smallest set of modifications at the cost of creating more branches

Test with many zones

Mercator

Usage of the tags with wiki

Verify that you are rendering an appropriate tagging and that the wiki supports it and that there is no case of missing or misunderstood tag

Count number of use. If lower than 10k the reason to introduce a new feature has to be deeply discussed

Consider solving an open issue first, before introducing a new feature

Geometric Mean

One feature per pr

Allow the commenters and maintainers to challenge a new feature, support your idea and be ready to accept the decision not to merge it

Text size and word wrap

Add a short one line commit message. In the commit line, reference the issue Id (eg issue #1234) then a blank line, then a long description which has to be repeated in the pr text

When making an improvement, try to reuse similar methods already included in the style for other features.

## Map Icon Guidelines

Icons for the submitted to the standard tile layer will be:
* SVG only
* flat (single colour [usually black], no gradients, no outlines)
* clean (reduced complexity where possible)
* sharp (aligned to pixel grid)
* single point of view (avoid use of perspective where possible)
* common canvas size (usually 14x14px)

Read the [https://wiki.openstreetmap.org/wiki/Map_Icons/Map_Icons_Standards](Map Icon Standards)
on how to approach designing clear icons.

More information at [https://wiki.openstreetmap.org/wiki/Map_Icons](OSM wiki Map Icons)
and information concerning icon color.


SVG

- use svg files for symbols
## Best practices of svg symbols

- keeps svg essential
- remove uneeded comments
- do not add a copyrighted svg


## OpenStreetMap Data structure

OpenStreetMap uses a topological data structure with four core elements (also known as data primitives):

* *Nodes* are points with a geographic position, stored as coordinates (pairs of a latitude and a longitude) according to WGS 84. Outside of their usage in ways, they are used to represent map features without a size, such as points of interest or mountain peaks.
* *Ways* are ordered lists of nodes, representing a polyline, or possibly a polygon if they form a closed loop. They are used both for representing linear features such as streets, rivers and areas (like forests, parks, parking areas and lakes).
* *Relations* are ordered lists of nodes and ways (together called "members"), where each  member  can  optionally  have  a  "role"  (a  string). Relations  are  used  for representing the relationship of existing nodes and ways. Examples include turn restrictions on roads, routes that span several existing ways (for instance, a long-distance motorway), and areas with holes.
* *Tags* are key-value pairs (both arbitrary strings). They are used to store metadata about the map objects (such as their type, their name and their physical properties). Tags are not free-standing, but are always attached to an object, to a node, a way, a relation, or to a member of an relation.

A recommended ontology of map features (the meaning of tags) is maintained on the OSM Wiki.


{% include pages/images.md %}