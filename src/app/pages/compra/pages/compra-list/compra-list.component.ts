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
import * as fromActions from '../../store/save'; // Importa la acción Create
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-compra-list',
  templateUrl: './compra-list.component.html',
  styleUrls: ['./compra-list.component.scss'],
})
export class CompraListComponent implements OnInit {
  compras$!: Observable<CompraResponse[] | null>;
  loading$!: Observable<boolean | null>;
  comprasLength: number | undefined;
  @Input() user: User | null = null;
  estadoEditadoExitoso: boolean = false;
  mensajeExito = '';
  idUser: number | undefined;
  nombreUsuario: string | undefined; // Agrega la variable nombreUsuario aquí
  apellidoUsuario: string | undefined; // Agrega la variable nombreUsuario aquí

  currentPage = 1;
  itemsPerPage = 15; // Cambiar a 15 compras por página

  constructor(
    private store: Store<fromRoot.State>,
    public GeneralService: GeneralService,
    private dialog: MatDialog,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  // En el ngOnInit() de CompraListComponent
  ngOnInit(): void {
    this.store.dispatch(new fromList.Read());
    this.loading$ = this.store.pipe(select(fromList.getLoading));
    this.compras$ = this.store.pipe(select(fromList.getCompras));

    // Puedes agregar logs para verificar la carga de datos
    this.compras$.subscribe((compras) => {
      this.comprasLength = compras?.length || 0; // Asegúrate de manejar el caso de "compras" siendo null
    });

    this.nombreUsuario = this.GeneralService.usuario$?.nombre;
    this.idUser = this.GeneralService.usuario$?.id
    this.apellidoUsuario = this.GeneralService.usuario$?.apellido;
    console.log('ID Usuario:', this.idUser);
    console.log('Nombre Usuario:', this.nombreUsuario);
    console.log('Apellido Usuario:', this.apellidoUsuario);
  }

  get paginatedCompras$(): Observable<CompraResponse[] | null> {
    return this.compras$.pipe(
      map((compras) => {
        // console.log("Compras:",compras)
        if (!compras) {
          return null;
        }
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return compras.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
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

      // Despacha la acción para actualizar el estado de la compra
      this.store.dispatch(new fromActions.UpdateEstado(compraId, nuevoEstado));

      // Establece las variables para mostrar el mensaje de éxito
      this.estadoEditadoExitoso = true;
      this.mensajeExito = 'Estado Cambiado con Éxito';

      // Configura un temporizador para ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        this.estadoEditadoExitoso = false;
        this.mensajeExito = '';
      }, 8000); // 5000 milisegundos = 5 segundos
    } else {
      console.log('Operación de actualización cancelada o estado no válido.');
    }
  }

  isAdmin(): boolean {
    // Verificar si user no es nulo y tiene la propiedad role
    return this.GeneralService.usuario$?.role === 'ADMIN';
  }

  navigateToProductoNuevo(): void {
    this.router.navigate(['../../producto/list']);
  }

  changePage(step: number): void {
    this.currentPage += step;
  }
}
