"use strict";

const APP_BASE = "/notes";
const CONTENT_BASE = `${APP_BASE}/content/`;
const DEFAULT_DOC = "00-index.md";

const contentEl = document.getElementById("content");
const currentPathEl = document.getElementById("current-path");

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (_) {
    return value;
  }
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizePath(pathValue) {
  const rawParts = pathValue.split("/");
  const normalized = [];

  for (const part of rawParts) {
    if (!part || part === ".") {
      continue;
    }
    if (part === "..") {
      if (normalized.length === 0) {
        return null;
      }
      normalized.pop();
      continue;
    }
    normalized.push(part);
  }

  return normalized.join("/");
}

function sanitizeDocPath(pathValue) {
  const stripped = pathValue.trim().replace(/^\/+/, "");
  const normalized = normalizePath(stripped || DEFAULT_DOC);

  if (!normalized) {
    return null;
  }

  if (normalized.startsWith(".") || normalized.includes("/.")) {
    return null;
  }

  return normalized;
}

function dirname(pathValue) {
  const lastSlash = pathValue.lastIndexOf("/");
  return lastSlash === -1 ? "" : pathValue.slice(0, lastSlash);
}

function splitRef(ref) {
  const hashIndex = ref.indexOf("#");
  const refWithoutHash = hashIndex === -1 ? ref : ref.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : ref.slice(hashIndex + 1);

  const queryIndex = refWithoutHash.indexOf("?");
  const path = queryIndex === -1 ? refWithoutHash : refWithoutHash.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : refWithoutHash.slice(queryIndex + 1);

  return { path, query, hash };
}

function isExternalRef(ref) {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(ref) || ref.startsWith("//");
}

function resolveRef(baseDocPath, ref) {
  const parsed = splitRef(ref);
  const rawPath = parsed.path.trim();

  if (!rawPath) {
    return null;
  }

  const mergedPath = rawPath.startsWith("/")
    ? rawPath.slice(1)
    : `${dirname(baseDocPath)}/${rawPath}`;

  const normalized = normalizePath(mergedPath);
  if (!normalized) {
    return null;
  }

  return {
    path: normalized,
    query: parsed.query,
    hash: parsed.hash,
  };
}

function encodePath(pathValue) {
  return pathValue
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function getDocPathFromHash() {
  const hashRaw = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : "";
  const parsed = splitRef(safeDecode(hashRaw));
  const docPath = sanitizeDocPath(parsed.path || DEFAULT_DOC);
  return docPath || DEFAULT_DOC;
}

function convertLinksAndImages(docPath) {
  for (const anchor of contentEl.querySelectorAll("a[href]")) {
    const href = anchor.getAttribute("href") || "";
    if (!href || href.startsWith("#") || isExternalRef(href)) {
      continue;
    }

    const resolved = resolveRef(docPath, safeDecode(href));
    if (!resolved) {
      continue;
    }

    if (resolved.path.toLowerCase().endsWith(".md")) {
      anchor.setAttribute("href", `#${resolved.path}`);
      continue;
    }

    const query = resolved.query ? `?${resolved.query}` : "";
    const hash = resolved.hash ? `#${resolved.hash}` : "";
    anchor.setAttribute("href", `${CONTENT_BASE}${encodePath(resolved.path)}${query}${hash}`);
  }

  for (const image of contentEl.querySelectorAll("img[src]")) {
    const src = image.getAttribute("src") || "";
    if (!src || src.startsWith("#") || isExternalRef(src) || src.startsWith("data:")) {
      continue;
    }

    const resolved = resolveRef(docPath, safeDecode(src));
    if (!resolved) {
      continue;
    }

    image.setAttribute("src", `${CONTENT_BASE}${encodePath(resolved.path)}`);
  }
}

function applyCodeHighlight() {
  if (!window.hljs || typeof window.hljs.highlightElement !== "function") {
    return;
  }

  for (const codeBlock of contentEl.querySelectorAll("pre code")) {
    window.hljs.highlightElement(codeBlock);
  }
}

function markdownToHtml(markdownText) {
  if (!window.marked || typeof window.marked.parse !== "function") {
    return `<pre>${escapeHtml(markdownText)}</pre>`;
  }
  return window.marked.parse(markdownText);
}

async function render() {
  const docPath = getDocPathFromHash();
  currentPathEl.textContent = docPath;
  contentEl.innerHTML = '<p class="state">Loading markdown...</p>';

  const url = `${CONTENT_BASE}${encodePath(docPath)}`;

  try {
    const response = await fetch(url, { cache: "default" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const markdown = await response.text();
    contentEl.innerHTML = markdownToHtml(markdown);
    convertLinksAndImages(docPath);
    applyCodeHighlight();
  } catch (error) {
    contentEl.innerHTML =
      `<p class="state error">문서를 불러오지 못했습니다: ${escapeHtml(String(error.message || error))}</p>`;
  }
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  if (!window.location.hash) {
    window.location.hash = DEFAULT_DOC;
    return;
  }
  render();
});
