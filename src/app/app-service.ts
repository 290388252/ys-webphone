import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {RequestOptions} from '@angular/http';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) { }
  /**
   * @param {string} url地址
   * @param {any} [options]可选提交的参数
   * @param {any} [header]可选设置的头信息
   * @memberof ServiceBaseService
   * @title: 封装一个get请求的基础类
   */
  getData(url: string, options?: any): Observable<any> {
    // 配置请求头
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'token': sessionStorage.getItem('token')
    });
    // tslint:disable-next-line:forin
    url += (url.indexOf('?') < 0 ? '?' : '&') + this.param(options);
    console.log(url);
    return this.http.get(url, { headers: myHeaders });
  }

  getDataOpen(url: string, options?: any, tokens?: string): Observable<any> {
    // 配置请求头
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': tokens
      'Authorization': 'Bearer ' + tokens
    });
    // tslint:disable-next-line:forin
    // for (const key in myheaders) {
    //   myHeaders.append(key, myheaders[key]);
    // }
    url += (url.indexOf('?') < 0 ? '?' : '&') + this.param(options);
    console.log(url);
    return this.http.get(url, { headers: myHeaders });
  }

  /**
   * @param url地址
   * @param options提交的数据
   * @param myheaders可选参数设置头
   * @title:封装一个post请求数据的
   */
  postData(url: string, options: any, tokens?: any | null): Observable<any> {
    const myHttpHead = { headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'token': sessionStorage.getItem('token')
      })};
    /* const myHeaders: HttpHeaders = new HttpHeaders();
     myHeaders.append('Content-Type', 'application/json');
     myHeaders.append('token', myheaders);
     // tslint:disable-next-line:forin
     for (const key in myheaders) {
         myHeaders.append(key, myheaders[key]);
     }*/
    return this.http.post(url, options, myHttpHead);
  }

  postDataLogin(url: string, options: any): Observable<any> {
    const myHttpHead = { headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': 'login'
      })};
    return this.http.post(url, options, myHttpHead);
  }

  postDataDownLoad(url: string, body: any): Observable<any> {
    return this.http.post(url, body, {responseType: 'arraybuffer', headers: {'token': sessionStorage.getItem('token')}});
  }
  deleteData(url: string, options?: any, myheaders?: any | null): Observable<any> {
    // 配置请求头
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': sessionStorage.getItem('token')
    });
    // tslint:disable-next-line:forin
    for (const key in myheaders) {
      myHeaders.append(key, myheaders[key]);
    }
    url += (url.indexOf('?') < 0 ? '?' : '&') + this.param(options);
    console.log(url);
    return this.http.delete(url, { headers: myHeaders });
  }
  /**
   * @param {any} data
   * @returns
   * @memberof ServiceBaseService
   * @title:封装一个序列化get请求的参数的方法
   */
  param(data): string {
    let url = '';
    // tslint:disable-next-line:forin
    for (const k in data) {
      const value = data[k] !== undefined ? data[k] : '';
      url += `&${k}=${encodeURIComponent(value)}`;
    }
    return url ? url.substring(1) : '';
  }
}
