# Radarr — modern UI (experimental fork)

An experimental fork of [Radarr](https://github.com/Radarr/Radarr) that ports its web UI to the front-end stack [Sonarr](https://github.com/Sonarr/Sonarr) already uses. The backend is untouched: only `frontend/` and its build change.

This is a work in progress, kept apart from upstream until it is ready. It is not affiliated with, or endorsed by, the Radarr team.

## Goal

Make Radarr's front-end look and behave like Sonarr's, and be as easy to work on:

| | Radarr (upstream) | This fork |
| --- | --- | --- |
| Language | JavaScript, partly TypeScript | TypeScript, converting what is left |
| Build | Webpack | Vite |
| Routing | React Router 5 | React Router 7, data router |
| Server data | Redux (thunks, one section per resource) | TanStack Query hooks |
| Client state | Redux | zustand stores, local to the component or persisted |

## Status

The migration goes one piece at a time, each on its own branch stacked on the previous one, so that every step can be reviewed (and tried) alone.

| Branch | What it does |
| --- | --- |
| `build/vite` | Webpack to Vite 8 (CSS Modules, JSX in `.js` files, same output in `_output/UI`) |
| `build/router` | React Router 5 to 7 with a data router and the URL base |
| `redux/query-pilot` | TanStack Query and the first Redux sections moved to it |
| `redux/tags`, `redux/root-folders`, `redux/small-sections` | Tags, root folders, movie history, extra files, organize preview, parse, file system paths |
| `redux/settings-infra` | Generic settings hooks, zustand stores, persisted advanced settings |
| `redux/providers` | Generic provider hooks (list, schema, save, test, bulk edit and delete), indexers |
| `redux/download-clients` | Download clients and their options |
| `redux/import-lists` | Import lists, their options and the lists that follow a person |
| `ts/utilities` | TypeScript conversion of the utilities, independent of the others |

Still on Redux: notifications, custom formats, auto tagging, delay and release profiles, quality profiles and definitions, naming, media management, metadata, UI and general settings, import list exclusions, remote path mappings; then the paged collections (history, queue, blocklist, wanted), the movie index and details, commands, and finally removing Redux itself.

## Build and try it

```bash
yarn install
yarn build        # writes the UI to _output/UI
yarn typecheck
yarn lint
```

The UI is served by the Radarr backend from `_output/UI`, so to try it, point a Radarr build at that folder. Each migrated screen was also checked by hand against a real Radarr (7.0.0.10815, `develop`): adding, editing, testing and deleting providers, bulk actions, validation errors, and live updates through SignalR.

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
