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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from 'src/app/assets/model/pagination.model';

/**
 *
 *
 * @export
 * @class PaginationComponent
 */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  /**
   * Pagination
   *
   * @type {Pagination}
   * @memberof PaginationComponent
   */
  @Input() pagination: Pagination;

  /**
   * Load next page event emitter
   *
   * @type {EventEmitter<boolean>}
   * @memberof PaginationComponent
   */
  @Output() loadNextPage: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Load previous page event emitter
   *
   * @type {EventEmitter<boolean>}
   * @memberof PaginationComponent
   */
  @Output() loadPreviousPage: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Next page event
   *
   * @return {void}
   * @memberof PaginationComponent
   */
  public nextPage(): void {
    this.loadNextPage.emit(true);
  }

  /**
   * Previous page event
   *
   * @return {void}
   * @memberof PaginationComponent
   */
  public previousPage(): void {
    this.loadPreviousPage.emit(true);
  }
}
