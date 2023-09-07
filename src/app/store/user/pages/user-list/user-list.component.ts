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

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
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
  constructor(private store: Store<fromRoot.State>,
    private CompraService: CompraService) {
    this.users$ = this.store.select(fromSelectors.getUsers);
    this.loading$ = this.store.select(fromSelectors.getLoading);
  }

  ngOnInit() {
    this.store.dispatch(new fromActions.ListUsers());

    // Utiliza CompraService para cargar los datos de compras
    this.CompraService.cargarDatosDeCompras().subscribe((compras) => {
      console.log('Datos de compras cargados:', compras); // Agrega el console.log para verificar los datos

      this.compras$ = of(compras); // Asigna los datos de compras a compras$

      // Suscribirse a cambios en la lista de usuarios y aplicar filtros
      this.users$.subscribe((users) => {
        if (users) {
          this.userComprasMap = this.filterComprasByUser(users);
          this.filteredUsers = this.filterUsers(users, this.searchTerm);
        }
      });
    });
  }


  // Función de filtro de usuarios
  filterUsers(users: UserResponse[], term: string): UserResponse[] {
    term = term.toLowerCase();
    return users.filter((user) => {
      // Verificar si 'role' existe antes de intentar acceder a él
      if (user.role) {
        return (
          user.id.toString().includes(term) ||
          user.username.toLowerCase().includes(term) ||
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

  editarEstado(user: UserResponse, compra: CompraResponse): void {
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

      // Aquí debes implementar la lógica para actualizar el estado de la compra
      // Puedes usar una función o un servicio para hacer esto

      // Despacha la acción para actualizar el estado de la compra
      this.store.dispatch(new fromActionsL.UpdateEstado(compraId, nuevoEstado));

      // Establece las variables para mostrar el mensaje de éxito
      this.estadoEditadoExitoso = true;
      this.mensajeExito = 'Estado Cambiado con Éxito';

      // Configura un temporizador para ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        this.estadoEditadoExitoso = false;
        this.mensajeExito = '';
      }, 5000); // 5000 milisegundos = 5 segundos
    } else {
      console.log('Operación de actualización cancelada o estado no válido.');
    }
  }

}
