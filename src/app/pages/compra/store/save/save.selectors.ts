
import {createSelector} from '@ngrx/store';
import {getCompraState, CompraState} from '../index';

import { ListState } from './save.reducer';

export const getListState = createSelector(
  getCompraState,
  (state: CompraState) => state.list
)

export const getLoading = createSelector(
  getListState,
  (state: ListState) => state.loading
)

export const getCompras = createSelector(
  getListState,
  (state: ListState) => state.compras
)




