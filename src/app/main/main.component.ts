import { Component , OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../app-service';
import {AppProperties} from '../app.properties';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  constructor(private router: Router, private appProperties: AppProperties, private appService: AppService) {}
  ngOnInit(): void {
  }
  detail() {
    this.router.navigate(['product']);
    // TODO;
  }
}
