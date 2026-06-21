document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. NAVBAR SCROLL SHADOW
     ============================================================ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ============================================================
     2. MOBILE MENU
     ============================================================ */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================
     3. ACTIVE NAV LINK
     ============================================================ */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a, #mobileNav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     4. DYNAMIC ADD-ONS
     ============================================================ */
  const addonMap = {
    'mobile-basic':   ['Deep Seat Shampoo (+$40)', 'Pet Hair Removal (+$25)', 'Odour Elimination (+$30)'],
    'premium-detail': ['Ceramic Glass Coat (+$50)', 'Scratch Removal (+$80)', 'Engine Bay Clean (+$60)'],
    'exterior-wash':  ['Clay Bar (+$45)', 'Iron Decontamination (+$25)', 'Tyre Shine (+$15)'],
    'specialised':    null
  };

  const serviceTypeEl = document.getElementById('serviceType');
  const addonsEl = document.getElementById('addons');

  if (serviceTypeEl && addonsEl) {
    serviceTypeEl.addEventListener('change', () => {
      const val = serviceTypeEl.value;
      addonsEl.innerHTML = '';

      if (!val) {
        addonsEl.disabled = true;
        addonsEl.innerHTML = '<option value="">Select a service first</option>';
        return;
      }

      if (val === 'specialised') {
        addonsEl.disabled = true;
        addonsEl.innerHTML = '<option value="">Contact us for a custom quote</option>';
        return;
      }

      const opts = addonMap[val];
      if (opts) {
        addonsEl.disabled = false;
        addonsEl.innerHTML = '<option value="">Select an add-on (optional)</option>';
        opts.forEach(o => {
          const el = document.createElement('option');
          el.value = o.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          el.textContent = o;
          addonsEl.appendChild(el);
        });
      }
    });
  }

  /* ============================================================
     5. DATE PICKER MIN = TODAY
     ============================================================ */
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  /* ============================================================
     6. FORM VALIDATION + SUCCESS STATE
     ============================================================ */
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const required = [
        'firstName','lastName','email','phone','city','address',
        'vehicleMake','vehicleModel','serviceType',
        'preferredDate','preferredTime','serviceMethod'
      ];
      let valid = true;
      required.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (!el.value.trim()) {
          el.style.borderColor = 'var(--color-error)';
          valid = false;
        } else {
          el.style.borderColor = '';
        }
      });

      if (valid) {
        const formWrapper = document.getElementById('formWrapper');
        const formSuccess = document.getElementById('formSuccess');
        if (formWrapper) formWrapper.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
        const card = document.querySelector('.booking-card');
        if (card) window.scrollTo({ top: card.offsetTop - 100, behavior: 'smooth' });
      }
    });
  }

  /* ============================================================
     7. COUNTER ANIMATION
     ============================================================ */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const animateCounter = el => {
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const start = performance.now();
      const update = now => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(easeOut(progress) * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
  }

  /* ============================================================
     8. AOS INIT
     ============================================================ */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: 'mobile'
    });
  }

});