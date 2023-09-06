import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NegocioNuevoComponent } from './negocio-nuevo.component';

const routes: Routes = [
  {
    path: '',
    component: NegocioNuevoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NegocioNuevoRoutingModule { }
