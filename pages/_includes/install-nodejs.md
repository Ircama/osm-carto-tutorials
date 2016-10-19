## Install Node.js

To install [Node.js](https://nodejs.org/en/):

    nodejs --version # to verify whether nodejs is already installed
    sudo apt-get install -y nodejs npm # this package might not support {{ include.program }}, see notes in this paragraph

Read [nodejs](https://nodejs.org/en/download/) for further information.

Notice that *nodejs-legacy* might be needed for {{ include.program }} (at least required with Ubuntu 16.04 at the time of writing).

```
sudo apt-get install -y nodejs-legacy npm
```

The following error when running {{ include.program }} is related to compatibility issues with nodejs and should be fixed by installing *nodejs-legacy*.

```
npm ERR! Failed at the mapnik@3.5.13 install script 'node-pre-gyp install --fallback-to-build'.
npm ERR! Make sure you have the latest version of node.js and npm installed.
```