import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '@app/services/general.service';
import * as fromActions from '../../store/save'; // Importa la acción Create
import { CarritoService } from '@app/services/CarritoService';
import { ProductoService } from '@app/services/ProductoService'; // Importa el servicio de productos
import { CompraCreateRequest } from '../../store/save'; // Asegúrate de importar correctamente el modelo CompraCreateRequest

@Component({
  selector: 'app-compra-nuevo',
  templateUrl: './compra-nuevo.component.html',
  styleUrls: ['./compra-nuevo.component.scss'],
})
export class CompraNuevoComponent implements OnInit {
  userId: number = 0;
  nombreProducto: string = '';
  tipoEnvio: string = '';
  tipoDePago: string = '';
  nombreUsuario: string | undefined;
  apellidoUsuario: string | undefined;
  productoId: number = 0;
  precio: number = 0;
  compraRealizada: boolean = false;
  cantidad: number = 0; // Agrega la propiedad cantidad
  stockDisponible: number = 0; // Agrega el stock disponible

  constructor(
    private store: Store,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public GeneralService: GeneralService,
    public CarritoService: CarritoService,
    private productoService: ProductoService // Inyecta el servicio de productos
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productoId = +params['productoId'];
      const userId = +params['userId'];
      const nombreProducto = params['nombreProducto'];
      const nombreUsuario = params['nombreUsuario'];
      const apellidoUsuario = params['apellidoUsuario'];
      const precioProducto = +params['precioProducto'];
      const estadoCompra = params['estadoCompra'];

      if (isNaN(productoId) || isNaN(precioProducto)) {
        console.log('Valores no válidos en la URL');
        return;
      }

      this.productoId = productoId;
      this.userId = userId;
      this.nombreProducto = nombreProducto;
      this.nombreUsuario = this.GeneralService.usuario$?.nombre;
      this.apellidoUsuario = this.GeneralService.usuario$?.apellido;
      this.precio = precioProducto;

      // Obtén el stock disponible del producto
      this.productoService.obtenerProducto(productoId).subscribe(
        (producto) => {
          this.stockDisponible = producto.stock;
        },
        (error) => {
          console.error('Error al obtener el stock del producto:', error);
        }
      );
    });
  }

  realizarCompra() {
    const estadoCompra = 'Pendiente Por Revisar';

    // Verifica si algún campo obligatorio está vacío
  if (!this.nombreProducto || !this.tipoEnvio || !this.tipoDePago || this.cantidad <= 0) {
    console.log('Todos los campos deben llenarse correctamente para realizar la compra');
    return; // Evita realizar la compra si algún campo está incompleto
  }

    if (this.cantidad <= 0) {
      console.log('La cantidad debe ser mayor que cero para realizar la compra');
      return; // Evita realizar la compra si la cantidad no es válida
    }

    if (this.cantidad > this.stockDisponible) {
      console.log('La cantidad supera el stock disponible');
      return; // Evita realizar la compra si la cantidad supera el stock disponible
    }

    // Crea un objeto CompraCreateRequest
    const compra: CompraCreateRequest = {
      titulo: this.nombreProducto,
      cantidad: this.cantidad,
      productoId: this.productoId,
      userId: this.userId,
      precioCompra: this.precio,
      estadoCompra: estadoCompra,
      tipoEnvio: this.tipoEnvio,
      tipoDePago: this.tipoDePago
    };

    // Llama al servicio para guardar la compra en el backend
    this.store.dispatch(new fromActions.Create(compra));

    // Actualiza el stock del producto restando la cantidad comprada
    const nuevoProducto = {
      id: this.productoId,
      nombre: this.nombreProducto,
      picture: '', // Debes proporcionar la URL de la imagen del producto
      precio: 0, // Debes proporcionar el precio del producto
      stock: this.stockDisponible - this.cantidad, // Calcula el nuevo stock
    };

    this.productoService.actualizarProducto(this.productoId, nuevoProducto).subscribe(
      () => {
        console.log('Actualización del stock del producto exitosa');
      },
      (error) => {
        console.error('Error al actualizar el stock del producto:', error);
      }
    );

    // Marca la compra como realizada y muestra el mensaje
    this.compraRealizada = true;

    // Limpia los campos después de realizar la compra
    this.cantidad = 0;
  }
}
