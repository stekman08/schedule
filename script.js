/**
 * MSB Schedule - Interactive Features
 * Navigation, filtering, and scroll tracking
 */

document.addEventListener('DOMContentLoaded', () => {
    initGroupFilter();
    initDayNavigation();
    initScrollTracking();
});

/**
 * Group Filter Functionality
 */
function initGroupFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lessonCards = document.querySelectorAll('.lesson-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            lessonCards.forEach(card => {
                const cardGroup = card.dataset.group;
                if (filter === 'all' || cardGroup === 'all' || cardGroup === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/**
 * Day Navigation - smooth scroll
 */
function initDayNavigation() {
    const dayLinks = document.querySelectorAll('.day-link');

    dayLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Scroll Tracking - throttled for performance
 */
function initScrollTracking() {
    const daySections = document.querySelectorAll('.day-section');
    const dayLinks = document.querySelectorAll('.day-link');
    let ticking = false;

    function updateActiveLink() {
        const scrollPos = window.scrollY + 250;

        let currentSection = null;
        daySections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentSection = section;
            }
        });

        if (currentSection) {
            const sectionId = currentSection.id;
            dayLinks.forEach(link => {
                const linkTarget = link.getAttribute('href').slice(1);
                link.classList.toggle('active', linkTarget === sectionId);
            });
        }
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Set initial state
    if (dayLinks.length > 0) {
        dayLinks[0].classList.add('active');
    }
}
