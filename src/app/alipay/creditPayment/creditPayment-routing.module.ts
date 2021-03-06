import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditPaymentComponent} from './creditPayment.component';

const routes: Routes = [
    {path: '', component: CreditPaymentComponent}
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreditPaymentRoutingModule {}
