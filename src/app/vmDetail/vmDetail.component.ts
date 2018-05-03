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
    // document.getElementById('input').style.width = document.documentElement.offsetWidth + 'px';
    console.log(document.documentElement.offsetWidth + 'px');
  }

  onSearch(event: string): void {
    console.log(event);
  }
}
