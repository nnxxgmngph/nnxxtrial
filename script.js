// Set the address that contact-form messages are sent to.
const CONTACT_EMAIL = 'your-email@example.com';

const header = document.querySelector('.header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
}
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Mark the nav link for the section in view
const navLinks = [...document.querySelectorAll('.nav-links a')];
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => {
            if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
        });
    });
}, { rootMargin: '-45% 0px -50% 0px' });
['about', 'experience', 'skills', 'projects', 'contact'].forEach(id => observer.observe(document.getElementById(id)));

// Fiber-line timeline: fills as you scroll, lighting each stop it passes
const timeline = document.querySelector('.timeline');
const spine = timeline.querySelector('.spine');
const entries = [...timeline.querySelectorAll('.entry')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let ticking = false;

function updateTimeline() {
    ticking = false;
    if (reduceMotion.matches) {
        timeline.style.setProperty('--p', '100%');
        entries.forEach(el => el.classList.add('lit'));
        return;
    }
    const s = spine.getBoundingClientRect();
    const travelled = Math.min(Math.max(window.innerHeight * 0.6 - s.top, 0), s.height);
    timeline.style.setProperty('--p', (travelled / s.height * 100) + '%');
    entries.forEach(el => {
        const n = el.querySelector('.node').getBoundingClientRect();
        el.classList.toggle('lit', travelled >= n.top + n.height / 2 - s.top - 1);
    });
}
function requestUpdate() {
    if (!ticking) { ticking = true; requestAnimationFrame(updateTimeline); }
}
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
updateTimeline();

// Contact form: opens the visitor's email app with the message filled in
const form = document.querySelector('#contact-form');
const status = form.querySelector('.status');
form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const subject = 'Portfolio message from ' + d.get('name');
    const body = d.get('message') + '\n\n' + d.get('name') + ' (' + d.get('email') + ')';
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Opening your email app...';
});

document.getElementById('year').textContent = new Date().getFullYear();
