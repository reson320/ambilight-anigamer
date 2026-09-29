import { isWatchPageUrl, wrapErrorHandler } from './generic';
import { injectedScript } from './messaging/injected';
import SentryReporter from './errors/sentry-reporter';
import { storage } from './storage';

const THEME_LIGHT = -1;
const THEME_DEFAULT = 0;
const THEME_DARK = 1;

const MAX_THEME_CORRECTIONS = 5;
const THEME_CORRECTIONS_WINDOW = 10000;

// 動畫瘋 stores the theme the user picked in localStorage and applies it
// as the data-theme attribute on the <html> element.
const SITE_THEME_STORAGE_KEY = 'ANIME_dark_theme';

export default class Theming {
  constructor(ambientlight) {
    this.ambientlight = ambientlight;
    this.settings = ambientlight.settings;
  }

  initListeners() {
    this.siteTheme = this.getSiteTheme();

    try {
      // The theme is changed on the website in another tab
      window.addEventListener(
        'storage',
        wrapErrorHandler((e) => {
          if (e.key !== SITE_THEME_STORAGE_KEY) return;

          this.siteTheme = this.getSiteTheme();
          this.updateTheme();
        }, true)
      );
    } catch (ex) {
      SentryReporter.captureException(ex);
    }

    // The theme is changed on the website with the theme toggle,
    // or reset by the website while it initializes.
    // Limit the corrections per 10 seconds to prevent an endless loop.
    let themeCorrections = 0;
    let themeCorrectionsStart = 0;
    this.themeObserver = new MutationObserver(
      wrapErrorHandler(
        function themeMutation() {
          if (!this.updatingTheme) {
            const siteTheme = this.getSiteTheme();
            if (siteTheme !== this.siteTheme) {
              this.siteTheme = siteTheme;
            }
          }
          if (!this.shouldToggleTheme()) return;

          const now = performance.now();
          if (now - themeCorrectionsStart > THEME_CORRECTIONS_WINDOW) {
            themeCorrectionsStart = now;
            themeCorrections = 0;
          }
          if (themeCorrections >= MAX_THEME_CORRECTIONS) return;

          themeCorrections++;
          this.updateTheme();
        }.bind(this),
        true
      )
    );
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  getSiteTheme = () => {
    try {
      const stored = localStorage.getItem(SITE_THEME_STORAGE_KEY);
      if (stored === '1') return THEME_DARK;
      if (stored === '0') return THEME_LIGHT;
    } catch {
      // localStorage can be blocked
    }

    // Before the ambient light changes the theme, the attribute reflects the
    // theme of the website
    if (this.initialSiteTheme === undefined) {
      this.initialSiteTheme = this.isDarkTheme() ? THEME_DARK : THEME_LIGHT;
    }
    return this.initialSiteTheme;
  };

  isDarkTheme = () =>
    document.documentElement.getAttribute('data-theme') === 'dark';

  shouldBeDarkTheme = (enabledAndVisible) => {
    const disabled =
      enabledAndVisible === undefined
        ? !this.settings.enabled || this.ambientlight.isHidden
        : !enabledAndVisible;
    const toTheme =
      disabled || this.settings.theme === THEME_DEFAULT
        ? this.siteTheme ?? this.getSiteTheme()
        : this.settings.theme;
    return toTheme === THEME_DARK;
  };

  shouldToggleTheme = () => {
    const toDark = this.shouldBeDarkTheme();
    return !(this.isDarkTheme() === toDark || (toDark && !isWatchPageUrl()));
  };

  updateTheme = wrapErrorHandler(
    async function updateTheme(fromSettings = false) {
      if (
        this.updatingTheme ||
        (!fromSettings && this.settings.theme === THEME_DEFAULT) ||
        !this.shouldToggleTheme()
      )
        return;

      this.updatingTheme = true;

      if (this.themeToggleFailed !== false) {
        const lastFailedThemeToggle = await storage.get(
          'last-failed-theme-toggle'
        );
        if (lastFailedThemeToggle) {
          const now = new Date().getTime();
          const withinThresshold = now - 10000 < lastFailedThemeToggle;
          if (withinThresshold) {
            this.settings.setWarning(
              `上一次切換${
                this.isDarkTheme() ? '淺色' : '深色'
              }主題失敗，為了避免網頁不斷重新整理，自動切換主題已暫停 10 秒。\n\n如果一直失敗，可以把「主題」設定改成「預設」來停用自動切換主題。`
            );
            this.updatingTheme = false;
            return;
          }
          storage.set('last-failed-theme-toggle', undefined);
        }
        if (this.themeToggleFailed) {
          this.settings.setWarning('');
          this.themeToggleFailed = false;
        }

        if (!this.shouldToggleTheme()) {
          this.updatingTheme = false;
          return;
        }
      }

      await this.toggleDarkTheme();
      this.updatingTheme = false;
    }.bind(this),
    true
  );

  async updateDocumentTheme(toDark) {
    await injectedScript.postAndReceiveMessage('update-theme', toDark);
  }

  async toggleDarkTheme() {
    const wasDark = this.isDarkTheme();
    await this.updateDocumentTheme(!wasDark);

    const isDark = this.isDarkTheme();
    if (wasDark !== isDark) return;

    this.themeToggleFailed = true;
    await storage.set('last-failed-theme-toggle', new Date().getTime());
    this.settings.setWarning(
      `無法把網頁主題從${wasDark ? '深色' : '淺色'}切換成${
        isDark ? '深色' : '淺色'
      }。\n\n如果一直失敗，可以把「主題」設定改成「預設」來停用自動切換主題。`
    );
  }
}
