<h2 id="awards"><i class="fa-solid fa-trophy" aria-hidden="true"></i><span>Awards</span></h2>

<div class="awards">
  {% if site.data.awards.main and site.data.awards.main.size > 0 %}
  <ol class="award-list">
    {% for item in site.data.awards.main %}
    <li class="award-item hover-panel">
      <div class="award-date">{{ item.date }}</div>
      <div class="award-body">
        <div class="award-title">{{ item.title }}</div>
        {% if item.issuer %}
        <div class="award-issuer">{{ item.issuer }}</div>
        {% endif %}
        {% if item.note %}
        <div class="award-note">{{ item.note }}</div>
        {% endif %}
      </div>
    </li>
    {% endfor %}
  </ol>
  {% else %}
  <p class="award-empty">Add items in <code>_data/awards.yml</code> to show awards here.</p>
  {% endif %}
</div>
