# Auth0 sample with Vue 3 and TypeScript

The original code is [from here](https://gist.github.com/K3TH3R/416e5c6627436fa87db16f57f50496d1).

I added the following:
- TypeScript refactoring
- Proper registration
- Fixed all the demo components with `inject`
- Fixed the router guards

Auth0 configuration should be provided in the `.env` file.

There's no web server included here as I don't use NodeJS. You can call any server, which listens on `http://localhost:5000/api`

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
