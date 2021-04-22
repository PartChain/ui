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

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetFacade } from 'src/app/shared/abstraction/asset-facade';
import { Changelog } from '../../../../shared/model/changelog.model';

/**
 *
 *
 * @export
 * @class AssetTimelineComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-timeline',
  templateUrl: './asset-timeline.component.html',
  styleUrls: ['./asset-timeline.component.scss'],
})
export class AssetTimelineComponent implements OnChanges {
  /**
   * Asset serial number customer
   *
   * @type {string}
   * @memberof AssetTimelineComponent
   */
  @Input() serialNumberCustomer: string;

  /**
   * Changelog state
   *
   * @type {Observable<Changelog[]>}
   * @memberof AssetTimelineComponent
   */
  public changelog$: Observable<Changelog[]>;

  /**
   * @constructor AssetTimelineComponent
   * @param {AssetFacade} assetFacade
   * @memberof AssetTimelineComponent
   */
  constructor(private assetFacade: AssetFacade) {
    this.changelog$ = this.assetFacade.assetHistory$;
  }

  /**
   * Angular lifecycle method - Ng On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof AssetTimelineComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.serialNumberCustomer) {
      this.assetFacade.setChangelog(changes.serialNumberCustomer.currentValue, 'qualityStatus');
    }
  }
}
