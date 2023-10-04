  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';

  import { UserRolRoutingModule } from './user-rol-routing.module';
  import { UserRolComponent } from './user-rol.component';
  import { SpinnerModule } from '@app/shared/indicators';
  import { MatButtonModule } from '@angular/material/button';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field'; // Asegúrate de que esto esté importado
  import { MatSelectModule } from '@angular/material/select'; // Asegúrate de que esto esté importado
  import { MatToolbarModule } from '@angular/material/toolbar'; // Importa MatToolbarModule
  import {MatIconModule} from '@angular/material/icon';
  import { FormsModule } from '@angular/forms'; // Importa FormsModule
  import { ReactiveFormsModule } from '@angular/forms';

  @NgModule({
    declarations: [
      UserRolComponent
    ],
    imports: [
      CommonModule,
      UserRolRoutingModule,
      MatIconModule,

      SpinnerModule,
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule, // Asegúrate de que esté agregado aquí
      MatToolbarModule, // Agrega MatToolbarModule al array de imports
      MatSelectModule, // Asegúrate de que esté agregado aquí
      FormsModule, // Agrega FormsModule a la lista de imports
      ReactiveFormsModule, // Importa ReactiveFormsModule en lugar de FormsModule

    ]
  })
  export class UserRolModule { }
