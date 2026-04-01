{% assign data_file = include.data_file | default: "all_publications" %}
{% assign publications = site.data[data_file].main %}
{% assign preferred_topics = include.preferred_topics | default: "" | split: "|" %}
{% if include.preferred_topics == nil %}
  {% assign preferred_topics = site.data.publication_tags.preferred_topics %}
{% endif %}
{% assign excluded_topics = include.excluded_topics | default: "" | split: "|" %}
{% if include.excluded_topics == nil %}
  {% assign excluded_topics = site.data.publication_tags.excluded_topics %}
{% endif %}

{% capture collected_topics %}{% for publication in publications %}{{ publication.tags | default: "" | replace: ", ", "," | replace: " ,", "," | append: "," }}{% endfor %}{% endcapture %}
{% assign auto_topics = collected_topics | split: "," | uniq %}

{% capture ordered_topics %}
  {% for preferred_topic in preferred_topics %}
    {% assign trimmed_preferred_topic = preferred_topic | strip %}
    {% unless trimmed_preferred_topic == "" or excluded_topics contains trimmed_preferred_topic %}
      {% if auto_topics contains trimmed_preferred_topic %}{{ trimmed_preferred_topic }}|{% endif %}
    {% endunless %}
  {% endfor %}
  {% for topic in auto_topics %}
    {% assign trimmed_topic = topic | strip %}
    {% unless trimmed_topic == "" or excluded_topics contains trimmed_topic or preferred_topics contains trimmed_topic %}
      {{ trimmed_topic }}|
    {% endunless %}
  {% endfor %}
{% endcapture %}
{% assign ordered_topics = ordered_topics | split: "|" %}

<div id="research-interests" class="research-inline-block">
  <div class="research-inline-header">
    <span class="research-inline-kicker">Research Interests</span>
    <span class="research-inline-note">Click a topic to filter publications.</span>
  </div>

  <div class="research-inline-list">
    {% for topic in ordered_topics %}
      {% assign trimmed_topic = topic | strip %}
      {% if trimmed_topic != "" %}
      <a class="research-pill" href="{{ '/all-publications.html' | relative_url }}?filter={{ trimmed_topic | uri_escape }}#all-publications">{{ trimmed_topic }}</a>
      {% endif %}
    {% endfor %}
  </div>
</div>
