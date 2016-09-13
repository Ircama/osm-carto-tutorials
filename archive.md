---
layout: default
title: List of all posts
permalink: /z_archive/
---

## List of all Blog Posts

{% for post in site.posts %}
  * {{ post.date | date_to_string }} &raquo; [ {{ post.title }} ]({{ post.url }})
{% endfor %}