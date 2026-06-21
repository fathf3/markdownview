// Simple i18n: Turkish / English / Spanish.

export const LANGS = ['tr', 'en', 'es'];
export const LANG_NAMES = { tr: 'Türkçe', en: 'English', es: 'Español' };

const STRINGS = {
  tr: {
    open: 'Aç',
    save: 'Kaydet',
    viewEditor: 'Editör',
    viewSplit: 'Bölünmüş',
    viewPreview: 'Önizleme',
    cheatsheet: 'Cheat Sheet',
    export: 'Dışa Aktar ▾',
    exportHtml: '🌐 HTML olarak',
    exportPdf: '📄 PDF olarak (yazdır)',
    untitled: 'Adsız.md',
    dropzone: '📂 Markdown dosyasını buraya bırak',
    openTitle: 'Dosya aç (Ctrl+O)',
    saveTitle: 'Kaydet (Ctrl+S)',
    exportTitle: 'Dışa aktar',
    themeTitle: 'Temayı değiştir (Ctrl+J)',
    langTitle: 'Dil',
    download: 'İndir',
    downloadTitle: 'Masaüstü uygulamasını indir (Windows)',
    cheatsheetTitle: 'Markdown örnekleri / hızlı başvuru',
    editorPlaceholder: '# Buraya markdown yaz...',
    // cheat sheet modal
    csHeading: 'Markdown Cheat Sheet',
    csIntro: 'Sık kullanılan Markdown sözdizimi ve sonuçları. Bir örneği kopyalamak için "Kopyala"ya tıkla.',
    csColSyntax: 'Markdown',
    csColResult: 'Sonuç',
    csCopy: 'Kopyala',
    csCopied: 'Kopyalandı!',
    csClose: 'Kapat',
    metaTitle: 'Markdown Görüntüleyici ve Editör — Ücretsiz, Online ve Masaüstü',
    metaDescription:
      'Canlı önizleme, sözdizimi renklendirme, koyu tema ve HTML/PDF dışa aktarma ile ücretsiz Markdown görüntüleyici ve editör. .md dosyalarını tarayıcıda aç veya masaüstü uygulamasını indir.',
  },
  en: {
    open: 'Open',
    save: 'Save',
    viewEditor: 'Editor',
    viewSplit: 'Split',
    viewPreview: 'Preview',
    cheatsheet: 'Cheat Sheet',
    export: 'Export ▾',
    exportHtml: '🌐 As HTML',
    exportPdf: '📄 As PDF (print)',
    untitled: 'Untitled.md',
    dropzone: '📂 Drop a Markdown file here',
    openTitle: 'Open file (Ctrl+O)',
    saveTitle: 'Save (Ctrl+S)',
    exportTitle: 'Export',
    themeTitle: 'Toggle theme (Ctrl+J)',
    langTitle: 'Language',
    download: 'Download',
    downloadTitle: 'Download the desktop app (Windows)',
    cheatsheetTitle: 'Markdown examples / quick reference',
    editorPlaceholder: '# Write your markdown here...',
    csHeading: 'Markdown Cheat Sheet',
    csIntro: 'Common Markdown syntax and the result it produces. Click "Copy" to grab an example.',
    csColSyntax: 'Markdown',
    csColResult: 'Result',
    csCopy: 'Copy',
    csCopied: 'Copied!',
    csClose: 'Close',
    metaTitle: 'Markdown Viewer & Editor — Free Online & Desktop App',
    metaDescription:
      'Free Markdown viewer & editor with live preview, syntax highlighting, dark mode and export to HTML/PDF. Open .md files in your browser or download the desktop app.',
  },
  es: {
    open: 'Abrir',
    save: 'Guardar',
    viewEditor: 'Editor',
    viewSplit: 'Dividido',
    viewPreview: 'Vista previa',
    cheatsheet: 'Guía rápida',
    export: 'Exportar ▾',
    exportHtml: '🌐 Como HTML',
    exportPdf: '📄 Como PDF (imprimir)',
    untitled: 'Sin-título.md',
    dropzone: '📂 Suelta un archivo Markdown aquí',
    openTitle: 'Abrir archivo (Ctrl+O)',
    saveTitle: 'Guardar (Ctrl+S)',
    exportTitle: 'Exportar',
    themeTitle: 'Cambiar tema (Ctrl+J)',
    langTitle: 'Idioma',
    download: 'Descargar',
    downloadTitle: 'Descargar la app de escritorio (Windows)',
    cheatsheetTitle: 'Ejemplos de Markdown / referencia rápida',
    editorPlaceholder: '# Escribe tu markdown aquí...',
    csHeading: 'Hoja de referencia de Markdown',
    csIntro: 'Sintaxis Markdown habitual y el resultado que produce. Pulsa "Copiar" para tomar un ejemplo.',
    csColSyntax: 'Markdown',
    csColResult: 'Resultado',
    csCopy: 'Copiar',
    csCopied: '¡Copiado!',
    csClose: 'Cerrar',
    metaTitle: 'Visor y Editor de Markdown — Gratis, Online y de Escritorio',
    metaDescription:
      'Visor y editor de Markdown gratis con vista previa en vivo, resaltado de sintaxis, modo oscuro y exportación a HTML/PDF. Abre archivos .md en el navegador o descarga la app de escritorio.',
  },
};

function detect() {
  const n = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return LANGS.includes(n) ? n : 'en';
}

// Allow ?lang=tr|en|es so the hreflang / sitemap variants render that language.
function fromQuery() {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    return q && LANGS.includes(q) ? q : null;
  } catch {
    return null;
  }
}

let current = fromQuery() || localStorage.getItem('markview:lang') || detect();
if (!LANGS.includes(current)) current = 'en';

export function getLang() {
  return current;
}

export function setLang(lang) {
  current = LANGS.includes(lang) ? lang : 'en';
  localStorage.setItem('markview:lang', current);
}

export function t(key) {
  const table = STRINGS[current] || STRINGS.en;
  return table[key] != null ? table[key] : (STRINGS.en[key] != null ? STRINGS.en[key] : key);
}

/** Apply translations to any element carrying data-i18n / data-i18n-title. */
export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  root.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    el.setAttribute('placeholder', t(el.dataset.i18nPh));
  });
  document.documentElement.lang = current;
}
