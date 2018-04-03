import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";

const routes: Routes = [/*
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'not-found' }*/
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
    { path: 'main', loadChildren: './main/main.module#MainModule' },
    { path: 'product', loadChildren: './product/product.module#ProductModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
