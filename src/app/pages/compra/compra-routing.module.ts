import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'nuevo',
    loadChildren: () => import('./pages/compra-nuevo/compra-nuevo.module').then(m=>m.CompraNuevoModule),
    canActivate:[AuthGuard]
  },
  {
    path: "list",
    loadChildren: () => import("./pages/compra-list/compra-list.module").then(m=>m.CompraListModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompraRoutingModule { }
