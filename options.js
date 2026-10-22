import { GLOSSARY } from "./glossary.js";
import { icon } from "./icons.js";
import { ELLIE_SVG } from "./ellie.js";

const $ = id => document.getElementById(id);
const norm = s => s.trim().toLowerCase().replace(/[\s-]+/g, " ");
let editing = null;

$("o-ellie").innerHTML = ELLIE_SVG.replace('data-mood="ready"', 'data-mood="happy"');
const style = document.createElement("link");
style.rel = "stylesheet"; style.href = "sidepanel.css";   // reuse Ellie's artwork styles
document.head.appendChild(style);

(async () => {
  const { theme = "auto" } = await chrome.storage.local.get("theme");
  if (theme !== "auto") document.documentElement.dataset.theme = theme;
  render();
  const add = new URLSearchParams(location.search).get("add");
  if (add) {
    $("f-phrase").value = add.trim().replace(/\s+/g, " ");
    $("f-def").focus();
  }
})();

async function getCustom() {
  const all = await chrome.storage.sync.get(null);
  return Object.entries(all).filter(([k]) => k.startsWith("ct:")).map(([k, v]) => ({ key: k, ...v }))
    .sort((a, b) => (a.created || 0) - (b.created || 0));
}

async function render() {
  const items = await getCustom();
  $("count").textContent = items.length ? `(${items.length})` : "";
  const list = $("list");
  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = `<li class="empty">No custom terms yet. Add your first one above.</li>`;
    return;
  }
  for (const it of items) {
    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML = `<span class="dot ${it.wing}"></span>
      <div class="i-main"><div class="i-name"></div><div class="i-sub"></div></div>
      <button class="btn-round" data-a="edit" aria-label="Edit">${icon("edit", 16)}</button>
      <button class="btn-round" data-a="del" aria-label="Delete">${icon("trash", 16)}</button>`;
    li.querySelector(".i-name").textContent = it.phrase;
    const extras = [it.aliases?.length ? "Also: " + it.aliases.map(a => a.text ?? a).join(", ") : "", it.cs ? "Exact capitals" : ""].filter(Boolean).join(". ");
    li.querySelector(".i-sub").textContent = it.def || extras || "No definition";
    li.querySelector('[data-a="edit"]').onclick = () => startEdit(it);
    li.querySelector('[data-a="del"]').onclick = async () => {
      if (!confirm(`Delete "${it.phrase}"?`)) return;
      await chrome.storage.sync.remove(it.key);
      if (editing === it.key) resetForm();
      render();
    };
    list.appendChild(li);
  }
}

function startEdit(it) {
  editing = it.key;
  $("form-title").textContent = "Edit term";
  $("save-btn").textContent = "Save changes";
  $("cancel-btn").hidden = false;
  $("f-phrase").value = it.phrase;
  $("f-def").value = it.def || "";
  $("f-aliases").value = (it.aliases || []).map(a => a.text ?? a).join(", ");
  $("f-cs").checked = !!it.cs;
  document.querySelector(`input[name=wing][value=${it.wing || "both"}]`).checked = true;
  $("f-phrase").focus();
}

function resetForm() {
  editing = null;
  $("form").reset();
  $("form-title").textContent = "Add a term";
  $("save-btn").textContent = "Add term";
  $("cancel-btn").hidden = true;
  showErr("");
}
$("cancel-btn").onclick = resetForm;

function showErr(msg) {
  $("e-phrase").textContent = msg;
  $("f-phrase").setAttribute("aria-invalid", msg ? "true" : "false");
}
$("f-phrase").addEventListener("input", () => showErr(""));

$("form").addEventListener("submit", async e => {
  e.preventDefault();
  const phrase = $("f-phrase").value.trim().replace(/\s+/g, " ");
  if (phrase.length < 2) return showErr("Enter a term with at least 2 characters.");
  const custom = await getCustom();
  const taken = [...GLOSSARY.map(t => t.phrase), ...custom.filter(c => c.key !== editing).map(c => c.phrase)];
  if (taken.some(p => norm(p) === norm(phrase))) return showErr("That term's already on Ellie's list.");
  if (custom.length >= 200 && !editing) return showErr("You've reached the limit of 200 custom terms.");

  const aliases = $("f-aliases").value.split(",").map(s => s.trim()).filter(s => s.length > 1 && norm(s) !== norm(phrase)).slice(0, 10);
  const key = editing || "ct:" + Date.now().toString(36);
  const old = custom.find(c => c.key === editing);
  const term = {
    phrase,
    def: $("f-def").value.trim(),
    aliases,
    cs: $("f-cs").checked,
    wing: document.querySelector("input[name=wing]:checked").value,
    created: old?.created || Date.now(),
  };
  try {
    await chrome.storage.sync.set({ [key]: term });
  } catch (err) {
    return showErr("Couldn't save. Chrome sync storage might be full.");
  }
  resetForm();
  render();
});
