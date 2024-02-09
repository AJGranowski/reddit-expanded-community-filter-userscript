# Getting Started
1. Install [Violentmonkey][violentmonkey-link] or [Tampermonkey][tampermonkey-link].
2. Install the [latest release][release-link]: [![GitHub release (release name instead of tag name)][release-badge]][release-install-link]

That's it! You should be good to go!

# Usage
This userscript automatically removes posts from your muted communities on /r/all while logged in to the current version Reddit.
This feature [was previously only available on old.reddit.com][reddit-how-do-i-filter-from-all-link].

* [How to mute a community?][reddit-community-muting-link]

You can view the total number of removed posts from the userscript menu.

### Supported Platforms

Releases are tested against these platforms. Platforms not listed may not run this script correctly or at all.

| Browser | Userscript |
|-|-|
| Firefox for Desktop = [current release][firefox-desktop-install-link] | Violentmonkey = [current release][violentmonkey-firefox-addon-link] |

# Troubleshooting

### Posts from muted communities are not being removed
 * [Check that you are logged in to Reddit][reddit-login-link]. This script uses information from your Reddit account to mute posts, so you must be logged in for this script to work.

### Posts from muted communities have a dashed red border around them
* Disable debug mode by clicking **`Disable Debug Mode`** from the userscript menu.

### Not sure if the script is working
* Check that the script appears in the userscript menu. This script is configured to only work on /r/all.
* Record the **`Total Muted Posts: `** counter in the userscript menu, browse for a bit, then check it again to see if that number has increased.
* Enable debug mode by clicking **`Enable Debug Mode`** from the userscript menu. Muted posts will appear with a dashed red border, and extra information will be printed to the web console. To view console messages, open the [web console][open-console-instructions-link] and filter by `Reddit expanded community filter.user.js`.

## Reporting Bugs

If you're still experiencing an issue after troubleshooting, there may be an issue with the script itself. Feel free to open a [bug report][bug-report-link] with your issue. Please include all of the requested information in the bug report template to give us the best chance of reproducing your issue.

[bug-report-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/issues/new?assignees=&labels=bug&projects=&template=bug-report.md
[firefox-desktop-install-link]: https://www.mozilla.org/en-US/firefox/
[open-console-instructions-link]: https://appuals.com/open-browser-console/
[reddit-community-muting-link]: https://support.reddithelp.com/hc/en-us/articles/9810475384084-What-is-community-muting
[reddit-how-do-i-filter-from-all-link]: https://support.reddithelp.com/hc/en-us/articles/360060561192-How-do-I-filter-communities-I-don-t-want-to-see-from-r-all
[reddit-login-link]: https://www.reddit.com/login/
[release-badge]: https://img.shields.io/github/v/release/AJGranowski/reddit-expanded-community-filter-userscript?label=%20
[release-install-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/releases/latest/download/script.user.js
[release-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/releases/latest
[tampermonkey-link]: https://www.tampermonkey.net/
[violentmonkey-firefox-addon-link]: https://addons.mozilla.org/en-US/firefox/addon/violentmonkey
[violentmonkey-link]: https://violentmonkey.github.io/