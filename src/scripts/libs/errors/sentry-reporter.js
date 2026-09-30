// Local error reporter.
// The upstream extension sends crash reports to Sentry. This port does not
// send any data to external services, so errors are only logged to the
// browser console. The exported API is kept identical to upstream so that
// the rest of the codebase (and future upstream merges) keep working.

export const parseSettingsToSentry = () => {};

export const setVersion = () => {};

export const crashOptions = null;
export const setCrashOptions = () => {};

const MAX_REPORTS = 10;

export default class SentryReporter {
  static reportCount = 0;

  static captureException(ex) {
    try {
      // Firefox has destroyed the webpage but the extension's javascript not yet
      if (ex?.message?.includes?.(`can't access dead object`)) return;

      this.reportCount++;
      if (this.reportCount > MAX_REPORTS) return;

      if (ex?.details) {
        console.error(ex, ex.details);
      } else {
        console.error(ex);
      }

      if (this.reportCount === MAX_REPORTS) {
        console.warn(
          'Ambient light for 動畫瘋: too many errors, further errors are not logged'
        );
      }
    } catch (reportEx) {
      console.warn('Failed to log error:', ex, reportEx);
    }
  }
}
