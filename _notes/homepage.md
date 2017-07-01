---
layout: homepage
title: OpenStreetMap Carto Tutorials
---
[OpenStreetMap Carto](https://github.com/gravitystorm/openstreetmap-carto) is the [style](http://wiki.openstreetmap.org/wiki/Stylesheets) used for the [Standard tile layer](http://wiki.openstreetmap.org/wiki/Standard_tile_layer) of [OpenStreetMap](https://en.wikipedia.org/wiki/OpenStreetMap).

This independent site includes unofficial tutorials to set-up a development environment of OpenStreetMap Carto and to manage this software. It will allow exploiting the style and also being able to contribute to the developments.

To implement this site I kept track of technical notes that have been useful to me and that I hope will also be of help to master OpenStreetMap Carto fast, learning all most relevant aspects from the ground up.

All pages of this site allow [commenting](#disqus_thread). You can also [contribute](how-to-contribute/) or create [GitHup issues]({{ site.author.url }}{{ site.baseurl }}/issues). Opening GitHup issues is the most effective way for correction requests.

**DISCALIMER**: the documentation included in this site is **unofficial**, might be at early stage and could require improvements that will be possibly addressed in the future. I strongly recommend referencing the [official documentation](https://github.com/gravitystorm/openstreetmap-carto#installation) for openstreetmap-carto. Keep also in mind that some information might be only valid at the time of writing and could require possible updates.

## Contributing to OpenStreetMap

OpenStreetMap, the Wikipedia of maps, is a collaborative project to create a free editable map of the world. It consists of [open data](http://wiki.openstreetmap.org/wiki/Contribute_map_data) and open source software; both can be [contributed](http://wiki.openstreetmap.org/wiki/How_to_contribute).

A [Beginners' guide](http://wiki.openstreetmap.org/wiki/Beginners%27_guide) is available in the [OpenStreetMap Wiki](http://wiki.openstreetmap.org), providing basic information on how to add data to OpenStreetMap.

Technical details to maintain and develop the OpenStreetMap open source software, from portal to rendering and other backend platforms, can be found at the [Develop](http://wiki.openstreetmap.org/wiki/Develop) page.

## OpenStreetMap Carto

[OpenStreetMap Carto](https://github.com/gravitystorm/openstreetmap-carto) includes the [CartoCSS map stylesheets](http://wiki.openstreetmap.org/wiki/CartoCSS) for the [Standard map layer](http://wiki.openstreetmap.org/wiki/Standard_tile_layer) of [OpenStreetMap](http://www.openstreetmap.org). The styles can be converted from CartoCSS to [XML](https://github.com/mapnik/mapnik/wiki/XMLConfigReference) and then processed by [Mapnik](http://wiki.openstreetmap.org/wiki/Mapnik).

CartoCSS is a [CSS-like](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) language for map design developed by [MapBox](https://en.wikipedia.org/wiki/Mapbox) and currently adopted by OpenStreetMap.

The OpenStreetMap Carto project is owned by [Andy Allan](https://github.com/gravitystorm), who had the brilliant idea to re-implement the [original OpenStreetMap Mapnik XML style](https://github.com/openstreetmap/mapnik-stylesheets) in CartoCSS, performing the [initial port](https://lists.openstreetmap.org/pipermail/dev/2012-December/026256.html), involving [multiple maintainers](https://github.com/gravitystorm/openstreetmap-carto#maintainers) and opening the project to [contributors](https://github.com/gravitystorm/openstreetmap-carto/graphs/contributors).

If you are also willing to contribute, you are strongly advised to analyze [Guidelines for adding new features](https://github.com/gravitystorm/openstreetmap-carto/issues/1630) and understand the current project trend, which is very cautious with additions.