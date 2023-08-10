import { Injectable } from '@nestjs/common';

@Injectable()
export class AwaitActionService {
  async action({ time }): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(time), time);
    });
  }
}
