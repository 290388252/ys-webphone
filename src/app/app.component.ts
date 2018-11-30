import { Component , OnInit} from '@angular/core';
import {urlParse} from './utils/util';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public curId: number;
  constructor(private router: Router) {
  }
  ngOnInit(): void {
  }
  // 获取选中状态
  selected(flag) {
    this.curId = flag;
    if (flag === 1) {
      this.router.navigate(['main'], {
        queryParams: {
          vmCode: urlParse(window.location.search)['vmCode'],
        }
      });
    } else if (flag === 2) {
      window.location.href = `/detail?vmCode=${urlParse(window.location.search)['vmCode']}&flag=1`;
    } else if (flag === 3) {
      window.location.href = `/detail?vmCode=${urlParse(window.location.search)['vmCode']}&flag=2`;
    } else if (flag === 4) {
      this.router.navigate(['main'], {
        queryParams: {
          vmCode: urlParse(window.location.search)['vmCode'],
        }
      });
    }
  }
}
