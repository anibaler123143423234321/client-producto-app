import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompraRoutingModule } from './compra-routing.module';
import { StoreModule } from '@ngrx/store';
import { reducers,effects } from '@app/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CompraRoutingModule,
    StoreModule.forFeature('producto',reducers),
    EffectsModule.forFeature(effects)

  ]
})
export class CompraModule { }
