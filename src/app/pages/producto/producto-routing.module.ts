import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: "nuevo",
    loadChildren: () => import("./pages/producto-nuevo/producto-nuevo.module").then(m=>m.ProductoNuevoModule),
    canActivate: [AuthGuard]
  },

  {
    path: "list",
    loadChildren: () => import("./pages/producto-list/producto-list.module").then(m=>m.ProductoListModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'list'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
