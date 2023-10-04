import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: "nuevo",
    loadChildren: () => import("./pages/categoria-nuevo/categoria-nuevo.module").then(m=>m.CategoriaNuevoModule),
    canActivate: [AuthGuard]
  },

  {
    path: "list",
    loadChildren: () => import("./pages/categoria-list/categoria-list.module").then(m=>m.CategoriaListModule),
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
export class CategoriaRoutingModule { }
