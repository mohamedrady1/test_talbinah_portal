import { HttpParams, HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { IRequestOptions } from "../models";

function createRequestOptionsWithParams(params: Record<string, any> | undefined): IRequestOptions | undefined {
  return params
    ? {
      params: createHttpParams(params)
    }
    : undefined;
}

function createHttpParams(params: Record<string, any>): HttpParams {
  let httpParams = new HttpParams();
  if (params) {
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Append each value in the array
          value.forEach(arrayItem => {
            httpParams = httpParams.append(key, String(arrayItem));
          });
        } else {
          httpParams = httpParams.set(key, String(value));
        }
      }
    });
  }
  return httpParams;
}

export const httpUtils = {
  createRequestOptionsWithParams,
  createHttpParams
};
