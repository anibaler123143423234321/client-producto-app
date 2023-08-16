import * as fromList from './save/save.reducer';
import { SaveEffectsCompra } from './save/save.effects';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';


export interface CompraState {
  list: fromList.ListState;
}

export const reducers : ActionReducerMap<CompraState> = {
  list: fromList.reducer
}

export const effects : any = [
  SaveEffectsCompra
]

export const getCompraState = createFeatureSelector<CompraState>('compra');




