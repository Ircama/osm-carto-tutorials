---
layout: page
title: Editing Guidelines for OpenStreetMap Carto
permalink: /editing-guidelines/
comments: true
rendering-note: this page is best viewed with Jekyll rendering
---
This page aims to describe the general editing process of OpenStreetMap Carto, the style used for the [Standard tile layer](https://wiki.openstreetmap.org/wiki/Standard_tile_layer) of OpenStreetMap, through some suggested practices.

## Development process to add or edit a feature

The following workflow summarizes the main actions.

|**Check DB data.**![db][db]<span>Within the PostGIS instance, find the DB columns related to the feature in scope.<span>Verify that the needed column is included in *openstreetmap-carto.style* or that the [hstore](https://www.postgresql.org/docs/9.5/static/hstore.html) tags column can provide the needed feature through the *tags->'feature'* syntax. As *osm2pgsql* populates hstore values for features that are not present in *openstreetmap-carto.style*, this file is expected to be rarely modified.|
|↓|
|**Edit project.mml.**![yml][yml]<span>Check whether the selected columns are already managed within the appropriate layers in *project.mml*.<span>If everything is already appropriately defined, all modifications can be directly implemented within the CartoCSS *.mss* files.<span>Conversely, if the feature is not present within the layer(s), *project.mml* has to be edited.<span>For complex development, a new layer might be needed and in this case a new section has to be developed in *project.mml*.|
|↓|
|**Edit the .mss style.**![css][css]<span>The *.mss* files can then be modified to define the rendering attributes of the new feature within each related layer. CartoCSS selectors shall refer layers or classes defined in *project.mml*. Inside a selector, filters and properties define rendering attributes.<span>If a new layer is added, possibly a new *.mss* stylesheet file needs to be created.|
|↓|
|**Test modifications.**![html][html]<span>All modifications must be tested (e.g., with Kosmtik) on different regions and using all zooms; regions shall be selected by analyzing wide areas, checking places with high and low concentration of the feature.|
{: .drawing .djustify}

Before entering into the details of editing the styles, in case you are also willing to contribute to OpenStreetMap Carto, you are strongly suggested to have a look to [Guidelines for adding new features](https://github.com/gravitystorm/openstreetmap-carto/issues/1630). It's a long thread which qualifies and limits the current contribution scope to this project. The Git repository discourages unbounded addition of features and cartographic complexity; also, there are discussions about removal of existing ones. Check also [Review onboarding](https://github.com/gravitystorm/openstreetmap-carto/issues/2291#issuecomment-242908868).

## Description of *project.mml*

The definition and configuration file of openstreetmap-carto is named *project.mml* and uses the [YAML](http://yaml.org/) format. Wikipedia contains an [introduction to YAML](https://en.wikipedia.org/wiki/YAML).

The reason for using the [YAML](https://en.wikipedia.org/wiki/JSON#YAML) format instead of the former [JSON](https://en.wikipedia.org/wiki/JSON) is described [here](https://github.com/gravitystorm/openstreetmap-carto/issues/711) and [here](https://github.com/gravitystorm/openstreetmap-carto/pull/947):lit is easier to edit and maintain, especially for SQL queries. The current version of [carto](https://github.com/mapbox/carto) can directly process it.

The definition of [project.mml](https://tilemill-project.github.io/tilemill/docs/manual/files-directories/#structure-of-a-tilemill-project) and more CartoCSS stylesheets has been adoped by Mapbox basing on a convention from Cascadenik, a predecessor to CartoCSS created outside of Mapbox. In Cascadenik, *project.mml* [contained XML](http://teczno.com/cascadenik/doc/) with CSS-like stylesheet embedded in `<Stylesheet><![CDATA[...]]></Stylesheet>` tag and, since the stylesheet included in *project.mml* started to grow, they moved it off to a separate file with MSS extension.[^7]

The configuration of *project.mml* is grouped into sections, each configures a different aspect. Relevant sections:

* globals settings: default values that are used in the other configuration sections;
* *_parts*: definition of the YAML aliases for the projection and for the datasource;
* *Stylesheet*: list of all used *.mss* files;
* *Layer*: definition of all layers that openstreetmap-carto offers. Each layer can consist of multiple sources.

In YAML, the order of the sections is not important. The indentation is significant and shall only contain space characters. Tabulators are not permitted for indentation. The order of each layer is important.

The first part relates to the globals settings:

```yaml
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

The above lines define the rendering settings for Mapnik. Notice that latitude bounds exclude the poles (with the same settings adopted by Google Maps), where the [scale becomes infinite](https://en.wikipedia.org/wiki/Mercator_projection#Web_Mercator) with Mercator projection.
The *center* tag defines the starting lat/long centre point (0, 0) and zoom (4); these correspond to the default map image shown by TileMill at startup.
*srs* is the adopted spatial reference system. The verbose `+proj` definitions ensure Mapnik is programmed with all appropriate parameters (`+over` for instance is required).[^2]

The `_parts` section defines the [YAML aliases]((http://www.yaml.org/spec/1.2/spec.html#id2786196)) for the projection and for the datasource:

```yaml
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

* *extents*: PostGIS data and shapefiles in [EPSG:900913 Web Mercator](https://en.wikipedia.org/wiki/Web_Mercator#OpenLayers:900913) projection (OSM target projection, same as Google Maps).
* *extents84*: Shapefiles in [WGS84 projection](https://en.wikipedia.org/wiki/World_Geodetic_System).
* *osm2pgsql*: [PostGIS plugin](https://github.com/mapnik/mapnik/wiki/PostGIS) accessing the a PostgreSQL database named "gis" with default parameters (host, user, password, etc.).

Pulling an example from the file, we get this reference YAML:

```yaml
# Various parts to be included later on
_parts:
  # Extents are used for tilemill, and don't actually make it to the generated XML
  extents: &extents
    extent: *world
    srs-name: "900913"
    srs: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over"
  osm2pgsql: &osm2pgsql
    type: "postgis"
    dbname: "gis"
    key_field: ""
    geometry_field: "way"
    extent: "-20037508,-20037508,20037508,20037508"
Layer:
  - id: "citywalls"
    name: "citywalls"
    class: ""
    geometry: "linestring"
    <<: *extents
    Datasource:
      <<: *osm2pgsql
      table: |-
        (SELECT
            way
          FROM planet_osm_line
          WHERE historic = 'citywalls')
        AS citywalls
    advanced: {}
```

The `<<: *extents` key merges the keys from the `&extents` mapping of the *_parts* section into that location, avoiding having to specify them again, and same for `<<: *osm2pgsql`. The idea is taken from the [MapProxy](http://mapproxy.org/docs/nightly/configuration.html?highlight=parts#mapproxy-yaml) documentation. Fortunately, an understanding of YAML isn't needed to use them when adding a layer - you just copy from existing layers. The `_parts` in JSON is ignored by *carto* and doesn't impact the output XML; TileMill also appears to ignore it.[^1]

The `Stylesheet` section references all used *.mss* CartoCSS stylesheets to be integrated in the compiled Mapnik XML input file:

```yaml
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

Subsequently to the *stylesheets* to be included in the source file for Mapnik, all layers are defined.

```yaml
Layer:
  - ...
...
```

Layers are how sets of data are added to a map. Each layer references a single source file (e.g., shapefile) or database query (e.g., a PostGIS query). Multiple layers can be combined over top of each other to create the final map.[^4] A basic description of their definition is reported in the [TimeMill documentation](https://tilemill-project.github.io/tilemill/docs/manual/adding-layers/).

Layers are configured as arrays. The YAML format `-` indicates the start of the next item in an array. Generally the `-` appears before the `id` attribute (but might happen before a different attribute, e.g., `name`).[^3]

Layers referring `type: "postgis"` (e.g., `<<: *osm2pgsql` in `Datasource:`) use the Mapnik *postgis* plugin. Plugins read geometric data from some specific external format to the internal format used by Mapnik. The PostGIS plugin requires to specify a SQL query that returns a table of data. That table must contain a column called *way* (of PostGIS type [geometry](http://postgis.net/docs/geometry.html)). The table may contain arbitrary other columns, which are used to support rendering and can be invoked in the styling rules. The SQL query will be augmented with a bounding box condition by Mapnik ([ST_SetSRID('BOX3D(...](https://github.com/mapnik/mapnik/wiki/PostGIS#bbox-token)). The SELECT needs a subquery specifying a [SQL table alias](https://en.wikipedia.org/wiki/Alias_(SQL)), which is generally the same identifier used in the `id`. In the above example, as the layer is named *citywalls* (`- id: "citywalls"`), the query after `table: |-` can be (but not necessarily is):

```sql
(SELECT way, ... FROM ... WHERE ...) AS citywalls
```

The [Strip chomp](http://www.yaml.org/spec/1.2/spec.html#id2794534) modifier `|-` (ref. [YAML Reference card](http://yaml.org/refcard.html)) is used to insert a block, preserving newlines and stripping the final line break character.

Some [tokens](https://github.com/mapnik/mapnik/wiki/PostGIS#bbox-token) can appear in a query processed by the PostGIS plugin of Mapnik: `!bbox!`, `!scale_denominator!`, `!pixel_width!` and `!pixel_height!`.

PostgreSQL queries which can be defined in *project.mml* might become complex and always need tuning. Check [OptimizeRenderingWithPostGIS](https://github.com/mapnik/mapnik/wiki/OptimizeRenderingWithPostGIS) for details and analysis. Check also [Identifying Slow Rendering Queries](http://www.paulnorman.ca/blog/2016/08/identifying-slow-rendering-queries/).

Relation between Geometry and SQL Table is the following:

|Geometry|SQL Table|Type
|:----------:|:-------------:|:---:|
|"linestring"|planet_osm_line|way
|"linestring"|planet_osm_roads|way
|"point"|planet_osm_point|node
|"polygon"|planet_osm_polygon|relation

*project.mml* at the moment provides 79 layers. Generally, the more features that your map will include, the more layers that you'll want. Basing on the [painter algorithm](https://en.wikipedia.org/wiki/Painter%27s_algorithm), the order in which they are defined is the order in which they are rendered.

Relevant attributes of each layer:

* `id`: layer identifier; defines a "*#identifier*" selector (selector preceded by hash), to be used in *.mss files.
* `name`: the name of the layer, generally the same as `id`; this references the layer and is used by programs like Tilemill, allowing the user to select layers and filter their visibility. Notice that *carto 0.17* marks `name` as deprecated and it will be removed in carto 1.0[^8].
* `class`: when set, defines one or more classes, to be used in *mss files as *.identifier* selector (selector preceded by dot); classes are used to define a single rendering description for many layers sharing the same class name. For instance, `class: "barriers"` is used by `id: "area-barriers"` and by `id: "line-barriers"`; then, in *landcover.mss*, a selector named `.barriers {...}` defines attributes which are common to both layers.
* `geometry`: symbolizer type which can be `linestring` (way), `point` (node) or `polygon`. These attributes can be used as filters.
* `Datasource`: can be `file: "filename"`/`type: "shape"` for shapefiles, or `<<: *osm2pgsql`/`table: |-` for PostGIS queries.
* `properties` might indicate `minzoom` and `maxzoom`, which filter the Mapnik rendering to the defined set of zoom levels (also used to improve rendering performance, by avoiding to process layers which are only filtered within specific zooms in their .mss stylesheets).
* `advanced` is not valued in openstreetmap-carto (e.g., `advanced: {}`).

## CartoCSS *.mss* stylesheets

*.mss* stylesheets are in CartoCSS format.

The CartoCSS reference manual (by Mapbox) can be found in the [Carto documentation](http://mapbox.com/carto/).

A description of efficient methods for structuring CartoCSS styles is available at [CartoCSS Best Practices](https://carto.com/docs/carto-engine/cartocss/best-practices/).

A critical review of CartoCSS is reported in [The end of CartoCSS](https://www.mapbox.com/blog/the-end-of-cartocss/) blog post.

The columns in the SQL queries define the CartoCSS properties used as [filter selectors](https://tilemill-project.github.io/tilemill/docs/guides/selectors/#filter-selectors) or [labels](https://tilemill-project.github.io/tilemill/docs/guides/styling-labels/).

Consider the following style defined in project.mml (with some revisions as example):

```yaml
  - id: "water-areas"
    name: "water-areas"
    class: "water-elements"
    geometry: "polygon"
    <<: *extents
    Datasource:
      <<: *osm2pgsql
      table: |-
        (SELECT
            way,
            "natural",
            waterway,
            landuse,
            name,
            way_area/NULLIF(!pixel_width!::real*!pixel_height!::real,0) AS way_pixels
          FROM planet_osm_polygon
          WHERE
            (waterway IN ('dock', 'riverbank', 'canal')
              OR landuse IN ('reservoir', 'basin')
              OR "natural" IN ('water', 'glacier'))
            AND building IS NULL
            AND way_area > 0.01*!pixel_width!::real*!pixel_height!::real
          ORDER BY z_order, way_area DESC
        ) AS water_areas
    properties:
      minzoom: 4
    advanced: {}
```

In the above example, the style is identified as "water-areas", named with the same label, rendered at zoom >= 4; it uses polygons, defines a class named "water-elements" and provides the following properties for the CartoCSS stylesheet: `[name]`, `[landuse]`, `[waterway]`, `[way_pixels]` (the latter produces the area in screen pixels), `[natural]` (in double quotes to prevent being interpreted as SQL token); these are the columns of the SQL Query.

Notice that the area is calculated in pixels and not in meters, to avoid the need of compensation at different latitudes in relation to the Mercator projection. Similarly, a line length should be calculated in pixels using the [geometric mean](https://en.wikipedia.org/wiki/Geometric_mean) of x and y (sqrt(x*y))[^5]:

```
ST_Length(way)/NULLIF(SQRT(!pixel_width!::real*!pixel_height!::real),0)
```

A file named *water.mss* includes the related CartoCSS styles.

It might have a selector named `#water-areas` to specifically refer this layer:

```
#water-areas {
  # styles will apply to 'water-areas' layer only
  ...
}
```

Or it might have the `.water-elements` class:

```
.water-elements {
  # this applies to all layers with class 'water-elements'
  ...
}
```

SQL statements might also include ordering by user-supplied strings in the last term of an ORDER BY clause to get a consistent ordering across metatiles.

Let us consider this simplified CartoCSS example:

```shell
#water-areas {
  [natural = 'glacier']::natural {
    [zoom >= 6] {
      line-width: 0.75;
      line-color: @glacier-line;
      polygon-fill: @glacier;
      [zoom >= 8] {
        line-width: 1.0;
      }
      [zoom >= 10] {
      ...
      }
    }
  }

  [waterway = 'dock'],
  [waterway = 'canal'] {
    text-name: "[name]";
    ...
  }

  [landuse = 'basin'][zoom >= 7]::landuse {
    polygon-fill: @water-color;
    [way_pixels >= 4] {
      polygon-gamma: 0.75;
    }
    [way_pixels >= 64] {
      polygon-gamma: 0.6;
    }
  }
  ...
}
```

In the above example, *landuse*, *waterway*, *way_pixels* and *natural* are used as filters, while *name* is used as label. All are DB columns.

A feature might be rendered through more layers. Generally (but not always) a layer is rendered through a specific stylesheet (.mss).

Take for instance `amenity=place_of_worship`, which is defined in the following layers (within the current version of *project.mml*):

* *landcover* (geometry: "polygon"):
  - `#landcover` selector in *landcover.mss*
  - related rendering produces regular highlights for polygons

* *buildings-major* (geometry: "polygon"):
  - `#buildings-major` selector in *buildings.mss*
  - related rendering produces special highlights for polygons with wide "way_area"

* *amenity-points-poly* (class: "points", geometry: "polygon"):
  - `.points` class in *amenity-points.mss*
  - related rendering adds marker icon for polygons

* *amenity-points* (class: "points", geometry: "point"):
  - `.points` class in *amenity-points.mss* (uses the same class of amenity-points-poly)
  - related rendering adds marker icon for points

* *text-poly* (class: "text", geometry: "polygon"):
  - `.text` class in *amenity-points.mss*
  - related rendering produces adds text label

Stylesheet *landcover.mss*:

```scss
...

#landcover-low-zoom[zoom < 10],
#landcover[zoom >= 10] {
  ...
  [feature = 'amenity_place_of_worship'][zoom >= 13] {
    ... # fill polygon
  }
  ...
}
...
```

Stylesheet *buildings.mss*:

```scss
...
#buildings-major {
  [zoom >= 13] {
    ...
    [amenity = 'place_of_worship'] {
      ... # special highlights for polygons with wide "way_area"
    }
  }
}
...
```

Stylesheet *amenity-points.mss*:

```scss
...
.points {
...
  [feature = 'amenity_place_of_worship'][zoom >= 16] {
    ... # add marker
  }
...
}
...
.text-low-zoom[zoom < 10],
.text[zoom >= 10] {
...
  [feature = 'amenity_place_of_worship'][zoom >= 17] {
    ... # add text
  }
...
}
...
```

## Reference documentation

### Cartography design goals and guidelines

The reference document is [CARTOGRAPHY](https://github.com/gravitystorm/openstreetmap-carto/blob/master/CARTOGRAPHY.md). It is an important prerequisite to start contributing to the Openstreetmap Carto style.

### Instructions for contributions

The reference document is [CONTRIBUTING](https://github.com/gravitystorm/openstreetmap-carto/blob/master/CONTRIBUTING.md). This document includes essential development guidelines.

## Design patterns

[Christoph Hormann](https://github.com/imagico) published an excellent document on [Design goals and guidelines for the Openstreetmap-carto style](https://matteobrusa.github.io/md-styler/?url=https://raw.githubusercontent.com/imagico/openstreetmap-carto/a8c9a49ad5f0e4c1fa0f34f580adbebfbe9cc5c3/CARTOGRAPHY.md&theme=bootstrap). It extends the official [CARTOGRAPHY](https://github.com/gravitystorm/openstreetmap-carto/blob/master/CARTOGRAPHY.md) document with considerations on colors and zoom levels; reading and understanding it is recommended.

### Zoom filter in stylesheets

When defining the appropriate zoom level to render a feature, it is important to consider the effect of the [Mercator projection](https://en.wikipedia.org/wiki/Mercator_projection).

Because Mercator is a [variable scale projection](https://en.wikipedia.org/wiki/Mercator_projection#Scale_factor), there is no direct relationship between zoom level and scale. At a typical resolution computer screen, z13 for example can be somewhere between about 1:70000 (Equator) and 1:8000 (northern Greenland).

A given scale for equator can be adjusted to a specific latitude by multiplying it by cos(latitude). For example, divide by 2 for latitude 60 (Oslo, Helsinki, Saint-Petersburg).

Resolution and Scale of Slippy map tiles is described [here](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Resolution_and_Scale) and [here](https://wiki.openstreetmap.org/wiki/Zoom_levels).

Some features need to scale up their font size according to the zoom level. If you are implementing different text sizes according to the zoom, consider also different wordwrap. The pattern to follow for the text size logic is described in [Multi-line labels in CONTRIBUTING](https://github.com/gravitystorm/openstreetmap-carto/blob/master/CONTRIBUTING.md#multi-line-labels), [landuse samples](https://github.com/gravitystorm/openstreetmap-carto/blob/master/amenity-points.mss#L1455-L1475) and [lakes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/water.mss#L288-L312).

### Additional recommendations

* Render only verifiable features
  Before considering to render a feature, it is important to verify whether its definition does not lack [verifiability](https://wiki.openstreetmap.org/wiki/Verifiability) and that the related spatial data model is appropriate (for instance, a natural area might be defined as polygon and shall not be defined as way).
  Also, the definition of the feature in the OSM Wiki shall be based on mapping considerations and not on rendering (for instance, it is important to check the existence of inappropriate definitions including wrong suggestion to mappers, for instance with reference to specific colors, or to rendering shapes, or to any other misleading indication which would ultimately end up in orienting mappers to map in a way that primarily works around the shortcomings of rendering engines rather than defining the appropriate shape and geometry of the feature).
  It is worthwhile to check the *Approval* status in the OpenStreetMap wiki and related usage statistics. Note anyway there is no formal approval about the tag page on the wiki. The status in the description box refers to the fact that there is an approved proposal that mentions a tag. The proposal process in the OpenStreetMap wiki is essentially meaningless for rendering decisions, it is just a means (but no guarantee) to improve tagging consistency [^6]. Also the *Talk* page shall be analyzed to verify whether there are remarks to be taken into consideration or to highlight some issue on tagging.
* Before starting to code the rendering of a feature, verify that you are rendering an appropriate tagging; check that the [Wiki](https://wiki.openstreetmap.org) supports it and that there is no case of missing or misunderstood tag. Also, verify its usage in different regions.
* When considering to implement an improvement to the style, it is suggested to first create an issue, presenting the idea, asking whether there is a reason for the current style and discuss the most appropriate way to address a solution.
* Count the number of uses for a tag you are going to render. For low usage, the reason to introduce a new feature has to be deeply discussed. Always consider the possibility to merge a newly rendered feature with some existing one, rather than adding something with separate code.
* Everything currently found in the style has been deeply discussed by many contributors. When considering to change something, an extensive research has to be accomplished, shared and discussed. Besides, all previous repository issues related to the feature need to be revised and understood.
* Always keep the same format, style and exactly the same coding conventions already adopted for the OpenStreetMap Carto project.
* Implement the smallest set of modifications within a specific branch, at the cost of creating more branches; consider one feature per PR-
* Test your development with many zones.
* When making an improvement, try to reuse similar methods already included in the style for other features.
* Do not use any Mapnik syntax like `text-allow-overlap: true` which make characters overlap (not allowed in cartography).
* Do not think that your contribution might be incomplete or partial, with some hope that other people could further improve it in the future: the history of merges demonstrates the contrary.
* Avoid comments or including your name in the code
* Allow the commenters and maintainers to challenge a new feature, support your idea and be ready to accept the decision not to merge it.

## Scripts

{% include_relative _includes/scripts-osm-carto.md %}

### Other useful scripts and commands

Validate the MML against multiple Mapnik versions, and report its lines for debugging purposes:

    sudo apt install libxml2-utils
    for m in 3.0.0 3.0.12; do carto -a $m project.mml 2>&- | xmllint - | wc -l; done

Validate that the SVGs are valid XML:

    find symbols/ -name '*.svg' | xargs xmllint --noout

Check and validate the Lua tag transforms:

    sudo apt install lua5.2  # install Lua interpreter (osm2pgsql embeds it)
    cd openstreetmap-carto   # position inside the openstreetmap-carto directory
    lua scripts/lua/test.lua # run the test script

## Pattern casing

Within openstreetmap-carto project, folder with pathname *symbols/generating_patterns* includes sources (.svg files), process description (.md files) and produced images (.png files) of patterns built from two separately generated svg files by means of raster processing.

Details are in [generating_patterns folder](https://github.com/gravitystorm/openstreetmap-carto/tree/master/symbols/generating_patterns), which also includes *.md (markdown) documents.

## Useful tools

* Complete (but non-autogenerated) [legend of the Standard map layer used on www.openstreetmap.org](https://wiki.openstreetmap.org/wiki/Standard_tile_layer/Key) on the [OSM wiki](https://wiki.openstreetmap.org)
* [OSM Inspector](https://tools.geofabrik.de/osmi/)
* [Taginfo](https://taginfo.openstreetmap.org) and [its usage](https://taginfo.openstreetmap.org/tags/?key=natural&value=ridge#overview)
* [OSM Tag History](http://taghistory.raifer.tech)
* [overpass turbo](https://overpass-turbo.eu/)

## OpenStreetMap Data structure

OpenStreetMap uses a [topological data structure](https://www.mapbox.com/mapping/osm-data-model/) with four core elements (also known as data primitives):

* [Nodes](https://wiki.openstreetmap.org/wiki/Node) are points with a geographic position, stored as coordinates (pairs of a latitude and a longitude) according to WGS 84. Outside of their usage in ways, they are used to represent map features without a size, such as points of interest or mountain peaks.
* [Ways](https://wiki.openstreetmap.org/wiki/Way) are ordered lists of nodes, representing a polyline, or possibly a polygon if they form a closed loop. They are used both for representing linear features such as streets, rivers and areas (like forests, parks, parking areas and lakes).
* [Relations](https://wiki.openstreetmap.org/wiki/Relation) are ordered lists of nodes and ways (together called "members"), where each  member  can  optionally  have  a  "role"  (a  string). Relations  are  used  for representing the relationship of existing nodes and ways. Examples include turn restrictions on roads, routes that span several existing ways (for instance, a long-distance motorway), and areas with holes.
* [Tags](https://wiki.openstreetmap.org/wiki/Tags) are key-value pairs (both arbitrary strings). They are used to store metadata about the map objects (such as their type, their name and their physical properties). Tags are not free-standing, but are always attached to an object, to a node, a way, a relation, or to a member of an relation.

A recommended ontology of [map features](https://wiki.openstreetmap.org/wiki/Map_Features) (the meaning of tags) is maintained on the [OSM Wiki]((https://wiki.openstreetmap.org/wiki/Standard_tile_layer/Key)).

{% include pages/images.md %}

[^1]: Text taken from [an openstreetmap-carto comment for pull 947](https://github.com/gravitystorm/openstreetmap-carto/pull/947#issuecomment-55513587).
[^2]: Text taken from [an openstreetmap-carto comment for issue 2101](https://github.com/gravitystorm/openstreetmap-carto/issues/2101#issuecomment-223933484).
[^3]: Text taken from [an openstreetmap-carto comment for issue 528](https://github.com/gravitystorm/openstreetmap-carto/issues/528#issuecomment-254495790).
[^4]: Text taken from [TileMill documentation](https://tilemill-project.github.io/tilemill/docs/manual/adding-layers/)
[^5]: Text taken from [an openstreetmap-carto comment for pull 2138](https://github.com/gravitystorm/openstreetmap-carto/pull/2138)
[^6]: Text taken from [imagico](https://github.com/imagico)'s [comment for pull 2138](https://github.com/gravitystorm/openstreetmap-carto/pull/2138#issuecomment-259414267)
[^7]: Text taken from [gravitystorm](https://github.com/gravitystorm)'s [comment for pull 2473](https://github.com/gravitystorm/openstreetmap-carto/pull/2473#issuecomment-263553007)
[^8]: Text taken from [nebulon42](https://github.com/nebulon42)'s [comment for pull 2506](https://github.com/gravitystorm/openstreetmap-carto/pull/2506#issuecomment-266558272)