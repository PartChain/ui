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

import { Component } from '@angular/core';
import { SpinnerOverlayService } from '../core/spinner-overlay.service';

/**
 *
 *
 * @export
 * @class SpinnerOverlayComponent
 */
@Component({
  selector: 'app-spinner-overlay',
  templateUrl: './spinner-overlay.component.html',
  styleUrls: ['./spinner-overlay.component.scss'],
})
export class SpinnerOverlayComponent {
  /**
   * Is loading state active
   *
   * @type {boolean}
   * @memberof SpinnerOverlayComponent
   */
  public isActive = false;

  /**
   * @constructor SpinnerOverlayComponent
   * @param {SpinnerOverlayService} spinnerOverlayService
   * @memberof SpinnerOverlayComponent
   */
  constructor(private spinnerOverlayService: SpinnerOverlayService) {
    this.subscribeToSpinnerOverlay();
  }

  /**
   * Sets the boolean with the subject value to display or not display the spinner
   *
   * @private
   * @return {void}
   * @memberof SpinnerOverlayComponent
   */
  private subscribeToSpinnerOverlay(): void {
    this.spinnerOverlayService.overlayActive.subscribe((active: boolean) => {
      this.isActive = active;
    });
  }
}
