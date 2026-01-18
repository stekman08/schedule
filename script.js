/**
 * MSB Schedule - Interactive Features
 * Navigation, filtering, and scroll tracking
 */

document.addEventListener('DOMContentLoaded', () => {
    initGroupFilter();
    initDayNavigation();
    initScrollTracking();
    initTodayHighlight();
});

/**
 * Group Filter Functionality
 */
function initGroupFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lessonCards = document.querySelectorAll('.lesson-card');

    // Apply filter to all cards
    function applyFilter(filter) {
        lessonCards.forEach(card => {
            const cardGroup = card.dataset.group;
            if (filter === 'all' || cardGroup === 'all' || cardGroup === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Find the day header closest to top of viewport
    function getVisibleDayHeader() {
        const dayHeaders = document.querySelectorAll('.day-section .day-header');
        let bestElement = null;
        let bestDistance = Infinity;
        
        dayHeaders.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top >= -100 && rect.top < 300) {
                const distance = Math.abs(rect.top);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestElement = el;
                }
            }
        });
        
        return bestElement;
    }

    // Load saved filter on page load
    const savedFilter = localStorage.getItem('selectedGroup');
    if (savedFilter) {
        const savedButton = document.querySelector(`.filter-btn[data-filter="${savedFilter}"]`);
        if (savedButton) {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            savedButton.classList.add('active');
            applyFilter(savedFilter);
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Remember visible day header and its position before filter change
            const visibleHeader = getVisibleDayHeader();
            const offsetBefore = visibleHeader ? visibleHeader.getBoundingClientRect().top : 0;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            applyFilter(filter);

            // Save filter choice to localStorage
            localStorage.setItem('selectedGroup', filter);

            // Restore scroll position to keep same day header at same visual position
            if (visibleHeader) {
                const offsetAfter = visibleHeader.getBoundingClientRect().top;
                window.scrollBy(0, offsetAfter - offsetBefore);
            }
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

/**
 * Today Highlight
 * Marks today's date in navigation and section
 */
function initTodayHighlight() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); // 0-indexed, January = 0
    const year = today.getFullYear();

    // Schedule runs January 12-21, 2026
    if (year !== 2026 || month !== 0 || day < 12 || day > 21) {
        return; // Outside schedule range
    }

    // Highlight nav link
    const navLink = document.querySelector(`.day-link[href="#day-${day}"]`);
    if (navLink) {
        navLink.classList.add('today');
        
        // Center today's date in the day navigation scroll
        const navScroll = document.querySelector('.day-nav-scroll');
        if (navScroll) {
            // Calculate scroll position to center the today link
            const navScrollRect = navScroll.getBoundingClientRect();
            const linkRect = navLink.getBoundingClientRect();
            const scrollCenter = navScroll.scrollLeft + (linkRect.left - navScrollRect.left) - (navScrollRect.width / 2) + (linkRect.width / 2);
            
            // Ensure we don't scroll past the beginning
            navScroll.scrollLeft = Math.max(0, scrollCenter);
        }
    }

    // Highlight day section
    const daySection = document.getElementById(`day-${day}`);
    if (daySection) {
        daySection.classList.add('today');
        // Scroll to today on load
        setTimeout(() => {
            daySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
}
