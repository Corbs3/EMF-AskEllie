# Changelog

## 1.3.0: Ask Ellie

### Changed
- Renamed from Circular Butterfly to Ask Ellie
- Right-click look up is now "Ask Ellie about [your words]"

## 1.2.0

### New
- Look up with Ellie: highlight text, right-click and choose "Look up with Ellie" to see the term's meaning, wing and category, with a Go to button
- Highlight a sentence and Ellie picks out any terms inside it
- "Did you mean" suggestions for partial matches
- "Teach Ellie this term" opens the custom terms page with the word filled in

### Changed
- Right-click menu shows Look up when text is highlighted, and Scan this page otherwise

## 1.1.2

### New
- Right-click quick scan: choose "Scan this page with Ellie" from the page menu to open the panel and scan straight away

### Permissions
- Added contextMenus (no warning shown to users)

## 1.1.1

### Fixed
- Scanning failed with "I can't see this page yet": the panel now opens from our own icon click handler, which grants page access
- Clicking the icon on a tab Ellie was waiting for now scans it straight away
- Theme button: the first click always changes the look, and a label shows the current theme

## 1.1.0: Circular Butterfly

Renamed from CEChecker. Meet Ellie the butterfly!

### New
- Side panel replaces the popup, so results stay open while you browse the page
- Ellie the butterfly mascot, with moods and speech bubble messages
- Biological and technical wings, based on the Butterfly Diagram, with wing meters
- Life stages (egg, caterpillar, chrysalis, butterfly) instead of a plain count
- Biological and Technical filter chips, alongside the existing categories
- Custom terms page: add your own terms, definitions, other spellings, wing and exact-capitals option (syncs to your Chrome profile)
- Results saved per tab for the session, cleared when the page changes or Chrome closes
- Light, dark and auto themes
- Flapping wings while scanning, butterflies on a full score, and a butterfly that lands on the word when you use Go to
- New butterfly icons

### Fixed
- Overlapping terms no longer double count (longest match wins)
- Acronyms and names now match exact capitals (EMF, WEF, Metabolic etc.)
- Plurals and spelling variants now match (supply chains, end-of-life, biobased, US spellings)
- Duplicate entries merged into one term with aliases (WEF, UNEP, EEA, BSI, IEMA, EPR)
- Go to counter showed the wrong number on the last match, and did not reset on a new scan
- Counts and highlights now only use visible text, so they always agree
- Terms split across formatting (for example a bold word) can now be highlighted
- Scan error message no longer sticks after a failed scan
- Leftover teal colours removed, and button text contrast improved
- Page excerpts now escape safely and start on whole words

### Permissions
- activeTab, scripting, sidePanel, storage. No access to all websites.
