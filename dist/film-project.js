/* A linear film page: film, story, making of, image gallery. */
window.renderFilmProject = (root, project) => {
  'use strict';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrow = direction => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction < 0 ? 'm15 5-7 7 7 7' : 'm9 5 7 7-7 7'}"/></svg>`;
  const player = (id, title, lazy = false) => `<div class="film-video"><iframe src="https://www.youtube.com/embed/${id}?rel=0" title="${esc(title)}" ${lazy ? 'loading="lazy"' : ''} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
  document.body.classList.add('film-project');
  document.querySelector('meta[name="description"]').content = 'The Coffin: il cortometraggio, il making of e la galleria del progetto realizzato con ComfyUI.';
  root.innerHTML = `<article class="film-layout">
    <a class="film-back" href="progetti.html">← Tutti i progetti</a>
    <h1 class="film-title">${esc(project.title)}</h1>
    <section aria-label="Video principale">${player(project.youtube, 'The Coffin — cortometraggio')}<a class="film-video-link" href="${project.video}" target="_blank" rel="noopener noreferrer">Guarda su YouTube ↗</a></section>
    <section class="film-story" lang="en" aria-label="About The Coffin">${project.paragraphs.map(text => `<p>${esc(text)}</p>`).join('')}</section>
    <section class="film-making" aria-labelledby="making-title"><h2 id="making-title">Making of</h2><div class="film-making-player">${player(project.makingYoutube, 'The Coffin — making of', true)}<a class="film-video-link" href="${project.makingVideo}" target="_blank" rel="noopener noreferrer">Guarda il making of su YouTube ↗</a></div></section>
    <section class="film-gallery" aria-labelledby="gallery-title"><h2 id="gallery-title">Galleria</h2><div class="film-gallery-grid">${project.gallery.map((item, i) => `<figure><button type="button" class="film-gallery-open" data-image="${i}" aria-label="Ingrandisci ${esc(item.caption)}" aria-haspopup="dialog"><img src="${esc(item.thumbnail)}" alt="${esc(item.caption)}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async"></button><figcaption>${esc(item.caption)}</figcaption></figure>`).join('')}</div></section>
  </article>
  <dialog class="film-lightbox" aria-labelledby="lightbox-title"><h2 id="lightbox-title" class="film-sr-only">Galleria di The Coffin</h2><span class="film-lightbox-count" aria-hidden="true"></span><button type="button" class="film-lightbox-close" aria-label="Chiudi galleria"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button><button type="button" class="film-lightbox-prev" aria-label="Immagine precedente">${arrow(-1)}</button><figure><img alt="" width="1920" height="1080"><figcaption aria-live="polite" aria-atomic="true"></figcaption></figure><button type="button" class="film-lightbox-next" aria-label="Immagine successiva">${arrow(1)}</button></dialog>`;
  const dialog = root.querySelector('.film-lightbox');
  const image = dialog.querySelector('figure img');
  let current = 0, opener, previousOverflow;
  function show(index) {
    current = (index + project.gallery.length) % project.gallery.length;
    const item = project.gallery[current];
    image.src = item.image;
    image.alt = item.caption;
    dialog.querySelector('figcaption').textContent = item.caption;
    dialog.querySelector('.film-lightbox-count').textContent = `${current + 1} / ${project.gallery.length}`;
    const next = new Image();
    next.src = project.gallery[(current + 1) % project.gallery.length].image;
  }
  root.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    show(Number(button.dataset.image));
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('.film-lightbox-close').focus();
  }));
  dialog.querySelector('.film-lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.film-lightbox-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.film-lightbox-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({preventScroll:true});
  });
  let start;
  image.addEventListener('touchstart', event => { start = {x:event.touches[0].clientX, y:event.touches[0].clientY}; }, {passive:true});
  image.addEventListener('touchend', event => {
    if (!start) return;
    const dx = event.changedTouches[0].clientX - start.x, dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    start = null;
  }, {passive:true});
};
