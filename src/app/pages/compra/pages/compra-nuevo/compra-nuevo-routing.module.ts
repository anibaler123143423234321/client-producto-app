import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompraNuevoComponent } from './compra-nuevo.component';

const routes: Routes = [
  {
    path: '', // Asegúrate de tener :productoId como parámetro
    component: CompraNuevoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompraNuevoRoutingModule {}
