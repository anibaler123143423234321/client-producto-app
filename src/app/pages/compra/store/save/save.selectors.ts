import { createSelector, createFeatureSelector } from '@ngrx/store';
import { getCompraState, CompraState } from '../index';
import * as fromReducer from './save.reducer';

export const getListState = createSelector(
  getCompraState,
  (state: CompraState) => state.list
);

export const getLoading = createSelector(
  getListState,
  (state: fromReducer.ListState) => state.loading
);

export const getCompras = createSelector(
  getListState,
  (state: fromReducer.ListState) => state.compras
);

export const selectComprasState = createFeatureSelector<fromReducer.ListState>('compras');
