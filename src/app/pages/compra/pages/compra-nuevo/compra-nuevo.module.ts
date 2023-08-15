import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompraNuevoRoutingModule } from './compra-nuevo-routing.module';
import { CompraNuevoComponent } from './compra-nuevo.component';


@NgModule({
  declarations: [
    CompraNuevoComponent
  ],
  imports: [
    CommonModule,
    CompraNuevoRoutingModule
  ]
})
export class CompraNuevoModule { }
