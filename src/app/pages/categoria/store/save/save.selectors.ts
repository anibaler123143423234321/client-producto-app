
import {createSelector} from '@ngrx/store';
import {getCategoriaState, CategoriaState} from '../index';

import { ListState } from './save.reducer';

export const getListState = createSelector(
  getCategoriaState,
  (state: CategoriaState) => state.list
)

export const getLoading = createSelector(
  getListState,
  (state: ListState) => state.loading
)

// Modifica el selector para devolver un Observable<fromList.CategoriaResponse[]> | null
export const getCategorias = createSelector(
  getListState,
  (state: ListState) => state.categorias
);





