import http from "@http";
import { BaseRequest, Method } from "@http/Request";
import { BookResponse, PaginationResponse } from "@http/Response";
import { serialize } from "@support/functions";
import { CancelToken } from "axios";

export async function getBooks(filter: Record<string, any>, page: number, limit?: number, cancelToken?: CancelToken) {
  const request = new BaseRequest(PaginationResponse, Method.GET, '/books' + (limit ? `/${limit}` : ''), {
    cancelToken: cancelToken
  });
  const params = {
    ...filter,
    page,
  }
  request.url += `?${serialize(params)}`;
  return await http.execute(request)
  .then(res => {
    if (res instanceof PaginationResponse && res.status) {
      return res;
    }
    return null;
  })
  .catch(() => null);
}

export async function getBook(id: number) {
  const request = new BaseRequest(BookResponse, Method.GET, `/book/${id}`);
  return await http.execute(request)
  .then(res => {
    if (res instanceof BookResponse && res.status) {
      return res;
    }
    return null;
  })
  .catch(() => null);
}