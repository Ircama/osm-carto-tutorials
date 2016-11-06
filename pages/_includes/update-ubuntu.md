
We consider using [Ubuntu](https://en.wikipedia.org/wiki/Ubuntu_(operating_system)) 16.04.1 LTS [Xenial Xerus](https://en.wikipedia.org/wiki/Ubuntu_version_history#Ubuntu_16.04_LTS_.28Xenial_Xerus.29), Ubuntu 15.4 [Vivid Vervet](https://en.wikipedia.org/wiki/Ubuntu_version_history#Ubuntu_15.04_.28Vivid_Vervet.29) or Ubuntu 14.04.3 LTS [Trusty Tahr](https://en.wikipedia.org/wiki/Ubuntu_version_history#Ubuntu_14.04_LTS_.28Trusty_Tahr.29) (other versions should work). All should be [64-bit](https://en.wikipedia.org/wiki/64-bit_computing) computing architecture.

## General setup for Ubuntu

### Update Ubuntu

Make sure your Ubuntu system is fully up-to-date:

```shell
lsb_release -a # to get the Ubuntu version
sudo apt-get update
sudo apt-get -y upgrade
```

### Install essential tools

    sudo apt-get -y install curl unzip gdal-bin tar wget bzip2

For the subsequent installation steps, we suppose that `cd` defaults to your home directory.

### Configure a swap

Importing and managing map data takes a lot of RAM and a swap is generally needed.

To check whether a swap partition is already configured on your system, use one of the following two commands:

* Reports the swap usage summary (no output means missing swap):

      swapon -s

* Display amount of free and used memory in the system (check the line specifying *Swap*):

      free -h

If you do not have an active swap partition, especially if your physical memory is small, you should add a swap file. First we use `fallocate` command to create a file. For example, create a file named *swapfile* with 2G capacity in root file system:

    sudo fallocate -l 2G /swapfile

Then make sure only *root* can read and write to it.

    sudo chmod 600 /swapfile

Format it to swap:

    sudo mkswap /swapfile

Enable the swap file

    sudo swapon /swapfile