import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";

const routes: Routes = [/*
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'not-found' }*/
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
    { path: 'register', loadChildren: './register/register.module#RegisterModule' },
    { path: 'main', loadChildren: './main/main.module#MainModule' },
    { path: 'product', loadChildren: './product/product.module#ProductModule' },
    { path: 'detail', loadChildren: './detail/detail.module#DetailModule' },
    { path: 'myproductregister', loadChildren: './myproductregister/myproductregister.module#MyproductregisterModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
