import './style.css';
import { toHTML, highlightAll, toHighlightedHTML } from './markdown.js';
import { getDefaultDoc } from './defaultDoc.js';
import { buildStandaloneHTML } from './exportHtml.js';
import { buildCheatSheet } from './cheatsheet.js';
import { getLang, setLang, t, applyI18n } from './i18n.js';

// ---------- Elements ----------
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const panes = document.getElementById('panes');
const gutter = document.getElementById('gutter');
const fileInput = document.getElementById('fileInput');
const dropzone = document.getElementById('dropzone');
const filenameEl = document.getElementById('filename');
const langSelect = document.getElementById('lang');
const cheatModal = document.getElementById('cheatModal');
const csBody = document.getElementById('csBody');

const isElectron = !!(window.electronAPI && window.electronAPI.isElectron);
let isUntitled = true;
let currentName = t('untitled');
// True while the editor still shows the untouched welcome doc; lets us swap it
// to the chosen language. Becomes false once the user types or opens a file.
let usingDefaultDoc = false;

// ---------- Rendering ----------
function render() {
  preview.innerHTML = toHTML(editor.value);
  highlightAll(preview);
}

let renderTimer = null;
function scheduleRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(() => {
    render();
    localStorage.setItem('markview:content', editor.value);
  }, 100);
}
editor.addEventListener('input', () => {
  usingDefaultDoc = false; // user is now editing their own content
  scheduleRender();
});

// ---------- Filename / title ----------
function updateDocumentTitle() {
  // Show the SEO title in the indexable default state; the filename while editing.
  document.title = isUntitled ? t('metaTitle') : `${currentName} — MarkView`;
}
function updateFilenameDisplay() {
  filenameEl.textContent = currentName;
  updateDocumentTitle();
}

// ---------- SEO meta (kept in sync with the chosen language) ----------
const SITE = 'https://markdown-view.com';
const OG_LOCALE = { tr: 'tr_TR', en: 'en_US', es: 'es_ES' };
function setMetaAttr(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}
function updateMeta() {
  const lang = getLang();
  const title = t('metaTitle');
  const desc = t('metaDescription');
  const url = SITE + '/' + (lang !== 'en' ? `?lang=${lang}` : '');
  setMetaAttr('meta[name="description"]', 'content', desc);
  setMetaAttr('#og-title', 'content', title);
  setMetaAttr('#og-desc', 'content', desc);
  setMetaAttr('#og-url', 'content', url);
  setMetaAttr('#og-locale', 'content', OG_LOCALE[lang] || 'en_US');
  setMetaAttr('meta[name="twitter:title"]', 'content', title);
  setMetaAttr('meta[name="twitter:description"]', 'content', desc);
  setMetaAttr('link[rel="canonical"]', 'href', url);
  const h1 = document.getElementById('seo-h1');
  if (h1) h1.textContent = t('seoHeading');
  updateDocumentTitle();
}

function setName(nameOrPath) {
  const base = String(nameOrPath).replace(/\\/g, '/').split('/').pop();
  currentName = base || t('untitled');
  isUntitled = false;
  updateFilenameDisplay();
}

function loadContent(text, nameOrPath) {
  editor.value = text;
  usingDefaultDoc = false; // real content was loaded
  if (nameOrPath) setName(nameOrPath);
  render();
  localStorage.setItem('markview:content', text);
}

// ---------- Open file ----------
function readFile(file) {
  const reader = new FileReader();
  reader.onload = () => loadContent(String(reader.result), file.name);
  reader.readAsText(file);
}

document.getElementById('open').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) readFile(file);
  fileInput.value = '';
});

// ---------- Drag & drop ----------
let dragDepth = 0;
window.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dragDepth++;
  dropzone.classList.add('active');
});
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('dragleave', () => {
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) dropzone.classList.remove('active');
});
window.addEventListener('drop', (e) => {
  e.preventDefault();
  dragDepth = 0;
  dropzone.classList.remove('active');
  const file = e.dataTransfer.files[0];
  if (file) readFile(file);
});

// ---------- View modes ----------
function setView(view) {
  panes.dataset.view = view;
  document.querySelectorAll('.view-toggle button').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  localStorage.setItem('markview:view', view);
}
document.querySelectorAll('.view-toggle button').forEach((b) => {
  b.addEventListener('click', () => setView(b.dataset.view));
});

// ---------- Splitter ----------
let dragging = false;
gutter.addEventListener('pointerdown', (e) => {
  dragging = true;
  gutter.setPointerCapture(e.pointerId);
});
gutter.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const rect = panes.getBoundingClientRect();
  let pct = ((e.clientX - rect.left) / rect.width) * 100;
  pct = Math.min(85, Math.max(15, pct));
  panes.style.setProperty('--split', pct + '%');
});
gutter.addEventListener('pointerup', (e) => {
  dragging = false;
  gutter.releasePointerCapture(e.pointerId);
});

// ---------- Theme ----------
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.getElementById('theme').textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('markview:theme', theme);
}
function toggleTheme() {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}
document.getElementById('theme').addEventListener('click', toggleTheme);

// ---------- Language ----------
function applyLanguage(lang) {
  setLang(lang);
  applyI18n();
  updateMeta();
  langSelect.value = getLang();
  if (isUntitled) {
    currentName = t('untitled');
    updateFilenameDisplay();
  }
  // Swap the welcome document to the new language — but only while it is still
  // the untouched default, so the user's own writing is never overwritten.
  if (usingDefaultDoc) {
    editor.value = getDefaultDoc(getLang());
    render();
  }
  if (cheatModal.classList.contains('open')) renderCheatSheet();
}
langSelect.addEventListener('change', () => applyLanguage(langSelect.value));

// ---------- Cheat sheet modal ----------
function renderCheatSheet() {
  csBody.replaceChildren(buildCheatSheet());
}
function openCheatSheet() {
  renderCheatSheet();
  cheatModal.classList.add('open');
  cheatModal.setAttribute('aria-hidden', 'false');
}
function closeCheatSheet() {
  cheatModal.classList.remove('open');
  cheatModal.setAttribute('aria-hidden', 'true');
}
document.getElementById('cheatsheet').addEventListener('click', openCheatSheet);
document.getElementById('csClose').addEventListener('click', closeCheatSheet);
cheatModal.querySelector('[data-close]').addEventListener('click', closeCheatSheet);

// ---------- Save ----------
function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function save() {
  const content = editor.value;
  if (isElectron) {
    const res = await window.electronAPI.saveFile({
      content,
      suggestedName: currentName,
    });
    if (res && res.path) {
      setName(res.path);
      localStorage.setItem('markview:content', content);
    }
  } else {
    const name = currentName.endsWith('.md') ? currentName : currentName + '.md';
    downloadBlob(content, name, 'text/markdown');
  }
}
document.getElementById('save').addEventListener('click', save);

// ---------- Export ----------
const exportBtn = document.getElementById('exportBtn');
const exportMenu = document.getElementById('exportMenu');
exportBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  exportMenu.classList.toggle('open');
});
document.addEventListener('click', () => exportMenu.classList.remove('open'));
exportMenu.querySelectorAll('button').forEach((b) => {
  b.addEventListener('click', () => {
    exportMenu.classList.remove('open');
    if (b.dataset.export === 'html') exportHTML();
    else exportPDF();
  });
});

function exportHTML() {
  const title = currentName.replace(/\.(md|markdown|mdown|mkd|txt)$/i, '');
  const body = toHighlightedHTML(editor.value);
  const theme = document.documentElement.dataset.theme;
  const html = buildStandaloneHTML(title, body, theme);
  downloadBlob(html, title + '.html', 'text/html');
}

function exportPDF() {
  render();
  window.print();
}

// ---------- Keyboard shortcuts ----------
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCheatSheet();
    return;
  }
  const ctrl = e.ctrlKey || e.metaKey;
  if (!ctrl) return;
  const key = e.key.toLowerCase();
  if (key === 's') { e.preventDefault(); save(); }
  else if (key === 'o') { e.preventDefault(); fileInput.click(); }
  else if (key === 'j') { e.preventDefault(); toggleTheme(); }
});

// ---------- Electron integration ----------
if (isElectron) {
  // You're already on the desktop app — no need for a download link.
  const dl = document.getElementById('download');
  if (dl) dl.style.display = 'none';

  window.electronAPI.onOpenFile(({ path, content }) => {
    loadContent(content, path);
    setView(localStorage.getItem('markview:view') || 'preview');
  });
  window.electronAPI.onMenuAction((action) => {
    if (action === 'open') fileInput.click();
    else if (action === 'save') save();
    else if (action === 'export-html') exportHTML();
    else if (action === 'export-pdf') exportPDF();
    else if (action === 'toggle-theme') toggleTheme();
  });
  window.electronAPI.ready();
}

// ---------- Boot ----------
setTheme(localStorage.getItem('markview:theme') || 'light');
setView(localStorage.getItem('markview:view') || 'split');
langSelect.value = getLang();
applyI18n();
updateMeta();

const saved = localStorage.getItem('markview:content');
usingDefaultDoc = saved == null; // first run -> welcome doc can follow language
editor.value = saved != null ? saved : getDefaultDoc(getLang());
updateFilenameDisplay();
render();
