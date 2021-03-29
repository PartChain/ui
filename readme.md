<h1>PartChain User Interface</h1>

> __Note:__ This repository is still under active development! Breaking changes are possible, and we are working on improving code quality.

![Alt text](src/assets/svg/partchain.svg?raw=true 'PartChain')

<h2>PartChain is a blockchain-based system for tracking parts along the supply chain.</h4>

<h5>A high level of transparency across the supplier network enables faster intervention based on a recorded event in the supply chain.

This saves costs by seamlessly tracking parts and creates trust through clearly defined and secure data access by the companies and persons involved in the process.</h5>

### Application

This application serves as a user entry point to PartChain network.

It's written in Typescript based on Angular framework.

Source files are expose statically thru the NGINX web server.

### For developers:

Clone the source locally:

```sh
$ git clone ${path}
$ cd partchain-webapp
```

#### Configurations

If you're using angular for the first time, run `npm install -g @angular/cli` to install the angular command line interface.

This project was generate with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.4.

Find [here](readme/configuration.md) documentation to support you during the development and configuration of the app.

#### Login Process

The user authentication is manage by [keycloak](https://www.keycloak.org/) and each organization has its own realm.

This application supports multi tenancy authentication, so you must specify your realm to be redirect to the correct auth page.

E.g. `http://localhost:4200/lion`

If multi tenancy is disable, the default realm is considered.

You can manage those configurations on the environment files.

##### environment.ts

```typescript
export const environment = {
  multiTenant: true,
  defaultRealm: 'lion',
  ...
};
```

#### Development Guidelines

These guidelines are define to maintain homogeneous code quality and style. It can be adapted as the need arises.

New and old developers should regularly review this [guide](readme/dev-guidelines.md) to update it as new points emerge and to sync themselves with the latest changes.

#### UI Styling & Components

Find [here](readme/components.md) the documentation regarding the libraries used for styling and all the available ui components.

### License

@[PartChain](./LICENSE)


