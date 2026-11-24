(function () {
  let currentLang = localStorage.getItem('portfolio_lang') || 'id';

  function getTranslation(key) {
    const dict = window.portfolioTranslations || {};
    return (dict[currentLang] && dict[currentLang][key]) || '';
  }

  // =========================================================================
  // 1. Language Switcher (i18n)
  // =========================================================================
  window.setPortfolioLanguage = function (lang) {
    currentLang = lang === 'en' ? 'en' : 'id';
    localStorage.setItem('portfolio_lang', currentLang);

    const btnId = document.getElementById('btn-lang-id');
    const btnEn = document.getElementById('btn-lang-en');

    const activeClass =
      'px-2.5 py-1 rounded-lg transition-all duration-200 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold';
    const inactiveClass =
      'px-2.5 py-1 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium';

    if (btnId && btnEn) {
      btnId.className = currentLang === 'id' ? activeClass : inactiveClass;
      btnEn.className = currentLang === 'en' ? activeClass : inactiveClass;
    }

    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const translated = getTranslation(key);
      if (translated) {
        el.innerHTML = translated;
      }
    });

    updateThemeToggleA11y();
    renderCertCards();
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      const label = getTranslation('back_to_top');
      if (label) backToTopBtn.setAttribute('aria-label', label);
    }
  };

  // =========================================================================
  // 2. Dual Theme (Light / Dark Mode)
  // =========================================================================
  function updateThemeToggleA11y() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const isDark = document.documentElement.classList.contains('dark');
    const label = isDark
      ? getTranslation('theme_to_light') || 'Switch to Light Mode'
      : getTranslation('theme_to_dark') || 'Switch to Dark Mode';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }

  window.togglePortfolioTheme = function () {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('portfolio_theme', isDark ? 'dark' : 'light');
    updateThemeToggleA11y();
    renderCertCards();
  };

  // =========================================================================
  // 3. Project Category Filter
  // =========================================================================
  function initProjectFilters() {
    const buttons = Array.from(document.querySelectorAll('.filter-pill'));
    const cards = Array.from(document.querySelectorAll('.project-card-item'));
    if (buttons.length === 0 || cards.length === 0) return;

    const activeBtnClass =
      'filter-pill inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm';
    const inactiveBtnClass =
      'filter-pill inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

    const activeCountClass =
      'filter-count px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-white/20 text-white';
    const inactiveCountClass =
      'filter-count px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300';

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-filter') || 'all';

        buttons.forEach((b) => {
          const isTarget = b === btn;
          b.className = isTarget ? activeBtnClass : inactiveBtnClass;
          const badge = b.querySelector('.filter-count');
          if (badge) {
            badge.className = isTarget ? activeCountClass : inactiveCountClass;
          }
        });

        cards.forEach((card) => {
          if (category === 'all') {
            card.style.display = 'flex';
          } else {
            const cats = card.getAttribute('data-categories') || '';
            card.style.display = cats.includes(category) ? 'flex' : 'none';
          }
        });
      });
    });
  }

  // =========================================================================
  // 3b. Certificate Category Filter & Show-More Toggle
  // =========================================================================
  let activeCertFilter = 'all';
  let showAllCerts = false;

  function renderCertCards() {
    const cards = Array.from(document.querySelectorAll('.cert-card-item'));
    const toggleBtn = document.getElementById('cert-toggle-btn');
    if (cards.length === 0) return;

    let visibleCount = 0;
    cards.forEach((card) => {
      const cat = card.getAttribute('data-cert-category') || '';
      const matches = activeCertFilter === 'all' || cat === activeCertFilter;
      if (!matches) {
        card.style.display = 'none';
        return;
      }
      if (activeCertFilter === 'all' && !showAllCerts && visibleCount >= 6) {
        card.style.display = 'none';
      } else {
        card.style.display = 'flex';
      }
      visibleCount++;
    });

    if (toggleBtn) {
      if (activeCertFilter === 'all' && cards.length > 6) {
        toggleBtn.style.display = 'inline-flex';
        const key = showAllCerts ? 'cert_show_less' : 'cert_show_all';
        const label = getTranslation(key);
        if (label) toggleBtn.textContent = label;
      } else {
        toggleBtn.style.display = 'none';
      }
    }
  }

  function initCertFilters() {
    const buttons = Array.from(document.querySelectorAll('.cert-filter-pill'));
    const toggleBtn = document.getElementById('cert-toggle-btn');
    if (buttons.length === 0) return;

    const activeBtnClass =
      'cert-filter-pill inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm whitespace-nowrap';
    const inactiveBtnClass =
      'cert-filter-pill inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700 whitespace-nowrap';

    const activeCountClass =
      'cert-filter-count px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-white/20 text-white';
    const inactiveCountClass =
      'cert-filter-count px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300';

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCertFilter = btn.getAttribute('data-cert-filter') || 'all';
        buttons.forEach((b) => {
          const isTarget = b === btn;
          b.className = isTarget ? activeBtnClass : inactiveBtnClass;
          const badge = b.querySelector('.cert-filter-count');
          if (badge) badge.className = isTarget ? activeCountClass : inactiveCountClass;
        });
        renderCertCards();
      });
    });

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        showAllCerts = !showAllCerts;
        renderCertCards();
      });
    }

    renderCertCards();
  }

  // =========================================================================
  // 4. Mobile Navigation Drawer
  // =========================================================================
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');
    if (!toggleBtn || !mobileMenu) return;

    function setMenuOpen(open) {
      mobileMenu.classList.toggle('hidden', !open);
      toggleBtn.setAttribute('aria-expanded', String(open));
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle('hidden', open);
        iconClose.classList.toggle('hidden', !open);
      }
    }

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isExpanded);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggleBtn.focus();
      }
    });
  }

  // =========================================================================
  // 5. Lightbox / Modal Preview Foto
  // =========================================================================
  function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalTag = document.getElementById('lightbox-tag');
    const modalCaption = document.getElementById('lightbox-caption');
    const modalCounter = document.getElementById('lightbox-counter');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    const cards = Array.from(document.querySelectorAll('.gallery-card'));
    if (!modal || !modalImg || cards.length === 0) return;

    let activeIndex = 0;
    let lastTriggerEl = null;

    function renderSlide(index) {
      activeIndex = (index + cards.length) % cards.length;
      const card = cards[activeIndex];
      const img = card.querySelector('img');
      const tag = card.querySelector('.gallery-tag');
      const caption = card.querySelector('.gallery-caption');

      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || '';
      }
      if (modalTag) modalTag.textContent = tag ? tag.textContent.trim() : '';
      if (modalCaption) modalCaption.textContent = caption ? caption.textContent.trim() : '';
      if (modalCounter) modalCounter.textContent = `${activeIndex + 1} / ${cards.length}`;
    }

    function openModal(index, triggerEl) {
      lastTriggerEl = triggerEl || document.activeElement;
      renderSlide(index);
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      if (lastTriggerEl && typeof lastTriggerEl.focus === 'function') {
        lastTriggerEl.focus();
      }
    }

    cards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('click', () => openModal(index, card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(index, card);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', () => renderSlide(activeIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => renderSlide(activeIndex + 1));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (modal.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') renderSlide(activeIndex - 1);
      if (e.key === 'ArrowRight') renderSlide(activeIndex + 1);
    });
  }

  // =========================================================================
  // 6. Copy-to-Clipboard + Toast Notification
  // =========================================================================
  let toastTimer = null;

  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('toast-visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('toast-visible');
    }, 2400);
  }

  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const value = btn.getAttribute('data-copy');
        if (!value) return;

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(value);
          } else {
            const temp = document.createElement('textarea');
            temp.value = value;
            temp.setAttribute('readonly', '');
            temp.style.position = 'absolute';
            temp.style.left = '-9999px';
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
          }
          const msg = getTranslation('toast_copied') || 'Copied!';
          showToast(`${msg} (${value})`);
        } catch (err) {
          console.error('Copy failed:', err);
        }
      });
    });
  }

  // =========================================================================
  // 7. Scroll Progress, Active Nav Highlight, Reveal & Back-to-Top
  // =========================================================================
  function initScrollFeatures() {
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const percent = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

      if (progressBar) {
        progressBar.style.width = `${percent}%`;
      }

      if (backToTopBtn) {
        const showTop = scrollTop > 400;
        backToTopBtn.classList.toggle('opacity-0', !showTop);
        backToTopBtn.classList.toggle('pointer-events-none', !showTop);
        backToTopBtn.classList.toggle('translate-y-3', !showTop);
      }

      let currentId = '';
      const offset = 150;
      for (const sec of sections) {
        if (scrollTop >= sec.offsetTop - offset) {
          currentId = sec.id;
        }
      }
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${currentId}`);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }

  // =========================================================================
  // Boot
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const copyrightYearEl = document.getElementById('copyright-year');
    if (copyrightYearEl) {
      copyrightYearEl.textContent = String(new Date().getFullYear());
    }
    window.setPortfolioLanguage(currentLang);
    updateThemeToggleA11y();
    renderCertCards();
    initProjectFilters();
    initCertFilters();
    initMobileMenu();
    initLightbox();
    initCopyButtons();
    initScrollFeatures();
  });
})();
