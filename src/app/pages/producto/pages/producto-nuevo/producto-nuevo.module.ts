import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoNuevoRoutingModule } from './producto-nuevo-routing.module';
import { ProductoNuevoComponent } from './producto-nuevo.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '@app/shared/indicators';
import { EntityPhotoModule } from '@app/shared/layouts';
import { PopupsModule } from '@app/shared/popups';

// Importa el módulo MatRadioModule para resolver el error
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select'; // Asegúrate de importar MatSelectModule

@NgModule({
  declarations: [
    ProductoNuevoComponent
  ],
  imports: [
    CommonModule,
    ProductoNuevoRoutingModule,

    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    SpinnerModule,
    EntityPhotoModule,
    PopupsModule,
       // Agrega el MatRadioModule al módulo
       MatRadioModule,
       MatSelectModule, // Agrega MatSelectModule a la lista de imports

  ]
})
export class ProductoNuevoModule { }
