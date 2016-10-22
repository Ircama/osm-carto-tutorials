---
layout: page
title: JavaScript libraries for implementing OpenStreetMap interactive maps
comments: true
permalink: /map-client/
sitemap: false
---

A number of client libraries can be used to interactively show OpenStreetMap data within tiled web maps.

## Leaflet

The following [example](http://jsfiddle.net/ircama/0oend7he/) exploits [Leaflet](http://leafletjs.com/) to show OpenStreetMap data.

Default tiles can be replaced with your tile server ones by changing

```html
http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

to `http://your-server-ip/osm_tiles/{z}/{x}/{y}.png`.

To edit the sample, click on *Edit in JSFiddle*. Then in the Javascript panel modify the string inside quotes as descripted above. Press *Run*.

<script async src="//jsfiddle.net/ircama/0oend7he/embed/"></script>

## OpenLayers

The following [example](http://jsfiddle.net/ircama/ed1bzo90/) exploits [OpenLayers](http://openlayers.org) to show OpenStreetMap data.

Default tiles can be replaced with your tile server ones by changing

```html
http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

to `http://your-server-ip/osm_tiles/{z}/{x}/{y}.png`.

To edit the sample, click on *Edit in JSFiddle*. Then in the Javascript panel modify the string inside quotes as descripted above. Press *Run*.

<script async src="//jsfiddle.net/ircama/ed1bzo90/embed/"></script>

## Google Maps API

[Example](https://jsfiddle.net/ircama/7wb8u6s8/) of using [Google Maps API](https://developers.google.com/maps/) to show OpenStreetMap data.

Default tiles can be replaced with your tile server ones by changing

```html
http://tile.openstreetmap.org/
```

to `http://your-server-ip/osm_tiles/`.

To edit the sample, click on *Edit in JSFiddle*. Then in the Javascript panel modify the string inside quotes as descripted above. Press *Run*.

<script async src="//jsfiddle.net/ircama/7wb8u6s8/embed/"></script>

## Bing Maps

[Example](http://jsfiddle.net/ircama/yj19xkpd/) of using [Bing Maps](https://www.microsoft.com/maps/choose-your-bing-maps-API.aspx) to show OpenStreetMap data.

Default tiles can be replaced with your tile server ones by changing

```html
http://tile.openstreetmap.org/
```

to `http://your-server-ip/osm_tiles/`.

To edit the sample, click on *Edit in JSFiddle*. Then in the Javascript panel modify the string inside quotes as descripted above. Press *Run*.

<script async src="//jsfiddle.net/ircama/yj19xkpd/embed/"></script>