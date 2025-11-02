import { CollectionApiClient, IPaginationParameters, IPaginationResponse } from "../../../common";
import { IArticleResponseDto, IArticlesListingResponseDto, IFavoritesArticlesListingResponseDto, IMostViewedArticlesResponseDto, IToggleFavoriteArticle, IToggleFavoriteArticleResponseDto } from "../dtos";
import { ArticlesManagementCollections } from "../collections";
import { IArticlesApiClient } from "./i-articles-api.client";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ArticlesApiClient implements IArticlesApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      ArticlesManagementCollections.Articles,
      this.http
    );
  }

  // get(paginationParameters?: IPaginationParameters): Observable<IPaginationResponse<IArticlesListingResponseDto>> {
  getAll(paginationParameters?: IPaginationParameters): Observable<IArticlesListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: ArticlesManagementCollections.ArticlesListing(),
      paginationParameters
    });
  }

  FavoriteArticles(paginationParameters?: IPaginationParameters): Observable<IFavoritesArticlesListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: ArticlesManagementCollections.FavoriteArticles(),
      paginationParameters
    });
  }

  MostViewedArticles(): Observable<IMostViewedArticlesResponseDto> {
    return this.collectionApiClient.get({
      collectionName: ArticlesManagementCollections.MostViewedArticles(),
    });
  }

  ToggleFavoriteArticle(payload: IToggleFavoriteArticle): Observable<IToggleFavoriteArticleResponseDto> {
    return this.collectionApiClient.post({
      collectionName: ArticlesManagementCollections.ToggleFavoriteArticle(),
      body: payload
    });
  }

  getById(id: string): Observable<IArticleResponseDto> {
    return this.collectionApiClient.get({
      collectionName: ArticlesManagementCollections.Articles,
      id
    });
  }
}

// GET (with paginationParameters)
// this.collectionApiClient.get({
//   collectionName: 'Articles',
//   paginationParameters: queryParams
// });

// POST (with query params + body)

// this.collectionApiClient.post({
//   collectionName: 'Articles',
//   body,
//   paginationParameters: queryParams
// });

// PUT
// this.collectionApiClient.put({
//   collectionName: 'Articles',
//   id,
//   body,
//   paginationParameters: queryParams
// });

// DELETE
// this.collectionApiClient.delete({
//   collectionName: 'Articles',
//   id,
//   paginationParameters: queryParams
// });
