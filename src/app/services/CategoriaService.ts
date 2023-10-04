import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { CategoriaResponse } from '@app/pages/categoria/store/save';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private categoriasSubject = new BehaviorSubject<CategoriaResponse[]>([]);

  categorias$ = this.categoriasSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  cargarCategorias(): Observable<CategoriaResponse[]> {
    // Realizar una solicitud HTTP para cargar las categorías desde tu servicio Spring Boot
    return this.httpClient.get<CategoriaResponse[]>(`${environment.url}gateway/categoria`).pipe(
      tap((categorias: CategoriaResponse[]) => {
        console.log('Categorías cargadas:', categorias);
        this.categoriasSubject.next(categorias);
      }),
      catchError((error) => {
        console.error('Error al cargar las categorías:', error);
        throw error;
      })
    );
  }


// Método para actualizar una categoría
actualizarCategoria(categoriaId: number, categoria: any): Observable<any> {
  return this.httpClient.put(`${environment.url}gateway/categoria/${categoriaId}`, categoria).pipe(
    tap((response) => {
      console.log('Categoría actualizada:', response);
    }),
    catchError((error) => {
      console.error('Error al actualizar la categoría:', error);
      throw error;
    })
  );
}

// Método para eliminar una categoría
eliminarCategoria(categoriaId: number): Observable<any> {
  return this.httpClient.delete(`${environment.url}gateway/categoria/${categoriaId}`).pipe(
    tap(() => {
      console.log('Categoría eliminada');
    }),
    catchError((error) => {
      console.error('Error al eliminar la categoría:', error);
      throw error;
    })
  );
}
}
