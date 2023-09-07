import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { CompraResponse } from '@app/pages/compra/store/save'; // Asegúrate de importar la clase CompraResponse desde la ubicación correcta
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  private comprasSubject = new BehaviorSubject<CompraResponse[]>([]);

  compras$ = this.comprasSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  cargarDatosDeCompras(): Observable<CompraResponse[]> {
    // Realizar una solicitud HTTP para cargar los datos de compras desde tu servicio Spring Boot
    return this.httpClient.get<CompraResponse[]>(`${environment.url}gateway/compra/all`).pipe(
      tap((compras: CompraResponse[]) => {
        console.log('Datos de compras cargados:', compras);
      }),
      catchError((error) => {
        console.error('Error al cargar los datos de compras:', error);
        throw error;
      })
    );
  }

  setCompras(compras: CompraResponse[]) {
    this.comprasSubject.next(compras);
  }
}
