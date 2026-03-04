"use strict";

const APP_BASE = "/notes";
const CONTENT_BASE = `${APP_BASE}/content/`;
const DEFAULT_DOC = "00-index.md";

const contentEl = document.getElementById("content");
const currentPathEl = document.getElementById("current-path");
const treeEl = document.getElementById("tree");

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

function joinPath(basePath, nextPart) {
  return basePath ? `${basePath}/${nextPart}` : nextPart;
}

function getDocPathFromHash() {
  const hashRaw = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : "";
  const parsed = splitRef(safeDecode(hashRaw));
  const docPath = sanitizeDocPath(parsed.path || DEFAULT_DOC);
  return docPath || DEFAULT_DOC;
}

function highlightActiveTreeLink() {
  if (!treeEl) {
    return;
  }

  const activePath = getDocPathFromHash();

  for (const anchor of treeEl.querySelectorAll(".tree-link[data-doc-path]")) {
    const docPath = anchor.getAttribute("data-doc-path") || "";
    anchor.classList.toggle("active", docPath === activePath);
  }

  for (const details of treeEl.querySelectorAll("details[data-dir-path]")) {
    const dirPath = details.getAttribute("data-dir-path") || "";
    if (activePath.startsWith(`${dirPath}/`)) {
      details.open = true;
    }
  }
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
      anchor.setAttribute("href", `#${encodePath(resolved.path)}`);
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

function detectCodeLanguage(codeBlock) {
  const className = codeBlock.getAttribute("class") || "";

  for (const token of className.split(/\s+/)) {
    const matched = token.match(/^language-([\w-]+)$/i);
    if (matched) {
      return matched[1].toLowerCase();
    }
  }

  return "";
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  helper.style.pointerEvents = "none";
  document.body.append(helper);
  helper.select();

  const copied = document.execCommand("copy");
  helper.remove();

  if (!copied) {
    throw new Error("copy-failed");
  }
}

function decorateCodeBlocks() {
  for (const existingButton of contentEl.querySelectorAll(".copy-code-btn")) {
    existingButton.remove();
  }

  for (const preBlock of contentEl.querySelectorAll("pre")) {
    preBlock.classList.remove("has-copy-button");
    preBlock.removeAttribute("data-lang");
  }

  for (const codeBlock of contentEl.querySelectorAll("pre > code")) {
    const preBlock = codeBlock.closest("pre");
    if (!preBlock) {
      continue;
    }

    const language = detectCodeLanguage(codeBlock);
    if (language) {
      preBlock.setAttribute("data-lang", language.toUpperCase());
    }

    if (language !== "go") {
      continue;
    }

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "copy-code-btn";
    copyButton.textContent = "복사";
    copyButton.setAttribute("aria-label", "Go 코드 복사");

    copyButton.addEventListener("click", async () => {
      const rawCode = codeBlock.textContent || "";
      const codeText = rawCode.endsWith("\n") ? rawCode.slice(0, -1) : rawCode;

      try {
        await copyTextToClipboard(codeText);
        copyButton.textContent = "복사됨";
        copyButton.classList.add("copied");
      } catch (_) {
        copyButton.textContent = "실패";
        copyButton.classList.add("copy-failed");
      }

      window.setTimeout(() => {
        copyButton.textContent = "복사";
        copyButton.classList.remove("copied", "copy-failed");
      }, 1200);
    });

    preBlock.classList.add("has-copy-button");
    preBlock.append(copyButton);
  }
}

function adjustCodeBlocksForMobile() {
  const isMobileViewport = window.matchMedia("(max-width: 680px)").matches;

  for (const preBlock of contentEl.querySelectorAll("pre")) {
    preBlock.style.maxWidth = "100%";
    preBlock.style.overflowX = "auto";
    preBlock.style.webkitOverflowScrolling = "touch";
    preBlock.style.touchAction = "pan-x";

    if (isMobileViewport) {
      preBlock.style.whiteSpace = "pre-wrap";
      preBlock.style.overflowWrap = "anywhere";
      preBlock.style.wordBreak = "break-word";
    } else {
      preBlock.style.whiteSpace = "";
      preBlock.style.overflowWrap = "";
      preBlock.style.wordBreak = "";
    }
  }
}

function markdownToHtml(markdownText) {
  if (!window.marked || typeof window.marked.parse !== "function") {
    return `<pre>${escapeHtml(markdownText)}</pre>`;
  }
  return window.marked.parse(markdownText);
}

function parseDirectoryListing(htmlText) {
  const dom = new DOMParser().parseFromString(htmlText, "text/html");
  const found = [];

  for (const anchor of dom.querySelectorAll("a[href]")) {
    let href = (anchor.getAttribute("href") || "").trim();
    if (!href || href === "../" || href === "./" || href.startsWith("#") || href.startsWith("?")) {
      continue;
    }

    href = safeDecode(href);

    if (href.endsWith("/")) {
      const directoryName = href.slice(0, -1);
      if (!directoryName || directoryName === "." || directoryName === "..") {
        continue;
      }
      if (directoryName.startsWith(".")) {
        continue;
      }
      found.push({ type: "dir", name: directoryName });
      continue;
    }

    if (!href.toLowerCase().endsWith(".md") || href.startsWith(".")) {
      continue;
    }

    found.push({ type: "file", name: href });
  }

  const unique = new Map();
  for (const entry of found) {
    unique.set(`${entry.type}:${entry.name}`, entry);
  }

  return Array.from(unique.values()).sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === "dir" ? -1 : 1;
    }
    return left.name.localeCompare(right.name, "ko");
  });
}

async function fetchDirectoryEntries(dirPath) {
  const encoded = encodePath(dirPath);
  const url = encoded ? `${CONTENT_BASE}${encoded}/` : CONTENT_BASE;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  return parseDirectoryListing(html);
}

async function buildTree(dirPath = "", seen = new Set()) {
  if (seen.has(dirPath)) {
    return [];
  }

  seen.add(dirPath);
  const entries = await fetchDirectoryEntries(dirPath);
  const treeNodes = [];

  for (const entry of entries) {
    const fullPath = joinPath(dirPath, entry.name);

    if (entry.type === "dir") {
      const children = await buildTree(fullPath, seen);
      treeNodes.push({
        type: "dir",
        name: entry.name,
        path: fullPath,
        children,
      });
      continue;
    }

    treeNodes.push({
      type: "file",
      name: entry.name,
      path: fullPath,
    });
  }

  seen.delete(dirPath);
  return treeNodes;
}

function createTreeNode(node) {
  const item = document.createElement("li");

  if (node.type === "dir") {
    item.className = "tree-node";

    const details = document.createElement("details");
    details.setAttribute("data-dir-path", node.path);

    const summary = document.createElement("summary");
    summary.textContent = node.name;
    details.append(summary);

    if (node.children.length > 0) {
      const childList = document.createElement("ul");
      childList.className = "tree-children";

      for (const child of node.children) {
        childList.append(createTreeNode(child));
      }

      details.append(childList);
    }

    item.append(details);
    return item;
  }

  item.className = "tree-file";

  const link = document.createElement("a");
  link.className = "tree-link";
  link.setAttribute("data-doc-path", node.path);
  link.setAttribute("href", `#${encodePath(node.path)}`);
  link.textContent = node.name;

  item.append(link);
  return item;
}

function renderTree(treeNodes) {
  if (!treeEl) {
    return;
  }

  treeEl.innerHTML = "";

  const rootList = document.createElement("ul");
  rootList.className = "tree-root";

  for (const node of treeNodes) {
    rootList.append(createTreeNode(node));
  }

  treeEl.append(rootList);
  highlightActiveTreeLink();
}

async function loadTree() {
  if (!treeEl) {
    return;
  }

  treeEl.innerHTML = '<p class="state">Loading tree...</p>';

  try {
    const treeNodes = await buildTree();
    renderTree(treeNodes);
  } catch (error) {
    treeEl.innerHTML =
      `<p class="state error">트리를 불러오지 못했습니다: ${escapeHtml(String(error.message || error))}</p>` +
      '<p class="state">nginx의 <code>/notes/content/</code> 경로에 autoindex가 필요합니다.</p>';
  }
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
    decorateCodeBlocks();
    adjustCodeBlocksForMobile();
  } catch (error) {
    contentEl.innerHTML =
      `<p class="state error">문서를 불러오지 못했습니다: ${escapeHtml(String(error.message || error))}</p>`;
  }

  highlightActiveTreeLink();
}

window.addEventListener("hashchange", render);
window.addEventListener("resize", adjustCodeBlocksForMobile);
window.addEventListener("DOMContentLoaded", async () => {
  await loadTree();

  if (!window.location.hash) {
    window.location.hash = DEFAULT_DOC;
    return;
  }

  render();
});
