
import {Categoria} from '@app/models/backend/categoria';
export {Categoria as CategoriaResponse} from '@app/models/backend/categoria';

export type CategoriaCreateRequest = Omit<Categoria, 'id' | 'fechaCreacion'>;
