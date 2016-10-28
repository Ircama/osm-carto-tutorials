### Creating a UNIX user

{% include_relative _includes/configuration-variables.md notitle='yes' %}
We suppose that you have already created a login user during the installation of Ubuntu, to be used to run the tile server. Let's suppose that your selected user name is *{{ pg_login }}*. Within this document, all times *{{ pg_login }}* is mentioned, change it with your actual user name.

If you need to create a new user:

    sudo useradd -m {{ pg_login }}
    sudo passwd {{ pg_login }}

Set a password when prompted.