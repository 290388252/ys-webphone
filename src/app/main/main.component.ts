import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../app-service';
import { AppProperties } from '../app.properties';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {
  private queryItemUrl: string;
  constructor(private router: Router, private appProperties: AppProperties, private appService: AppService) {
    this.queryItemUrl = appProperties.getUrl() + '/business/queryItem';
  }
  ngOnInit(): void {
    // this.appService.postData(this.queryItemUrl, '', '').subscribe(
    //   data => {
    //     console.log(data);
    //   },
    //   error => {
    //     console.log(error);
    //   });
    $.ajax({
      url: this.queryItemUrl,
      data: {
        vmCode: '1988000072'
      },
      dataType: 'jsonp',
      type: 'POST',
      success: function(data) {
        console.log(data);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest.status);
        console.log(XMLHttpRequest.readyState);
        console.log(textStatus);
    }});
  }
  ngAfterViewInit() {

  }
  detail() {
    this.router.navigate(['product']);
    // TODO;
  }
}
