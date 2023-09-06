import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: "nuevo",
    loadChildren: () => import("./pages/negocio-nuevo/negocio-nuevo.module").then(m=>m.NegocioNuevoModule),
    canActivate: [AuthGuard]
  },

  {
    path: "list",
    loadChildren: () => import("./pages/negocio-list/negocio-list.module").then(m=>m.NegocioListModule),
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
export class NegocioRoutingModule { }
