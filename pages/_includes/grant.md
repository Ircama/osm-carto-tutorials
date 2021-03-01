Create PostgreSQL user "*{{ pg_login }}*" (if not yet existing) and grant rights to all *gis* db tables for "*{{ pg_login }}*" user and for all logged users:

```shell
psql -d gis <<\eof
REVOKE CONNECT ON DATABASE gis FROM PUBLIC;
GRANT CONNECT ON DATABASE gis TO "www-data";
GRANT CONNECT ON DATABASE gis TO "{{ pg_login }}";
eof
```

