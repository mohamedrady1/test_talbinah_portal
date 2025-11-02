import { IRequestOptions } from '../models/request-options.model';
import { environment } from '../../../../../../assets';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseApiClient {
  private baseUrl: string = environment.apiUrl;

  private constructor(private httpClient: HttpClient) { }

  static create(httpClient: HttpClient, baseUrl: string | undefined = undefined): BaseApiClient {
    let client = new BaseApiClient(httpClient);

    client.baseUrl = baseUrl || environment.apiUrl;

    return client;
  }

  post<TResponse>(
    resource: string,
    body: any | null,
    options: IRequestOptions | undefined = undefined
  ): Observable<TResponse> {
    return this.httpClient.post<TResponse>(`${this.baseUrl}/${resource}`, body, options);
  }

  get<TResponse>(resouce: string, options: IRequestOptions | undefined = undefined): Observable<TResponse> {
    return this.httpClient.get<TResponse>(`${this.baseUrl}/${resouce}`, options);
  }

  put<TResponse>(
    resource: string,
    body: any | null,
    options: IRequestOptions | undefined = undefined
  ): Observable<TResponse> {
    return this.httpClient.put<TResponse>(`${this.baseUrl}/${resource}`, body, options);
  }

  patch<TResponse>(
    resource: string,
    body: any | null,
    options: IRequestOptions | undefined = undefined
  ): Observable<TResponse> {
    return this.httpClient.patch<TResponse>(`${this.baseUrl}/${resource}`, body, options);
  }

  delete<TResponse>(
    resource: string,
    body: any | null,
    options: IRequestOptions | undefined = undefined
  ): Observable<TResponse> {
    return this.httpClient.delete<TResponse>(`${this.baseUrl}/${resource}`, { ...options, body });
  }
}
