import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoNuevoComponent } from './producto-nuevo.component';

const routes: Routes = [
  {
    path: '',
    component: ProductoNuevoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoNuevoRoutingModule { }
