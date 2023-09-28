export const getItem = (
  items: ext.tabs.Tab[] | ext.windows.Window[],
  target: ext.tabs.TabEvent | ext.windows.WindowEvent
) => {
  return items.find((item) => item.id === target.id);
};

export const findMissing = (a: Array<number>, n: number) => {
  let total = Math.floor(((n + 1) * (n + 2)) / 2);
  for (let i = 0; i < n; i++) total -= a[i];
  return total;
};
