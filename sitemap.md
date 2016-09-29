---
layout: default
title: List of all pages, notes and update messages
permalink: /z_sitemap/
---

## List of all pages

{% assign pages_list = site.pages | sort:"name" %}
{% for node in pages_list %}
  {% if node.title != null %}
    {% if node.layout == "page" %}
      {% if node.state != "draft" %}
  * <a href="{{ site.baseurl }}{{ node.url }}">{{ node.title }}</a>
      {% endif %}
    {% endif %}
  {% endif %}
{% endfor %}

## List of all notes

{% for node in site.notes %}
  {% if node.title != null %}
    {% if node.layout == "note" %}
      {% if node.state != "draft" %}
  * <a href="{{ site.baseurl }}{{ node.url }}">{{ node.title }}</a>
      {% endif %}
    {% endif %}
  {% endif %}
{% endfor %}

## List of all update messages

{% for post in site.posts %}
  {% if post.ref != null %}
    {% if node.state != "draft" %}
  * {{ post.date | date_to_string }} &raquo; [ {{ post.title }} ]({{ site.baseurl }}/{{ post.ref }})
    {% endif %}
  {% endif %}
{% endfor %}
