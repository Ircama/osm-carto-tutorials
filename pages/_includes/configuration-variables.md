{% capture cache %}
{% assign pg_login = 'tileserver' %}
{% assign pg_user = 'postgres' %}
{% assign pg_password = 'postgres_007%' %}

{% endcapture %}{% assign cache = nil %}{% if include.notitle != "yes" %}
## Set the environment variables
{% endif %}{% if include.os == "Windows" %}
```batchfile
setx PGHOST localhost
setx PGPORT 5432
setx PGUSER {{ pg_user }}
setx PGPASSWORD {{ pg_password }}
```
{% endif %}{% if include.os == "Ubuntu" %}```shell
{% endif %}{% if include.os == "Ubuntu" or include.os == "Ubuntu-inline" %}export PGHOST=localhost
export PGPORT=5432
export PGUSER={{ pg_user }}
export PGPASSWORD={{ pg_password }}{% endif %}{% if include.os == "Ubuntu" %}
```
{% endif %}