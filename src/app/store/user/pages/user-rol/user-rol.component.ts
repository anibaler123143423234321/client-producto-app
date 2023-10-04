import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserState } from '@app/store/user/user.reducer';
import * as UserActions from '@app/store/user/user.actions';
import { catchError, map } from 'rxjs/operators';
import { GeneralService } from '@app/services/general.service';

@Component({
  selector: 'app-user-rol',
  templateUrl: './user-rol.component.html',
})
export class UserRolComponent implements OnInit {
  userRoleForm: FormGroup;
  errorMessage: string | null;

  constructor(
    private fb: FormBuilder,
    private store: Store<UserState>,
    private generalService: GeneralService
  ) {
    this.userRoleForm = this.fb.group({
      username: ['', Validators.required],
      newRole: ['', Validators.required],
    });
    this.errorMessage = null;
  }

  ngOnInit(): void {}

  onChangeRole() {
    if (this.userRoleForm.valid) {
      const username = this.userRoleForm.value.username;
      const newRole = this.userRoleForm.value.newRole;

      this.store
        .select((state) => state.user)
        .pipe(
          catchError((error) => {
            this.errorMessage = error;
            return [];
          })
        )
        .subscribe((user) => {
          if (user) {
            // Aquí puedes usar user de manera segura, ya que TypeScript sabe que user no es nulo
            this.store.dispatch(UserActions.changeUserRole({ username, newRole }));
          } else {
            // Manejar el caso en que user sea nulo
            this.errorMessage = 'No se pudo obtener la información del usuario.';
          }
        });
    }
  }
}
