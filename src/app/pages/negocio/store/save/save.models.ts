
import {Negocio} from '@app/models/backend/negocio';
export {Negocio as NegocioResponse} from '@app/models/backend/negocio';

export type NegocioCreateRequest = Omit<Negocio, 'id' >;
