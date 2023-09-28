import { findMissing, getItem } from './utils';

let tabWindowIds: Array<number> = [];
let tabs: ext.tabs.Tab[] = [];
let windows: ext.windows.Window[] = [];
let webview: ext.webviews.Webview | null = null;
let websession: ext.websessions.Websession | null = null;

// ext.runtime.onEnable.addListener(() => {
//   console.log('enabled');
//   tabs = []
//   windows = []
//   webview = null
// })

ext.runtime.onExtensionClick.addListener(async () => {
  const newTab = await ext.tabs.create({
    text: `TLDraw #${findMissing(tabWindowIds, tabWindowIds.length)}`,
    icon: 'icons/icon-1024.png',
    icon_dark: 'icons/icon-128-dark.png',
    muted: true,
    mutable: false,
    closable: true,
  });

  const newWindow = await ext.windows.create({
    title: newTab.text,
    icon: 'icons/icon-1024.png',
    darkMode: 'platform',
  });

  tabWindowIds.push(findMissing(tabWindowIds, tabWindowIds.length));
  const newWindowSize = await ext.windows.getContentSize(newWindow.id);

  console.log(tabWindowIds);

  if (websession) {
    webview = await ext.webviews.create({
      window: newWindow,
      websession: websession,
      bounds: {
        x: 0,
        y: 0,
        width: newWindowSize.width,
        height: newWindowSize.height,
      },
      autoResize: { width: true, height: true },
    });
    tabs.push(newTab);
    windows.push(newWindow);

    await ext.webviews.loadFile(webview.id, 'index.html');
    console.log('existing');
    return;
  }

  websession = await ext.websessions.create({
    partition: 'TLDraw Extension',
    persistent: true,
    global: false,
    cache: true,
  });

  webview = await ext.webviews.create({
    window: newWindow,
    websession: websession,
    bounds: {
      x: 0,
      y: 0,
      width: newWindowSize.width,
      height: newWindowSize.height,
    },
    autoResize: { width: true, height: true },
  });

  await ext.websessions.setUserAgent(websession.id, `Agent #${websession.id}`);
  const getUser = await ext.websessions.getUserAgent(websession.id);

  await ext.websessions.setCookie(websession.id, {
    url: 'file:///e%3A/_CodeProjects/extstore-tldraw/dist/index.html',
    name: getUser,
    sameSite: 'no_restriction',
    path: '/',
  });

  tabs.push(newTab);
  windows.push(newWindow);

  await ext.webviews.loadFile(webview.id, 'index.html');
  console.log('new');
});

ext.tabs.onClickedClose.addListener(async (event) => {
  const getTab = getItem(tabs, event) as ext.tabs.Tab;
  const getWindow = getItem(windows, event) as ext.windows.Window;
  // safety check, make sure tab exists
  if (getTab && getTab.id) {
    // remove (delete) the tab when the close button is clicked
    tabs = tabs.filter((tab) => tab.id !== event.id);
    const getTabWindowId = Number(getTab.text.charAt(getTab.text.length - 1));
    console.log(getTabWindowId);
    tabWindowIds = tabWindowIds.filter(
      (tabWindowId) => tabWindowId !== getTabWindowId
    );
    await ext.tabs.remove(getTab.id);
  }

  // safety check, make sure window exists
  if (getWindow && getWindow.id) {
    // remove (delete) the window
    windows = windows.filter((window) => window.id !== event.id);
    await ext.windows.remove(getWindow.id);
  }
});

ext.tabs.onClicked.addListener(async (event) => {
  const getWindow = getItem(windows, event) as ext.windows.Window;
  if (getWindow && getWindow.id) {
    await ext.windows.restore(getWindow.id);
    await ext.windows.focus(getWindow.id);
  }
});

// listen for window close events
ext.windows.onClosed.addListener(async (event) => {
  const getTab = getItem(tabs, event) as ext.tabs.Tab;
  if (getTab && getTab.id) {
    tabs = tabs.filter((tab) => tab.id !== event.id);
    windows = windows.filter((window) => window.id !== event.id);
    const getTabWindowId = Number(getTab.text.charAt(getTab.text.length - 1));
    tabWindowIds = tabWindowIds.filter(
      (tabWindowId) => tabWindowId !== getTabWindowId
    );
    await ext.tabs.remove(getTab.id);
  }
});

ext.webviews.onCreated.addListener(async (event, webview) => {
  console.log(await ext.webviews.getURL(webview.id));
});
