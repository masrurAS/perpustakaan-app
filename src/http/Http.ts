import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Method, Request } from './Request';
import { Response } from './Response';
import ErrorException from './exception/ErrorException';
import config, { ConfigType } from '@config/app';
import { Alert } from 'react-native';

let alert_shown = false;

export function showNetworkErrorAlert() {
  if (alert_shown) return;
  Alert.alert('Network', 'Please check your connection', [{
    text: 'OK',
    onPress: () => {
      alert_shown = false;
    }
  }]);
  alert_shown = true;
}

export default class Http {

  provider: AxiosInstance;
  config: ConfigType;
  token: string = '';

  constructor(token?: string) {
    this.provider = axios.create();
    this.config = config;
    this.settingRequest();
    this.settingResponse();
    if (token) this.setToken(token);
  }
  
  /**
   * setToken
   * @param {string} token
   * @returns {void}
   */
  public setToken(token: string) {
    this.token = token;
  }

  /**
   * setting request
   * @return {void}
   */
  protected settingRequest()
  {
    // Add a request interceptor
    this.provider.interceptors.request.use((config: AxiosRequestConfig) => {
      // Do something before request is sent
      // Setting Base URL
      config.baseURL = this.config.server.base_url;

      // Setting Headers
      config.headers['Accept'] = 'application/json';
      config.headers['Content-Type'] = 'application/json';

      // setting token if exist
      if (this.token != '') {
        config.headers[this.config.server.header_auth] = this.token;
      }

      return config;
    }, (error) => {
      // Do something with request error
      return Promise.reject(error);
    });
  }

  /**
   * setting response
   * @return {void}
   */
  protected settingResponse()
  {
    // Add a response interceptor
    this.provider.interceptors.response.use((response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    });
  }

  /**
   * post
   * @param {string} url
   * @param {object} data
   */
  public post<T extends Response>(responseType: ClassConstructor<T> ,url: string, data: Record<string, any> = {}, config?: AxiosRequestConfig): Promise<T | ErrorException | any> {
    return this.provider.post(url, data, config)
    .then((res: AxiosResponse<any>) => {
      if (res.data) {
        if (res.data.status) {
          return plainToClass(responseType, res.data);
        }
        return Promise.reject(ErrorException.create(res.data, res));
      }
      return Promise.reject(ErrorException.create({
        status: false,
        message: 'No data response',
        error: 'ErrorRequest'
      }, res));
    })
    .catch(error => {
      if (axios.isCancel(error)) return Promise.reject(error);
      if (error instanceof ErrorException) return Promise.reject(error);

      if (error.config && error.response && error.response.data) {
        return Promise.reject(ErrorException.create(error.response.data, error));
      }

      if (error.message == 'Network Error') {
        showNetworkErrorAlert();
        return Promise.reject(new ErrorException(false, error.message))
      }

      return Promise.reject(error);
    });
  }

  /**
   * get
   * @param {string} url
   * @param {object} data
   */
  public get<T extends Response>(responseType: ClassConstructor<T> ,url: string, config?: AxiosRequestConfig): Promise<T | ErrorException | any> {
    return this.provider.get(url, config)
    .then((res: AxiosResponse<any>) => {
      if (res.data) {
        if (res.data.status) {
          return plainToClass(responseType, res.data);
        }
        return Promise.reject(ErrorException.create(res.data, res));
      }
      return Promise.reject(ErrorException.create({
        status: false,
        message: 'No data response',
        error: 'ErrorRequest'
      }, res));
    })
    .catch(error => {
      if (axios.isCancel(error)) return Promise.reject(error);
      if (error instanceof ErrorException) return Promise.reject(error);

      if (error.config && error.response && error.response.data) {
        return Promise.reject(ErrorException.create(error.response.data, error));
      }

      if (error.message == 'Network Error') {
        showNetworkErrorAlert();
        return Promise.reject(new ErrorException(false, error.message))
      }

      return Promise.reject(error);
    });
  }

  /**
   * execute
   */
  public execute<R extends Response, P extends Record<string, any>>(request: Request<R, P>): Promise<R | ErrorException | any> {
    if (request.method == Method.POST) {
      return this.post(request.response, `${request.prefix}${request.url}`, request.data, request.config);
    } else {
      return this.get(request.response, `${request.prefix}${request.url}`, request.config);
    }
  }
}