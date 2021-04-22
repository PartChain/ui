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
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/user/user.service';
import { realm } from '../../../core/api/api.service.properties';

/**
 *
 *
 * @export
 * @class IntroductionWizardComponent
 */
@Component({
  selector: 'app-introduction-wizard',
  templateUrl: './introduction-wizard.component.html',
  styleUrls: ['./introduction-wizard.component.scss'],
})
export class IntroductionWizardComponent {
  /**
   * From dashboard state
   *
   * @type {boolean}
   * @memberof IntroductionWizardComponent
   */
  @Input() fromDashboard: boolean;

  /**
   * Active wizard slide reference
   *
   * @type {number}
   * @memberof IntroductionWizardComponent
   */
  public activeSlide = 1;

  /**
   * @constructor IntroductionWizardComponent
   * @param {UserService} userService
   * @param {Router} router
   * @memberof IntroductionWizardComponent
   */
  constructor(public userService: UserService, private router: Router) {}

  /**
   * Switch to given slide
   *
   * @param {number} slide
   * @return {void}
   * @memberof IntroductionWizardComponent
   */
  public switchBox(slide: number): void {
    this.activeSlide = slide;
  }

  /**
   * Skip introduction event
   *
   * @return {void}
   * @memberof IntroductionWizardComponent
   */
  public skip(): void {
    const loggedRealm = realm[1];
    this.router.navigateByUrl('/introduction', { skipLocationChange: true }).then(() => {
      this.router.navigate([loggedRealm + '']).then();
    });
  }
}
