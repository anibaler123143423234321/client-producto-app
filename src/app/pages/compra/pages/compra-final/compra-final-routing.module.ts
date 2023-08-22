import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompraFinalComponent } from './compra-final.component';

const routes: Routes = [
  {
  path: '',
  component: CompraFinalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompraFinalRoutingModule { }
