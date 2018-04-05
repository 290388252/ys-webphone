import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit{
  constructor(private router: Router) {
  }
  ngOnInit(): void {

  }
  ngAfterViewInit() {

  }
  detail() {
    // this.router.navigate(['register']);
    // TODO;
  }
}
