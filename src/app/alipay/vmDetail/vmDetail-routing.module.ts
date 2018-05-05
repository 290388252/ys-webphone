import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VmDetailComponent} from './vmDetail.component';

const routes: Routes = [
    {path: '', component: VmDetailComponent}
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VmDetailRoutingModule {}
