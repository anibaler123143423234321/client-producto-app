import { Action } from '@ngrx/store';
import { CompraCreateRequest, CompraResponse } from './save.models';

export enum Types {
  CREATE = '[Compra] Create: Start',
  CREATE_SUCCESS = '[Compra] Create: Success',
  CREATE_ERROR = '[Compra] Create: Error',

  READ = '[Compra] Read',
  READ_SUCCESS = '[Compra] Read:Success',
  READ_ERROR = '[Compra] Read:Error',

  FETCH_COMPRA = '[Compra] Obtener Compra',
  FETCH_COMPRA_SUCCESS = '[Compra] Obtener Compra Éxito',
  FETCH_COMPRA_ERROR = '[Compra] Obtener Compra Error',

}

export class Read implements Action {
  readonly type = Types.READ;
}

export class ReadSuccess implements Action {
  readonly type = Types.READ_SUCCESS;
  constructor(public compras: CompraResponse[]) {}
}

export class ReadError implements Action {
  readonly type = Types.READ_ERROR;
  constructor(public error: string) {}
}

export class Create implements Action {
  readonly type = Types.CREATE;
  constructor(public compra: CompraCreateRequest) {}
}

export class CreateSuccess implements Action {
  readonly type = Types.CREATE_SUCCESS;
  constructor(public compra: CompraResponse) {}
}

export class CreateError implements Action {
  readonly type = Types.CREATE_ERROR;
  constructor(public error: string) {}
}

export class FetchCompra implements Action {
  readonly type = Types.FETCH_COMPRA;
  constructor(public compraId: number) {}
}

export class FetchCompraSuccess implements Action {
  readonly type = Types.FETCH_COMPRA_SUCCESS;
  constructor(public compra: CompraResponse) {}
}

export class FetchCompraError implements Action {
  readonly type = Types.FETCH_COMPRA_ERROR;
  constructor(public error: string) {}
}

export type All =
  Read
  | ReadSuccess
  | ReadError
  | Create
  | CreateSuccess
  | CreateError
  | FetchCompra
  | FetchCompraSuccess
  | FetchCompraError;
