document.addEventListener('DOMContentLoaded', function() {
    var feedbackButton = document.getElementById('feedback-button');
    var feedbackModal = document.getElementById('feedback-modal');
    var feedbackForm = document.getElementById('feedback-form');

    if (!feedbackButton || !feedbackModal || !feedbackForm) {
        return;
    }

    var closeButton = feedbackModal.querySelector('[data-feedback-close]');
    var status = document.getElementById('feedback-status');
    var submitButton = feedbackForm.querySelector('.feedback-form__submit');
    var firstField = document.getElementById('feedback-name') || document.getElementById('feedback-message');
    var lastFocusedElement = null;
    var defaultSubmitLabel = submitButton ? submitButton.textContent : 'Send Feedback';

    function setStatus(message, state) {
        if (!status) {
            return;
        }

        status.textContent = message;
        status.className = 'feedback-form__status';

        if (state) {
            status.classList.add(state);
        }
    }

    function openModal() {
        lastFocusedElement = document.activeElement;
        feedbackModal.classList.add('is-open');
        feedbackModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('feedback-modal-open');

        window.setTimeout(function() {
            if (firstField) {
                firstField.focus();
            }
        }, 20);
    }

    function closeModal() {
        feedbackModal.classList.remove('is-open');
        feedbackModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('feedback-modal-open');
        setStatus('', '');

        if (submitButton) {
            submitButton.textContent = defaultSubmitLabel;
            submitButton.disabled = false;
        }

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    feedbackButton.addEventListener('click', function() {
        openModal();
    });

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeModal();
        });
    }

    feedbackModal.addEventListener('click', function(event) {
        if (event.target === feedbackModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && feedbackModal.classList.contains('is-open')) {
            closeModal();
        }
    });

    feedbackForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        if (!submitButton) {
            return;
        }

        var formData = new FormData(feedbackForm);
        var endpoint = feedbackForm.dataset.endpoint;

        formData.set('_url', window.location.href);

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        setStatus('Sending your feedback...', 'is-pending');

        try {
            var response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            });

            var result = {};

            try {
                result = await response.json();
            } catch (error) {
                result = {};
            }

            if (!response.ok || result.success === false) {
                throw new Error(result.message || 'Request failed');
            }

            feedbackForm.reset();
            setStatus('Thanks! Your feedback has been sent.', 'is-success');
            submitButton.textContent = 'Sent';

            window.setTimeout(function() {
                closeModal();
            }, 1200);
        } catch (error) {
            submitButton.disabled = false;
            submitButton.textContent = defaultSubmitLabel;
            setStatus('Sending failed. Please try again later.', 'is-error');
        }
    });
});
