### CSS Framework

We use [tailwind css](https://tailwindcss.com/docs) to style our app.
Tailwind is a utility-first css framework which comes with a lot of built-in css classes.

Tailwind is well documented, but you could check this cheat sheet [here](https://github.com/LeCoupa/awesome-cheatsheets/blob/master/frontend/tailwind.css).

Tailwind is highly customizable so if you intend to add any specific configurations, you should do it on the tailwind config file.
Any global css must be added to the layer base on the base.scss file.

You could simply add the classes on the html file but to keep it clean we suggest doing it on the actual css file.

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
    "at-rule-no-unknown": [ true, {
      "ignoreAtRules": [
        "extends",
        "tailwind",
        "layer",
        "apply",
        "include",
        "mixin"
      ]
    }],
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

We are using [remixicon](https://remixicon.com/) an open source library with a set of neutral-style symbols.

With the help of [ngneat](https://github.com/ngneat/svg-icon) all of those icons are converted to typescript.

If you intend to add more icons, please make sure you add them on the svg folder @`src/assets/svg`. 
This enables you to run the command `npm run generate-icons` successfully.

The configuration for that script is available on the package json.

##### package.json

```json
{
  "svg-to-ts": {
    "generateType": "false",
    "delimiter": "KEBAB",
    "conversionType": "files",
    "iconsFolderName": "svg",
    "prefix": "app",
    "srcFiles": [
      "./src/assets/svg/*.svg"
    ],
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

Keep in mind that to use the icons, you must import the icons array as a child of SvgIconsModule and add it to the desirable module, for e.g:


```typescript
import { icons } from './shared/shared-icons.module';
@NgModule({
imports: [
  SvgIconsModule.forChild(icons),
]
})
```

### Angular Material

To support the development of components we use the angular material package.

Regarding angular materials styling, be careful with the ng-deep hack. It will affect globally all the components with the classes or selectors referred;

Either use a selector or id before the ng-deep to ensure it affects solely the desired element; 

Alternative use the Encapsulation method. Try to avoid angular materials for your sake and mental health!

### Shared Components
There are some customized components develop to facilitate the common building blocks of our application.

####  Header

This component accepts the following parameters has an input:

`@Input title` - Component title to be displayed

```html
<app-header [title]="this.title"></app-header>
```

####  Master Detail Table

There's a shared component to be used when a table implementation is needed.

```html
    <app-table
      [dataSet]="assetData"
      [tableConfiguration]="assetTable"
      [removeSelection]="this.removeSelectedRows"
      [clickedRow]="this.selectedAsset"
      (selectedRowsEmitter)="this.getSelectedRows($event)">
    </app-table>
```

This component accepts the following parameters has an input:

`@Input dataSet` - This is the data which you want to display;

`@Input tableConfiguration` - The column definitions and the table configurations. For example setting the table as editable to enable multiple selection;

`@Input removeSelection` - This boolean clears the table selected rows

`@Input clickedRow` - This may be handy for getting details of a specific row


Also, this component outputs the selected rows. `@Output selectedRowsEmitter`.
You can share those values to other components for instance. 


Here's an example on how you could set the table configurations:

```typescript
const detailColumns: Array<ColumnConfig> = [
  {fieldName: 'manufacturer', label: 'Manufacturer', hide: false, width: 3},
  {fieldName: 'partNameManufacturer', label: 'Part Name', hide: false, width: 4},
  {fieldName: 'partNumberManufacturer', label: 'Part Number', hide: false, width: 2},
  {fieldName: 'serialNumberManufacturer', label: 'Serial Number', hide: false, width: 5},
  {fieldName: 'qualityStatus', label: 'Quality Status', hide: false, width: 2},
  {fieldName: 'productionDateGmt', label: 'Production Date', hide: false, type: ColumnType.DATE, width: 2},
];

// build the table that contains the details
const detailTable: Table = TableFactory.buildTable(
  detailColumns, new TableConfig(false, {emptyStateReason: 'No components available'}));

const columnsConfig: Array<ColumnConfig> = [
  {fieldName: 'manufacturer', label: 'Manufacturer', hide: false, width: 2},
  {fieldName: 'partNameManufacturer', label: 'Part Name', hide: false},
  {fieldName: 'partNumberManufacturer', label: 'Part Number', hide: false},
  {fieldName: 'serialNumberManufacturer', label: 'Serial Number', hide: false, width: 6},
  {fieldName: 'qualityStatus', label: 'Quality Status', hide: false, width: 1},
  {fieldName: 'productionDateGmt', label: 'Production Date', hide: false, type: ColumnType.DATE},
  {fieldName: 'childComponents', label: 'Components', hide: false, type: ColumnType.TABLE, width: 1, detailTable},
];
return TableFactory
  .buildTable(columnsConfig, new TableConfig(true, {emptyStateReason: 'No components available'}));
```

####  Button

This component accepts the following parameters:

`@Input button` - This string may contain primary, secondary, small keywords. It controls the button styling

`@Input icon` - Displays an icon on that button. You should use the available icons on the /svg folder by specifying the name. 

`@Input type` - Controls type of button ['button', 'submit', 'reset']

`@Input disable` - When true, button is set to disabled state.

`@Output clickEvent` - Emit event with whole button component as argument


```html
<app-button
  [type]="'submit'"
  [button]="'primary'"
  [icon]="'gen-filter'"
  (clickEvent)="this.openFilter()"
>
  Filter
</app-button>
```

####  Menu Button

This component accepts the following parameters:

`@Input button` - This string may contain primary, secondary, small keywords. It controls the button styling

`@Input disable` - When true, button is set to disabled state.

```html
<app-menu-button
  [button]="'primary'"
  [matMenuTriggerFor]="matMenu"
>
  Change Status
</app-menu-button>
```

This component triggers a material design menu. For example:

```html
<mat-menu #menu="matMenu">
  <button mat-menu-item (click)="this.exportData('listDataExcel')">
    <section class="menu-items">
      <svg-icon class="p0" key="iwp-excel"></svg-icon>
      <label class="pl-3">Excel</label>
    </section>
  </button>
  <button
    mat-menu-item
    (click)="this.exportData('listDataPlainCSV')"
  >
    <section class="menu-items">
      <svg-icon class="csv" key="iwp-text-doc-blue"></svg-icon>
      <label class="pl-3">CSV</label>
    </section>
  </button>
</mat-menu>
```

We've created this component to keep the same look and feel of the app buttons.

####  Notifications

To display a notification, you need to inject the `NotificationService` on the desirable component and call the `notify` method:

```typescript
this.notificationService.success(NotificationText.EmailSent);
```

In case of error you could use the error method to display the proper api error:

```typescript
this.notificationService.error(this.notificationService.errorServiceResponse(error));
```

This method accepts three parameters: `NotificationText | string` , `NotificationStatus` and a `timeout`:

```typescript
export enum NotificationText {
  StatusChanged = 'The status was successfully changed',
  SuccessFullyCommitted = 'Successfully committed.',
  SuccessFullyDeleted = 'Successfully deleted.',
  PreparingToDownload = 'Preparing data to download...',
  Downloading = 'Downloading...',
  SomethingWentWrong = 'Something went wrong',
  EmailSent = 'Email sent',
  LoginFailed = 'Login failed',
  LogoutError = 'Log out failed '
}
```

```typescript
export const enum NotificationStatus {
  Success = 1,
  Warning = 2,
  Error = 3,
  Informative = 4
}
```

Please add more fields to the enumerators as you see fit.

####  Loading Spinner

You could activate a loading spinner overlay for the loading states of the application. 

An HTTP call for instance.

To do that, simply inject the `SpinnerOverlayService` on the desirable component.

Now you have the available method to display the loading state.

```typescript
this.spinnerOverlayService.show();
```

Don't forget to hide it when it's no longer needed.

```typescript
this.spinnerOverlayService.hide();
```

##### Note: It'd be better to have a skeleton loading instead of an overlay.
