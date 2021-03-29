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
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ColumnConfig } from './column-config';

/**
 *
 *
 * @export
 * @class RowDetailDirective
 * @implements {OnChanges}
 */
@Directive({
  selector: '[appRowDetail]',
})
export class RowDetailDirective implements OnChanges {
  /**
   * Getter to change the expanded property of the host
   *
   * @type {boolean}
   * @return {boolean}
   * @memberof RowDetailDirective
   */
  @HostBinding('class.expanded')
  get expanded(): boolean {
    return this.expand;
  }

  /**
   * Row detail setter - Sets the values to the detail table rows
   *
   * @param {ColumnConfig} value
   * @memberof RowDetailDirective
   */
  @Input()
  set appRowDetail(value: ColumnConfig) {
    if (value !== this.row) {
      this.row = value;
    }
  }

  /**
   * Template setter - Sets the template reference
   *
   * @param {TemplateRef<any>} template
   * @memberof RowDetailDirective
   */
  @Input('rowDetailTemplate')
  set template(template: TemplateRef<any>) {
    if (template !== this.templateReference) {
      this.templateReference = template;
    }
  }

  /**
   * Inputs expanded behavior
   *
   * @type {boolean}
   * @memberof RowDetailDirective
   */
  @Input() onExpanded: boolean;

  /**
   * Toggle event emitter
   *
   * @memberof RowDetailDirective
   */
  @Output() toggleChange = new EventEmitter<RowDetailDirective>();

  /**
   * Row configuration
   *
   * @private
   * @type {ColumnConfig}
   * @memberof RowDetailDirective
   */
  private row: ColumnConfig;

  /**
   * DOM template reference
   *
   * @private
   * @type {TemplateRef<any>}
   * @memberof RowDetailDirective
   */
  private templateReference: TemplateRef<any>;

  /**
   * Is expanded
   *
   * @private
   * @type {boolean}
   * @memberof RowDetailDirective
   */
  private expand: boolean;

  /**
   * @constructor RowDetailDirective.
   * @param {ViewContainerRef} viewContainer
   * @memberof RowDetailDirective
   */
  constructor(public viewContainer: ViewContainerRef) {}

  /**
   * Angular lifecycle method - On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof RowDetailDirective
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.onExpanded) {
      if (changes.onExpanded.currentValue === true) {
        this.render();
      } else {
        this.viewContainer.clear();
      }
    }
  }

  /**
   * Child table renderer
   *
   * @private
   * @return {void}
   * @memberof RowDetailDirective
   */
  private render(): void {
    this.viewContainer.clear();
    if (this.templateReference && this.row) {
      this.viewContainer.createEmbeddedView(this.templateReference, {
        $implicit: this.row,
      });
    }
  }
}
