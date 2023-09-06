import {Action} from '@ngrx/store';
import {NegocioCreateRequest, NegocioResponse} from './save.models';

export enum Types {
  CREATE = '[Negocio] Create: Start',
  CREATE_SUCCESS = '[Negocio] Create: Success',
  CREATE_ERROR = '[Negocio] Create: Error',

  READ = '[Negocio] Read',
  READ_SUCCESS = '[Negocio] Read:Success',
  READ_ERROR = '[Negocio] Read:Error',

  FETCH_NEGOCIO = '[Negocio] Obtener Negocio',
  FETCH_NEGOCIO_SUCCESS = '[Negocio] Obtener Negocio Éxito',
  FETCH_NEGOCIO_ERROR = '[Negocio] Obtener Negocio Error',

}

export class Read implements Action {
  readonly type = Types.READ;
  constructor(){}
}

export class ReadSuccess implements Action {
  readonly type = Types.READ_SUCCESS;
  constructor(public negocios: NegocioResponse[]){}
}

export class ReadError implements Action {
  readonly type = Types.READ_ERROR;
  constructor(public error: string){}
}

export class Create implements Action {
  readonly type = Types.CREATE;
  constructor(public negocio: NegocioCreateRequest){}
}

export class CreateSuccess implements Action {
  readonly type = Types.CREATE_SUCCESS;
  constructor(public negocio: NegocioResponse){}
}

export class CreateError implements Action {
  readonly type = Types.CREATE_ERROR;
  constructor(public error: string) {}
}

export class FetchNegocio implements Action {
  readonly type = Types.FETCH_NEGOCIO;
  constructor(public negocioId: number) {}
}

export class FetchNegocioSuccess implements Action {
  readonly type = Types.FETCH_NEGOCIO_SUCCESS;
  constructor(public negocio: NegocioResponse) {}
}

export class FetchNegocioError implements Action {
  readonly type = Types.FETCH_NEGOCIO_ERROR;
  constructor(public error: string) {}
}

export type All =
  Read
| ReadSuccess
| ReadError
| Create
| CreateSuccess
| CreateError
| FetchNegocio
| FetchNegocioSuccess
| FetchNegocioError;

