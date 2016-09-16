---
layout: default
title: List of all posts
permalink: /z_archive/
---

## List of all site update notes

{% for post in site.posts %}
  {% if post.ref != null %}
  * {{ post.date | date_to_string }} &raquo; [ {{ post.title }} ]({{ site.baseurl }}/{{ post.ref }})
  {% endif %}

{% endfor %}
