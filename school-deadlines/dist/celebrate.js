'use strict';
(() => {
  let muted = false, timer, audio, lastId;
  const catalog = window.MEME_CATALOG;
  try { muted = localStorage.getItem('portfolio-school-planner-muted') === 'true'; } catch {}
  const soundButton = document.getElementById('sound-toggle');
  function stopAudio() { if (audio) { audio.pause(); audio.currentTime = 0; audio = undefined; } }
  function updateSound() { soundButton.textContent = muted ? 'Sound off' : 'Sound on'; soundButton.setAttribute('aria-pressed', String(!muted)); }
  soundButton.addEventListener('click', () => { muted = !muted; try { localStorage.setItem('portfolio-school-planner-muted', String(muted)); } catch {} if (muted) stopAudio(); updateSound(); });
  updateSound();
  const banner = document.createElement('div');
  banner.className = 'celebration'; banner.hidden = true;
  banner.setAttribute('role', 'status'); banner.setAttribute('aria-live', 'polite');
  document.body.append(banner);
  const bags = { assignment: [], study: [] };
  function pick(kind) {
    if (!bags[kind].length) {
      bags[kind] = catalog.filter(m => m.kind === kind).slice();
      for (let i = bags[kind].length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bags[kind][i], bags[kind][j]] = [bags[kind][j], bags[kind][i]]; }
      if (bags[kind].at(-1).id === lastId) bags[kind].reverse();
    }
    const chosen = bags[kind].pop(); lastId = chosen.id; return chosen;
  }
  window.celebrate = (kind, selected) => {
    const study = kind === 'study', meme = selected || pick(study ? 'study' : 'assignment');
    clearTimeout(timer); stopAudio(); banner.replaceChildren(); banner.dataset.audio = muted ? "muted" : "loading";
    banner.className = 'celebration ' + (study ? 'study-party' : 'assignment-party');
    const image = document.createElement('img'); image.className = 'celebration-mascot meme-image'; image.src = meme.image; image.alt = meme.imageName; image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => { image.hidden = true; });
    const message = document.createElement('div'), title = document.createElement('strong'), subtitle = document.createElement('span'), credit = document.createElement('a'), status = document.createElement('span');
    title.textContent = study ? 'Study goal unlocked!' : 'Assignment conquered!';
    subtitle.textContent = meme.name;
    credit.textContent = 'Clip source'; credit.href = meme.source; credit.target = '_blank'; credit.rel = 'noopener noreferrer';
    status.className = 'meme-audio-status'; message.append(title, subtitle, credit, status);
    const close = document.createElement('button'); close.type = 'button'; close.className = 'delete'; close.textContent = '×'; close.setAttribute('aria-label', 'Dismiss celebration');
    close.addEventListener('click', () => { clearTimeout(timer); stopAudio(); banner.hidden = true; });
    banner.append(image, message, close); banner.hidden = false;
    if (!muted) {
      const clip = new Audio(meme.audio); audio = clip; clip.volume = 0.3; clip.hidden = true; banner.append(clip); clip.addEventListener("playing",()=>{if(audio===clip)banner.dataset.audio="playing";});
      clip.addEventListener('error', () => { if (audio === clip) status.textContent = 'Clip unavailable; your progress is saved.'; }, { once: true });
      clip.play().catch(() => { if (audio === clip) status.textContent = 'Audio unavailable; your progress is saved.'; });
    }
    timer = setTimeout(() => { banner.hidden = true; stopAudio(); }, 4000);
  };
  const list = document.getElementById('meme-library-list');
  for (const meme of catalog) {
    const row = document.createElement('div'); row.className = 'meme-library-row';
    const info = document.createElement('div'), title = document.createElement('strong'), detail = document.createElement('span');
    title.textContent = meme.name; detail.textContent = (meme.kind === 'study' ? 'Study' : 'Assignment') + ' · ' + meme.listing;
    info.append(title, detail);
    const preview = document.createElement('button'); preview.type = 'button'; preview.className = 'theme-toggle'; preview.textContent = 'Preview'; preview.setAttribute('aria-label', 'Preview ' + meme.name); preview.addEventListener('click', () => window.celebrate(meme.kind, meme));
    row.append(info, preview); list.append(row);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearTimeout(timer); stopAudio(); banner.hidden = true; } });
})();

