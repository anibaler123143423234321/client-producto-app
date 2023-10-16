import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as fromRoot from '@app/store';
import * as fromUser from '@app/store/user';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NegocioService } from '@app/services/NegocioService';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  loading$! : Observable<boolean | null>;
  negocios: { id: number; nombre: string }[] = [];
  selectedNegocioId: number | undefined;
  photoLoaded!: string;

  constructor(
    private store: Store<fromRoot.State>,
    private negocioService: NegocioService

  ) { }

ngOnInit(): void {
  this.negocioService.cargarDatosDeNegocios().subscribe((negocios) => {
    this.negocios = negocios.map((negocio) => ({
      id: negocio.id,
      nombre: negocio.nombre
    }));
    console.log('Negocios cargados:', this.negocios);

    // Inicializar selectedNegocioId con el primer negocio de la lista
    if (this.negocios.length > 0) {
      this.selectedNegocioId = this.negocios[0].id;
    }
  });

  this.loading$ = this.store.pipe(select(fromUser.getLoading));
}


  registrarUsuario(form: NgForm) {

    if(form.valid) {
        const userCreateRequest : fromUser.UserCreateRequest =  {
          nombre: form.value.nombre,
          apellido: form.value.apellidos,
          telefono: form.value.telefono,
          username: form.value.username,
          email: form.value.email,
          password: form.value.password,
          negocioId: this.selectedNegocioId?.toString(), // Convertir a cadena
          dni: form.value.dni,
          tipoDoc : form.value.tipoDoc,
          departamento: form.value.departamento,
          provincia: form.value.provincia,
          distrito: form.value.distrito,
        }

        this.store.dispatch(new fromUser.SignUpEmail(userCreateRequest));
    }

  }

  onFilesChanged(url: any): void {
    if (url) {
      this.photoLoaded = url;
    }
  }

}
