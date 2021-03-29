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

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomsReportModel } from './customs-report-model';
import { AssetService } from '../../assets/asset.service';
import { NotificationService } from 'src/app/shared/notifications/notification.service';
import { NotificationText } from 'src/app/shared/notifications/notification-message/notification-text';

/**
 *
 *
 * @export
 * @class CustomsReportModalComponent
 */
@Component({
  selector: 'app-export-modal',
  templateUrl: './customs-report-modal.component.html',
  styleUrls: ['./customs-report-modal.component.scss'],
})
export class CustomsReportModalComponent {
  /**
   * Is loading
   *
   * @type {boolean}
   * @memberof CustomsReportModalComponent
   */
  public isLoading = false;

  /**
   * Type of reports available
   *
   * @type {string[]}
   * @memberof CustomsReportModalComponent
   */
  public reportType = ['Excel', 'CSV'];

  /**
   * Selected report type
   *
   * @type {string}
   * @memberof CustomsReportModalComponent
   */
  public selected = 'Excel';

  /**
   * @constructor CustomsReportModalComponent.
   * @param {MatDialogRef<CustomsReportModalComponent>} dialogRef
   * @param {CustomsReportModel} data
   * @param {AssetService} assetService
   * @param {NotificationService} notificationService
   * @memberof CustomsReportModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<CustomsReportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomsReportModel,
    private assetService: AssetService,
    private notificationService: NotificationService,
  ) {
    dialogRef.disableClose = true;
  }

  /**
   * Close modal event
   *
   * @return {void}
   * @memberof CustomsReportModalComponent
   */
  public dialogClose(): void {
    this.dialogRef.close();
  }

  /**
   * Customs report request
   *
   * @param {string} reportType
   * @return {void}
   * @memberof CustomsReportModalComponent
   */
  public getCustomsReport(reportType: string): void {
    if (reportType !== '') {
      this.assetService.exportData(this.data.filter, `customsReport${reportType}`, `customsReport${reportType}`);
      this.dialogClose();
      this.notificationService.info(NotificationText.PreparingToDownload);
    }
  }
}
