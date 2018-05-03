import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";

const routes: Routes = [/*
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'not-found' }*/
    { path: '', redirectTo: '/register', pathMatch: 'full' },
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
    { path: 'register', loadChildren: './register/register.module#RegisterModule' },
    { path: 'vmLogin', loadChildren: './vmLogin/vmLogin.module#VmLoginModule' },
    { path: 'vmDetail', loadChildren: './vmDetail/vmDetail.module#VmDetailModule' },
    { path: 'main', loadChildren: './main/main.module#MainModule' },
    { path: 'product', loadChildren: './product/product.module#ProductModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
