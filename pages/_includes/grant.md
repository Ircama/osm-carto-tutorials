Create PostgreSQL user "*{{ pg_login }}*" (if not yet existing) and grant rights to all *gis* db tables for "*{{ pg_login }}*" user and for all logged users:

  ```shell
  wget https://raw.githubusercontent.com/openstreetmap/osm2pgsql/master/install-postgis-osm-user.sh
  chmod a+x ./install-postgis-osm-user.sh
  sudo ./install-postgis-osm-user.sh gis {{ pg_login }}
  ```
