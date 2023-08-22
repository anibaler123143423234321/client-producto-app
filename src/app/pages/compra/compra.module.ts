import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraRoutingModule } from './compra-routing.module';
import { StoreModule } from '@ngrx/store';
import { reducers, effects } from './store';
import { EffectsModule } from '@ngrx/effects';
import { CompraListModule } from './pages/compra-list/compra-list.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CompraRoutingModule,
    StoreModule.forFeature('compra', reducers),
    EffectsModule.forFeature(effects),
    CompraListModule
  ]
})
export class CompraModule {}
