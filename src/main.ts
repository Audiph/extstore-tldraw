import {
  changeTLDrawTheme,
  createWebview,
  findMissingId,
  getItem,
} from './common/utils';

let tabWindowIds: Array<number> = [];
let tabs: ext.tabs.Tab[] = [];
let windows: ext.windows.Window[] = [];
let webview: ext.webviews.Webview | null = null;
let websession: ext.websessions.Websession | null = null;

ext.runtime.onEnable.addListener(async () => {
  console.log('Extension Enabled.');
});

// setup runtime whenever user clicks TLDraw extension
ext.runtime.onExtensionClick.addListener(async () => {
  try {
    // create new tab
    const newTab = await ext.tabs.create({
      text: `TLDraw #${findMissingId(tabWindowIds, tabWindowIds.length)}`,
      icon: 'icons/icon-1024.png',
      icon_dark: 'icons/icon-128-dark.png',
      muted: true,
      mutable: false,
      closable: true,
    });

    // create new window
    const newWindow = await ext.windows.create({
      title: newTab.text,
      icon: 'icons/icon-1024.png',
      // setting this for better UX
      minHeight: 530,
      minWidth: 600,
    });

    tabWindowIds.push(findMissingId(tabWindowIds, tabWindowIds.length));
    const newWindowSize = await ext.windows.getContentSize(newWindow.id);

    if (websession) {
      // Supposedly reusing websession so that the data persist but apparently it's not working
      webview = await createWebview(newWindow, newWindowSize, websession);
      tabs.push(newTab);
      windows.push(newWindow);
      await ext.webviews.loadFile(webview.id, 'index.html');
      return;
    }

    // create new session
    websession = await ext.websessions.create({
      partition: 'TLDraw Extension',
      persistent: true,
      global: false,
      cache: true,
    });

    // create new webview
    webview = await createWebview(newWindow, newWindowSize, websession);

    // Trying to setup Cookies and attach it for the websession if ever it's going to work. But, it's not :<
    await ext.websessions.setUserAgent(
      websession.id,
      `Agent #${websession.id}`
    );
    const getUser = await ext.websessions.getUserAgent(websession.id);

    await ext.websessions.setCookie(websession.id, {
      url: 'file:///e%3A/_CodeProjects/extstore-tldraw/dist/index.html',
      name: getUser,
      sameSite: 'no_restriction',
      path: '/',
    });

    tabs.push(newTab);
    windows.push(newWindow);

    // attach/load our html file to the window
    await ext.webviews.loadFile(webview.id, 'index.html');
  } catch (error) {
    console.error('ext.runtime.onExtensionClick', JSON.stringify(error));
  }
});

// Event handler when user closes a tab
ext.tabs.onClickedClose.addListener(async (event) => {
  try {
    const getTab = getItem(tabs, event) as ext.tabs.Tab;
    const getWindow = getItem(windows, event) as ext.windows.Window;
    // safety check, make sure tab exists
    if (getTab && getTab.id) {
      // remove (delete) the tab when the close button is clicked
      tabs = tabs.filter((tab) => tab.id !== event.id);
      const getTabWindowId = Number(getTab.text.charAt(getTab.text.length - 1));
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
  } catch (error) {
    console.error('ext.runtime.onExtensionClick', JSON.stringify(error));
  }
});

// Event handler when user clicks a tab
ext.tabs.onClicked.addListener(async (event) => {
  try {
    const getWindow = getItem(windows, event) as ext.windows.Window;
    if (getWindow && getWindow.id) {
      await ext.windows.restore(getWindow.id);
      await ext.windows.focus(getWindow.id);
    }
  } catch (error) {
    console.error('ext.runtime.onExtensionClick', JSON.stringify(error));
  }
});

// listen for window close events
ext.windows.onClosed.addListener(async (event) => {
  try {
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
  } catch (error) {
    console.error('ext.runtime.onExtensionClick', JSON.stringify(error));
  }
});

// Event handler when webview page redirects to other link
ext.webviews.onPageTitleUpdated.addListener(async (event, details) => {
  try {
    const getWindow = getItem(windows, event) as ext.windows.Window;
    const getTab = getItem(tabs, event) as ext.tabs.Tab;
    if (getWindow && getWindow.id) {
      await ext.windows.setTitle(
        getWindow.id,
        `${details.title} #${getWindow.title.charAt(
          getWindow.title.length - 1
        )}`
      );
    }
    if (getTab && getTab.id) {
      await ext.tabs.update(getTab.id, {
        text: `${details.title} #${getTab.text.charAt(getTab.text.length - 1)}`,
      });
    }
  } catch (error) {
    console.error('ext.runtime.onExtensionClick', JSON.stringify(error));
  }
});

// Event handler when user changes from dark to light mode or vice versa in EXT appearance settings
ext.windows.onUpdatedDarkMode.addListener(async (event, details) => {
  try {
    const getWebview = (await ext.webviews.query()).find(
      (webview) => webview.id === event.id
    ) as ext.webviews.Webview;
    const getWindow = (await ext.windows.query()).find(
      (window) => window.id === event.id
    ) as ext.windows.Window;
    changeTLDrawTheme(details.enabled, getWindow, getWebview);
  } catch (error) {
    console.error('ext.runtime.onExtensionClick', JSON.stringify(error));
  }
});
