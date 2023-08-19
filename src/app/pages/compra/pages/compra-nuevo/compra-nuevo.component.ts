import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '@app/services/general.service';
import * as fromActions from '../../store/save'; // Importa la acción Create

import * as fromProductoEffects from '@app/pages/producto/store/save';
import * as fromUserEffects from '@app/store/user';
import { CompraCreateRequest } from '../../store/save'; // Asegúrate de importar correctamente el modelo CompraCreateRequest

@Component({
  selector: 'app-compra-nuevo',
  templateUrl: './compra-nuevo.component.html',
  styleUrls: ['./compra-nuevo.component.scss'],
})
export class CompraNuevoComponent implements OnInit {
  userId: number = 0;
  titulo: string = '';
  cantidad: number = 0;
  nombreProducto: string = '';
  nombreUsuario: string | undefined; // Agrega la variable nombreUsuario aquí

  apellidoUsuario: string | undefined; // Agrega la variable nombreUsuario aquí
  productoId: number = 0;
  precio: number = 0; // Declare the precio property

  constructor(
    private store: Store,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public GeneralService: GeneralService

  ) {}

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe((params) => {
  //     this.productoId = +params['productoId'];
  //     this.userId = +params['userId'];
  //     this.nombreProducto = params['nombreProducto'];
  //     this.nombreUsuario = this.GeneralService.usuario$?.nombre;
  //     this.apellidoUsuario = this.GeneralService.usuario$?.apellido;
  //     this.precio = +params['precioProducto'];

  //     if (isNaN(this.productoId) || isNaN(this.precio)) {
  //       console.log('Valores no válidos en la URL');
  //       return;
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const productoId = +this.route.snapshot.params['productoId'];
      const userId = +this.route.snapshot.params['userId'];
      const nombreProducto = this.route.snapshot.params['nombreProducto'];
      const nombreUsuario = this.route.snapshot.params['nombreUsuario'];

      const apellidoUsuario = this.route.snapshot.params['apellidoUsuario'];
      const precioProducto = +this.route.snapshot.params['precioProducto'];

      if (isNaN(productoId) || isNaN(precioProducto) ) {
        console.log('Valores no válidos en la URL');
        return;
      }


      this.productoId = +productoId;
      this.userId = +userId;
      this.nombreProducto = nombreProducto;
      this.nombreUsuario = this.GeneralService.usuario$?.nombre;
      this.apellidoUsuario = this.GeneralService.usuario$?.apellido;
      this.precio = precioProducto;


      console.log('IDProducto:', this.route.snapshot.params['productoId']);
      console.log('IDUser:', this.route.snapshot.params['userId']);
      console.log(
        'Nombre Producto:',
        this.route.snapshot.params['nombreProducto']
      );
      console.log('Nombre Usuario:',this.nombreUsuario);
      console.log('Apellido Usuario:',this.apellidoUsuario);
      console.log(
        'Precio Producto:',
        this.route.snapshot.params['precioProducto']
      );



    });
  }

  realizarCompra() {
    console.log('Realizar Compra clickeado');
    const compra: CompraCreateRequest = {
      titulo: this.titulo,
      cantidad: this.cantidad,
      productoId: this.productoId,
      userId: this.userId,
      precio: this.precio, // Use the assigned precio property
    };

    // Llama al servicio para guardar la compra en el backend
    this.store.dispatch(new fromActions.Create(compra));

    // Redirige al usuario a la lista de compras (esto también se hace en el efecto)
    this.router.navigate(['/compra/list']);
  }
}
