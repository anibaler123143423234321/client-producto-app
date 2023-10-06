import { Injectable } from '@angular/core';
import { CompraCreateRequest } from '@app/pages/compra/store/save';
import { ProductoResponse } from '@app/pages/producto/store/save';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private arrayCompra: CompraCreateRequest[] = [];
  httpClient: any;

  constructor() {

        // Al inicializar el servicio, intenta cargar los datos del carrito desde el almacenamiento local.
    this.loadCartData();

    // Agrega un listener para el evento beforeunload
    window.addEventListener('beforeunload', () => {
      // Limpia el carrito y el almacenamiento local antes de recargar la página
      this.clearCart();
    });
  }

  private loadCartData() {
    const storedData = localStorage.getItem('arrayCompra');
    if (storedData) {
      this.arrayCompra = JSON.parse(storedData);
    }
  }

  getArrayCompra(): CompraCreateRequest[] {
    return this.arrayCompra;
  }

  setArrayCompra(data: CompraCreateRequest[]): void {
    this.arrayCompra = data;
    // Almacenar los datos del carrito en el almacenamiento local para persistencia.
    localStorage.setItem('arrayCompra', JSON.stringify(data));
  }

  clearCart() {
    // Limpia el carrito y el almacenamiento local
    this.arrayCompra = [];
    localStorage.removeItem('arrayCompra');
  }


}
