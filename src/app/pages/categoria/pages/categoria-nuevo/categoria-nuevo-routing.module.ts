import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaNuevoComponent } from './categoria-nuevo.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriaNuevoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaNuevoRoutingModule { }
