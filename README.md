# fetch-all-github-repos

## wip has moved

Future work on this repository has moved to the monorepo [valera-rozuvan/howtos](https://github.com/valera-rozuvan/howtos). This repo is archived for historic purposes (to preserve commit history). Navigate over to [howtos/fetch-all-github-repos](https://github.com/valera-rozuvan/howtos/tree/main/fetch-all-github-repos) to see updates (if any).

## introduction

Fetch all GitHub repos.

## Howto

You need to generate a personal access token, then you can run:

```shell
GITHUB_USER="valera-rozuvan" GITHUB_API_KEY="some_token_2334673746473" node ./index.js
```

NOTE: Replace `some_token_2334673746473` with the real token you get from [github.com/settings/tokens](https://github.com/settings/tokens).

NOTE: Replace `valera-rozuvan` with user or org you are interested in.

## License

This project is licensed under the MIT license. See [LICENSE](./LICENSE) for more details.
