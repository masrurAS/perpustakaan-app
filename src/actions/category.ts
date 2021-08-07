import http from "@http";
import { BaseRequest, Method } from "@http/Request";
import { PaginationResponse } from "@http/Response";

export function getAllCategory() {
  const request = new BaseRequest(PaginationResponse, Method.GET, '/categories');
  return http.execute(request)
  .then(res => {
    if (res instanceof PaginationResponse && res.status) {
      return res;
    }
    return null;
  })
  .catch(() => null);
}