# Changelog

Notable changes for Password Strength releases.

## v2.0.0 - 2026-06-23

- Migrated zxcvbn-ts from 3.x to 4.x and updated runtime usage to `ZxcvbnFactory`.
- Added zxcvbn dictionary/feedback packages for Arabic, Croatian, Czech, Danish, Kurdish, Persian, Romanian, Thai, Turkish and Chinese.
- Moved zxcvbn-ts language resolution from Twig into PHP and added phpBB-to-zxcvbn language mapping.
- Added extension language packs for Danish, Kurdish, Romanian and Thai.
- Added missing ACP language files for existing translations.
- Removed emoji from password strength result labels.
- Replaced password field background coloring with an accessible segmented strength meter.
- Added a localized "Password strength" status prefix to every language pack.
- Enabled password strength on password reset forms.
- Updated tests for language resolution and current UI behavior.

## v1.3.1 - 2025-12-17

- Updated zxcvbn-ts libraries and extension dependencies.
- Refactored the complexity strength checker script.
- Improved password strength output reliability.
- Used phpBB `lang_js()` for JavaScript language strings.
- Tightened when password strength assets are loaded.
- Fixed ACP behavior.
- Updated phpBB requirements, tests, CI and Composer metadata.

## v1.3.0 - 2023-04-03

- Replaced bundled Dropbox zxcvbn with zxcvbn-ts.
- Began managing zxcvbn assets through npm.
- Removed jQuery usage from the password strength script.
- Added user input data to zxcvbn checks.
- Added support for phpBB 3.3.10 template events.
- Dropped phpBB 3.1 support and removed deprecated code.
- Added Spanish casual-form language files.
- Updated language packs, including emoji strength labels.
- Modernized tests, GitHub Actions and Codecov setup.

## v1.2.3 - 2020-02-06

- Added Hebrew translation.
- Updated JavaScript implementation.
- Switched ACP select rendering to phpBB's `build_select()` helper.
- Updated test environment for phpBB 3.3.
- Updated Composer license metadata and CI configuration.

## v1.2.2 - 2018-01-22

- Updated zxcvbn to 4.4.2.
- Namespaced included templates.
- Added an Arabic ACP language file.
- Updated Arabic and French translations.
- Updated test environment and README assets.

## v1.2.1 - 2017-01-10

- Raised minimum requirements.
- Improved event listener code and tests.
- Added Spanish ACP translation.
- Updated Russian, Turkish, Croatian and Brazilian Portuguese translations.
- Updated the EPV/test setup and build script.

## v1.2.0 - 2016-01-24

- Added zxcvbn-based password strength algorithm as an alternative to complexity scoring.
- Added ACP setting to choose the password strength algorithm.
- Added Swedish, Turkish, Russian, Japanese, Simplified Chinese and Traditional Chinese translations.
- Updated Dutch, French and German translations.
- Refactored password strength JavaScript and template integration.
- Added the build script and reorganized zxcvbn library files.
- Improved test coverage.

## v1.1.0 - 2014-12-10

- Stable phpBB extension release.
- Added Composer installer support.
- Added Estonian, Bulgarian and Italian translations.
- Refactored JavaScript and language handling.
- Added EPV testing.
- Updated the version check location and release metadata.

## v1.1.0-b2 - 2014-07-12

- Added Persian and Dutch translations.
- Added unit testing and code-sniffer cleanup.
- Updated Composer and phpBB extension requirements.
- Removed `ext.php` for RC2 packaging.

## v1.1.0-b1 - 2014-06-06

- Ported Password Strength from MOD package to phpBB extension structure.
- Added event listener service integration and template events.
- Added ACP integration.
- Added GPL license and Composer metadata.
- Added Spanish, Ukrainian, German, Brazilian Portuguese, Czech and Greek translations.
- Added version check support.
- Added Croatian and French translations while still in MOD history.
- Updated README and package layout.

## v1.0.3 - 2011-08-15

- Added Polish translation.
- Updated bundled jQuery to 1.6.2.
- Refactored jQuery inclusion checks for front-end and ACP styles.
- Fixed homepage URLs.

## v1.0.2 - 2011-06-05

- Used phpBB `LA_` template variables for safer JavaScript escaping.
- Moved strength color hex values into templates for easier per-style customization.
- Added uncompressed JavaScript to `contrib`.
- Improved jQuery inclusion handling.
- Updated README and installer instructions.

## v1.0.1 - 2011-05-16

- Updated bundled jQuery to 1.6.1.
- Updated README.

## v1.0.0 - 2011-05-14

- First stable release.

## v0.0.6 - 2011-05-14

- Release-candidate package for the original phpBB MOD.
- Added phpBB language-system support.
- Moved scripts to the bottom of pages.
- Updated bundled jQuery to 1.6.
- Centralized script files and improved JavaScript reliability.
- Preserved original password field color when the strength display resets.
- Added README and MOD package structure.
