import { IPaginationParameters, IPaginationResponse } from '../../../common';
import { IArticleResponseDto, IArticlesListingResponseDto, IFavoritesArticlesListingResponseDto, IMostViewedArticlesResponseDto, IToggleFavoriteArticle, IToggleFavoriteArticleResponseDto } from '../dtos';
import { IArticlesApiClient } from './i-articles-api.client';
import { mockArticlesListing, mockFavoritesArticlesListing, mockMostViewedArticles, mockToggleFavoriteArticle } from '../data';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IArticleItem } from '../models';

@Injectable({ providedIn: 'root' })
export class ArticlesInMemoryApiClient implements IArticlesApiClient {

  // get(paginationParameters?: IPaginationParameters): Observable<IPaginationResponse<IArticlesListingResponseDto>> {
  getAll(paginationParameters?: IPaginationParameters): Observable<IArticlesListingResponseDto> {
    return of(mockArticlesListing);
  }

  FavoriteArticles(): Observable<IFavoritesArticlesListingResponseDto> {
    return of(mockFavoritesArticlesListing);
  }

  MostViewedArticles(): Observable<IMostViewedArticlesResponseDto> {
    return of(mockMostViewedArticles);
  }

  ToggleFavoriteArticle(payload: IToggleFavoriteArticle): Observable<IToggleFavoriteArticleResponseDto> {
    return of(mockToggleFavoriteArticle);
  }

  getById(id: string): Observable<IArticleResponseDto> {
    // Cast items to IArticle[] if possible, or adjust this mapping as needed
    const articles = mockArticlesListing.data.data[0] as unknown as IArticleItem[];
    const article = articles.find((item) => String(item.id) === String(id));
    if (!article) {
      throw new Error(`Article with id ${id} not found`);
    }
    return of({ items: [article] } as IArticleResponseDto);
  }
}
