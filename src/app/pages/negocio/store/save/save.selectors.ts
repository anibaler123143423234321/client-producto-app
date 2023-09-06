
import {createSelector} from '@ngrx/store';
import {getNegocioState, NegocioState} from '../index';

import { ListState } from './save.reducer';

export const getListState = createSelector(
  getNegocioState,
  (state: NegocioState) => state.list
)

export const getLoading = createSelector(
  getListState,
  (state: ListState) => state.loading
)

export const getNegocios = createSelector(
  getListState,
  (state: ListState) => state.negocios
)




