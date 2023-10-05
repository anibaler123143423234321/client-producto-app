import { Component, OnInit } from '@angular/core';
import * as fromRoot from '@app/store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromList from '../../store/save';
import { ProductoResponse } from '../../store/save';
import { map } from 'rxjs/operators';
import { UserResponse } from '@app/store/user';
import { GeneralService } from '@app/services/general.service';
import { CompraCreateRequest } from '@app/pages/compra/store/save';
import { Router } from '@angular/router';
import { CarritoService } from '@app/services/CarritoService';
import { NegocioService } from '@app/services/NegocioService';
import { CategoriaService } from '@app/services/CategoriaService';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss'],
})
export class ProductoListComponent implements OnInit {
  productos$!: Observable<ProductoResponse[] | null>;
  userId!: number;
  productoId: number | undefined;
  nombreUsuario: string | undefined;
  apellidoUsuario: string | undefined;
  uniqueProductIds: Set<number> = new Set<number>();
  productoAgregadoMensaje = '';
  mostrarTabla = false;
  arrayCompra: CompraCreateRequest[] = [];
  loading$!: Observable<boolean | null>;
  currentPage = 1;
  itemsPerPage = 10;
  pictureDefault =
    'https://firebasestorage.googleapis.com/v0/b/edificacion-app.appspot.com/o/image%2F1637099019171_O5986058_0.jpg?alt=media&token=0a146233-d63b-4702-b28d-6eaddf5e207a';
  selectedCategoria: string | null = null;
  productosLength: number | undefined;
  cartItemCount = 0;
  usuario$!: UserResponse | null;
  idNegocio: number | undefined;
  idNegocioProducto: string | undefined;
  nombreNegocioProducto: string | undefined;
  negocios: { id: number; nombre: string }[] = [];
  idNegocioUser: string | undefined;
  filteredProductos$: Observable<ProductoResponse[] | null> = this.productos$;
  categorias: { id: number; nombre: string }[] = [];

  constructor(
    private store: Store<fromRoot.State>,
    public GeneralService: GeneralService,
    private router: Router,
    public CarritoService: CarritoService,
    public NegocioService: NegocioService,
    public CategoriaService: CategoriaService
  ) {  this.selectedCategoria = "-1";
   // Establecer por defecto "Todas las categorías"
}

ngOnInit(): void {
  this.store.dispatch(new fromList.Read());
  this.loading$ = this.store.pipe(select(fromList.getLoading));
  this.idNegocioUser = this.GeneralService.usuario$?.negocioId;

  this.productos$ = this.store.pipe(select(fromList.getProductos));
  this.productos$.subscribe((productos) => {
    if (productos && productos.length > 0) {
      this.idNegocioProducto = productos.find(
        (producto) => producto.negocioId === this.idNegocioUser
      )?.negocioId;

      console.log('idNegocioProducto:', this.idNegocioProducto);
    }
  });

  this.CategoriaService.cargarCategorias().subscribe((categorias) => {
    this.categorias = categorias;
    this.selectedCategoria = "-1"; // Establecer por defecto "Todas las categorías"
    this.filterByCategory(); // Llamar al método para mostrar todos los productos
  });

    this.arrayCompra = this.CarritoService.getArrayCompra();
    this.cartItemCount = this.calculateUniqueProductCount();

    this.userId = this.GeneralService.usuario$?.id;
    this.productoId = this.GeneralService.usuario$?.id;
    this.nombreUsuario = this.GeneralService.usuario$?.nombre;
    this.apellidoUsuario = this.GeneralService.usuario$?.apellido;
  }

  filterByCategory(): void {
    this.filteredProductos$ = this.productos$.pipe(
      map((productos) => {
        if (!productos) {
          return null;
        }

        // Comprueba si selectedCategoria es null o undefined
        if (this.selectedCategoria === null || this.selectedCategoria === undefined) {
          // En este caso, muestra todos los productos
          return productos;
        }

        // Comprueba si selectedCategoria es "-1" (Todas las categorías)
      if (this.selectedCategoria === "-1") {
        return productos; // Mostrar todos los productos
      }

      const categoriaIdSeleccionada = this.selectedCategoria.toString();

        // Agrega un console.log para verificar los productos y la categoría seleccionada
        console.log('Productos:', productos);
        console.log('Categoría seleccionada:', categoriaIdSeleccionada);

        return productos.filter((producto) => {
          if (producto.categoriaId !== undefined) {
            const categoriaIdProducto = producto.categoriaId.toString();
            console.log('Comparación:', categoriaIdProducto, categoriaIdSeleccionada);
            return categoriaIdProducto === categoriaIdSeleccionada;
          }
          return false;
        });
      })
    );
  }


  get paginatedProductos$(): Observable<ProductoResponse[] | null> {
    return this.productos$.pipe(
      map((productos) => {
        if (!productos) {
          return null;
        }
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return productos
          .filter((producto) => {
            return (
              this.idNegocioUser !== undefined &&
              producto.negocioId === this.idNegocioUser
            );
          })
          .slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }

  changePage(step: number): void {
    this.currentPage += step;
  }

  addCarrito(IDProducto: number, precioProducto: any, nombreProducto: any) {
    const estadoCompra = 'Pendiente Por Revisar';

    let compra: CompraCreateRequest = {
      titulo: nombreProducto,
      cantidad: 1,
      productoId: IDProducto,
      userId: this.userId,
      precioCompra: precioProducto,
      estadoCompra: estadoCompra,
    };

    const existingCompra = this.arrayCompra.find(
      (c) => c.productoId === IDProducto
    );

    if (existingCompra) {
      existingCompra.cantidad += 1;
    } else {
      const compra: CompraCreateRequest = {
        titulo: nombreProducto,
        cantidad: 1,
        productoId: IDProducto,
        userId: this.userId,
        precioCompra: precioProducto,
        estadoCompra: estadoCompra,
      };

      this.arrayCompra.push(compra);
      this.uniqueProductIds.add(IDProducto);
      this.CarritoService.setArrayCompra(this.arrayCompra);
      this.cartItemCount = this.uniqueProductIds.size;
    }

    this.CarritoService.setArrayCompra(this.arrayCompra);
    this.cartItemCount = this.uniqueProductIds.size;

    this.mostrarTabla = true;
    console.log('Contenido de arrayCompra:', this.arrayCompra);
  }

  calculateUniqueProductCount(): number {
    const uniqueProductIds = new Set<number>();

    this.arrayCompra.forEach((compra) => {
      uniqueProductIds.add(compra.productoId);
    });

    return uniqueProductIds.size;
  }

  navegarACompraFinal() {
    const arrayCompraData = JSON.stringify(this.arrayCompra);

    this.router.navigate(['../../compra/final'], {
      queryParams: { arrayCompra: arrayCompraData },
    });
  }
}
