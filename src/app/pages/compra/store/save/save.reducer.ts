  import {CompraResponse} from './save.models';
  import * as fromActions from './save.actions';

  export interface ListState {
    compras: CompraResponse[] | null;
    compra: CompraResponse | null;
    loading: boolean | null;
    error: string | null;
  }

  export const initialState: ListState = {
    compras: null,
    compra: null,
    loading: null,
    error: null
  }


  export function reducer(state: ListState = initialState, action: fromActions.All | any) {

      switch(action.type){

        case fromActions.Types.CREATE: {
          return {...state, loading: true, error: null}
        }


        case fromActions.Types.CREATE_SUCCESS: {
          return {...state, loading: false, error: null, compra: action.compra}
        }

        case fromActions.Types.CREATE_ERROR : {
          return  {...state, loading: false, error: action.error}
        }

        case fromActions.Types.READ: {
          return {...state, loading: true, error: null}
        }

        case fromActions.Types.READ_SUCCESS: {
          return { ...state, loading: false, compras: action.compras };
        }

        case fromActions.Types.READ_ERROR: {
          return  {...state, loading: false, error: action.error}
        }

        case fromActions.Types.UPDATE_ESTADO_SUCCESS: {
          // Actualiza el estado de la compra en el estado local
          const updatedCompras = state.compras?.map(compra => {
            if (compra.id === action.updatedCompra.id) {
              return { ...compra, estadoCompra: action.updatedCompra.estadoCompra };
            }
            return compra;
          }) || null;

          return { ...state, loading: false, error: null, compras: updatedCompras };
        }

        default: {
          return state;
        }
      }


  }
