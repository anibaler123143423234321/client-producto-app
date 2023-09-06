import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NegocioRoutingModule } from './negocio-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NegocioRoutingModule,

    StoreModule.forFeature('negocio', reducers),
    EffectsModule.forFeature(effects),
  ]
})
export class NegocioModule { }
