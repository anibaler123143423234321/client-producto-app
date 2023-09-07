import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { NegocioResponse } from '@app/pages/negocio/store/save';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class NegocioService {
  private negociosSubject = new BehaviorSubject<NegocioResponse[]>([]);

  negocios$ = this.negociosSubject.asObservable();
    userId: number = 0;

  constructor(private httpClient: HttpClient) {}

  cargarDatosDeNegocios(): Observable<NegocioResponse[]> {
    // Realizar una solicitud HTTP para cargar los datos de negocios desde tu servicio Spring Boot
    return this.httpClient.get<NegocioResponse[]>(`${environment.url}gateway/negocios/`).pipe(
      tap((negocios: NegocioResponse[]) => {
        console.log('Datos de negocios cargados:', negocios);
      }),
      catchError((error) => {
        console.error('Error al cargar los datos de negocios:', error);
        throw error;
      })
    );
  }



  setNegocios(negocios: NegocioResponse[]) {
    this.negociosSubject.next(negocios);
  }


}
