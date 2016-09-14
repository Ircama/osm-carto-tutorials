---
layout: default
title: How to contribute to this site with new documents
comments: true
permalink: /how-to-contibute/
---
I’m happy to receive contributions and thanks for your effort.

This document assists you in providing updates or additions to the documentation of the "OpenStreetMap Carto Tutorials" site.

There are three types of documents:
- pages (layout: page): standard documentation, also indexed in the left sidebar of the site (check *pages* directory); generally stored in the *pages* folder;
- posts (layout: post): entries listed in chronological order in the main page, possibly linking *pages*; all stored in the *_posts* folder;
- general information (layout: default): pages that are NOT reported in the left sidebar of the site; stored anyware in the site (+pages* folder is suggested).

All documents can written in Markdown (*.md* extension).

## Pages

The suggested process to add or update *pages* is directly from the GitHub site:

- Log on to GitHub with your account (create one if you do not have it)
- Access [osm-carto-tutorials](https://github.com/Ircama/osm-carto-tutorials/tree/gh-pages/pages)
- Navigate to the *pages* folder; you can edit an existing file, upload files (produced elsewere) or create a new one directly through the GitHub Web; to exploit the Web, press *Create new file*, give a valid name to your file including *.md* extension (e.g., *osm-carto-tutorials/pages/mapnik.md*).
- When applying a change, the *OpenStreetMap Carto Tutorials* repository is automatically forked to your site.
- The most effective process would be to fork *OpenStreetMap Carto Tutorials*, create a branch and do there the modifications.
- when creating a new file, remember to add the *.md* extension (without this, the *Preview* does not work). A name initiating with underscore will remain hidden (e.g., *_hidden-name.md*).
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
  - *layout*: set it to the appropriate type of document (e.g., page)
  - *title*: provide an effective title; this will be automatically used by as a short description in all references of the site
  - *comments*: use *true* is you want to enable [Disqus](https://disqus.com) commenting at the end of your document
  - *permalink*: define a short set of characters to store the document in the site; use the dash to separate letters; avoid upper case letters.

- Subsequently to the Front Matter section, you can write the document in [Markdown]( http://kramdown.gettalong.org); check related [Quick Reference Guide]( http://kramdown.gettalong.org/quickref.html) and [Syntax]( http://kramdown.gettalong.org/syntax.html). Do not add a titele to your document, but use the Front Matter *title* tag instead.
  
  Example:
  ```
  ---
  layout: page
  title: Installation description of a new important application to help quality assurance
  comments: true
  permalink: /qa-installation/
  ---
    
  This document describes the installation procedure of a new important QA application that allows the following features:
  
  - Control quality
  - Highlight errors
  - ...
  - ...
  ```
  
- Press the *Preview* button to verify the correct rendering of the documentation.

- Once the editing is completed, ensure that the file name is appropriate, enter an effective short title (e.g., less than 70 chars), add an appropriate extended description, press *“Propose New file”* or *"Propose a file change"*
- Press "Create pull request".
- Comprete the short description and the long description, then press "Create pull request".

If you have the option to select *“Create a new branch for this commit and start a pull request.”*, use it and enter a valid branch name (very short, e.g., 15 chars).

The created pull request will be revised in order to be published. Please, accept some time to accomplish the revision process.
