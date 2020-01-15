import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PayPageComponent} from './pay.component';

const routes: Routes = [
    {path: '', component: PayPageComponent}
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PayPageRoutingModule {}
