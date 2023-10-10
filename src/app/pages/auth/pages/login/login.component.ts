import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { from, Observable } from 'rxjs';
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
  loading$! : Observable<boolean | null>;
  negocios: { id: number; nombre: string }[] = []; // Arreglo con el ID y el nombre de los negocios

  constructor(
    private store: Store<fromRoot.State>,
    public NegocioService: NegocioService
  ) { }

  ngOnInit(): void {

  }


  loginUsuario(form: NgForm): void {
    const userLoginRequest: fromUser.EmailPasswordCredentials = {
      email: form.value.email,
      password: form.value.password
    };

    this.store.dispatch(new fromUser.SignInEmail(userLoginRequest));

    // Llama a NegocioService para cargar datos de negocio después del inicio de sesión
    this.NegocioService.cargarDatosDeNegocios().subscribe((negocios) => {
      this.negocios = negocios.map((negocio) => ({
        id: negocio.id,
        nombre: negocio.nombre
      }));
      console.log('Negocios cargados:', this.negocios);
    });
  }


}
