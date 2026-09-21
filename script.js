const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const featuredVideo = document.querySelector('.embedded-reel');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setMenu = open => {
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu?.setAttribute('aria-hidden', String(!open));
  mobileMenu?.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
};

menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -45px' });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

featuredVideo?.addEventListener('dblclick', event => {
  event.preventDefault();
  featuredVideo.pause();
  window.open('https://www.instagram.com/reel/DddnEM4otMH/', '_blank', 'noopener');
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

const process = document.querySelector('[data-process]');
const updateScrollEffects = () => {
  header?.classList.toggle('scrolled', window.scrollY > 30);
  if (!process) return;
  const rect = process.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (rect.height + window.innerHeight * .35)));
  const bar = process.querySelector('.process-progress');
  if (bar) {
    if (window.innerWidth <= 760) { bar.style.height = `${progress * 100}%`; bar.style.width = '2px'; }
    else { bar.style.width = `${progress * 100}%`; bar.style.height = '2px'; }
  }
};
updateScrollEffects();
window.addEventListener('scroll', updateScrollEffects, { passive: true });
window.addEventListener('resize', updateScrollEffects);

const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches && !prefersReducedMotion) {
  window.addEventListener('mousemove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.style.opacity = '1';
  }, { passive: true });
}

document.addEventListener('visibilitychange', () => { if (document.hidden) featuredVideo?.pause(); });
