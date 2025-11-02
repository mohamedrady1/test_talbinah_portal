import { ErrorStateConfig } from "../../../shared";

export function getArticlesError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/articles/articles-error.svg',
    title: 'articles_lsit_error',
    gap: '.5rem',
    onRetry
  };
}
export function getMostViewedArticleError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/articles/articles-error.svg',
    title: 'articles_lsit_error',
    gap: '.5rem',
    onRetry
  };
}
export function getmyFavouriteArticlesError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/articles/articles-error.svg',
    title: 'articles_lsit_error',
    gap: '.5rem',
    onRetry
  };
}


