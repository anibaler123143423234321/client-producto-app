import * as fromList from './save/save.reducer';
import { SaveEffects } from './save/save.effects';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';


export interface ProductoState {
  list: fromList.ListState;
}

export const reducers : ActionReducerMap<ProductoState> = {
  list: fromList.reducer
}

export const effects : any = [
  SaveEffects
]

export const getProductoState = createFeatureSelector<ProductoState>('producto');




