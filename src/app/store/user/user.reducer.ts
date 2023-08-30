import {UserResponse} from './user.models';
import * as fromActions from './user.actions';

export interface UserState {
  entity : UserResponse | null;
  users: UserResponse[] | null;
  user: UserResponse | null;
  id : string | null;
  email : string | null;
  loading: boolean | null;
  error : string | null;
}


const initialState : UserState = {
  entity: null,
  users: null,
  user:null,
  id: null,
  email: null,
  loading: null,
  error: null
}

export function reducer(state = initialState, action: fromActions.All | any) : UserState {

    switch(action.type) {
        //init
        case fromActions.Types.INIT: {
          return {...state, loading: true};
        }

        case fromActions.Types.INIT_AUTHORIZED: {
          return {...state, loading: false, entity: action.user, email: action.email, error: null};
        }

        case fromActions.Types.INIT_UNAUTHORIZED: {
          return {...state, loading: false, entity: null, email: null, error: null};
        }

        case fromActions.Types.INIT_ERROR: {
          return {...state, loading: false, entity: null, email: null, error: action.error};
        }

        //login
        case fromActions.Types.SIGIN_IN_EMAIL: {
          return {...state, loading: true, entity: null, email: null, error: null};
        }

        case fromActions.Types.SIGIN_IN_EMAIL_SUCCESS: {
          return {...state, loading: false, entity: action.user, email: action.email, error: null};
        }

        case fromActions.Types.SIGIN_IN_EMAIL_ERROR: {
          return {...state, loading: false, entity: null, email: null, error: action.error};
        }

        //signup o registro de usuarios
        case fromActions.Types.SIGN_UP_EMAIL: {
          return {...state, loading: true, entity: null, email: null, error: null};
        }

        case fromActions.Types.SIGN_UP_EMAIL_SUCCESS: {
          return {...state, loading: false, entity: action.user, email: action.email, error: null};
        }

        case fromActions.Types.SIGN_UP_EMAIL_ERROR: {
          return {...state, loading: false, entity: null, email: null, error: action.error};
        }

        //LOGOUT o Salir de Sesion
        case fromActions.Types.SIGN_OUT_EMAIL: {
          return {...initialState};
        }

        case fromActions.Types.SIGIN_OUT_EMAIL_SUCCESS: {
          return {...initialState};
        }

        case fromActions.Types.SIGIN_OUT_EMAIL_ERROR: {
          return {...state, loading: false, entity: null, email: null, error: action.error};
        }

        case fromActions.Types.CREATE: {
          return {...state, loading: true, error: null}
        }


        case fromActions.Types.CREATE_SUCCESS: {
          return {...state, loading: false, error: null, user: action.user}
        }

        case fromActions.Types.CREATE_ERROR : {
          return  {...state, loading: false, error: action.error}
        }

        case fromActions.Types.READ: {
          return {...state, loading: true, error: null}
        }

        case fromActions.Types.READ_SUCCESS: {
          return {...state, loading: false, users: action.users}
        }

        case fromActions.Types.READ_ERROR: {
          return  {...state, loading: false, error: action.error}
        }

        case fromActions.Types.LIST_USERS: {
          return { ...state, loading: true, error: null };
        }

        case fromActions.Types.LIST_USERS_SUCCESS: {
          return { ...state, loading: false, users: action.users, error: null };
        }

        case fromActions.Types.LIST_USERS_ERROR: {
          return { ...state, loading: false, error: action.error };
        }

        default: {
          return state;
        }
    }
}
