import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompraFinalRoutingModule } from './compra-final-routing.module';
import { CompraFinalComponent } from './compra-final.component';
import { SpinnerModule } from '@app/shared/indicators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [CompraFinalComponent],
  imports: [
    CommonModule,
    CompraFinalRoutingModule,

    SpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule, // Asegúrate de importar FormsModule aquí
    MatIconModule, // Asegúrate de importar MatIconModule aquí

  ]
})
export class CompraFinalModule {}
