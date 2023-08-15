
import {Compra} from '@app/models/backend/compra';
export {Compra as CompraResponse} from '@app/models/backend/compra';

export type CompraCreateRequest = Omit<Compra, 'id' | 'fechaCompra'>;
