import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class AppProperties {
    public appUrl: string;

    constructor() {
        // this.appUrl = 'http://192.168.0.110:8092';
      this.appUrl = 'http://127.0.0.1:8092'; // localtest
      // this.appUrl = 'http://127.0.0.1:8769/ys_admin';
    }
    getUrl(): string {
        return this.appUrl;
    }
}
