import { Component, OnInit } from '@angular/core';
import { CompraCreateRequest } from '../../store/save';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute para obtener datos de la ruta
import { CarritoService } from '@app/services/CarritoService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra-final',
  templateUrl: './compra-final.component.html',
  styleUrls: ['./compra-final.component.scss'],
})
export class CompraFinalComponent implements OnInit {
  arrayCompra: CompraCreateRequest[] = [];
  mostrarTabla = true; // Agrega esta variable de bandera

  constructor(private route: ActivatedRoute, private router: Router, public CarritoService: CarritoService) {}


  ngOnInit() {
  // Utiliza el servicio de carrito para obtener el arrayCompra
  this.arrayCompra = this.CarritoService.getArrayCompra();
  console.log('Datos de arrayCompra:', this.arrayCompra);

    this.route.queryParams.subscribe((params) => {
      if (params['arrayCompra']) {
       // Haz algo como esto
       const productosSeleccionados = JSON.parse(params['arrayCompra']);
       this.arrayCompra = productosSeleccionados;
        // Actualiza el servicio de carrito con los datos recién cargados.
        this.CarritoService.setArrayCompra(this.arrayCompra);
      }
    });
  }

// En compra-final.component.ts
eliminarProducto(compra: CompraCreateRequest) {
  // Encuentra el índice del producto en el arrayCompra
  const index = this.arrayCompra.indexOf(compra);
  if (index !== -1) {
    // Elimina el producto del arrayCompra
    this.arrayCompra.splice(index, 1);
    // Actualiza localStorage después de eliminar
    localStorage.setItem('arrayCompra', JSON.stringify(this.arrayCompra));
  }
}

regresarAListado() {
    // Redirige a la página de listado de productos
    this.router.navigate(['../producto/list']); // Ajusta la ruta según tu configuración de enrutamiento
  }

  limpiarPantalla() {
    // Limpia la pantalla estableciendo arrayCompra como un array vacío
    this.arrayCompra = [];
    // Establece la bandera mostrarTabla en false para ocultar la tabla
    this.mostrarTabla = false;
  }
}




