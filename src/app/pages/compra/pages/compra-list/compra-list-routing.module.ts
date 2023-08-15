import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompraListComponent } from './compra-list.component';

const routes: Routes = [
  {
  path: '',
  component: CompraListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompraListRoutingModule { }
