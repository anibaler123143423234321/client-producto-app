import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import * as fromRoot from '@app/store';
import * as fromUser from '@app/store/user';
import { Store } from '@ngrx/store';

import { NegocioService } from '@app/services/NegocioService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading$!: Observable<boolean | null>;
  negocios: { id: number; nombre: string }[] = [];

  constructor(
    private store: Store<fromRoot.State>,
    public NegocioService: NegocioService
  ) {}

  ngOnInit(): void {
    // Esta sería la forma de limpiar el localStorage al inicio del componente
    localStorage.clear();
  }

  loginUsuario(form: NgForm): void {
    const userLoginRequest: fromUser.EmailPasswordCredentials = {
      email: form.value.email,
      password: form.value.password
    };

    this.store.dispatch(new fromUser.SignInEmail(userLoginRequest));

    this.NegocioService.cargarDatosDeNegocios().subscribe((negocios) => {
      this.negocios = negocios.map((negocio) => ({
        id: negocio.id,
        nombre: negocio.nombre
      }));
      // Recargar la página después de iniciar sesión
      window.location.reload();
    });
  }
}
