<div class="news-ticker-container">
    <ul class="news-ticker">
        {% for item in site.data.news %}
        <li class="news-item hover-panel">
            <div class="news-item-main">
                <strong>[{{ item.date }}]</strong>
                <span class="news-item-text">{{ item.content }}</span>
            </div>
            {% if item.url %}
            <a class="news-item-link" href="{{ item.url }}" target="_blank" rel="noopener noreferrer">Read more</a>
            {% endif %}
        </li>
        {% endfor %}
    </ul>
</div>
