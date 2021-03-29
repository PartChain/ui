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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../user/auth/auth.service';

/**
 * Injectable api service
 *
 * @export
 * @class ApiService
 */
@Injectable()
export class ApiService {
  /**
   * @constructor ApiService.
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
   * @param {*} body
   * @return {string}
   * @memberof ApiService
   */
  private static stringifyBody(body: any): string {
    return JSON.stringify(body === null ? {} : body);
  }

  /**
   * HTTP GET
   *
   * @template T
   * @param {string} url
   * @param {*} [params]
   * @param {boolean} [withCredentials=false]
   * @param {HttpHeaders} [headers]
   * @return {Observable<T>}
   * @memberof ApiService
   */
  public get<T>(url: string, params?: any, withCredentials = false, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.get<T>(url + params, {
      headers: headers ? headers : this.buildHeaders(),
      withCredentials,
    });
  }

  /**
   * HTTP GET (NO PARAMS)
   *
   * @template T
   * @param {string} url
   * @param {boolean} [withCredentials=false]
   * @param {HttpHeaders} [headers]
   * @return {Observable<T>}
   * @memberof ApiService
   */
  public getWithNoParams<T>(url: string, withCredentials = false, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.get<T>(url, {
      headers: headers ? headers : this.buildHeaders(),
      withCredentials,
    });
  }

  /**
   * HTTP POST
   *
   * @template T
   * @param {string} url
   * @param {*} [body]
   * @param {'json'} [responseType]
   * @param {boolean} [withCredentials=false]
   * @param {HttpHeaders} [headers]
   * @return {Observable<T>}
   * @memberof ApiService
   */
  public post<T>(
    url: string,
    body?: any,
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
   * HTTP DELETE
   *
   * @template T
   * @param {string} url
   * @param {boolean} [withCredentials=false]
   * @param {HttpHeaders} [headers]
   * @return {*}  {Observable<T>}
   * @memberof ApiService
   */
  public delete<T>(url: string, withCredentials = false, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.delete<T>(url, {
      headers: headers ? headers : this.buildHeaders(),
      withCredentials,
    });
  }

  /**
   * Parse query string from given object
   *
   * @param {*} params
   * @return {string}
   * @memberof ApiService
   */
  public getQueryStringFromObject(params: any): string {
    const str = [];
    for (const p in params) {
      if (params[p] !== null) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
      }
    }

    return (str.length ? '?' : '') + str.join('&');
  }

  /**
   * Api error handling
   *
   * @param {*} err
   * @return {Observable<never>}
   * @memberof ApiService
   */
  public handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (Array.isArray(err.error.error)) {
      errorMessage = `An error occurred: ${err.error.message}`;
      err.error.error.forEach(message => (errorMessage = message.message));
    } else if (err.message) {
      errorMessage = err.message;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    return throwError(errorMessage);
  }

  /**
   * HTTP headers builder
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
