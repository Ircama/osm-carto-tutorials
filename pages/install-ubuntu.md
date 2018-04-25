---
layout: note
title: Suggested Ubuntu Installation with the original ISO distro
comments: true
permalink: /install-ubuntu/
rendering-note: this page is best viewed with Jekyll rendering
---

{% include_relative _includes/configuration-variables.md os='Ubuntu' %}

## Hw or virtual machine

You might need the following hw configuration or create a virtual machine with the following suggested configuration:

- 7th or 8th Generation Core processor, 64 bit (or Generation 2 Virtual Machine); lots of CPU cores is suggested for a production tile server
- Memory: at least 4 GB for dev/testing with a small area (or >32 GB for a production tile server); PostgreSQL takes advantage of the disk cache
- Harddisk: At least 10 GB for dev/testing with a small area, better if SSD (or > 1TB fast RAID array or SSD for a production tile server[^81]); harddrive performance to speed-up database access is crucial. You can also selectively put the most important parts of the database on an SSD and the rest on slower disks. Osm2pgsql supports using separate tablespaces for different parts of the database for this purpose.[^80]

## Ubuntu installation

Download the latest [Ubuntu 18.04 LTS or Ubuntu 16.04 LTS ISO](https://www.ubuntu.com/download/server).

Create bootable installation media from iso, CD or USB, boot server from it.

Option: Install Ubuntu Server

### Language, Keyboard, Location

- Language: English - English
- Location: United States [or select yours]
- Configure keyboard/Detect keyboard layout: <No>
- Configure keyboard: English (US) [or select yours]
- Keyboard layout: English (US) [or select yours]

### Network Configuration

- Configuring the network with DHCP: if your server is connected to LAN with DHCP, the IP network can be automatically configured, otherwise (Configuring the network with DHCP: <Cancel>) please setup IP/mask/GW and DNS IPs manually (Network Autoconfiguration Failed: <continue>)
- Configuring the network: Configuring network manually
- IP Address: [use yours]
- Netmask: [ise yours]
- Gateway: [use yours]
- Name Server Addresses: [use yours or 8.8.8.8 8.8.4.4 (note the space in the middle)]
- Hostname: MapServer [or choose yours]
- Domain name (if you don't have, make it [example.com](https://en.wikipedia.org/wiki/Example.com))

### User Identity

- Full name for the new user: {{ pg_login }} User [or choose yours]
- Username for your account: {{ pg_login }} [or choose yours]
- Choose a password for the new user: [select one]
- Re-enter password to verify: [repeat the password]
- Use weak password: <Yes>
- Encrypt your home directory: <No>
- Setting up the clock: Wait...
- Select your time zone: [select yours]

### Mounting and Formatting Drives

- Unmount partitions that are in use: <Yes>
- Partitioning Method: Guided - use entire disk and setup LVM
- Write changes to disk and create LVM: YES
- Amount of volume: leave all offered size
- Force UEFI Installation: YES
- Select Disk to Partition: Select the one you want to install Ubuntu to
- Partition Disks: Finish partitioning and write changes to disk (May not appear)
- Write changes to disks: <yes>
- Wait for completion...

### Repository and Software

- HTTP proxy information (blank for none): Leave blank (if you have such, please configure it for internet reachability)
- Configuring task: Install security updates automatically
- Choose Software to install:
  - [*] Manual package selection
  - [*] Standard system utilities
  - [*] OpenSSH server
- Wait for completion...

Login and change the password

[^80]: Information taken from the *Hardware* paragraph of [Building a tile server from packages](https://switch2osm.org/serving-tiles/building-a-tile-server-from-packages) page within [switch2osm.org](https://switch2osm.org).

[^81]: The full OSM map database and regular update files are available at [Planet OSM](https://planet.openstreetmap.org). The whole planet is currently around about 300GB (65 GB zipped)-
