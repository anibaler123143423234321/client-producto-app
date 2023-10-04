import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRolComponent } from './user-rol.component';

const routes: Routes = [
  {
    path: "",
    component: UserRolComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRolRoutingModule { }
