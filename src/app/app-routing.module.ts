import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: "compra",
        loadChildren: () => import('./pages/compra/compra.module').then( m => m.CompraModule)
      },
      {
        path: "negocio",
        loadChildren: () => import('./pages/negocio/negocio.module').then( m => m.NegocioModule)
      },
      {
        path: "producto",
        loadChildren: () => import('./pages/producto/producto.module').then( m => m.ProductoModule)
      },
      {
        path: "user",
        loadChildren: () => import('./store/user/user.module').then( m => m.UserModule)
      },
      {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthModule)
      },
      {
        path: 'static',
        loadChildren: () => import('./pages/static/static.module').then(m=>m.StaticModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'static/welcome'
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'static/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
