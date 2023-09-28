export const getItem = (
  items: ext.tabs.Tab[] | ext.windows.Window[],
  target: ext.tabs.TabEvent | ext.windows.WindowEvent
): ext.tabs.Tab | ext.windows.Window | undefined => {
  return items.find((item) => item.id === target.id);
};

export const findMissing = (a: Array<number>, n: number): number => {
  let total = Math.floor(((n + 1) * (n + 2)) / 2);
  for (let i = 0; i < n; i++) total -= a[i];
  return total;
};

export const changeTLDrawTheme = async (
  isDarkMode: boolean,
  window: ext.windows.Window,
  webview: ext.webviews.Webview
): Promise<void> => {
  console.log(isDarkMode);
  if (isDarkMode) {
    console.log('dark mode on');
    await ext.windows.setIcon(window.id, 'icons/icon-128-dark.png');
    await ext.webviews.executeJavaScript(
      webview.id,
      `document.querySelector('.tl-container').className = 'tl-container tl-theme__dark'`
    );
  } else {
    console.log('dark mode off');
    await ext.windows.setIcon(window.id, 'icons/icon-1024.png');
    await ext.webviews.executeJavaScript(
      webview.id,
      `document.querySelector('.tl-container').className = 'tl-container tl-theme__light'`
    );
  }
};
