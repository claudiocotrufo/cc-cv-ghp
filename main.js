// Stage crossfade by chapter, section entrances, the stack list, the active role.
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The fixed half follows the chapter in the middle of the screen.
  const captions = {
    mole: 'The Mole Antonelliana, Turin',
    roma: 'The arcades of Via Roma, Turin',
    po: 'The Po at the Murazzi, Turin',
    superga: 'Turin from Superga, etching by James Mitan',
    bari: 'The castle of Bari',
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
  const chapters = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) show(e.target.dataset.chapter); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('[data-chapter]').forEach((el) => chapters.observe(el));

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

  // The stack: one cell of the honeycomb selected at a time.
  const cells = [...document.querySelectorAll('.hex')];
  const panels = [...document.querySelectorAll('.tech-panel')];
  const select = (key) => {
    cells.forEach((c) => {
      const on = c.dataset.key === key;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    panels.forEach((p) => { p.hidden = p.dataset.panel !== key; });
  };
  cells.forEach((c) => c.addEventListener('click', () => select(c.dataset.key)));
  if (cells.length) select(cells[0].dataset.key);
})();
