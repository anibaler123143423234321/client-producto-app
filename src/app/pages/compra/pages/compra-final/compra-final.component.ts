import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from '@app/services/CarritoService';
import * as fromActions from '../../store/save';
import { Store, select } from '@ngrx/store';
import { ProductoResponse } from '@app/pages/producto/store/save';
import { ProductoService } from '@app/services/ProductoService';
import { CompraCreateRequest } from '../../store/save';
import { Observable, Subscription } from 'rxjs';
import * as fromList from '@app/pages/producto/store/save';

@Component({
  selector: 'app-compra-final',
  templateUrl: './compra-final.component.html',
  styleUrls: ['./compra-final.component.scss'],
})
export class CompraFinalComponent implements OnInit, OnDestroy {
  arrayCompra: CompraCreateRequest[] = [];
  mostrarTabla = true;
  compraRealizada = false;

  productos$!: Observable<ProductoResponse[] | null>;
  productosSubscription: Subscription | null = null;
  actualizacionesCompletadas = 0; // Contador para rastrear actualizaciones completadas

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public CarritoService: CarritoService,
    private store: Store,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.arrayCompra = this.CarritoService.getArrayCompra();
    // console.log('Contenido de arrayCompra:', this.arrayCompra);

    this.route.queryParams.subscribe((params) => {
      if (params['arrayCompra']) {
        const productosSeleccionados = JSON.parse(params['arrayCompra']);
        this.arrayCompra = productosSeleccionados;
        this.CarritoService.setArrayCompra(this.arrayCompra);
      }
    });

    this.productos$ = this.store.pipe(select(fromList.getProductos));
  }

  ngOnDestroy() {
    // Asegúrate de desuscribirte para evitar fugas de memoria
    if (this.productosSubscription) {
      this.productosSubscription.unsubscribe();
    }
  }

  eliminarProducto(compra: CompraCreateRequest) {
    const index = this.arrayCompra.indexOf(compra);
    if (index !== -1) {
      this.arrayCompra.splice(index, 1);
      localStorage.setItem('arrayCompra', JSON.stringify(this.arrayCompra));
    }
  }

  regresarAListado() {
    this.router.navigate(['../producto/list']);
  }

  limpiarPantalla() {
    this.arrayCompra = [];
    this.mostrarTabla = false;
  }

  realizarCompras() {
    if (!this.productosSubscription) {
      // Suscríbete solo si no estás suscrito aún
      this.productosSubscription = this.productos$.subscribe((productos) => {
        if (productos && productos.length > 0) {
          const productosActualizados = new Set<number>(); // Usar un conjunto para evitar duplicados

          this.arrayCompra.forEach((compra) => {
            const producto = productos.find((p) => p.id === compra.productoId);

            if (producto && !productosActualizados.has(producto.id)) {
              // Solo intenta actualizar productos que existen y no se han actualizado aún
              productosActualizados.add(producto.id);

              this.productoService.actualizarProducto(producto.id, producto).subscribe(
                (productoActualizado) => {
                  // console.log('Producto actualizado:', productoActualizado);
                },
                (error) => {
                  console.error('Error al actualizar el producto:', error);
                }
              );
            }
          });
        }
      });
    } else {
      console.warn('Ya estás suscrito a productos$, evitando suscripción duplicada.');
    }

    // Continúa con el resto del código para realizar la compra
    this.arrayCompra.forEach((compra) => {
      this.store.dispatch(new fromActions.Create(compra));
    });

    this.arrayCompra = [];

    this.compraRealizada = true;

    setTimeout(() => {
      this.compraRealizada = false;
    }, 3000);
  }
}
