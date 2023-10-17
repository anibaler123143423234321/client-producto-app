// Importa las dependencias necesarias

import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { UserResponse } from '../../user.models';
import * as fromActions from '@app/store/user/user.actions';
import * as fromSelectors from '@app/store/user/user.selectors';
import { CompraResponse } from '@app/pages/compra/store/save';
import * as fromList from '@app/pages/compra/store/save';
import * as fromRoot from '@app/store';
import * as fromActionsL from '@app/pages/compra/store/save/save.actions'; // Importa la acción Create
import { CompraService } from '@app/services/CompraService';
import { GeneralService } from '@app/services/general.service';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users$: Observable<UserResponse[] | null>;
  loading$: Observable<boolean | null>;
  searchTerm: string = '';
  filteredUsers: UserResponse[] = [];

  compras$!: Observable<CompraResponse[] | null>;
  // Crear un diccionario para asociar compras con usuarios
  userComprasMap: { [userId: number]: CompraResponse[] } = {}; // Mapa de compras por usuario
  estadoEditadoExitoso: boolean = false;
  mensajeExito = '';

  idNegocioUser: string | undefined;

  displayedColumns: string[] = [
    'negocioId',
    'nombre',
    'apellido',
    'telefono',
    'email',
    'role',
    'compras',
  ];

  constructor(private store: Store<fromRoot.State>,
    public CompraService: CompraService,
    public GeneralService: GeneralService) {
    this.users$ = this.store.select(fromSelectors.getUsers);
    this.loading$ = this.store.select(fromSelectors.getLoading);
  }

  ngOnInit() {
    this.store.dispatch(new fromActions.ListUsers());
    this.idNegocioUser = this.GeneralService.usuario$?.negocioId;

    // Llama a cargarDatosDeCompras inicialmente
    this.CompraService.cargarDatosDeCompras().subscribe((compras) => {
      console.log('Datos de compras cargados:', compras);
      console.log('idNegocioUser:', this.idNegocioUser);

      this.compras$ = of(compras);

      this.users$.subscribe((users) => {
        if (users) {
          this.filteredUsers = users.filter((user) => user.negocioId === this.idNegocioUser);
          this.userComprasMap = this.filterComprasByUser(this.filteredUsers);
        }
      });
    });

    // Llama a cargarDatosDeCompras cada 10 segundos
    interval(10000) // Intervalo de 10 segundos
      .pipe(
        switchMap(() => this.CompraService.cargarDatosDeCompras())
      )
      .subscribe((compras) => {
        console.log('Datos de compras actualizados automáticamente:', compras);
        this.compras$ = of(compras);
        this.userComprasMap = this.filterComprasByUser(this.filteredUsers);
      });
  }



  // Función de filtro de usuarios
  filterUsers(users: UserResponse[], term: string): UserResponse[] {
    term = term.toLowerCase();
    return users.filter((user) => {
      // Verificar si 'role' existe antes de intentar acceder a él
      if (user.role) {
        return (
          user.nombre.toLowerCase().includes(term) ||
          user.apellido.toLowerCase().includes(term) ||
          user.telefono.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
        );
      }
      // Si 'role' es undefined, no incluir este usuario en los resultados
      return false;
    });
  }

  // Función para actualizar la lista de usuarios filtrados
  updateFilteredUsers() {
    if (this.users$) {
      // Desencadenar el observable y luego aplicar el filtro
      this.users$.subscribe((users) => {
        if (users) {
          this.filteredUsers = this.filterUsers(users, this.searchTerm);
        }
      });
    }
  }

  // Función para filtrar y asociar compras a usuarios
  filterComprasByUser(users: UserResponse[]): {
    [userId: number]: CompraResponse[];
  } {
    const filteredMap: { [userId: number]: CompraResponse[] } = {};

    // Obtén las compras del estado global una vez
    this.compras$.subscribe((comprasData) => {
      if (comprasData) {
        users.forEach((user) => {
          if (user.id) {
            const compras = this.filterComprasByUserId(comprasData, user.id);
            if (compras.length > 0) {
              filteredMap[user.id] = compras;
            }
          }
        });
      }
    });

    return filteredMap;
  }

  // Función para filtrar compras por el ID de usuario
  filterComprasByUserId(
    comprasData: CompraResponse[],
    userId: number
  ): CompraResponse[] {
    return comprasData.filter((compra) => {
      return (
        compra.userId === userId &&
        (compra.estadoCompra === 'Pendiente Por Revisar' ||
          compra.estadoCompra === 'Despachado')
      );
    });
  }

  cambiarEstado(compra: CompraResponse): void {
    const estadosPosibles: string[] = [
      'Pendiente Por Revisar',
      'Despachado',
      'Pago Completado',
    ];

    const estadoActual = compra.estadoCompra;
    const indiceActual = estadosPosibles.indexOf(estadoActual);

    if (indiceActual !== -1) {
      // Encuentra el siguiente estado en la lista o vuelve al primero si es el último
      const nuevoIndice = (indiceActual + 1) % estadosPosibles.length;
      const nuevoEstado = estadosPosibles[nuevoIndice];

      const compraId = compra.id;

      this.CompraService.actualizarEstadoCompra(compraId, nuevoEstado).subscribe(
        (updatedCompra: CompraResponse) => {
          console.log('Nuevo Estado:', nuevoEstado);
          console.log('Compra ID:', compraId);

          this.estadoEditadoExitoso = true;
          this.mensajeExito = 'Estado Cambiado con Éxito';

          // Actualiza el estado en la compra actual
          compra.estadoCompra = nuevoEstado;

          setTimeout(() => {
            this.estadoEditadoExitoso = false;
            this.mensajeExito = '';
          }, 5000);
        },
        (error) => {
          console.error('Error al actualizar el estado de compra:', error);
          // Manejar el error aquí, por ejemplo, mostrar un mensaje de error al usuario
        }
      );
    } else {
      console.log('Operación de actualización cancelada o estado no válido.');
    }
  }

}
