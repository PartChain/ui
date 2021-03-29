## Development Guidelines

### Project Structure

All the components which are going to be reusable throughout
the application must be stored in the `Shared Folder`.

The singleton services,
the universal components and other features where there’s only one instance per application must be stored in the
`Core Folder`.

Finally, all feature areas are in their own folder, with their own Module.

### App Modules

Apart from the `App Module` there are four modules available.
`Core Module, Share Module, Feature Modules and Template Module`.

The `Core Module` is designed for the singleton services.

When it comes to shared functionality, that is the `Shared Module`. Here we have our reusable components, pipes, and directives.

A `Feature Module` delivers a cohesive set of functionality focused on a specific application need.

The `Template Module` is used to store library imports, such as material design.

### Code Conventions

Try your best to apply the single responsibility principle (SRP) to all components, services, and other symbols.

This helps make the app cleaner, easier to read, maintainable and more testable.

Classes should be named upper camel case follow by the specific suffix.
Depending on the usage of components or services, for example `AssetListComponent` or `AssetService`.

Properties and methods should be lower camel case.

The properties must be at the top of your component and the public properties should come first followed by the private ones. This rule is also applicable for methods.

Common component structure:

- Decorators (@Input, @Output, @ViewChild)
- Public properties
- Private properties
- Class constructor
- Lifecycle hooks
- Public methods
- Private methods

Be careful when importing external library. Only import what is needed. Avoid the \* tag.

### Using angular routing

Components routing and rendering should be not controlled through ngIf and flags, only when really necessary. Angular routing should be used.

The routes are define in `routing-modules` and should be distributed into feature modules to enable lazy loading.

### Naming HTML Classes

To ensure a homogeneous nomenclature of the html classes we adopted the BEM methodology;

Please read the [docs](http://getbem.com/naming/);

### EsLint

Please make sure you run `npm run lint` before deploying the code and fix all the error that might arise, and the warnings as well.

This app uses the recommended rules for typescript.

##### TODO: Include husky to handle git hooks.

### Code Formatter

We use [prettier](https://prettier.io/) style guide to format the files structure;

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "arrowParens": "avoid"
}
```
