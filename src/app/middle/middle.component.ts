import { Component , OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../app-service';
import {AppProperties} from '../app.properties';

@Component({
  selector: 'app-middle',
  templateUrl: './middle.component.html',
  styleUrls: ['./middle.component.css']
})
export class MiddleComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    this.router.navigate(['main']);
  }
}
