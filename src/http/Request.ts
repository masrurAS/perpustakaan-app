import { AxiosRequestConfig } from 'axios';
import { ClassConstructor } from 'class-transformer';
import {Response} from './Response';

export enum Method {
  POST,
  GET
}

export interface Request<T extends Response, P extends Record<string, any> = Record<string, any>> {
  method: Method
  url: string
  data?: P
  config?: AxiosRequestConfig
  response: ClassConstructor<T>
  prefix: string;
}

export class BaseRequest<T extends Response, P extends Record<string, any> = Record<string, any>> implements Request<T> {
  method: Method
  url: string
  data?: P
  config?: AxiosRequestConfig
  response: ClassConstructor<T>
  prefix: string = '/api';

  constructor(response: ClassConstructor<T>, method: Method, url: string, data?: P, config?: AxiosRequestConfig) {
    this.response = response;
    this.method = method;
    this.url = url;
    this.data = data;
    this.config = config;
  }
}