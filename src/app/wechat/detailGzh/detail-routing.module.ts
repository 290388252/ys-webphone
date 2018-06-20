import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent} from './detail.component';

const routes: Routes = [
    {path: '', component: DetailComponent}
    // { path: 'main', loadChildren: './system/common/main/main.module#MainModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetailRoutingModule {}
