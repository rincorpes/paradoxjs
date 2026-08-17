# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-08-17

### Fixed
- update node versions in CI workflow for paradoxjs
- rename paradoxjs package

### Changed
- Add reusable CI workflows for npm package management and notifications
- Solve conflicts from PR 29
- update old link names
- Add AGENTS.md file

## [0.4.10] - 2024-01-24
### Removed
  - `createElement` function and related files

## [0.4.9] - 2024-01-20
### Changed
  - `createElement` function replaced by `document.createElement` in `Paradox.buildElement` function because it was causing issues with elements attributes

## [0.4.8] - 2024-01-18
### Removed
  - Types sport from index

## [0.4.7] - 2024-01-18
### Fixed
  - More types issues in `Paradox.buildApp` function

## [0.4.6] - 2024-01-18
### Fixed
  - types issues in `Paradox.buildApp` function

## [0.4.5] - 2024-01-18
### Fixed
  - [#24 options property should also be included in ParadoxElementOptions](https://github.com/rincorpes/paradoxjs/issues/24) by adding new type `ParadoxElementChildren`

## [0.4.4] - 2024-01-18
### Fixed
  - [#22 RouterProps should allow key: string: any](https://github.com/rincorpes/paradoxjs/issues/22)
  - [#23 Add tag as property in ParadoxElementOptions](https://github.com/rincorpes/paradoxjs/issues/22)

## [0.4.2] - 2024-01-18
### Changed
  - Structure and module index to export types

## [0.4.1] - 2024-01-17
### Changed
  - Exports in `package.json` to include `build/buildApp/index.js` as entry point

## [0.4.0] - 2024-01-17
### Added
  - `Paradox.buildApp` function to create reactive components

### Changed
  - Typescript types

## [0.3.5] - 2024-01-13
### Added
- Docs for the paradox-app example
- Unsuscribe functionality to paradox-app example

### Changed
- paradox-app example folder structure

### Fixed
- #15: One of the `pubsub.publish` tests is failinig
    - should return an array of return values from the event subscribers
- #14: `pubsub.unsubscribe` tests fail
    - should remove a callback from the specified event
    - should return the remaining callbacks subscribed to the event

## [0.3.4] - 2024-01-11
### Added
- Tests for `Paradox.Router`
- Tests for `Paradox.pubsub`
- Paradox app example

## [0.3.3] - 2024-01-11
### Changed
- Folder structure
    - Added `tests` folder to `src`
    - Added `types` folder
- Changed `package.json` to include `types` folder, `ts-module`, and `typescript`

## [0.3.2] - 2024-01-11
### Added
- Unit tests for `Paradox.buildElement`
- ROADMAP.md file

## [0.3.1] - 2024-01-10
### Added
- `Paradox.pubsub` wildcard support

## [0.3.0] - 2024-01-09
### Added
- TypeScript support
- `Paradox.buildElement` now is a module
    - `Paradox.buildElement` added memoization for html elements

### Fixed
- `Paradox.pubsub` issue with `unsubscribe` method

### Changed
- `Paradox.pubsub` cache is now a `Set` instead of an `Array`
- Internal imports changed from `src` to `build` folder so the new entry point is `build/index.js`

## [0.2.2] - 2024-01-06
### Added
- `Paradox.pubsub.unsubscribe` method to unsubscribe a function from a topic

## [0.2.1] - 2024-01-04
### Added
- Declaration file for TypeScript

## [0.2.0] - 2023-12-16
### Added
- `paradoxApp.js` file to create a sample app
- `npm run paradox-app` command to run the sample app
- In code documentation
    - See [Paradox.buildElement](https://github.com/rincorpes/paradoxjs/blob/main/src/core/buildElement.js)
    - See [Paradox.Router](https://github.com/rincorpes/paradoxjs/blob/main/src/core/Router.js)
    - See [Paradox.pubsub](https://github.com/rincorpes/paradoxjs/blob/main/src/core/Pubsub.js)

### Changed
- `Paradox.Router`: `query` property is now a `URLSearchParams` object and `params` property is now a `Map` object wich is populated with params added in the `path` property of the route. See [Paradox.Router](https://github.com/rincorpes/paradoxjs?tab=readme-ov-file#routes-with-paradoxrouter) for more information.

## [0.1.0] - 2023-12-14
### Change
* Delete unnecessary files and update dependencies
* Ready to turn into a npm package

## [0.0.2] - 2023-03-11
### Added
* `concurrently` package to allow run the app just with `npm run dev` By [@alexsc6955](https://github.com/alexsc6955)
