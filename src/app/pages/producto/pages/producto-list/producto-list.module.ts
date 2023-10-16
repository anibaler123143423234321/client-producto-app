  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';

  import { ProductoListRoutingModule } from './producto-list-routing.module';
  import { ProductoListComponent } from './producto-list.component';
  import { SpinnerModule } from '@app/shared/indicators';
  import { MatButtonModule } from '@angular/material/button';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field'; // Asegúrate de que esto esté importado
  import { MatSelectModule } from '@angular/material/select'; // Asegúrate de que esto esté importado
  import { MatToolbarModule } from '@angular/material/toolbar'; // Importa MatToolbarModule
  import {MatIconModule} from '@angular/material/icon';
  import { FormsModule } from '@angular/forms';
  import { MatDialogModule } from '@angular/material/dialog';
  import { MatInputModule } from '@angular/material/input';

  @NgModule({
    declarations: [
      ProductoListComponent
    ],
    imports: [
      CommonModule,
      ProductoListRoutingModule,
      MatIconModule,
      MatDialogModule,
      MatInputModule,

      SpinnerModule,
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule, // Asegúrate de que esté agregado aquí
      MatToolbarModule, // Agrega MatToolbarModule al array de imports
      MatSelectModule, // Asegúrate de que esté agregado aquí
      FormsModule // Asegúrate de tener esta línea

    ]
  })
  export class ProductoListModule { }
