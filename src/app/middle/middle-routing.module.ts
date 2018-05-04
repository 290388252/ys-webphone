import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MiddleComponent} from './middle.component';

const routes: Routes = [
    {path: '', component: MiddleComponent}
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MiddleRoutingModule {}
