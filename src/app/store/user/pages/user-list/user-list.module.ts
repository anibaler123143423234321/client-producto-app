  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';

  import { UserListRoutingModule } from './user-list-routing.module';
  import { UserListComponent } from './user-list.component';
  import { SpinnerModule } from '@app/shared/indicators';
  import { MatButtonModule } from '@angular/material/button';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field'; // Asegúrate de que esto esté importado
  import { MatSelectModule } from '@angular/material/select'; // Asegúrate de que esto esté importado
  import { MatToolbarModule } from '@angular/material/toolbar'; // Importa MatToolbarModule
  import {MatIconModule} from '@angular/material/icon';
  import { FormsModule } from '@angular/forms'; // Importa FormsModule

  import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
  import { MatTableModule } from '@angular/material/table';
  import { MatInputModule } from '@angular/material/input';
  import { EditCompraEstadoModalComponent } from './EditCompraEstadoModalComponent';

  @NgModule({
    declarations: [
      UserListComponent,
      EditCompraEstadoModalComponent
    ],
    imports: [
      CommonModule,
      UserListRoutingModule,
      MatIconModule,

      SpinnerModule,
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule, // Asegúrate de que esté agregado aquí
      MatToolbarModule, // Agrega MatToolbarModule al array de imports
      MatSelectModule, // Asegúrate de que esté agregado aquí
      FormsModule, // Agrega FormsModule a la lista de imports
    MatProgressSpinnerModule, // Añade esta línea
    MatTableModule, // Agrega esta línea
    MatIconModule,

    ]
  })
  export class UserListModule { }
