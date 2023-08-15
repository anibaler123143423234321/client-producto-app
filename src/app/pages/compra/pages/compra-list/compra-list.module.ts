import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompraListRoutingModule } from './compra-list-routing.module';
import { CompraListComponent } from './compra-list.component';
import { SpinnerModule } from '@app/shared/indicators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'; // Asegúrate de que esto esté importado
import { MatSelectModule } from '@angular/material/select'; // Asegúrate de que esto esté importado
import { MatToolbarModule } from '@angular/material/toolbar'; // Importa MatToolbarModule


@NgModule({
  declarations: [
    CompraListComponent
  ],
  imports: [
    CommonModule,
    CompraListRoutingModule,


    SpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule, // Asegúrate de que esté agregado aquí
    MatToolbarModule, // Agrega MatToolbarModule al array de imports
    MatSelectModule // Asegúrate de que esté agregado aquí

  ]
})
export class CompraListModule { }
