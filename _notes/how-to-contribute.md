---
layout: note
title: How to contribute to this site with new documents
comments: true
permalink: /how-to-contribute/
---

I’m happy to receive contributions and thanks for your effort in improving this theme and the tutorial documentation included in "OpenStreetMap Carto Tutorials" site.

This document assists you in providing updates or additions to the documentation.

## General notes

All documents can be written in [Markdown](https://en.wikipedia.org/wiki/Markdown) and this theme uses the [kramdown](http://kramdown.gettalong.org) processor. Markdown documents should have the *.md* extension.

Pages have to be saved in the *pages* directory; there are other types of documents, like *notes* and *posts*.

- **pages** (`layout: page`): standard documentation (non-linear content), also indexed in the left sidebar of the site; generally stored in the *pages* folder; a title is not needed for *pages* (as automatically created by the `title` tag of the *Front Matter* - see below);
- **notes** (`layout: note`): same rendering as *pages*, but NOT reported in the left sidebar of the site; generally stored in the *_notes* folder; a title is not needed for *notes* (as automatically created by the `title` tag of the *Front Matter* - see below);
- **posts** (`layout: post`): entries (linear content) listed in chronological order in the main page, possibly linking *pages*; all stored in the *_posts* folder;
- **general matters** (`layout: default`): pages that are NOT reported in the left sidebar of the site; they can be stored anyware in the site (even if the *pages* folder is suggested). Differently from *pages*, a specific title is needed within the document text.

A special type of layout is *homepage*, which is [subsequently](#homepage) described.

Markdown documents can include parts which are common to more pages. A common part (e.g., named *common-part.md*) can be referenced with the following [Liquid](http://shopify.github.io/liquid/) markup:

{% raw %}
```raw
{% include pages/common-part.md %}
```
{% endraw %}

Common parts have to be saved in the *_includes/pages* directory and should also be written in Markdown.

All files shall be in UTF8 format.

Liquid documentation can be found in [Liquid for Designers](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers).

## Managing Pages

All pages are provided with a tag in their bottom part, to directly link to their respective the GitHub editing page.

The suggested process to add or update *pages* is directly from the GitHub site:

- Log on to [GitHub](https://github.com) with your account (create one if you do not have it)
- Access [osm-carto-tutorials](https://github.com/Ircama/osm-carto-tutorials/tree/gh-pages/pages)
- Navigate to the *pages* folder; you can edit an existing file, upload files (produced elsewere) or create a new one directly through the GitHub Web; to exploit the Web, open a file and press the pencil icon to update it, or press *Create new file*, for a new one; give a valid name to your new file, including *.md* extension (e.g., *osm-carto-tutorials/pages/50_new-file.md*).
- For *pages*, conventionally the file name should start with two digits followed by underscore, so that it defines a list ordering used by the auto-generated navigation menu within the left sidebar of the site.
- When creating a new file, remember to add the *.md* extension (without this, the *Preview* does not work). A name initiating with underscore will remain hidden (e.g., *_hidden-name.md*).
- Notice that, when applying a change, the *OpenStreetMap Carto Tutorials* repository is automatically forked to your site. (The most effective process would be to [fork](https://help.github.com/articles/working-with-forks) *OpenStreetMap Carto Tutorials*, create a branch and perform there the [modifications](https://help.github.com/articles/proposing-changes-to-a-project-with-pull-requests)).
- Start the document with the following [Front Matter]( https://jekyllrb.com/docs/frontmatter/) tags:
  
  ```
  ---
  layout: page
  title: Title Name
  comments: true
  permalink: /target-file-name/
  ---
  ```
  
  Description of the used tags:
  
  - `layout`: set it to the appropriate type of document (e.g., `page`)
  - `title`: provide an effective title; this will be automatically used as a short description in all references of the site
  - `comments`: only for `pages`, use `true` if you want to enable [Disqus commenting](https://disqus.com) at the end of your document
  - `permalink`: only for `pages`, recommended in order to define a path to reference the document in the site with a permanent link; suggestions: use a short set of characters, use the dash to separate letters; avoid upper case letters, set it once and avoid subsequent modifications (while the file name might be changed over the time, this link should remain unaltered).
  - `sitemap`: if set and valued *false* (e.g., `sitemap: false`), the document is not linked to the sidebar, counters and site map.

- Subsequently to the *Front Matter* section, you can write the document in *Markdown*; check related [Quick Reference Guide]( http://kramdown.gettalong.org/quickref.html) and [Syntax](http://kramdown.gettalong.org/syntax.html). As mentioned for `layout: page`, do not add a title to your document, but use the Front Matter *title* tag instead.
  
  Example:

  ```
  ---
  layout: page
  title: Installation description of a new important application to help in developing styles
  comments: true
  permalink: /qa-style-inst/
  ---
    
  This document describes the installation procedure of a new important application that allows the following features:
  - control quality
  - highlight errors
  - ...
  - ...
  ```
  
- Press the *Preview* button to verify the correct rendering of the document.

- Relative links shall be contructed with my_relative_link (e.g., `[a link to a site](its_permalink/)`).

## Managing Posts

You might limit your contribution to pages, while I'll create appropriate posts during revision. I'll keep anyway a description on how to manage them.

To generate a new post, create a file in the _posts directory similarly to what described in the previous section for *pages*. Blog post files have to be named according to the following format: YEAR-MONTH-DAY-title.md

Where YEAR is a four-digit number, MONTH and DAY are both two-digit numbers, and title is a short name with words separated by dashes.
MARKUP is the file extension representing the format used in the file. For example, the following are valid post filenames:

```
2016-09-01-site-scope.md
2016-09-11-tilemill-osm-carto.md
```

## Editing hints

### Markdown

The used Markdown format is [kramdown](http://kramdown.gettalong.org/quickref.html) with [Rouge](https://github.com/jneen/rouge) syntax highlighter.

A good tutorial is included here: [Markdown syntax](https://learn.getgrav.org/content/markdown)

### Link to a section of a different document in the same site

Use this syntax:

```
[Section name](../other-document-permalink/#section-name-in-lowercase-with-spaces-convered-in-dashes)
```

Sample:

```
Check also instructions [here](../tilemill-osm-carto/#download-openstreetmap-data).
```

### Link to a section of the same document

Use this syntax:

```
[here](#section-name-in-lowercase-with-spaces-convered-in-dashes)
```

Sample:

```
    # Contents
     - [Specification](#specification)
     - [Dependencies Title](#dependencies-title)

    ## Specification
    Example text blah. Example text blah. Example text blah. Example text blah.
Example text blah. Example text blah. Example text blah. Example text blah.

    ## Dependencies Title
    Example text blah. Example text blah. Example text blah. Example text blah.
Example text blah. Example text blah. Example text blah. Example text blah.
```

Sample:

```
See [Start Kosmtik](#start-kosmtik).
```

### Opening a link in a new window

```
This is [a link](http://example.com){:target="_blank"} that opens in a new window.
```

This is [a link](http://example.com){:target="_blank"} that opens in a new window.

### Coloring

This theme includes an extension of the [Lanyon](https://github.com/Ircama/osm-carto-tutorials/blob/gh-pages/public/css/lanyon.css) stylesheet which easily supports some colors.

#### Sample of coloring a paragraph:

```
This is a paragraph that for some reason we want yellow.
{: .yellow}

This is a paragraph that for some reason we want gold.
{: .gold}

This is a paragraph that for some reason we want blue.
{: .blue}

This is a paragraph that for some reason we want red.
{: .red}

This is a paragraph that for some reason we want green.
{: .green}
```

This is a paragraph that for some reason we want yellow.
{: .yellow}

This is a paragraph that for some reason we want gold.
{: .gold}

This is a paragraph that for some reason we want blue.
{: .blue}

This is a paragraph that for some reason we want red.
{: .red}

This is a paragraph that for some reason we want green.
{: .green}

#### Sample of inline coloring:

```
This is a *yellow*{:.highlight-yellow} highlight.

This is a *gold*{:.highlight-gold} highlight.

This is a *blue*{:.highlight-blue} highlight.

This is a *red*{:.highlight-red} highlight.

This is a *green*{:.highlight-green} highlight.
```

This is a *yellow*{:.highlight-yellow} highlight.

This is a *gold*{:.highlight-gold} highlight.

This is a *blue*{:.highlight-blue} highlight.

This is a *red*{:.highlight-red} highlight.

This is a *green*{:.highlight-green} highlight.

### Drawings

This theme includes an extension of the [Lanyon](https://github.com/Ircama/osm-carto-tutorials/blob/gh-pages/public/css/lanyon.css) stylesheet which supports drawings.

Drawings are defined as standard Markdown tables including UTF8 arrows (or unicode ones in case the editor is able to convert them to UTF8) and followed by `{: .drawing}` when all cells are centered or by `{: .drawing .djustify}` when cells have to be justified.
The file shall be in UTF8 format.

Some examples:

```
|First information|
|↓|
|Second information|
|↓|
|Third information|
|↓|
|Final information|
{: .drawing .djustify}
```

|First information|
|↓|
|Second information|
|↓|
|Third information|
|↓|
|Final information|
{: .drawing .djustify}

{% raw %}
```raw
|A YAML file ![yml][yml]       | |A CSS file ![css][css]| |An image ![png][png]|
|                               |↘|↓|↙|
|DB tables ![db][db]   |→|**A program**  ![prg][prg]|→|Some web pages ![web][web]|
|                               |↗|↑|↖|
|A JSON file ![json][json] | |Geographic data ![shape][shape]| |An XML ![xml][xml]|
{: .drawing}

{% include pages/images.md %}
```
{% endraw %}

|A YAML file ![yml][yml]       | |A CSS file ![css][css]| |An image ![png][png]|
|                               |↘|↓|↙|
|DB tables ![db][db]   |→|**A program**  ![prg][prg]|→|Some web pages ![web][web]|
|                               |↗|↑|↖|
|A JSON file ![json][json] | |Geographic data ![shape][shape]| |An XML ![xml][xml]|
{: .drawing}

{% include pages/images.md %}

Notice that the image references can be defined through the syntax:

{% raw %}
```raw
{% include pages/images.md %}
```
{% endraw %}

or directly defining the images as follows:

```raw
{% include pages/images.md %}
```

## Publishing

- Once the editing is completed, ensure that the file name is appropriate, enter an effective short title (e.g., less than 70 chars), add an appropriate multiline extended description, press *"Propose New file"* or *"Propose a file change"*
- Press *"Create pull request"*.
- Complete the short description and the long description (the long description exploits Markdown; you can repeat the title in its first line for better commenting), then press *"Create pull request"*.

If you have the option to select *"Create a new branch for this commit and start a pull request."*, use it and enter a valid branch name (very short, e.g., 15 chars).

The created *pull request* will be revised in order to be published. Please, accept some time to accomplish the review process, thanks.

## Homepage

The home page includes all pages tagged with the following Front Matter:

```
---
layout: homepage
title: OpenStreetMap Carto Tutorials
---

...
...
```

The title of the first shown page (*title:*) will be site main banner.

Generally, a file named *homepage.md* inside the *_notes* directory includes the text of the home page.

Subsequently to the home pages, all posts are listed.
