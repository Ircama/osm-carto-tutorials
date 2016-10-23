---
layout: page
title: Installing an OpenStreetMap Tile Server on Ubuntu
comments: true
permalink: /tile-server-ubuntu/
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

## Pre-rendering tiles

To pre-render tiles instead of rendering on the fly, use *render_list* command. Pre-rendered tiles will be cached in */var/lib/mod_tile directory*.

To show all command line option of render_list:

    render_list --help

Example usage:

    render_list -a

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

### OpenLayer

To display your slippy map with OpenLayer, create a file named *ol.html* under */var/www/html*.

    sudo vi /var/www/html/ol.html

Paste the following HTML code in the file. Replace *your-server-ip* with your IP Address and adjust the longitude, latitude and zoom level according to your needs.

```html
<!DOCTYPE html>
<html>
<head>
<title>OpenStreetMap with OpenLayers</title>
<link rel="stylesheet" href="https://openlayers.org/en/v3.19.0/css/ol.css" type="text/css">
<script src="https://openlayers.org/en/v3.19.0/build/ol.js"></script>
<style>
  html,
  body,
  #map {
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
</head>
<body>
  <div id="map" class="map"></div>
  <script>
    // Set up the OSM layer
    var myTileServer = new ol.layer.Tile({
      source: new ol.source.OSM({
        crossOrigin: null,
        url: 'http://your-server-ip/osm_tiles/{z}/{x}/{y}.png'
      })
    });
    
    // Create the map
    var map = new ol.Map({
      layers: [ myTileServer ],
      target: 'map',
      view: new ol.View({
        center: ol.proj.transform([10, 45], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
      })
    });
  </script>
</body>
</html>
```

Save and close the file. Now you can view your slippy map by typing the following URL in browser.

    http://your-server-ip/ol.html

### Leaflet

Leaflet is a JavaScript library for embedding maps. It is simpler and smaller than OpenLayers.

To display your slippy map with Leaflet, create a file named *lf.html* under */var/www/html*.

    sudo vi /var/www/html/lf.html

Paste the following HTML code in the file. Replace *your-server-ip* with your IP Address and adjust the longitude, latitude and zoom level according to your needs.

```html
<!DOCTYPE html>
<html>
<head>
<title>OpenStreetMap with Leaflet</title>
<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.css" type="text/css">
<script src="http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.js"></script>
<style>
  html,
  body,
  #map {
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
</head>
<body>
  <div id="map" class="map"></div>
  <script>
    // Create the map
    var map = L.map('map').setView([45, 10], 4);
    
    // Set up the OSM layer
    L.tileLayer(
    'http://your-server-ip/osm_tiles/{z}/{x}/{y}.png'
    ).addTo(map);
  </script>
</body>
</html>
```

Save and close the file. Now you can view your slippy map by typing the following URL in browser.

    http://your-server-ip/lf.html

A rapid way to test the slippy map is through a simple JSFiddle template.

{% include_relative _includes/leaflet.md os='Ubuntu' %}
