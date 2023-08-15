
import {createSelector} from '@ngrx/store';
import {getProductoState, ProductoState} from '../index';

import { ListState } from './save.reducer';

export const getListState = createSelector(
  getProductoState,
  (state: ProductoState) => state.list
)

export const getLoading = createSelector(
  getListState,
  (state: ListState) => state.loading
)

export const getProductos = createSelector(
  getListState,
  (state: ListState) => state.productos
)




