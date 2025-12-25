const FIGURE_PATTERN = /<figure[^>]*>[\s\S]*?<\/figure>/gi;
const BACKGROUND_STYLE_PATTERN = /style="[^"]*background(?:-image)?\s*:[^";]*[^"]*"/gi;
const BACKGROUND_DECLARATION_PATTERN = /background(?:-image)?\s*:[^;"]*;?/gi;
const HTML_TAG_PATTERN = /<\/?[a-z][^>]*>/i;
const NON_PARAGRAPH_TAG_PATTERN = /<(?!\/?(?:p|br)\b)[^>]+>/i;
const P_TAG_WITH_PROPS_PATTERN = /<p\s+[^>]*>/i;
const PLACEHOLDER_PREFIX = '__MDTOKEN__';
const SAFE_IMAGE_SRC_PATTERN = /^(https?:\/\/|data:image\/[^;]+(?:;[^,]+)*,|blob:.*)/i;
const SAFE_LINK_HREF_PATTERN = /^https?:\/\//i;

const stripFigureTags = (input: string): string => input.replace(FIGURE_PATTERN, '');

const stripBackgroundStyles = (input: string): string =>
  input.replace(BACKGROUND_STYLE_PATTERN, match => {
    const sanitized = match
      .replace(BACKGROUND_DECLARATION_PATTERN, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return sanitized === 'style=""' ? '' : sanitized;
  });

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const escapeHtmlAttribute = (value: string): string => escapeHtml(value).replace(/`/g, '&#96;');

const sanitizeImageSrc = (src: string): string | null => {
  const trimmed = src.trim();
  if (!trimmed) return null;
  if (!SAFE_IMAGE_SRC_PATTERN.test(trimmed)) return null;
  return escapeHtmlAttribute(trimmed);
};

const sanitizeLinkHref = (href: string): string | null => {
  const trimmed = href.trim();
  if (!trimmed) return null;
  if (!SAFE_LINK_HREF_PATTERN.test(trimmed)) return null;
  return escapeHtmlAttribute(trimmed);
};

const renderInlineMarkdown = (value: string): string => {
  if (!value) return '';

  const placeholders = new Map<string, string>();
  const createPlaceholder = (html: string) => {
    const token = `${PLACEHOLDER_PREFIX}${placeholders.size}__`;
    placeholders.set(token, html);
    return token;
  };

  let text = value;

  text = text.replace(/`([^`]+)`/g, (_, code: string) =>
    createPlaceholder(`<code>${escapeHtml(code)}</code>`)
  );

  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt: string, src: string) => {
    const safeSrc = sanitizeImageSrc(src);
    if (!safeSrc) {
      return escapeHtml(`![${alt}](${src})`);
    }
    const safeAlt = escapeHtmlAttribute(alt);
    return createPlaceholder(`<img src="${safeSrc}" alt="${safeAlt}" />`);
  });

  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
    const safeHref = sanitizeLinkHref(href);
    if (!safeHref) {
      return escapeHtml(label);
    }
    return createPlaceholder(
      `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
    );
  });

  text = text.replace(/~~([^~]+)~~/g, (_, content: string) =>
    createPlaceholder(`<del>${escapeHtml(content)}</del>`)
  );

  text = text.replace(/\*\*([^*]+)\*\*/g, (_, content: string) =>
    createPlaceholder(`<strong>${escapeHtml(content)}</strong>`)
  );

  text = text.replace(/__([^_]+)__/g, (_, content: string) =>
    createPlaceholder(`<strong>${escapeHtml(content)}</strong>`)
  );

  text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, (_, content: string) =>
    createPlaceholder(`<em>${escapeHtml(content)}</em>`)
  );

  text = text.replace(/(?<!_)_([^_]+)_(?!_)/g, (_, content: string) =>
    createPlaceholder(`<em>${escapeHtml(content)}</em>`)
  );

  let escaped = escapeHtml(text);

  placeholders.forEach((html, token) => {
    escaped = escaped.split(token).join(html);
  });

  return escaped.replace(/\n/g, '<br />');
};

const markdownToHtml = (value: string): string => {
  if (!value.trim()) return '';
  const lines = value.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];

  let listState: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let blockquoteLines: string[] = [];
  let paragraphLines: string[] = [];
  let codeBlock: { lines: string[] } | null = null;

  const flushList = () => {
    if (!listState) return;
    html.push(`<${listState.type}>${listState.items.join('')}</${listState.type}>`);
    listState = null;
  };

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    const text = paragraphLines.join('\n').trim();
    if (text) {
      html.push(`<p>${renderInlineMarkdown(text)}</p>`);
    }
    paragraphLines = [];
  };

  const flushBlockquote = () => {
    if (!blockquoteLines.length) return;
    const content = markdownToHtml(blockquoteLines.join('\n'));
    html.push(`<blockquote>${content}</blockquote>`);
    blockquoteLines = [];
  };

  const flushCodeBlock = () => {
    if (!codeBlock) return;
    const code = escapeHtml(codeBlock.lines.join('\n'));
    html.push(`<pre><code>${code}</code></pre>`);
    codeBlock = null;
  };

  const closeOpenBlocks = () => {
    flushParagraph();
    flushList();
    flushBlockquote();
  };

  lines.forEach(rawLine => {
    const line = rawLine.replace(/\t/g, '    ');
    const trimmed = line.trim();

    if (/^```/.test(trimmed)) {
      if (codeBlock) {
        flushCodeBlock();
      } else {
        closeOpenBlocks();
        codeBlock = { lines: [] };
      }
      return;
    }

    if (codeBlock) {
      codeBlock.lines.push(rawLine);
      return;
    }

    if (!trimmed) {
      closeOpenBlocks();
      return;
    }

    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      closeOpenBlocks();
      html.push('<hr />');
      return;
    }

    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      flushList();
      blockquoteLines.push(line.replace(/^>\s?/, ''));
      return;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      closeOpenBlocks();
      const level = Math.min(trimmed.match(/^#{1,6}/)?.[0].length ?? 1, 6);
      const content = trimmed.replace(/^#{1,6}\s+/, '');
      html.push(`<h${level}>${renderInlineMarkdown(content)}</h${level}>`);
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      const content = line.replace(/^\d+\.\s+/, '');
      if (!listState || listState.type !== 'ol') {
        flushList();
        listState = { type: 'ol', items: [] };
      }
      listState.items.push(`<li>${renderInlineMarkdown(content)}</li>`);
      return;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      const content = line.replace(/^[-*+]\s+/, '');
      if (!listState || listState.type !== 'ul') {
        flushList();
        listState = { type: 'ul', items: [] };
      }
      listState.items.push(`<li>${renderInlineMarkdown(content)}</li>`);
      return;
    }

    paragraphLines.push(line);
  });

  flushCodeBlock();
  closeOpenBlocks();

  return html.join('\n');
};

const shouldConvertMarkdown = (value: string): boolean => {
  if (!HTML_TAG_PATTERN.test(value)) return true;
  if (NON_PARAGRAPH_TAG_PATTERN.test(value)) return false;
  if (P_TAG_WITH_PROPS_PATTERN.test(value)) return false;
  return true;
};

const normalizeMarkdownCandidate = (value: string): string =>
  value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .trim();

const convertMarkdownIfNeeded = (value: string): string => {
  if (!value) return '';
  if (!shouldConvertMarkdown(value)) {
    return value;
  }
  const normalized = HTML_TAG_PATTERN.test(value) ? normalizeMarkdownCandidate(value) : value;
  return markdownToHtml(normalized);
};

const sanitizeWithDom = (input: string): string => {
  if (typeof window === 'undefined' || !window.document) {
    return stripBackgroundStyles(stripFigureTags(input));
  }

  const container = window.document.createElement('div');
  container.innerHTML = input;

  container.querySelectorAll('figure').forEach(figure => {
    const parent = figure.parentNode;
    if (!parent) {
      figure.remove();
      return;
    }
    while (figure.firstChild) {
      parent.insertBefore(figure.firstChild, figure);
    }
    figure.remove();
  });

  container.querySelectorAll('img').forEach(node => {
    const element = node as HTMLImageElement;
    const src = element.getAttribute('src') ?? '';

    // Allow all data:image, blob:, and https:// sources without stripping attributes
    if (!SAFE_IMAGE_SRC_PATTERN.test(src)) {
      element.remove();
      return;
    }

    // Keep src, alt, width, height only — remove dangerous attributes
    const allowed = ['src', 'alt', 'width', 'height'];
    Array.from(element.attributes).forEach(attr => {
      if (!allowed.includes(attr.name.toLowerCase())) {
        element.removeAttribute(attr.name);
      }
    });

    // ensure alt exists
    if (!element.getAttribute('alt')) {
      element.setAttribute('alt', '');
    }
  });

  container.querySelectorAll('a').forEach(anchor => {
    const href = anchor.getAttribute('href') ?? '';
    if (!SAFE_LINK_HREF_PATTERN.test(href)) {
      anchor.removeAttribute('href');
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
      return;
    }
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  });

  container.querySelectorAll('[style]').forEach(node => {
    const style = node.getAttribute('style');
    if (!style) return;
    const filtered = style
      .split(';')
      .map(part => part.trim())
      .filter(part => part && !/^background(?:-image)?\s*:/i.test(part));
    if (filtered.length === 0) {
      node.removeAttribute('style');
    } else {
      node.setAttribute('style', filtered.join('; '));
    }
  });

  return container.innerHTML;
};

type SanitizeOptions = {
  convertMarkdown?: boolean;
};

export const sanitizeDescription = (value?: string | null, options?: SanitizeOptions): string => {
  if (!value) return '';
  const { convertMarkdown = true } = options ?? {};
  const content = convertMarkdown ? convertMarkdownIfNeeded(value) : value;
  return sanitizeWithDom(content);
};

export const ensureSanitizedDescription = (value?: string | null): string =>
  sanitizeDescription(value);
