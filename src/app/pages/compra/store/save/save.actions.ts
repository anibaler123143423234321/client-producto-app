import {Action} from '@ngrx/store';
import {CompraCreateRequest, CompraResponse} from './save.models';


export enum Types {
  CREATE = '[Compra] Create: Start',
  CREATE_SUCCESS = '[Compra] Create: Success',
  CREATE_ERROR = '[Compra] Create: Error',

  READ = '[Compra] Read',
  READ_SUCCESS = '[Compra] Read:Success',
  READ_ERROR = '[Compra] Read:Error',
}

export class Read implements Action {
  readonly type = Types.READ;
  constructor(){}
}

export class ReadSuccess implements Action {
  readonly type = Types.READ_SUCCESS;
  constructor(public compras: CompraResponse[]){}
}

export class ReadError implements Action {
  readonly type = Types.READ_ERROR;
  constructor(public error: string){}
}



export class Create implements Action {
  readonly type = Types.CREATE;
  constructor(public compra: CompraCreateRequest){}
}


export class CreateSuccess implements Action {
  readonly type = Types.CREATE_SUCCESS;
  constructor(public compra: CompraResponse){}
}

export class CreateError implements Action {
  readonly type = Types.CREATE_ERROR;
  constructor(public error: string) {}
}

export type All =
  Read
| ReadSuccess
| ReadError
| Create | CreateSuccess | CreateError;


