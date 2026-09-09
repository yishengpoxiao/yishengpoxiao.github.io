/**
 * Site interaction enhancements:
 *  1. Scroll-spy — highlight the sidebar nav item of the section in view.
 *  2. Copy-email button with visual feedback.
 *  3. Mobile menu — outside-click and Escape to close.
 *  4. Reveal-on-scroll cards (disabled for prefers-reduced-motion).
 */
;(function () {
    'use strict';

    var reduceMotion = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------
     * 1. Scroll-spy navigation
     * --------------------------------------------- */
    function initScrollSpy() {
        var navLinks = Array.prototype.slice.call(
            document.querySelectorAll('#site-nav a')
        );
        if (!navLinks.length) {
            return;
        }

        var isPublicationsPage = /\/all-publications\.html$/.test(window.location.pathname);
        if (isPublicationsPage) {
            navLinks.forEach(function (link) {
                if (link.getAttribute('href') === '#all-publications') {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'true');
                }
            });
            return;
        }

        var sections = [];
        navLinks.forEach(function (link) {
            var hash = link.getAttribute('href') || '';
            if (hash.charAt(0) !== '#') {
                return;
            }
            var target = document.getElementById(hash.slice(1));
            if (target) {
                sections.push({ id: hash.slice(1), el: target, link: link });
            }
        });
        if (!sections.length) {
            return;
        }

        var activeLink = null;
        var spyPausedUntil = 0;

        function setActive(link) {
            if (activeLink === link) {
                return;
            }
            if (activeLink) {
                activeLink.classList.remove('active');
                activeLink.removeAttribute('aria-current');
            }
            activeLink = link;
            if (link) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'true');
            }
        }

        // Clicking a nav item keeps it highlighted while the page scrolls.
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                setActive(link);
                spyPausedUntil = Date.now() + 1200;
            });
        });

        function update() {
            if (Date.now() < spyPausedUntil) {
                return;
            }
            var probe = window.pageYOffset + Math.min(window.innerHeight * 0.38, 360);
            var atBottom =
                window.innerHeight + window.pageYOffset >=
                document.documentElement.scrollHeight - 4;
            var current = sections[0].link;

            if (window.pageYOffset < sections[0].el.getBoundingClientRect().top + window.pageYOffset - 80) {
                current = null;
            } else {
                // Strictly-greater comparison: when two sections share the
                // same top (side-by-side pair), the first in reading order wins.
                var bestTop = -1;
                sections.forEach(function (section) {
                    var top = section.el.getBoundingClientRect().top + window.pageYOffset;
                    if (top <= probe && top > bestTop) {
                        bestTop = top;
                        current = section.link;
                    }
                });
            }
            if (atBottom) {
                current = sections[sections.length - 1].link;
            }
            setActive(current);
        }

        var ticking = false;
        function onScroll() {
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(function () {
                update();
                ticking = false;
            });
            // Background tabs throttle rAF; guarantee the spy still updates.
            window.setTimeout(function () {
                if (ticking) {
                    update();
                    ticking = false;
                }
            }, 200);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        // Safety net: catches programmatic scrolls and any missed events.
        window.setInterval(function () {
            if (!document.hidden) {
                update();
            }
        }, 400);
        update();
    }

    /* ---------------------------------------------
     * 2. Copy email with feedback
     * --------------------------------------------- */
    function initCopyEmail() {
        var button = document.getElementById('copy-email');
        if (!button) {
            return;
        }

        var resetTimer = null;

        function markCopied() {
            button.classList.add('copied');
            button.setAttribute('aria-label', 'Email address copied');
            button.setAttribute('title', 'Copied!');
            var icon = button.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-check';
            }
            if (resetTimer) {
                window.clearTimeout(resetTimer);
            }
            resetTimer = window.setTimeout(function () {
                button.classList.remove('copied');
                button.setAttribute('aria-label', 'Copy email address');
                button.setAttribute('title', 'Copy email address');
                if (icon) {
                    icon.className = 'fa-regular fa-copy';
                }
            }, 1800);
        }

        function legacyCopy(text) {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            var ok = false;
            try {
                ok = document.execCommand('copy');
            } catch (error) {
                ok = false;
            }
            document.body.removeChild(textarea);
            return ok;
        }

        button.addEventListener('click', function () {
            var email = button.getAttribute('data-email') || '';
            if (!email) {
                return;
            }
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(markCopied, function () {
                    if (legacyCopy(email)) {
                        markCopied();
                    }
                });
            } else if (legacyCopy(email)) {
                markCopied();
            }
        });
    }

    /* ---------------------------------------------
     * 3. Mobile menu: outside click + Escape to close
     * --------------------------------------------- */
    function initMobileMenu() {
        var menuBtn = document.getElementById('mobile-menu-btn');
        var header = document.querySelector('header');
        var nav = document.getElementById('site-nav');
        if (!menuBtn || !header || !nav) {
            return;
        }

        function closeMenu() {
            header.classList.remove('nav-open');
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            nav.setAttribute('aria-hidden', 'true');
        }

        function openMenu() {
            header.classList.add('nav-open');
            menuBtn.classList.add('active');
            menuBtn.setAttribute('aria-expanded', 'true');
            nav.setAttribute('aria-hidden', 'false');
        }

        menuBtn.addEventListener('click', function (event) {
            event.stopPropagation();
            if (header.classList.contains('nav-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        nav.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                closeMenu();
            }
        });

        document.addEventListener('click', function (event) {
            if (!header.classList.contains('nav-open')) {
                return;
            }
            if (!header.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && header.classList.contains('nav-open')) {
                closeMenu();
                menuBtn.focus();
            }
        });
    }

    /* ---------------------------------------------
     * 4. Reveal-on-scroll cards
     * Every top-level content card — whether wrapped in a
     * .section-block (homepage) or placed directly in the
     * main column (all-publications page) — gets the same
     * reveal animation.
     * --------------------------------------------- */
    function initReveal() {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            return;
        }

        var cards = Array.prototype.slice.call(document.querySelectorAll(
            '.site-main .section-block > .card, .site-main > .card'
        ));
        if (!cards.length) {
            return;
        }

        cards.forEach(function (card) {
            card.classList.add('js-reveal');
        });

        function finishReveal(card) {
            card.classList.remove('js-reveal', 'in-view');
        }

        function revealCard(card) {
            if (!card.classList.contains('js-reveal') || card.classList.contains('in-view')) {
                return;
            }
            card.classList.add('in-view');
            // Return hover control as soon as the animation ends so
            // freshly revealed cards respond to hover exactly like
            // older ones.
            function onEnd(event) {
                if (event.target !== card) {
                    return;
                }
                card.removeEventListener('animationend', onEnd);
                finishReveal(card);
            }
            card.addEventListener('animationend', onEnd);
            // Safety net for missed animationend events
            // (e.g. backgrounded tabs).
            window.setTimeout(function () {
                finishReveal(card);
            }, 750);
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        revealCard(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
        );

        // Safety net: if the IntersectionObserver callbacks are delayed
        // (background tab, throttled renderer, privacy tools), any card
        // that is actually inside the viewport must never stay hidden.
        function sweepStuckCards() {
            cards.forEach(function (card) {
                if (!card.classList.contains('js-reveal') || card.classList.contains('in-view')) {
                    return;
                }
                var rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    revealCard(card);
                    observer.unobserve(card);
                }
            });
            if (!cards.some(function (card) { return card.classList.contains('js-reveal'); })) {
                window.clearInterval(sweepId);
                document.removeEventListener('visibilitychange', onVisible);
            }
        }

        var sweepId = window.setInterval(sweepStuckCards, 400);
        function onVisible() {
            if (!document.hidden) {
                sweepStuckCards();
            }
        }
        document.addEventListener('visibilitychange', onVisible);

        cards.forEach(function (card) {
            observer.observe(card);
        });
    }

    initScrollSpy();
    initCopyEmail();
    initMobileMenu();
    initReveal();
})();
