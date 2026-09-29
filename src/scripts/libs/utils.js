const browsersUAList = [
  { ua: 'Firefox', name: 'Firefox' },
  { ua: 'OPR', name: 'Opera' },
  { ua: 'Edg', name: 'Edge' },
  { ua: 'Chrome', name: 'Chrome' },
];

export const getBrowser = () => {
  try {
    const ua = globalThis.navigator.userAgent;
    const browser = browsersUAList.find(
      (browser) => ua.indexOf(browser.ua) >= 0
    );
    return browser ? browser.name : '';
  } catch {
    return null;
  }
};

export const getVersion = () => {
  try {
    return (chrome.runtime.getManifest() || {}).version;
  } catch {
    return null;
  }
};

// Feedback and bug reports for this port go to the GitHub issues of the fork
export const getFeedbackFormLink = () =>
  'https://github.com/reson320/anigamer-ambilight/issues';

export const getPrivacyPolicyLink = () =>
  'https://github.com/reson320/anigamer-ambilight/blob/develop/PRIVACY-POLICY.md';
