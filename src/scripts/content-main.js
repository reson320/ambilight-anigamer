import {
  wrapErrorHandler,
  isWatchPageUrl,
  setErrorHandler,
  setWarning,
} from './libs/generic';
import SentryReporter from './libs/errors/sentry-reporter';
import Ambientlight from './libs/ambientlight';
import Settings from './libs/settings';
import {
  getPlayerContainerElem,
  getVideoElem,
  selectors,
} from './libs/site';

setErrorHandler((ex) => SentryReporter.captureException(ex));

// video.js can replace the video element (for example between an ad and the
// episode). Move the ambient light to the new video element when that happens.
const detectDetachedVideo = () => {
  const observer = new MutationObserver(
    wrapErrorHandler(function detectDetachedVideo() {
      const ambientlight = window.ambientlight;
      if (!ambientlight) return;

      const videoElem = ambientlight.videoElem;
      if (videoElem?.isConnected) return;

      const newVideoElem = getVideoElem();
      if (!newVideoElem) return;

      ambientlight.initVideoElem(newVideoElem);
      ambientlight.start();
    }, true)
  );

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

const tryInitAmbientlight = async () => {
  if (window.ambientlight) return true;
  if (!isWatchPageUrl()) return;

  const videoElem = getVideoElem();
  if (!videoElem) return;

  const hasSettingsMenuBtnParent = !!videoElem
    .closest(selectors.videoPlayer)
    ?.querySelector(selectors.controlsRight);
  if (!hasSettingsMenuBtnParent) return;

  const contentElem = document.querySelector(selectors.content);
  if (!contentElem) return;

  const playerContainerElem = getPlayerContainerElem(videoElem);
  const headerElem = document.querySelector(selectors.header);

  window.ambientlight = await new Ambientlight(
    videoElem,
    contentElem,
    playerContainerElem,
    headerElem
  );

  detectDetachedVideo();
  return true;
};

const loadAmbientlight = async () => {
  if (!isWatchPageUrl()) return;

  if (await tryInitAmbientlight()) return;
  // The player has not been created yet

  try {
    await Settings.getStoredSettingsCached();
  } catch (ex) {
    setWarning(
      `無法載入先前的設定，請重新整理網頁再試一次。${'\n'}更新擴充功能後可能會發生這種情況。${'\n\n'}${ex?.toString()}`
    );

    if (
      !(
        ex.message === 'uninstalled' ||
        ex.message?.includes('QuotaExceededError')
      )
    ) {
      console.error(ex);
    }
  }

  // Wait for the player to be added to the page
  let initializing = false;
  let tryAgain = true;
  const observer = new MutationObserver(
    wrapErrorHandler(async function playerObserved(mutationsList, observer) {
      if (initializing) {
        tryAgain = true;
        return;
      }

      if (window.ambientlight) {
        observer.disconnect();
        return;
      }

      initializing = true;
      try {
        if (await tryInitAmbientlight()) {
          observer.disconnect();
        } else {
          while (tryAgain && !window.ambientlight) {
            tryAgain = false;
            if (await tryInitAmbientlight()) {
              observer.disconnect();
              tryAgain = false;
            }
          }
          initializing = false;
        }
      } catch (ex) {
        // Disconnect to prevent infinite loops
        observer.disconnect();
        throw ex;
      }
    }, true)
  );
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

const onLoad = wrapErrorHandler(async function onLoadCallback() {
  if (window.ambientlight !== undefined) return;

  window.ambientlight = false;
  await loadAmbientlight();
});

(function setup() {
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onLoad, { once: true });
    } else {
      onLoad();
    }
  } catch (ex) {
    SentryReporter.captureException(ex);
  }
})();
