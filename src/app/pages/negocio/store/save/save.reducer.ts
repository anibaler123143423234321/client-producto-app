import {NegocioResponse} from './save.models';
import * as fromActions from './save.actions';

export interface ListState {
  negocios: NegocioResponse[] | null;
  negocio: NegocioResponse | null;
  loading: boolean | null;
  error: string | null;
}

export const initialState: ListState = {
  negocios: null,
  negocio: null,
  loading: null,
  error: null
}


export function reducer(state: ListState = initialState, action: fromActions.All | any) {

    switch(action.type){

      case fromActions.Types.CREATE: {
        return {...state, loading: true, error: null}
      }


      case fromActions.Types.CREATE_SUCCESS: {
        return {...state, loading: false, error: null, negocio: action.negocio}
      }

      case fromActions.Types.CREATE_ERROR : {
        return  {...state, loading: false, error: action.error}
      }

      case fromActions.Types.READ: {
        return {...state, loading: true, error: null}
      }

      case fromActions.Types.READ_SUCCESS: {
        return { ...state, negocios: action.negocios, loading: false, error: null };
      }


      case fromActions.Types.READ_ERROR: {
        return  {...state, loading: false, error: action.error}
      }


      default: {
        return state;
      }
    }


}
