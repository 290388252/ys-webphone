import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './vmDetail.component.html',
  styleUrls: ['./vmDetail.component.css']
})
export class VmDetailComponent implements OnInit {
  public _value = '';
  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  onSearch(event: string): void {
    console.log(event);
  }
}
