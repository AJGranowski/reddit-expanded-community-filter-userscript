[![Total Downloads of Latest Release][latest-release-downloads-badge]](#) [![Continuous Integration][continuous-integration-badge]][continuous-integration-link]

<header align="center">
    <h1 align="center">Reddit Expanded Community Filter</h1>
    <p align="center">A userscript to filter muted communities from /r/all using your account preferences.</p>
</header>

## Getting Started
1. Install [Violentmonkey][violentmonkey-link] or [Tampermonkey][tampermonkey-link].
2. Install the [latest release][release-link]: [![GitHub release (release name instead of tag name)][release-badge]][release-install-link]

That's it! You should be good to go!

## Usage
This userscript will automatically remove posts from your muted communities on /r/all while logged in to the current version Reddit.
This feature [was previously only available on old.reddit.com][reddit-how-do-i-filter-from-all-link].

* [How to mute a community?][reddit-community-muting-link]

### Supported Platforms

Releases are tested against these platforms. Platforms not listed may not run this script correctly or at all.

| Browser | Userscript |
|-|-|
| Firefox for Desktop = [current release][firefox-desktop-install-link] | Violentmonkey = [current release][violentmonkey-firefox-addon-link] |

----

## Building From Source

### Prerequisites

You should be able to build this project from any platform as long as Docker is installed.

#### Install Docker
* [Linux][docker-linux-link]
* Windows
   1. [Enable WSL][wsl-link].
   2. Follow the [Linux installation instructions][docker-linux-link] from within WSL.

Then activate [**Rootless mode**][docker-rootless-link].

### Build

1. Clone the repo:
   ```sh
   git clone https://github.com/AJGranowski/reddit-expanded-community-filter-userscript.git
   ```
2. Run the build:
   ```sh
   ./toolbox
   ```

The userscript will be located at `build/release/script.user.js` once the build completes.

## Contributing

Contributions are greatly appreciated!

If you have any improvement suggestions, feel free to [open an issue][open-issue-link] or create a pull request.

1. [Fork][fork-link] this project.
2. Apply your contribution.
3. Ensure your changes pass the continuous integration checks:
   ```sh
   chmod +x ./toolbox && ./toolbox
   ```
5. Open a [pull request][pull-request-link] with your contribution.

##### This project also supports live editing!
1. Launch the watch-build and server containers:
   ```sh
   ./watch-build-server
   ```
2. Navigate to [localhost:8080/script.user.js](http://localhost:8080/script.user.js).

[continuous-integration-badge]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/actions/workflows/ci.yml/badge.svg?branch=mainline
[continuous-integration-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/actions/workflows/ci.yml
[docker-linux-link]: https://docs.docker.com/engine/install/#server
[docker-rootless-link]: https://docs.docker.com/engine/security/rootless/
[firefox-desktop-install-link]: https://www.mozilla.org/en-US/firefox/
[fork-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/fork
[latest-release-downloads-badge]: https://img.shields.io/github/downloads/AJGranowski/reddit-expanded-community-filter-userscript/latest/script.user.js?logo=github&label=Latest%20version%20downloads&labelColor=30373d&color=ff4500
[open-issue-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/issues/new/choose
[pull-request-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/compare
[reddit-community-muting-link]: https://support.reddithelp.com/hc/en-us/articles/9810475384084-What-is-community-muting
[reddit-how-do-i-filter-from-all-link]: https://support.reddithelp.com/hc/en-us/articles/360060561192-How-do-I-filter-communities-I-don-t-want-to-see-from-r-all
[release-badge]: https://img.shields.io/github/v/release/AJGranowski/reddit-expanded-community-filter-userscript?label=%20
[release-install-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/releases/latest/download/script.user.js
[release-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/releases/latest
[tampermonkey-link]: https://www.tampermonkey.net/
[violentmonkey-firefox-addon-link]: https://addons.mozilla.org/en-US/firefox/addon/violentmonkey
[violentmonkey-link]: https://violentmonkey.github.io/
[wsl-link]: https://learn.microsoft.com/en-us/windows/wsl/install
