export const getItem = (
  items: ext.tabs.Tab[] | ext.windows.Window[],
  target: ext.tabs.TabEvent | ext.windows.WindowEvent
) => {
  return items.find((item) => item.id === target.id);
};
