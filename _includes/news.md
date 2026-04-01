<div class="news-ticker-container">
    <ul class="news-ticker">
        {% for item in site.data.news %}
        <li>
            <strong>[{{ item.date }}]</strong>
            {% if item.url %}
            <a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">{{ item.content }}</a>
            {% else %}
            {{ item.content }}
            {% endif %}
        </li>
        {% endfor %}
    </ul>
</div>
