const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
}));

const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: .08 });
document.querySelectorAll('.project-card,.case-study,.capability-grid').forEach(el => reveal.observe(el));
