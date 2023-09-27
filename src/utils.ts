export const getItem = (items: ext.tabs.Tab[], target: ext.tabs.TabEvent) => {
  return items.find(item => item.id === target.id) 
}