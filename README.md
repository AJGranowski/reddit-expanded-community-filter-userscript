[![MIT License][license-badge]][license-link]

<header align="center">
    <h1 align="center">Reddit Expanded Community Filter</h3>
    <p align="center">A userscript to filter muted communities from /r/all.</p>
</header>

## Getting Started
1. Install [Violentmonkey][violentmonkey-link] or [Tampermonkey][tampermonkey-link].
2. Install the [latest release][release-link].

~~That's it! You should be good to go!~~  
Continuous deployment isn't implemented yet, so there are no releases. You'll have to [build](#building-from-source) your own userscript from source.

## Usage
This userscript will automatically remove posts from your muted communities on /r/all while logged in to the current version Reddit.
This feature was previously only available on old.reddit.com.

* [How to mute a community?][reddit-community-muting-link]
* [How do I filter communities I don’t want to see from r/all?][reddit-how-do-i-filter-from-all-link]

### Supported Platforms

Releases are tested against these platforms. Platforms not listed may not run this script correctly or at all.

| Browser | Userscript |
|-|-|
| Firefox >= 114.x.x | [Violentmonkey][violentmonkey-link] >= 2.14.x |

----

## Building From Source

### Prerequisites

This project is built using an NPM container. You should be able to build this project with only Docker installed.

#### Install Docker
* [Linux][docker-linux-link]
* Windows
   1. [Enable WSL][wsl-link].
   2. Follow the [Linux installation instructions][docker-linux-link] from within WSL.

### Build

1. Clone the repo:
   ```sh
   git clone https://github.com/AJGranowski/reddit-expanded-community-filter-userscript.git
   ```
2. Run the build:
   ```sh
   ./toolchain
   ```

The userscript will be located at `build/release/script.user.js` once the build completes.

## Contributing

Contributions are greatly appreciated!

If you have any improvement suggestions, feel free to create a pull request.

1. [Fork][fork-link] this project.
2. Apply your contribution.
3. Ensure your changes pass the continuous integration checks.
   ```sh
   ./toolchain
   ```
5. Open a [pull request][pull-request-link] with your contribution.

[docker-linux-link]: https://docs.docker.com/engine/install/#server
[fork-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/fork
[license-badge]: https://img.shields.io/github/license/AJGranowski/reddit-expanded-community-filter-userscript.svg?style=for-the-badge
[license-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/blob/master/LICENSE.md
[pull-request-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/compare
[reddit-community-muting-link]: https://support.reddithelp.com/hc/en-us/articles/9810475384084-What-is-community-muting
[reddit-how-do-i-filter-from-all-link]: https://support.reddithelp.com/hc/en-us/articles/360060561192-How-do-I-filter-communities-I-don-t-want-to-see-from-r-all
[release-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/releases/latest
[tampermonkey-link]: https://www.tampermonkey.net/
[violentmonkey-link]: https://violentmonkey.github.io/
[wsl-link]: https://learn.microsoft.com/en-us/windows/wsl/install
