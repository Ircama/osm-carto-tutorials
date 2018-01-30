## Install Apache HTTP Server

The [Apache](https://en.wikipedia.org/wiki/Apache_HTTP_Server) free open source HTTP Server is among the most popular web servers in the world. It's [well-documented](https://httpd.apache.org/), and has been in wide use for much of the history of the web, which makes it a great default choice for hosting a website.

To install apache:

    sudo apt-get install -y apache2 apache2-dev

If using WSL, the Apache service needs to be started with

    sudo service apache2 start

Error "Failed to enable APR_TCP_DEFER_ACCEPT" with Ubuntu on Windows is due to this socket option which is not natively supported by Windows.

    sudo vi /etc/apache2/apache2.conf

Add the following line to the end of the file:

    AcceptFilter http none

To check if Apache is installed, direct your browser to the IP address of your server (eg. http://localhost). The page should display the default Apache home page. Also this command allows checking correct working:

    curl localhost| grep 'It works!'

The Apache tuning adopted by the OpenStreetMap tile servers can be found in the related [Chef configuration](https://github.com/openstreetmap/chef/blob/master/roles/tile.rb#L13-L25).

## How to Find the IP address of your server

You can run the following command to reveal the public IP address of your server:

    wget http://ipinfo.io/ip -qO -