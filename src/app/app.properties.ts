import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class AppProperties {
    public appUrl: string;

    constructor() {
      this.appUrl = 'http://mw.youshuidaojia.com/ws-microservice-consumer-mobile-web';
    }
    getUrl(): string {
        return this.appUrl;
    }
}
