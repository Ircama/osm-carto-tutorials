---
layout: note
title: Management procedures for Node.js
comments: true
permalink: /nodejs-commands/
rendering-note: this page is best viewed with Jekyll rendering
---

## Install nodejs

```shell
sudo apt-get install -y nodejs npm
```

## Remove all node versions

```shell
# Remove nvm
sudo rm -rf ~/.nvm
hash -r

# Remove latest node version
sudo npm uninstall -g n

# Remove n
cd ~/src/n && sudo make uninstall && cd .. && sudo rm -r n

# Remove latest nodejs version
sudo apt-get purge -y nodejs npm

# Remove nodejs-legacy version
sudo apt-get purge -y nodejs-legacy npm

sudo apt -y autoremove

# Remove nodejs files
sudo rm -rf /usr/local/lib/node_modules/npm
sudo rm -rf /usr/local/lib/node_modules/n
sudo rm -f /usr/local/bin/node
sudo rm -f /usr/local/bin/npm
sudo rm -f /usr/bin/node
sudo rm -rf /usr/local/n/versions/node
```
___

## node legacy

### Install node legacy

Any updated *node* version shall be uninstalled before installing *nodejs-legacy*.

```shell
sudo apt-get install -y nodejs-legacy npm
```

### Remove node legacy

```shell
sudo apt-get purge -y nodejs-legacy npm
sudo apt -y autoremove
exit # close the session and restart to clear the path
```
___

## *n*

### Install *n*

```shell
cd ~/src
git clone https://github.com/tj/n.git
cd n
sudo make install
cd ..
```

### Install *node* with *n*

```shell
sudo n stable
```

### Completely uninstall *n*

```shell
cd ~/src/n
sudo make uninstall
cd ..
sudo rm -r n
```

## Install nodejs, node and npm

```shell
sudo apt-get install -y nodejs npm

sudo npm cache clean -f
sudo npm install -g n
sudo n stable
exit # close the session and restart to clear the path
```

## Check current versions

```shell
nodejs -v
node -v
npm -v
```
___

## nvm

### Install nvm

```shell
cd ~/
git clone https://github.com/creationix/nvm.git .nvm
cd ~/.nvm
git checkout v0.33.9
. nvm.sh
```

### Install the latest version of node with nvm

```shell
nvm install node
nvm install v4.2.6
nvm install lts/argon

nvm use node # use the last node version
nvm use v4.2.6 # use nodejs-legacy

nvm install v6.14.1
```

### Switch to a node version with nvm

```shell
nvm use v6.14.1
```

### List the local node versions with nvm

```shell
nvm ls
```

### List the installable node versions with nvm

```shell
nvm ls-remote
```

### Remove nvm

```shell
sudo rm -rf ~/.nvm
hash -r
```

## Reinstall a local node package

```shell
sudo rm -rf node_modules
sudo rm -rf /usr/local/lib/node_modules/<package>
npm install
```

## Install global node package for all users

```shell
sudo rm -rf /usr/local/lib/node_modules/<package>
sudo rm -rf node_modules
sudo npm install -g
```

Read [node.js](https://nodejs.org/en/download/) for further information.
