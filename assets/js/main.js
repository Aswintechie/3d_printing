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
// Fine-grained PAT: Actions write only on this repo (see README for setup)
const DISPATCH_TOKEN = 'REPLACE_WITH_DISPATCH_TOKEN';

const form = document.getElementById('quoteForm');
const formContent = document.getElementById('formContent');
const formSuccess = document.getElementById('formSuccess');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending…';
  btn.disabled = true;

  const payload = {
    name:  form.querySelector('[name=name]').value.trim(),
    email: form.querySelector('[name=email]').value.trim(),
    phone: form.querySelector('[name=phone]').value.trim() || 'Not provided',
    type:  form.querySelector('[name=type]').value,
    qty:   form.querySelector('[name=qty]').value,
    desc:  form.querySelector('[name=desc]').value.trim(),
  };

  try {
    const res = await fetch('https://api.github.com/repos/Aswintechie/3d_printing/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DISPATCH_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: 'quote_request', client_payload: payload }),
    });

    if (res.status === 204) {
      formContent.style.display = 'none';
      formSuccess.classList.add('show');
    } else {
      throw new Error(`Status ${res.status}`);
    }
  } catch (err) {
    btn.innerHTML = '⚠️ Failed — try again';
    btn.disabled = false;
    console.error('Dispatch error:', err);
  }
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
