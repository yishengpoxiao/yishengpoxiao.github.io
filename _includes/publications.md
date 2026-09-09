{% assign section_title = include.title | default: "Selected Publications" %}
{% assign section_id = include.section_id | default: "publications" %}
{% assign show_internal_link = include.show_internal_link %}
{% assign data_file = include.data_file | default: "publications" %}
{% assign publications = site.data[data_file].main %}
{% assign show_filters = include.show_filters %}
{% assign filter_labels = include.filter_labels | default: "" | split: "|" %}
{% assign auto_filters = "" | split: "" %}
{% assign preferred_filters = include.preferred_filters | default: "" | split: "|" %}
{% if include.preferred_filters == nil %}
  {% assign preferred_filters = site.data.publication_tags.preferred_topics %}
{% endif %}
{% assign pinned_end_filters = include.pinned_end_filters | default: "" | split: "|" %}
{% if include.pinned_end_filters == nil %}
  {% assign pinned_end_filters = site.data.publication_tags.excluded_topics %}
{% endif %}
{% assign enable_pagination = include.enable_pagination %}
{% assign items_per_page = include.items_per_page | default: 5 %}

{% if show_filters and include.filter_labels == nil %}
  {% capture collected_tags %}{% for publication in publications %}{{ publication.tags | default: "" | replace: ", ", "," | replace: " ,", "," | append: "," }}{% endfor %}{% endcapture %}
  {% assign auto_filters = collected_tags | split: "," | uniq %}
  {% capture ordered_auto_filters %}
    {% for preferred_label in preferred_filters %}
      {% assign trimmed_preferred_label = preferred_label | strip %}
      {% unless trimmed_preferred_label == "" or pinned_end_filters contains trimmed_preferred_label %}
        {% if auto_filters contains trimmed_preferred_label %}{{ trimmed_preferred_label }}|{% endif %}
      {% endunless %}
    {% endfor %}
    {% for filter_label in auto_filters %}
      {% assign trimmed_label = filter_label | strip %}
      {% unless trimmed_label == "" or pinned_end_filters contains trimmed_label or preferred_filters contains trimmed_label %}{{ trimmed_label }}|{% endunless %}
    {% endfor %}
    {% for pinned_label in pinned_end_filters %}
      {% if auto_filters contains pinned_label %}{{ pinned_label }}|{% endif %}
    {% endfor %}
  {% endcapture %}
  {% assign auto_filters = ordered_auto_filters | split: "|" %}
{% endif %}

<h2 id="{{ section_id }}" class="section-heading">
  <span class="section-heading-text">
    <i class="fa-solid fa-book" aria-hidden="true"></i>
    {{ section_title }}
  </span>
  <small class="section-heading-meta">
    <span class="section-heading-actions">
    {% if page.url == '/all-publications.html' %}
    <a class="section-heading-link is-home" href="{{ '/#about-me' | relative_url }}">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      <span>Back to Home</span>
    </a>
    {% endif %}
    {% if show_internal_link %}
    <a class="section-heading-link is-primary" href="{{ '/all-publications.html' | relative_url }}">
      <i class="fa-solid fa-books" aria-hidden="true"></i>
      <span>View All Publications</span>
    </a>
    {% endif %}
    {% assign scholar_link = site.social | where: "platform", "Google Scholar" | first %}
    {% if scholar_link %}
    <a class="section-heading-link is-scholar" href="{{ scholar_link.url }}" target="_blank" rel="noopener">
      <i class="ai ai-google-scholar" aria-hidden="true"></i>
      <span>Google Scholar</span>
    </a>
    {% endif %}
    </span>
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

<li class="publication-item hover-panel" data-tags="{{ link.tags | escape }}">
<div class="pub-row">
  <div class="pub-media col-sm-3 abbr">
  {% if link.image %}
  {% if primary_link %}
  <a href="{{ primary_link }}" target="_blank" rel="noopener noreferrer" aria-label="Open publication: {{ link.title }}">
    <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" alt="{{ link.title }}" loading="lazy" decoding="async">
  </a>
  {% else %}
    <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" alt="{{ link.title }}" loading="lazy" decoding="async">
  {% endif %}
  {% if link.conference_short %}
  <abbr class="badge">{{ link.conference_short }}</abbr>
  {% endif %}
  {% endif %}
  </div>
  <div class="pub-content col-sm-9">
      <div class="title publication-title">
        {% if primary_link %}
        <a href="{{ primary_link }}" target="_blank" rel="noopener noreferrer">{{ link.title }}</a>
        {% else %}
        {{ link.title }}
        {% endif %}
      </div>
      <div class="author">
        {{ link.authors }}
        {% if link.year %}
        <span class="publication-year-inline">{{ link.year }}</span>
        {% endif %}
      </div>
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
    <div class="publication-notes">
      <span class="venue-badge"><i class="fa-solid fa-book-open" aria-hidden="true"></i>{{ link.notes }}</span>
    </div>
    {% endif %}
  </div>
</div>
</li>

{% endfor %}

</ol>
{% if enable_pagination %}
<div class="publication-pagination" aria-label="Publication pagination"></div>
{% endif %}
</div>
