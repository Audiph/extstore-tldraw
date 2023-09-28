import {
  ExtApiTypes,
  ExtBranding,
  ExtEventTypes,
  TLDrawDarkTheme,
  TLDrawLightTheme,
} from './constants';

/** Gets item needed to be used
 *  @param items Array of Objects to choose from
 *  @param target item to get
 */
export const getItem = (
  items: ExtApiTypes[],
  target: ExtEventTypes
): ExtApiTypes | undefined => {
  return items.find((item) => item.id === target.id);
};

/** function to find missing ID from order
 *  @param array array of ordered Window/Tab IDs
 *  @param N the array length
 */
export const findMissingId = (array: Array<number>, N: number): number => {
  let total = Math.floor(((N + 1) * (N + 2)) / 2);
  for (let i = 0; i < N; i++) total -= array[i];
  return total;
};

/** Sets Theme appearance whenever user changes it from EXT settings
 *  @param isDarkMode getting its value from onUpdatedDarkMode handler
 *  @param window window to be changed
 *  @param webview webview to be changed
 */
export const changeTLDrawTheme = async (
  isDarkMode: boolean,
  window: ext.windows.Window,
  webview: ext.webviews.Webview
): Promise<void> => {
  if (isDarkMode) {
    // setup icon and theme to dark if isDarkMode is true
    await ext.windows.setIcon(window.id, 'icons/icon-128-dark.png');
    await ext.webviews.executeJavaScript(webview.id, TLDrawDarkTheme);
  } else {
    // setup icon and theme to light if isDarkMode is false
    await ext.windows.setIcon(window.id, 'icons/icon-1024.png');
    await ext.webviews.executeJavaScript(webview.id, TLDrawLightTheme);
  }
  /**
   * Since the initial open of window is not working, setting it up here will work.
   * Whenever onUpdatedDarkMode runs, button menus will update and EXT-branding button will be added
   * @param extButton button id that's been setup so we can add an event listener to redirect to ext.store whenever clicked
   */
  await ext.webviews.executeJavaScript(webview.id, ExtBranding);
};

// function to create new webview
export const createWebview = async (
  window: ext.windows.Window,
  windowSize: ext.windows.Size,
  websession: ext.websessions.Websession
): Promise<ext.webviews.Webview> => {
  return await ext.webviews.create({
    window: window,
    websession: websession,
    bounds: {
      x: 0,
      y: 0,
      width: windowSize.width,
      height: windowSize.height,
    },
    autoResize: { width: true, height: true },
    javascript: true,
  });
};
