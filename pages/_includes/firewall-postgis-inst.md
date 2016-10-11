## Configure the firewall

If you are preparing a remote virtual machine, configure the firewall to allow remote access to the local port 6789.

If you run a cloud based VM, also the VM itself shall be set to open this port.

## Install PostgreSQL and PostGIS

Install [PostgreSQL](https://www.postgresql.org/) 9.5 and [PostGIS](http://postgis.net/) 2.2 (supposing they are at the lastest available versions)
Also older PostgreSQL version are suitable.

```
sudo apt-get update
sudo apt-get install postgresql postgis pgadmin3 postgresql-contrib
```

Note: used PostgeSQL port is 5432 (default).

## Set the password for the *postgres* user

```
sudo -u postgres psql postgres
\password postgres
```

Enter the following password twice: postgres_007%

This is just an example of password, you can use the one you prefer.

## Create the PostGIS instance

```
export PGPASSWORD=postgres_007%
HOSTNAME=localhost # set it to the actual ip address or host name
psql -U postgres -h $HOSTNAME -c "create database gis"
psql -U postgres -h $HOSTNAME -c "\connect gis"
psql -U postgres -h $HOSTNAME -d gis -c "CREATE EXTENSION postgis"
psql -U postgres -h $HOSTNAME -d gis -c "CREATE EXTENSION hstore"
```

{% include_relative _includes/download-osm-data.md %}

## Install Osm2pgsql

To install [osm2pgsql](https://wiki.openstreetmap.org/wiki/Osm2pgsql):

    sudo apt-get install osm2pgsql

### Alternative installation procedure

This alternative installation procedure generates the most updated executable by compiling the sources.

```
# Needed dependencies
sudo apt-get install make cmake g++ libboost-dev libboost-system-dev \
  libboost-filesystem-dev libexpat1-dev zlib1g-dev \
  libbz2-dev libpq-dev libgeos-dev libgeos++-dev libproj-dev lua5.2 \
  liblua5.2-dev

# Download osm2pgsql
cd /tmp
git clone git://github.com/openstreetmap/osm2pgsql.git 

# Prepare for compiling
cd osm2pgsql
mkdir build && cd build
cmake ..

# Compile
make

# Install
sudo make install

# Clean-out temporary files
cd ../..
rm -rf osm2pgsql
```

## Load data to PostGIS

```
cd
cd openstreetmap-carto
HOSTNAME=localhost # set it to the actual ip address or host name
osm2pgsql -s -C 300 -c -G -d gis --style openstreetmap-carto.style -H $HOSTNAME -U postgres [.osm or .pbf file]
```

Note: if you get the following error:

```
node_changed_mark failed: ERROR:  prepared statement "node_changed_mark" does not exist
```

do the following command on your *original.osm*:

```
sed "s/action='modify' //" < original.osm | > fixedfile.osm
```

Then process *fixedfile.osm*.

## Create indexes

openstreet-carto shall be installed first.

```
HOSTNAME=localhost # set it to the actual ip address or host name
cd
cd openstreet-carto
scripts/indexes.py | psql -U postgres -h $HOSTNAME -d gis
```

Read [custom indexes](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#custom-indexes) for further information.