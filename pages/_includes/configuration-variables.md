{% assign pg_user = 'postgres' %}
{% assign pg_password = 'postgres_007%' %}

## Set the environment variables
{% if include.os == "Windows" %}
```batchfile
setx PGHOST localhost
setx PGPORT 5432
setx PGUSER {{ pg_user }}
setx PGPASSWORD {{ pg_password }}
```
{% endif %}
{% if include.os == "Ubuntu" %}
```bash
export PGHOST=localhost
export PGPORT=5432
export PGUSER={{ pg_user }}
export PGPASSWORD={{ pg_password }}
```
{% endif %}