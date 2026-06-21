import { toHTML, highlightAll } from './markdown.js';
import { getLang, t } from './i18n.js';

// Each section: translated title + a list of example snippets.
// Every snippet is localized so the *content* matches the chosen language;
// only the Markdown syntax itself stays the same.
const SECTIONS = [
  {
    title: { tr: 'Başlıklar', en: 'Headings', es: 'Encabezados' },
    items: [
      {
        tr: '# 1. Seviye Başlık\n## 2. Seviye Başlık\n### 3. Seviye Başlık',
        en: '# Heading level 1\n## Heading level 2\n### Heading level 3',
        es: '# Encabezado nivel 1\n## Encabezado nivel 2\n### Encabezado nivel 3',
      },
      {
        tr: 'Alternatif H1\n=============\n\nAlternatif H2\n-------------',
        en: 'Alternate H1\n=============\n\nAlternate H2\n-------------',
        es: 'H1 alternativo\n=============\n\nH2 alternativo\n-------------',
      },
    ],
  },
  {
    title: { tr: 'Vurgu (kalın, italik)', en: 'Emphasis (bold, italic)', es: 'Énfasis (negrita, cursiva)' },
    items: [
      {
        tr: '*italik* veya _italik_\n\n**kalın** veya __kalın__\n\n***kalın italik***\n\n~~üstü çizili~~',
        en: '*italic* or _italic_\n\n**bold** or __bold__\n\n***bold italic***\n\n~~strikethrough~~',
        es: '*cursiva* o _cursiva_\n\n**negrita** o __negrita__\n\n***negrita cursiva***\n\n~~tachado~~',
      },
    ],
  },
  {
    title: { tr: 'Sırasız liste', en: 'Unordered list', es: 'Lista sin orden' },
    items: [
      {
        tr: '- Birinci madde\n- İkinci madde\n  - Alt madde\n  - Alt madde\n- Üçüncü madde',
        en: '- First item\n- Second item\n  - Sub-item\n  - Sub-item\n- Third item',
        es: '- Primer elemento\n- Segundo elemento\n  - Subelemento\n  - Subelemento\n- Tercer elemento',
      },
      {
        tr: '* Yıldız da olur\n+ Artı da olur',
        en: '* Asterisks work\n+ Plus signs work',
        es: '* Los asteriscos sirven\n+ Los signos más sirven',
      },
    ],
  },
  {
    title: { tr: 'Sıralı liste', en: 'Ordered list', es: 'Lista ordenada' },
    items: [
      {
        tr: '1. Birinci\n2. İkinci\n3. Üçüncü\n   1. İç içe\n   2. İç içe',
        en: '1. First\n2. Second\n3. Third\n   1. Nested\n   2. Nested',
        es: '1. Primero\n2. Segundo\n3. Tercero\n   1. Anidado\n   2. Anidado',
      },
    ],
  },
  {
    title: { tr: 'Görev listesi', en: 'Task list', es: 'Lista de tareas' },
    items: [
      {
        tr: '- [x] Tamamlandı\n- [ ] Yapılacak\n- [ ] Devam ediyor',
        en: '- [x] Done\n- [ ] To do\n- [ ] In progress',
        es: '- [x] Hecho\n- [ ] Por hacer\n- [ ] En progreso',
      },
    ],
  },
  {
    title: { tr: 'Bağlantılar', en: 'Links', es: 'Enlaces' },
    items: [
      {
        tr: '[Bağlantı metni](https://example.com)\n\n[Başlıklı bağlantı](https://example.com "Üzerine gelince")\n\n<https://otomatik-link.com>',
        en: '[Link text](https://example.com)\n\n[Link with title](https://example.com "On hover")\n\n<https://auto-link.com>',
        es: '[Texto del enlace](https://example.com)\n\n[Enlace con título](https://example.com "Al pasar el cursor")\n\n<https://enlace-automatico.com>',
      },
    ],
  },
  {
    title: { tr: 'Görseller', en: 'Images', es: 'Imágenes' },
    items: [
      {
        tr: '![Alternatif metin](https://picsum.photos/120/60)',
        en: '![Alt text](https://picsum.photos/120/60)',
        es: '![Texto alternativo](https://picsum.photos/120/60)',
      },
    ],
  },
  {
    title: { tr: 'Satır içi kod', en: 'Inline code', es: 'Código en línea' },
    items: [
      {
        tr: 'Komut için `npm install` yaz.\n\nDeğişken: `const x = 10;`',
        en: 'Type `npm install` to run it.\n\nVariable: `const x = 10;`',
        es: 'Escribe `npm install` para ejecutarlo.\n\nVariable: `const x = 10;`',
      },
    ],
  },
  {
    title: { tr: 'Kod bloğu', en: 'Code block', es: 'Bloque de código' },
    items: [
      {
        tr: '```js\nfunction selam(ad) {\n  return `Merhaba ${ad}`;\n}\n```',
        en: '```js\nfunction greet(name) {\n  return `Hello ${name}`;\n}\n```',
        es: '```js\nfunction saludar(nombre) {\n  return `Hola ${nombre}`;\n}\n```',
      },
      {
        tr: '```python\ndef topla(a, b):\n    return a + b\n```',
        en: '```python\ndef add(a, b):\n    return a + b\n```',
        es: '```python\ndef sumar(a, b):\n    return a + b\n```',
      },
    ],
  },
  {
    title: { tr: 'Alıntı', en: 'Blockquote', es: 'Cita' },
    items: [
      {
        tr: '> Bu bir alıntıdır.\n>\n> > İç içe alıntı da olur.',
        en: '> This is a quote.\n>\n> > Nested quotes work too.',
        es: '> Esto es una cita.\n>\n> > Las citas anidadas también funcionan.',
      },
    ],
  },
  {
    title: { tr: 'Tablo', en: 'Table', es: 'Tabla' },
    items: [
      {
        tr: '| Sol | Orta | Sağ |\n| :--- | :---: | ---: |\n| a | b | c |\n| 1 | 2 | 3 |',
        en: '| Left | Center | Right |\n| :--- | :---: | ---: |\n| a | b | c |\n| 1 | 2 | 3 |',
        es: '| Izq. | Centro | Der. |\n| :--- | :---: | ---: |\n| a | b | c |\n| 1 | 2 | 3 |',
      },
    ],
  },
  {
    title: { tr: 'Yatay çizgi', en: 'Horizontal rule', es: 'Línea horizontal' },
    items: [
      {
        tr: 'Üst metin\n\n---\n\nAlt metin',
        en: 'Text above\n\n---\n\nText below',
        es: 'Texto arriba\n\n---\n\nTexto abajo',
      },
    ],
  },
  {
    title: { tr: 'Satır sonu', en: 'Line break', es: 'Salto de línea' },
    items: [
      {
        tr: 'Bu satır  \n(iki boşlukla biter) yeni satıra geçer.',
        en: 'This line  \n(ends with two spaces) wraps to a new line.',
        es: 'Esta línea  \n(termina con dos espacios) salta a una nueva.',
      },
    ],
  },
  {
    title: { tr: 'Karakter kaçışı', en: 'Escaping characters', es: 'Escapar caracteres' },
    items: [
      {
        tr: '\\*yıldızlar arası italik olmaz\\*\n\n\\# başlık olmaz',
        en: '\\*no italics between stars\\*\n\n\\# not a heading',
        es: '\\*sin cursiva entre asteriscos\\*\n\n\\# no es un encabezado',
      },
    ],
  },
];

function copyButton(text) {
  const btn = document.createElement('button');
  btn.className = 'cs-copy';
  btn.textContent = t('csCopy');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback for non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    const old = btn.textContent;
    btn.textContent = t('csCopied');
    btn.classList.add('done');
    setTimeout(() => {
      btn.textContent = old;
      btn.classList.remove('done');
    }, 1200);
  });
  return btn;
}

/** Build and return the cheat-sheet content element (localized to current lang). */
export function buildCheatSheet() {
  const lang = getLang();
  const wrap = document.createElement('div');
  wrap.className = 'cs-content';

  for (const section of SECTIONS) {
    const sec = document.createElement('section');
    sec.className = 'cs-section';

    const h = document.createElement('h3');
    h.textContent = section.title[lang] || section.title.en;
    sec.appendChild(h);

    const grid = document.createElement('div');
    grid.className = 'cs-grid';

    const colA = document.createElement('div');
    colA.className = 'cs-col-head';
    colA.textContent = t('csColSyntax');
    const colB = document.createElement('div');
    colB.className = 'cs-col-head';
    colB.textContent = t('csColResult');
    grid.append(colA, colB);

    for (const item of section.items) {
      const md = item[lang] || item.en;

      // source cell
      const src = document.createElement('div');
      src.className = 'cs-src';
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = md;
      pre.appendChild(code);
      src.append(copyButton(md), pre);

      // result cell
      const out = document.createElement('div');
      out.className = 'cs-out markdown-body';
      out.innerHTML = toHTML(md);
      highlightAll(out);

      grid.append(src, out);
    }

    sec.appendChild(grid);
    wrap.appendChild(sec);
  }

  return wrap;
}
