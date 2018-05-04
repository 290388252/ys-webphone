import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";

const routes: Routes = [/*
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'not-found' }*/
    { path: '', redirectTo: '/middle', pathMatch: 'full' },
    { path: 'register', loadChildren: './wechat/register/register.module#RegisterModule' },
    { path: 'middle', loadChildren: './middle/middle.module#MiddleModule' },
    { path: 'vmLogin', loadChildren: './wechat/vmLogin/vmLogin.module#VmLoginModule' },
    { path: 'vmDetail', loadChildren: './wechat/vmDetail/vmDetail.module#VmDetailModule' },
    { path: 'main', loadChildren: './wechat/main/main.module#MainModule' },
    { path: 'detail', loadChildren: './wechat/detail/detail.module#DetailModule' },
    { path: 'product', loadChildren: './wechat/product/product.module#ProductModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
