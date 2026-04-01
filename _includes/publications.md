{% assign section_title = include.title | default: "Selected Publications" %}
{% assign section_id = include.section_id | default: "publications" %}
{% assign show_internal_link = include.show_internal_link %}
{% assign data_file = include.data_file | default: "publications" %}
{% assign publications = site.data[data_file].main %}
{% assign show_filters = include.show_filters %}
{% assign filter_labels = include.filter_labels | default: "" | split: "|" %}
{% assign auto_filters = "" | split: "" %}
{% assign enable_pagination = include.enable_pagination %}
{% assign items_per_page = include.items_per_page | default: 5 %}

{% if show_filters and include.filter_labels == nil %}
  {% capture collected_tags %}{% for publication in publications %}{{ publication.tags | append: "," }}{% endfor %}{% endcapture %}
  {% assign auto_filters = collected_tags | split: "," | uniq %}
{% endif %}

<h2 id="{{ section_id }}" style="margin: 2px 0px -15px; display: flex; align-items: baseline; flex-wrap: wrap; gap: 0.5rem;">
  {{ section_title }}
  <small style="font-size: 0.8rem; font-weight: 400; margin-left: 1em;">
    {% if show_internal_link %}
    <a href="{{ '/all-publications.html' | relative_url }}">(View all publications)</a>
    {% endif %}
    {% assign scholar_link = site.social | where: "platform", "Google Scholar" | first %}
    {% if scholar_link %}
    {% if show_internal_link %}<span style="margin: 0 0.4em;">|</span>{% endif %}
    <a href="{{ scholar_link.url }}" target="_blank" rel="noopener">(Click for Google Scholar)</a>
    {% endif %}
  </small>
</h2>

<div class="publications" data-enable-pagination="{{ enable_pagination }}" data-items-per-page="{{ items_per_page }}">
{% if show_filters %}
<div class="filters">
  <button class="btn active" data-filter="*">All</button>
  {% assign filters_to_render = filter_labels %}
  {% if include.filter_labels == nil %}
  {% assign filters_to_render = auto_filters %}
  {% endif %}
  {% for filter_label in filters_to_render %}
  {% assign trimmed_label = filter_label | strip %}
  {% if trimmed_label != "" %}
  <button class="btn" data-filter="{{ trimmed_label }}">{{ trimmed_label }}</button>
  {% endif %}
  {% endfor %}
</div>
{% endif %}
<ol class="bibliography">

{% for link in publications %}
{% assign primary_link = link.url | default: link.page | default: link.pdf %}

<li data-tags="{{ link.tags | escape }}">
<div class="pub-row">
  <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
  {% if link.image %}
  {% if primary_link %}
  <a href="{{ primary_link }}" target="_blank" rel="noopener noreferrer" aria-label="Open publication: {{ link.title }}">
    <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width: 100; height: auto;">
  </a>
  {% else %}
    <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width: 100; height: auto;">
  {% endif %}
  {% if link.conference_short %}
  <abbr class="badge">{{ link.conference_short }}</abbr>
  {% endif %}
  {% endif %}
  </div>
  <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
      <div class="title">
        {% if primary_link %}
        <a href="{{ primary_link }}" target="_blank" rel="noopener noreferrer">{{ link.title }}</a>
        {% else %}
        {{ link.title }}
        {% endif %}
      </div>
      <div class="author">{{ link.authors }}</div>
      {% if link.conference %}
      <div class="periodical"><em>{{ link.conference }}</em>
      </div>
      {% endif %}
    <div class="links">
        {% if link.url %}
        <a href="{{ link.url }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;"><i class="fas fa-file-pdf"></i> PDF</a>
        {% endif %}
        {% if link.code %}
        <a href="{{ link.code }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;"><i class="fab fa-github"></i> Code</a>
        {% endif %}
        {% if link.page %}
        <a href="{{ link.page }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;"><i class="fas fa-globe"></i> Project Page</a>
        {% endif %}
        {% if link.bibtex %}
        <a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;"><i class="fas fa-quote-right"></i> BibTex</a>
        {% endif %}
      {% if link.others %}
      {{ link.others }}
      {% endif %}
    </div>
    {% if link.notes %}
    <div class="publication-notes"><strong><i>{{ link.notes }}</i></strong></div>
    {% endif %}
  </div>
</div>
</li>
<br>

{% endfor %}

</ol>
{% if enable_pagination %}
<div class="publication-pagination" aria-label="Publication pagination"></div>
{% endif %}
</div>
