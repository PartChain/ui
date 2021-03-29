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

import { Component, Input } from '@angular/core';

/**
 *
 *
 * @export
 * @class MenuButtonComponent
 */
@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
})
export class MenuButtonComponent {
  /**
   * Button css type (primary or secondary)
   *
   * @type {string}
   * @memberof MenuButtonComponent
   */
  @Input() button: string;

  /**
   * Is button disable
   *
   * @type {boolean}
   * @memberof MenuButtonComponent
   */
  @Input() disable: boolean;

  /**
   * Menu icon
   *
   * @memberof MenuButtonComponent
   */
  public arrow = 'arrow-down-s-fill';
}
