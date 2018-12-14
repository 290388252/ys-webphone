import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [/*
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'not-found' }*/
// wechat
    { path: '', redirectTo: '/middle', pathMatch: 'full' },
    { path: 'register', loadChildren: './wechat/register/register.module#RegisterModule' },
    { path: 'middle', loadChildren: './middle/middle.module#MiddleModule' },
    { path: 'main', loadChildren: './wechat/main/main.module#MainModule' },
    { path: 'scan', loadChildren: './wechat/scan/scan.module#ScanModule' },
// alipay
    { path: 'aliRegister', loadChildren: './alipay/register/register.module#RegisterModule' },
    { path: 'aliMain', loadChildren: './alipay/main/main.module#MainModule' },
    { path: 'aliProduct', loadChildren: './alipay/product/product.module#ProductModule' },
    { path: 'aliCreditPayment', loadChildren: './alipay/creditPayment/creditPayment.module#CreditPaymentModule' },
    { path: 'notPage', loadChildren: './alipay/notPage/notPage.module#NotPageModule' },
// public
    { path: 'goodsShow', loadChildren: './publicSystem/goodsShow/goodsShow.module#GoodsShowModule' },
    { path: 'share', loadChildren: './publicSystem/share/share.module#ShareModule' },
    { path: 'shareGzh', loadChildren: './publicSystem/shareGzh/share.module#ShareModule' },
    { path: 'rotate', loadChildren: './publicSystem/rotate/rotate.module#RotateModule' },
    { path: 'shareInfo', loadChildren: './publicSystem/shareInfo/share.module#ShareModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
