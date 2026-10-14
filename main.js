// Stage crossfade by chapter, section entrances, the active role and nav item,
// the stack honeycomb (a radio group) and copying the email address.
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The fixed half follows the chapter in the middle of the screen.
  const captions = {
    mole: 'The Mole Antonelliana, Turin',
    roma: 'The arcades of Via Roma, Turin',
    po: 'The Po at the Murazzi, Turin',
    bari: 'The castle of Bari',
    superga: 'Turin from Superga, etching by James Mitan',
  };
  const stageImgs = [...document.querySelectorAll('.stage-img')];
  const caption = document.querySelector('[data-caption]');
  let current = 'mole';
  const show = (key) => {
    if (key === current) return;
    current = key;
    stageImgs.forEach((img) => img.classList.toggle('is-on', img.dataset.photo === key));
    if (caption) caption.textContent = captions[key] || '';
  };

  // The nav marks the section being read.
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const mark = (id) => navLinks.forEach((a) => {
    if (a.dataset.nav === id) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
  const navFor = { work: 'work', stack: 'stack', education: 'about', about: 'about', contact: 'contact' };

  const chapters = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      if (e.target.dataset.chapter) show(e.target.dataset.chapter);
      mark(navFor[e.target.id] || '');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('[data-chapter], #contact').forEach((el) => chapters.observe(el));

  // The role nearest the middle of the screen is the active one.
  const roles = [...document.querySelectorAll('.role')];
  if (roles.length) roles[0].classList.add('is-active');
  const roleObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      roles.forEach((r) => r.classList.toggle('is-active', r === e.target));
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  roles.forEach((r) => roleObs.observe(r));

  // Entrances: each part of a section rises in turn, once.
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    let batch = 0;
    let frame = 0;
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.style.setProperty('--d', `${batch++ * 75}ms`);
        e.target.classList.add('is-in');
        revealObs.unobserve(e.target);
      });
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { batch = 0; });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => revealObs.observe(el));
  }

  // The stack: a radio group of hexagons with a roving tab stop.
  const cells = [...document.querySelectorAll('.hex')];
  const panels = [...document.querySelectorAll('.tech-panel')];
  const select = (cell, focus) => {
    cells.forEach((c) => {
      const on = c === cell;
      c.setAttribute('aria-checked', String(on));
      c.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => { p.hidden = p.dataset.panel !== cell.dataset.key; });
    if (focus) cell.focus();
  };
  cells.forEach((c, i) => {
    c.addEventListener('click', () => select(c, false));
    c.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      let next = null;
      if (step) next = cells[(i + step + cells.length) % cells.length];
      if (e.key === 'Home') next = cells[0];
      if (e.key === 'End') next = cells[cells.length - 1];
      if (!next) return;
      e.preventDefault();
      select(next, true);
    });
  });
  if (cells.length) select(cells[0], false);

  // Copy the email address, saying so where a screen reader will hear it.
  const copy = document.querySelector('[data-copy]');
  const status = document.querySelector('.copy-status');
  if (copy && navigator.clipboard) {
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copy.dataset.copy);
        status.textContent = 'Copied.';
      } catch {
        status.textContent = 'Could not copy. Select the address above instead.';
      }
      clearTimeout(copy._t);
      copy._t = setTimeout(() => { status.textContent = ''; }, 3000);
    });
  } else if (copy) {
    copy.hidden = true;
  }
})();
