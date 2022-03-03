# Paleo On The Go

Built from the Scoutside Starter repository for Shopify theme development

## Features

- Nested folder structures
- PostCSS/ES6 processing
- Live reload w/ BrowserSync
- Vue widget integration

## Setup

To get started clone the repository

```
git clone https://github.com/scoutside/paleo-on-the-go.git
```

Set Node version to 16.1.0

```
nvm use 16.1.0
```

Install the depencies

```
yarn install
```

Rename .config-sample.yml file to config.yml add replace with project settings

```
mode: development

development:
  password:[SHOPIFY_APP_PASSWORD]
  theme_id:[SHOPIFY_THEME_ID]
  store:[SHOPIFY_URL]
  timeout: 60s
  ignore_files:
    - config/settings_data.json

staging:
  password:[SHOPIFY_APP_PASSWORD]
  theme_id:[SHOPIFY_THEME_ID]
  store:[SHOPIFY_URL]
  timeout: 60s
  ignore_files:
    - config/settings_data.json

production:
  password:[SHOPIFY_APP_PASSWORD]
  theme_id:[SHOPIFY_THEME_ID]
  store:[SHOPIFY_URL]
  timeout: 60s
  ignore_files:
    - config/settings_data.json
```

If working from theme for the first time - download shopify files

```
mkdir dist && yarn run download:dev
```

## ENV Scripts

To toggle your environment change the line of code at top of config.yml, then run the corresponding commands.

```
mode: development
```

```
yarn start:dev
yarn watch:dev
```

```
mode: production
```

```
yarn start:prod
yarn watch:prod
```

If your Shopify theme is up to date with you local project, run the watch command instead of start.

```
yarn watch:dev
```

## Development Workflow

Pull the latest changes from the main branch

```
git checkout main
git fetch -p origin
git reset --hard origin/main
```

Create a new branch off of main for a new feature/fix

```
git checkout -b your-name/new-feat-or-fix
```

Run start from root to build files, deploy and watch

```
yarn start:dev
```

If making changes to vue files, open a new terminal tab, cd into the widgets/vue directory and watch

```
cd src/widgets/vue
yarn watch:prod
```

Changes may take anywhere from 10-45 seconds to build and deploy.

Once all changes are approved, deploy to production theme

```
yarn deploy:prod
```

## Notes

The repository can be used with a regular Themekit approach - adding styles/scripts directly to the base shopify folders (assets for example)But this approach defeats a lot of the repo's purpose. For details on how to use the advanced features check out the guides directory.

The webpack file contains a number of useful aliases for easier imports. For example the styles, scripts folders can be imported with these aliases `@styles` `@scripts`.

## Gotchas

The browserUpdate.js file is used to trigger BrowserSync reloads. It should not be edited.
