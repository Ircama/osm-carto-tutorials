---
layout: page
title: Installing a Docker image of Kosmtik with Ubuntu, Windows or Mac
comments: true
permalink: /docker-kosmtik/
rendering-note: this page is best viewed with Jekyll rendering
---

## Introduction

The suggested tool to support the autohoring of [OpenStreetMap stylesheets](https://wiki.openstreetmap.org/wiki/Stylesheets) developed in [CartoCSS](https://wiki.openstreetmap.org/wiki/CartoCSS) is [Kosmtik](https://github.com/kosmtik/kosmtik), a software to produce, browse and verify [raster tile maps](https://en.wikipedia.org/wiki/Tiled_web_map) based on pre-processors like [CartoCSS](https://github.com/mapbox/carto) and rendered through [Mapnik](https://github.com/mapnik/mapnik/blob/master/docs/design.md).

Kosmtik is a [node](https://en.wikipedia.org/wiki/Node.js) module needing a list of prerequisite software like PostgreSQL, PostGIS, Python, osm2pgsql and Node.js itself. Kosmtik also includes node versions of further software like Mapnik and Carto and at the moment it supports [Ubuntu Linux](https://www.ubuntu.com). To simplify the related installation process, *openstreetmap-carto* comes with [Docker](https://en.wikipedia.org/wiki/Docker_(software)) files and [documentation](https://github.com/gravitystorm/openstreetmap-carto/blob/master/DOCKER.md), which allow to build the image through simple commands.

[Docker](https://docs.docker.com/engine/docker-overview/) allows packaging applications and dependencies in [virtual containers](https://en.wikipedia.org/wiki/Operating-system-level_virtualization) that can run on a host server without altering it permanently. The software components running within _containers_ are easy to setup and tear down individually. This helps enable flexibility and portability. The Docker demon can use operating-system-level virtualization or a virtual machine. The Docker configuration included in *openstreetmap-carto* automates the setup of the Kosmtik development environment and simplifies the OSM data import process.

The openstreetmap-carto repository needs to be a directory that is shared between your host system and the Docker virtual machine. Home directories are shared by default; if your repository is in another place, you need to add this to the Docker sharing list.

Sufficient disk space of several gigabytes is generally needed. Docker creates an image for its virtual system that holds the virtualised operating system and the containers. The format (Docker.raw, Docker.qcow2, \*.vhdx, etc.) depends on the host system. To provide a rough idea of the sizing, the physical size might start with 2-3 GB for the virtual OS and could grow to 6-7 GB when filled with the containers needed for the database, Kosmtik, and a small OSM region. Further 1-2 GB would be needed for shape files in the openstreetmap-carto/data repository.

The subsequently described step-by-step procedure allows installing and running a Docker image of Kosmtik with Ubuntu, with Windows and with macOS.

The Windows configuration exploiting Docker and Doker Toolbox is definitively a great tool to allow developing *openstreetmap-carto* with a 64 bit Windows PC and locally testing the style through Kosmtik on the same machine. With Docker Toolbox, Kosmtik is transparently run in a VirtualBox VM, with all development data (e.g., openstreetmap-carto directory) physically residing on the Windows host system and the PostGIS database (with imported OSM data) hosted within the VM.

The next paragraph describes the [installation of Kosmtik with Ubuntu](#ubuntu-installation). The subsequent ones detail the steps to [install Kosmtik with Windows](#windows-installation) and [with macOS](#macos-installation).

## Ubuntu installation

For a standard Kosmtik installation without using Docker, check [Installing Kosmtik and OpenStreetMap-Carto on Ubuntu](../kosmtik-ubuntu-setup/).

To go on installing *Docker*, first update the system:

```shell
sudo apt-get update
sudo apt-get -y upgrade
```

If on a brand new system you also want to do `sudo apt-get dist-upgrade && sudo shutdown -r`.

[Configure a swap](../kosmtik-ubuntu-setup/#configure-a-swap).

The documentation in [DOCKER.md](https://github.com/gravitystorm/openstreetmap-carto/blob/master/DOCKER.md) describes 
how to run OpenStreetMap Carto with Docker. Check it before starting installation.

You need *docker-compose*, which can be installed from package through:

```shell
sudo apt-get install -y docker-compose
sudo usermod -aG docker $USER
# To activate changes, log out and log back in
```

After logging out and logging back in, you can proceed to install *openstreetmap-carto*.

Otherwise follow the steps to [install Docker](https://docs.docker.com/engine/installation/linux/ubuntu/) on Ubuntu 18.04, 16.10, 16.04 or 14.04 (e.g., Docker CE) from the Docker site. Check alternatively the [Docker installation script](https://github.com/docker/docker-install).

The lastest dev/test version of the Docker installation script can be downloaded and executed with the following command:

```shell
sh <(curl --silent https://cdn.rawgit.com/docker/docker-install/master/install.sh)
```

Then follow the [post-installation steps](https://docs.docker.com/engine/installation/linux/linux-postinstall/#manage-docker-as-a-non-root-user) from the Docker site. I.e:

```shell
sudo usermod -aG docker $USER
# To activate changes, log out and log back in
```

Subsequently, perform the instructions to [install *Docker Compose*](https://docs.docker.com/compose/install/) from the Docker site. Alternatively, you could use the following command to grab the latest *Docker Compose* version from GitHub.

```shell
sudo curl --silent -L $(curl --silent "https://api.github.com/repos/docker/compose/releases/latest" | sed -n 's/^[\t ]*"browser_download_url": *"\(http.*\/docker-compose-'"$(uname -s)-$(uname -m)"'\)"/\1/p') -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose && sudo chgrp docker /usr/local/bin/docker-compose && docker-compose -v
```

When successful, it shall return the actual installed version.

Install openstreetmap-carto:

```shell
mkdir -p ~/src ; cd ~/src
git clone https://github.com/gravitystorm/openstreetmap-carto.git
cd openstreetmap-carto
```

Download a PBF of OSM data to the same directory where openstreetmap-carto has been downloaded, as mentioned in [DOCKER.md](https://github.com/gravitystorm/openstreetmap-carto/blob/master/DOCKER.md). The downloaded file shall be named *data.osm.pbf*. E.g.:

```shell
curl https://download.geofabrik.de/europe/liechtenstein-latest.osm.pbf --output data.osm.pbf
```

For further information on the downloading of appropriate *.osm* or *.pbf* file, check "[Get an OpenStreetMap data extract](../tile-server-ubuntu#get-an-openstreetmap-data-extract)".

Notice that, to maximize security, the default configuration [denies remote access to Kosmitk and to the PostGIS DB](https://github.com/gravitystorm/openstreetmap-carto/pull/3208), so the only valid addess by default is localhost (http://127.0.0.1:6789). In order to enable remote access to Kosmitk, before running `docker-compose up` edit *docker-compose.yml* and [change](https://github.com/gravitystorm/openstreetmap-carto/pull/3208/files#diff-4e5e90c6228fd48698d074241c2ba760L13)

```yaml
  - "127.0.0.1:6789:6789"
```

to

```yaml
  - "6789:6789"
```

Complete the installation and access the map from your browser. Run *docker-compose*:

```shell
docker-compose up
```

The procedure takes many minutes to complete. Wait for `kosmtik:1	[Core] Loading map`.

With your browser, access the map through *<http://ServerAddress:6789>*

To stop the database container:

```shell
docker-compose stop db
```

Check also [Recommendations and troubleshooting](#recommendations-and-troubleshooting).

## macOS installation

With macOS, Docker provides [Docker for Mac](https://www.docker.com/docker-mac) and [Docker Toolbox](https://www.docker.com/products/docker-toolbox) for Mac.

*Docker for Mac* is a native desktop application which requires OSX Yosemite 10.10.3 or above and new hardware models supporting MMU virtualization (i.e., Extended Page Tables (EPT) and Unrestricted Mode). *Docker Toolbox* allows the installation of Docker on older Macs that do not meet minimal system requirements for *Docker for Mac*.

Check the Docker installation pages for detailed installation requirements and procedures.

The setup procedure of Kosmtik with [Docker for Mac](https://docs.docker.com/docker-for-mac/install/) is similar to the installation of Kosmtik [with Ubuntu](#ubuntu-installation), while the setup of Kosmtik with [Docker Toolbox for Mac](https://docs.docker.com/toolbox/toolbox_install_mac/) is similar to the one [with Windows](#windows-installation).

The steps to add the openstreetmap-carto directory to the Docker sharing list are: Docker Preferences > File Sharing; Windows: Docker Settings > Shared Drives.

Importing the data needs a substantial amount of RAM in the virtual machine. If you find the import process (Reading in file: data.osm.pbf, Processing) being _killed_ by the Docker demon, exiting with error code 137, increase the Memory assigned to Docker (e.g. Docker Preferences > Advanced > Adjust the computing resources). 

Docker copies log files from the virtual machine into the host system, their [location depends on the host OS](https://stackoverflow.com/questions/30969435/where-is-the-docker-daemon-log). E.g. the 'console-ring' appears to be a ringbuffer of the console log, which can help to find reasons for killings.  

While installing software in the containers and populating the database, the disk image of the virtual machine grows in size, by Docker allocating more clusters. When the disk on the host system is full (only a few MB remaining), Docker can appear stuck. Watch the system log files of your host system for failed allocations. 

Docker stores its disk image by default in the home directories of the user. If you don't have enough space here, you can move it elsewhere. (E.g. Docker > Preferences > Disk).[^1]

## Windows installation

Windows 10 64-bit allows installing *Kosmtik* and *openstreetmap-carto* via native Docker or Docker Toolbox.

With Windows, at the moment [Docker](https://docs.docker.com/docker-for-windows/) can only be installed on 64-bit physical machines with hardware-assisted virtualization support enabled and where the operating system provides [Hyper-V Host role]( https://docs.docker.com/docker-for-windows/install/#what-to-know-before-you-install) (e.g., 64-bit Microsoft Windows 10 Professional/Enterprise/Education but not Windows 10 Home 64-bit, Windows 7 64-bit, etc.; anyway, Windows 10 Home can be upgraded to Win 10 Pro and this operation is relatively cheap).

For 64-bit Windows operating systems not natively supporting Docker, [Docker Toolbox]( https://docs.docker.com/toolbox/overview/) can be installed, which uses Oracle Virtual Box instead of Hyper-V. Neither Docker nor Docker Toolbox can be installed on a 32-bit architecture. Nested virtualization scenarios are not generally supported. Oracle Virtual Box would need a bare metal hw and should not be run inside a VM to support a 64 bit OS.

Kosmtik running through Docker Toolbox on a Windows 7 (or Windows 10 Home) takes about 2.8 GB in *C:\Users\\<user\>\\.docker*. It is advisable to use an i5 machine with 8 GB RAM at least.

### Windows with Native Docker

This procedure allows installing and running a Docker image of Kosmtik with x64 Windows versions able to run native Docker.

Before starting, it is important to read the documentation in [DOCKER.md](https://github.com/gravitystorm/openstreetmap-carto/blob/master/DOCKER.md)

- Install Docker for Windows (enabling also the virtualization in the PC BIOS setting).
- Download openstreetmap-carto (at https://github.com/gravitystorm/openstreetmap-carto) to a local subdirectory of the user's home directory (C:\users\username).
- Download a PBF of OSM data to the same directory where openstreetmap-carto has been downloaded, as mentioned in [DOCKER.md](https://github.com/gravitystorm/openstreetmap-carto/blob/master/DOCKER.md). The downloaded file shall be named *data.osm.pbf* (example, download https://download.geofabrik.de/europe/liechtenstein-latest.osm.pbf and rename it as *data.osm.pbf*). For further information on the downloading of appropriate *.osm* or *.pbf* file, check "[Get an OpenStreetMap data extract](../tile-server-ubuntu#get-an-openstreetmap-data-extract)".

- Open a CMD prompt to this directory. Run *docker-compose*:

  ```bat
  docker-compose up
  ```

The procedure takes many minutes to complete. Wait for `kosmtik:1	[Core] Loading map`.

Kosmtik can be run via browser pointing to

    http://localhost:6789

### Windows with Docker Toolbox

The procedure here described allows installing and running a Docker image of Kosmtik with x64 Windows versions requiring Docker Toolbox.

Before starting, it is important to read the documentation in [DOCKER.md](https://github.com/gravitystorm/openstreetmap-carto/blob/master/DOCKER.md)

Install Docker Toolbox:

- Enable the virtualization in the PC BIOS setting
- Install the latest version of [Oracle VM VirtualBox](https://www.virtualbox.org/wiki/Downloads) (this is advisable even if Docker Toolbox includes a recent version of this software)
- Install [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/); select also the installation of "Git MSYS-git UNIX tools".
- Run *Docker Quickstart Terminal* (*All Programs*, *Docker*, *Docker Quickstart Terminal*) and wait for the *MINGW64 Console* to start.

Notice that *"Waiting for an IP..."* takes the time needed to start a virtual machine named *default* and boot a Linux image included in a file named *boot2docker.iso* (automatically downloaded and configured by the software). The VM startup can take minutes.
Within the login message before the UNIX prompt, the *MINGW64 Console* shall display the VM IP address (e.g., `docker is configured to use the default mackine with IP 192.168.99.100`).
A missing IP address means that the VM was not correctly created.
An error like `pywintypes.error: (2, 'WaitNamedPipe'...` means that the *Docker Quickstart Terminal* prompt has been started before the completion of the boot of the VM and without getting the IP address.

Download openstreetmap-carto to a local subdirectory of the user's home directory (C:\users\username):

```bat
cd
git clone https://github.com/gravitystorm/openstreetmap-carto.git
cd openstreetmap-carto
```

Download a PBF of OSM data to the same directory where openstreetmap-carto has been downloaded, as mentioned in [DOCKER.md](https://github.com/gravitystorm/openstreetmap-carto/blob/master/DOCKER.md). The downloaded file shall be named *data.osm.pbf*. E.g.:

      curl https://download.geofabrik.de/europe/liechtenstein-latest.osm.pbf --output data.osm.pbf

For further information on the downloading of appropriate *.osm* or *.pbf* file, check "[Get an OpenStreetMap data extract](../tile-server-ubuntu#get-an-openstreetmap-data-extract)".

Complete the installation and access the map from your browser. Run *docker-compose*:

```bat
docker-compose up
```

The procedure takes many minutes to complete. Wait for `kosmtik:1	[Core] Loading map`.

Kosmtik can be run via a browser pointing to

    http://192.168.99.100:6789

The actual IP address can be found by running

    docker-machine ip default

or by running another *Docker Quickstart Terminal*, then reading the login message (`docker is configured to use the default mackine with IP ...`).

The IP address range is set in the VM VirtualBox application: *File*, *Preferences*, *Network* tab, *Host-only network* tab, select the second adapter, *DHCP Server* tab.

The *default* VM can be safely stopped to release OS resources when not needed.

    docker-machine stop default

Each time *Docker Quickstart Terminal* is run, the VM is automatically restarted if in power-off state (but this takes its time to wait for the IP address...).

To start again the VM (alternatively to closing end reopening *Docker Quickstart Terminal*):

    docker-machine start default

Wait for the VM to start, then issue:

    eval $(docker-machine env default)

To totally remove the docker installation, delete the virtual machine named *default* (`docker-machine rm default`) and the directory *C:\Users\\<user\>\\.docker*.

While `docker-compose up` is running, the *openstreetmap-carto* development can be directly done on the PC by accessing the local directory where *openstreetmap-carto* has been downloaded. E.g., locally editing a stylesheet and then pressing the Kosmtik *Reload* button on the browser, the map gets updated.

The RAM size available to the *default* VM should be increased for improved performance. To increase the VM memory size:

    docker-machine stop default

Change the memory of the *default* virtual machine though *Oracle VM VirtualBox* (and possibly also the number of cores).

Also, modify the `.env` file as described at the [Importing data](https://github.com/gravitystorm/openstreetmap-carto/blob/master/DOCKER.md#importing-data) section of the documentation. Then restart the project: close and restart *Docker Quickstart Terminal* (e.g., *All Programs*, *Docker*, *Docker Quickstart Terminal*); finally issue:

```bat
cd openstreetmap-carto
docker-compose up kosmtik
```

## Recommendations and troubleshooting

To stop Kosmtik, select the window with *docker-compose* running and press *Control C*.

To start again Kosmtik without importing the OSM data:

    docker-compose up kosmtik

To only import the OSM data saved in "data.osm.pbf" (also within a separate terminal while Kosmtik is running):

    docker-compose up import

To import a PBF of OSM data with different name than *data.osm.pbf* (e.g., *data1.pbf*):

    docker-compose run -e OSM2PGSQL_DATAFILE=data1.pbf import

`docker-compose up` does not update the shapefiles under the *data* subdirectory of openstreetmap-carto. To update them, issue the following command after positioning yourself in the openstreetmap-carto directory:

    docker-compose run kosmtik scripts/get-shapefiles.py

With Windows, this command can also be run locally through a Windows CMD (with Python installes), via `scripts/get-shapefiles.py`.

Basic command to do the standard start-up:

    docker-compose up

### Docker Toolbox for Windows

In case the `docker-compose up` command reports the following error when using *Docker Compose for Windows*, check the directory where *openstreetmap-carto* has been installed:

```
...
kosmtik_1  | sh: 0: Can't open scripts/docker-startup.sh
...
```

It is suggested to position the *openstreetmap-carto* directory under the user's home directory (C:\users\username). Alternatively, the drive where the project is located (i.e., where the Dockerfile and volume are located) shall be shared though *Oracle VM VirtualBox*. Runtime errors such as *file not found*, *can't open scripts* or *cannot start service* may indicate [shared drives are needed](https://docs.docker.com/docker-for-windows/troubleshoot/#volume-mounting-requires-shared-drives-for-linux-containers).

-------------

If, after restarting the PC or after hibernating and resuming a PC, at `docker-compose up`, you get

    ERROR: Couldn't connect to Docker daemon - you might need to run `docker-machine start default`.

or, if you get:

```
Traceback (most recent call last):
...
pywintypes.error: (2, 'WaitNamedPipe',...
Failed to execute script docker-compose
```

then issue the following:

    docker-machine stop
    exit # e.g., close the Docker Quickstart Terminal

subsequently, restart *Docker Quickstart Terminal* (e.g., *All Programs*, *Docker*, *Docker Quickstart Terminal*)

    cd openstreetmap-carto
    docker-compose up

-------------

Additional recommendations for Docker Toolbox.

- Use direct internet access during the installation (without setting a proxy)
- Docker Toolbox needs to configure a Linux 64-bit VM. Set all virtualization features in the BIOS before running the Docker installation
- Do not manually start the interactive session of the VM VirtualBox used by Docker Toolbox (and named "default") before running *Docker Quickstart Terminal*, but let this command start the VM; in case, close any *Docker Quickstart Terminal*, perform a `shutdown -h now` on the interactive session and wait for the VM to disappear. Then run *Docker Quickstart Terminal*. Notice that an error like `pywintypes.error: (2, 'WaitNamedPipe'...` occurs when the *Docker Quickstart Terminal* is activated after a manual startup of the interactive session of the VM.
- `docker-compose up` does not install or copy the *openstreetmap-carto* package itself on the VM and accesses the one manually downloaded to the PC.
- Importing the data needs a substantial amount of RAM in the virtual machine. If you find the import process (Reading in file: data.osm.pbf, Processing) being _killed_ by the Docker demon, exiting with error code 137, increase the Memory assigned to Docker (e.g. Docker Settings > Advanced > Adjust the computing resources).

[^1]: [Docker.md improvements, requirements and troubleshooting](https://github.com/gravitystorm/openstreetmap-carto/pull/3021)
