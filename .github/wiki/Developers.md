Contributions are greatly appreciated! Read our [contributing guidelines][contributing-link] and feel free to get started.

# Getting Started

## Prerequisites

You should be able to build this project from any platform as long as Docker is installed.

#### Install Docker
* [Linux][docker-linux-link]
* Windows
   1. [Enable WSL][wsl-link].
   2. Follow the [Linux installation instructions][docker-linux-link] from within WSL.

## Build

1. Clone the repo:
   ```sh
   git clone https://github.com/AJGranowski/reddit-expanded-community-filter-userscript.git
   ```
2. Run the build:
   ```sh
   ./toolbox
   ```
   or
   ```sh
   npm run clean-verify
   ```

The userscript will be located at `build/release/script.user.js` once the build completes.

## Live Editing
1. Launch the watch-build and server containers:
   ```sh
   ./watch-build-server
   ```
2. Navigate to [localhost:8080/script.user.js](http://localhost:8080/script.user.js).

## Debugging

Enable debug mode by clicking **`Enable Debug Mode`** from the userscript menu. Muted posts will appear with a dashed red border, and extra information will be printed to the web console. To view console messages, open the [web console][open-console-instructions-link] and filter by `Reddit expanded community filter.user.js`.


----

# [Developer Documentation](Developer-Documentation)

[contributing-link]: https://github.com/AJGranowski/reddit-expanded-community-filter-userscript/blob/mainline/CONTRIBUTING.md
[docker-linux-link]: https://docs.docker.com/engine/install/#server
[open-console-instructions-link]: https://appuals.com/open-browser-console/
[wsl-link]: https://learn.microsoft.com/en-us/windows/wsl/install