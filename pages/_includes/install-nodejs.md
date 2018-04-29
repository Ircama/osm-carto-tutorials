## Install Node.js

[Node.js](https://nodejs.org/en/) can be installed via different methods, including:

- Standard mode with Ubuntu's Advanced Packaging Tool (APT)
- Version management tools, like:
  - [n](https://github.com/tj/n) (Interactively Manage Your Node.js Versions)
  - [nvm](https://github.com/creationix/nvm) (Node Version Manager)

A [list of useful commands](../nodejs-commands){:target="_blank"} to manage *Node.js* is available at a specific page.

### Distro version from the APT package manager

The recent versions of Ubuntu come with Node.js (*nodejs* package) and npm (*npm* package) in the default repositories. Depending on which Ubuntu version you're running, those packages may contain outdated releases; the one coming with Ubuntu 16.04 will not be the latest, but it should be stable and sufficient to run Kosmtik and Carto. TileMill instead needs *nodejs-legacy* (or an old version of node installed via a Node.js version management tool).

{% if include.program == 'TileMill' %}
For *{{ include.program }}* we will install *nodejs-legacy*:

```shell
sudo apt-get install -y nodejs-legacy npm
nodejs -v
npm -v
```
{% else %}
For *{{ include.program }}* we will install *nodejs*:

```shell
sudo apt-get install -y nodejs npm
node -v 2>/dev/null || sudo ln -fs /usr/bin/nodejs /usr/local/bin/node
nodejs -v
node -v
npm -v
```
{% endif %}

### Install *Node.js* through a version management tool

Alternatively, a suggested approach is using a Node.js version management tool, which simplifies the interactive management of different Node.js versions and allows performing the upgrade to the latest one. We will use *n*.

Install *n*:

```shell
mkdir -p ~/src ; cd ~/src
git clone https://github.com/tj/n.git
cd n
sudo make install # To uninstall: sudo make uninstall
cd ..
```

Some programs (like *Kosmtik* and *carto*) accept the latest LTS *node* version (`sudo n lts`), other ones (like *Tilemill*) run with v6.14.1 (`sudo n 6.14.1`).

{% if include.program == 'TileMill' %}
For *{{ include.program }}* we will install the old node version:

```shell
sudo n 6.14.1
```
{% else %}
For *{{ include.program }}* we will install the latest LTS one:

```shell
sudo n lts
```
{% endif %}

To get the installed version number:

```shell
node -v
npm -v
```
