// We open the side panel ourselves on icon click (rather than letting Chrome do it),
// because only a real icon click grants activeTab access to the page.
const manualOpen = () => chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
manualOpen();
chrome.runtime.onInstalled.addListener(() => {
  manualOpen();
  // Right-click menu item (created once, Chrome remembers it)
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "cb-quick-scan",
      title: "Scan this page with Ellie",
      contexts: ["page", "link", "image"],
    });
    chrome.contextMenus.create({
      id: "cb-lookup",
      title: "Ask Ellie about \u201C%s\u201D",
      contexts: ["selection"],
    });
  });
});
chrome.runtime.onStartup.addListener(manualOpen);

chrome.action.onClicked.addListener(tab => {
  // Must be called straight away, while Chrome still counts it as a user click
  chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {});
  // Let the panel know this tab now allows scanning
  chrome.storage.session.set({ granted: { tabId: tab.id, at: Date.now() } });
});

// Right-click menu: quick scan, or look up highlighted text
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) return;
  if (info.menuItemId === "cb-quick-scan") {
    chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {});
    chrome.storage.session.set({ granted: { tabId: tab.id, at: Date.now(), scan: true } });
  }
  if (info.menuItemId === "cb-lookup") {
    chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {});
    const text = (info.selectionText || "").trim().slice(0, 300);
    chrome.storage.session.set({ granted: { tabId: tab.id, at: Date.now() }, lookup: { tabId: tab.id, text, at: Date.now() } });
  }
});

// Saved results belong to one page: clear them when the tab loads something new or closes
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === "loading") chrome.storage.session.remove("tab:" + tabId);
});
chrome.tabs.onRemoved.addListener(tabId => chrome.storage.session.remove("tab:" + tabId));
