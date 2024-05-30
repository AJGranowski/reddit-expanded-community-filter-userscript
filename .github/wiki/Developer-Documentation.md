# Project Philosophies
* `mainline` shall always be in a release-ready state.
* This project shall produce the primary build artifacts using only one command from a fresh clone (`./toolbox` or `npm run clean-verify`).
* The only prerequisite dependency of this project shall be Docker.
* Continuous Integration tests shall be reproducible on a developer's machine.
* Behavior is defined by tests, not code.

# The Release Process
1. `CI` Merge a change into `mainline`, triggering the Continuous Integration workflow.
2. `CI` Build and test the project in a Docker container from both a rootful and rootless Docker context, and store the build artifacts found in `build/release/` if the run is successful.
3. `CD` If the previous Continuous Integration workflow successfully finished, trigger the Continuous Deployment workflow.
4. `CD` If the `package.json` version is equal or less-than the current released version, stop.
5. `CD` Sign the previously uploaded build artifacts (do not rebuild).
6. `CD` Create a release and add both the build artifacts and signature file.

[ci.yml][ci-file], [cd.yml][cd-file]

# Tooling

## Toolbox

Toolbox is a shell script designed to be the main entry point for this project. In essence, all toolbox does is run commands in a temporary Docker container defined by a Docker Compose file. This is the primary purpose of this project: a proof of concept of a completely containerized toolchain. A unified environment shared between each developer and automated runner.

There are some quirks though:

#### Docker volumes
Reading and writing `node_modules` with Docker is really slow on Windows. To increase performance, these intermediate directories use Docker volumes instead of a host mount at the cost of additional complexity (mainly, permissions when Docker creates these directories on the host and container).

#### Permissions
Items created by rootful Docker (like file system mounts) will be owned by root on Linux systems. To get around this, toolbox creates these items itself and sets the owner to the current user. This is accomplished by reading the `volumes:` entry of the docker compose file with `yq` to create items on the host, and forward instructions to `Dockerfile` to create and own the matching items in the image. Running Docker in a rootless context also works.

## ESLint
Static code analysis.
Configurations found in [`eslint.config.js`][eslint-file].

## Jest
JavaScript testing framework. This project uses [`ts-jest`][ts-jest-link] instead of building then testing.
Configurations found in [`jest.config.js`][jest-file].

## TSC
TypeScript compiler. Configurations found in [`tsconfig.json`][tsconfig-file].

## Rollup
JavaScript bundler used to combine and format the project into a single file. Configurations found in [`rollup.config.js`][rollup-file].

## `scripts/buildRelease.js`
Copy and rename the Rollup bundle to `script.user.js` and create `script.meta.js`.

## npm-watch
Rebuild when files change. Used in conjunction with a local server to enable live editing.

## http-server
Serve files in the release directory with a local server. Used in conjunction with a watch build to enable live editing.

## Minisign
A simple asymmetric key signing tool because PGP is overkill.

## `scripts/verifyDeploy.js`
* Verify that the version in `script.user.js` matches the version in `script.meta.js`.
* Compare the `script.user.js` version and the version found at the update URL, and fail if the `script.user.js` version is equal or less than the remote version.

[cd-file]: ../blob/mainline/.github/workflows/cd.yml
[ci-file]: ../blob/mainline/.github/workflows/ci.yml
[eslint-file]: ../blob/mainline/eslint.config.js
[jest-file]: ../blob/mainline/jest.config.js
[rollup-file]: ../blob/mainline/rollup.config.js
[tsconfig-file]: ../blob/mainline/tsconfig.json
[ts-jest-link]: https://www.npmjs.com/package/ts-jest
