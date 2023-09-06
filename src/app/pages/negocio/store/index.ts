import * as fromList from './save/save.reducer';
import { SaveEffectsNegocio } from './save/save.effects';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';


export interface NegocioState {
  list: fromList.ListState;
}

export const reducers : ActionReducerMap<NegocioState> = {
  list: fromList.reducer
}

export const effects : any = [
  SaveEffectsNegocio
]

export const getNegocioState = createFeatureSelector<NegocioState>('negocio');




