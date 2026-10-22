// Runs inside the web page via chrome.scripting.executeScript.
// Must be fully self-contained: no references to anything outside this function.
// action: "scan" | "jump" | "clear" | "matchText" (test helper, no DOM)
export function pageEngine(action, terms, opts = {}) {
  const HL = "data-cb-hl";
  const WORD = "\\p{L}\\p{N}_";
  const SEP = "[\\s\\u00A0\\u2010\\u2011-]+";
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const COLOURS = {
    bio:  { bg: "#EAF3DE", fg: "#27500A", on: "#639922" },
    tech: { bg: "#E6F1FB", fg: "#0C447C", on: "#185FA5" },
    both: { bg: "#FAECE7", fg: "#712B13", on: "#D85A30" },
  };

  // ── Build one regex per term (phrase + aliases) ──
  function compile(term) {
    const variants = [{ text: term.phrase, cs: !!term.cs }].concat(
      (term.aliases || []).map(a => typeof a === "string" ? { text: a, cs: !!term.cs } : { text: a.text, cs: !!a.cs })
    );
    return variants.filter(v => v.text && v.text.trim()).map(v => {
      const body = v.text.trim().split(/[\s-]+/).map(esc).join(SEP);
      const plural = v.cs ? "" : "(?:s|es)?";
      return new RegExp(`(?<![${WORD}-])${body}${plural}(?![${WORD}-])`, v.cs ? "gu" : "giu");
    });
  }

  // ── Find all matches, longest first, no overlaps ──
  function findMatches(text) {
    const all = [];
    for (const term of terms) {
      for (const re of compile(term)) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(text)) !== null) {
          if (!m[0].length) { re.lastIndex++; continue; }
          all.push({ id: term.id, start: m.index, end: m.index + m[0].length });
        }
      }
    }
    all.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
    const kept = [];
    let lastEnd = -1;
    for (const m of all) {
      if (m.start >= lastEnd) { kept.push(m); lastEnd = m.end; }
    }
    return kept;
  }

  function summarise(text, matches) {
    const byId = new Map();
    for (const m of matches) {
      if (!byId.has(m.id)) byId.set(m.id, { id: m.id, count: 0, excerpts: [] });
      const r = byId.get(m.id);
      r.count++;
      if (r.excerpts.length < 3) {
        let s = Math.max(0, m.start - 80), e = Math.min(text.length, m.end + 80);
        if (s > 0) { const sp = text.slice(s, m.start).search(/\s/); if (sp > -1) s += sp + 1; }
        if (e < text.length) { const sp = text.slice(m.end, e).search(/\s\S*$/); if (sp > -1) e = m.end + sp; }
        r.excerpts.push({
          before: (s > 0 ? "…" : "") + text.slice(s, m.start).replace(/\s+/g, " ").trimStart(),
          match: text.slice(m.start, m.end).replace(/\s+/g, " "),
          after: text.slice(m.end, e).replace(/\s+/g, " ").trimEnd() + (e < text.length ? "…" : ""),
        });
      }
    }
    return [...byId.values()];
  }

  if (action === "matchText") return summarise(opts.text, findMatches(opts.text));

  // ── DOM helpers ──
  function clear() {
    document.querySelectorAll(`[${HL}]`).forEach(el => {
      const p = el.parentNode;
      if (p) { p.replaceChild(document.createTextNode(el.textContent), el); p.normalize(); }
    });
    document.querySelectorAll("[data-cb-fly]").forEach(el => el.remove());
  }

  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "OPTION", "TEMPLATE", "SVG"]);
  const visCache = new Map();
  function visible(el) {
    if (visCache.has(el)) return visCache.get(el);
    let v = true;
    if (SKIP.has(el.tagName.toUpperCase()) || el.closest("[contenteditable=''],[contenteditable='true']")) v = false;
    else if (el.checkVisibility) v = el.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true });
    else v = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    visCache.set(el, v);
    return v;
  }
  const blockCache = new Map();
  function blockOf(el) {
    let n = el;
    while (n && n !== document.body) {
      if (!blockCache.has(n)) {
        const d = getComputedStyle(n).display;
        blockCache.set(n, !/^inline/.test(d) && d !== "contents");
      }
      if (blockCache.get(n)) return n;
      n = n.parentElement;
    }
    return document.body;
  }

  // Collect visible text nodes into one string, with a line break between blocks
  function collect() {
    const nodes = [];
    let text = "", lastBlock = null;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.parentElement && n.textContent.trim() && visible(n.parentElement))
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    });
    let n;
    while ((n = walker.nextNode())) {
      const block = blockOf(n.parentElement);
      if (lastBlock && block !== lastBlock) text += "\n";
      lastBlock = block;
      nodes.push({ node: n, start: text.length, end: text.length + n.textContent.length });
      text += n.textContent;
    }
    return { text, nodes };
  }

  // Wrap a [start,end) slice of the combined text, even across several nodes
  function wrapMatches(nodes, matches, wingOf) {
    const groups = matches.map(() => []);
    const perNode = new Map();
    matches.forEach((m, mi) => {
      for (const n of nodes) {
        if (n.end <= m.start) continue;
        if (n.start >= m.end) break;
        const a = Math.max(m.start, n.start) - n.start, b = Math.min(m.end, n.end) - n.start;
        if (!perNode.has(n.node)) perNode.set(n.node, []);
        perNode.get(n.node).push({ a, b, mi });
      }
    });
    for (const [node, ranges] of perNode) {
      ranges.sort((x, y) => y.a - x.a);
      for (const r of ranges) {
        const tail = node.splitText(r.b);
        const mid = node.splitText(r.a);
        const span = document.createElement("span");
        span.setAttribute(HL, matches[r.mi].id);
        const c = COLOURS[wingOf(matches[r.mi].id)] || COLOURS.both;
        span.style.cssText = `background:${c.bg};color:${c.fg};border-radius:3px;padding:0 1px;`;
        mid.parentNode.replaceChild(span, mid);
        span.appendChild(mid);
        groups[r.mi].unshift(span);
        void tail;
      }
    }
    return groups;
  }

  function flyTo(span, wing) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = COLOURS[wing] || COLOURS.both;
    const r = span.getBoundingClientRect();
    const fly = document.createElement("div");
    fly.setAttribute("data-cb-fly", "");
    fly.innerHTML = `<svg width="26" height="22" viewBox="0 0 26 22"><path d="M12 10C8 0 0 2 1 8c1 4 6 4 11 3Z" fill="#97C459"/><path d="M14 10C18 0 26 2 25 8c-1 4-6 4-11 3Z" fill="#85B7EB"/><path d="M12 12C6 13 4 19 8 20c3 0 4-4 4-7Z" fill="#C0DD97"/><path d="M14 12c6 1 8 7 4 8-3 0-4-4-4-7Z" fill="#B5D4F4"/><rect x="12" y="6" width="2" height="14" rx="1" fill="${c.on}"/></svg>`;
    fly.style.cssText = `position:fixed;z-index:2147483647;pointer-events:none;left:${r.left + r.width / 2 - 13}px;top:${r.top - 26}px;`;
    document.documentElement.appendChild(fly);
    fly.animate([
      { transform: "translate(60px,-60px) rotate(20deg) scale(.6)", opacity: 0 },
      { transform: "translate(0,0) rotate(0) scale(1)", opacity: 1, offset: .6 },
      { transform: "translate(0,0) scale(1)", opacity: 1, offset: .85 },
      { transform: "translate(-10px,-30px) scale(.8)", opacity: 0 },
    ], { duration: 1600, easing: "ease-out" }).onfinish = () => fly.remove();
  }

  clear();
  if (action === "clear") return true;

  const { text, nodes } = collect();
  const matches = findMatches(text);

  if (action === "scan") return summarise(text, matches);

  if (action === "jump") {
    const wingOf = id => (terms.find(t => t.id === id) || {}).wing;
    const mine = matches.filter(m => m.id === opts.id);
    if (!mine.length) return { total: 0 };
    const groups = wrapMatches(nodes, mine, wingOf);
    const idx = ((opts.index % mine.length) + mine.length) % mine.length;
    const c = COLOURS[wingOf(opts.id)] || COLOURS.both;
    const target = groups[idx];
    target.forEach(s => { s.style.cssText = `background:${c.on};color:#fff;border-radius:3px;padding:0 2px;outline:2px solid ${c.on};outline-offset:1px;`; });
    if (target[0]) {
      target[0].scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      setTimeout(() => flyTo(target[0], wingOf(opts.id)), 350);
    }
    return { total: mine.length, index: idx };
  }
}
