import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyproductregisterComponent} from './myproductregister.component';

const routes: Routes = [
    {path: '', component: MyproductregisterComponent}
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyproductregisterRoutingModule {}
