---
layout: default
title: How to contribute to this site with new documents
comments: true
permalink: /how-to-contribute/
---
# How to contribute to this site with new documents

I’m happy to receive contributions and thanks for your effort.

This document assists you in providing updates or additions to the documentation of the "OpenStreetMap Carto Tutorials" site.

There are three types of documents:

- **pages** (`layout: page`): standard documentation, also indexed in the left sidebar of the site; generally stored in the *pages* folder; a title is not needed for *pages* (as automatically created by the `title` tag of the *Front Matter* - see below);
- **posts** (`layout: post`): entries listed in chronological order in the main page, possibly linking *pages*; all stored in the *_posts* folder;
- **general matters** (`layout: default`): pages that are NOT reported in the left sidebar of the site; they can be stored anyware in the site (even if the *pages* folder is suggested). Differently from *pages*, a specific title is needed within the document text.

All documents can be written in [Markdown](http://kramdown.gettalong.org) (*.md* extension).

The suggested process to add or update *pages* is directly from the GitHub site:

- Log on to [GitHub](https://github.com) with your account (create one if you do not have it)
- Access [osm-carto-tutorials](https://github.com/Ircama/osm-carto-tutorials/tree/gh-pages/pages)
- Navigate to the *pages* folder; you can edit an existing file, upload files (produced elsewere) or create a new one directly through the GitHub Web; to exploit the Web, open a file and press the pencil icon to update it, or press *Create new file*, for a new one; give a valid name to your new file, including *.md* extension (e.g., *osm-carto-tutorials/pages/new-file.md*).
- Notice that, when applying a change, the *OpenStreetMap Carto Tutorials* repository is automatically forked to your site. (The most effective process would be to [fork](https://help.github.com/articles/working-with-forks) *OpenStreetMap Carto Tutorials*, create a branch and perform there the [modifications](https://help.github.com/articles/proposing-changes-to-a-project-with-pull-requests)).
- When creating a new file, remember to add the *.md* extension (without this, the *Preview* does not work). A name initiating with underscore will remain hidden (e.g., *_hidden-name.md*).
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
  - `permalink`: only for `pages`, define a path to store the document in the site; suggestions: use a short set of characters, use the dash to separate letters; avoid upper case letters.

- Subsequently to the Front Matter section, you can write the document in Markdown; check related [Quick Reference Guide]( http://kramdown.gettalong.org/quickref.html) and [Syntax](http://kramdown.gettalong.org/syntax.html). As mentioned for `layout: page`, do not add a title to your document, but use the Front Matter *title* tag instead.
  
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

- Once the editing is completed, ensure that the file name is appropriate, enter an effective short title (e.g., less than 70 chars), add an appropriate multiline extended description, press *"Propose New file"* or *"Propose a file change"*
- Press *"Create pull request"*.
- Complete the short description and the long description (the long description exploits Markdown; you can repeat the title in its first line for better commenting), then press *"Create pull request"*.

If you have the option to select *"Create a new branch for this commit and start a pull request."*, use it and enter a valid branch name (very short, e.g., 15 chars).

The created *pull request* will be revised in order to be published. Please, accept some time to accomplish the review process, thanks.
