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
  await ext.webviews.executeJavaScript(
    webview.id,
    `
      document.querySelector('.tlui-toolbar__tools').innerHTML = '<button draggable="false" type="button" class="tlui-button tlui-button__normal tlui-toolbar__tools__button" data-testid="tools.select" data-tool="select" data-geo="" aria-label="tool.select" title="Select — V" data-state="selected"><div class="tlui-icon" style="-webkit-mask: url(&quot;https://unpkg.com/@tldraw/assets@2.0.0-alpha.14/icons/icon/tool-pointer.svg&quot;) center 100% / 100% no-repeat;"></div></button><button draggable="false" type="button" class="tlui-button tlui-button__normal tlui-toolbar__tools__button" data-testid="tools.hand" data-tool="hand" data-geo="" aria-label="tool.hand" title="Hand — H"><div class="tlui-icon" style="-webkit-mask: url(&quot;https://unpkg.com/@tldraw/assets@2.0.0-alpha.14/icons/icon/tool-hand.svg&quot;) center 100% / 100% no-repeat;"></div></button><div class="tlui-toolbar__divider"></div><button draggable="false" type="button" class="tlui-button tlui-button__normal tlui-toolbar__tools__button" data-testid="tools.draw" data-tool="draw" data-geo="" aria-label="tool.draw" title="Draw — D"><div class="tlui-icon" style="-webkit-mask: url(&quot;https://unpkg.com/@tldraw/assets@2.0.0-alpha.14/icons/icon/tool-pencil.svg&quot;) center 100% / 100% no-repeat;"></div></button><button draggable="false" type="button" class="tlui-button tlui-button__normal tlui-toolbar__tools__button" data-testid="tools.eraser" data-tool="eraser" data-geo="" aria-label="tool.eraser" title="Eraser — E"><div class="tlui-icon" style="-webkit-mask: url(&quot;https://unpkg.com/@tldraw/assets@2.0.0-alpha.14/icons/icon/tool-eraser.svg&quot;) center 100% / 100% no-repeat;"></div></button><div class="tlui-toolbar__divider"></div><button draggable="false" type="button" class="tlui-button tlui-button__normal tlui-toolbar__tools__button" data-testid="tools.arrow" data-tool="arrow" data-geo="" aria-label="tool.arrow" title="Arrow — A"><div class="tlui-icon" style="-webkit-mask: url(&quot;https://unpkg.com/@tldraw/assets@2.0.0-alpha.14/icons/icon/tool-arrow.svg&quot;) center 100% / 100% no-repeat;"></div></button><button draggable="false" type="button" class="tlui-button tlui-button__normal tlui-toolbar__tools__button" data-testid="tools.text" data-tool="text" data-geo="" aria-label="tool.text" title="Text — T"><div class="tlui-icon" style="-webkit-mask: url(&quot;https://unpkg.com/@tldraw/assets@2.0.0-alpha.14/icons/icon/tool-text.svg&quot;) center 100% / 100% no-repeat;"></div></button><button draggable="false" type="button" class="tlui-button tlui-button__normal tlui-toolbar__tools__button" data-testid="tools.note" data-tool="note" data-geo="" aria-label="tool.note" title="Note — N"><div class="tlui-icon" style="-webkit-mask: url(&quot;https://unpkg.com/@tldraw/assets@2.0.0-alpha.14/icons/icon/tool-note.svg&quot;) center 100% / 100% no-repeat;"></div></button><button draggable="false" type="button" class="tlui-button tlui-button__normal tlui-toolbar__tools__button" data-testid="tools.asset" data-tool="asset" data-geo="" aria-label="tool.asset" title="Asset — Ctrl U"><div class="tlui-icon" style="-webkit-mask: url(&quot;https://unpkg.com/@tldraw/assets@2.0.0-alpha.14/icons/icon/tool-media.svg&quot;) center 100% / 100% no-repeat;"></div></button><button draggable="false" type="button" class="tlui-button tlui-button__normal tlui-toolbar__tools__button" data-testid="tools.rectangle" data-tool="rectangle" data-geo="rectangle" aria-label="tool.rectangle" title="Rectangle — R"><div class="tlui-icon" style="-webkit-mask: url(&quot;https://unpkg.com/@tldraw/assets@2.0.0-alpha.14/icons/icon/geo-rectangle.svg&quot;) center 100% / 100% no-repeat;"></div></button><button draggable="false" type="button" class="tlui-button tlui-button__button tlui-toolbar__tools__button tlui-toolbar__overflow" data-testid="tools.more" title="More" id="radix-:r6:" aria-haspopup="menu" aria-expanded="false" data-state="closed" dir="ltr"><div class="tlui-icon" style="-webkit-mask: url(&quot;https://unpkg.com/@tldraw/assets@2.0.0-alpha.14/icons/icon/chevron-up.svg&quot;) center 100% / 100% no-repeat;"></div></button><button type="button"  class="tlui-button tlui-button__normal tlui-toolbar__tools__button" id="ext-branding"><>EXT</ div></button>';

      var extButton = document.getElementById('ext-branding');
      extButton.addEventListener('click', function () {
        location.href = 'https://ext.store/';
      });
    `
  );
};
