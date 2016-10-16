Some test might not pass (this does not mean that the installation is necessarily failed)
    
Notice that, when running `npm test`, an error like the following indicates that your system does not have a modern enough libstdc++/gcc-base toolchain:
    
    `Error: /usr/lib/x86_64-linux-gnu/libstdc++.so.6: version GLIBCXX_3.4.20 not found (required by /node_modules/osrm/lib/binding/osrm.node)`
    
If you are running Ubuntu older than 16.04 you can easily upgrade your libstdc++ version like:
    
```
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update -y
sudo apt-get install -y libstdc++-5-dev
```
    
Read [node-mapnik](https://github.com/mapnik/node-mapnik#depends) for further information.