import { getItem } from "./utils"

let tabs: ext.tabs.Tab[] = []
let windows: ext.windows.Window[] = []

ext.runtime.onEnable.addListener(() => {
  console.log('Extension Enabled')
})

ext.runtime.onExtensionClick.addListener(async () => {
  const newTab = await ext.tabs.create({
    text: `TLDraw - ${tabs.length + 1}`,
    icon: 'icons/icon-1024.png',
    icon_dark: 'icons/icon-128-dark.png',
    muted: true,
    mutable: false,
    closable: true
  })

  const newWindow = await ext.windows.create({
    title: newTab.text,
    icon: 'icons/icon-1024.png',
    fullscreenable: true,
    vibrancy: false,
    darkMode: 'platform'
  })
  tabs.push(newTab)
  windows.push(newWindow)
})

ext.tabs.onClickedClose.addListener(async (event) => {
  const getTab = getItem(tabs, event) as ext.tabs.Tab
  const getWindow = getItem(windows, event) as ext.windows.Window
  // safety check, make sure tab exists
  if (getTab && getTab.id) {
    // remove (delete) the tab when the close button is clicked
    tabs = tabs.filter(tab => tab.id !== event.id)
    await ext.tabs.remove(getTab.id)
  }

  // safety check, make sure window exists
  if (getWindow && getWindow.id) {
    // remove (delete) the window
    windows = windows.filter(window => window.id !== event.id)
    await ext.windows.remove(getWindow.id)
  }
})

ext.tabs.onClicked.addListener(async (event) => {
  const getWindow = getItem(windows, event) as ext.windows.Window
  if (getWindow && getWindow.id) {
    await ext.windows.restore(getWindow.id)
    await ext.windows.focus(getWindow.id)
  }
})

// listen for window close events
ext.windows.onClosed.addListener(async (event) => {
  const getTab = getItem(tabs, event) as ext.tabs.Tab
  if (getTab && getTab.id) {
    tabs = tabs.filter(tab => tab.id !== event.id)
    windows = windows.filter(window => window.id !== event.id)
    await ext.tabs.remove(getTab.id)
  }
})