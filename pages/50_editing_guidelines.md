---
layout: page
title: Editing Guidelines for OpenStreetMap Carto
permalink: /editing-guidelines/
sitemap: false
comments: true
---

This document includes best practices for managing the OpenStreetMap Carto style.

First create an issue to present the idea and discuss

Avoid comments

Keep the same format

Smallest set of modifications at the cost of creating more branches

Test with many zones

Mercator

Usage of the tags with wiki

Verify that you are rendering an appropriate tagging and that the wiki supports it and that there is no case of missing or misunderstood tag

Count number of use. If lower than 10k the reason to introduce a new feature has to be deeply discussed

Consider solving an open issue first, before introducing a new feature

Geometric Mean

One feature per pr

Allow the commenters and maintainers to challenge a new feature, support your idea and be ready to accept the decision not to merge it

Text size and word wrap

Add a short one line commit message. In the commit line, reference the issue Id (eg issue #1234) then a blank line, then a long description which has to be repeated in the pr text

When making an improvement, try to reuse similar methods already included in the style for other features.

## Map Icon Guidelines

Icons for the submitted to the standard tile layer will be:
* SVG only
* flat (single colour [usually black], no gradients, no outlines)
* clean (reduced complexity where possible)
* sharp (aligned to pixel grid)
* single point of view (avoid use of perspective where possible)
* common canvas size (usually 14x14px)

Read the [https://wiki.openstreetmap.org/wiki/Map_Icons/Map_Icons_Standards](Map Icon Standards)
on how to approach designing clear icons.

More information at [https://wiki.openstreetmap.org/wiki/Map_Icons](OSM wiki Map Icons)
and information concerning icon color.


SVG

- use svg files for symbols
## Best practices of svg symbols

- keeps svg essential
- remove uneeded comments
- do not add a copyrighted svg
