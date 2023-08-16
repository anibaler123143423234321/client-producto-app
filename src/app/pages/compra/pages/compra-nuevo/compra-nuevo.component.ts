import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Compra } from '@app/models/backend/compra'; // Asegúrate de importar el modelo correcto
import * as fromList from '@app/pages/producto/store/save';

import * as fromProductoEffects from '@app/pages/producto/store/save'; // Importa el módulo de efectos de producto
import * as fromUserEffects from '@app/store/user';

@Component({
  selector: 'app-compra-nuevo',
  templateUrl: './compra-nuevo.component.html',
  styleUrls: ['./compra-nuevo.component.scss']
})
export class CompraNuevoComponent implements OnInit {
  @Input() userId!: string; // Agrega el userId como entrada

  titulo: string = '';
  cantidad: number = 0;
  nombreProducto: string = '';
  nombreUsuario: string = '';
  productoId: number = 0;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.nombreProducto = params['nombreProducto'];
      this.productoId = +params['productoId'];
      this.nombreUsuario = params['nombreUsuario'];
      // Aquí deberías obtener el ID del usuario de alguna manera
      this.userId = params['userId']; // Esto asume que el userId se pasa como query parameter
    });
  }

  realizarCompra() {
    const compra: Compra = {
      titulo: this.titulo,
      cantidad: this.cantidad,
      productoId: this.productoId,
      userId: this.userId,
      precio: 0, // Establece el precio adecuadamente
      fechaCompra: new Date()
    };



    this.router.navigate(['/nuevaCompra']);
  }
}
