import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as fromRoot from '@app/store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromList from '../../store/save';
import { ProductoResponse } from '../../store/save';
import { map } from 'rxjs/operators';
import { UserResponse } from '@app/store/user';
import { GeneralService } from '@app/services/general.service';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss']
})
export class ProductoListComponent implements OnInit {
  productos$ ! : Observable<ProductoResponse[] | null>
  userId: number | undefined;
  productoId: number | undefined;
  nombreUsuario: string | undefined; // Agrega la variable nombreUsuario aquí
  apellidoUsuario: string | undefined; // Agrega la variable nombreUsuario aquí

  loading$ ! : Observable<boolean | null>
  currentPage = 1;
  itemsPerPage = 10;
  pictureDefault : string = "https://firebasestorage.googleapis.com/v0/b/edificacion-app.appspot.com/o/image%2F1637099019171_O5986058_0.jpg?alt=media&token=0a146233-d63b-4702-b28d-6eaddf5e207a"
  // Agrega una variable para almacenar la categoría seleccionada
  selectedDireccion: string | null = null;
  productosLength: number | undefined;

  usuario$! : UserResponse | null;

 constructor(
    private store: Store<fromRoot.State>,
    public GeneralService: GeneralService,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new fromList.Read());
    this.loading$ = this.store.pipe(select(fromList.getLoading));

    this.productos$ = this.store.pipe(select(fromList.getProductos));
    this.productos$.subscribe(productos => {
      this.productosLength = productos?.length;
    });

    this.userId = this.GeneralService.usuario$?.id;
    this.productoId = this.GeneralService.usuario$?.id;
    this.nombreUsuario = this.GeneralService.usuario$?.nombre;
    this.apellidoUsuario = this.GeneralService.usuario$?.apellido;


    console.log('Usuario Product List:',this.GeneralService.usuario$);
    console.log('Nombre Usuario:',this.nombreUsuario);
    console.log('Apellido Usuario:',this.apellidoUsuario);
  }
  // Agrega una función para filtrar por categoría
  filterByCategory(direccion: string | null): void {
    this.selectedDireccion = direccion;
  }

  get paginatedProductos$(): Observable<ProductoResponse[] | null> {
    return this.productos$.pipe(
      map(productos => {

        if (!productos) {
          return null;
        }
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return productos.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }
  changePage(step: number): void {
    this.currentPage += step;
  }


}
