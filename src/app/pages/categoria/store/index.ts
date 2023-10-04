  import * as fromList from './save/save.reducer';
  import { SaveEffectsCategoria } from './save/save.effects';
  import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';


  export interface CategoriaState {
    list: fromList.ListState;
  }

  export const reducers : ActionReducerMap<CategoriaState> = {
    list: fromList.reducer
  }

  export const effects : any = [
    SaveEffectsCategoria
  ]

  export const getCategoriaState = createFeatureSelector<CategoriaState>('categoria');




