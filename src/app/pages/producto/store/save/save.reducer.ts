import {ProductoResponse} from './save.models';
import * as fromActions from './save.actions';
import * as fromList from './save.actions';


export interface ListState {
  productos: ProductoResponse[] | null;
  producto: ProductoResponse | null;
  loading: boolean | null;
  error: string | null;
}


export const initialState: ListState = {
  productos: null,
  producto: null,
  loading: null,
  error: null
}


export function reducer(state: ListState = initialState, action: fromActions.All | any) {

    switch(action.type){

      case fromActions.Types.CREATE: {
        return {...state, loading: true, error: null}
      }


      case fromActions.Types.CREATE_SUCCESS: {
        return {...state, loading: false, error: null, producto: action.producto}
      }

      case fromActions.Types.CREATE_ERROR : {
        return  {...state, loading: false, error: action.error}
      }

      case fromActions.Types.READ: {
        return {...state, loading: true, error: null}
      }

      case fromActions.Types.READ_SUCCESS: {
        return {...state, loading: false, productos: action.productos}
      }

      case fromActions.Types.READ_ERROR: {
        return  {...state, loading: false, error: action.error}
      }


      default: {
        return state;
      }
    }


}
