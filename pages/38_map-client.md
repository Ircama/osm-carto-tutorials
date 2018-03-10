---
layout: page
title: JavaScript libraries for implementing OSM interactive maps
comments: true
permalink: /map-client/
---

A number of client JavaScript libraries can be used to interactively show OpenStreetMap tiled web maps[^1]. Each configuration in this document points to the OSM tile server (*tile.openstreetmap.org*) with a note on how to reconfigure the related script to connect your own tile server (*http://your-server-ip/osm_tiles*).

## Leaflet

{% include_relative _includes/leaflet.md os='Ubuntu' %}

## OpenLayers

The following [example](https://jsfiddle.net/ircama/ed1bzo90/) exploits [OpenLayers](https://openlayers.org) to show OpenStreetMap data.

Default tiles can be replaced with your tile server ones by changing

```html
https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

to `http://your-server-ip/osm_tiles/{z}/{x}/{y}.png`.

To edit the sample, click on *Edit in JSFiddle*. Then in the Javascript panel modify the string inside quotes as descripted above. Press *Run*.

<script async src="https://jsfiddle.net/ircama/ed1bzo90/embed/"></script>

## Google Maps API

[Example](https://jsfiddle.net/ircama/7wb8u6s8/) of using [Google Maps API](https://developers.google.com/maps/) to show OpenStreetMap data.

Default tiles can be replaced with your tile server ones by changing

```html
https://tile.openstreetmap.org/
```

to `http://your-server-ip/osm_tiles/`.

To edit the sample, click on *Edit in JSFiddle*. Then in the Javascript panel modify the string inside quotes as descripted above. Press *Run*.

<script async src="https://jsfiddle.net/ircama/7wb8u6s8/embed/"></script>

## Bing Maps

[Example](https://fiddle.jshell.net/ircama/L3v8g0eh/) of using [Bing Maps](https://www.microsoft.com/maps/choose-your-bing-maps-API.aspx) to show OpenStreetMap data.

Default tiles can be replaced with your tile server ones by changing

```html
https://tile.openstreetmap.org/
```

to `http://your-server-ip/osm_tiles/`.

To edit the sample, click on *Edit in JSFiddle*. Then in the Javascript panel modify the string inside quotes as descripted above. Press *Run*.

<script async src="https://fiddle.jshell.net/ircama/L3v8g0eh/embed/"></script>

## Mapbox API

[Example](https://jsfiddle.net/ircama/eLb09na5/) of using [Mapbox API](https://www.mapbox.com/mapbox.js) to show OpenStreetMap data.

Default tiles can be replaced with your tile server ones by changing

```html
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

to `http://your-server-ip/osm_tiles/{z}/{x}/{y}.png`.

To edit the sample, click on *Edit in JSFiddle*. Then in the Javascript panel modify the string inside quotes as descripted above. Press *Run*.

<script async src="https://jsfiddle.net/ircama/eLb09na5/embed/"></script>

## Carto API

[Example](https://jsfiddle.net/ircama/d80w7hb1/) of using [Carto API](https://carto.com/docs/) to show OpenStreetMap data.

Default tiles can be replaced with your tile server ones by changing

```html
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

to `http://your-server-ip/osm_tiles/{z}/{x}/{y}.png`.

To edit the sample, click on *Edit in JSFiddle*. Then in the Javascript panel modify the string inside quotes as descripted above. Press *Run*.

<script async src="https://jsfiddle.net/ircama/d80w7hb1/embed/"></script>

## ESRI ArcGIS API

[Example](https://jsfiddle.net/ircama/7m427rr7/) of using [ESRI ArcGIS API](https://developers.arcgis.com/en/javascript/) to show OpenStreetMap data.

Default tiles can be replaced with your tile server ones by changing

```html
https://tile.openstreetmap.org/
```

to `http://your-server-ip/osm_tiles/`.

To edit the sample, click on *Edit in JSFiddle*. Then in the Javascript panel modify the string inside quotes as descripted above. Press *Run*.

<script async src="https://jsfiddle.net/ircama/7m427rr7/embed/"></script>

[^1]: useful information taken form [Getting started with Leaflet](https://switch2osm.org/using-tiles/getting-started-with-leaflet/) and from [Getting started with OpenLayers](https://switch2osm.org/using-tiles/getting-started-with-openlayers/)