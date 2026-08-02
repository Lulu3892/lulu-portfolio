const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const printedRole = document.querySelector('.printed-role');
if (printedRole) {
  printedRole.style.setProperty('--printed-width', `${printedRole.scrollWidth}px`);
}

const projectNavLinks = [...document.querySelectorAll('.filters a')];
projectNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    projectNavLinks.forEach((item) => item.classList.toggle('active', item === link));
  });
});

document.querySelectorAll('.project-visual').forEach((visual) => {
  visual.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    visual.style.setProperty('--tilt-x', `${-y * 2.5}deg`);
    visual.style.setProperty('--tilt-y', `${x * 2.5}deg`);
  });
  visual.addEventListener('pointerleave', () => {
    visual.style.setProperty('--tilt-x', '0deg');
    visual.style.setProperty('--tilt-y', '0deg');
  });
});

document.querySelectorAll('.pet-carousel').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = [...carousel.querySelectorAll('.carousel-dots button')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === current));
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === current));
  }

  function startAutoplay() {
    clearInterval(timer);
    if (!reducedMotion) timer = setInterval(() => showSlide(current + 1), 4200);
  }

  function restartAutoplay() {
    clearInterval(timer);
    startAutoplay();
  }

  carousel.querySelector('.carousel-prev').addEventListener('click', () => {
    showSlide(current - 1);
    restartAutoplay();
  });
  carousel.querySelector('.carousel-next').addEventListener('click', () => {
    showSlide(current + 1);
    restartAutoplay();
  });
  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showSlide(index);
    restartAutoplay();
  }));
  carousel.addEventListener('pointerenter', () => clearInterval(timer));
  carousel.addEventListener('pointerleave', startAutoplay);
  carousel.addEventListener('focusin', () => clearInterval(timer));
  carousel.addEventListener('focusout', startAutoplay);
  startAutoplay();
});

document.querySelectorAll('.tarot-card').forEach((card) => {
  const dialog = document.querySelector(`#${card.dataset.extra}`);
  card.addEventListener('click', () => dialog.showModal());
});

document.querySelectorAll('.extra-dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  });
});
