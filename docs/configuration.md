## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Command reference [here](https://angular.io/cli/serve). 

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Configuration

Configuration for this application can be found in the `src/environments` folder.
### environment.ts


```typescript
export const environment = {
  production: true,
  keycloakUrl: 'https://auth.domain.tld/auth',
  multiTenant: true,
  defaultRealm: 'XYZRealm',
  baseUrl: '/',
  realmRegExp: '^https?://[^/]+/([-a-z-A-Z-0-9]+)',
  laapi: 'https://api.domain.tld/v1/',
  aems: 'https://api.aems.domain.tld/v1/',
};
```

There are configurations for each stage (dev, int, prod) Those configurations are available on the `angular.json` configuration file.

E.g:
 - Targeting the app for the prod stage

### angular.json

```json
{
  "integration": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  }
}
```

## Build process

The Angular application is built into Docker containers and exposed thru NGINX.

Build itself is performed 
```bash
$ npm run ng build -- --configuration=${PROFILE} --output-path=dist
```

Command reference [here](https://angular.io/cli/build). 

## Deployment

The app is deploy on AWS EKS via CI/CD Pipelines.


If you intend to build an image of the application, you simply run the following docker commands with the respective environment, profile and target image.

```bash
docker build -t ${TARGET_IMAGE_NAME}:${ENVIRONMENT} -f ./build/Dockerfile . --build-arg PROFILE=development
docker push ${TARGET_IMAGE_NAME}:${ENVIRONMENT}
```

## Package Manager

This app uses [yarn](https://yarnpkg.com/) to manage the dependencies.
These are the commands you must certainly use:

#### Install all dependencies

```bash
yarn
yarn install
```

#### Add new dependencies

```bash
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]
```

#### Adding a dependency to different categories of dependencies

```bash
yarn add [package] --dev  # dev dependencies
yarn add [package] --peer # peer dependencies
```

#### Upgrading a dependency

```bash
yarn up [package]
yarn up [package]@[version]
yarn up [package]@[tag]
```

#### Removing a dependency

```bash
yarn remove [package]
```
