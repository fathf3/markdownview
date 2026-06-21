// Builds a fully self-contained .html file (CSS inlined) from rendered markdown.
// Works offline and looks the same anywhere — no external dependencies.

const LIGHT = {
  bg: '#ffffff', fg: '#1f2328', muted: '#656d76', border: '#d0d7de',
  codeBg: '#f6f8fa', accent: '#3b82f6', stripe: '#f6f8fa',
  comment: '#6e7781', keyword: '#cf222e', string: '#0a3069', number: '#0550ae',
  title: '#6639ba', builtin: '#953800', attr: '#0550ae',
};
const DARK = {
  bg: '#0d1117', fg: '#e6edf3', muted: '#8b949e', border: '#30363d',
  codeBg: '#161b22', accent: '#58a6ff', stripe: '#161b22',
  comment: '#8b949e', keyword: '#ff7b72', string: '#a5d6ff', number: '#79c0ff',
  title: '#d2a8ff', builtin: '#ffa657', attr: '#79c0ff',
};

function styles(c) {
  return `
  body { background:${c.bg}; color:${c.fg}; margin:0;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    line-height:1.7; font-size:16px; }
  .markdown-body { max-width:860px; margin:0 auto; padding:40px 24px 80px; }
  .markdown-body > *:first-child { margin-top:0; }
  h1,h2,h3,h4,h5,h6 { margin:1.6em 0 .6em; font-weight:600; line-height:1.3; }
  h1 { font-size:2em; border-bottom:1px solid ${c.border}; padding-bottom:.3em; }
  h2 { font-size:1.5em; border-bottom:1px solid ${c.border}; padding-bottom:.3em; }
  h3 { font-size:1.25em; } h4 { font-size:1em; } h6 { color:${c.muted}; }
  p { margin:0 0 1em; }
  a { color:${c.accent}; text-decoration:none; } a:hover { text-decoration:underline; }
  ul,ol { margin:0 0 1em; padding-left:2em; } li { margin:.25em 0; }
  blockquote { margin:0 0 1em; padding:0 1em; color:${c.muted};
    border-left:.25em solid ${c.border}; }
  code { font-family:ui-monospace,Consolas,monospace; font-size:.9em;
    background:${c.codeBg}; padding:.2em .4em; border-radius:5px; }
  pre { margin:0 0 1em; padding:14px 16px; background:${c.codeBg};
    border-radius:7px; overflow:auto; }
  pre code { background:transparent; padding:0; font-size:.875em; }
  table { border-collapse:collapse; margin:0 0 1em; display:block;
    width:max-content; max-width:100%; overflow:auto; }
  th,td { border:1px solid ${c.border}; padding:6px 13px; }
  tr:nth-child(2n) { background:${c.stripe}; }
  img { max-width:100%; border-radius:6px; }
  hr { height:1px; border:none; background:${c.border}; margin:1.6em 0; }
  .hljs-comment,.hljs-quote { color:${c.comment}; font-style:italic; }
  .hljs-keyword,.hljs-selector-tag,.hljs-literal,.hljs-section { color:${c.keyword}; }
  .hljs-string,.hljs-regexp,.hljs-addition,.hljs-symbol,.hljs-bullet { color:${c.string}; }
  .hljs-number,.hljs-deletion { color:${c.number}; }
  .hljs-title,.hljs-name,.hljs-type { color:${c.title}; }
  .hljs-built_in,.hljs-builtin-name,.hljs-variable { color:${c.builtin}; }
  .hljs-attr,.hljs-attribute,.hljs-property,.hljs-selector-class { color:${c.attr}; }
  .hljs-emphasis { font-style:italic; } .hljs-strong { font-weight:700; }`;
}

export function buildStandaloneHTML(title, bodyHTML, theme = 'light') {
  const c = theme === 'dark' ? DARK : LIGHT;
  const safeTitle = (title || 'Belge').replace(/[<>&]/g, '');
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${safeTitle}</title>
<style>${styles(c)}</style>
</head>
<body>
<article class="markdown-body">
${bodyHTML}
</article>
</body>
</html>`;
}
