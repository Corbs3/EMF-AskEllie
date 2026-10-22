import { GLOSSARY, CATEGORIES, WINGS } from "./glossary.js";
import { pageEngine } from "./engine.js";
import { icon } from "./icons.js";
import { ELLIE_SVG, MINI_BUTTERFLY, STAGE_ART } from "./ellie.js";
import { MESSAGES } from "./messages.js";

const $ = id => document.getElementById(id);
const STAGES = [["egg", "Egg"], ["caterpillar", "Caterpillar"], ["chrysalis", "Chrysalis"], ["butterfly", "Butterfly"]];
const THEMES = ["auto", "light", "dark"];
const THEME_ICON = { auto: "auto", light: "sun", dark: "moon" };

let terms = [...GLOSSARY];
let tabId = null;
let state = null;          // { results, stage, message } for the current tab
let filter = "all";
let jumpPos = {};          // term id -> next index to show
let busy = false;
let waitingForAccess = false;   // true after a scan failed for lack of access

// ── Setup ─────────────────────────────────────────────
$("ellie-wrap").innerHTML = ELLIE_SVG;
$("settings-btn").innerHTML = icon("cog", 18);
$("stages").innerHTML = STAGES.map(([k, l]) => `<li data-stage="${k}">${STAGE_ART[k]}<span>${l}</span></li>`).join("");
const ellie = document.querySelector(".ellie");

function setMood(m) { ellie.dataset.mood = m; }
function say(html) { $("bubble").innerHTML = html; }
function pick(list, n) { return list[Math.floor(Math.random() * list.length)].replace("{n}", n === 1 ? "1 term" : `${n} terms`); }
const termById = id => terms.find(t => t.id === id);

function setScanLabel(again) {
  $("scan-btn").innerHTML = `${icon("search", 17)}<span>${again ? "Scan again" : "Scan this page"}</span>`;
}

// ── Theme ─────────────────────────────────────────────
async function applyTheme(t) {
  if (t === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.dataset.theme = t;
  const btn = $("theme-btn");
  btn.innerHTML = icon(THEME_ICON[t], 18);
  btn.setAttribute("aria-label", `Theme: ${t}. Change theme`);
  btn.title = `Theme: ${t}`;
}
const systemDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
const THEME_LABEL = { auto: "Auto theme", light: "Light mode", dark: "Dark mode" };
let toastTimer;
$("theme-btn").addEventListener("click", async () => {
  const { theme = "auto" } = await chrome.storage.local.get("theme");
  // Go to the opposite of the system look first, so every click visibly does something
  const order = systemDark() ? ["auto", "light", "dark"] : ["auto", "dark", "light"];
  const next = order[(order.indexOf(theme) + 1) % order.length];
  await chrome.storage.local.set({ theme: next });
  applyTheme(next);
  const toast = $("theme-toast");
  toast.textContent = THEME_LABEL[next];
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
});
$("settings-btn").addEventListener("click", () => chrome.runtime.openOptionsPage());

// ── Custom terms ──────────────────────────────────────
async function loadCustom() {
  const all = await chrome.storage.sync.get(null);
  const custom = Object.entries(all)
    .filter(([k]) => k.startsWith("ct:"))
    .map(([k, v]) => ({ ...v, id: k, cat: "Custom" }))
    .sort((a, b) => (a.created || 0) - (b.created || 0));
  terms = [...GLOSSARY, ...custom];
}

// ── Scoring ───────────────────────────────────────────
function wingCounts(results) {
  let bio = 0, tech = 0;
  for (const r of results) {
    const w = termById(r.id)?.wing;
    if (w === "bio") bio++;
    if (w === "tech") tech++;
  }
  return { bio, tech };
}
function stageFor(results) {
  const n = results.length;
  const { bio, tech } = wingCounts(results);
  if (n === 0) return "egg";
  if (n < 4) return "caterpillar";
  if (n >= 10 && bio >= 2 && tech >= 2) return "butterfly";
  return "chrysalis";
}
function messageFor(stage, results) {
  const n = results.length;
  const { bio, tech } = wingCounts(results);
  if (stage === "chrysalis" && n >= 6 && bio >= 3 && tech === 0) return pick(MESSAGES.oneWingBio, n);
  if (stage === "chrysalis" && n >= 6 && tech >= 3 && bio === 0) return pick(MESSAGES.oneWingTech, n);
  return pick(MESSAGES[stage], n);
}
const MOOD = { egg: "sad", caterpillar: "happy", chrysalis: "joy", butterfly: "excited" };

// ── Rendering ─────────────────────────────────────────
function renderStages(stage) {
  const idx = STAGES.findIndex(([k]) => k === stage);
  document.querySelectorAll(".stages li").forEach((li, i) => {
    li.classList.toggle("on", i === idx);
    li.classList.toggle("past", idx > -1 && i < idx);
    li.toggleAttribute("aria-current", i === idx);
  });
}

function renderIdle(kind = "ready") {
  state = null;
  waitingForAccess = kind === "noAccess";
  setMood(kind === "ready" ? "ready" : "puzzled");
  say(pick(MESSAGES[kind], 0));
  renderStages(null);
  $("wings").hidden = true;
  $("chips").hidden = true;
  $("terms").innerHTML = "";
  setScanLabel(false);
}

function render(celebrate = false) {
  if (!state) return renderIdle();
  const results = state.results.filter(r => termById(r.id));
  setMood(MOOD[state.stage]);
  say(state.message);
  renderStages(state.stage);
  setScanLabel(true);

  const { bio, tech } = wingCounts(results);
  $("wings").hidden = results.length === 0;
  $("bio-n").textContent = bio;
  $("tech-n").textContent = tech;
  requestAnimationFrame(() => {
    $("bio-fill").style.width = Math.min(100, Math.round(bio / 6 * 100)) + "%";
    $("tech-fill").style.width = Math.min(100, Math.round(tech / 6 * 100)) + "%";
  });

  renderChips(results);
  renderTerms(results);
  if (celebrate && state.stage === "butterfly") flutter();
}

function renderChips(results) {
  const chips = $("chips");
  if (!results.length) { chips.hidden = true; chips.innerHTML = ""; return; }
  const { bio, tech } = wingCounts(results);
  const cats = Object.keys(CATEGORIES).map(c => [c, results.filter(r => termById(r.id).cat === c).length]).filter(([, n]) => n);
  const opts = [["all", "All", results.length, "", "loop"]];
  if (bio) opts.push(["wing:bio", "Biological", bio, "k-bio", "leaf"]);
  if (tech) opts.push(["wing:tech", "Technical", tech, "k-tech", "cog"]);
  const catOpts = cats.map(([c, n]) => ["cat:" + c, CATEGORIES[c].short, n, c === "Custom" ? "k-custom" : "k-cat", CATEGORIES[c].icon]);
  if (!opts.concat(catOpts).some(o => o[0] === filter)) filter = "all";
  const html = o => `<button class="chip ${o[3]}" data-f="${o[0]}" aria-pressed="${filter === o[0]}">${icon(o[4], 13)}${o[1]} <span class="n">${o[2]}</span></button>`;
  chips.innerHTML = opts.map(html).join("") + '<span class="chip-gap"></span>' + catOpts.map(html).join("");
  chips.hidden = false;
  chips.querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => {
    filter = b.dataset.f;
    render();
  }));
}

function passes(t) {
  if (filter === "all") return true;
  if (filter.startsWith("wing:")) return t.wing === filter.slice(5);
  if (filter.startsWith("cat:")) return t.cat === filter.slice(4);
  return true;
}

function renderTerms(results) {
  const list = $("terms");
  list.innerHTML = "";
  const shown = results.map(r => ({ r, t: termById(r.id) })).filter(x => passes(x.t))
    .sort((a, b) => b.r.count - a.r.count || a.t.phrase.localeCompare(b.t.phrase));
  if (!results.length) {
    list.innerHTML = `<li class="note">Try another page, or add your own terms with the cog button.</li>`;
    return;
  }
  for (const { r, t } of shown) {
    const li = document.createElement("li");
    li.className = "term";
    const wing = t.wing || "both";
    const pos = jumpPos[t.id];
    li.innerHTML = `
      <div class="term-head">
        <span class="tile w-${wing}" title="${WINGS[wing].label}">${icon(WINGS[wing].icon, 17)}</span>
        <button class="t-main" style="background:none;border:none;text-align:left" aria-expanded="false">
          <div class="t-name"></div>
          <div class="t-sub">${r.count} mention${r.count === 1 ? "" : "s"}, tap for details</div>
        </button>
        <button class="go ${pos ? "used" : ""}">${icon("down", 13)}<span>${pos ? `${pos.shown} of ${r.count}` : "Go to"}</span></button>
      </div>
      <div class="t-more"><p class="t-def"></p></div>`;
    li.querySelector(".t-name").textContent = t.phrase;
    li.querySelector(".t-def").textContent = t.def || "Your own custom term.";
    const more = li.querySelector(".t-more");
    for (const ex of r.excerpts) {
      const d = document.createElement("div");
      d.className = "ex";
      const m = document.createElement("mark");
      m.textContent = ex.match;
      d.append(ex.before, m, ex.after);
      more.appendChild(d);
    }
    const toggle = li.querySelector(".t-main");
    toggle.addEventListener("click", () => {
      const open = li.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    li.querySelector(".go").addEventListener("click", () => jump(t.id, li.querySelector(".go")));
    list.appendChild(li);
  }
}

function flutter() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = $("flutter");
  box.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const s = document.createElement("span");
    s.innerHTML = MINI_BUTTERFLY;
    s.style.left = (5 + Math.random() * 85) + "%";
    s.style.width = (16 + Math.random() * 14) + "px";
    s.style.animationDelay = (Math.random() * .8) + "s";
    s.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
    s.style.setProperty("--rot", (Math.random() * 60 - 30) + "deg");
    box.appendChild(s);
  }
  setTimeout(() => (box.innerHTML = ""), 3800);
}

// ── Look up ───────────────────────────────────────────
$("lk-close").innerHTML = icon("x", 14);
$("lk-close").addEventListener("click", () => {
  $("lookup").hidden = true;
  if (state) say(state.message); else renderIdle(waitingForAccess ? "noAccess" : "ready");
  if (state) setMood(MOOD[state.stage]);
});

function lookupCard(t) {
  const wing = t.wing || "both";
  const cat = CATEGORIES[t.cat] || CATEGORIES.Custom;
  const div = document.createElement("div");
  div.className = "lk-term";
  div.innerHTML = `
    <div class="lk-row">
      <span class="tile w-${wing}">${icon(WINGS[wing].icon, 17)}</span>
      <span class="lk-name"></span>
      <button class="go">${icon("down", 13)}<span>Go to</span></button>
    </div>
    <p class="lk-def"></p>
    <div class="lk-tags">
      <span class="chip ${wing === "bio" ? "k-bio" : wing === "tech" ? "k-tech" : "k-cat"}">${icon(WINGS[wing].icon, 12)}${WINGS[wing].label}</span>
      <span class="chip ${t.cat === "Custom" ? "k-custom" : "k-cat"}">${icon(cat.icon, 12)}${t.cat}</span>
    </div>`;
  div.querySelector(".lk-name").textContent = t.phrase;
  div.querySelector(".lk-def").textContent = t.def || "Your own custom term.";
  div.querySelector(".go").addEventListener("click", e => jump(t.id, e.currentTarget));
  return div;
}

function suggestions(text) {
  const words = text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w => w.length >= 3);
  if (!words.length) return [];
  return terms
    .map(t => ({ t, hits: words.filter(w => t.phrase.toLowerCase().includes(w)).length }))
    .filter(x => x.hits)
    .sort((a, b) => b.hits - a.hits || a.t.phrase.length - b.t.phrase.length)
    .slice(0, 4).map(x => x.t);
}

function showLookup(text) {
  if (!text) return;
  $("lk-text").textContent = text.length > 60 ? text.slice(0, 60) + "…" : text;
  const body = $("lk-body");
  body.innerHTML = "";
  const found = pageEngine("matchText", terms, { text })
    .sort((a, b) => b.count - a.count).map(r => termById(r.id)).filter(Boolean);

  if (found.length) {
    found.slice(0, 3).forEach(t => body.appendChild(lookupCard(t)));
    setMood("excited");
    say(found.length > 1 ? pick(MESSAGES.lookupMany, found.length) : pick(MESSAGES.lookupFound, 1));
  } else {
    const maybe = suggestions(text);
    if (maybe.length) {
      const wrap = document.createElement("div");
      wrap.className = "lk-maybe";
      maybe.forEach(t => {
        const b = document.createElement("button");
        b.className = "chip";
        b.innerHTML = icon(WINGS[t.wing || "both"].icon, 12);
        b.append(t.phrase);
        b.addEventListener("click", () => showLookup(t.phrase));
        wrap.appendChild(b);
      });
      body.appendChild(wrap);
      setMood("happy");
      say(pick(MESSAGES.lookupMaybe, 0));
    } else {
      setMood("puzzled");
      say(pick(MESSAGES.lookupNone, 0));
    }
    const teach = document.createElement("div");
    teach.className = "lk-none";
    teach.innerHTML = `<button class="btn-main">${icon("plus", 15)}<span>Teach Ellie this term</span></button>`;
    teach.querySelector("button").addEventListener("click", () =>
      chrome.tabs.create({ url: chrome.runtime.getURL("options.html?add=" + encodeURIComponent(text.slice(0, 80))) }));
    body.appendChild(teach);
  }
  $("lookup").hidden = false;
  $("lookup").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ── Talking to the page ───────────────────────────────
async function run(action, opts) {
  const [res] = await chrome.scripting.executeScript({
    target: { tabId },
    func: pageEngine,
    args: [action, terms.map(({ id, phrase, aliases, cs, wing }) => ({ id, phrase, aliases, cs, wing })), opts || {}],
  });
  return res?.result;
}

function errorKind(err) {
  const msg = String(err?.message || err);
  if (/chrome:\/\/|chrome-extension|Web Store|edge:\/\/|about:|cannot be scripted|extensions gallery/i.test(msg)) return "blocked";
  return "noAccess";
}

async function scan() {
  if (busy || tabId == null) return;
  busy = true;
  setMood("scanning");
  say("Fluttering around the page…");
  $("scan-btn").disabled = true;
  const started = Date.now();
  try {
    const results = await run("scan");
    const wait = 700 - (Date.now() - started);   // let the wings flap for a moment
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    const stage = stageFor(results);
    state = { results, stage, message: messageFor(stage, results) };
    jumpPos = {};
    filter = "all";
    await chrome.storage.session.set({ ["tab:" + tabId]: state });
    render(true);
  } catch (e) {
    renderIdle(errorKind(e));
  } finally {
    busy = false;
    $("scan-btn").disabled = false;
  }
}
$("scan-btn").addEventListener("click", scan);

async function jump(id, btn) {
  const next = jumpPos[id]?.next ?? 0;
  try {
    const out = await run("jump", { id, index: next });
    if (!out?.total) { btn.querySelector("span").textContent = "Not visible"; return; }
    jumpPos[id] = { shown: out.index + 1, next: (out.index + 1) % out.total };
    btn.classList.add("used");
    btn.querySelector("span").textContent = `${out.index + 1} of ${out.total}`;
  } catch (e) {
    renderIdle(errorKind(e));
  }
}

// ── Tabs and saved results ────────────────────────────
async function loadTab(id) {
  if (id !== tabId) $("lookup").hidden = true;
  tabId = id;
  jumpPos = {};
  filter = "all";
  const key = "tab:" + id;
  const saved = (await chrome.storage.session.get(key))[key];
  if (saved) { state = saved; render(false); } else renderIdle();
}

chrome.tabs.onActivated.addListener(({ tabId: id, windowId }) => {
  chrome.windows.getCurrent().then(w => { if (w.id === windowId) loadTab(id); });
});
chrome.storage.onChanged.addListener((changes, area) => {
  const lk = area === "session" ? changes.lookup?.newValue : null;
  if (lk && lk.tabId === tabId) { waitingForAccess = false; showLookup(lk.text); return; }
  const g = area === "session" ? changes.granted?.newValue : null;
  if (g?.scan && g.tabId === tabId && !busy) {          // right-click quick scan
    waitingForAccess = false;
    scan();
    return;
  }
  if (g && g.tabId === tabId && waitingForAccess && !busy) {
    waitingForAccess = false;
    setMood("happy");
    say("Thanks! I can see the page now. Let's go…");
    setTimeout(scan, 500);
    return;
  }
  if (area === "session" && tabId != null && ("tab:" + tabId) in changes && !changes["tab:" + tabId].newValue && !busy) renderIdle();
  if (area === "sync" && Object.keys(changes).some(k => k.startsWith("ct:"))) loadCustom().then(() => render());
});

// ── Start ─────────────────────────────────────────────
(async () => {
  const { theme = "auto" } = await chrome.storage.local.get("theme");
  applyTheme(theme);
  await loadCustom();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return renderIdle();
  await loadTab(tab.id);
  // Panel was just opened by a right-click quick scan: do the scan now
  const { granted, lookup } = await chrome.storage.session.get(["granted", "lookup"]);
  if (lookup && lookup.tabId === tab.id && Date.now() - lookup.at < 5000) showLookup(lookup.text);
  if (granted?.scan && granted.tabId === tab.id && Date.now() - granted.at < 5000) scan();
})();
