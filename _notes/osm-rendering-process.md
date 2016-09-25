---
layout: note
title: Description of the OSM rendering process
comments: true
permalink: /osm-rendering-process/
---
I’m happy to receive contributions and thanks for your effort.

This document assists you in providing updates or additions to the documentation of the "OpenStreetMap Carto Tutorials" site.

There are three types of documents:

- **pages** (`layout: page`): standard documentation (non-linear content), also indexed in the left sidebar of the site; generally stored in the *pages* folder; a title is not needed for *pages* (as automatically created by the `title` tag of the *Front Matter* - see below);
- **posts** (`layout: post`): entries (linear content) listed in chronological order in the main page, possibly linking *pages*; all stored in the *_posts* folder;
- **general matters** (`layout: default`): pages that are NOT reported in the left sidebar of the site; they can be stored anyware in the site (even if the *pages* folder is suggested). Differently from *pages*, a specific title is needed within the document text.

All documents can be written in [Markdown](http://kramdown.gettalong.org) (*.md* extension).

## Managing Pages

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

- Pay attention to relative links, which shall be contructed with {{ site.baseurl }}/my_relative_link (e.g., `[a link to a site]({{ site.baseurl }}/its_permalink/)`).

## Managing Posts

You might limit your contribution to pages, while I'll create appropriate posts during revision. I'll keep anyway a description on how to manage them.

To generate a new post, create a file in the _posts directory similarly to what described in the previous section for *pages*. Blog post files have to be named according to the following format: YEAR-MONTH-DAY-title.md

Where YEAR is a four-digit number, MONTH and DAY are both two-digit numbers, and title is a short name with words separated by dashes.
MARKUP is the file extension representing the format used in the file. For example, the following are valid post filenames:

```
2016-09-01-site-scope.md
2016-09-11-tilemill-osm-carto.md
```

## Editing notes

### Link to a section of a different document in the same site

Use this syntax:

```
[Section name]({{ site.baseurl }}/other-document-permalink/#section-name-in-lowercase-with-spaces-convered-in-dashes)
```

Remember the initial /osm-carto-tutorials/

Sample:

```
Check also instruction [here]({{ site.baseurl }}/tilemill-osm-carto/#download-openstreetmap-data).
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


## Publishing

- Once the editing is completed, ensure that the file name is appropriate, enter an effective short title (e.g., less than 70 chars), add an appropriate multiline extended description, press *"Propose New file"* or *"Propose a file change"*
- Press *"Create pull request"*.
- Complete the short description and the long description (the long description exploits Markdown; you can repeat the title in its first line for better commenting), then press *"Create pull request"*.

If you have the option to select *"Create a new branch for this commit and start a pull request."*, use it and enter a valid branch name (very short, e.g., 15 chars).

The created *pull request* will be revised in order to be published. Please, accept some time to accomplish the review process, thanks.
