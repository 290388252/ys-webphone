import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [/*
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'not-found' }*/
// wechat
    { path: '', redirectTo: '/middle', pathMatch: 'full' },
    { path: 'register', loadChildren: './wechat/register/register.module#RegisterModule' },
    { path: 'middle', loadChildren: './middle/middle.module#MiddleModule' },
    { path: 'vmDetail', loadChildren: './wechat/vmDetail/vmDetail.module#VmDetailModule' },
    { path: 'main', loadChildren: './wechat/main/main.module#MainModule' },
    { path: 'detail', loadChildren: './wechat/detail/detail.module#DetailModule' },
    { path: 'product', loadChildren: './wechat/product/product.module#ProductModule' },
// alipay
    { path: 'aliRegister', loadChildren: './alipay/register/register.module#RegisterModule' },
    { path: 'aliVmDetail', loadChildren: './alipay/vmDetail/vmDetail.module#VmDetailModule' },
    { path: 'aliMain', loadChildren: './alipay/main/main.module#MainModule' },
    { path: 'aliDetail', loadChildren: './alipay/detail/detail.module#DetailModule' },
    { path: 'aliProduct', loadChildren: './alipay/product/product.module#ProductModule' },
    { path: 'aliCreditPayment', loadChildren: './alipay/creditPayment/creditPayment.module#CreditPaymentModule' },
// public
    { path: 'vmLogin', loadChildren: './publicSystem/vmLogin/vmLogin.module#VmLoginModule' },
    { path: 'addMain', loadChildren: './publicSystem/addMain/addMain.module#AddMainModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
