import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRoutingModule } from './categoria-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CategoriaRoutingModule,

    StoreModule.forFeature('categoria', reducers),
    EffectsModule.forFeature(effects),
  ]
})
export class CategoriaModule { }
