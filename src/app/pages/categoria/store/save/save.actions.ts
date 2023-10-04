import {Action} from '@ngrx/store';
import {CategoriaCreateRequest, CategoriaResponse} from './save.models';

export enum Types {
  CREATE = '[Categoria] Create: Start',
  CREATE_SUCCESS = '[Categoria] Create: Success',
  CREATE_ERROR = '[Categoria] Create: Error',

  READ = '[Categoria] Read',
  READ_SUCCESS = '[Categoria] Read:Success',
  READ_ERROR = '[Categoria] Read:Error',

  FETCH_CATEGORIA = '[Categoria] Obtener Categoria',
  FETCH_CATEGORIA_SUCCESS = '[Categoria] Obtener Categoria Éxito',
  FETCH_CATEGORIA_ERROR = '[Categoria] Obtener Categoria Error',

}

export class Read implements Action {
  readonly type = Types.READ;
  constructor(){}
}

export class ReadSuccess implements Action {
  readonly type = Types.READ_SUCCESS;
  constructor(public categorias: CategoriaResponse[]){}
}

export class ReadError implements Action {
  readonly type = Types.READ_ERROR;
  constructor(public error: string){}
}

export class Create implements Action {
  readonly type = Types.CREATE;
  constructor(public categoria: CategoriaCreateRequest){}
}

export class CreateSuccess implements Action {
  readonly type = Types.CREATE_SUCCESS;
  constructor(public categoria: CategoriaResponse){}
}

export class CreateError implements Action {
  readonly type = Types.CREATE_ERROR;
  constructor(public error: string) {}
}

export class FetchCategoria implements Action {
  readonly type = Types.FETCH_CATEGORIA;
  constructor(public categoriaId: number) {}
}

export class FetchCategoriaSuccess implements Action {
  readonly type = Types.FETCH_CATEGORIA_SUCCESS;
  constructor(public categoria: CategoriaResponse) {}
}

export class FetchCategoriaError implements Action {
  readonly type = Types.FETCH_CATEGORIA_ERROR;
  constructor(public error: string) {}
}

export type All =
  Read
| ReadSuccess
| ReadError
| Create
| CreateSuccess
| CreateError
| FetchCategoria
| FetchCategoriaSuccess
| FetchCategoriaError;

