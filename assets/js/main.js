/* ===== NAV ===== */
const hamburger = document.querySelector('.nav-hamburger');
hamburger?.addEventListener('click', () => {
  document.body.classList.toggle('nav-menu-open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => document.body.classList.remove('nav-menu-open'));
});

/* ===== SCROLL ANIMATIONS ===== */
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), e.target.dataset.delay || 0);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
fadeEls.forEach(el => observer.observe(el));

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const items = [...document.querySelectorAll('.gallery-item')];
let current = 0;

function openLightbox(index) {
  current = index;
  const img = items[index].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigate(dir) {
  current = (current + dir + items.length) % items.length;
  const img = items[current].querySelector('img');
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.style.opacity = '1';
  }, 150);
}

lightboxImg.style.transition = 'opacity 0.15s ease';

items.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev')?.addEventListener('click', () => navigate(-1));
document.getElementById('lightboxNext')?.addEventListener('click', () => navigate(1));

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

/* ===== QUOTE FORM ===== */
const form = document.getElementById('quoteForm');
const formContent = document.getElementById('formContent');
const formSuccess = document.getElementById('formSuccess');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Build mailto
  const name = form.querySelector('[name=name]').value;
  const email = form.querySelector('[name=email]').value;
  const phone = form.querySelector('[name=phone]').value;
  const type = form.querySelector('[name=type]').value;
  const qty = form.querySelector('[name=qty]').value;
  const desc = form.querySelector('[name=desc]').value;

  const subject = encodeURIComponent(`3D Print Quotation Request – ${name}`);
  const body = encodeURIComponent(
`Hi Aswin,

I'd like to request a quotation for a 3D print.

Name: ${name}
Email: ${email}
Phone: ${phone}
Print Type: ${type}
Quantity: ${qty}

Description:
${desc}

Thanks!`
  );

  setTimeout(() => {
    window.location.href = `mailto:aswin@aswincloud.com?subject=${subject}&body=${body}`;
    formContent.style.display = 'none';
    formSuccess.classList.add('show');
  }, 800);
});

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, end, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const value = Math.floor(progress * end);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = end + suffix;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
