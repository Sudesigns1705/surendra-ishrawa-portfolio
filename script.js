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

const localVideos = [...document.querySelectorAll('video')];
localVideos.forEach(video => video.addEventListener('play', () => {
  localVideos.forEach(other => { if (other !== video) other.pause(); });
}));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) localVideos.forEach(video => video.pause());
});
const videoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); });
}, { threshold: .2 });
localVideos.forEach(video => videoObserver.observe(video));
