
import {Producto} from '@app/models/backend/producto';
export {Producto as ProductoResponse} from '@app/models/backend/producto';

export type ProductoCreateRequest = Omit<Producto, 'id' | 'fechaCreacion'>;
