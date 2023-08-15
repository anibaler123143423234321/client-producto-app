import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductoRoutingModule,

    StoreModule.forFeature('producto', reducers),
    EffectsModule.forFeature(effects),
  ]
})
export class ProductoModule { }
