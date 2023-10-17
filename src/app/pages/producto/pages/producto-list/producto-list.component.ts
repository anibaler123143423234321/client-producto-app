import { Component, Input, OnInit } from '@angular/core';
import * as fromRoot from '@app/store';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import * as fromList from '../../store/save';
import { ProductoResponse } from '../../store/save';
import { map, takeUntil } from 'rxjs/operators';
import { UserResponse } from '@app/store/user';
import { GeneralService } from '@app/services/general.service';
import { CompraCreateRequest } from '@app/pages/compra/store/save';
import { Router } from '@angular/router';
import { CarritoService } from '@app/services/CarritoService';
import { NegocioService } from '@app/services/NegocioService';
import { CategoriaService } from '@app/services/CategoriaService';
import { ProductoService } from '@app/services/ProductoService';
import { User } from '@app/models/backend';
import {  ElementRef, ViewChild } from '@angular/core';

import * as fromUser from '@app/store/user';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss'],
})
export class ProductoListComponent implements OnInit {
  @Input() user: User | null = null;
  user$!: Observable<fromUser.UserResponse>;
  isAuthorized$!: Observable<boolean>;
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
  stockActualizado = false; // Variable para controlar el mensaje de confirmación
  private unsubscribe$ = new Subject<void>();

  @ViewChild('productDetails', { static: true }) productDetails: ElementRef | undefined;
  selectedProduct: any;

  selectedProductForEdit: ProductoResponse | null = null;
  newStockValue: number | undefined;


  editingStock: boolean = false;
  selectedProductId: number | null = null;
  searchTerm: string = '';


  constructor(
    private store: Store<fromRoot.State>,
    public GeneralService: GeneralService,
    private router: Router,
    public CarritoService: CarritoService,
    public NegocioService: NegocioService,
    public CategoriaService: CategoriaService,
    public productoService: ProductoService
  ) {
    this.selectedCategoria = "-1";
    // Inicializa las variables aquí para evitar errores de "undefined"
    this.userId = 0;
    this.productoId = undefined;
    this.nombreUsuario = '';
    this.apellidoUsuario = '';

    // Recupera el usuario desde el localStorage si existe
    const userData = localStorage.getItem('user');
    if (userData) {
      const user: User = JSON.parse(userData);
      this.GeneralService.usuario$ = user; // Establece el usuario en GeneralService
      this.userId = user.id;
      this.nombreUsuario = user.nombre;
      this.apellidoUsuario = user.apellido;
    }
  }

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(fromUser.getUser)) as Observable<fromUser.UserResponse>;
    this.isAuthorized$ = this.store.pipe(select(fromUser.getIsAuthorized)) as Observable<boolean>;
    this.store.dispatch(new fromList.Read());
    this.loading$ = this.store.pipe(select(fromList.getLoading));

    this.idNegocioUser = this.GeneralService.usuario$?.negocioId;

    // Suscríbete a productos$ una vez y úsalo en varias partes del componente
    this.productos$ = this.store.pipe(
      select(fromList.getProductos),
      takeUntil(this.unsubscribe$) // Unsubscribe al destruir el componente
    );

     this.productos$.subscribe((productos) => {
      if (productos && productos.length > 0) {
        this.idNegocioProducto = productos[0].negocioId;
        console.log('idNegocioUser:', this.idNegocioUser);
        console.log('idNegocioProducto:', this.idNegocioProducto);
        console.log('Productos:', productos);
        this.CategoriaService.cargarCategorias().subscribe((categorias) => {
          this.categorias = categorias.filter(categoria => categoria.negocioId === this.idNegocioUser);
          this.selectedCategoria = "-1"; // Establecer por defecto "Todas las categorías"
          this.filterByCategory(); // Llamar al método para mostrar todos los productos
        });
      }
    });

    this.arrayCompra = this.CarritoService.getArrayCompra();
    this.cartItemCount = this.calculateUniqueProductCount();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  filterByCategory(): void {
    this.filteredProductos$ = this.productos$.pipe(
      map((productos) => {
        if (!productos) {
          return null;
        }

        // Comprueba si selectedCategoria es null o undefined
        if (this.selectedCategoria === null || this.selectedCategoria === undefined) {
          // En este caso, muestra todos los productos del mismo negocioId
          return productos.filter((producto) => producto.negocioId === this.idNegocioUser);
        }

        // Comprueba si selectedCategoria es "-1" (Todas las categorías)
        if (this.selectedCategoria === "-1") {
          // Mostrar todos los productos del mismo negocioId
          return productos.filter((producto) => producto.negocioId === this.idNegocioUser);
        }

        const categoriaIdSeleccionada = this.selectedCategoria.toString();

        // Agrega un console.log para verificar los productos y la categoría seleccionada
        console.log('Productos:', productos);
        console.log('Categoría seleccionada:', categoriaIdSeleccionada);

        return productos.filter((producto) => {
          if (producto.categoriaId !== undefined) {
            const categoriaIdProducto = producto.categoriaId.toString();
            console.log('Comparación:', categoriaIdProducto, categoriaIdSeleccionada);
            return categoriaIdProducto === categoriaIdSeleccionada && producto.negocioId === this.idNegocioUser;
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

    this.productos$
      .pipe(
        map((productos) =>
          productos?.find((producto) => producto.id === IDProducto)
        )
      )
      .subscribe((productoSeleccionado) => {
        if (productoSeleccionado && productoSeleccionado.stock > 0) {
          // Resta el stock del producto en el estado
          productoSeleccionado.stock -= 1;

          // Establece el mensaje de confirmación solo cuando se hace clic en "Ir a Comprar"
          if (!this.mostrarTabla) {
            this.stockActualizado = true;
          }

          const productoEnCarrito = this.arrayCompra.find(
            (c) => c.productoId === IDProducto
          );

          if (productoEnCarrito) {
            // Si el producto ya está en el carrito, crea un nuevo objeto con cantidad + 1
            const compra: CompraCreateRequest = {
              titulo: nombreProducto,
              cantidad: productoEnCarrito.cantidad + 1, // Aumenta la cantidad en 1
              productoId: IDProducto,
              userId: this.userId,
              precioCompra: precioProducto,
              estadoCompra: estadoCompra,
            };

            // Actualiza la compra en el array
            this.arrayCompra = this.arrayCompra.map((c) =>
              c.productoId === IDProducto ? compra : c
            );
          } else {
            // Si el producto no está en el carrito, crea una nueva compra
            const compra: CompraCreateRequest = {
              titulo: nombreProducto,
              cantidad: 1,
              productoId: IDProducto,
              userId: this.userId,
              precioCompra: precioProducto,
              estadoCompra: estadoCompra,
            };

            this.arrayCompra.push(compra);
          }

          this.uniqueProductIds.add(IDProducto);
          this.CarritoService.setArrayCompra(this.arrayCompra);
          this.cartItemCount = this.uniqueProductIds.size;

          this.mostrarTabla = true;
          console.log('Contenido de arrayCompra:', this.arrayCompra);
        } else {
          // Manejar el caso en que no hay stock disponible
          console.log('No hay stock disponible para este producto.');
          // Establece un mensaje de error si lo deseas
          this.productoAgregadoMensaje = `Producto "${nombreProducto}" no está disponible.`;
        }
      });
  }

  navegarACompraFinal() {
    const arrayCompraData = JSON.stringify(this.arrayCompra);

    // Restablece la variable stockActualizado a false antes de navegar
    this.stockActualizado = false;

    this.router.navigate(['../../compra/final'], {
      queryParams: { arrayCompra: arrayCompraData },
    });
  }

  calculateUniqueProductCount(): number {
    const uniqueProductIds = new Set<number>();

    this.arrayCompra.forEach((compra) => {
      uniqueProductIds.add(compra.productoId);
    });

    return uniqueProductIds.size;
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    for (const compra of this.arrayCompra) {
      totalPrice += compra.cantidad * compra.precioCompra;
    }

    return totalPrice;
  }


  showProductDetails(product: any): void {
    this.selectedProduct = product;

  }

  closeProductDetails(): void {
    this.selectedProduct = null;
  }



  isAdmin(): boolean {
    // Verificar si user no es nulo y tiene la propiedad role
    return this.GeneralService.usuario$.role === 'ADMIN';
  }

  isSuperAdmin(): boolean {
    // Verificar si user no es nulo y tiene la propiedad role
    return this.GeneralService.usuario$.role  === 'SUPERADMIN';
  }

// Modifica el método actualizarStock para que reciba un objeto ProductoResponse
actualizarStock(producto: ProductoResponse, nuevoStock: number): void {
  this.selectedProductForEdit = producto;
  this.newStockValue = nuevoStock;
}




guardarStock(): void {
  if (this.selectedProductForEdit && this.newStockValue !== undefined) {
    this.selectedProductForEdit.stock = this.newStockValue;

    // Llama a la función de ProductoService para actualizar el producto
    this.productoService
      .actualizarProducto(this.selectedProductForEdit.id, this.selectedProductForEdit)
      .subscribe(
        (productoActualizado) => {
          // La actualización fue exitosa
          console.log('Producto actualizado:', productoActualizado);
          this.stockActualizado = true;

          // Cierra el formulario de edición
          this.cancelarEdicionStock();
        },
        (error) => {
          console.error('Error al actualizar el producto:', error);
          // Puedes manejar el error aquí si lo deseas
        }
      );
  }
}



startEditingStock(producto: ProductoResponse): void {
  this.editingStock = true;
  this.selectedProductId = producto.id;
  this.selectedProductForEdit = producto;
  this.newStockValue = producto.stock; // Puedes establecer el valor actual del stock aquí
}


  cancelarEdicionStock(): void {
    this.selectedProductForEdit = null;
  }

  cerrarFormulario() {
    this.editingStock = false;
    this.selectedProductId = null;
  }

  // Función para filtrar productos por nombre
  filterProductos(productos: ProductoResponse[], term: string): ProductoResponse[] {
    term = term.toLowerCase();
    return productos.filter((producto) => {
      const nombreEnMinusculas = producto.nombre.toLowerCase();
      return nombreEnMinusculas.includes(term);
    });
  }


  // Actualiza la lista de productos filtrados
  updateFilteredProductos(): void {
    this.filteredProductos$ = this.productos$.pipe(
      map((productos) => {
        if (!productos) {
          return null;
        }
        return this.filterProductos(productos, this.searchTerm);
      })
    );
  }

    // Actualiza la lista de productos filtrados cuando se modifica el término de búsqueda

  onSearchTermChange(): void {
    this.updateFilteredProductos();
  }

}
