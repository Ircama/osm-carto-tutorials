We consider using Ubuntu 16.04.1 LTS Xenial, Ubuntu 15.4 Vivid or Ubuntu 14.04.3 LTS Trusty Tahr (other versions should work).

## General setup for Ubuntu

### Update Ubuntu

Make sure your Ubuntu system is fully up-to-date:

    lsb_release -a # to get the Ubuntu version
    sudo apt-get update
    sudo apt-get -y upgrade

### Install essential tools

    sudo apt-get install curl unzip gdal-bin tar wget bzip2

### Configure a swap

Importing and managing map data takes a lot of RAM and a swap is generally needed.

To check whether a swap partition is already configured on your system, use one of the following two commands:

    swapon -s # reports the swap summary
    
    free -h # check the line specifying 'Swap'

If you do not have an active swap partition, especially if your physical memory is small, you should add a swap file. First we use `fallocate` command to create a file. For example, create a file named *swapfile* with 2G capacity in root file system:

    sudo fallocate -l 2G /swapfile

Then make sure only *root* can read and write to it.

    sudo chmod 600 /swapfile

Format it to swap:

    sudo mkswap /swapfile

Enable the swap file

    sudo swapon /swapfile

### Configure SSH keepalive

It is recommended to configure SSH keepalive so that you do not lose the SSH connection. Edit the SSH client configuration file `/etc/ssh/ssh_config` with your preferred editor and paste the following text at the end of the file:

    ServerAliveInterval 60

Then save the file and connect to your Ubuntu server.

For the subsequent installation steps, we suppose that `cd` defaults to your home directory.