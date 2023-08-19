import { Injectable } from '@angular/core';
import { ProductoResponse } from '@app/pages/producto/store/save';

@Injectable({
  providedIn: 'root'
})
export class GeneralproductserviceService {

  producto$! : ProductoResponse | null;

  constructor() { }
}
