// ============ DOM Ready ============
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initGalleryLightbox();
  initQuotesSlider();
  initContactForm();
});

// ============ Mobile Menu ============
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ============ Smooth Scroll ============
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}

// ============ Scroll Animations ============
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.about__text, .about__icon, .card, .gallery__item, .contact__form-wrap, .contact__info'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach((el, i) => {
    el.classList.add('animate-on-scroll');
    el.style.animationDelay = `${i * 0.1}s`;
    observer.observe(el);
  });
}

// ============ Gallery Lightbox ============
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const galleryItems = document.querySelectorAll('.gallery__item img');

  if (!lightbox || !lightboxImg || !closeBtn) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  galleryItems.forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
    img.style.cursor = 'zoom-in';
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
}

// ============ Quotes Slider ============
function initQuotesSlider() {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.slider__btn--prev');
  const nextBtn = document.querySelector('.slider__btn--next');
  if (slides.length === 0 || !prevBtn || !nextBtn) return;

  let current = 0;
  let autoSlideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    current = index;
  }

  function nextSlide() { showSlide((current + 1) % slides.length); }
  function prevSlide() { showSlide((current - 1 + slides.length) % slides.length); }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() { clearInterval(autoSlideInterval); }

  prevBtn.addEventListener('click', () => { prevSlide(); stopAutoSlide(); startAutoSlide(); });
  nextBtn.addEventListener('click', () => { nextSlide(); stopAutoSlide(); startAutoSlide(); });

  const slider = document.querySelector('.slider');
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  // Touch swipe
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
      stopAutoSlide(); startAutoSlide();
    }
  });

  startAutoSlide();
}

// ============ Contact Form ============
function initContactForm() {
  const form = document.querySelector('.contact__form');
  const msgEl = document.getElementById('formMsg');
  if (!form || !msgEl) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    msgEl.textContent = '';
    msgEl.className = 'form__msg';

    const data = new FormData(form);
    const name = data.get(form.querySelector('input[type="text"]').name) || '';
    const email = data.get(form.querySelector('input[type="email"]').name) || '';
    const message = data.get(form.querySelector('textarea').name) || '';

    if (!name.trim() || !email.trim() || !message.trim()) {
      showMsg('Пожалуйста, заполните все поля', true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg('Введите корректный email', true);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    // Имитация отправки (замените на реальный endpoint)
    await new Promise(r => setTimeout(r, 1200));

    // Вставьте сюда fetch к вашему бэкенду:
    // const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, message }) });

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    form.reset();
    showMsg('Сообщение отправлено! Мы свяжемся с вами скоро.', false);
  });

  function showMsg(text, isError) {
    msgEl.textContent = text;
    msgEl.classList.add(isError ? 'error' : 'success');
  }
}

// ============ Header Scroll Effect ============
(function() {
  const header = document.querySelector('.header');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    lastScroll = currentScroll;
  }, { passive: true });
})();