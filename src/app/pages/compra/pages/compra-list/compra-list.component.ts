import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import * as fromList from '../../store/save';
import { CompraResponse } from '../../store/save';
import * as fromRoot from '@app/store';
import { GeneralService } from '@app/services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@app/models/backend/user/index';
import { Router } from '@angular/router';
import * as fromActions from '../../store/save';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CompraService } from '@app/services/CompraService';
import { NegocioService } from '@app/services/NegocioService';
import * as fromUser from '@app/store/user';

@Component({
  selector: 'app-compra-list',
  templateUrl: './compra-list.component.html',
  styleUrls: ['./compra-list.component.scss'],
})
export class CompraListComponent implements OnInit {
  compras$: Observable<CompraResponse[] | null>;
  loading$!: Observable<boolean | null>;
  comprasLength: number;

  compraGroups: { [key: string]: CompraResponse[] } = {};
  paginatedCompras$: Observable<CompraResponse[] | null>;

  @Input() user!: User | null;
  estadoEditadoExitoso: boolean = false;
  mensajeExito = '';
  idUser: number | undefined;
  nombreUsuario: string;
  apellidoUsuario: string;
  idNegocioUser: string | undefined;


  currentPage = 1;
  itemsPerPage = 15;
  boletaUrl!: SafeUrl;
  negocioPicture: string = ''; // Declaramos la variable negocioPicture aquí
  user$!: Observable<fromUser.UserResponse>;
  isAuthorized$!: Observable<boolean>;

  constructor(
    private store: Store<fromRoot.State>,
    public generalService: GeneralService,
    private router: Router,
    public negocioService: NegocioService,
    public compraService: CompraService
  ) {
    this.comprasLength = 0;
    this.nombreUsuario = '';
    this.apellidoUsuario = '';
    this.compras$ = this.store.pipe(select(fromList.getCompras));
    this.paginatedCompras$ = this.compras$.pipe(
      map((compras) => {
        if (!compras) {
          return null;
        }
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return compras.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(fromUser.getUser)) as Observable<fromUser.UserResponse>;
    this.isAuthorized$ = this.store.pipe(select(fromUser.getIsAuthorized)) as Observable<boolean>;

    this.store.dispatch(new fromList.Read());
    this.loading$ = this.store.pipe(select(fromList.getLoading));

    this.compras$.subscribe((compras) => {
      if (compras) {
        this.comprasLength = compras.length;
        this.compraGroups = this.groupComprasByFecha(compras);
      }
    });


    this.nombreUsuario = this.generalService.usuario$?.nombre || '';
    this.apellidoUsuario = this.generalService.usuario$?.apellido || '';
    this.idUser = this.generalService.usuario$?.id;
    this.idNegocioUser = this.generalService.usuario$?.negocioId || '';

  // Obtener la información de negocio.picture
  if (this.idNegocioUser) {
    this.negocioService.getNegocioById(Number(this.idNegocioUser)).subscribe((negocio) => {
      if (negocio && negocio.picture) {
        this.negocioPicture = negocio.picture;
      }
    });
  }

  }

  navigateToProductoNuevo(): void {
    this.router.navigate(['../../producto/list']);
  }

  changePage(step: number): void {
    this.currentPage += step;
  }

  generarPDF(compraGroups: CompraResponse[][]): void {
    const pdfMake: any = require('pdfmake/build/pdfmake');
    const pdfFonts: any = require('pdfmake/build/vfs_fonts');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    compraGroups.forEach((compras, index) => {
      compras.forEach((compra) => {
        if (compra.fechaCompra) {
          compra.fechaCompra = this.calcularFechaDiferencia(compra.fechaCompra).toLocaleString();
        } else {
          compra.fechaCompra = "Fecha no proporcionada"; // Otra acción en caso de fecha no proporcionada
        }
      });

      const usuario = `${this.nombreUsuario} ${this.apellidoUsuario}`;
      const primeraCompra = compras[0];
      const fechaCompra = compras.map((compra) => compra.fechaCompra);
      const idsCompra = compras.map((compra) => compra.codigo?.toString()).join(', ');
      const idsProducto = compras.map((compra) => compra.productoId.toString()).join(', ');
      const nombresProductos = compras.map((compra) =>
        `${compra.titulo} (${compra.cantidad} cant) $${compra.precioCompra.toFixed(2)}`
      ).join(', ');
      const precioTotal = this.getTotalPrecio(compras);

      const docDefinition = {
        content: [
          { text: 'Boleta de Compra', style: 'header' },
          { text: 'Información de las Compras:', style: 'info' },
          { text: `Nombre del Usuario: ${usuario}`, style: 'info' },
          { text: `Fecha de Compra: ${fechaCompra}`, style: 'info' },
          { text: `Codigos de las Compra: ${idsCompra}`, style: 'info' },
          { text: `Codigos de los Productos: ${idsProducto}`, style: 'info' },
          { text: `Nombre del Producto: ${nombresProductos}`, style: 'info' },
          { text: `Precio Total de los Productos a pagar: $${precioTotal}`, style: 'info' },
          { text: '', margin: [0, 10, 0, 0] },
        ],
        styles: {
          header: {
            fontSize: 12,
            bold: true,
            margin: [0, 5, 0, 5],
          },
          info: {
            fontSize: 10,
            margin: [0, 5, 0, 5],
          },
        },
      };

      pdfMake.createPdf(docDefinition).download(`boleta_${usuario}_${index}.pdf`);
    });
  }



// Actualiza esta función para agrupar solo por minuto
groupComprasByFecha(compras: CompraResponse[]): { [key: string]: CompraResponse[] } {
  const groupedCompras: { [key: string]: CompraResponse[] } = {};

  compras.forEach((compra) => {
    const fechaCompraKey = new Date(compra.fechaCompra).toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }); // Usar la fecha con hora y minutos
    if (!groupedCompras[fechaCompraKey]) {
      groupedCompras[fechaCompraKey] = [];
    }
    groupedCompras[fechaCompraKey].push(compra);
  });

  return groupedCompras;
}



getTotalPrecio(compras: CompraResponse[]): string {
  const total = compras.reduce((sum, compra) => sum + compra.precioCompra, 0);
  return total.toFixed(2);
}


objectKeys(obj: any): string[] {
  return Object.keys(obj);
}

getTotalCantidad(compras: CompraResponse[]): number {
  const totalCantidad = compras.reduce((sum, compra) => sum + compra.cantidad, 0);
  return totalCantidad;
}


calcularFechaDiferencia(fechaCompraStr: string): Date {
  const fechaCompra = new Date(fechaCompraStr);
  if (isNaN(fechaCompra.getTime())) {
    // Si la fecha no es válida, puedes manejarla como desees, por ejemplo, retornar una fecha predeterminada o mostrar un mensaje de error.
    return new Date(); // Retorna una fecha predeterminada
  }
  fechaCompra.setHours(fechaCompra.getHours() - 5); // Restar 5 horas
  return fechaCompra;
}

}
