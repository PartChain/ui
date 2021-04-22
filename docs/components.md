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

E.g:

```html
  <app-menu-item
    class="mr-2"
    [menuFor]="status"
    [button]="'secondary'"
    [disable]="(this.selectedRows$ | async).length === 0"
    ><span>Change Status</span></app-menu-item
  >
```

```html
  <ng-template #status>
    <app-menu [ngStyle]="{ width: '144px' }">
      <app-menu-item *ngIf="this.queryType === 'own'">
        <section class="menu-items" (click)="this.changeStatus('OK')">
          <svg height="13" width="13">
            <circle cx="6.5" cy="6.5" r="6.5" [ngStyle]="{ fill: 'rgb(61,176,20)' }" />
          </svg>
          <label class="pl-3">OK</label>
        </section>
      </app-menu-item>
      <app-menu-item>
        <section class="menu-items" (click)="this.changeStatus('FLAG')">
          <svg height="13" width="13">
            <circle cx="6.5" cy="6.5" r="6.5" [ngStyle]="{ fill: 'rgb(255,173,31)' }" />
          </svg>
          <label class="pl-3">FLAG</label>
        </section>
      </app-menu-item>
      <app-menu-item *ngIf="this.queryType === 'own'">
        <section class="menu-items" (click)="this.changeStatus('NOK')">
          <svg height="13" width="13">
            <circle cx="6.5" cy="6.5" r="6.5" [ngStyle]="{ fill: 'rgb(210,0,0)' }" />
          </svg>
          <label class="pl-3">NOK</label>
        </section>
      </app-menu-item>
    </app-menu>
  </ng-template>
```

You can have as many nested menu as you want, but be careful with the amount of menus.

####  Notifications

To display a notification, you need to inject the `NotificationService` on the desirable component and call the `notify` method:

```typescript
this.notificationService.success(NotificationText.EmailSent);
```

In case of error, you could use the error method to display the proper api error:

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
