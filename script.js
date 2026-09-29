const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const featuredVideo = document.querySelector('.embedded-reel');
const motionShowcase = document.querySelector('[data-image-trail]');
const motionTitle = document.querySelector('[data-motion-title]');
const curiosity = document.querySelector('[data-curiosity]');
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
  if (motionShowcase && motionTitle && !prefersReducedMotion) {
    const motionRect = motionShowcase.getBoundingClientRect();
    const motionProgress = Math.max(-1, Math.min(1, (window.innerHeight * .5 - (motionRect.top + motionRect.height * .5)) / window.innerHeight));
    const lines = motionTitle.querySelectorAll('span');
    if (lines[0]) lines[0].style.transform = `translate3d(${motionProgress * -34}px,0,0)`;
    if (lines[1]) lines[1].style.transform = `translate3d(${motionProgress * 34}px,0,0)`;
  }
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

if (motionShowcase && window.matchMedia('(pointer:fine)').matches && !prefersReducedMotion) {
  const layer = motionShowcase.querySelector('.trail-layer');
  const images = motionShowcase.dataset.images?.split('|').filter(Boolean) || [];
  let imageIndex = 0;
  let lastX = -200;
  let lastY = -200;

  images.forEach(source => { const preload = new Image(); preload.src = source; });

  motionShowcase.addEventListener('pointermove', event => {
    const bounds = motionShowcase.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    if (Math.hypot(x - lastX, y - lastY) < 76 || !layer || !images.length) return;
    lastX = x;
    lastY = y;

    const frame = document.createElement('figure');
    const image = document.createElement('img');
    frame.className = 'trail-image';
    frame.style.left = `${x}px`;
    frame.style.top = `${y}px`;
    image.src = images[imageIndex % images.length];
    image.alt = '';
    frame.appendChild(image);
    layer.appendChild(frame);
    imageIndex += 1;

    const rotation = imageIndex % 2 ? -5 : 5;
    const animation = frame.animate([
      { opacity: 0, transform: `translate(-50%,-50%) scale(.72) rotate(${rotation * -1}deg)` },
      { opacity: 1, offset: .16, transform: `translate(-50%,-50%) scale(1) rotate(${rotation}deg)` },
      { opacity: 1, offset: .72, transform: `translate(-50%,-58%) scale(1) rotate(${rotation}deg)` },
      { opacity: 0, transform: `translate(-50%,-78%) scale(.92) rotate(${rotation * 1.4}deg)` }
    ], { duration: 1350, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
    animation.addEventListener('finish', () => frame.remove(), { once: true });
  }, { passive: true });

  motionShowcase.addEventListener('pointerleave', () => { lastX = -200; lastY = -200; });
}

if (curiosity && !prefersReducedMotion) {
  const pupils = curiosity.querySelectorAll('.eye-pupil');
  const lookAt = (clientX, clientY) => pupils.forEach(pupil => {
    const eye = pupil.parentElement;
    const bounds = eye.getBoundingClientRect();
    const angle = Math.atan2(clientY - (bounds.top + bounds.height / 2), clientX - (bounds.left + bounds.width / 2));
    const distance = Math.min(bounds.width * .2, Math.hypot(clientX - (bounds.left + bounds.width / 2), clientY - (bounds.top + bounds.height / 2)) * .12);
    pupil.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}px),calc(-50% + ${Math.sin(angle) * distance}px))`;
  });

  curiosity.addEventListener('pointermove', event => lookAt(event.clientX, event.clientY), { passive: true });
  curiosity.addEventListener('pointerdown', event => {
    lookAt(event.clientX, event.clientY);
    curiosity.classList.remove('is-looking');
    requestAnimationFrame(() => curiosity.classList.add('is-looking'));
  });
  curiosity.addEventListener('animationend', () => curiosity.classList.remove('is-looking'));
}

document.addEventListener('visibilitychange', () => { if (document.hidden) featuredVideo?.pause(); });
