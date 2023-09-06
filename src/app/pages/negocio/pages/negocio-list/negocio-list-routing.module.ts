import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NegocioListComponent } from './negocio-list.component';

const routes: Routes = [
  {
    path: "",
    component: NegocioListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NegocioListRoutingModule { }
