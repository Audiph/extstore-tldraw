console.log('Hello World!')

ext.runtime.onEnable.addListener(() => {
  console.log('Extension Enabled')
})

ext.runtime.onExtensionClick.addListener(() => {
  console.log('Extension Clicked')
})