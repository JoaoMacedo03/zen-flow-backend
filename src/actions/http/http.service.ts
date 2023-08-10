import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpActionService {
  constructor(private readonly httpService: HttpService) {}

  async action({ url, type, headers, params, body }): Promise<{
    status: HttpStatus;
    headers: any;
    response: any;
  }> {
    let request;
    console.log('url', url);
    if (type === 'GET') {
      request = this.httpService.get(url, { headers, params });
    }

    if (type === 'POST') {
      request = this.httpService.post(url, body);
    }

    if (type === 'PUT') {
      request = this.httpService.put(url, body, { params, headers });
    }

    const data = (await firstValueFrom(request)) as any;
    return { status: data.status, headers: data.headers, response: data.data };
  }
}
