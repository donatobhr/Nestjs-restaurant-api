import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private arr = [];

  getHello(): string {
    return 'Hello World!';
  }

  setHello(text: string): Array<string> {
    this.arr.push(text);
    return this.arr;
  }
}
