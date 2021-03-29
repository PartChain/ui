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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 *
 *
 * @export
 * @class SpinnerOverlayService
 */
@Injectable({
  providedIn: 'root',
})
export class SpinnerOverlayService {
  /**
   * Subject to handle the loading state
   *
   * @type {Subject<boolean>}
   * @memberof SpinnerOverlayService
   */
  public overlayActive = new Subject<boolean>();

  /**
   * Subject to handle the skeleton loading
   *
   * @type {Subject<boolean>}
   * @memberof SpinnerOverlayService
   */
  public busySkeleton = new Subject<boolean>();

  /**
   * @constructor SpinnerOverlayService.
   * @memberof SpinnerOverlayService
   */
  constructor() {
    this.overlayActive.next(false);
  }

  /**
   * Displaying the overlay
   *
   * @returns {void}
   * @memberof SpinnerOverlayService
   */
  public show(): void {
    this.overlayActive.next(true);
  }

  /**
   * Hiding the overlay
   *
   * @return {void}
   * @memberof SpinnerOverlayService
   */
  public hide(): void {
    this.overlayActive.next(false);
  }

  /**
   * Set the state to the subject
   *
   * @param {boolean} state
   * @return {void}
   * @memberof SpinnerOverlayService
   */
  public setBusySkeleton(state: boolean): void {
    this.busySkeleton.next(state);
  }
}
