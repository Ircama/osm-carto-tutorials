---
layout: page
title: How to contribute to this site with new documents
comments: true
permalink: /how-to-contibute/
---

I’m happy to receive contributions to the documentation.

The suggested process is directly from the GitHub site:

- Log on to GitHub with your account (create one if you do not have it)
- Fork the [OpenStreetMap Carto Tutorials](https://github.com/Ircama/osm-carto-tutorials) repository.
- Navigate to the *pages* folder, press *Create new file*, give a valid name to your file including *.md* extension (e.g., *osm-carto-tutorials/pages/mapnik.md*).
- Remember to add the *.md* extension to the file (without this, the Preview does not work)
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
  - *layout*: set it always to page
  - *title*: provide an effective title to your document; this will be used by as a short description in all references of the site
  - *comments*: use *true* is you want to enable Disqus commenting at the end of your document
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

- Once the editing is completed, ensure that the file name is appropriate, select *“Create a new branch for this commit and start a pull request.”*, enter a valid branch name (very short, e.g., 15 chars), enter an effective short title (e.g., less than 70 chars), add an appropriate extended description, press *“Propose New file”*
