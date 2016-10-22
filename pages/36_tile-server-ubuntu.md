---
layout: page
title: Installing an OpenStreetMap Tile Server on Ubuntu
comments: true
permalink: /tile-server-ubuntu/
sitemap: false
---

## Introduction

The following step-by-step procedure can be used to install and configure all the necessary software to operate your own OpenStreetMap tile server on Ubuntu 16.4 or 14.4.

The OSM tile server stack is a collection of programs and libraries chained together to create a tile server. As so often with OpenStreetMap, there are many ways to achieve this goal and nearly all of the components have alternatives that have various specific advantages and disadvantages. This tutorial describes the most standard version that is also used on the main OpenStreetMap.org tile server.

It consists of the following main components:

* Mapnik
* Apache
* Mod_tile
* renderd
* osm2pgsql
* PostgreSQL/PostGIS database, to be installed locally (suggested) or remotely (might be slow, depending on the network).
* carto
* openstreetmap-carto

Mod_tile is an apache module that serves cached tiles and decides which tiles need re-rendering either because they are not yet cached or because they are outdated. Renderd provides a priority queueing system for rendering requests to manage and smooth out the load from rendering requests. Mapnik is the software library that does the actual rendering and is used by renderd.

Even if both operating system versions have been tested, Ubuntu 16.4 is strongly suggested.

{% include_relative _includes/update-ubuntu.md %}

{% include_relative _includes/install-git.md program='OpenStreetMap Tile Server' %}

{% include_relative _includes/install-mapnik.md %}

{% include_relative _includes/firewall.md port='80 and local port 443' cdprogram='~/src' %}

{% include_relative _includes/install-apache.md %}

You can test Apache by accessing it through a browser at *http://your-server-ip*.

## Install Mod_tile

[Mod_tile](http://wiki.openstreetmap.org/wiki/Mod_tile) is an Apache module to efficiently render and serve map tiles for www.openstreetmap.org map using Mapnik. We can compile it from Github repository.

    test -d ~/src || mkdir  ~/src ; cd ~/src
    git clone https://github.com/openstreetmap/mod_tile.git
    cd mod_tile
    ./autogen.sh && ./configure && make && sudo make install && sudo make install-mod_tile && sudo ldconfig
    cd ~/

The rendering process implemented by mod_tile and renderd is well explained [here](https://github.com/openstreetmap/mod_tile).

{% include_relative _includes/inst-osm-carto.md cdprogram='~/src' %}

## Install carto and build the Mapnik xml stylesheet

    sudo apt-get install -y node-carto

    cd ~/src
    cd openstreetmap-carto
    scripts/yaml2mml.py
    carto project.mml > style.xml

{% include_relative _includes/configuration-variables.md os='Ubuntu' %}

{% include_relative _includes/postgis-inst.md port='80 and local port 443' cdprogram='~/src' %}

## Configure *renderd*

Next we need to plug renderd and mod_tile into the Apache webserver, ready to receive tile requests.

Edit *renderd* configuration file with your preferite editor:

    sudo vi /usr/local/etc/renderd.conf

In the `[default]` section, change the value of XML and HOST to the following.

    XML=/home/{{ pg_login }}/src/openstreetmap-carto/style.xml
    HOST=localhost

We suppose in the above example that your home directory is */home/{{ pg_login }}*. Change it to your actual home directory.

In `[mapnik]` section, change the value of `plugins_dir`.

    plugins_dir=/usr/lib/mapnik/3.0/input/

Pay attention to the mapnik version: if it is at version 2.2 (Ubuntu 14.4):

    plugins_dir=/usr/lib/mapnik/2.2/input/

Save the file.

Install *renderd* init script by copying the sample init script included in its package.

    sudo cp ~/src/mod_tile/debian/renderd.init /etc/init.d/renderd

Grant execute permission.

    sudo chmod a+x /etc/init.d/renderd

Edit the init script file

    sudo vi /etc/init.d/renderd

Change the following variables:

    DAEMON=/usr/local/bin/$NAME
    DAEMON_ARGS="-c /usr/local/etc/renderd.conf"
    RUNASUSER={{ pg_login }}

In `RUNASUSER={{ pg_login }}` we suppose that your user is *{{ pg_login }}*. Change it to your actual user name.

Add then the following variables:

{% include_relative _includes/configuration-variables.md os='Ubuntu' notitle='yes' %}

Save the file.

Create the following file and set *{{ pg_login }}* (your actual user) the owner.

    sudo mkdir -p /var/lib/mod_tile

    sudo chown {{ pg_login }}:{{ pg_login }} /var/lib/mod_tile

Again change it to your actual user name.

Then start renderd service

    sudo systemctl daemon-reload
    
    sudo systemctl start renderd

    sudo systemctl enable renderd

The following output is regular:

    renderd.service is not a native service, redirecting to systemd-sysv-install
    Executing /lib/systemd/systemd-sysv-install enable renderd

If *systemctl* is not installed (e.g., Ubuntu 14.4) use these commands respectively:

    sudo update-rc.d renderd defaults
    
    sudo service renderd start

## Configure Apache

Create a module load file.

    sudo vi /etc/apache2/mods-available/mod_tile.load

Paste the following line into the file.

    LoadModule tile_module /usr/lib/apache2/modules/mod_tile.so

Create a symlink.

    sudo ln -s /etc/apache2/mods-available/mod_tile.load /etc/apache2/mods-enabled/

Then edit the default virtual host file.

    sudo vi /etc/apache2/sites-enabled/000-default.conf

Past the following lines after the line `<VirtualHost *:80>`

    LoadTileConfigFile /usr/local/etc/renderd.conf
    ModTileRenderdSocketName /var/run/renderd/renderd.sock
    # Timeout before giving up for a tile to be rendered
    ModTileRequestTimeout 0
    # Timeout before giving up for a tile to be rendered that is otherwise missing
    ModTileMissingRequestTimeout 2000

Save and close the file. Restart Apache.

    sudo systemctl restart apache2

If *systemctl* is not installed (e.g., Ubuntu 14.4):

    sudo service apache2 restart

Test access to tiles locally:

    wget --spider http://localhost/osm_tiles/0/0/0.png

You should get `Remote file exists.` if everything is correctly configured.

Then in your web browser address bar, type

    your-server-ip/osm_tiles/0/0/0.png

where you need to change *your-server-ip* with the actual IP address of the installed map server.

You should see the tile of world map.

Congratulations! You just successfully built your own OSM tile server.

## Debugging Apache, mod_tile and renderd

To clear all osm tiles cache, remove /var/lib/mod_tile/default (using rm -rf if you dare) and restart renderd daemon:

    rm -rf /var/lib/mod_tile/default
    sudo systemctl restart renderd

If *systemctl* is not installed (e.g., Ubuntu 14.4):

    sudo service renderd restart

Show Apache loaded modules:

    apache2ctl -M

You should find `tile_module (shared)`

Show Apache configuration:

    apache2ctl -S

You should get the following messages within the log:

    Loading tile config default at /osm_tiles/ for zooms 0 - 20 from tile directory /var/lib/mod_tile with extension .png and mime type image/png

Tail log:

    tail -f /var/log/apache2/error.log

Most of the configuration issues can discovered by analyzing the debug log of *renderd*; we need to stop the daemon and start *renderd* in foreground:

{% include_relative _includes/configuration-variables.md os='Ubuntu' notitle='yes' %}
    sudo systemctl stop renderd

If *systemctl* is not installed (e.g., Ubuntu 14.4):

    sudo service renderd stop

Then:

    /usr/local/bin/renderd -fc /usr/local/etc/renderd.conf

Ignore the five errors related to `iniparser: syntax error in /usr/local/etc/renderd.conf` when referring to commented out variables (e.g., beginning with `;`).

Press Control-C to kill the program. After fixing the error, the daemon can be restarted with:

    sudo systemctl start renderd

If *systemctl* is not installed (e.g., Ubuntu 14.4):

    sudo service renderd start

If everything in the configuration looks fine, but the map is still not rendered without any particular message produced by *renderd*, try performing a system restart:

    sudo shutdown -r now

As exceptional case, the following commands allow to fully remove Apache, mod_tile and renderd and reinstall the service:

    sudo rm -r ~/src/mod_tile/
    sudo apt-get purge apache2 apache2-dev
    sudo rm -r /etc/apache2/mods-available
    sudo rm /usr/local/etc/renderd.conf
    sudo rm  /etc/init.d/renderd
    sudo rm -rf /var/lib/mod_tile
    sudo rm -rf /usr/lib/apache2
    sudo rm -rf /etc/apache2/
    sudo rm -rf /var/run/renderd
    sudo apt-get --reinstall install apache2-bin
    sudo apt-get install apache2 apache2-dev


## Deploying your own Slippy Map

Tiled web map is also known as slippy map in OpenStreetMap terminology.

Page [Deploying your own Slippy Map](http://wiki.openstreetmap.org/wiki/Deploying_your_own_Slippy_Map) illustrates how to embed the previously installed map server into a website. A number of possible map libraries are mentioned, including some relevant ones ([Leaflet](leafletjs.com), [OpenLayers](openlayers.org), [Google Maps API](https://developers.google.com/maps/)) as well as many alternatives.

<script async src="//jsfiddle.net/ircama/8sypcx7o/embed/"></script>

### Google Maps API

OpenStreetMap tiles can be presented through Google Maps API v3 basing on the following [example](http://harrywood.co.uk/maps/examples/google-maps/apiv3.view.html), where you need to change *your-server-ip* with the actual IP address of the previously installed map server:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>OpenStreetMap in Google Maps v3 API Example</title>
        <style>
            html, body, #map {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
            }
            div#footer {
                position: fixed;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 18px;
                margin: 0;
                padding: 6px;
                z-index: 2;
                background: WHITE;
            }
        </style> 
    </head>
    <body>
        <div id="map" style="float: left;"></div>
        
        <div id="footer">&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</div>
        
        <!-- bring in the google maps library -->
        <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
        
        <script type="text/javascript">
            //Google maps API initialisation
            var element = document.getElementById("map");
 
            var map = new google.maps.Map(element, {
                center: new google.maps.LatLng(57, 21),
                zoom: 3,
                mapTypeId: "OSM",
                mapTypeControl: false,
                streetViewControl: false
            });
 
            //Define OSM map type pointing at the OpenStreetMap tile server
            map.mapTypes.set("OSM", new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    return "your-server-ip/osm_tiles/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                },
                tileSize: new google.maps.Size(256, 256),
                name: "OpenStreetMap",
                maxZoom: 18
            }));
        </script>
        
    </body>
</html>
```

There are two free and open source JavaScript map libraries you can use for your tile server: OpenLayer and Leaflet. The advantage of Leaflet is that it is simple to use and your map will be mobile-friendly.














Continuare da qui:
https://switch2osm.org/serving-tiles/manually-building-a-tile-server-14-04/
https://www.linuxbabe.com/linux-server/openstreetmap-tile-server-ubuntu-16-04



### OpenLayer

To display your slippy map with OpenLayer, first create a web folder.

sudo mkdir /var/www/osm

Then download JavaScript and CSS from openlayer.org and extract it to the web root folder.

Next, create the index.html file.

sudo nano /var/www/osm/index.html

Paste the following HTML code in the file. Replace red-colored text and adjust the longitude, latitude and zoom level according to your needs.

```html
<!DOCTYPE html>
<html>
<head>
<title>Accessible Map</title>
<link rel="stylesheet" href="http://your-ip/ol.css" type="text/css">
<script src="http://your-ip/ol.js"></script>
<style>
  a.skiplink {
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0;
    border: 0;
    height: 1px;
    width: 1px;
    overflow: hidden;
  }
  a.skiplink:focus {
    clip: auto;
    height: auto;
    width: auto;
    background-color: #fff;
    padding: 0.3em;
  }
  #map:focus {
    outline: #4A74A8 solid 0.15em;
  }
</style>
</head>
<body>
  <a class="skiplink" href="#map">Go to map</a>
  <div id="map" class="map" tabindex="0"></div>
  <button id="zoom-out">Zoom out</button>
  <button id="zoom-in">Zoom in</button>
  <script>
    var map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM({
             url: 'http://your-ip/osm_tiles/{z}/{x}/{y}.png'
          })
       })
     ],
     target: 'map',
     controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
     }),
    view: new ol.View({
       center: [244780.24508882355, 7386452.183179816],
       zoom:5
    })
 });

  document.getElementById('zoom-out').onclick = function() {
    var view = map.getView();
    var zoom = view.getZoom();
    view.setZoom(zoom - 1);
  };

  document.getElementById('zoom-in').onclick = function() {
     var view = map.getView();
     var zoom = view.getZoom();
     view.setZoom(zoom + 1);
  };
</script>
</body>
</html>
```

Save and close the file. Now you can view your slippy map by typing your server IP address in browser.

your-ip/index.html           or          your-ip





### Leaflet

Leaflet is a JavaScript library for embedding maps. It is simpler and smaller than OpenLayers.

To display your slippy map with Leftlet, first create a web folder.

    sudo mkdir /var/www/osm

You can download Leaflet (JavaScript and CSS) from its own site at leftletjs.com or better from GitHub:

    cd
    git clone https://github.com/Leaflet/Leaflet.git

Copy the dist/ directory to the place on your webserver where the embedding page will be served from, and rename it leaflet/ .

    cd Leaflet
    cp -r *

Next, create the index.html file.

sudo nano /var/www/osm/index.html

Paste the following HTML code in the file. Replace red-colored text and adjust the longitude, latitude and zoom level according to your needs.

```html
<html>
<head>
<title>My first osm</title>
<link rel="stylesheet" type="text/css" href="leaflet.css"/>
<script type="text/javascript" src="leaflet.js"></script>
<style>
   #map{width:100%;height:100%}
</style>
</head>

<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([53.555,9.899],5);
    L.tileLayer('http://your-ip/osm_tiles/{z}/{x}/{y}.png',{maxZoom:18}).addTo(map);
</script>
</body>
</html>
```

Save and close the file. Now you can view your slippy map by typing your server IP address in browser.

To pre-render tiles instead of rendering on the fly, use render_list command. Pre-rendered tiles will be cached in /var/lib/mod_tile directory. -z and -Z flag specify the zoom level.

render_list -m default -a -z 0 -Z 10



## Embedding Leaflet in your page

For ease of use, we’ll create a .js file with all our map code in it. You can of course put this inline in the main page if you like. Create this page in your *leaflet/* directory and call it *leafletembed.js*.

Use the following code in *leafletembed.js*:

```javascript
var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];

function initmap() {
	// set up the map
	map = new L.Map('map');

	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});		

	// start the map in South-East England
	map.setView(new L.LatLng(51.3, 0.7),9);
	map.addLayer(osm);
}
```

Then include it in your embedding page like this:

```html
<link rel="stylesheet" type="text/css" href="leaflet/leaflet.css" />
<script type="text/javascript" src="leaflet/leaflet.js"></script>
<script type="text/javascript" src="leaflet/leafletembed.js"></script>
```

Add an appropriately-sized *div* called ‘map‘ to your embedding page; then, finally, add some JavaScript to your embedding page to initialise the map, either at the end of the page or on an *onload* event:

    initmap();

Congratulations; you have embedded your first map with Leaflet.

## Showing markers as the user pans around the map

There are several [excellent examples on the Leaflet website](http://leaflet.cloudmade.com/examples.html). Here we’ll demonstrate one more common case: showing clickable markers on the map, where the marker locations are reloaded from the server as the user pans around.

First, we’ll add the standard AJAX code of the type you’ll have seen a thousand times before. At the top of the *initmap* function in *leafletembed.js*, add:

```javascript
// set up AJAX request
ajaxRequest=getXmlHttpObject();
if (ajaxRequest==null) {
	alert ("This browser does not support HTTP Request");
	return;
}
```

then add this new function elsewhere in *leafletembed.js*:

```javascript
function getXmlHttpObject() {
	if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
	if (window.ActiveXObject)  { return new ActiveXObject("Microsoft.XMLHTTP"); }
	return null;
}
```

Next, we’ll add a function to request the list of markers (in JSON) for the current map viewport:

```
function askForPlots() {
	// request the marker info with AJAX for the current bounds
	var bounds=map.getBounds();
	var minll=bounds.getSouthWest();
	var maxll=bounds.getNorthEast();
	var msg='leaflet/findbybbox.cgi?format=leaflet&bbox='+minll.lng+','+minll.lat+','+maxll.lng+','+maxll.lat;
	ajaxRequest.onreadystatechange = stateChanged;
	ajaxRequest.open('GET', msg, true);
	ajaxRequest.send(null);
}
```

This talks to a serverside script which simply returns a JSON array of the properties we want to display on the map, like this:

```json
[{"name":"Tunbridge Wells, Langton Road, Burnt Cottage",
  "lon":"0.213102",
  "lat":"51.1429",
  "details":"A Grade II listed five bedroom wing in need of renovation."}]
```

(etc.)

When this arrives, we’ll clear the existing markers and display the new ones, creating a rudimentary pop-up window for each one:

```javascript
function stateChanged() {
	// if AJAX returned a list of markers, add them to the map
	if (ajaxRequest.readyState==4) {
		//use the info here that was returned
		if (ajaxRequest.status==200) {
			plotlist=eval("(" + ajaxRequest.responseText + ")");
			removeMarkers();
			for (i=0;i<plotlist.length;i++) {
				var plotll = new L.LatLng(plotlist[i].lat,plotlist[i].lon, true);
				var plotmark = new L.Marker(plotll);
				plotmark.data=plotlist[i];
				map.addLayer(plotmark);
				plotmark.bindPopup("<h3>"+plotlist[i].name+"</h3>"+plotlist[i].details);
				plotlayers.push(plotmark);
			}
		}
	}
}

function removeMarkers() {
	for (i=0;i<plotlayers.length;i++) {
		map.removeLayer(plotlayers[i]);
	}
	plotlayers=[];
}
```

Finally, let’s wire this into the rest of our script. After we’ve added the map in *initmap*, let’s ask for the first load of markers, and set up an event to do this every time the map is panned. Add this just at the end of *initmap*:

```javascript
	askForPlots();
	map.on('moveend', onMapMove);
}

// then add this as a new function...
function onMapMove(e) { askForPlots(); }
```











Cose da controllare:
http://tilemill-project.github.io/tilemill/docs/source/

https://blog.gravitystorm.co.uk/
https://switch2osm.org/serving-tiles/manually-building-a-tile-server-14-04/