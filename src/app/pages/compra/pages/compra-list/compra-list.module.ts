import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompraListRoutingModule } from './compra-list-routing.module';
import { CompraListComponent } from './compra-list.component';
import { SpinnerModule } from '@app/shared/indicators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [CompraListComponent],
  imports: [
    CommonModule,
    CompraListRoutingModule,

    SpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule
  ]
})
export class CompraListModule {}
