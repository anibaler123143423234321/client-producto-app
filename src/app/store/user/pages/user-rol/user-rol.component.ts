import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserResponse } from '../../user.models';
import * as fromActions from '@app/store/user/user.actions';
import * as fromSelectors from '@app/store/user/user.selectors';
import { GeneralService } from '@app/services/general.service';
import * as fromRoot from '@app/store';

@Component({
  selector: 'app-user-rol',
  templateUrl: './user-rol.component.html',
})
export class UserRolComponent implements OnInit {
  users$: Observable<UserResponse[] | null>;
  loading$: Observable<boolean | null>;
  searchTerm: string = '';
  filteredUsers: UserResponse[] = [];

  estadoEditadoExitoso: boolean = false;
  mensajeExito = '';

  idNegocioUser: string | undefined;

  constructor(
    private store: Store<fromRoot.State>,
    public GeneralService: GeneralService
  ) {
    this.users$ = this.store.select(fromSelectors.getUsers);
    this.loading$ = this.store.select(fromSelectors.getLoading);
  }

  ngOnInit() {
    this.store.dispatch(new fromActions.ListUsers());
    this.idNegocioUser = this.GeneralService.usuario$?.negocioId;

    this.users$.subscribe((users) => {
      if (users) {
        this.filteredUsers = users.filter(
          (user) => user.negocioId === this.idNegocioUser
        );
      }
    });
  }

  filterUsers(users: UserResponse[], term: string): UserResponse[] {
    term = term.toLowerCase();
    return users.filter((user) => {
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
      return false;
    });
  }

  updateFilteredUsers() {
    if (this.users$) {
      this.users$.subscribe((users) => {
        if (users) {
          this.filteredUsers = this.filterUsers(users, this.searchTerm);
        }
      });
    }
  }


}
