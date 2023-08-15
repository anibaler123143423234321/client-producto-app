import {Action} from '@ngrx/store';
import {ProductoCreateRequest, ProductoResponse} from './save.models';


export enum Types {
  CREATE = '[Producto] Create: Start',
  CREATE_SUCCESS = '[Producto] Create: Success',
  CREATE_ERROR = '[Producto] Create: Error',

  READ = '[Producto] Read',
  READ_SUCCESS = '[Producto] Read:Success',
  READ_ERROR = '[Producto] Read:Error',
}

export class Read implements Action {
  readonly type = Types.READ;
  constructor(){}
}

export class ReadSuccess implements Action {
  readonly type = Types.READ_SUCCESS;
  constructor(public productos: ProductoResponse[]){}
}

export class ReadError implements Action {
  readonly type = Types.READ_ERROR;
  constructor(public error: string){}
}



export class Create implements Action {
  readonly type = Types.CREATE;
  constructor(public producto: ProductoCreateRequest){}
}


export class CreateSuccess implements Action {
  readonly type = Types.CREATE_SUCCESS;
  constructor(public producto: ProductoResponse){}
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


