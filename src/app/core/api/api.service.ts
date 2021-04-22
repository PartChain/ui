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
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 *
 *
 * @export
 * @class ApiService
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * @constructor ApiService (DI)
   * @param {HttpClient} httpClient
   * @param {AuthService} authService
   * @memberof ApiService
   */
  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  /**
   * Stringify body content
   *
   * @private
   * @static
   * @template T
   * @param {(T | null)} body
   * @return {string}
   * @memberof ApiService
   */
  private static stringifyBody<T>(body: T | null): string {
    return JSON.stringify(body === null ? {} : body);
  }

  /**
   * HTTP Get by
   *
   * @template T
   * @param {string} url
   * @param {HttpParams} [params]
   * @param {boolean} [withCredentials=false]
   * @param {HttpHeaders} [headers]
   * @return {Observable<T>}
   * @memberof ApiService
   */
  public getBy<T>(url: string, params?: HttpParams, withCredentials = false, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.get<T>(url + params, {
      headers: headers ? headers : this.buildHeaders(),
      withCredentials,
    });
  }

  /**
   * HTTP Get
   *
   * @template T
   * @param {string} url
   * @param {boolean} [withCredentials=false]
   * @param {HttpHeaders} [headers]
   * @return {Observable<T>}
   * @memberof ApiService
   */
  public get<T>(url: string, withCredentials = false, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.get<T>(url, {
      headers: headers ? headers : this.buildHeaders(),
      withCredentials,
    });
  }

  /**
   *HTTP Post
   *
   * @template T
   * @param {string} url
   * @param {(Record<string, unknown> | unknown)} [body]
   * @param {'json'} [responseType]
   * @param {boolean} [withCredentials=false]
   * @param {HttpHeaders} [headers]
   * @return {Observable<T>}
   * @memberof ApiService
   */
  public post<T>(
    url: string,
    body?: Record<string, unknown> | unknown,
    responseType?: 'json',
    withCredentials = false,
    headers?: HttpHeaders,
  ): Observable<T> {
    return this.httpClient.post<T>(url, ApiService.stringifyBody(body), {
      headers: headers ? headers : this.buildHeaders(),
      responseType,
      withCredentials,
    });
  }

  /**
   *HTTP Delete
   *
   * @template T
   * @param {string} url
   * @param {boolean} [withCredentials=false]
   * @param {HttpHeaders} [headers]
   * @return {Observable<T>}
   * @memberof ApiService
   */
  public delete<T>(url: string, withCredentials = false, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.delete<T>(url, {
      headers: headers ? headers : this.buildHeaders(),
      withCredentials,
    });
  }

  /**
   * Headers builder
   *
   * @private
   * @return {HttpHeaders}
   * @memberof ApiService
   */
  private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      Access: 'application/json',
      'Content-Type': 'application/json',
      Authorization: this.authService.getBearerToken(),
    });
  }
}
