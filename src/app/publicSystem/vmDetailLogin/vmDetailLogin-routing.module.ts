import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VmDetailLoginComponent} from './vmDetailLogin.component';

const routes: Routes = [
    {path: '', component: VmDetailLoginComponent}
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VmDetailLoginRoutingModule {}
