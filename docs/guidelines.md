## Development Guidelines

We follow the recommended guidelines from the [angular framework](https://angular.io/guide/styleguide).

### Project Structure

All the components which are going to be reusable throughout
the application must be stored in the `Shared Folder`.

The singleton services, the universal components and other features where there’s only one instance per application must be stored in the
`Core Folder`.

Finally, all feature areas are in their own folder, with their own `Feature Module`.

### Modular Design

Apart from the `App Module` there are four modules available.

- `Core Module`
- `Shared Module`
- `Template Module`
- `Feture Modules`

The `Core Module` is designed for the singleton services.

Within the `App Module` you should have the `Feature Modules`, the `Core Module` and any necessary providers.
Only import components if strictly necessary.

When it comes to shared functionality, that is the `Shared Module`.
Here we have our reusable components, pipes, directives, classes and services.

The `Template Module` is used to store library imports, such as material modules.

A `Feature Module` delivers a cohesive set of functionality focused on a specific application need.
Here you have all the components, pipes, directives, classes and services that complement which module.
Don't forget to import the `Shared Module` to enable you to use any reusable content.

### Lazy Loading

Components routing and rendering should not be controlled through ngIf and flags, only when really necessary. Angular routing should be used.

The routes are define in `routing-modules` and should be distributed into feature modules to enable lazy loading.

The `Layout Module` has all the ui pages imported on the routing file.

E.g:

```typescript
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./../dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  //...
];
```

### Module Architecture

The module is divided in three layers:

- `Core Layer`
- `Abstraction Layer`
- `Presentation Layer`

Aside from the layers, every module must have a `*.module.ts` and a `*.routing.ts` file.

#### Presentation Layer

The only responsibilities of this layer is to present and delegate.
It knows what to display and what to do, but it does not know how user’s interactions should be handled.
That logic is dispatched to the core layer.

##### View State Selector Pattern

The view state selector pattern binds the component state with the corresponding template.

It automatically injects a view template for a specific component state.

In our case every component state depends on data received by our state management solution.
It will start with a loading state that results in injecting the loader,
then depending on the resolved state (error or success) it will switch to the main or error view.

We managed all three states, like you see on the example below.

```typescript
export class View<T> implements OptionalViewData<T>, OptionalViewError, OptionalViewLoader {
  data?: T;
  loader?: boolean;
  error?: Error;
}
```

For managing the logic we choose a directive approach.

This is how it looks like on the view:

```html
<ng-container *viewContainer="acls$ | async; main: mainTmp; error: errorTmp; loading: loaderTmp"> </ng-container>

<ng-template #mainTmp let-acl="view">
  <app-acl-tabs [acls]="acl.data" (updateAccessEmitter)="this.updateAccess($event)"></app-acl-tabs>
</ng-template>

<ng-template #errorTmp let-acl="view">
  <app-acl-empty-state> </app-acl-empty-state>
</ng-template>

<ng-template #loaderTmp let-acl="view">
  <app-acl-skeleton></app-acl-skeleton>
</ng-template>
```

Within the presentation layer we have smart and dumb components.

##### Smart Components:

- Have a facade(s) and other services injected
- Communicates with the core layer
- Pass data to the dumb components
- React to the events from dumb components
- Are top-level routable components (but not always!)

##### Dumb Components:

- Present ui elements
- Delegate interaction up to the smart components via events

#### Abstraction Layer

This layer exposes the streams of state and interfaces for the components in the presentation layer.

The abstraction layer is not a place to implement business logic.
This is a bridge of connection between the presentation, and the core layer.

This way we're abstraction all the api requests and eventual state requests from the components.

This facade should be responsible for receiving data from services, and for storing those newly values in our state.

For e.g:

```typescript
public setAcls(): void {
    this.aclState.setAcls({ loader: true });
    this.aclService.getACL().subscribe(
      (acls: AclList) => {
        this.aclState.setOwner(acls.owner);
        this.aclState.setAcls({ data: Object.values(acls.ACL) });
      },
      error => of(this.aclState.setAcls({ error })),
    );
}
```

The facade should also notify the presentation layer with any state updates.

```typescript
get acls$(): Observable<View<Acl[]>> {
    return this.aclState.getAcls$.pipe(delay(0));
}
```

#### Core Layer

All data manipulation and outside world communication happens here.

You should consider having this three files:

- `*.assembler.ts`
- `*.service.ts`
- `*.state.ts`

The `services` should be responsible for any outside world communication.
Typically, they have all the api requests.
You could also use services to store any helper method which you might need.

This is the layer where we manage our data `states`.

> **Note:** `RXJS` is the solution used for state management on this application.

Make sure you create any state by using the generic class located on the shared folder.

Example of a state:

```typescript
private readonly acls$: State<View<Acl[]>> = new State<View<Acl[]>>({ loader: true });
```

Feel free to update that class if new methods are needed.

If your states require some extended data manipulation, you should decouple the code to the `assembler` static class.

In this example, we had to "transform" the data received from the api, so we extracted that logic.

State:

```typescript
  public setAcls(acls: View<Acl[]>, owner?: string): void {
    const updatedOwner: string = owner ? owner : this.owner$.snapshot;
    const aclsView: View<Acl[]> = {
      data: acls.data && AclAssembler.assembleAcls(acls.data, updatedOwner),
      loader: acls.loader,
      error: acls.error,
    };
    this.acls$.update(aclsView);
  }
```

Assembler:

```typescript
  public static assembleAcls(acls: Acl[], owner: string): Acl[] {
    const transformedAcls: Acl[] = [];
    acls.forEach(acl => {
      acl.targetOrg = acl.entities.find(entity => entity !== owner);
      acl.entities = [acl.entities.toString().replace(',', '')];
      acl.owner = owner;
      acl.status = acl.status.charAt(0).toUpperCase() + acl.status.slice(1);
    });
    transformedAcls.push(...acls);
    return transformedAcls;
  }
```

### Code Conventions

#### Coding Style

Try your best to apply the single responsibility principle (SRP) to all components, services, and other symbols.

This helps make the app cleaner, easier to read, maintainable and more testable.

Classes should be named upper camel case follow by the specific suffix.
Depending on the usage of components, services and so on.

For example: `AssetListComponent` or `AssetService`.

Properties and methods should be lower camel case.

The properties must be at the top of your component, and the public properties should come first followed by the private ones. This rule is also applicable for methods.

Common component structure:

- Decorators (@Input, @Output, @ViewChild)
- Public properties
- Private properties
- Class constructor
- Lifecycle hooks
- Public methods
- Private methods

Be careful when importing external libraries. Only import what is needed. Avoid the `\*` tag.

Do define one thing, such as a service or component, per file.

Consider limiting files to 400 lines of code.

#### Small functions

Do define small functions

Consider limiting to no more than 75 lines.

#### RXJS

Angular works with [rxjs](https://rxjs-dev.firebaseapp.com/guide/overview) behind the scenes, so you should have a good knowledge of this library.

RxJS is a library for composing asynchronous and event-based programs by using observable sequences.

> Think of RxJS as Lodash for events - this is the statement you find on the rxjs website.

A great use case is when you have to manage api requests, since it could return an observable.

RXJS has a great arsenal of operators which might be handy.

Here you find the minimal rxjs operators to be aware of:

- `map`
- `merge`
- `concat`
- `mergeMap` & `switchMap`
- `combineLatest`
- `filter`
- `zip`
- `scan` & `reduce`
- `take` & `takeWhile`
- `tap`
- `debounceTime`
- `distinctUntilChanged`
- `delay`
- `from` & `fromEvent`

#### Lodash

Whenever possible, we want to use a functional programming approach using pre-defined JavaScript methods instead of reinventing the wheel.

All developers should familiarize themselves with the methods offered by [Lodash](https://www.lodash.com).

Here the minimal Lodash arsenal to be aware of:

- `intersection` & `intersectionWith`
- `union` & `unionWith`
- `uniq` & `uniqWith`
- `zipObject`
- `find`
- `groupBy`
- `partition`
- `some`
- `sortBy`
- `isEmpty`
- `isEqual`
- `get`
- `merge` & `mergeWith`
- `pickBy`

Learn about the difference between Vanilla JS `filter`/`map`/`reduce`/etc. and Lodash `filter`/`map`/`reduce`/etc.

For example: You can use Lodash's versions not just on arrays but also on objects. This makes the use of combinations of `.map` and `.filter` with `Object.entries`, `Object.values`, and `Object.keys` obsolete and makes code shorter and more readable.

> **Note:** Keep in mind, if you need to use this types of utility methods with observables, rxjs is there for you.

#### Interface and Type Names

Do not use “I” at the beginning of an interface or type names. For example, do not write `IState` or `IView`.

#### JavaScript Operators

The most common operators, [logical](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators) and otherwise, include:

- logical NOT `!` in front of words
- double NOT `!!` in front of words
- logical AND `&&` used for [short-circuit evaluation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#Short-circuit_evaluation)
- logical OR `||` used for short-circuit evaluation and default values
- ternary checks using `? :`
- [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) using `?.`
- using `?` for optional arguments in functions
- [nullish coalescing](https://medium.com/@bramus/esnext-javascript-nullish-coalescing-operator-3e56afb64b54) `??` as a replacement for logical OR `||` when used as a default value
- [non-null assertion operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator) invoked by using `!` after a variable

IMPORTANT: Please use the non-null assertion operator very sparingly! Overriding a null/undefined type check is generally not a good idea.
When you write the code, it may seem safe but later refactoring can introduce real null or undefined values which will no longer be caught by the type checker.

#### Typescript

Strive to improve TypeScript knowledge.

There are many features TypeScript offers to catch potential problems before running the compiler.
Developers should strive to improve their knowledge of TypeScript and use its features in our code base.

Things like:

- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Never and Unknown Types](https://blog.logrocket.com/when-to-use-never-and-unknown-in-typescript-5e4d6c5799ad/)
- ...

> **Note:** Avoid the any type.

### Naming HTML Classes

To ensure a homogeneous nomenclature of the html classes we adopted the BEM methodology;

Please read the [docs](http://getbem.com/naming/);

### CSS Framework

We use [tailwind css](https://tailwindcss.com/docs) to style our app.
Tailwind is a utility-first css framework which comes with a lot of built-in css classes.

Tailwind is well documented, but you could also check this cheat sheet [here](https://github.com/LeCoupa/awesome-cheatsheets/blob/master/frontend/tailwind.css), if you prefer.

Tailwind is highly customizable so, if you intend to add any specific configurations, you should do it on the `tailwind config` file.

Any global css must be added to the layer base on the `base.scss` file.

Tailwind makes the process of styling easy by providing classes ready to be integrated on the html.

To avoid any unnecessary "noise" on the html pages, we suggest applying those styles on the scss files.

E.g:

```html
<div class="assets-grid"></div>
```

```css
.assets-grid {
  @apply grid grid-cols-12 gap-2 w-full h-full sm:pl-4 md:pl-4 lg:pl-8 relative;
}
```

We are using [stylelint](https://stylelint.io/) for css validation.

```json
{
  "extends": "stylelint-config-recommended",
  "rules": {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": ["extends", "tailwind", "layer", "apply", "include", "mixin"]
      }
    ],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null
  }
}
```

You might find some css warnings on vscode. To disable those, you must configure vscode settings.json with the following:

```json
{
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false
}
```

This prevents the default linter from validating the css.

### Icons

We are using [remixicon](https://remixicon.com/), an open source library with a set of neutral-style symbols.

With the help of [ngneat](https://github.com/ngneat/svg-icon) all of those icons are converted to typescript.

If you intend to add more icons, please make sure you add them on the svg folder @`src/assets/svg`.
This enables us to convert all svg icons into typescript types by running the command:

- `npm run generate-icons`

The configuration for this script is available on the package json.

##### package.json

```json
{
  "svg-to-ts": {
    "generateType": "false",
    "delimiter": "KEBAB",
    "conversionType": "files",
    "iconsFolderName": "svg",
    "prefix": "app",
    "srcFiles": ["./src/assets/svg/*.svg"],
    "outputDirectory": "./src/app",
    "svgoConfig": {
      "plugins": [
        {
          "removeDimensions": true,
          "cleanupAttrs": true
        }
      ]
    }
  }
}
```

All the icons must be imported to the shared-icons-module icons array, available on the app shared folder.

Keep in mind that to use the icons, you must import the icons array as a child of `SvgIconsModule` and attach it to the desirable module.

E.g:

```typescript
import { icons } from './shared/shared-icons.module';
@NgModule({
imports: [
  SvgIconsModule.forChild(icons),
]
})
```

### EsLint

Please make sure you follow the linting rules by fixing all the errors and warnings which might arise, before deploying the code.

You can check those alerts by running the command:

- `npm run lint`

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

To verify and adjust the format of each document, run the command:

- `npm run format`
