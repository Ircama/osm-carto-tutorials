## https://ircama.github.io/osm-carto-tutorials/

# OpenStreetMap Carto Tutorials - DOC-JEKYLL theme

Unofficial tutorials for [openstreetmap-carto](https://github.com/gravitystorm/openstreetmap-carto).

-------------

```
  ┌┬┐┌─┐┌─┐   ┬┌─┐┬┌─┬ ┬┬  ┬
   │││ ││  ── │├┤ ├┴┐└┬┘│  │
  ─┴┘└─┘└─┘  └┘└─┘┴ ┴ ┴ ┴─┘┴─┘
```

This [Jekyll](http://jekyllrb.com/)-based theme named DOC-JEKYLL is specifically intended for static technical documentation deployable on [GitHub Pages](https://pages.github.com/).

Information on the usage of this theme can be found in [how to contribute](_notes/how-to-contribute.md).

## Credits:

* [Lanyon](http://lanyon.getpoole.com) theme, by [Mark Otto](https://github.com/mdo). Many modifications have been added on top.
* [Bootstrap 3.3.7](https://getbootstrap.com)
* [jQuery 2.1.4](https://jquery.com/)
* [GitHub buttons](https://ghbtns.com/) by [mdo](https://twitter.com/mdo)
* [AnchorJS plugin](https://github.com/bryanbraun/anchorjs), (c) 2016 Bryan Braun; licensed MIT
* [Table of Contents plugin for Bootstrap](https://afeld.github.io/bootstrap-toc/) (ScrollSpy plugin), (c) 2015 Aidan Feldman, licensed MIT (https://github.com/afeld/bootstrap-toc/blob/gh-pages/LICENSE.md), with some improvements to support all headers from h1 to h6
* [github.commits.widget](https://github.com/alexanderbeletsky/github-commits-widget), (c) 2012 Alexander Beletsky, with some improvements
* [lanyon-plus](https://github.com/dyndna/lanyon-plus)
* [clipboard.js](https://clipboardjs.com/) by [Zeno Rocha](http://zenorocha.com/)
* [A Jekyll layout that compresses HTML in pure Liquid](https://github.com/penibelst/jekyll-compress-html), © 2014–2015 Anatol Broder. Released under the MIT License. The compressor has been modified in order to also obtain a very basic Liquid Javascript compressor.
* Fonts and icons from http://fontawesome.io/, designed by Freepik and distributed by Flaticon (http://www.flaticon.com/authors/freepik), https://openclipart.org/ and https://icomoon.io
* [matteobrusa](https://github.com/matteobrusa)'s code to [show a styled markdown document from an URL](https://matteobrusa.github.io/md-styler/)
* [roperzh](https://github.com/roperzh)'s code to [parse and view man pages](https://github.com/roperzh/jroff/)

Licensed under the [MIT License](http://opensource.org/licenses/MIT)

Hosted by [GitHub](https://github.com)

This site can be cloned and reused freely. The following files and data are specific and need deletion or customization when forking this site for different purposes:

- _config.yml, including all project specific parameters (shall be customized)
- README.MD (shall be customized)
- public/favicon.ico and public/apple-touch-icon-precomposed.png (shall be customized)
- All files in "pages", "_notes" and "_posts" directory (shall be removed)
- googlec45135b10de87878.html (shall be removed)
- the *pages* subdirectory inside *_includes*

Summary of the main changes from the default Lanyon Theme:

 * additional settings in _config.yml
 * developed improved sidebar
 * added last modification date for the whole site and for each page (using GitHub commit dates)
 * added last site version (using last GitHub tag name)
 * revised css and js to allow fully responsive site for smartphones, tablets and different desktop resolutions
 * developed extensive style for print including automatic chapter numbering
 * developed a smart site map
 * improved Atom RSS
 * added integration with Disqus, Google Search Custom, Google Analytics
 * Home page revised
 * improved lanyon.css and poole.css
 * Developed an extension of the Lanyon stylesheet which supports drawings.
 * Usage of compressed scss styles. Single style.css style compiled and compressed afer merging all scss/css styles
 * Integrated a Liquid HTML compressor
 * Added a very basic Liquid Javascript compressor
 * Added footnotes management
 
 ---------------
 
# How to locally deploy and test this website

This chapter summarizes all the steps to locally deploy and test this [jekill](https://docs.github.com/en/github/working-with-github-pages/setting-up-a-github-pages-site-with-jekyll)-based [GitHub Pages](https://pages.github.com/) website with Ubuntu.

- Clone this repository (e.g. with [GitHub Desktop](https://desktop.github.com/))

- Not strictly necessary: install [Snap](https://en.wikipedia.org/wiki/Snap_(package_manager)):

    ```shell
    sudo apt update
    sudo apt install snapd
    ```

- Install [Jekyll](https://jekyllrb.com/docs/installation/) and related prerequisites:

    ```shell
    cd

    # Test that prerequisites are already installed (each command shows how to install the related prerequisite if missing)
    ruby -v # if missing, install it with e.g.: snap install ruby --classic
    gem -v
    cc -v
    g++ -v
    make -v

    # Install Ruby
    sudo apt-get install ruby-full build-essential zlib1g-dev
    echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
    echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
    echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
    source ~/.bashrc

    # Install jekyll and bundler
    gem install jekyll bundler
    ```

- Update the bundler version in Gemfile.lock. (Gemfile.lock is removed, so that Bundler will fetch all remote sources, resolve dependencies and install all needed gems.)

    ```shell
    cd ~/Documents/GitHub/osm-carto-tutorials
    rm Gemfile.lock
    bundle install
    
    # Alternatively, you can run "bundle update --bundler"
    ```

- Finally, serve the website

    ```shell
    bundle exec jekyll serve
    ```

