
## Install Munin

[Munin](https://en.wikipedia.org/wiki/Munin_(software)) is the standard application to monitor systems performance of OpenStreetmap software.

    sudo apt-get --no-install-recommends install -y munin-node munin munin-plugins-extra libdbd-pg-perl \
    sysstat iotop

    sed -i "s|Allow from.*|Allow from all|" /etc/munin/apache.conf
    service apache2 reload

After installing additional software:

    sudo munin-node-configure --sh | sudo sh
    sudo service munin-node restart

Check also here:

http://wiki.openstreetmap.org/wiki/Mod_tile/Setup_of_your_own_tile_server