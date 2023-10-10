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
import { environment } from 'environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CompraService } from '@app/services/CompraService';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

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

  currentPage = 1;
  itemsPerPage = 15;
  boletaUrl!: SafeUrl;

  constructor(
    private store: Store<fromRoot.State>,
    public generalService: GeneralService,
    private dialog: MatDialog,
    private router: Router,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
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
  }

  editarEstado(compra: CompraResponse): void {
    if (!this.isAdmin()) {
      return;
    }

    const estadosPosibles: string[] = [
      'Pendiente Por Revisar',
      'Despachado',
      'Pago Completado',
    ];

    const nuevoEstado = prompt(
      'Ingrese el nuevo estado:\n' + estadosPosibles.join(', ')
    );

    if (nuevoEstado && estadosPosibles.includes(nuevoEstado)) {
      const compraId = compra.id;

      this.store.dispatch(new fromActions.UpdateEstado(compraId, nuevoEstado));

      this.estadoEditadoExitoso = true;
      this.mensajeExito = 'Estado Cambiado con Éxito';

      setTimeout(() => {
        this.estadoEditadoExitoso = false;
        this.mensajeExito = '';
      }, 8000);
    } else {
      console.log('Operación de actualización cancelada o estado no válido.');
    }
  }

  isAdmin(): boolean {
    return this.generalService.usuario$?.role === 'ADMIN';
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

    // Configurar el tamaño del papel a 80 mm x 80 mm (ancho x alto) para una ticketera de 80 mm
    const page = {
      width: 80, // 80 mm de ancho
      height: 210, // 210 mm de alto (tamaño de una ticketera típica)
    };

    // Definir los estilos del documento
    const styles = {
      header: {
        fontSize: 14, // Tamaño de fuente ajustado
        bold: true,
        margin: [0, 5, 0, 10], // Márgenes ajustados
      },
      info: {
        fontSize: 10,
        margin: [0, 5, 0, 5],
      },
    };

    // Recorrer cada grupo de compras y generar un PDF separado para cada uno
    compraGroups.forEach((compras, index) => {
      // Obtener información del usuario y la fecha de la primera compra en el grupo
      const usuario = `${this.nombreUsuario} ${this.apellidoUsuario}`;
      const primeraCompra = compras[0];
      const fechaCompra = new Date(
        primeraCompra.fechaCompra
      ).toLocaleDateString();

      // Obtener IDs de compra y IDs de producto
      const idsCompra = compras.map((compra) => compra.id.toString()).join(', ');
      const idsProducto = compras
        .map((compra) => compra.productoId.toString())
        .join(', ');
      const nombresProductos = compras
        .map((compra) => `${compra.titulo} (${compra.cantidad} cant) $${compra.precioCompra.toFixed(2)}`)
        .join(', ');

      // Obtener el precio total de los productos en este grupo
      const precioTotal = this.getTotalPrecio(compras);

      // Crear el documento PDF con el tamaño de página personalizado y los estilos
      const docDefinition = {
        page: page,
        content: [
          { text: 'Boleta de Compra', style: 'header' },
          { text: 'Información de las Compras:', style: 'info' },
          { text: `Nombre del Usuario: ${usuario}`, style: 'info' },
          { text: `Fecha de Compra: ${fechaCompra}`, style: 'info' },
          { text: `Codigos de las Compra: ${idsCompra}`, style: 'info' },
          { text: `Codigos de los Productos: ${idsProducto}`, style: 'info' },
          { text: `Nombre del Producto: ${nombresProductos}`, style: 'info' },
          { text: `Precio Total de los Productos a pagar: $${precioTotal}`, style: 'info' },
          // Agregar un espacio en blanco para separar las compras
          { text: '', margin: [0, 10, 0, 0] },
        ],
        styles: styles, // Estilos del PDF
      };

      // Usar pdfMake con la configuración personalizada
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      const nombreUsuario = this.nombreUsuario || 'Usuario Desconocido'; // Obtén el nombre del usuario o usa un valor predeterminado
      const nombreArchivo = `boleta_${nombreUsuario}_${index}.pdf`; // Nombre del archivo con el nombre del usuario

      pdfMake.createPdf(docDefinition).download(nombreArchivo);
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



}
