import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityPhotoModule } from './entity-photo/entity-photo.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EntityPhotoModule
  ],
  exports: [
    EntityPhotoModule
  ]
})
export class LayoutsModule { }
