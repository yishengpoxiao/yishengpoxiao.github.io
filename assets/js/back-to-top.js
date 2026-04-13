document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('back-to-top');
    var floatingButtons = document.querySelectorAll('.floating-action-button');

    if (!btn) {
        return;
    }

    function updateVisibility() {
        if (window.pageYOffset > 300) {
            floatingButtons.forEach(function(button) {
                button.classList.add('show');
            });
        } else {
            floatingButtons.forEach(function(button) {
                button.classList.remove('show');
            });
        }
    }

    window.addEventListener('scroll', updateVisibility);
    updateVisibility();

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
