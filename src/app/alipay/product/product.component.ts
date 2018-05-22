import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
// declare var AlipayJSBridge: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  close() {
    window['AlipayJSBridge'].call('closeWebview');
  }
}
