/* CHINYOO — Premium interactions
   1. Custom cursor
   2. Smooth scroll
   3. Nav scroll state
   4. Reveal animations
   5. Number counters
   6. FAQ accordion
   7. Magnetic buttons
   8. Parallax on hero product
*/

(function() {
  'use strict';

  /* ---------- 1. Custom Cursor ---------- */
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  let cursorDot, cursorRing, mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  if (isFinePointer) {
    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });
    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();
    // Hover scale
    document.querySelectorAll('a, button, .product-card, .blog-card, .bento-item, .feat, .cert-pill').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  /* ---------- 2. Nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Reveal animations (IntersectionObserver) ---------- */
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => obs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- 4. Number counter animation ---------- */
  const counters = document.querySelectorAll('.counter');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      const decimals = (el.dataset.target.split('.')[1] || '').length;
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = target * eased;
        el.textContent = (decimals ? v.toFixed(decimals) : Math.floor(v).toLocaleString()) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = (decimals ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
      }
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  /* ---------- 5. FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const open = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  /* ---------- 6. Magnetic buttons (subtle) ---------- */
  if (isFinePointer) {
    document.querySelectorAll('.btn-primary, .btn-light, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- 7. Hero product parallax (subtle) ---------- */
  const heroProduct = document.querySelector('.hero-product');
  if (heroProduct && isFinePointer) {
    document.querySelector('.hero').addEventListener('mousemove', e => {
      const r = heroProduct.parentElement.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      heroProduct.style.transform = `translate(${x * 16}px, ${y * 16}px)`;
    });
    document.querySelector('.hero').addEventListener('mouseleave', () => {
      heroProduct.style.transform = '';
    });
  }

  /* ---------- 8. Product filter (products page) ---------- */
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.product-card[data-cat]');
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const f = tab.dataset.filter;
        cards.forEach(c => {
          c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
        });
      });
    });
  }

  /* ---------- 9. Form submit (contact) ---------- */
  const form = document.getElementById('inquiryForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = {
        name: form.name.value, email: form.email.value, company: form.company.value || '',
        phone: form.phone.value || '', product: form.product.value || '',
        message: form.message.value, time: new Date().toISOString()
      };
      const list = JSON.parse(localStorage.getItem('chinyoo_inquiries') || '[]');
      list.push(data);
      localStorage.setItem('chinyoo_inquiries', JSON.stringify(list));
      const s = document.getElementById('formSuccess');
      if (s) { s.style.display = 'block'; setTimeout(() => s.style.display = 'none', 5000); }
      const subject = encodeURIComponent('CHINYOO Inquiry from ' + data.name + (data.company ? ' - ' + data.company : ''));
      const body = encodeURIComponent(`Name: ${data.name}\nCompany: ${data.company}\nEmail: ${data.email}\nPhone: ${data.phone}\nProduct: ${data.product}\n\nMessage:\n${data.message}`);
      window.location.href = 'mailto:sugonvoltage@gmail.com?subject=' + subject + '&body=' + body;
      form.reset();
    });
  }

  /* ---------- 10. Console brand ---------- */
  console.log('%cCHINYOO Electronics', 'font-size:24px;font-weight:800;background:linear-gradient(135deg,#0066ff,#00d4ff);-webkit-background-clip:text;color:transparent;padding:8px 0;');
  console.log('%cPrecision voltage testing instruments. Made in Wenzhou, China. 2008.', 'font-size:12px;color:#666;');
})();
