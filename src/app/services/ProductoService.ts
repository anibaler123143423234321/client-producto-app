import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ProductoResponse } from '@app/pages/producto/store/save';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private httpClient: HttpClient) {}

  actualizarProducto(productoId: number, nuevoProducto: ProductoResponse): Observable<ProductoResponse> {
    const url = `${environment.url}gateway/producto/${productoId}`; // Utiliza la URL completa aquí
    return this.httpClient.put<ProductoResponse>(url, nuevoProducto).pipe(
      tap((productoActualizado: ProductoResponse) => {
        console.log('Producto actualizado:', productoActualizado);
      }),
      catchError((error) => {
        console.error('Error al actualizar el producto:', error);
        throw error;
      })
    );
  }

  obtenerProducto(productoId: number): Observable<ProductoResponse> {
    const url = `${environment.url}gateway/producto/${productoId}`;
    return this.httpClient.get<ProductoResponse>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener el producto:', error);
        throw error;
      })
    );
  }

}
