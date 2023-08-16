import * as fromList from './save/save.reducer';
import { SaveEffectsProducto } from './save/save.effects';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';


export interface ProductoState {
  list: fromList.ListState;
}

export const reducers : ActionReducerMap<ProductoState> = {
  list: fromList.reducer
}

export const effects : any = [
  SaveEffectsProducto
]

export const getProductoState = createFeatureSelector<ProductoState>('producto');




