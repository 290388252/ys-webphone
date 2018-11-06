import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommentComponent} from './publicSystem/comment/comment.component';

const routes: Routes = [/*
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'not-found' }*/
// wechat
    { path: '', redirectTo: '/middle', pathMatch: 'full' },
    { path: 'register', loadChildren: './wechat/register/register.module#RegisterModule' },
    { path: 'middle', loadChildren: './middle/middle.module#MiddleModule' },
    { path: 'main', loadChildren: './wechat/main/main.module#MainModule' },
    { path: 'detail', loadChildren: './wechat/detail/detail.module#DetailModule' },
    { path: 'detailGzh', loadChildren: './wechat/detailGzh/detail.module#DetailModule' },
// alipay
    { path: 'aliRegister', loadChildren: './alipay/register/register.module#RegisterModule' },
    { path: 'aliMain', loadChildren: './alipay/main/main.module#MainModule' },
    { path: 'aliDetail', loadChildren: './alipay/detail/detail.module#DetailModule' },
    { path: 'aliProduct', loadChildren: './alipay/product/product.module#ProductModule' },
    { path: 'aliCreditPayment', loadChildren: './alipay/creditPayment/creditPayment.module#CreditPaymentModule' },
    { path: 'notPage', loadChildren: './alipay/notPage/notPage.module#NotPageModule' },
    { path: 'test', loadChildren: './alipay/test/test.module#TestModule' },
// public
    { path: 'vmLogin', loadChildren: './publicSystem/vmLogin/vmLogin.module#VmLoginModule' },
    { path: 'addMain', loadChildren: './publicSystem/addMain/addMain.module#AddMainModule' },
    { path: 'comment', loadChildren: './publicSystem/comment/comment.module#CommentModule' },
    { path: 'goodsShow', loadChildren: './publicSystem/goodsShow/goodsShow.module#GoodsShowModule' },
    { path: 'share', loadChildren: './publicSystem/share/share.module#ShareModule' },
    { path: 'shareGzh', loadChildren: './publicSystem/shareGzh/share.module#ShareModule' },
    { path: 'rotate', loadChildren: './publicSystem/rotate/rotate.module#RotateModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
