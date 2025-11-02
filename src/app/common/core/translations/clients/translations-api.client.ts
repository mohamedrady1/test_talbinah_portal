import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITranslationsApiClient } from './i-translations-api.client';
import { ITranslationsApiResponse } from '../dtos';
import { environment } from '../../../../../assets';


@Injectable({
    providedIn: 'root',
})
export class TranslationsApiClient implements ITranslationsApiClient {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getTranslations(lang: string): Observable<ITranslationsApiResponse> {
        const endpoint = `${this.apiUrl}/api/translations`;

        // Set language in header
        const headers = new HttpHeaders({
            'Accept-Language': lang,
            // Alternative: you can use custom header if API expects it
            // 'X-Language': lang,
            // 'lang': lang
        });

        return this.httpClient.get<ITranslationsApiResponse>(endpoint, { headers });
    }
}


