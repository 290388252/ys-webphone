import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressComponent} from './address.component';

const routes: Routes = [
    {path: '', component: AddressComponent}
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddressRoutingModule {}
