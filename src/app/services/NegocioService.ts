// En NegocioService
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

  private negocioActualSubject = new BehaviorSubject<NegocioResponse | null>(null);
  negocioActual$ = this.negocioActualSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  cargarDatosDeNegocios(): Observable<NegocioResponse[]> {
    return this.httpClient.get<NegocioResponse[]>(`${environment.url}gateway/negocios/`).pipe(
      tap((negocios: NegocioResponse[]) => {
        console.log('Datos de negocios cargados:', negocios);
        const negocioUsuario = negocios.find(
          (negocio) => negocio.id === this.userId
        );
        if (negocioUsuario) {
          this.negocioActualSubject.next(negocioUsuario);
        }
        this.negociosSubject.next(negocios);
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


  getNegocioById(id: number): Observable<NegocioResponse> {
    const url = `${environment.url}gateway/negocios/${id}`;
    return this.httpClient.get<NegocioResponse>(url);
  }


}
