import { marked } from 'marked';
import hljs from 'highlight.js/lib/common';
import DOMPurify from 'dompurify';

// GitHub-flavored markdown
marked.setOptions({ gfm: true, breaks: false });

// Make all links open in a new tab safely (applies during sanitize).
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
 * Parse markdown -> sanitized HTML string.
 * Sanitizing is important: the web build renders arbitrary user/file content.
 */
export function toHTML(markdownText) {
  const raw = marked.parse(markdownText || '');
  return DOMPurify.sanitize(raw, { ADD_ATTR: ['target'] });
}

/** Run syntax highlighting on every <pre><code> inside a container. */
export function highlightAll(container) {
  container.querySelectorAll('pre code').forEach((block) => {
    try {
      hljs.highlightElement(block);
    } catch {
      /* ignore unknown languages */
    }
  });
}

/** Sanitized + syntax-highlighted HTML string (used for HTML export). */
export function toHighlightedHTML(markdownText) {
  const tmp = document.createElement('div');
  tmp.innerHTML = toHTML(markdownText);
  highlightAll(tmp);
  return tmp.innerHTML;
}
