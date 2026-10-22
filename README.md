# Ask Ellie

A Chrome extension that helps you spot and understand circular economy terms on any web page, with help from Ellie the butterfly.

## Features

- **Scan a page** - find circular economy terms, grouped by category, with a count for each
- **Ask Ellie about a word** - highlight text, right-click and see what it means, its cycle and category
- **Did you mean** - suggestions when you highlight part of a term
- **Two wings** - terms sorted onto the biological and technical cycles, with a meter for each
- **Life stages** - egg, caterpillar, chrysalis and butterfly, depending on how much circular language a page uses (just for fun)
- **Go to** - jump to each mention on the page, with a little butterfly showing where it is
- **Right-click quick scan** - scan any page from the right-click menu
- **Custom terms** - add your own words, definitions and other spellings, synced to your Chrome profile
- **Side panel** - stays open while you read
- **Light and dark mode** - or follow your system setting

## Install (developer mode)

1. Download or clone this repo
2. Go to `chrome://extensions` and turn on **Developer mode**
3. Click **Load unpacked** and select the folder

## Customising

**Terms** are in `glossary.js`. Each term has a category, a wing and a definition:

```js
{ phrase: "remanufacturing", cat: "Business Models", wing: "tech", def: "Restoring used products..." },
```

- `wing`: `"bio"`, `"tech"` or `"both"`
- `cs: true`: match exact capitals (for acronyms)
- `aliases`: other spellings that count as the same term

Spaces and hyphens are treated the same, and plurals are found automatically.

**Ellie's messages** are in `messages.js`.

**Font (optional)**: add `Fredoka.woff2` to the `fonts` folder. See `fonts/README.txt`.

## Permissions

| Permission | Why |
|---|---|
| `activeTab` | Read the current page only when you click the icon or right-click menu |
| `scripting` | Run the scan and highlight terms on the page |
| `sidePanel` | Show Ask Ellie in the side panel |
| `storage` | Save your theme, custom terms and per-tab results |
| `contextMenus` | Add the right-click scan and look up options |

## Privacy

Ask Ellie collects no data. See [privacy-policy.md](privacy-policy.md).

## Licence

MIT. See [LICENSE](LICENSE).
