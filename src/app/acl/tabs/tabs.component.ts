/*
 * Copyright 2021 The PartChain Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
} from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { delay, map, startWith } from 'rxjs/operators';
import { TabItemComponent } from './tab.item.component';

/**
 *
 *
 * @export
 * @class TabsComponent
 * @implements {AfterContentInit}
 * @implements {AfterContentChecked}
 */
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit, AfterContentChecked {
  /**
   * Tab content
   *
   * @type {QueryList<TabItemComponent>}
   * @memberof TabsComponent
   */
  @ContentChildren(TabItemComponent)
  tabs: QueryList<TabItemComponent>;

  /**
   * Tab item
   *
   * @type {Observable<TabItemComponent[]>}
   * @memberof TabsComponent
   */
  public tabItems$: Observable<TabItemComponent[]>;

  /**
   * Active tab
   *
   * @type {TabItemComponent}
   * @memberof TabsComponent
   */
  public activeTab: TabItemComponent;

  /**
   * Active tab emitter
   *
   * @type {EventEmitter<string>}
   * @memberof TabsComponent
   */
  @Output() active: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Angular lifecycle - After content init
   *
   * @returns {void}
   * @memberof TabsComponent
   */
  ngAfterContentInit(): void {
    this.tabItems$ = this.tabs.changes
      .pipe(startWith(''))
      .pipe(delay(0))
      .pipe(map(() => this.tabs.toArray()));
  }

  /**
   * Angular lifecycle - After content checked
   *
   * @return {void}
   * @memberof TabsComponent
   */
  ngAfterContentChecked(): void {
    // choose the default tab
    // we need to wait for a next VM turn,
    // because Tab item content, will not be initialized yet
    if (!this.activeTab) {
      Promise.resolve().then(() => {
        this.activeTab = this.tabs.first;
      });
    }
  }

  /**
   * Tab click event
   *
   * @param {TabItemComponent} tabItem
   * @return {void}
   * @memberof TabsComponent
   */
  public selectTab(tabItem: TabItemComponent): void {
    if (this.activeTab === tabItem) {
      return;
    }

    if (this.activeTab) {
      this.activeTab.isActive = false;
    }

    this.activeTab = tabItem;
    this.active.next(this.activeTab.label);

    tabItem.isActive = true;
  }
}
