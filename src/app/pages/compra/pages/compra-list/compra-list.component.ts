import { Component, OnInit } from '@angular/core';
import * as fromRoot from '@app/store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromList from '../../store/save';
import { CompraResponse } from '../../store/save';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-compra-list',
  templateUrl: './compra-list.component.html',
  styleUrls: ['./compra-list.component.scss']
})
export class CompraListComponent {
  compras$ ! : Observable<CompraResponse[] | null>
  loading$ ! : Observable<boolean | null>
  currentPage = 1;
  itemsPerPage = 10;
  pictureDefault : string = "https://firebasestorage.googleapis.com/v0/b/edificacion-app.appspot.com/o/image%2F1637099019171_O5986058_0.jpg?alt=media&token=0a146233-d63b-4702-b28d-6eaddf5e207a"
  // Agrega una variable para almacenar la categoría seleccionada
  selectedDireccion: string | null = null;
  comprasLength: number | undefined;
 constructor(
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new fromList.Read());
    this.loading$ = this.store.pipe(select(fromList.getLoading));
    this.compras$ = this.store.pipe(select(fromList.getCompras));
    this.compras$.subscribe(compras => {
      this.comprasLength = compras?.length;
    });
  }
  // Agrega una función para filtrar por categoría
  filterByCategory(direccion: string | null): void {
    this.selectedDireccion = direccion;
  }

  get paginatedCompras$(): Observable<CompraResponse[] | null> {
    return this.compras$.pipe(
      map(compras => {
        if (!compras) {
          return null;
        }
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return compras.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }

  changePage(step: number): void {
    this.currentPage += step;
  }

}
