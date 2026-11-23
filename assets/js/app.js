/* ==========================================================================
   WAP Touch — Логика интерфейса визитки
   ========================================================================== */

(() => {
  'use strict';

  const PROFILE = {
    fullName: 'Алексей Морозов',
    lastName: 'Морозов',
    firstName: 'Алексей',
    role: 'Web & Mobile Touch Разработчик',
    org: 'Morozov Digital',
    phone: '+7 (999) 123-45-67',
    phoneRaw: '+79991234567',
    email: 'hello@morozov.dev',
    telegram: '@morozov_dev',
    city: 'Москва / Remote',
    website: window.location.href
  };

  const PROJECTS = {
    fintech: {
      title: 'PayLite Touch',
      category: 'WAP / Mobile FinTech',
      year: '2026',
      stack: ['HTML5', 'Bootstrap 5', 'Vanilla JS', 'PWA'],
      metrics: 'Загрузка 0.4 сек · Вес страницы 42 КБ',
      description:
        'Сверхлёгкий мобильный платёжный интерфейс под сенсорные экраны и слабый мобильный интернет. Оптимизирован под управление одной рукой и мгновенный отклик без тяжёлых фреймворков.'
    },
    travel: {
      title: 'GoTrip Express',
      category: 'Мобильный портал билетов',
      year: '2025',
      stack: ['Bootstrap 5.3', 'REST API', 'Touch UI'],
      metrics: 'Конверсия в бронь +34% на смартфонах',
      description:
        'Компактный touch-сервис поиска и бронирования маршрутов. Крупные сенсорные карточки, быстрые фильтры и тёмная тема для ночных поездок.'
    },
    brand: {
      title: 'Studio K — Mini Card',
      category: 'Интерактивная визитка + vCard',
      year: '2025',
      stack: ['Bootstrap Icons', 'SVG', 'vCard 3.0'],
      metrics: '99/100 Google PageSpeed Mobile',
      description:
        'Цифровая визитка для креативного агентства с QR-доступом, сохранением контакта в телефон за 1 касание и мгновенным переходом в мессенджеры.'
    }
  };

  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const widthBtn = document.getElementById('widthToggleBtn');
  const widthIcon = document.getElementById('widthIcon');
  const wapShell = document.getElementById('wapShell');
  const toastEl = document.getElementById('wapToast');
  const toastBody = document.getElementById('wapToastBody');
  const liveClockEl = document.getElementById('wapClock');

  const bsToast = toastEl ? new bootstrap.Toast(toastEl, { delay: 2600 }) : null;

  function showToast(message) {
    if (!bsToast || !toastBody) return;
    toastBody.textContent = message;
    bsToast.show();
  }

  /* 1. Тема оформления (Light / Dark) */
  function applyTheme(theme) {
    htmlEl.setAttribute('data-bs-theme', theme);
    localStorage.setItem('wap_theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
  }

  const savedTheme = localStorage.getItem('wap_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-bs-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      showToast(next === 'dark' ? 'Включена тёмная тема' : 'Включена светлая тема');
    });
  }

  /* 2. Переключатель ширины оболочки (WAP Touch / Wide) на десктопе */
  if (widthBtn && wapShell) {
    widthBtn.addEventListener('click', () => {
      const isWide = wapShell.classList.toggle('wap-shell-wide');
      if (widthIcon) {
        widthIcon.className = isWide ? 'bi bi-phone' : 'bi bi-arrows-angle-expand';
      }
      showToast(isWide ? 'Широкий режим просмотра' : 'Режим WAP Touch (440px)');
    });
  }

  /* 3. Живые часы в статусной строке */
  function updateClock() {
    if (!liveClockEl) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    liveClockEl.textContent = `${hh}:${mm}`;
  }
  updateClock();
  setInterval(updateClock, 15000);

  /* 4. Переключение вкладок из любых кнопок и меню */
  function switchToTab(tabTargetSelector) {
    const trigger = document.querySelector(`[data-bs-target="${tabTargetSelector}"]`);
    if (!trigger) return;
    const tab = bootstrap.Tab.getOrCreateInstance(trigger);
    tab.show();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-wap-tab]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-wap-tab');
      if (target) switchToTab(target);
    });
  });

  // Скролл вверх при клике на нижнюю панель
  document.querySelectorAll('.wap-dock-btn').forEach((btn) => {
    btn.addEventListener('shown.bs.tab', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* 5. Копирование контактов в буфер обмена */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-copy-label') || 'Скопировано';
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        showToast(`${label}: ${text}`);
      } catch {
        const temp = document.createElement('input');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`${label}: ${text}`);
      }
    });
  });

  /* 6. Кнопка «Поделиться» */
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: `${PROFILE.fullName} — ${PROFILE.role}`,
        text: 'Сохраняй контакты и заглядывай в портфолио:',
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch {
          // Пользователь отменил — переходим к копированию ссылки
        }
      }
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Ссылка на визитку скопирована');
      } catch {
        showToast('Скопируйте адрес из строки браузера');
      }
    });
  }

  /* 7. Генерация и скачивание vCard (.vcf) */
  const vcardBtn = document.getElementById('downloadVcardBtn');
  if (vcardBtn) {
    vcardBtn.addEventListener('click', () => {
      const vcf = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${PROFILE.lastName};${PROFILE.firstName};;;`,
        `FN:${PROFILE.fullName}`,
        `ORG:${PROFILE.org}`,
        `TITLE:${PROFILE.role}`,
        `TEL;TYPE=CELL,VOICE:${PROFILE.phoneRaw}`,
        `EMAIL;TYPE=INTERNET:${PROFILE.email}`,
        `URL:${PROFILE.website}`,
        `NOTE:Telegram ${PROFILE.telegram} | ${PROFILE.city}`,
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'alexey-morozov.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Контакт .vcf загружен');
    });
  }

  /* 8. Выбор услуги -> переход к форме с подстановкой */
  const serviceSelect = document.getElementById('contactService');
  document.querySelectorAll('[data-select-service]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-select-service');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
      switchToTab('#tab-contact');
      showToast(`Выбрано: ${serviceName}`);
    });
  });

  /* 9. Модальное окно деталей проекта */
  const projectModalEl = document.getElementById('projectModal');
  if (projectModalEl) {
    projectModalEl.addEventListener('show.bs.modal', (event) => {
      const trigger = event.relatedTarget;
      const key = trigger ? trigger.getAttribute('data-project-key') : null;
      const data = key && PROJECTS[key] ? PROJECTS[key] : null;
      if (!data) return;

      document.getElementById('projectModalTitle').textContent = data.title;
      document.getElementById('projectModalMeta').textContent = `${data.category} · ${data.year}`;
      document.getElementById('projectModalMetrics').textContent = data.metrics;
      document.getElementById('projectModalDesc').textContent = data.description;

      const stackWrap = document.getElementById('projectModalStack');
      stackWrap.innerHTML = '';
      data.stack.forEach((item) => {
        const badge = document.createElement('span');
        badge.className = 'wap-chip';
        badge.textContent = item;
        stackWrap.appendChild(badge);
      });
    });
  }

  /* 10. Валидация и отправка формы обратной связи */
  const contactForm = document.getElementById('wapContactForm');
  const formAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        showToast('Проверьте заполненные поля');
        return;
      }

      const nameVal = document.getElementById('contactName').value.trim();
      contactForm.classList.remove('was-validated');
      contactForm.reset();

      if (formAlert) {
        formAlert.classList.remove('d-none');
        formAlert.querySelector('[data-sender-name]').textContent = nameVal || 'Друг';
      }
      showToast('Заявка отправлена! Отвечу в течение 15 минут');
    });
  }
})();
