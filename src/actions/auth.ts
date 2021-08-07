import http from "@http";
import ErrorException from "@http/exception/ErrorException";
import { BaseRequest, Method } from "@http/Request";
import { AuthResponse, MeResponse } from "@http/Response";

function unauthenticate() {
  http.setToken('')
}

export function cek_session(token: string) {
  http.setToken(`Bearer ${token}`);
  const request = new BaseRequest(MeResponse, Method.GET, '/auth/me', {});
  return http.execute(request)
  .then(res => {
    if (res instanceof MeResponse && res.status && res.data) {
      http.setToken(`Bearer ${token}`);
      return res;
    }
    
    unauthenticate();
    return null;
  })
  .catch((e) => {
    unauthenticate();
    return null;
  });
}

export function login(email: string, password: string) {
  const request = new BaseRequest(AuthResponse, Method.POST, '/auth/login', {email, password});
  return http.execute(request)
  .then(res => {
    if (res instanceof AuthResponse && res.status && res.data) {
      http.setToken(res.data.token);
      return res;
    }
    return null;
  })
  .catch((e) => {
    if (e instanceof ErrorException && e.message == 'The given data was invalid.') {
      return e;
    }
    return null;
  });
}

export function logout() {
  const request = new BaseRequest(AuthResponse, Method.POST, '/auth/logout');
  return http.execute(request)
  .then(res => {
    if (res instanceof AuthResponse && res.status) {
      http.setToken('');
      return res;
    }
    return null;
  })
  .catch(() => null);
}