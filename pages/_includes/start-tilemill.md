The application needs a few seconds to start, so be patient.

Select project *Openstreetmap Carto*

Give {{ include.program }} the time to render the map: accessing the database and rendering images is often a slow process (mainly depending on the amount of data to be managed, but also on the server performance and on the network), so give many seconds to {{ include.program }} to output or refresh the map.

Zoom out to the entire world shape (zoom level 1 or to some close zooms like zoom 4), then progressively zoom into the region where you downloaded the map data. You might use the double click and wait for the next zoom level to appear.

{% if include.os == "Windows" %}
On the right pane, it is normal that only the first 4 tabs are displayed; this is an issue of the installed old {{ include.program }} version. (Check [this note](https://github.com/mapbox/tilemill/pull/2184))
{% endif %}

You shouldn't use the text editor built-in to {{ include.program }}. Instead, hide the right pane and use an external text editor.

{{ include.program }} automatically refreshes the rendering upon any file change, including all *.mss* and *project.mml* (notice that also a change in *project.yaml* activates a new rendering; anyway, remember to also run `{{ include.script }}`).

## Access the map from your browser

With your browser, access the map through <http://localhost:20009>

To directly access the project: <http://127.0.0.1:20009/#/project/openstreetmap-carto>

Notice that *Https* will not work (use http instead).

## TileMill documentation

* [TileMill GitHub project](https://github.com/tilemill-project/tilemill)
* [TileMill GitHub Documentation](http://tilemill-project.github.io/tilemill/)