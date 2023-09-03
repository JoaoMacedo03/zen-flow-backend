import axios, { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { IOptionsAction } from '../interfaces';

export class Http {
  static async action({ step }: IOptionsAction<AxiosRequestConfig>): Promise<{
    status: number;
    response: any;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;}> {
      step.params.headers = { ...(step.params.headers || {}), 'User-Agent': `WorkFlow/1.0.0`};
      const response = await axios(step.params);
      return { status: response.status, headers: response.headers, response: response.data };
  }
}
