import { getItem } from "./utils"

let tabs: ext.tabs.Tab[] = []

ext.runtime.onEnable.addListener(() => {
  console.log('Extension Enabled')
})

ext.runtime.onExtensionClick.addListener(async () => {
  const newTab = await ext.tabs.create({
    text: 'Test'
  })
  tabs.push(newTab)
})

ext.tabs.onClickedClose.addListener(async (event) => {
  // safety check, make sure tab exists
  if (tabs.length === 0) return

  // remove (delete) the tab when the close button is clicked
  const removeTab = getItem(tabs, event) as ext.tabs.Tab
  await ext.tabs.remove(removeTab.id)
})