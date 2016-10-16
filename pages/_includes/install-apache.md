## Install Apache HTTP Server

The [Apache](https://en.wikipedia.org/wiki/Apache_HTTP_Server) free open source HTTP Server is among the most popular web servers in the world. It's [well-documented](https://httpd.apache.org/), and has been in wide use for much of the history of the web, which makes it a great default choice for hosting a website.

To install apache:

    sudo apt-get install -y apache2 apache2-dev

To check if Apache is installed, direct your browser to the IP address of your server (eg. http://localhost). The page should display the default Apache home page. Also this command allows checking correct working:

    curl localhost| grep 'It works!'

## How to Find the IP address of your server

You can run the following command to reveal the IP address of your server on its main Ethernet interface.

    ifconfig eth0 | grep inet | awk '{ print $2 }'
