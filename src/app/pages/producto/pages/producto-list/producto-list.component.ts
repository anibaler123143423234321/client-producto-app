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

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss'],
})
export class ProductoListComponent implements OnInit {
  productos$!: Observable<ProductoResponse[] | null>;
  userId!: number;
  productoId: number | undefined;
  nombreUsuario: string | undefined; // Agrega la variable nombreUsuario aquí
  apellidoUsuario: string | undefined; // Agrega la variable nombreUsuario aquí

  uniqueProductIds: Set<number> = new Set<number>();
  productoAgregadoMensaje = ''; // Mensaje para mostrar cuando se agrega un producto
  mostrarTabla = false; // Inicialmente, oculta la tabla

  arrayCompra: CompraCreateRequest[] = [];

  loading$!: Observable<boolean | null>;
  currentPage = 1;
  itemsPerPage = 10;
  pictureDefault: string =
    'https://firebasestorage.googleapis.com/v0/b/edificacion-app.appspot.com/o/image%2F1637099019171_O5986058_0.jpg?alt=media&token=0a146233-d63b-4702-b28d-6eaddf5e207a';
  // Agrega una variable para almacenar la categoría seleccionada
  selectedCategoria: string | null = null;
  productosLength: number | undefined;
  cartItemCount = 0; // Inicialmente, no hay elementos en el carrito
  usuario$!: UserResponse | null;

  idNegocio: number | undefined;
  idNegocioProducto: string | undefined;
  nombreNegocioProducto: string | undefined; // Variable para almacenar el nombre del negocio
  negocios: { id: number; nombre: string }[] = []; // Arreglo con el ID y el nombre de los negocios
  idNegocioUser: string | undefined;


  constructor(
    private store: Store<fromRoot.State>,
    public GeneralService: GeneralService,
    private router: Router,
    public CarritoService: CarritoService,
    public NegocioService: NegocioService
  ) {}

  ngOnInit(): void {

    this.store.dispatch(new fromList.Read());
    this.loading$ = this.store.pipe(select(fromList.getLoading));
    this.idNegocioUser = this.GeneralService.usuario$?.negocioId;

    this.productos$ = this.store.pipe(select(fromList.getProductos));
    this.productos$.subscribe((productos) => {
      if (productos && productos.length > 0) {
        // Aquí puedes implementar tu lógica para seleccionar el valor deseado de idNegocioProducto
        // Por ejemplo, si deseas el valor del producto actualmente seleccionado por alguna razón específica:
        // this.idNegocioProducto = productos[this.productoId - 1].negocioId;

        // Si deseas el valor del producto que pertenece al negocio actual del usuario:
        this.idNegocioProducto = productos.find(producto => producto.negocioId === this.idNegocioUser)?.negocioId;

        console.log('idNegocioProducto:', this.idNegocioProducto);
      }
    });


    // Obtén los datos del carrito desde el servicio al cargar la página
    this.arrayCompra = this.CarritoService.getArrayCompra();

  // Calcula la cantidad total de productos únicos
  this.cartItemCount = this.calculateUniqueProductCount();


    this.userId = this.GeneralService.usuario$?.id;
    this.productoId = this.GeneralService.usuario$?.id;
    this.nombreUsuario = this.GeneralService.usuario$?.nombre;
    this.apellidoUsuario = this.GeneralService.usuario$?.apellido;

    console.log('ID Negocio User:', this.idNegocioUser);
    console.log('Usuario Product List:', this.GeneralService.usuario$);
    console.log('Nombre Usuario:', this.nombreUsuario);
    console.log('Apellido Usuario:', this.apellidoUsuario);


  }

  // Agrega una función para filtrar por categoría
  filterByCategory(direccion: string | null): void {
    this.selectedCategoria = direccion;
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
            // Filtra los productos que coinciden con el idNegocioUser
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
      cantidad: 1, // Inicializa la cantidad en 1
      productoId: IDProducto,
      userId: this.userId,
      precioCompra: precioProducto,
      estadoCompra: estadoCompra, // Establece el estado de compra

    };

    // Busca si el producto ya está en el carrito
    const existingCompra = this.arrayCompra.find(
      (c) => c.productoId === IDProducto
    );

    if (existingCompra) {
      // Si el producto existe en el carrito, aumenta la cantidad
      existingCompra.cantidad += 1;
    } else {
      // Si el producto no existe en el carrito, agrégalo
      const compra: CompraCreateRequest = {
        titulo: nombreProducto,
        cantidad: 1, // Inicializa la cantidad en 1
        productoId: IDProducto,
        userId: this.userId,
        precioCompra: precioProducto,
        estadoCompra : estadoCompra
      };

      this.arrayCompra.push(compra);
      // Agrega el ID del producto al conjunto de productos únicos
      this.uniqueProductIds.add(IDProducto);
      // Utiliza el servicio de carrito para almacenar arrayCompra
      this.CarritoService.setArrayCompra(this.arrayCompra);
      // Actualiza el contador de productos en el carrito con la cantidad de productos únicos
      this.cartItemCount = this.uniqueProductIds.size;
    }

    // Actualiza el servicio de carrito con la lista actualizada
    this.CarritoService.setArrayCompra(this.arrayCompra);

    // Actualiza el contador de productos en el carrito con la cantidad de productos únicos
    this.cartItemCount = this.uniqueProductIds.size;

      // Establece mostrarTabla en true para mostrar la tabla
  this.mostrarTabla = true;
    // Muestra el contenido actualizado de arrayCompra
    console.log('Contenido de arrayCompra:', this.arrayCompra);
  }

 // Agrega esta función para calcular la cantidad de productos únicos
calculateUniqueProductCount(): number {
  // Crea un conjunto para almacenar los IDs de productos únicos
  const uniqueProductIds = new Set<number>();

  // Itera sobre el arrayCompra para obtener los IDs únicos
  this.arrayCompra.forEach((compra) => {
    uniqueProductIds.add(compra.productoId);
  });

  // Retorna el tamaño del conjunto, que es la cantidad de productos únicos
  return uniqueProductIds.size;
}

  navegarACompraFinal() {
    // Supongamos que arrayCompra contiene los datos que deseas pasar
    const arrayCompraData = JSON.stringify(this.arrayCompra);

    this.router.navigate(['../../compra/final'], {
      queryParams: { arrayCompra: arrayCompraData },
    });
  }
}
