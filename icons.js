// Simple outline icons (24x24, stroke = currentColor)
const P = {
  leaf:   "M5 21c.5-4.5 2.5-8 7-10M9 18c6.2 0 10.5-3.3 11-12V4h-4C7 4 4 8 4 13c0 1.7.6 3.5 1 5",
  cog:    "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2.5v3M12 18.5v3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M2.5 12h3M18.5 12h3M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1",
  loop:   "M4.5 12a7.5 7.5 0 0 1 13.2-4.9M18.5 3.5v4h-4M19.5 12a7.5 7.5 0 0 1-13.2 4.9M5.5 20.5v-4h4",
  users:  "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 20v-1a5.5 5.5 0 0 1 11 0v1M16 5.2a3 3 0 0 1 0 5.6M20.5 20v-1a5 5 0 0 0-3-4.6",
  store:  "M3.5 9l2-4.5h13l2 4.5M4.5 9v11h15V9M3.5 9h17M9.5 20v-5.5h5V20",
  box:    "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5",
  pencil: "M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4",
  scale:  "M12 4v16M7.5 20h9M5 7.5h14M5 7.5l-3 6.5a3 3 0 0 0 6 0L5 7.5M19 7.5l-3 6.5a3 3 0 0 0 6 0l-3-6.5",
  star:   "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  moon:   "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z",
  sun:    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  auto:   "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 3v18M12 7.5h4.5M12 12h6M12 16.5h4.5",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM20 20l-4.8-4.8",
  down:   "M12 5v14M6.5 13.5L12 19l5.5-5.5",
  plus:   "M12 5v14M5 12h14",
  trash:  "M4.5 7h15M10 11v6M14 11v6M6 7l1 13h10l1-13M9.5 7V4.5h5V7",
  edit:   "M4 20h4L19 9l-4-4L4 16v4z",
  x:      "M6 6l12 12M18 6L6 18",
  back:   "M15 5l-7 7 7 7",
};
export function icon(name, size = 16) {
  return `<svg class="icn" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[name] || P.star}"/></svg>`;
}
