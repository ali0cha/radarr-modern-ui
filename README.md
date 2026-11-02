# Radarr — modern UI (experimental fork)

An experimental fork of [Radarr](https://github.com/Radarr/Radarr) that ports its web UI to the front-end stack [Sonarr](https://github.com/Sonarr/Sonarr) already uses. The backend is untouched: only `frontend/` and its build change.

This is a work in progress, kept apart from upstream until it is ready. It is not affiliated with, or endorsed by, the Radarr team.

> **Where is the code?** This branch, `develop`, is Radarr's own `develop` plus this README, so that it stays easy to compare with upstream. The migration lives in the branches listed under [Status](#status), stacked one on the other. To get all of it, check out the last one, `ui/calendar`:
>
> ```bash
> git checkout ui/calendar
> ```

## Goal

Move Radarr's front-end to the stack of Sonarr's, then give it the look of Sonarr v5 (design system, icons, layout), so that it is as easy to work on and as pleasant to use:

| | Radarr (upstream) | This fork |
| --- | --- | --- |
| Language | JavaScript, partly TypeScript | TypeScript for the data layer and the new code, the screens that were JavaScript keep being converted |
| Build | Webpack 5 | Vite 8 |
| Routing | React Router 5 | React Router 7, data router |
| Server data | Redux (thunks, one section per resource) | TanStack Query 5 hooks |
| Client state | Redux | zustand 5 stores, local to the component, or persisted in the browser |

## Status

**Redux is gone.** Every section of the store was moved, one piece at a time, and the packages are removed (`redux`, `react-redux`, `redux-actions`, `redux-batched-actions`, `redux-localstorage`, `redux-thunk`, `reselect`). Each piece is a branch stacked on the previous one, so that every step can be reviewed (and tried) alone. The last branch, `chore/remove-orphans`, contains all of them.

| Branches (in order) | What they do |
| --- | --- |
| `build/vite` | Webpack to Vite (CSS Modules, JSX in `.js` files, same output in `_output/UI`, including the `Content/styles.css` that the backend's login page links to) |
| `build/router` | React Router 5 to 7 with a data router and the URL base |
| `redux/query-pilot`, `redux/tags`, `redux/root-folders`, `redux/small-sections` | TanStack Query and the first sections: movie credits, tags, root folders, movie history, extra files, organize preview, parse, file system paths |
| `redux/settings-infra`, `redux/providers` | Generic settings hooks, zustand stores, persisted advanced settings; generic provider hooks (list, schema, save, test, bulk edit and delete) and the indexers |
| `redux/download-clients`, `redux/import-lists`, `redux/notifications` | The providers that use them |
| `redux/custom-formats`, `redux/auto-tagging`, `redux/delay-profiles`, `redux/release-profiles`, `redux/languages-flags`, `redux/quality` | Custom formats, auto tagging, delay and release profiles, languages, indexer flags, quality profiles and definitions |
| `redux/config-sections`, `redux/exclusions-mappings` | General, media management, naming, metadata and UI settings; import list exclusions and remote path mappings |
| `redux/history-blocklist`, `redux/queue-wanted` | The tables that the server cuts in pages: history, blocklist, queue, missing and cutoff unmet |
| `redux/movies-core`, `redux/commands`, `redux/movie-files`, `redux/collections`, `redux/calendar` | The movies and the movie index, the commands, the movie files, the collections, the calendar |
| `redux/releases`, `redux/interactive-import` | Interactive search and manual import |
| `redux/discover-movie`, `redux/add-movie`, `redux/import-movie` | Discover, adding a movie, importing the movies of a root folder |
| `redux/captcha`, `redux/oauth`, `redux/provider-options`, `redux/custom-filters` | What the forms need: the captcha, the OAuth sign in, the options that a provider gives for a field, the custom filters |
| `redux/system`, `redux/app` | The system pages (status, health, tasks, backups, updates, logs) and what the whole app shares (window size, messages, version, connection, sidebar, translations) |
| `redux/remove-redux` | The store, its middlewares and its packages are removed |
| `chore/remove-orphans` | Files that nothing imports anymore: those left by the move out of Redux, and a few that Radarr itself did not use |
| `ts/utilities` | TypeScript conversion of the utilities, independent of the others |

## Sonarr v5 look

On top of `chore/remove-orphans`, a second stack ports the redesign of Sonarr v5. It is ported screen by screen, and checked by eye on each one, because Sonarr's CSS only works where the markup is the same as Radarr's.

| Branches (in order) | What they do |
| --- | --- |
| `ui/foundations` | The design system: `oklch` themes (light, dark, color impaired), tokens, breakpoints, the Inter, Fraunces and JetBrains Mono fonts, PostCSS set up for them |
| `ui/icons` | Font Awesome replaced by [lucide](https://lucide.dev), with the icons that only Radarr uses |
| `ui/shared-css` | Sonarr's styles for the shared components: buttons, forms, modals, tables, menus, labels |
| `ui/layout` | The grouped sidebar, the header with the logo, the toolbar buttons |
| `ui/calendar` | The calendar as a table with a sticky header, the new event styles, the agenda, the movie index (posters and overview) and the settings page as cards |

The accent color is amber (`--accentHue: 85` in `Styles/Themes/themes.css`), close to Radarr's yellow. Set it to `215` to get Sonarr's blue.

**Not ported yet:** the toolbar that moves what does not fit into a menu, the *Tools* menu of the header, the redesigned movie details, discover, collections and add movie screens, and about thirty style sheets whose markup is not the same as Sonarr's (quality profiles, delay profiles, naming, root folders, interactive search). They work with the new colors and fonts, but keep their old layout.

## Things worth knowing

- **Saved preferences are kept.** The views, sorts, filters, columns, page sizes and defaults that a user chose used to be saved by `redux-localstorage` in one document. Each store that replaced a section reads what it needs from that document the first time, after the old migrations (`blacklist` renamed to `blocklist`, `preDB`, monitor saved as `true` or `false`) were applied to it, so nobody starts from scratch.
- **Small behavior changes** that came with the move, on purpose: the discover page loads again once the lists are refreshed, the reCAPTCHA of an input is shown again (it needed values that nothing gave it anymore) and the popup that adds a movie from discover closes when the movie is added instead of before.
- **The login page needed a file that Vite does not write by itself.** The backend serves `login.html` and `logout.html` itself, and they link to `Content/styles.css`, which the Webpack build wrote and the Vite build did not: the login page answered with an error for everyone who signs in with the forms authentication. It was found by starting from an empty Radarr, and the Vite step writes the file again. Anything else that the backend reads from the UI folder (`Content/` fonts, images, manifest, robots) was checked and is served.
- **Not covered:** the project has no automated tests for the front-end, and a few things were not tried for real: signing in with the OAuth providers (only up to the window of the provider, with a simulated answer), the reports that Sentry sends (its set up and the cleaning of what it would send were checked in isolation, nothing was sent), and Windows or macOS.

## Build and try it

Start from the last branch of the stack (`git checkout ui/calendar`), then:

```bash
yarn install
yarn build        # writes the UI to _output/UI
yarn typecheck
yarn lint
```

The UI is served by the Radarr backend from `_output/UI`, so to try it, point a Radarr build at that folder. With Docker, for example:

```bash
docker run -d --name radarr-ui-test -p 127.0.0.1:17878:7878 \
  -e PUID=1000 -e PGID=1000 \
  -v /tmp/radarr-test-config:/config -v /tmp/radarr-test-movies:/movies \
  -v "$PWD/_output/UI":/app/radarr/bin/UI:ro \
  lscr.io/linuxserver/radarr:develop
```

Restart that container after each build, which replaces the folder that it serves. Each migrated screen was checked by hand against a real Radarr (7.0.0.10815, `develop`): adding, editing, testing and deleting, bulk actions, validation errors, errors from the server, live updates through SignalR, losing and getting back the connection, restarting the application and restoring a backup for real, signing in and out with the forms authentication, and starting from a browser that has the preferences of the old UI as well as from an empty one and from an empty Radarr.

## Upstream

This repository is a copy of Radarr's `develop` history, licensed under the [GPL-3.0](LICENSE) like Radarr. Bugs and features of Radarr itself belong in the [upstream project](https://github.com/Radarr/Radarr); its original README follows.

---

## Radarr

[![Build Status](https://dev.azure.com/Radarr/Radarr/_apis/build/status/Radarr.Radarr?branchName=develop)](https://dev.azure.com/Radarr/Radarr/_build/latest?definitionId=1&branchName=develop)
[![Translation status](https://translate.servarr.com/widget/servarr/radarr/svg-badge.svg)](https://translate.servarr.com/engage/servarr/?utm_source=widget)
[![Docker Pulls](https://img.shields.io/docker/pulls/linuxserver/radarr.svg)](https://wiki.servarr.com/radarr/installation/docker)
![Github Downloads](https://img.shields.io/github/downloads/Radarr/Radarr/total.svg)
[![Backers on Open Collective](https://opencollective.com/Radarr/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/Radarr/sponsors/badge.svg)](#sponsors)
[![Mega Sponsors on Open Collective](https://opencollective.com/Radarr/megasponsors/badge.svg)](#mega-sponsors)

Radarr is a movie collection manager for Usenet and BitTorrent users. It can monitor multiple RSS feeds for new movies and will interface with clients and indexers to grab, sort, and rename them. It can also be configured to automatically upgrade the quality of existing files in the library when a better quality format becomes available.
Note that only one type of a given movie is supported. If you want both a 4k version and 1080p version of a given movie you will need multiple instances.

## Major Features Include

* Adding new movies with lots of information, such as trailers, ratings, etc.
* Support for major platforms: Windows, Linux, macOS, Raspberry Pi, etc.
* Can watch for better quality of the movies you have and do an automatic upgrade. _eg. from DVD to Blu-Ray_
* Automatic failed download handling will try another release if one fails
* Manual search so you can pick any release or to see why a release was not downloaded automatically
* Full integration with SABnzbd and NZBGet
* Automatically searching for releases as well as RSS Sync
* Automatically importing downloaded movies
* Recognizing Special Editions, Director's Cut, etc.
* Identifying releases with hardcoded subs
* Identifying releases with AKA movie names
* SABnzbd, NZBGet, QBittorrent, Deluge, rTorrent, Transmission, uTorrent, and other download clients are supported and integrated
* Full integration with Kodi and Plex (notifications, library updates)
* Importing Metadata such as trailers or subtitles
* Adding metadata such as posters and information for Kodi and others to use
* Advanced customization for profiles, such that Radarr will always download the copy you want
* A beautiful UI

## Support

[![Wiki](https://img.shields.io/badge/servarr-wiki-181717.svg?maxAge=60)](https://wiki.servarr.com/radarr)
[![Discord](https://img.shields.io/badge/discord-chat-7289DA.svg?maxAge=60)](https://radarr.video/discord)

Note: GitHub Issues are for Bugs and Feature Requests Only

[![GitHub - Bugs and Feature Requests Only](https://img.shields.io/badge/github-issues-red.svg?maxAge=60)](https://github.com/Radarr/Radarr/issues)

## Contributors & Developers

[API Documentation](https://radarr.video/docs/api/)

This project exists thanks to all the people who contribute.
- [Contribute (GitHub)](CONTRIBUTING.md)
- [Contribution (Wiki Article)](https://wiki.servarr.com/radarr/contributing)

[![Contributors List](https://opencollective.com/Radarr/contributors.svg?width=890&button=false)](https://github.com/Radarr/Radarr/graphs/contributors)

## Backers

Thank you to all our backers! 🙏 [Become a backer](https://opencollective.com/Radarr#backer)

[![Backers List](https://opencollective.com/Radarr/backers.svg?width=890)](https://opencollective.com/Radarr#backer)

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [Become a sponsor](https://opencollective.com/Radarr#sponsor)

[![Sponsors List](https://opencollective.com/Radarr/sponsors.svg?width=890)](https://opencollective.com/Radarr#sponsor)

## Mega Sponsors

[![Mega Sponsors List](https://opencollective.com/Radarr/tiers/mega-sponsor.svg?width=890)](https://opencollective.com/Radarr#mega-sponsor)

## JetBrains

Thank you to [<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jetbrains.png" alt="JetBrains" width="96">](http://www.jetbrains.com/) for providing us with free licenses to their great tools.

* [<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/ReSharper_icon.png" alt="ReSharper" width="32"> ReSharper](http://www.jetbrains.com/resharper/)
* [<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/WebStorm_icon.png" alt="WebStorm" width="32"> WebStorm](http://www.jetbrains.com/webstorm/)
* [<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/Rider_icon.png" alt="Rider" width="32"> Rider](http://www.jetbrains.com/rider/)
* [<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/dotTrace_icon.png" alt="dotTrace" width="32"> dotTrace](http://www.jetbrains.com/dottrace/)

## DigitalOcean

This project is also supported by DigitalOcean
<p>
  <a href="https://www.digitalocean.com/">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px">
  </a>
</p>

### License

* [GNU GPL v3](http://www.gnu.org/licenses/gpl.html)
* Copyright 2010-2025
