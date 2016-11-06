## https://ircama.github.io/osm-carto-tutorials/

# OpenStreetMap Carto Tutorials

Unofficial tutorials for [openstreetmap-carto](https://github.com/gravitystorm/openstreetmap-carto).

-------------

  ┌┬┐┌─┐┌─┐   ┬┌─┐┬┌─┬ ┬┬  ┬
   │││ ││  ── │├┤ ├┴┐└┬┘│  │
  ─┴┘└─┘└─┘  └┘└─┘┴ ┴ ┴ ┴─┘┴─┘

This [Jekyll](http://jekyllrb.com/)-based theme is specifically intended for static technical documentation deployable on [GitHub Pages](https://pages.github.com/).

Information on the usage of this theme can be found in [how to contribute]({{ site.author.url }}{{ site.baseurl }}/blob/gh-pages/_notes/how-to-contribute.md).

## Credits:

* [Lanyon](http://lanyon.getpoole.com) theme, by [Mark Otto](https://github.com/mdo). Many modifications have been added on top.
* [AnchorJS plugin](https://github.com/bryanbraun/anchorjs), (c) 2016 Bryan Braun; licensed MIT
* [Table of Contents plugin for Bootstrap](https://afeld.github.io/bootstrap-toc/) (ScrollSpy plugin), (c) 2015 Aidan Feldman, licensed MIT (https://github.com/afeld/bootstrap-toc/blob/gh-pages/LICENSE.md), with some improvements to support all headers from h1 to h6
* [Bootstrap](getbootstrap.com)
* [jQuery](https://jquery.com/)
* [github.commits.widget](https://github.com/alexanderbeletsky/github-commits-widget), (c) 2012 Alexander Beletsky, with some improvements
* [lanyon-plus](https://github.com/dyndna/lanyon-plus)
* [A Jekyll layout that compresses HTML in pure Liquid](https://github.com/penibelst/jekyll-compress-html), © 2014–2015 Anatol Broder. Released under the MIT License. The compressor has been modified in order to also obtain a very basic Liquid Javascript compressor.
* Fonts and icons from http://fontawesome.io/, http://www.flaticon.com, https://openclipart.org/ and https://icomoon.io
* Usage of compressed scss styles

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
 * revised css and js to allow fully responsive site for smartphones, tablets and different desktop resolutions
 * developed extensive style for print including automatic chapter numbering
 * developed a smart site map
 * improved Atom RSS
 * added integration with Disqus, Google Search Custom, Google Analytics
 * Home page revised
 * improved lanyon.css and poole.css
 * Added features from [credits]({{ site.author.url }}{{ site.baseurl }}/tree/gh-pages#credits): AnchorJS, Table of Contents (ScrollSpy), github.commits.widget, lanyon-plus icons, etc. Developed a feature to support all headers from h1 to h6 in ToC. Developed an upgrade to github.commits.widget to support a one-line page commit summary through API integration with GitHub.
 * Developed an extension of the Lanyon stylesheet which supports drawings.
 * Single style.css style compiled and compressed afer merging all scss/css styles
 * Integrated a Liquid HTML compressor
 * Added a very basic Liquid Javascript compressor
 * Added footnotes management
 